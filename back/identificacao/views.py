from sys import api_version
from rest_framework.decorators import api_view
from django.shortcuts import render
from rest_framework import serializers
from .serializer import IdentificacaoSerializer
from rest_framework.response import Response
from .models import Identificacao

from usuario.models import Usuario


@api_view(["GET"])
def get_identificacoes(request):

    identificacoes = Identificacao.objects.all()

    serializer = IdentificacaoSerializer(identificacoes, many=True)

    return Response(serializer.data)

