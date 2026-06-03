from django.db import models

class Unidade(models.Model):

    cod_estruturado = models.CharField(max_length=30, null=True, blank=True)
    nome_unidade = models.CharField(max_length=255, null=True, blank=True)
    nome_centro = models.CharField(max_length=255, null=True, blank=True)
    sigla_centro = models.CharField(max_length=10, null=True, blank=True)
    tipo_unidade = models.CharField(max_length=50, null=True, blank=True)
    situacao = models.CharField(max_length=30, null=True, blank=True)

    def __str__(self):
        return f"{self.nome_unidade} - {self.sigla_centro} - {self.nome_centro} - {self.tipo_unidade}"