import json
import os
import uuid

from django.contrib.auth.hashers import check_password, make_password
from django.db import transaction
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .chat_service import create_escalation, generate_bot_reply, learn_from_escalation
from .models import (
    ChatEscalation,
    ChatMessage,
    ChatSession,
    Client,
    KnowledgeEntry,
    Professional,
    ProfessionalDocument,
    ServiceOrder,
)
from .validators import (
    only_digits,
    parse_birth_date,
    validate_email,
    validate_professional_payload,
    validate_uploaded_image,
    validate_uploaded_pdf,
)


def read_json(request):
    if not request.body:
        return {}
    try:
        return json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return None


def json_error(message, status=400):
    return JsonResponse({"error": message}, status=status)


def choice_values(choices):
    return {value for value, _label in choices}


def check_admin(request):
    token = request.headers.get("X-Admin-Token", "")
    expected = os.environ.get("ADMIN_API_TOKEN", "quickfix-admin-dev")
    return token == expected


def client_payload(client):
    return {
        "id": client.id,
        "nomeCompleto": client.full_name,
        "email": client.email,
        "telefone": client.phone,
        "empresa": client.company,
        "cnpj": client.document,
        "cpf": client.document,
        "dataNascimento": client.birth_date.isoformat() if client.birth_date else "",
        "endereco": client.address,
    }


def format_cpf_display(document: str) -> str:
    digits = only_digits(document)
    if len(digits) != 11:
        return document
    return f"{digits[:3]}.{digits[3:6]}.{digits[6:9]}-{digits[9:]}"


def file_absolute_url(request, file_field) -> str:
    if not file_field:
        return ""
    try:
        url = file_field.url
    except ValueError:
        return ""
    if request:
        return request.build_absolute_uri(url)
    return url


def professional_payload(professional, request=None):
    diplomas = [
        {
            "id": doc.id,
            "name": doc.file.name.split("/")[-1],
            "url": file_absolute_url(request, doc.file),
        }
        for doc in professional.documents.filter(doc_type=ProfessionalDocument.DOC_DIPLOMA)
    ]
    return {
        "id": professional.id,
        "nomeCompleto": professional.full_name,
        "email": professional.email,
        "telefone": professional.phone,
        "cpf": format_cpf_display(professional.document),
        "dataNascimento": professional.birth_date.isoformat() if professional.birth_date else "",
        "registro": professional.registration,
        "curriculo": professional.resume_name,
        "resumeUrl": file_absolute_url(request, professional.resume_file),
        "diplomas": diplomas,
        "status": professional.status,
        "rejectionReason": professional.rejection_reason,
        "reviewedAt": professional.reviewed_at.isoformat() if professional.reviewed_at else "",
        "createdAt": professional.created_at.isoformat(),
    }


def parse_register_data(request) -> dict | None:
    content_type = request.content_type or ""
    if "multipart/form-data" in content_type:
        return {key: request.POST.get(key, "") for key in request.POST}
    return read_json(request)


def save_professional_files(professional, request, errors: list[str]) -> list[str]:
    resume = request.FILES.get("curriculo")
    if resume:
        pdf_err = validate_uploaded_pdf(resume)
        if pdf_err:
            errors.append(pdf_err)
        else:
            professional.resume_file = resume
            professional.resume_name = resume.name
            professional.save(update_fields=["resume_file", "resume_name"])

    diplomas = request.FILES.getlist("diplomas")
    if diplomas:
        professional.documents.filter(doc_type=ProfessionalDocument.DOC_DIPLOMA).delete()
        for diploma in diplomas[:6]:
            img_err = validate_uploaded_image(diploma)
            if img_err:
                errors.append(img_err)
                continue
            ProfessionalDocument.objects.create(
                professional=professional,
                doc_type=ProfessionalDocument.DOC_DIPLOMA,
                file=diploma,
            )
    return errors


def validate_professional_files(request) -> list[str]:
    errors = []
    resume = request.FILES.get("curriculo")
    if not resume:
        errors.append("Curriculo em PDF obrigatorio.")
    else:
        pdf_err = validate_uploaded_pdf(resume)
        if pdf_err:
            errors.append(pdf_err)

    diplomas = request.FILES.getlist("diplomas")
    if len(diplomas) > 6:
        errors.append("Envie no maximo 6 imagens de diploma.")
    for diploma in diplomas[:6]:
        img_err = validate_uploaded_image(diploma)
        if img_err:
            errors.append(img_err)
    return errors


def order_payload(order):
    result = dict(order.questionnaire_data or {})
    result.setdefault("serviceType", order.service_type)
    result.setdefault("serviceName", order.title)
    result.setdefault("answers", order.answers)
    result.setdefault("description", order.description)
    result.setdefault("totalScore", order.total_score)
    result.setdefault("averageScore", order.average_score)
    result.setdefault("answersCount", order.answers_count)
    result.setdefault("timestamp", order.created_at.isoformat())

    return {
        "id": order.id,
        "title": order.title,
        "type": order.type,
        "status": order.status,
        "priority": order.priority,
        "professional": order.professional,
        "estimatedTime": order.estimated_time,
        "createdAt": order.created_at.isoformat(),
        "questionnaireData": result,
        "client": client_payload(order.client) if order.client else None,
    }


def escalation_payload(esc):
    return {
        "id": esc.id,
        "sessionKey": esc.session.session_key,
        "userQuestion": esc.user_question,
        "status": esc.status,
        "adminReply": esc.admin_reply,
        "createdAt": esc.created_at.isoformat(),
        "resolvedAt": esc.resolved_at.isoformat() if esc.resolved_at else "",
    }


def health(_request):
    return JsonResponse({"ok": True, "name": "Quick Fix API"})


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def client_login_or_create(request):
    data = read_json(request)
    if data is None:
        return json_error("JSON invalido.")
    if validate_email(data.get("email", "")):
        return json_error("E-mail invalido.")
    client, _ = Client.objects.update_or_create(
        email=data["email"].strip().lower(),
        defaults={
            "full_name": data.get("nomeCompleto", "").strip(),
            "phone": data.get("telefone", "").strip(),
            "company": data.get("empresa", ""),
            "document": data.get("cnpj") or data.get("cpf", ""),
        },
    )
    return JsonResponse(client_payload(client), status=201)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def client_register(request):
    data = read_json(request)
    if data is None:
        return json_error("JSON invalido.")
    if validate_email(data.get("email", "")):
        return json_error("E-mail invalido.")
    client, _ = Client.objects.update_or_create(
        email=data["email"].strip().lower(),
        defaults={
            "full_name": data.get("nomeCompleto", "").strip(),
            "phone": data.get("telefone", "").strip(),
            "document": data.get("cpf", ""),
            "birth_date": parse_birth_date(data.get("dataNascimento", "")),
            "address": data.get("endereco", ""),
        },
    )
    return JsonResponse(client_payload(client), status=201)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def professional_login_or_create(request):
    data = read_json(request)
    if data is None:
        return json_error("JSON invalido.")
    email = (data.get("email") or "").strip().lower()
    senha = data.get("senha") or ""
    if not email:
        return json_error("E-mail obrigatorio.")
    if not senha:
        return json_error("Senha obrigatoria.")
    professional = Professional.objects.filter(email=email).first()
    if not professional:
        return json_error("Profissional nao encontrado.", 404)
    if professional.status != "aprovado":
        return json_error("Cadastro ainda em analise ou reprovado.", 403)
    if not professional.password_hash:
        return json_error("Senha nao configurada. Refaca o cadastro.", 400)
    if not check_password(senha, professional.password_hash):
        return json_error("Senha incorreta.", 401)
    return JsonResponse(professional_payload(professional, request))


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def professional_register(request):
    data = parse_register_data(request)
    if data is None:
        return json_error("Dados invalidos.")
    errors = validate_professional_payload(data, require_password=True)
    if "multipart/form-data" in (request.content_type or ""):
        errors.extend(validate_professional_files(request))
    if errors:
        return JsonResponse({"errors": errors, "error": errors[0]}, status=400)
    try:
        with transaction.atomic():
            professional, created = Professional.objects.update_or_create(
                email=data["email"].strip().lower(),
                defaults={
                    "full_name": data.get("nomeCompleto", "").strip(),
                    "phone": data.get("telefone", "").strip(),
                    "document": only_digits(data.get("cpf", "")),
                    "birth_date": parse_birth_date(data.get("dataNascimento", "")),
                    "resume_name": "",
                    "password_hash": make_password(data.get("senha", "")),
                    "status": "pendente",
                    "rejection_reason": "",
                    "reviewed_at": None,
                },
            )
            if not created and professional.status == "reprovado":
                professional.status = "pendente"
                professional.rejection_reason = ""
                professional.save(update_fields=["status", "rejection_reason"])
            file_errors = save_professional_files(professional, request, [])
            if file_errors:
                return JsonResponse({"errors": file_errors, "error": file_errors[0]}, status=400)
    except OSError:
        return json_error("Falha ao salvar arquivos enviados. Verifique DJANGO_MEDIA_ROOT/storage do backend.", 500)
    return JsonResponse(professional_payload(professional, request), status=201)


@csrf_exempt
@require_http_methods(["GET", "PATCH", "OPTIONS"])
def professionals_admin(request):
    if not check_admin(request):
        return json_error("Nao autorizado.", 401)
    if request.method == "GET":
        status = request.GET.get("status", "")
        qs = Professional.objects.all().order_by("-created_at")
        if status:
            qs = qs.filter(status=status)
        return JsonResponse({"professionals": [professional_payload(p, request) for p in qs]})
    data = read_json(request)
    if data is None:
        return json_error("JSON invalido.")
    prof_id = data.get("id")
    new_status = data.get("status")
    if not prof_id or new_status not in ("aprovado", "reprovado", "pendente"):
        return json_error("Dados invalidos.")
    try:
        professional = Professional.objects.get(pk=prof_id)
    except Professional.DoesNotExist:
        return json_error("Profissional nao encontrado.", 404)
    professional.status = new_status
    professional.rejection_reason = data.get("rejectionReason", "")
    professional.reviewed_at = timezone.now()
    professional.save()
    return JsonResponse(professional_payload(professional, request))


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def professional_detail_admin(request, professional_id):
    if not check_admin(request):
        return json_error("Nao autorizado.", 401)
    try:
        professional = Professional.objects.prefetch_related("documents").get(pk=professional_id)
    except Professional.DoesNotExist:
        return json_error("Profissional nao encontrado.", 404)
    return JsonResponse(professional_payload(professional, request))


@csrf_exempt
@require_http_methods(["GET", "POST", "OPTIONS"])
def orders(request):
    if request.method == "GET":
        return JsonResponse({"orders": [order_payload(order) for order in ServiceOrder.objects.all()]})

    data = read_json(request)
    if data is None:
        return json_error("JSON invalido.")
    result = data.get("questionnaireData", data)
    client_data = data.get("client")
    client = None
    order_type = data.get("type", "Hardware")
    status = data.get("status", "analise")
    priority = data.get("priority", "media")

    if order_type not in {"Hardware", "Redes"}:
        return json_error("Tipo de pedido invalido.")
    if status not in choice_values(ServiceOrder.STATUS_CHOICES):
        return json_error("Status de pedido invalido.")
    if priority not in choice_values(ServiceOrder.PRIORITY_CHOICES):
        return json_error("Prioridade de pedido invalida.")

    if client_data and client_data.get("email"):
        client, _ = Client.objects.update_or_create(
            email=client_data["email"].strip().lower(),
            defaults={
                "full_name": client_data.get("nomeCompleto", ""),
                "phone": client_data.get("telefone", ""),
                "company": client_data.get("empresa", ""),
                "document": client_data.get("cnpj") or client_data.get("cpf", ""),
            },
        )

    order = ServiceOrder.objects.create(
        client=client,
        title=data.get("title") or result.get("serviceName", "Servico Quick Fix"),
        service_type=result.get("serviceType", ""),
        type=order_type,
        status=status,
        priority=priority,
        professional=data.get("professional", "Aguardando atribuicao"),
        estimated_time=data.get("estimatedTime", ""),
        description=result.get("description", ""),
        total_score=result.get("totalScore", 0),
        average_score=result.get("averageScore", 0),
        answers_count=result.get("answersCount", 0),
        answers=result.get("answers", {}),
        questionnaire_data=result,
    )
    return JsonResponse(order_payload(order), status=201)


@csrf_exempt
@require_http_methods(["GET", "PATCH", "OPTIONS"])
def order_detail(request, order_id):
    try:
        order = ServiceOrder.objects.get(pk=order_id)
    except ServiceOrder.DoesNotExist:
        return json_error("Pedido nao encontrado.", 404)

    if request.method == "GET":
        return JsonResponse(order_payload(order))

    data = read_json(request)
    if data is None:
        return json_error("JSON invalido.")
    if "status" in data:
        if data["status"] not in choice_values(ServiceOrder.STATUS_CHOICES):
            return json_error("Status de pedido invalido.")
        order.status = data["status"]
    if "professional" in data:
        order.professional = data["professional"]
    order.save()
    return JsonResponse(order_payload(order))


def _get_or_create_session(session_key: str, user_email: str = "") -> ChatSession:
    key = session_key or str(uuid.uuid4())
    session, _ = ChatSession.objects.get_or_create(session_key=key, defaults={"user_email": user_email})
    if user_email and not session.user_email:
        session.user_email = user_email
        session.save(update_fields=["user_email"])
    return session


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def chat_session_create(request):
    data = read_json(request) or {}
    session = _get_or_create_session(data.get("sessionKey", ""), data.get("userEmail", ""))
    return JsonResponse({"sessionKey": session.session_key})


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def chat_message(request):
    data = read_json(request)
    if data is None:
        return json_error("JSON invalido.")
    text = (data.get("message") or "").strip()
    if not text or len(text) > 2000:
        return json_error("Mensagem invalida.")
    session = _get_or_create_session(data.get("sessionKey", ""), data.get("userEmail", ""))
    ChatMessage.objects.create(session=session, role="user", content=text)
    reply, escalate = generate_bot_reply(session, text)
    ChatMessage.objects.create(session=session, role="bot", content=reply, needs_escalation=escalate)
    escalation_id = None
    if escalate:
        esc = create_escalation(session, text)
        escalation_id = esc.id
    return JsonResponse({
        "sessionKey": session.session_key,
        "reply": reply,
        "needsEscalation": escalate,
        "escalationId": escalation_id,
    })


@csrf_exempt
@require_http_methods(["GET", "PATCH", "OPTIONS"])
def chat_escalations(request):
    if request.method == "GET":
        if not check_admin(request):
            return json_error("Nao autorizado.", 401)
        status = request.GET.get("status", "aberta")
        qs = ChatEscalation.objects.select_related("session").all()
        if status:
            qs = qs.filter(status=status)
        return JsonResponse({"escalations": [escalation_payload(e) for e in qs[:100]]})

    if not check_admin(request):
        return json_error("Nao autorizado.", 401)
    data = read_json(request)
    if data is None:
        return json_error("JSON invalido.")
    try:
        esc = ChatEscalation.objects.select_related("session").get(pk=data.get("id"))
    except ChatEscalation.DoesNotExist:
        return json_error("Escalacao nao encontrada.", 404)
    reply = (data.get("adminReply") or "").strip()
    if not reply:
        return json_error("Resposta obrigatoria.")
    esc.admin_reply = reply
    esc.status = "resolvida"
    esc.resolved_at = timezone.now()
    esc.save()
    learn_from_escalation(esc, reply)
    ChatMessage.objects.create(session=esc.session, role="admin", content=reply)
    return JsonResponse(escalation_payload(esc))


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def chat_knowledge(request):
    if not check_admin(request):
        return json_error("Nao autorizado.", 401)
    entries = [
        {"id": e.id, "question": e.question, "answer": e.answer, "useCount": e.use_count}
        for e in KnowledgeEntry.objects.all()[:50]
    ]
    return JsonResponse({"entries": entries})
