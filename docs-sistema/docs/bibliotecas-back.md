# Bibliotecas e Dependências do Backend

Este documento lista as principais bibliotecas Python utilizadas no desenvolvimento do backend e explica a função de cada uma delas na arquitetura do sistema.

## Principais Tecnologias

* **Django:** O framework web principal utilizado para construir a lógica do servidor, gerenciar a estrutura do banco de dados (ORM) e fornecer o painel de administração.
* **Django REST Framework (djangorestframework):** Extensão do Django focada na construção da API RESTful. É responsável por fornecer as *Views*, gerenciar os *Serializers* (que convertem os dados complexos do banco em JSON) e lidar com as requisições HTTP (`GET`, `POST`).
* **psycopg2-binary (ou psycopg2):** Adaptador de banco de dados PostgreSQL para Python. É a biblioteca que traduz os comandos do Django para que ele consiga ler e gravar dados no container do banco de dados Postgres.
* **django-cors-headers:** Biblioteca de segurança essencial que adiciona os cabeçalhos de CORS (*Cross-Origin Resource Sharing*). Ela é o que permite que o frontend em React (que roda numa porta diferente) consiga consumir os dados da API do Django sem ser bloqueado pelo navegador.

## Estrutura do `requirements.txt`

Abaixo está a base do arquivo `requirements.txt` contendo as dependências necessárias para o funcionamento do container do backend. 

```text
Django>=4.2,<5.0
djangorestframework>=3.14.0
psycopg2-binary>=2.9.9
django-cors-headers>=4.3.1
```
*(Nota: As versões podem variar dependendo do momento da instalação, mas estas representam as bases estáveis para o ecossistema).*

## Gerenciamento de Instalação

No fluxo normal de desenvolvimento com **Docker**, você não precisa instalar essas bibliotecas manualmente. Elas são instaladas automaticamente dentro do container durante o processo de *build*, conforme as instruções do `Dockerfile`.

Caso haja necessidade de atualizar ou instalar manualmente no seu ambiente virtual local (`.venv`), utilize o comando:

```bash
pip install -r requirements.txt
```

Para salvar novas bibliotecas instaladas no projeto para dentro do arquivo, utilize:

```bash
pip freeze > requirements.txt
```