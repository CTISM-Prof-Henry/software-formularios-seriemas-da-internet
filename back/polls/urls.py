
from django.urls import path, include
from . import views


urlpatterns = [
    path("api/teste/", views.teste_api_react, name="teste_api_react")
]