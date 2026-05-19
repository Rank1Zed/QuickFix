from django.urls import path

from . import views

urlpatterns = [
    path("health/", views.health),
    path("clients/", views.client_login_or_create),
    path("clients/register/", views.client_register),
    path("professionals/", views.professional_login_or_create),
    path("professionals/register/", views.professional_register),
    path("orders/", views.orders),
    path("orders/<int:order_id>/", views.order_detail),
]
