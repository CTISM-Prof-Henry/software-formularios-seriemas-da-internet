## 1. Como Clonar o Repositório

Abra o terminal na sua máquina local e execute o comando abaixo para baixar o código-fonte do projeto:

```bash
git clone https://github.com/CTISM-Prof-Henry/software-formularios-seriemas-da-internet.git
```

Após a conclusão do download, navegue até a pasta raiz do projeto:

```bash
cd software-formularios-seriemas-da-internet
```

---

## 2. Como Instalar o Docker e o Docker Compose

O projeto utiliza o Docker para garantir que o banco de dados (PostgreSQL), o backend (Django) e o frontend (React) rodem de forma idêntica e isolada em qualquer ambiente.

### No Arch Linux (via pacman)
Instale os pacotes estáveis diretamente dos repositórios oficiais:

```bash
sudo pacman -Syu docker docker-compose

sudo systemctl start docker

sudo systemctl enable docker
```

Para executar os comandos do Docker sem a necessidade de digitar `sudo` todas as vezes, adicione o seu usuário ao grupo do Docker:

```bash
sudo usermod -aG docker $USER
```
*Nota: É necessário encerrar a sua sessão atual (fazer logout) e entrar novamente no sistema para que essa permissão de grupo seja aplicada com sucesso.*

### No Ubuntu / Debian (via apt)
Caso outros desenvolvedores utilizem distribuições baseadas em Debian:

```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

---

## 3. Como Rodar os Containers

Com o Docker devidamente instalado e ativo, você pode construir as imagens e iniciar todo o ecossistema da aplicação (Banco de Dados, API Backend e Frontend) com um único comando executado na raiz do projeto:

```bash
docker-compose up -d --build
```

### Explicação das flags utilizadas:
* `-d` (Detached mode): Executa os containers em segundo plano, liberando o terminal para novos comandos.
* `--build`: Força o Docker a recompilar as imagens locais, garantindo que qualquer alteração nos arquivos `Dockerfile` ou no gerenciador de dependências (`requirements.txt`) seja processada.

### Verificando o status da execução:
Para certificar-se de que todos os serviços estão ativos e saudáveis, execute:

```bash
docker-compose ps
```