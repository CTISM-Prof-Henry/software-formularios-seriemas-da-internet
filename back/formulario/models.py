from django.db import models
from django.conf import settings


class Formulario(models.Model):

    setor = models.CharField(max_length=25)
    tipo_risco = models.CharField(max_length=25)
    risco_identificado = models.CharField(max_length=25)
    probabilidade = models.IntegerField()
    impacto = models.IntegerField()
    nivel_risco = models.IntegerField()
    eficacia_residual = models.IntegerField()
    nivel_residual = models.IntegerField()

    usuario = models.ForeignKey(settings.AUTH_USER_MODEL,
                                on_delete=models.SET_NULL,
                                null=True,
                                blank=True,
                                )

    def __str__(self):
        return f"Risco: {self.risco_identificado} | Setor: {self.setor}"
