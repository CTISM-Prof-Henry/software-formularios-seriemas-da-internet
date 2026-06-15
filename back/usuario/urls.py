from django.urls import path
from . import views

urlpatterns = [
    path('api/usuarios/', views.listar_usuarios, name='listar_usuarios'),
    path('api/login/', views.fazer_login, name='fazer_login'),
    path('api/usuario/', views.cadastrar_usuario, name='cadastrar_usuario'),
    path('api/recuperar-senha/', views.reset_senha, name='recuperar_senha'),
    path('api/usuario/perfil/<str:uid>/', views.get_usuario, name='get_usuario'),
    path('api/usuario/id/<int:pk>/', views.get_usuario_by_id, name='get_usuario_by_id'),
    path('api/usuarios/buscar/', views.buscar_usuarios_by_name, name='buscar_usuarios'),
]