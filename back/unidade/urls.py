from django.urls import path
from . import views

urlpatterns = [
    path('api/unidades/', views.get_unidades, name='get_unidades'),
]