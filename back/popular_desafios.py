import json
from desafio.models import Desafio

try:
    # Abre o arquivo JSON garantindo a acentuação correta
    with open('desafios.json', 'r', encoding='utf-8') as f:
        dados = json.load(f)

    # Faz o loop por cada item do arquivo JSON
    for item in dados:
        # Usamos o get_or_create baseado no número/id para evitar duplicados
        desafio, criado = Desafio.objects.get_or_create(
            numero=item.get('numero'), # Identificador único do desafio (Ex: "01")
            defaults={
                'nome': item.get('nome'),
                'descricao': item.get('descricao') or '', # Se a descrição for vazia "", salva como texto vazio
            }
        )

        if criado:
            print(f"Desafio '{desafio.nome}' cadastrado com sucesso!")
        else:
            print(f"Desafio '{desafio.nome}' já existia no banco.")
            break

except FileNotFoundError:
    print("Erro: O arquivo 'desafios.json' não foi encontrado.")
except Exception as e:
    print(f"Ocorreu um erro: {str(e)}")