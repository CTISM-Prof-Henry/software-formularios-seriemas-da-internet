from django.utils import timezone
from rest_framework import serializers
from .models import Risco, RecomendacaoAuditoria


class RiscoSerializer(serializers.ModelSerializer):
    nome_categoria = serializers.CharField(source='categoria.nome_categoria', read_only=True)
    nome_desafio = serializers.CharField(source='desafio.nome', read_only=True)
    nome_responsavel = serializers.CharField(source='responsavel.first_name', read_only=True)

    class Meta:
        model = Risco
        fields = '__all__'

    def create(self, validated_data):

        risco = Risco.objects.create(**validated_data)

        risco.skip_history_when_saving = True
        risco.save()

        numero_formatado = str(risco.id).zfill(3)
        ano = timezone.now().year
        risco.codigo = f"R-{numero_formatado}"
        risco.id_estrutural = f"RK-{ano}-{numero_formatado}"

        del risco.skip_history_when_saving

        risco.save(update_fields=['codigo', 'id_estrutural'])

        return risco

class RecomendacaoAuditoriaSerializer(serializers.ModelSerializer):
    auditor = serializers.SlugRelatedField(
        read_only=True,
        slug_field='first_name'  
    )

    class Meta:
        model = RecomendacaoAuditoria

        fields = '__all__'