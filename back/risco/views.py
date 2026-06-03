from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND, HTTP_200_OK, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_201_CREATED

from formulario import serializer
from risco.models import Risco
from risco.serializer import RiscoSerializer


@api_view(['GET'])
def get_riscos(request):


    try:
        riscos = Risco.objects.all()

        serializer = RiscoSerializer(riscos, many=True)

        return Response(serializer.data, status=HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_risco_by_id(request, id):

    try:
        risco = Risco.objects.get(pk=id)

        serializer = RiscoSerializer(risco)
        return Response(serializer.data, status=HTTP_200_OK)

    except Risco.DoesNotExist:
        return Response({"error": "Risco não encontrado"}, status=HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def create_risco(request):

    if request.method == 'POST':

        try:
            serializer = RiscoSerializer(data=request.data)

            if serializer.is_valid():

                serializer.save()

                return Response({
                    "message": "Risco cadastrado com sucesso!",
                    "risco": serializer.data
                }, status=HTTP_201_CREATED)

            return Response({
                "erro": "Dados invalidos",
                "detalhes": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:

            return Response({
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({"erro": "Metodo nao permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)














