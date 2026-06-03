from rest_framework import serializers
from .models import Desafio


class DesafioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Desafio

        fields = [
            'id',
            'numero',
            'nome',
            'descricao',
        ]

    def create(self, validated_data):
        return Desafio.objects.create(**validated_data)