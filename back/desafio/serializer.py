from rest_framework import serializers
from .models import Desafio


class DesafioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Desafio

        fields = '__all__'