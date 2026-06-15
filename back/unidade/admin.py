from django.contrib import admin
from unidade.models import Unidade


class RiscoAdmin(admin.ModelAdmin):
    class Meta:
        model = Unidade

        fields = '__all__'


admin.site.register(Unidade, RiscoAdmin)




