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
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.contrib.auth.models import User

@api_view(['GET'])
def listar_usuarios(request):

    usuarios = Usuario.objects.all()

    serializer = UsuarioSerializer(usuarios, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['POST'])
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

                else:
                    return JsonResponse({'erro': 'Senha incorreta'}, status=401)

            else:
                return JsonResponse({'erro': 'Usuário não encontrado'}, status=404)


        except Exception as e:

            print(f"ERRO FATAL DE SERVIDOR: {e}")
            return JsonResponse({
                'erro': 'Falha do servidor'
            }, status=500)

    return JsonResponse({'erro': 'Método não permitido'}, status=405)


@csrf_exempt
@api_view(['POST'])
def cadastrar_usuario(request):


    if request.method == 'POST':

        try :

            dados = json.loads(request.body)
            serializer = UsuarioSerializer(data=dados)

            if serializer.is_valid():
                serializer.save()
                print(f"Dados: {serializer.data}")

                return JsonResponse({"messagem": "Usuario cadastrado com sucesso!"}, status=201)


            return JsonResponse({"erro": "Dados invalidos", "detalhes": serializer.errors}, status=400)

        except Exception as e:
            return JsonResponse({"erro": "Falha do servidor", "detalhes": str(e)}, status=500)


@csrf_exempt
@api_view(['POST'])
def reset_senha(request):

    email = request.data.get('email')
    user = Usuario.objects.filter(email=email).first()


    try:

        if user:

            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            link_reset = f"http://localhost:5173/recuperar-senha/{uid}/{token}"

            send_mail(
                "Redefinicao de Senha - Sistema",
                f"Clique no link para resetar sua senha: {link_reset}",
                "noreply@meusistema.com",
                [user.email],
                fail_silently=True,
            )

            return JsonResponse({
                "message": "Se um email existir, um link foi enviado.",
                "uid": uid,
                "token": token,
                }, status=200)

        return JsonResponse({"erro": "Email nao existe entre os usuairos"}, status=400)

    except Exception as e:

        return JsonResponse({"erro": "Erro de servidor"}, status=500)
