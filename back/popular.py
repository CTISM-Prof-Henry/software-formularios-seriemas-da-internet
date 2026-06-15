import json
from categoria.models import Categoria

try:
    # Abre o arquivo JSON garantindo a acentuação correta
    with open('categorias.json', 'r', encoding='utf-8') as f:
        dados = json.load(f)

    # Faz o loop por cada item do arquivo JSON
    for item in dados:
        # Usamos o get_or_create para evitar duplicar dados se rodar o script duas vezes
        categoria, criado = Categoria.objects.get_or_create(
            # Buscamos pelo nome para garantir unicidade (já que no JSON não passamos ID)
            nome_categoria=item.get('nome'),
            defaults={
                'descricao_categoria': item.get('descricao'),
            }
        )

        if criado:
            print(f"Categoria '{categoria.nome_categoria}' cadastrada com sucesso!")
        else:
            print(f"Categoria '{categoria.nome_categoria}' já existia no banco.")
            break

except FileNotFoundError:
    print("Erro: O arquivo 'categorias.json' não foi encontrado na raiz do projeto.")
except json.JSONDecodeError:
    print("Erro: O arquivo 'categorias.json' está mal formatado.")
except Exception as e:
    print(f"Ocorreu um erro inesperado: {str(e)}")