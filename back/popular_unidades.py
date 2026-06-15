import json
from unidade.models import Unidade

try:
    # Abre o arquivo JSON garantindo a acentuação correta
    with open('unidades_ufsm.json', 'r', encoding='utf-8') as f:
        dados = json.load(f)

    # Faz o loop por cada item do arquivo JSON
    for item in dados:
        # Usamos o get_or_create baseado no CÓDIGO ESTRUTURADO para garantir unicidade
        unidade, criado = Unidade.objects.get_or_create(
            cod_estruturado=item.get('COD_ESTRUTURADO'),
            defaults={
                'nome_unidade': item.get('NOME_UNIDADE'),
                'nome_centro': item.get('NOME_CENTRO'),
                'sigla_centro': item.get('SIGLA_CENTRO'),
                'tipo_unidade': item.get('TIPO_UNIDADE'),
                'situacao': item.get('SITUACAO'),
            }
        )

        if criado:
            print(f"Unidade '{unidade.nome_unidade}' cadastrada com sucesso!")
        else:
            print(f"Unidade '{unidade.nome_unidade}' já existia no banco.")
            break

except FileNotFoundError:
    print("Erro: O arquivo 'unidades_ufsm.json' não foi encontrado na raiz do projeto.")
except json.JSONDecodeError:
    print("Erro: O arquivo 'unidades_ufsm.json' está mal formatado.")
except Exception as e:
    print(f"Ocorreu um erro inesperado: {str(e)}")
