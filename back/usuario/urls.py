from django.urls import path
from . import views

urlpatterns = [
    path('api/usuarios/', views.listar_usuarios, name='listar_usuarios'),
    path('api/login/', views.fazer_login, name='fazer_login'),
]