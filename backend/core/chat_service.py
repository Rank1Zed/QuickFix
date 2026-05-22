import json
import os
import re
import urllib.error
import urllib.request
from difflib import SequenceMatcher

from .models import ChatEscalation, ChatMessage, ChatSession, KnowledgeEntry

SYSTEM_PROMPT = """Voce e o assistente virtual da Quick Fix em Manaus (DDD 92).
Responda em portugues, de forma clara e objetiva, sobre:
- cadastro de clientes e profissionais
- pedidos de servico (hardware, redes, manutencao)
- prazos e status de ordens
- contato: (92) 99999-9999
Se nao souber com certeza, diga que vai encaminhar para um atendente humano."""


def _similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def find_knowledge_answer(question: str) -> tuple[str | None, float]:
    best_score = 0.0
    best_answer = None
    for entry in KnowledgeEntry.objects.all()[:200]:
        score = max(_similarity(question, entry.question), _similarity(question, entry.answer) * 0.6)
        if score > best_score:
            best_score = score
            best_answer = entry.answer
    if best_score >= 0.55 and best_answer:
        return best_answer, best_score
    return None, best_score


def _call_openai(messages: list[dict]) -> str | None:
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key:
        return None
    base_url = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
    payload = json.dumps({"model": model, "messages": messages, "temperature": 0.4, "max_tokens": 500}).encode()
    req = urllib.request.Request(
        f"{base_url}/chat/completions",
        data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            data = json.loads(resp.read().decode())
        return data["choices"][0]["message"]["content"].strip()
    except (urllib.error.URLError, KeyError, IndexError, json.JSONDecodeError):
        return None


def _fallback_answer(question: str) -> tuple[str, bool]:
    kb, score = find_knowledge_answer(question)
    if kb:
        return kb, False
    q = question.lower()
    if any(w in q for w in ("cadastr", "registr", "profissional")):
        return (
            "Para se cadastrar como profissional, acesse Cadastro de Profissional, preencha CPF, "
            "telefone com DDD 92 e envie o curriculo em PDF. A equipe analisa em ate 48h.",
            False,
        )
    if any(w in q for w in ("pedido", "ordem", "servico", "orcamento")):
        return (
            "Faca um pedido pela pagina inicial escolhendo o tipo de servico e respondendo o questionario. "
            "Voce acompanha o status no painel de pedidos.",
            False,
        )
    if any(w in q for w in ("humano", "atendente", "pessoa", "falar")):
        return "Vou encaminhar sua mensagem para nossa equipe.", True
    return (
        "Nao tenho certeza dessa resposta. Vou encaminhar para um atendente que respondera em breve.",
        True,
    )


def get_session_history(session: ChatSession, limit: int = 12) -> list[dict]:
    msgs = session.messages.order_by("-created_at")[:limit]
    history = []
    for m in reversed(list(msgs)):
        role = "assistant" if m.role in ("bot", "admin") else "user"
        history.append({"role": role, "content": m.content})
    return history


def generate_bot_reply(session: ChatSession, user_text: str) -> tuple[str, bool]:
    kb, _ = find_knowledge_answer(user_text)
    if kb:
        entry = KnowledgeEntry.objects.filter(answer=kb).first()
        if entry:
            entry.use_count += 1
            entry.save(update_fields=["use_count"])
        return kb, False

    history = get_session_history(session)
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for h in history[-8:]:
        messages.append(h)
    messages.append({"role": "user", "content": user_text})

    ai = _call_openai(messages)
    if ai:
        escalate = any(p in ai.lower() for p in ("nao tenho certeza", "encaminhar", "atendente humano"))
        return ai, escalate

    return _fallback_answer(user_text)


def create_escalation(session: ChatSession, question: str) -> ChatEscalation:
    return ChatEscalation.objects.create(session=session, user_question=question)


def learn_from_escalation(escalation: ChatEscalation, admin_reply: str) -> KnowledgeEntry:
    entry, _ = KnowledgeEntry.objects.get_or_create(
        question=escalation.user_question.strip(),
        defaults={"answer": admin_reply.strip(), "escalation": escalation},
    )
    if entry.answer != admin_reply.strip():
        entry.answer = admin_reply.strip()
        entry.escalation = escalation
        entry.save()
    return entry
