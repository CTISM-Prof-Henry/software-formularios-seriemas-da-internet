from django.urls import path
from . import views

urlpatterns = [
    path('api/categorias/', views.get_categorias, name='get_categorias'),
    path('api/categoria/<int:pk>/', views.get_categoria_by_id, name='get_categoria_by_id'),
]