from django.urls import path
from . import views

urlpatterns = [
    path('api/desafios/', views.get_desafios, name='get_desafios'),
]