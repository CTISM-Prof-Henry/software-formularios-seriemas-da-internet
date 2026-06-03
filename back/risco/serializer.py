from rest_framework import serializers
from .models import Risco

class RiscoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Risco

        fields = '__all__'

    def create(self, validated_data):
        return Risco.objects.create(**validated_data)




