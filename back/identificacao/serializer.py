from django.core.serializers import serialize

from .models import identificacao


class Identificacao(serializers.ModelSerializer):
    class Meta:
        model = identificacao

        fields = '__all__'
