from django.contrib import admin
from .models import Tratamento


class TratamentoAdmin(admin.ModelAdmin):
    class Meta:
        model = Tratamento

        fields = '__all__'

admin.site.register(Tratamento, TratamentoAdmin)

