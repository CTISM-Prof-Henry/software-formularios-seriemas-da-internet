from .models import Unidade
from rest_framework import serializers

class UnidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unidade

        fields = [
            'id',
            'cod_estruturado',
            'nome_unidade',
            'nome_centro',
            'sigla_centro',
            'tipo_unidade',
            'situacao',
        ]

    def create(self, validated_data):
        return Unidade.objects.create(**validated_data)

