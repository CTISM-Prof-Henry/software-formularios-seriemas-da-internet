from django.contrib import admin
from risco.models import Risco
from risco.models import RecomendacaoAuditoria


class RiscoAdmin(admin.ModelAdmin):
    class Meta:
        model = Risco

        fields = '__all__'

class RecondamendacoaAuditoriaAdmin(admin.ModelAdmin):
    class Meta:
        model: RecomendacaoAuditoria

        fields = '__all__'

admin.site.register(RecomendacaoAuditoria, RecondamendacoaAuditoriaAdmin)
admin.site.register(Risco, RiscoAdmin)




