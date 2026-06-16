import json
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.core import mail
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import Usuario, Centro
from unidade.models import Unidade


class UsuarioViewsTestCase(APITestCase):

    def setUp(self):

        self.client = APIClient()

        self.unidade = Unidade.objects.create(
            nome_unidade="Unidade de Teste",
            sigla_centro="TST",
            nome_centro="Centro de Testes"
        )

        self.centro = Centro.objects.create(
            sigla="TST",
            nome="Centro de Testes"
        )


        self.usuario = Usuario.objects.create_user(
            username="testeuser",
            email="teste@ufsm.br",
            password="SenhaForte123!",
            first_name="João",
            last_name="Silva",
            matricula="1234567",
            unidade_ativa=self.unidade,
            centro_ativo=self.centro
        )


        self.url_listar = reverse('listar_usuarios')
        self.url_buscar_nome = reverse('buscar_usuarios')
        self.url_login = reverse('fazer_login')
        self.url_cadastrar = reverse('cadastrar_usuario')
        self.url_reset = reverse('recuperar_senha')
        # self.url_confirmar_reset = reverse('confirmar_reset_senha')


    def test_listar_usuarios_sucesso(self):

        response = self.client.get(self.url_listar)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)
        self.assertEqual(response.data[0]['first_name'], "João")

    def test_listar_usuarios_count(self):

        response = self.client.get(self.url_listar, {'count-users': 'true'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('count', response.data)
        self.assertEqual(response.data['count'], 1)

    def test_buscar_usuarios_by_name_curto(self):

        response = self.client.get(self.url_buscar_nome, {'q': 'J'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_buscar_usuarios_by_name_valido(self):

        response = self.client.get(self.url_buscar_nome, {'q': 'Joã'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['matricula'], "1234567")



    def test_get_usuario_by_id_sem_autenticacao(self):


        url = reverse('get_usuario_by_id', kwargs={'pk': self.usuario.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_usuario_by_id_com_autenticacao(self):

        self.client.force_authenticate(user=self.usuario)
        url = reverse('get_usuario_by_id', kwargs={'pk': self.usuario.id})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['matricula'], "1234567")


    def test_fazer_login_sucesso(self):

        payload = {
            'matricula': '1234567',
            'senha': 'SenhaForte123!'
        }
        response = self.client.post(self.url_login, data=json.dumps(payload), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('uid', response.json())
        self.assertEqual(response.json()['mensagem'], 'Login realizado com sucesso')

    def test_fazer_login_senha_incorreta(self):

        payload = {
            'matricula': '1234567',
            'senha': 'SenhaErrada'
        }
        response = self.client.post(self.url_login, data=json.dumps(payload), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_fazer_login_usuario_inexistente(self):

        payload = {
            'matricula': '000000',
            'senha': 'SenhaForte123!'
        }
        response = self.client.post(self.url_login, data=json.dumps(payload), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    def test_cadastrar_usuario_sucesso(self):

        payload = {
            'username': 'novouser',
            'first_name': 'Maria',
            'last_name': 'Souza',
            'matricula': '999999',
            'setor': self.unidade.id,
            'email': 'maria@ufsm.br',
            'password': 'Senha123'
        }
        response = self.client.post(self.url_cadastrar, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Usuario.objects.filter(matricula='999999').exists())

    def test_cadastrar_usuario_sem_setor(self):

        payload = {
            'username': 'novouser2',
            'matricula': '888888',
        }
        response = self.client.post(self.url_cadastrar, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['erro'], "É obrigatório selecionar um Centro/Unidade.")


    # def test_reset_senha_envio_email(self):
    #
    #     payload = {'email': 'teste@ufsm.br'}
    #     response = self.client.post(self.url_reset, data=payload, format='json')
    #
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(len(mail.outbox), 1)
    #     self.assertIn('Redefinicao de Senha', mail.outbox[0].subject)
    #
    # def test_confirmar_reset_senha_sucesso(self):
    #
    #     uid = urlsafe_base64_encode(force_bytes(self.usuario.pk))
    #     token = default_token_generator.make_token(self.usuario)
    #
    #
    #     payload = {
    #         'uid': uid,
    #         'token': token,
    #         'nova_senha': 'NovaSenhaSegura2026!'
    #     }
    #     response = self.client.post(self.url_confirmar_reset, data=payload, format='json')
    #
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #
    #     self.usuario.refresh_from_db()
    #     self.assertTrue(self.usuario.check_password('NovaSenhaSegura2026!'))