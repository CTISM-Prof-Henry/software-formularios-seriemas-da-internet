from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario
from django.contrib.auth.forms import UserCreationForm


class UsuarioCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = Usuario

        fields = UserCreationForm.Meta.fields + ('email', 'first_name', 'last_name', 'matricula')



class CustomUserAdmin(UserAdmin):

    add_form = UsuarioCreationForm

    list_display = (
        'username',
        'email',
        'first_name',
        'last_name',
        'matricula',
        'is_staff'
    )

    fieldsets = list(UserAdmin.fieldsets) + [
        ('Informações da UFSM', {'fields': ['matricula']})
    ]

    add_fieldsets = list(UserAdmin.fieldsets) + [
        ('Informações Extras', {
            'classes': ['wide'],
            'fields': ['matricula']
        })
    ]


admin.site.register(Usuario, CustomUserAdmin)

