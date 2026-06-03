import json
import os
from django.db import migrations


def carregar_unidades_json(apps, schema_editor):
    Unidade = apps.get_model('unidade', 'Unidade')
    caminho_json = os.path.join(os.path.dirname(__file__), '../../unidades_base.json')

    if os.path.exists(caminho_json):
        with open(caminho_json, 'r', encoding='utf-8') as f:
            dados = json.load(f)
            for item in dados:
                Unidade.objects.get_or_create(
                    codigo_estruturado=item.get('COD_ESTRUTURADO'),
                    nome=item.get('NOME_UNIDADE'),
                    centro=item.get('NOME_CENTRO'),
                    sigla_centro=item.get('SIGLA_CENTRO'),
                    tipo=item.get('TIPO_UNIDADE'),
                    situacao=item.get('SITUACAO')
                )


class Migration(migrations.Migration):
    dependencies = [
        ('unidade', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(carregar_unidades_json),
    ]