from rest_framework import serializers
from .models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):

    nome_unidade = serializers.CharField(source='unidade_ativa.nome_unidade', read_only=True)
    perfil_acesso = serializers.CharField(required=False, allow_blank=True, allow_null=True, default='Gestor')

    class Meta:
        model = Usuario

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
            'nome_unidade',
            'centro_ativo',
            'centros_permitidos',
            'unidade_ativa',
            'unidades_permitidas',
            'is_online'
        ]

        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': False, 'allow_null': True},
        }

    def create(self, validated_data):
        first_name = validated_data.get('first_name', '').strip()
        last_name = validated_data.get('last_name', '').strip()

        inicial_sobrenome = last_name[0] if last_name else ''
        username_limpo = f"{first_name}{inicial_sobrenome.upper()}"


        centros_permitidos = validated_data.pop('centros_permitidos', [])
        unidades_permitidas = validated_data.pop('unidades_permitidas', [])

        perfil = validated_data.get('perfil_acesso')
        if not perfil or str(perfil).strip() == "":
            perfil = 'Gestor'


        user = Usuario(
            username=username_limpo,
            first_name=first_name,
            last_name=last_name,
            email=validated_data.get('email'),
            matricula=validated_data.get('matricula'),
            unidade_ativa=validated_data.get('unidade_ativa'),
            centro_ativo=validated_data.get('centro_ativo'),
            perfil_acesso=perfil,
            is_staff=True,
        )

        user.set_password(validated_data.get('password'))
        user.save()

        if centros_permitidos:
            user.centros_permitidos.set(centros_permitidos)

        if unidades_permitidas:
            user.unidades_permitidas.set(unidades_permitidas)

        return user

    def to_representation(self, instance):
        representation = super().to_representation(instance)


        representation['centros_permitidos'] = [
            {"id": c.id, "sigla": c.sigla, "nome": c.nome}
            for c in instance.centros_permitidos.all()
        ]

        representation['unidades_permitidas'] = [
            {"id": u.id, "nome_unidade": getattr(u, 'nome_unidade', str(u))}
            for u in instance.unidades_permitidas.all()
        ]
        return representation


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(help_text="Matricula do Usuario")
    password = serializers.CharField(help_text="Senha do Usuario")