from django.urls import path
from . import views

urlpatterns = [
    path('api/desafios/', views.get_desafios, name='get_desafios'),
    path('api/desafio/<int:pk>/', views.get_desafio_by_id, name='get_desafio'),
]