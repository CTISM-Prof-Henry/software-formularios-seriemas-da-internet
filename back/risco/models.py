from django.db import models


class Risco(models.Model):

    data_criacao = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=25, null=True, blank=True)

    categoria = models.ForeignKey('categoria.Categoria', on_delete=models.CASCADE, null=True, blank=True)
    unidade_responsavel = models.ForeignKey('unidade.Unidade', on_delete=models.SET_NULL, null=True, blank=True)
   

    def __str__(self):
        return f"{self.categoria} - {self.data_criacao}"


class UsuarioRisco(models.Model):
    usuario = models.ForeignKey('usuario.Usuario', on_delete=models.CASCADE)
    risco = models.ForeignKey(Risco, on_delete=models.CASCADE)

    data_atribuicao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'usuario_risco'
        unique_together = ('usuario', 'risco')
