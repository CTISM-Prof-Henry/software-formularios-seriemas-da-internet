from django.db import models


class Risco(models.Model):
    codigo = models.CharField(max_length=10, null=True, blank=True)
    descricao = models.TextField()
    categoria = models.ForeignKey('categoria.Categoria', on_delete=models.PROTECT)
    desafio = models.ForeignKey('desafio.Desafio', on_delete=models.PROTECT)
    responsavel = models.ForeignKey('usuario.Usuario', on_delete=models.PROTECT)
    status = models.CharField(max_length=25, default="Identificação")

class AvaliacaoRisco(models.Model):

    risco = models.OneToOneField(Risco, on_delete=models.CASCADE, related_name='avaliacao')
    probabilidade = models.IntegerField()
    impacto = models.IntegerField()
    pontuacao = models.IntegerField()
    nivel = models.CharField(max_length=15)

class TratamentoRisco(models.Model):
    risco = models.OneToOneField(Risco, on_delete=models.CASCADE, related_name='tratamento')
    plano_acao = models.TextField()
    responsavel_execucao = models.CharField(max_length=100)



class UsuarioRisco(models.Model):
    usuario = models.ForeignKey('usuario.Usuario', on_delete=models.CASCADE)
    risco = models.ForeignKey(Risco, on_delete=models.CASCADE)

    data_atribuicao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'usuario_risco'
        unique_together = ('usuario', 'risco')
