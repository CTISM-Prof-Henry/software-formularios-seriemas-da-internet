from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import Planejamento
from .serializer import PlanejamentoSerializer
from usuario.authentications import IsAuditorPermission


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAuditorPermission])
def criar_planejamento(request):

    centro_ativo = request.user.centro_ativo

    if not centro_ativo:
        return Response({"erro": "Você precisa selecionar um Centro no menu superior antes de criar um planejamento."},
                        status=400)

    ciclo_em_andamento = Planejamento.objects.filter(
        centro=centro_ativo
    ).exclude(status='Encerrado').exists()

    if ciclo_em_andamento:
        return Response({
            "erro": "Já existe um planejamento em andamento para este Centro. Encerre o ciclo atual antes de abrir um novo."
        }, status=400)


    serializer = PlanejamentoSerializer(data=request.data)
    if serializer.is_valid():

        serializer.save(criado_por=request.user, centro=centro_ativo)
        return Response({"mensagem": "Planejamento do Ciclo criado com sucesso!", "dados": serializer.data},
                        status=status.HTTP_201_CREATED)


    return Response({"erro": "Dados inválidos", "detalhes": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obter_planejamento_ativo(request):
    centro_ativo = getattr(request.user, 'centro_ativo', None)

    if not centro_ativo:
        return Response({"erro": "Centro não selecionado."}, status=400)


    ciclo_aberto = Planejamento.objects.filter(
        centro=centro_ativo,
        status__in=['Planejamento', 'Ativo']
    ).first()

    if ciclo_aberto:
        serializer = PlanejamentoSerializer(ciclo_aberto)
        return Response(serializer.data, status=200)

    else:
        return Response({"erro": "Nenhum ciclo em andamento."}, status=404)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsAuditorPermission])
def atualizar_planejamento(request, pk):
    try:

        planejamento = Planejamento.objects.get(pk=pk)

        centro_ativo = getattr(request.user, 'centro_ativo', None)
        centro_id = centro_ativo.id if hasattr(centro_ativo, 'id') else centro_ativo

        if planejamento.centro_id != centro_id:
            return Response({"erro": "Você não tem permissão para editar um ciclo de outro Centro."}, status=403)

        serializer = PlanejamentoSerializer(planejamento, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"mensagem": "Planejamento atualizado com sucesso!", "dados": serializer.data})

        return Response({"erro": "Dados inválidos", "detalhes": serializer.errors}, status=400)
    except Planejamento.DoesNotExist:
        return Response({"erro": "Planejamento não encontrado."}, status=404)