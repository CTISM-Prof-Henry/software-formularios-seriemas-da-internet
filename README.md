# Como usar

- Tenha instalado o DockerDesktop
- Abra o DockerDesktop
- Siga os passos

## Clone o repositorio
`git clone https://github.com/Rxmosx/GestorDeRisco.git`

## Acesse a pasta GestorDeRisco e use
`docker-compose up --build -d`

## Após os container serem criados e iniciados use o comando a seguir para criar as tabelas do Banco de Dados
`docker-compose backend python3.11 manage.py migrate`

### Se necessario rode
`docker-compose restart`

## No navegador acesse http://localhost:5173

