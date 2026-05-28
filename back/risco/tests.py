from urllib import response
from rest_framework.test import APITestCase
from django.test import TestCase
from rest_framework import status
from .models import Risco


class RiscoAPITest(TestCase):

    def setUp(self):

        self.risco = Risco(
            descricao="Risco nas pontes da UFSM",
            categoria="Internacionalizacao",
            responsavel="Lazaro",
            data_criacao="2026-06-27",
            status="Tratamento"
        )

        self.risco.save()

        self.url_get_riscos = '/api/riscos/'
        self.url_get_risco_by_id = f'/api/riscos/{self.risco.id}/'
        self.url_create_risco = '/api/risco/'



    def test_get_riscos(self):
        response = self.client.get(self.url_get_riscos)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['descricao'], "Risco nas pontes da UFSM")

    def test_get_risco_by_id(self):
        response = self.client.get(self.url_get_risco_by_id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['descricao'], "Risco nas pontes da UFSM")

    def test_create_risco(self):

        risco = {
            "descricao":"Problemas com recebimento de verba",
            "categoria":"Desenvolvimento local",
            "responsavel":"Lazaro",
            "data_criacao":"2026-06-27",
            "status":"Identificacao"
        }

        response = self.client.post(self.url_create_risco, risco, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()["message"], "Risco cadastrado com sucesso!")
        self.assertEqual(Risco.objects.count(), 2)