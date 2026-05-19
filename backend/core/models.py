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
    full_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30)
    document = models.CharField(max_length=30, blank=True)
    registration = models.CharField(max_length=80, blank=True)
    resume_name = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name


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
