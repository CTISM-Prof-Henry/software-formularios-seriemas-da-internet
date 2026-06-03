from rest_framework.test import APITestCase
from rest_framework import status
from desafio.models import Desafio
from categoria.models import Categoria
from unidade.models import Unidade
from usuario.models import Usuario
from .models import Risco


class RiscoAPITest(APITestCase):

    def setUp(self):

        self.unidade_teste = Unidade.objects.create(
            id=211,
            nome_unidade="Setor de Teste UFSM",
            sigla_centro="UFSM"
        )

        self.senha_teste = "senhaSegura@123"

        self.usuario = Usuario.objects.create(
            username="João S",
            matricula="20261010",
            email="teste@ufsm.br",
            first_name="João",
            last_name="Silva",
            setor=self.unidade_teste,
            perfil_acesso="Gestor de Risco"
        )

        self.categoria = Categoria.objects.create(
            nome_categoria="Internacionalizacao",
            descricao_categoria="descricao_categoria",
        )

        self.desafio = Desafio.objects.create(
            numero="01",
            nome="Desafio 1",
            descricao="descricao"
        )

        self.risco = Risco.objects.create(
            descricao="Risco nas pontes da UFSM",
            categoria=self.categoria,
            desafio=self.desafio,
            responsavel=self.usuario,
            status="Tratamento"
        )


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
        nova_categoria = Categoria.objects.create(nome_categoria="Desenvolvimento local")

        risco = {
            "descricao": "Problemas com recebimento de verba",
            "categoria": nova_categoria.id,
            "desafio": self.desafio.id,
            "responsavel": self.usuario.id,
            "status": "Identificacao"
        }

        response = self.client.post(self.url_create_risco, risco, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()["message"], "Risco cadastrado com sucesso!")
        self.assertEqual(Risco.objects.count(), 2)