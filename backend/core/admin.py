from django.contrib import admin

from .models import Client, Professional, ServiceOrder


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "phone", "company", "created_at")
    search_fields = ("full_name", "email", "phone")


@admin.register(Professional)
class ProfessionalAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "phone", "registration", "created_at")
    search_fields = ("full_name", "email", "phone", "registration")


@admin.register(ServiceOrder)
class ServiceOrderAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "type", "status", "priority", "professional", "created_at")
    list_filter = ("status", "priority", "type")
    search_fields = ("title", "professional", "client__full_name", "client__email")
