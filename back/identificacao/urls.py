from django.urls import path
from . import views


urlpatterns = [
    path("api/identificacoes/", views.get_identificacoes, name="get_identificacoes"),
]