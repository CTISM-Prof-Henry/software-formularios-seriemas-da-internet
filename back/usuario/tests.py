from django.test import TestCase

from rest_framework.test import APITestCase
from rest_framework import status
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core import mail
from .models import Usuario


class UsuarioAPITests(APITestCase):

    def setUp(self):

        self.senha_teste = "senhaSegura@123"
        self.usuario = Usuario(
            username="20261010",
            matricula="20261010",
            email="teste@ufsm.br",
            first_name="João",
            last_name="Silva",
            setor="Politécnico",
            perfil_acesso="Gestor de Risco"
        )
        self.usuario.set_password(self.senha_teste)
        self.usuario.save()

        self.uid = urlsafe_base64_encode(force_bytes(self.usuario.pk))


        self.url_listar = '/api/usuarios/'
        self.url_get_usuario = f'/api/usuario/{self.uid}'
        self.url_login = '/api/login/'
        self.url_cadastro = '/api/cadastro/'
        self.url_reset = '/api/recuperar-senha/'


    def test_listar_usuarios_sucesso(self):
        response = self.client.get(self.url_listar)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['matricula'], "20261010")

    def test_get_usuario_sucesso(self):
        response = self.client.get(self.url_get_usuario)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], "teste@ufsm.br")

    def test_get_usuario_falha_uid_invalido(self):
        uid_falso = urlsafe_base64_encode(force_bytes(9999))

        response = self.client.get(f'/api/usuario/{uid_falso}')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], "Usuario nao existe!")


    def test_fazer_login_sucesso(self):
        dados_login = {
            "matricula": "20261010",
            "senha": self.senha_teste
        }

        response = self.client.post(self.url_login, dados_login, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['mensagem'], 'Login realizado com sucesso')
        self.assertIn('uid', response.json())

    def test_fazer_login_senha_incorreta(self):
        dados_login = {
            "matricula": "20261010",
            "senha": "senha_errada_123"
        }
        response = self.client.post(self.url_login, dados_login, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json()['erro'], 'Senha incorreta')

    def test_fazer_login_usuario_nao_encontrado(self):
        dados_login = {
            "matricula": "00000000",
            "senha": "qualquer_senha"
        }
        response = self.client.post(self.url_login, dados_login, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json()['erro'], 'Usuário não encontrado')


    def test_cadastrar_usuario_sucesso(self):
        novo_usuario = {
            "username": "20262020",
            "matricula": "20262020",
            "email": "novo@ufsm.br",
            "first_name": "Maria",
            "last_name": "Souza",
            "setor": "CT",
            "perfil_acesso": "Auditor",
            "password": "senhaForte!321"
        }

        response = self.client.post(self.url_cadastro, novo_usuario, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()['messagem'], 'Usuario cadastrado com sucesso!')
        self.assertEqual(Usuario.objects.count(), 2)

    def test_cadastrar_usuario_falha_dados_faltando(self):

        dados_invalidos = {
            "matricula": "20263030",
            "first_name": "Carlos"
        }

        response = self.client.post(self.url_cadastro, dados_invalidos, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detalhes', response.json())


    def test_reset_senha_sucesso_envia_email(self):
        dados_reset = {
            "email": "teste@ufsm.br"
        }

        response = self.client.post(self.url_reset, dados_reset, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('uid', response.json())
        self.assertIn('token', response.json())

        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("Redefinicao de Senha", mail.outbox[0].subject)

    def test_reset_senha_falha_email_inexistente(self):
        dados_reset = {
            "email": "email_fantasma@ufsm.br"
        }

        response = self.client.post(self.url_reset, dados_reset, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['erro'], 'Email nao existe entre os usuairos')