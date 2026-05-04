from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Formulario
from .serializer import FormularioSerializer

@api_view(['GET'])
def listar_formularios(request):
    formularios = Formulario.objects.all()

    serializer = FormularioSerializer(formularios, many=True)
    return Response(serializer.data)

