from django.db import models

class Categoria(models.Model):

    nome_categoria = models.CharField(max_length=100)
    descricao_categoria = models.CharField(max_length=200)

    def __str__(self):
        return str(self.nome_categoria)
