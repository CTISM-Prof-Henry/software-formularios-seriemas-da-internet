from django.contrib import admin
from risco.models import Risco
from risco.models import Usuario_risco
from usuario.models import Usuario


class RiscoAdmin(admin.ModelAdmin):
    class Meta:
        model = Risco

        fields = '__all__'


class Usuario_riscoAdmin(admin.ModelAdmin):
    class Meta:
        model = Usuario_risco

        fields = '__all__'




admin.site.register(Risco, RiscoAdmin)
admin.site.register(Usuario_risco, Usuario_riscoAdmin)



