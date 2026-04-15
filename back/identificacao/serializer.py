from rest_framework import serializers
from .models import Identificacao


class IdentificacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Identificacao

        fields = '__all__'
