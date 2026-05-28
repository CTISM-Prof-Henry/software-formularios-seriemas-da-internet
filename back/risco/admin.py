from django.contrib import admin
from risco.models import Risco
from risco.models import UsuarioRisco


class RiscoAdmin(admin.ModelAdmin):
    class Meta:
        model = Risco

        fields = '__all__'


class UsuarioRiscoAdmin(admin.ModelAdmin):
    class Meta:
        model = UsuarioRisco

        fields = '__all__'




admin.site.register(Risco, RiscoAdmin)
admin.site.register(UsuarioRisco, UsuarioRiscoAdmin)



