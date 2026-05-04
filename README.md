
# Como usar

- Tenha instalado o DockerDesktop
- Abra o DockerDesktop
- Siga os passos

## Clone o repositorio
`git clone https://github.com/Rxmosx/GestorDeRisco.git`

## Acesse a pasta GestorDeRisco e use
`docker-compose up --build -d`

## Após os container serem criados e iniciados use o comando a seguir para criar as tabelas do Banco de Dados
`docker-compose exec backend python3.11 manage.py migrate`

### Se necessario rode
`docker-compose restart`

## No navegador acesse http://localhost:5173

## Projeto no Figma: https://www.figma.com/design/AGh7cnJG0QBh9PpLi7pjqv/Gestor-de-Risco?node-id=0-1&t=bYHcgpCLF86ryook-1

## Diagrama caso de uso

``` mermaid
graph LR
    subgraph Sistema ["Sistema de Riscos"]
        UC1((Criar Risco))
        UC2((Alterar Risco))
        UC3((Apagar Risco))
        UC4((Consultar Riscos))
        UC5((Gerar Relatório))
        UC6((Gerenciar Sistema))
    end

    U[Usuário]
    A[Admin]

    U --- UC1
    U --- UC2
    U --- UC3
    U --- UC4
    U --- UC5

    A --- UC6
    
    
    A -- é um --> U
```

## Diagrama de Classes
```mermaid
classDiagram
direction TB

class Usuario {
    -id : Serial
    +nome : String
    +email : String
    -senha : String
    +setor : String
    +perfil : String
    +login(email: String, senha: String) Boolean
    +logout() void
    +recuperarSenha(email: String) void
    +registrarRisco(descricao: String, categoria: CategoriaRisco) Risco
    +criarPlanejamento() Planejamento
}

class Planejamento {
    -id_planejamento : Serial
    +ano : int
    +descricao : String
    +data_inicio : Date
    +data_final : Date
    +criarPlanejamento(ano: int, descricao: String, data_inicio: Date, data_final: Date) void
    +encerrar(data_final: Date) void
    +listarDesafios() List
}

class Risco {
    -id_risco : Serial
    -id_planejamento : Serial
    +descricao : String
    +categoria : CategoriaRisco
    +responsavel : String
    +data_criacao : Date
    +status : StatusRisco
    +calcularNivel(probabilidade: int, impacto: int) int
    +avancarEtapa(novaEtapa: Etapa) void
    +getEtapaAtual() Etapa
}

class Desafio {
    -id_desafio : Serial
    +numero : int
    +nome : String
    +descricao : String
    +calcularProgresso(totalRiscos: int, riscosConcluidos: int) float
    +listarRiscos() List
}

class Relatorio {
    -id_relatorio : Serial
    +tipo : String
    +data_geracao : Date
    +gerar(tipo: String, planejamento: Planejamento) void
    +exportar(formato: String) File
}

class Identificacao {
    -id_identificacao : Serial
    +descricao_risco : String
    +causas : String
    +irregularidades : String
    +data_registro : Date
    +registrar(descricao: String, causas: String, irregularidades: String) void
    +validar() Boolean
}

class Avaliacao {
    -id_avaliacao : Serial
    +probabilidade : int
    +impacto : int
    -nivel_risco : int
    +contexto : String
    +classificacao : NivelRisco
    +calcularNivel(probabilidade: int, impacto: int) int
    -classificar(nivel: int) NivelRisco
}

class Tratamento {
    -id_tratamento : Serial
    +resposta : RespostaRisco
    +acao : String
    +responsavel : String
    +prazo : Date
    +prob_residual : int
    +impacto_residual : int
    +indicadores : String
    +registrar(resposta: RespostaRisco, acao: String, prazo: Date) void
    +atualizar(acao: String, prazo: Date, indicadores: String) void
}

class MatrizRisco {
    +gerarMatriz(riscos: List) Grid
    +plotarRiscos(riscos: List) void
    +filtrarPorNivel(nivel: NivelRisco) List
}

Usuario -- Planejamento
Usuario -- Risco
Desafio -- Risco
Risco -- Identificacao
Risco "0" -- "1" Avaliacao
Risco "0" -- "1" Tratamento
Planejamento -- Desafio
Relatorio -- Planejamento
Planejamento -- MatrizRisco
```

## Diagrama do Banco de Dados

![Diagrama do Banco de Dados](./assets/bd.png)

# Título do repositório

Descrição curta do repositório.

## Sumário

* [Pré-requisitos](#pré-requisitos)
* [Instalação](#instalação)
* [Instruções de uso](#instruções-de-uso)
* [Contato](#contato)
* [Bibliografia](#bibliografia)

## Pré-requisitos

Descreva aqui brevemente os pré-requisitos necessários para executar o código-fonte. Descreva também
a configuração mínima da máquina em que o código foi desenvolvido, e se alguma configuração em particular é essencial
para sua execução (por exemplo, placa de vídeo dedicada):

| Configuração        | Valor                    |
|---------------------|--------------------------|
| Sistema operacional | Windows 10 Pro (64 bits) |
| Processador         | Intel core i7 9700       |
| Memória RAM         | 16GB                     |
| Necessita rede?     | Sim                      |


## Instalação

Descreva aqui as instruções para instalação das ferramentas para execução do código-fonte: 

```bash
sudo apt-get install nano
```

## Instruções de Uso

Descreva aqui o passo-a-passo que outros usuários precisam realizar para conseguir executar com sucesso o código-fonte
deste projeto:

```bash
echo "olá mundo!"
```

## Contato

O repositório foi originalmente desenvolvido por Fulano: [fulano@ufsm.br]()

## Bibliografia

Adicione aqui entradas numa lista com a documentação pertinente:

* [Documentação coplin-db2](https://pypi.org/project/coplin-db2/)

