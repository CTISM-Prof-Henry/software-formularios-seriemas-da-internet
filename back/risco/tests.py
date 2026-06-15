from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Risco
from usuario.models import Usuario, Centro
from unidade.models import Unidade
from categoria.models import Categoria
from desafio.models import Desafio


class RiscoViewsTestCase(APITestCase):

    def setUp(self):

        self.centro = Centro.objects.create(sigla="gov", nome="Centro de Governança")
        self.centro_inativo = Centro.objects.create(sigla="out", nome="Outro Centro")
        self.unidade = Unidade.objects.create(nome_unidade="Unidade de Integridade", sigla_centro="gov")

        self.usuario = Usuario.objects.create_user(
            username="gestor_risco",
            password="SenhaSegura123!",
            centro_ativo=self.centro,
            unidade=self.unidade
        )

        self.usuario.centro_ativo = self.centro
        self.usuario.unidade = self.unidade
        self.usuario.save()
        self.usuario.centros_permitidos.add(self.centro)

        self.categoria = Categoria.objects.create(nome_categoria="Estratégico")
        self.desafio = Desafio.objects.create(numero=1, nome="Melhorar a Governança")

        self.risco_1 = Risco.objects.create(
            titulo="Falha em licitações",
            impacto=5,
            probabilidade=4,
            nivel="Crítico",
            status="Em Tratamento",
            unidade_responsavel=self.unidade,
            centro=self.centro,
            responsavel=self.usuario,
            categoria=self.categoria,
            desafio=self.desafio,
            id_estrutural="R-001"
        )

        self.risco_2 = Risco.objects.create(
            titulo="Atraso de cronograma",
            impacto=2,
            probabilidade=2,
            nivel="Baixo",
            status="Concluído",
            unidade_responsavel=self.unidade,
            centro=self.centro,
            responsavel=self.usuario,
            categoria=self.categoria,
            desafio=self.desafio,
            id_estrutural="R-002"
        )


        self.url_listar = reverse('listar_riscos')
        self.url_detalhes = reverse('get_risco_by_id', kwargs={'pk': self.risco_1.pk})
        self.url_criar = reverse('create_risco')
        self.url_atualizar = reverse('update_risco', kwargs={'pk': self.risco_1.pk})
        self.url_historico = reverse('historico_risco', kwargs={'id': self.risco_1.pk})


    def test_listar_riscos_sem_centro_ativo(self):

        self.usuario.centro_ativo = None
        self.usuario.save()
        self.client.force_authenticate(user=self.usuario)

        response = self.client.get(self.url_listar, {'q': 'licitações', 'limit': 10})

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['erro'], "Nenhum centro ativo selecionado!")

    def test_listar_riscos_sucesso_com_filtros(self):

        self.client.force_authenticate(user=self.usuario)

        response = self.client.get(self.url_listar, {'q': 'licitações', 'limit': 10})

        if response.status_code == 404:
            print(f"\n\n--- 🛑 ERRO DO SERIALIZER BARROU A CRIAÇÃO 🛑 ---")
            print(response.data)
            print("---------------------------------------------------\n\n")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['titulo'], "Falha em licitações")

    def test_listar_riscos_kpis_dashboard(self):
        self.client.force_authenticate(user=self.usuario)

        response = self.client.get(self.url_listar, {'count': 'true'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2)
        self.assertEqual(response.data['criticos'], 1)
        self.assertEqual(response.data['medios'], 0)
        self.assertEqual(response.data['em_tratamento'], 1)
        self.assertEqual(response.data['concluidos'], 1)


    def test_create_risco_sucesso(self):

        self.client.force_authenticate(user=self.usuario)

        payload = {
            "titulo": "Novo Risco de Teste",
            "descricao": "Descrição detalhada do risco",
            "status": "Identificação",
            "categoria": self.categoria.pk,
            "desafio": self.desafio.pk,
            "responsavel": self.usuario.pk,
            "unidade_responsavel": self.unidade.pk
        }

        response = self.client.post(self.url_criar, data=payload, format='json')
        if response.status_code == 400:
            print(f"\n[DEBUG] O Serializer barrou a entrada: {response.data}\n")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], "Risco criado com sucesso!")

        risco_criado = Risco.objects.get(titulo="Novo Risco de Teste")
        self.assertEqual(risco_criado.centro, self.centro)


    def test_update_risco_etapa_sucesso(self):

        self.client.force_authenticate(user=self.usuario)

        payload = {
            "impacto": 3,
            "probabilidade": 3,
            "nivel": "Médio"
        }

        response = self.client.patch(self.url_atualizar, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], "Etapa atualizada com sucesso!")


        self.risco_1.refresh_from_db()
        self.assertEqual(self.risco_1.impacto, 3)
        self.assertEqual(self.risco_1.probabilidade, 3)


    def test_get_risco_by_id_sucesso(self):

        self.client.force_authenticate(user=self.usuario)
        response = self.client.get(self.url_detalhes)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['titulo'], "Falha em licitações")

    def test_historico_risco(self):

        self.risco_1.status = "Monitorado"
        self.risco_1.save()


        response = self.client.get(self.url_historico)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 2)
        self.assertEqual(response.data[0]['acao'], "Atualizado")
        self.assertEqual(response.data[0]['status_na_epoca'], "Monitorado")