from django.db import models

class Avaliacao(models.Model):

    probabilidade = models.FloatField()
    impacto = models.IntegerField()
    nivel_risco = models.IntegerField()
    contexto = models.CharField(max_length=200)
    classificacao = models.CharField(max_length=200)