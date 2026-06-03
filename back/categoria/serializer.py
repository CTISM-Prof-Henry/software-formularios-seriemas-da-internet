from .models import Categoria
from rest_framework import serializers

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria

        fields = [
            'id',
            'nome_categoria'
            'descricao',
        ]

    def create(self, validated_data):
        return Categoria.objects.create(**validated_data)