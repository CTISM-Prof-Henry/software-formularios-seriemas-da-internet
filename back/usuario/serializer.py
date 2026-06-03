from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario

        fields = ['id',
                  'username',
                  'first_name',
                  'last_name',
                  'email',
                  'password',
                  'matricula',
                  'setor',
                  'perfil_acesso',
                  'date_joined',
                  'last_login',
        ]

        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': False, 'allow_null': True},
        }

    def create(self, validated_data):
        first_name = validated_data.get('first_name', '').strip()
        last_name = validated_data.get('last_name', '').strip()

        inicial_sobrenome = last_name[0] if last_name else ''
        username_limpo = f"{first_name} {inicial_sobrenome[0].upper()}"
        print(username_limpo)

        user = Usuario(
            username=username_limpo,
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            email=validated_data.get('email'),
            matricula=validated_data.get('matricula'),
            setor=validated_data.get('setor'),
            perfil_acesso=validated_data.get('perfil_acesso'),
            is_staff=True,
        )

        user.set_password(validated_data.get('password'))

        user.save()

        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(help_text="Matricula do Usuario")
    password = serializers.CharField(help_text="Senha do Usuario")