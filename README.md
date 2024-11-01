# Gerenciamento de Livros

Este projeto é uma aplicação web para gerenciamento de livros, permitindo que administradores adicionem, editem e removam livros, enquanto usuários comuns podem visualizar e acessar os detalhes dos livros. 

## Arquitetura do Projeto

O projeto é estruturado da seguinte forma:

- **Frontend**: Desenvolvido em **Next.js** com **React** e **Tailwind CSS** para estilização.
- **Backend**: Utiliza um **JSON Server** para simular uma API REST para armazenamento e recuperação de dados.
- **Gerenciamento de Estado**: O estado é gerenciado através de hooks do React, sem necessidade de bibliotecas de gerenciamento de estado adicionais.

## Funcionalidades Principais

- **Painel do Administrador**:
  - Adicionar, editar e remover livros.
  - Criar e remover administradores.
  - Listar todos os livros e administradores.
  - Visualizar detalhes dos livros, incluindo imagem, título, autor e sinopse.

- **Painel do Usuário**:
  - Visualizar todos os livros disponíveis.
  - Acessar detalhes dos livros.

## Tecnologias Utilizadas

- **React**
- **Next.js**
- **Tailwind CSS**
- **JSON Server**

## Instalação e Configuração

Siga os passos abaixo para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn

### Passo 1: Clonar o Repositório

```bash
git clone
cd gerenciando-livros

### Passo 2: Instalar Dependências

npm install

### Passo 3: Configurar o JSON Server

Para configurar o JSON Server, crie um arquivo chamado db.json na raiz do seu projeto com o seguinte conteúdo:
{
  "books": [],
  "users": []
}

### Passo 4: Executar o JSON Server

npx json-server --watch db.json --port 5000


### Passo 5: Executar o Projeto Next.js

npm run dev

