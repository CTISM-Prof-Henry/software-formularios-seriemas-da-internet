from rest_framework import serializers
from .models import Tratamento


class TratamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tratamento

        fields = '__all__'