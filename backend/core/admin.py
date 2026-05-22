from django.contrib import admin

from .models import ChatEscalation, ChatMessage, ChatSession, Client, KnowledgeEntry, Professional, ServiceOrder


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "phone", "company", "created_at")
    search_fields = ("full_name", "email", "phone")


@admin.register(Professional)
class ProfessionalAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "phone", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("full_name", "email", "phone", "registration")


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ("session_key", "user_email", "created_at")


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ("session", "role", "needs_escalation", "created_at")


@admin.register(ChatEscalation)
class ChatEscalationAdmin(admin.ModelAdmin):
    list_display = ("session", "status", "created_at", "resolved_at")


@admin.register(KnowledgeEntry)
class KnowledgeEntryAdmin(admin.ModelAdmin):
    list_display = ("question", "use_count", "created_at")


@admin.register(ServiceOrder)
class ServiceOrderAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "type", "status", "priority", "professional", "created_at")
    list_filter = ("status", "priority", "type")
    search_fields = ("title", "professional", "client__full_name", "client__email")
