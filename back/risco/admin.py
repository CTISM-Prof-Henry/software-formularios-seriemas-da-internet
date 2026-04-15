from django.contrib import admin
from risco.models import Risco


class RiscoAdmin(admin.ModelAdmin):
    class Meta:
        model = Risco

        fields = '__all__'


admin.site.register(Risco, RiscoAdmin)
