import re
from datetime import date


EMAIL_RE = re.compile(r"^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$", re.I)


def only_digits(value: str) -> str:
    return re.sub(r"\D", "", value or "")


def validate_email(email: str) -> str | None:
    if not email or not EMAIL_RE.match(email.strip()):
        return "E-mail invalido."
    return None


def validate_cpf(cpf: str) -> str | None:
    digits = only_digits(cpf)
    if len(digits) != 11 or re.fullmatch(r"(\d)\1{10}", digits):
        return "CPF invalido."
    base = [int(d) for d in digits[:9]]
    d1 = sum(base[i] * (10 - i) for i in range(9)) % 11
    d1 = 0 if d1 < 2 else 11 - d1
    base.append(d1)
    d2 = sum(base[i] * (11 - i) for i in range(10)) % 11
    d2 = 0 if d2 < 2 else 11 - d2
    if d1 != int(digits[9]) or d2 != int(digits[10]):
        return "CPF invalido."
    return None


def parse_birth_date(value: str) -> date | None:
    if not value:
        return None
    try:
        return date.fromisoformat(str(value)[:10])
    except ValueError:
        return None


def validate_professional_payload(data: dict) -> list[str]:
    errors = []
    if not (data.get("nomeCompleto") or "").strip():
        errors.append("Nome completo obrigatorio.")
    if validate_email(data.get("email", "")):
        errors.append("E-mail invalido.")
    if not (data.get("telefone") or "").strip():
        errors.append("Telefone obrigatorio.")
    cpf_err = validate_cpf(data.get("cpf", ""))
    if cpf_err:
        errors.append(cpf_err)
    return errors
