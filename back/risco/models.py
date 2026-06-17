from django.db import models
from simple_history.models import HistoricalRecords
from planejamento.models import Planejamento
from usuario.models import Centro, Usuario


class Risco(models.Model):

    # --- ETAPA 1: Identificação e Análise
    id_estrutural = models.CharField(max_length=50, null=True, blank=True)
    codigo = models.CharField(max_length=10, null=True, blank=True)
    titulo = models.CharField(max_length=100, null=True, blank=True)
    categoria = models.ForeignKey('categoria.Categoria', on_delete=models.PROTECT)
    desafio = models.ForeignKey('desafio.Desafio', on_delete=models.PROTECT)
    responsavel = models.ForeignKey('usuario.Usuario', on_delete=models.PROTECT)
    unidade_responsavel = models.ForeignKey('unidade.Unidade', on_delete=models.PROTECT)
    status = models.CharField(max_length=25, default="Identificação")
    centro = models.ForeignKey(Centro, on_delete=models.SET_NULL, null=True, blank=True)
    descricao = models.TextField(help_text="Descrição do evento de risco")
    processo_associado = models.CharField(max_length=255, null=True, blank=True)
    causas = models.TextField(null=True, blank=True)
    consequencias = models.TextField(null=True, blank=True)
    data_criacao = models.DateField(auto_now_add=True)

    # --- ETAPA 2: Avaliação
    controles_existentes = models.TextField(null=True, blank=True, help_text="Controles que a instituição já possui")
    efetividade_controles = models.CharField(max_length=50, null=True, blank=True)
    probabilidade = models.IntegerField(null=True, blank=True)
    impacto = models.IntegerField(null=True, blank=True)
    pontuacao = models.IntegerField(null=True, blank=True)
    nivel = models.CharField(max_length=15, null=True, blank=True)

    # --- ETAPA 3: Tratamento
    resposta_risco = models.CharField(max_length=50, null=True, blank=True)  #
    tipo_acao = models.CharField(max_length=50, null=True, blank=True)
    acao_tratamento = models.TextField(null=True, blank=True)
    justificativa_acao = models.TextField(null=True, blank=True)
    como_implementar = models.TextField(null=True, blank=True)
    responsavel_tratamento = models.CharField(max_length=150, null=True, blank=True)
    local_implementacao = models.CharField(max_length=150, null=True, blank=True)
    prazo_implementacao = models.DateField(null=True, blank=True)
    recursos_necessarios = models.CharField(max_length=255, null=True, blank=True)

    # --- Planejamento do Risco Residual ---
    probabilidade_residual = models.IntegerField(null=True, blank=True)
    impacto_residual = models.IntegerField(null=True, blank=True)
    indicadores_monitoramento = models.TextField(null=True, blank=True)

    # --- ETAPA 4: Monitoramento Contínuo
    status_tratamento = models.CharField(max_length=50, default="Não Iniciado")
    resultados_alcancados = models.TextField(null=True, blank=True)
    data_proxima_avaliacao = models.DateField(null=True, blank=True)
    data_resolucao = models.DateField(null=True, blank=True)

    versao = models.IntegerField(default=1)
    history = HistoricalRecords()
    ciclo = models.ForeignKey('planejamento.Planejamento', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.codigo or 'S/C'} - {self.descricao[:30]}..."


class RecomendacaoAuditoria(models.Model):
    risco = models.ForeignKey(Risco, related_name='recomendacoes', on_delete=models.CASCADE)
    auditor = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True)
    texto = models.TextField()
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Recomendação de {self.auditor} para {self.risco.id_estrutural}"
