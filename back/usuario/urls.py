from django.urls import path
from . import views

urlpatterns = [
    path('api/usuarios/', views.listar_usuarios, name='listar_usuarios'),
    path('api/login/', views.fazer_login, name='fazer_login'),
    path('api/cadastro/', views.cadastrar_usuario, name='cadastrar_usuario'),
    path('api/recuperar-senha/', views.reset_senha, name='recuperar_senha'),
    path('api/usuario/<str:uid>', views.get_usuario, name='get_usuario'),
]