import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Client, Professional, ServiceOrder


def read_json(request):
    if not request.body:
        return {}
    return json.loads(request.body.decode("utf-8"))


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
        "registro": professional.registration,
        "curriculo": professional.resume_name,
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


def health(_request):
    return JsonResponse({"ok": True, "name": "Quick Fix API"})


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def client_login_or_create(request):
    data = read_json(request)
    client, _ = Client.objects.update_or_create(
        email=data["email"],
        defaults={
            "full_name": data.get("nomeCompleto", ""),
            "phone": data.get("telefone", ""),
            "company": data.get("empresa", ""),
            "document": data.get("cnpj") or data.get("cpf", ""),
        },
    )
    return JsonResponse(client_payload(client), status=201)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def client_register(request):
    data = read_json(request)
    client, _ = Client.objects.update_or_create(
        email=data["email"],
        defaults={
            "full_name": data.get("nomeCompleto", ""),
            "phone": data.get("telefone", ""),
            "document": data.get("cpf", ""),
            "birth_date": data.get("dataNascimento") or None,
            "address": data.get("endereco", ""),
        },
    )
    return JsonResponse(client_payload(client), status=201)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def professional_login_or_create(request):
    data = read_json(request)
    professional, _ = Professional.objects.update_or_create(
        email=data["email"],
        defaults={
            "full_name": data.get("nomeCompleto", ""),
            "phone": data.get("telefone", ""),
            "registration": data.get("registro", ""),
        },
    )
    return JsonResponse(professional_payload(professional), status=201)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def professional_register(request):
    data = read_json(request)
    professional, _ = Professional.objects.update_or_create(
        email=data["email"],
        defaults={
            "full_name": data.get("nomeCompleto", ""),
            "phone": data.get("telefone", ""),
            "document": data.get("cpf", ""),
            "resume_name": data.get("curriculo", ""),
        },
    )
    return JsonResponse(professional_payload(professional), status=201)


@csrf_exempt
@require_http_methods(["GET", "POST", "OPTIONS"])
def orders(request):
    if request.method == "GET":
        return JsonResponse({"orders": [order_payload(order) for order in ServiceOrder.objects.all()]})

    data = read_json(request)
    result = data.get("questionnaireData", data)
    client_data = data.get("client")
    client = None

    if client_data and client_data.get("email"):
        client, _ = Client.objects.update_or_create(
            email=client_data["email"],
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
    order = ServiceOrder.objects.get(pk=order_id)

    if request.method == "GET":
        return JsonResponse(order_payload(order))

    data = read_json(request)
    if "status" in data:
        order.status = data["status"]
    if "professional" in data:
        order.professional = data["professional"]
    order.save()
    return JsonResponse(order_payload(order))
