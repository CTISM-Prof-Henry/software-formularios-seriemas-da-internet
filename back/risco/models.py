from contextlib import nullcontext
from django.db import models
from avaliacao.models import Avaliacao
from desafio.models import Desafio
from identificacao.models import Identificacao
from tratamento.models import Tratamento
from usuario.models import Usuario


class Risco(models.Model):

    descricao = models.CharField(max_length=250, null=True, blank=True)
    categoria = models.CharField(max_length=30, null=True, blank=True)
    responsavel = models.CharField(max_length=40, null=True, blank=True)
    data_criacao = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=25, null=True, blank=True)

    desafio = models.ForeignKey(Desafio, on_delete=models.SET_NULL, null=True, blank=True)
    identificacao = models.ForeignKey(Identificacao, on_delete=models.CASCADE)
    avaliacao = models.ForeignKey(Avaliacao, on_delete=models.CASCADE)
    tratamento = models.ForeignKey(Tratamento, on_delete=models.CASCADE)


    def __str__(self):
        return f"{self.descricao} - {self.identificacao} - {self.avaliacao} - {self.tratamento}"


class Usuario_risco(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    risco = models.ForeignKey(Risco, on_delete=models.CASCADE)

    papel = models.CharField(max_length=50)
    data_atribuicao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'usuario_risco'
        unique_together = ('usuario', 'risco')
