from django.contrib.auth.hashers import check_password
from django.core.serializers import serialize
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Usuario
from .serializer import UsuarioSerializer
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['GET'])
def listar_usuarios(request):

    usuarios = Usuario.objects.all()

    serializer = UsuarioSerializer(usuarios, many=True)
    return Response(serializer.data)

@csrf_exempt
def fazer_login(request):

    if  (request.method == 'POST'):

        try:

            dados = json.loads(request.body)
            matricula = dados.get('matricula')
            senha = dados.get('senha')

            print(f"\n--- TENTATIVA DE LOGIN ---")
            print(f"Matrícula recebida: '{matricula}'")
            print(f"Senha recebida: '{senha}'")

            usuario = Usuario.objects.filter(matricula=matricula).first()



            if usuario is not None:
                print(f"Usuário encontrado no BD: {usuario}")

                senha_valida = usuario.check_password(senha)

                if senha_valida:
                    print("Senha Valida por checkpassword!")

                    refresh = RefreshToken.for_user(usuario)
                    token =  str(refresh.access_token)

                    print(f"TokenAcesso: {token}")
                    return JsonResponse({
                        'mensagem': 'Login realizado com sucesso',
                        'usuario_id': usuario.id,
                        'usuario_nome': usuario.first_name,
                        'tokenAcesso': token
                    }, status=200)

        except Exception as e:

            print(f"ERRO FATAL DE SERVIDOR: {e}")
            return JsonResponse({
                'erro': 'Falha do servidor'
            }, status=500)

    return JsonResponse({'erro': 'Método não permitido'}, status=405)
