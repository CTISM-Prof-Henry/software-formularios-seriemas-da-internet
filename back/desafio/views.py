from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_500_INTERNAL_SERVER_ERROR
from desafio.models import Desafio
from desafio.serializer import DesafioSerializer
from usuario.authentications import CsrfExemptSessionAuthentication


@csrf_exempt
@api_view(['GET'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def get_desafios(request):

    desafios = Desafio.objects.all()

    try:

        serializer = DesafioSerializer(desafios, many=True)

        return Response(serializer.data, status=HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['GET'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def get_desafio_by_id(request, pk):

    if pk is None:
        return Response({"erro": "Nenhum id recebido"}, status=HTTP_500_INTERNAL_SERVER_ERROR)

    try:
        desafio = Desafio.objects.get(id=pk)

        serializer = DesafioSerializer(desafio)

        return Response(serializer.data, status=HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
