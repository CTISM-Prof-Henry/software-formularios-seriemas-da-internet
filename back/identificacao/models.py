from django.db import models


class Identificacao(models.Model):

    descricao = models.CharField(max_length=250, null=True, blank=True)
    causas = models.CharField(max_length=250, null=True, blank=True)
    irregularidades = models.CharField(max_length=250, null=True, blank=True)
    data_registro = models.DateField(null=True, blank=True)

    risco = models.ForeignKey('risco.Risco', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.descricao} - {self.data_registro}"
