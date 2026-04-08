from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

        # fields = ['id', 'username', 'email', 'password', 'matricula']
        # extra_kwargs = {
        #     'password': {'write_only': True}
        # }

    def create(self, validated_data):
        user = Usuario(
            username=validated_data.get('nome'),
            first_name=validated_data.get('nome'),
            last_name=validated_data.get('sobrenome'),
            email=validated_data.get('email'),
            matricula=validated_data.get('matricula'),
            password=validated_data.get('password'),
            setor=validated_data.get('setor'),
            perfil_acesso=validated_data.get('perfil'),
        )

        user.set_password(validated_data.get('password'))

        user.save()

        return user