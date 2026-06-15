from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):

    nome_unidade = serializers.CharField(source='unidade.nome_unidade', read_only=True)

    class Meta:
        model = Usuario

        perfil_acesso = serializers.CharField(required=False, allow_blank=True, allow_null=True ,default='Gestor')

        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'password',
            'matricula',
            'perfil_acesso',
            'date_joined',
            'last_login',
            'unidade',
            'nome_unidade',
            'centro_ativo',
            'centros_permitidos'
        ]

        # fields = '__all__'

        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': False, 'allow_null': True},
        }

    def create(self, validated_data):
        first_name = validated_data.get('first_name', '').strip()
        last_name = validated_data.get('last_name', '').strip()

        inicial_sobrenome = last_name[0] if last_name else ''
        username_limpo = f"{first_name}{inicial_sobrenome.upper()}"
        print(username_limpo)

        centros_permitidos = validated_data.pop('centros_permitidos', [])

        perfil = validated_data.get('perfil_acesso')
        if not perfil or str(perfil).strip() == "":
            perfil = 'Gestor'

        user = Usuario(
            username=username_limpo,
            first_name=first_name,
            last_name=last_name,
            email=validated_data.get('email'),
            matricula=validated_data.get('matricula'),
            unidade=validated_data.get('unidade'),
            centro_ativo=validated_data.get('centro_ativo'),
            perfil_acesso=perfil,
            is_staff=True,
        )

        user.set_password(validated_data.get('password'))
        user.save()

        if centros_permitidos:
            user.centros_permitidos.set(centros_permitidos)

        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(help_text="Matricula do Usuario")
    password = serializers.CharField(help_text="Senha do Usuario")