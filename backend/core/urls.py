from django.urls import path

from . import views

urlpatterns = [
    path("health/", views.health),
    path("clients/", views.client_login_or_create),
    path("clients/register/", views.client_register),
    path("professionals/", views.professional_login_or_create),
    path("professionals/register/", views.professional_register),
    path("admin/professionals/", views.professionals_admin),
    path("orders/", views.orders),
    path("orders/<int:order_id>/", views.order_detail),
    path("chat/sessions/", views.chat_session_create),
    path("chat/messages/", views.chat_message),
    path("chat/escalations/", views.chat_escalations),
    path("chat/knowledge/", views.chat_knowledge),
]
