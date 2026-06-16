from importlib.metadata import requires

from django.db import models
from django.contrib.auth.models import AbstractUser
from unidade.models import Unidade


class Centro(models.Model):
    nome = models.CharField(max_length=255)
    sigla = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.sigla


class Usuario(AbstractUser):
    matricula = models.CharField(max_length=20, unique=True)
    PERFIS = [('Admin', 'Administrador'), ('Gestor', 'Gestor de Riscos'), ('Auditor', 'Auditor')]
    perfil_acesso = models.CharField(max_length=20, choices=PERFIS, default='Gestor')


    centro_ativo = models.ForeignKey(Centro, on_delete=models.SET_NULL, null=True, blank=True,
                                     related_name='usuarios_ativos')
    centros_permitidos = models.ManyToManyField(Centro, related_name='usuarios_permitidos', blank=True)

    unidade_ativa = models.ForeignKey(Unidade, on_delete=models.SET_NULL, null=True, blank=True,
                                      related_name='usuarios_ativos_unidade')
    unidades_permitidas = models.ManyToManyField(Unidade, related_name='usuarios_permitidos_unidade', blank=True)