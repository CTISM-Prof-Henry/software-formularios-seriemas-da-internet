from django.urls import path
from . import views

urlpatterns = [
    path('api/formularios/', views.listar_formularios, name='listar_formularios'),
]