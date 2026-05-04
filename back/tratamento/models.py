from django.db import models

class Tratamento(models.Model):

    resposta = models.CharField(max_length=250)
    acao = models.CharField(max_length=250)
    responsavel = models.CharField(max_length=250)
    prazo = models.DateField()
    prob_residual = models.IntegerField()
    impacto_residual = models.IntegerField()
    indicadores = models.CharField(max_length=250)

