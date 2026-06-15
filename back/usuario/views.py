import json
from django.utils import timezone
from django.http import JsonResponse
from django.core.mail import send_mail
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.tokens import default_token_generator
from django.db import transaction
from django.contrib.auth import login
from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from drf_spectacular.utils import extend_schema
from .authentications import CsrfExemptSessionAuthentication, IsAuditorPermission
from .serializer import UsuarioSerializer
from .models import Usuario, Centro
from unidade.models import Unidade


@api_view(['GET'])
def listar_usuarios(request):

    usuarios_validos = Usuario.objects.select_related('unidade').exclude(
        Q(first_name__isnull=True) | Q(first_name__exact='') |
        Q(matricula__isnull=True) | Q(matricula__exact='') |
        Q(unidade__isnull=True)
    ).order_by('-id')

    if request.GET.get('count-users'):
        count = usuarios_validos.count()
        return Response({"count": count}, status=status.HTTP_200_OK)

    query = request.GET.get('q', '')
    limit = request.GET.get('limit')

    if query:
        usuarios_validos = usuarios_validos.filter(
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(unidade__nome_unidade__icontains=query)
        )

    if limit:
        try:
            usuarios_validos = usuarios_validos[:int(limit)]
        except ValueError:
            pass

    serializer = UsuarioSerializer(usuarios_validos, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def buscar_usuarios_by_name(request):

    query = request.GET.get('q', '')

    if len(query) < 2:
        return Response([])

    usuarios = Usuario.objects.filter(first_name__icontains=query)[:10]

    resultados = []
    for u in usuarios:
        resultados.append({
            "id": u.id,
            "first_name": u.first_name,
            "last_name": u.last_name,
            "matricula": u.matricula
        })

    return Response(resultados)


@csrf_exempt
@api_view(['GET'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def get_usuario(request, uid):

    try:
        user_id = force_str(urlsafe_base64_decode(uid))

        user = Usuario.objects.select_related('unidade').get(pk=user_id)

    except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
        user = None

    if user:

        serializer = UsuarioSerializer(user, many=False)
        return Response(serializer.data)

    return Response({"error": "Usuario nao existe!"}, status=404)



@csrf_exempt
@api_view(['GET'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def get_usuario_by_id(request, pk):

    try:
        user = Usuario.objects.select_related('unidade').get(id=pk)

    except Usuario.DoesNotExist:
        return Response({"error": "Usuário não existe!"}, status=404)


    serializer = UsuarioSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuditorPermission])
def alterar_permissao(request, pk):
    try:

        user = Usuario.objects.get(id=pk)

        novo_perfil = request.data.get('perfil_acesso')

        perfis_validos = [par[0] for par in Usuario.PERFIS]

        if novo_perfil not in perfis_validos:
            return Response(
                {"erro": f"Perfil inválido. Escolha entre: {', '.join(perfis_validos)}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.perfil_acesso = novo_perfil
        user.save()

        return Response(
            {
                "mensagem": f"Permissão de {user.first_name} atualizada para {novo_perfil} com sucesso!",
                "perfil_acesso": user.perfil_acesso
            },
            status=status.HTTP_200_OK
        )

    except Usuario.DoesNotExist:
        return Response(
            {"erro": "Utilizador não encontrado."},
            status=status.HTTP_404_NOT_FOUND
        )

    except Exception as e:
        return Response(
            {"erro": f"Erro interno no servidor: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@csrf_exempt
@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([AllowAny])
def fazer_login(request):

    try:

        dados = json.loads(request.body)
        matricula = dados.get('matricula')
        senha = dados.get('senha')

        print("\n--- TENTATIVA DE LOGIN ---")
        print(f"Matrícula recebida: '{matricula}'")

        usuario = Usuario.objects.filter(matricula=matricula).first()


        if usuario is not None:
            print(f"Usuário encontrado no BD: {usuario}")

            senha_valida = usuario.check_password(senha)

            if senha_valida:
                print("Senha Valida por checkpassword!")

                login(request, usuario, backend='django.contrib.auth.backends.ModelBackend')

                uid = urlsafe_base64_encode(force_bytes(usuario.pk))

                usuario.last_login = timezone.now()
                usuario.save(update_fields=['last_login'])

                return JsonResponse({
                    'mensagem': 'Login realizado com sucesso',
                    'usuario_id': usuario.id,
                    'usuario_nome': usuario.first_name,
                    'uid': uid
                }, status=200)


            return JsonResponse({'erro': 'Senha incorreta'}, status=401)

        return JsonResponse({'erro': 'Usuário não encontrado'}, status=404)


    except Exception as e:

        print(f"ERRO FATAL DE SERVIDOR: {e}")
        return JsonResponse({
            'erro': 'Falha do servidor'
        }, status=500)





@extend_schema(
    summary="Cadastra um usuario",
    description="Cadastra um usuario e retorna mensagem de sucesso",
    responses={200: UsuarioSerializer(many=True)}
)
@csrf_exempt
@api_view(['POST'])
def cadastrar_usuario(request):

    dados = request.data
    setor_id = dados.get('setor')

    print(f"DEBUG: O React enviou o setor como: {setor_id} (Tipo: {type(setor_id)})")
    if not setor_id:
        return Response({"erro": "É obrigatório selecionar um Centro/Unidade."}, status=status.HTTP_400_BAD_REQUEST)

    try:

        try:
            unidade_escolhida = Unidade.objects.get(id=setor_id)
        except Unidade.DoesNotExist:
            return Response({"erro": "O Centro selecionado não existe."}, status=status.HTTP_404_NOT_FOUND)


        if not unidade_escolhida.sigla_centro:
            return Response({"erro": "Este setor não está vínculado a nenhum Centro institucional."},
                            status=status.HTTP_400_BAD_REQUEST)


        centro_da_unidade, create = Centro.objects.get_or_create(
            sigla=unidade_escolhida.sigla_centro,
            defaults={'nome': getattr(unidade_escolhida, 'nome_centro', unidade_escolhida.sigla_centro)}
        )

        serializer = UsuarioSerializer(data=dados)

        if serializer.is_valid():

            with transaction.atomic():

                usuario = serializer.save(
                    unidade=unidade_escolhida,
                    centro_ativo=centro_da_unidade
                )

                usuario.centros_permitidos.add(centro_da_unidade)

            print(f"Dados: {serializer.data}")
            return Response({"mensagem": "Usuário cadastrado com sucesso!"}, status=status.HTTP_201_CREATED)

        return Response({"erro": "Dados inválidos", "detalhes": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"erro": "Falha do servidor", "detalhes": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
        return JsonResponse({"erro": "Erro de servidor", "detalhes": str(e)}, status=500)
 

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAuditorPermission])
def confirmar_reset_senha(request):

    uid = request.data.get('uid')
    token = request.data.get('token')
    nova_senha = request.data.get('nova_senha')

    try:
        user_id = force_str(urlsafe_base64_decode(uid))
        user = Usuario.objects.get(pk=user_id)

        if user and default_token_generator.check_token(user, token):

            user.set_password(nova_senha)
            user.save()

            return JsonResponse({"message": "Senha redefinida com sucesso!"}, status=200)

        return JsonResponse({"erro": "Link de redefinicao invalido"}, status=400)

    except Exception as e:
        return JsonResponse({"erro": "Erro de servidor", "detalhes": str(e)}, status=500)