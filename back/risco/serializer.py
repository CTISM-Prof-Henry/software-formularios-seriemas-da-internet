from .models import Risco
from rest_framework import serializers

class RiscoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Risco

        fields = '__all__'

