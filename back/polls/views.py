from django.shortcuts import render
from django.views import View
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(["GET"])
def teste_api_react(request):
    return Response({
        "mensagem": "Deu certo! O Django esta falando com o react",
        "status": "200"
    })






