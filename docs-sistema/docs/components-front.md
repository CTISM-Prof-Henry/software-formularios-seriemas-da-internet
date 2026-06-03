# Arquitetura do Frontend (React)

O frontend do sistema foi construído utilizando a biblioteca **React**. A interface de usuário (UI) é baseada em uma arquitetura de componentes modulares, separados logicamente pelas funcionalidades do sistema de gestão de riscos.

---

## Estrutura de Componentes

Abaixo estão documentados os componentes centrais presentes no diretório da aplicação (`app/`), divididos por seus respectivos domínios:

### 1. Autenticação e Controle de Acesso
Componentes públicos responsáveis pela entrada, registro e gestão de credenciais dos usuários.

* **`Login.jsx`**: Tela de autenticação principal. Responsável por validar as credenciais e gerar/armazenar o token de sessão do usuário no navegador.
* **`CadastroUsuario.jsx`**: Formulário para solicitação de acesso de novos usuários. Inclui a busca assíncrona (com filtro dinâmico) das unidades da UFSM e a seleção do perfil de acesso (Gestor, Auditor, Colaborador).
* **`RecuperarSenha.jsx`**: Tela inicial do fluxo de recuperação de conta, onde o usuário informa o e-mail cadastrado para receber as instruções de redefinição.
* **`RedefinirSenha.jsx`**: Tela final do fluxo de recuperação, onde o usuário insere e confirma a sua nova senha de acesso após validação de segurança.

### 2. Módulo Interno (Gestão de Riscos)
Componentes privados acessíveis apenas após a autenticação, focados nas regras de negócio do sistema.

* **`Painel.jsx`**: Dashboard principal do sistema (visão pós-login). Exibe o resumo operacional, métricas e atalhos rápidos com base nas permissões do perfil do usuário logado.
* **`RegistroRisco.jsx`**: Tela de formulário dedicada à identificação, detalhamento e mapeamento de um novo risco detectado dentro de um departamento ou unidade da instituição.
* **`Riscos.jsx`**: Interface de listagem (tabela/inventário) que exibe de forma consolidada os riscos já mapeados, permitindo buscas e auditorias sistêmicas.
* **`Desafios.jsx`**: Tela focada no acompanhamento de desafios estratégicos, metas ou planos de ação vinculados aos tratamentos de risco.

### 3. Roteamento e Segurança
Componentes estruturais que não necessariamente renderizam uma tela inteira, mas controlam o fluxo da aplicação.

* **`RotaProtegida.jsx`**: Componente de controle de acesso (Wrapper). Ele envolve as rotas privadas do sistema (Painel, Riscos, Desafios) e intercepta a navegação, verificando se o usuário possui uma sessão/token válido. Caso não esteja autenticado, ele bloqueia o acesso e redireciona o usuário imediatamente para a tela de `Login.jsx`.