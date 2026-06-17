from rest_framework import serializers
from .models import Planejamento


class PlanejamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Planejamento
        fields = [
            'id',
            'ano',
            'titulo',
            'descricao',
            'data_inicio',
            'data_fim',
            'status',
            'centro',
            'data_criacao'
        ]
    
        read_only_fields = ['centro']