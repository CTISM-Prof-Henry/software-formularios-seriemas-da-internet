from django.contrib import admin

from desafio.models import Desafio


class DesafioAdmin(admin.ModelAdmin):
    class Meta:
        model = Desafio

        fields = '__all__'


admin.site.register(Desafio, DesafioAdmin)
