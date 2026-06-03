from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_500_INTERNAL_SERVER_ERROR
from django.db.models import Q
from unidade.serializer import UnidadeSerializer
from unidade.models import Unidade


@api_view(['GET'])
def get_unidades(request):

    termo_busca = request.GET.get('search', '')

    if termo_busca:

        unidades = Unidade.objects.filter(
            Q(nome_unidade__icontains=termo_busca) | Q(sigla_centro__icontains=termo_busca)
        )[:10]
    else:

        unidades = Unidade.objects.none()

    try:
        serializer = UnidadeSerializer(unidades, many=True)
        print(serializer.data)

        return Response(serializer.data, status=HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)