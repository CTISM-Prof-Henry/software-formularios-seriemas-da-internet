from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_500_INTERNAL_SERVER_ERROR
from desafio.models import Desafio
from desafio.serializer import DesafioSerializer

@api_view(['GET'])
def get_desafios(request):

    desafios = Desafio.objects.all()

    try:

        serializer = DesafioSerializer(desafios, many=True)

        return Response(serializer.data, status=HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)