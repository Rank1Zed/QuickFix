import json
import os
import uuid
from datetime import datetime

from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .chat_service import create_escalation, generate_bot_reply, learn_from_escalation
from .models import ChatEscalation, ChatMessage, ChatSession, Client, KnowledgeEntry, Professional, ServiceOrder
from .validators import parse_birth_date, validate_email, validate_professional_payload


def read_json(request):
    if not request.body:
        return {}
    try:
        return json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return None


def json_error(message, status=400):
    return JsonResponse({"error": message}, status=status)


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


def professional_payload(professional):
    return {
        "id": professional.id,
        "nomeCompleto": professional.full_name,
        "email": professional.email,
        "telefone": professional.phone,
        "cpf": professional.document,
        "dataNascimento": professional.birth_date.isoformat() if professional.birth_date else "",
        "registro": professional.registration,
        "curriculo": professional.resume_name,
        "status": professional.status,
        "rejectionReason": professional.rejection_reason,
        "reviewedAt": professional.reviewed_at.isoformat() if professional.reviewed_at else "",
    }


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
    professional = Professional.objects.filter(email=data.get("email", "").strip().lower()).first()
    if not professional:
        return json_error("Profissional nao encontrado.", 404)
    if professional.status != "aprovado":
        return json_error("Cadastro ainda em analise ou reprovado.", 403)
    return JsonResponse(professional_payload(professional))


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def professional_register(request):
    data = read_json(request)
    if data is None:
        return json_error("JSON invalido.")
    errors = validate_professional_payload(data)
    if errors:
        return JsonResponse({"errors": errors}, status=400)
    professional, created = Professional.objects.update_or_create(
        email=data["email"].strip().lower(),
        defaults={
            "full_name": data.get("nomeCompleto", "").strip(),
            "phone": data.get("telefone", "").strip(),
            "document": data.get("cpf", ""),
            "birth_date": parse_birth_date(data.get("dataNascimento", "")),
            "resume_name": data.get("curriculo", ""),
            "status": "pendente",
            "rejection_reason": "",
            "reviewed_at": None,
        },
    )
    if not created and professional.status == "reprovado":
        professional.status = "pendente"
        professional.rejection_reason = ""
        professional.save()
    return JsonResponse(professional_payload(professional), status=201)


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
        return JsonResponse({"professionals": [professional_payload(p) for p in qs]})
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
    return JsonResponse(professional_payload(professional))


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
        type=data.get("type", "Hardware"),
        status=data.get("status", "analise"),
        priority=data.get("priority", "media"),
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
