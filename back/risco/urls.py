from django.urls import path
from . import views

urlpatterns = [
    path('api/riscos/', views.listar_riscos, name='listar_riscos'),
    path('api/risco/<int:pk>/', views.get_risco_by_id, name='get_risco_by_id'),
    path('api/risco/', views.create_risco, name='create_risco'),
    path('api/risco/<int:pk>/update/', views.update_risco_etapa, name='update_risco'),
    path('api/riscos/<int:id>/historico/', views.historico_risco, name='historico_risco'),
    path('api/risco/<int:pk>/fazer-recomendacao/', views.fazer_recomendacao, name='fazer_recomendacao'),
    path('api/risco/<int:pk>/listar-recomendacoes/', views.listar_recomendacoes, name='listar_recomendacoes'),
    path('api/riscos/exportar/csv/', views.exportar_riscos_csv, name='exportar_csv'),
    path('api/riscos/exportar/pdf/', views.exportar_riscos_pdf, name='exportar_pdf'),
]