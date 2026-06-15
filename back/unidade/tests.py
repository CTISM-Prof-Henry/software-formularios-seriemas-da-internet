from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Unidade


class UnidadeViewsTestCase(APITestCase):

    def setUp(self):

        Unidade.objects.create(
            nome_unidade="Pró-Reitoria de Administração",
            sigla_centro="PRA",
            tipo_unidade="Matriz")
        Unidade.objects.create(
            nome_unidade="Centro de Tecnologia",
            sigla_centro="CT",
            tipo_unidade="Centro"
        )
        Unidade.objects.create(
            nome_unidade="Centro de Ciências da Saúde",
            sigla_centro="CCS",
            tipo_unidade="Centro"
        )


        for i in range(11):
            Unidade.objects.create(
                nome_unidade=f"Departamento de Engenharia {i}",
                sigla_centro="CT",
                tipo_unidade="Departamento"
            )

        self.url = reverse('get_unidades')


    def test_get_unidades_sem_termo_de_busca(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)


    def test_get_unidades_busca_por_nome(self):
        response = self.client.get(self.url, {'search': 'Saúde'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['nome_unidade'], "Centro de Ciências da Saúde")


    def test_get_unidades_busca_por_sigla(self):
        response = self.client.get(self.url, {'search': 'PRA'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['sigla_centro'], "PRA")


    def test_get_unidades_limite_10_registros(self):
        response = self.client.get(self.url, {'search': 'CT'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 10)


    def test_get_unidades_termo_nao_encontrado(self):
        response = self.client.get(self.url, {'search': 'TermoInexistente123'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)