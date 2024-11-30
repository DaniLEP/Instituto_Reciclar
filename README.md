# Documentação do Projeto: Sistema de Controle de Entrada e Saída de Alimentos

## Objetivo do Projeto

O projeto foi desenvolvido para facilitar a gestão de entrada e saída de alimentos da cozinha do Instituto Reciclar, automatizando processos e otimizando o trabalho de controle e estoque. Este sistema foi criado para uso interno, permitindo maior organização, economia de tempo e precisão nas operações.

---

## Funcionalidades

### Pedidos

Página destinada à criação e gerenciamento de pedidos.

#### Subfuncionalidades

- **Novo Pedido**  
  Permite realizar pedidos para fornecedores. O usuário pode consultar os produtos disponíveis, selecionar os itens necessários e adicioná-los à solicitação. É possível incluir diversos itens em um único pedido.

- **Status do Pedido**  
  Exibe os pedidos criados e permite a edição dos itens por meio de um botão, que abre uma página específica para ajustes nos produtos adicionados.

---

### Cadastro

Página dedicada ao gerenciamento de cadastros de produtos e fornecedores.

#### Subfuncionalidades

- **Cadastro de Produtos**  
  Permite adicionar novos produtos ao estoque. Ideal para casos em que um item não está cadastrado no sistema e precisa ser incluído, seja em pequenas unidades ou em grandes volumes.

- **Entrada de Produtos**  
  Gerencia a entrada de produtos no banco de dados. Possui:  
  - **Botão Adicionar**  
    Abre um formulário para registro do produto, enviando os dados ao banco de dados.  
  - **Botão Remover**  
    Exclui o produto do banco de dados.

- **Cadastro de Refeição Servida**  
  Registra os ingredientes utilizados e organiza a contagem de refeições servidas por período, categorizando quem foi atendido.

- **Cadastro de Fornecedor**  
  Permite o registro de novos fornecedores para atender às necessidades do sistema.

---

### Relatórios

Página para geração de relatórios detalhados com opções de consulta personalizada.

#### Subfuncionalidades

- **Estoque**  
  Permite ao usuário consultar os produtos disponíveis no sistema e acessar informações sobre o estoque.

- **Relatório de Refeições Servidas**  
  Mostra os dados das refeições servidas em um período selecionado.

- **Relatório Periódico**  
  Exibe dados de produtos removidos ou atualizados durante um período específico.

- **Relatório de Retiradas**  
  Detalha os produtos retirados do estoque em um período escolhido pelo usuário.

---

### Retirada

Gerencia a retirada de produtos do estoque.

#### Funcionalidades

- Consulta por nome ou SKU do produto.  
- Seleção de data e categoria do produto (Proteína, Mantimento ou Hortaliça).  
- Registro detalhado das retiradas para controle preciso do estoque.  
- **Histórico de Retiradas**  
  Página que registra todas as retiradas realizadas, oferecendo um histórico detalhado para manter o controle do estoque.

---

## Tecnologias Utilizadas

### Frontend

- **React**  
  Biblioteca para construção de interfaces e componentes do projeto.

- **Chart.js**  
  Biblioteca para criação de gráficos interativos.

- **CSS Inline e Tailwind CSS**  
  Ferramentas para estilização da interface.

### Backend

- **Node.js**  
  Ambiente de execução para JavaScript no servidor.

### API

- Conexão com o Firebase para interação entre frontend e banco de dados.

### Banco de Dados

- **Firebase**  
  Banco de dados em nuvem para armazenamento seguro e eficiente.

---

## Como Executar o Projeto

### Instalação das Dependências

Execute o seguinte comando no terminal para instalar as dependências do Node.js:

```bash
npm install
```
---

### Execução em Ambiente Local
Para iniciar o projeto no ambiente local, utilize o comando:

```bash
npm run dev
```
