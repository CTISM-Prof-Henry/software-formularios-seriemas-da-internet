from django.contrib import admin
from .models import Avaliacao


class AvaliacaoAdmin(admin.ModelAdmin):
    class Meta:
        model = Avaliacao

        fields = '__all__'


admin.site.register(Avaliacao, AvaliacaoAdmin)

