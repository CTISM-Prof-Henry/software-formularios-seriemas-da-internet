from django.contrib import admin
from risco.models import Planejamento



class PlanejamentoAdmin(admin.ModelAdmin):
    class Meta:
        model = Planejamento

        fields = '__all__'



admin.site.register(Planejamento, PlanejamentoAdmin)

