from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm
from .models import Usuario


class UsuarioCreationForm(UserCreationForm):
    class Meta:
        model = Usuario

        fields = ('username', 'email', 'first_name', 'last_name', 'matricula')


class CustomUserAdmin(UserAdmin):
    add_form = UsuarioCreationForm

    list_display = ('username', 'email', 'first_name', 'last_name', 'matricula', 'is_staff')

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Informações Pessoais', {'fields': ('first_name', 'last_name', 'email', 'matricula')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Datas Importantes', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username',
                'email',
                'first_name',
                'last_name',
                'matricula',
                'password1',
                'password2'
            ),
        }),
    )


admin.site.register(Usuario, CustomUserAdmin)