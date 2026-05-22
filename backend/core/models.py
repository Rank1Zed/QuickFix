from django.db import models


class Client(models.Model):
    full_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30)
    company = models.CharField(max_length=200, blank=True)
    document = models.CharField(max_length=30, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    address = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name


class Professional(models.Model):
    STATUS_CHOICES = [
        ("pendente", "Pendente"),
        ("aprovado", "Aprovado"),
        ("reprovado", "Reprovado"),
    ]

    full_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30)
    document = models.CharField(max_length=30, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    registration = models.CharField(max_length=80, blank=True)
    resume_name = models.CharField(max_length=255, blank=True)
    resume_file = models.FileField(upload_to="professionals/resumes/%Y/%m/", blank=True, null=True)
    password_hash = models.CharField(max_length=128, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pendente")
    rejection_reason = models.TextField(blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name


class ProfessionalDocument(models.Model):
    DOC_DIPLOMA = "diploma"
    DOC_CHOICES = [(DOC_DIPLOMA, "Diploma")]

    professional = models.ForeignKey(Professional, on_delete=models.CASCADE, related_name="documents")
    doc_type = models.CharField(max_length=20, choices=DOC_CHOICES, default=DOC_DIPLOMA)
    file = models.FileField(upload_to="professionals/diplomas/%Y/%m/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["uploaded_at"]


class ServiceOrder(models.Model):
    STATUS_CHOICES = [
        ("analise", "Em analise"),
        ("em_andamento", "Em andamento"),
        ("concluido", "Concluido"),
    ]
    PRIORITY_CHOICES = [
        ("baixa", "Baixa"),
        ("media", "Media"),
        ("alta", "Alta"),
        ("urgente", "Urgente"),
    ]

    client = models.ForeignKey(Client, null=True, blank=True, on_delete=models.SET_NULL, related_name="orders")
    title = models.CharField(max_length=200)
    service_type = models.CharField(max_length=40)
    type = models.CharField(max_length=40)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="analise")
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default="media")
    professional = models.CharField(max_length=200, default="Aguardando atribuicao")
    estimated_time = models.CharField(max_length=60)
    description = models.TextField(blank=True)
    total_score = models.FloatField(default=0)
    average_score = models.FloatField(default=0)
    answers_count = models.PositiveIntegerField(default=0)
    answers = models.JSONField(default=dict)
    questionnaire_data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"#{self.pk} {self.title}"


class ChatSession(models.Model):
    session_key = models.CharField(max_length=64, unique=True)
    user_email = models.EmailField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.session_key


class ChatMessage(models.Model):
    ROLE_CHOICES = [
        ("user", "Usuario"),
        ("bot", "Bot"),
        ("admin", "Admin"),
    ]
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name="messages")
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    needs_escalation = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]


class ChatEscalation(models.Model):
    STATUS_CHOICES = [
        ("aberta", "Aberta"),
        ("resolvida", "Resolvida"),
    ]
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name="escalations")
    user_question = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="aberta")
    admin_reply = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]


class KnowledgeEntry(models.Model):
    question = models.TextField()
    answer = models.TextField()
    escalation = models.ForeignKey(ChatEscalation, null=True, blank=True, on_delete=models.SET_NULL)
    use_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
