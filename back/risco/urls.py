from django.urls import path
from . import views

urlpatterns = [
    path('api/riscos/', views.get_riscos, name='get_riscos'),
    path('api/risco/<int:pk>/', views.get_risco_by_id, name='get_risco_by_id'),
    path('api/risco/', views.create_risco, name='create_risco'),
]