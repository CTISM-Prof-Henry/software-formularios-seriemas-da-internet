from django.urls import path
from . import views

urlpatterns = [
    path('api/planejamento/', views.criar_planejamento, name='criar_planejamento'),
    path('api/obter-planejamento/', views.obter_planejamento_ativo, name='obter_planejamento_ativo'),
    path('api/planejamento/<int:pk>/', views.atualizar_planejamento, name='atualizar_planejamento'),
]


