from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from usuario.models import Centro


class Planejamento(models.Model):
    STATUS_CHOICES = [
        ('Ativo', 'Ativo / Em Execução'),
        ('Encerrado', 'Encerrado / Concluído'),
    ]

    ano = models.IntegerField(
        validators=[MinValueValidator(2000), MaxValueValidator(2100)],
        help_text="Ano do ciclo institucional (ex: 2026)"
    )
    titulo = models.CharField(max_length=100, help_text="Ex: Ciclo Anual de Gestão de Riscos 2026")
    descricao = models.TextField(null=True, blank=True)
    data_inicio = models.DateField()
    data_fim = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Ativo')

    criado_por = models.ForeignKey('usuario.Usuario', on_delete=models.PROTECT, related_name='ciclos_criados')
    centro = models.ForeignKey(Centro, on_delete=models.CASCADE, null=True, blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        
        ordering = ['-data_criacao']


    def __str__(self):
        return f"Ciclo {self.ano} - {self.titulo}"