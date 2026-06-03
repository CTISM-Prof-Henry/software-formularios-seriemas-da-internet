from django.db import models
from django.contrib.auth.models import AbstractUser


class Usuario(AbstractUser):

    matricula = models.CharField(max_length=20, unique=True, null=True, blank=True)
    setor = models.ForeignKey('unidade.Unidade', on_delete=models.SET_NULL, null=True, blank=True)
    perfil_acesso = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return f"{self.username} - {self.matricula}"
