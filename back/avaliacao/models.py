from django.db import models



class Avaliacao(models.Model):

    probabilidade = models.FloatField()
    impacto = models.IntegerField()
    nivel_risco = models.IntegerField()
    contexto = models.CharField(max_length=200)
    classificacao = models.CharField(max_length=200)

    risco = models.ForeignKey('risco.Risco', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.contexto} - {self.classificacao}"