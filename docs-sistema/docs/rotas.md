# Rotas e Endpoints do Sistema

Este documento mapeia todas as rotas de navegação da interface de usuário (Frontend) e os endpoints de comunicação com o servidor (Backend API).

---

## Rotas do Frontend (React)

O roteamento das páginas no navegador é gerenciado pelo **React Router**. Abaixo estão os caminhos de URL que o usuário acessa para interagir com o sistema.

| Rota (URL)  | Componente Renderizado | Descrição e Funcionalidade                                                                                                                                      |
|:------------|:-----------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/`         | `<Login />`            | Página inicial do sistema. Responsável pela autenticação e entrada dos usuários já registrados.                                                                 |
| `/cadastro` | `<CadastroUsuario />`  | Tela com o formulário de solicitação de acesso. Permite cadastro de matrícula, escolha do perfil (Auditor, Gestor, Colaborador) e vinculação à unidade da UFSM. |


---

## Rotas do Backend (API REST Django)

A comunicação entre o React e o banco de dados é feita exclusivamente através da nossa API RESTful construída com **Django REST Framework**. O endereço base da API local é `http://localhost:8000`.

### Endpoints de Usuários

|  Método  | Endpoint             | Descrição                                                                            | Payload (Corpo da Requisição)                                                                  |
|:--------:|:---------------------|:-------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------|
| **POST** | `/api/usuario/`      | Cria um novo usuário no banco de dados e vincula ao seu respectivo perfil e unidade. | JSON com `username`, `first_name`, `email`, `password`, `matricula`, `setor`, `perfil_acesso`. |
 | **GET**  | `/api/usuario/{uid}` | Retorna p usuário com o UID especificado                                             | JSON com `uid`                                                                                 | 

### Endpoints de Unidades e Setores

| Método  | Endpoint         | Descrição                                         | Parâmetros de Busca                                                                                                                                                             |
|:-------:|:-----------------|:--------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **GET** | `/api/unidades/` | Retorna a lista das unidades cadastradas na UFSM. | `?search={termo}`: Filtra as unidades retornando um array reduzido (ex: máximo de 20 resultados) que combinem o termo com o nome ou a sigla. Se omitido, retorna a lista vazia. |

> **Nota de Arquitetura:** O endpoint de listagem de unidades exige o parâmetro `search` com pelo menos 2 a 3 caracteres. Essa trava no backend impede o descarregamento massivo das mais de 5.000 unidades cadastradas, garantindo alta performance na interface do React.