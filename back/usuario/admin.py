from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm
from .models import Usuario
from usuario.models import Centro


class UsuarioCreationForm(UserCreationForm):
    class Meta:
        model = Usuario

        fields = ('username', 'email', 'first_name', 'last_name', 'matricula', 'perfil_acesso')


class CustomUserAdmin(UserAdmin):
    add_form = UsuarioCreationForm

    list_display = ('username', 'email', 'first_name', 'last_name', 'matricula', 'perfil_acesso', 'is_staff')

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Informações Pessoais', {'fields': ('first_name', 'last_name', 'email', 'matricula', 'perfil_acesso')}),
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

class CentroAdmin(admin.ModelAdmin):
    class Meta:
        model = Centro

        fieldsets = '__all__'



admin.site.register(Usuario, CustomUserAdmin)
admin.site.register(Centro, CentroAdmin)