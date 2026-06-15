#!/bin/sh

set -e

echo "Aguardando o banco de dados (Postgres) acordar..."
sleep 8

echo "Aplicando migrações do banco de dados..."
python manage.py makemigrations
python manage.py migrate

echo "Rodando scripts de população do banco de dados..."

python manage.py shell -c "import popular"
python manage.py shell -c "import popular_unidades"
python manage.py shell -c "import popular_desafios"

echo "Scripts finalizados. Iniciando o servidor Django..."

echo "Tudo pronto! Ligando a API..."
exec "$@"