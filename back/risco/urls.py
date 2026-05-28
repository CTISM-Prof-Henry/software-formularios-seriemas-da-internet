from django.urls import path
from . import views

urlpatterns = [
    path('api/riscos/', views.get_riscos, name='get_riscos'),
    path('api/riscos/<int:id>/', views.get_risco_by_id, name='get_risco'),
    path('api/risco/', views.create_risco, name='create_risco'),
]