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


def validate_password(senha: str) -> str | None:
    if not senha or len(senha) < 8:
        return "Senha deve ter no minimo 8 caracteres."
    return None


ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MAX_FILE_BYTES = 5 * 1024 * 1024


def validate_uploaded_image(uploaded_file) -> str | None:
    if uploaded_file.size > MAX_FILE_BYTES:
        return "Imagem deve ter no maximo 5 MB."
    if uploaded_file.content_type not in ALLOWED_IMAGE_TYPES:
        return "Use imagens JPG, PNG ou WebP."
    return None


def validate_uploaded_pdf(uploaded_file) -> str | None:
    if uploaded_file.size > MAX_FILE_BYTES:
        return "PDF deve ter no maximo 5 MB."
    if uploaded_file.content_type != "application/pdf":
        return "Curriculo deve ser PDF."
    return None


def validate_professional_payload(data: dict, require_password: bool = False) -> list[str]:
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
    if require_password:
        pwd_err = validate_password(data.get("senha", ""))
        if pwd_err:
            errors.append(pwd_err)
    return errors
