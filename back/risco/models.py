from django.db import models




class Risco(models.Model):

    descricao = models.CharField(max_length=250, null=True, blank=True)
    categoria = models.CharField(max_length=50, null=True, blank=True)
    responsavel = models.CharField(max_length=40, null=True, blank=True)
    data_criacao = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=25, null=True, blank=True)

    desafio = models.ForeignKey('desafio.Desafio', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.descricao} - {self.data_criacao}"


class UsuarioRisco(models.Model):
    usuario = models.ForeignKey('usuario.Usuario', on_delete=models.CASCADE)
    risco = models.ForeignKey(Risco, on_delete=models.CASCADE)

    data_atribuicao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'usuario_risco'
        unique_together = ('usuario', 'risco')
