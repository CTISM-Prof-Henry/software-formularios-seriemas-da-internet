from django.core.serializers import serialize
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Usuario
from .serializer import UsuarioSerializer

@api_view(['GET'])
def listar_usuarios(request):

    usuarios = Usuario.objects.all()

    serializer = UsuarioSerializer(usuarios, many=True)
    return Response(serializer.data)
