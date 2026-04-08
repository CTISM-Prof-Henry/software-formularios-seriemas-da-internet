from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        # fields = '__all__'

        fields = ['id',
                  'username',
                  'email',
                  'password',
                  'matricula',
                  'setor',
                  'perfil_acesso', 
                  'first_name',
                  'last_name',
                  'date_joined'
        ]

        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = Usuario(
            username=validated_data.get('matricula'),
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            email=validated_data.get('email'),
            matricula=validated_data.get('matricula'),
            setor=validated_data.get('setor'),
            perfil_acesso=self.initial_data.get('perfil'),
        )

        user.set_password(validated_data.get('password'))

        user.save()

        return user