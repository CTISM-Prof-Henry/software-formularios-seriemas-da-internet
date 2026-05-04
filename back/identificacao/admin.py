from django.contrib import admin
from .models import Identificacao


class IdentificacaoAdmin(admin.ModelAdmin):
    class Meta:
        model = Identificacao

        fields = ('descricao', 'causas', 'irregularidades')



admin.site.register(Identificacao, IdentificacaoAdmin)