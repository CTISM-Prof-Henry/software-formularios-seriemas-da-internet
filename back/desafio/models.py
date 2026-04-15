from django.db import models


class Desafio(models.Model):

    numero = models.IntegerField()
    nome = models.CharField(max_length=50)
    descricao = models.CharField(max_length=250)

    def __str__(self):
        return f"{self.numero} - {self.nome}"
