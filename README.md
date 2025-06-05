# TaskSphere - Sistema de Gerenciamento de Projetos

Um sistema moderno e intuitivo para gerenciar projetos e tarefas, desenvolvido com React e TypeScript.

## 🌐 Deploy

🔗 **[Acesse a aplicação aqui](https://tasksphere-smoky.vercel.app/dashboard)**

## Sobre o Projeto

Com uma interface limpa inspirada no GitHub/Kanban, me desafiei a criar um sistema robusto e completo, usufruindo do poder do React. Esse projeto foi puramente focado em mostrar habilidades frontend com React, com utilização de contextos avançados e design atômico para reutilização de componentes personalizados. Não há backend real porque não é o foco do projeto, mas TaskShere te permite explorar todas as funcionalidades da aplicação com o uso de localStorage, simulando um backend e banco de dados real.

### Principais Funcionalidades

- **Dashboard Completo**: Visão geral de todos os projetos com métricas em tempo real
- **Gerenciamento de Projetos**: Criar, editar e organizar projetos com facilidade
- **Sistema Kanban**: Quadro visual para acompanhar o progresso das tarefas
- **Colaboração**: Adicionar e gerenciar colaboradores nos projetos
- **Estatísticas**: Acompanhar progresso, tarefas concluídas e produtividade
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile

### Tecnologias Utilizadas

- **Frontend**: React + TypeScript
- **Estilização**: Tailwind CSS
- **Roteamento**: React Router DOM
- **Drag & Drop**: @dnd-kit e @hello-pangea/dnd
- **Ícones**: Lucide React
- **Persistência**: Local Storage (para demonstração)

## Como Executar Localmente

### Pré-requisitos

- Node.js (versão 16 ou superior)
- pnpm ou qualquer gerenciador de pacotes...

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/lorenzochaves/tasksphere.git
cd tasksphere
```

2. Instale as dependências:
```bash
pnpm install
```

3. Execute o projeto:
```bash
pnpm start
```

4. Acesse `http://localhost:3000` no seu navegador

## Estrutura do Projeto

```
src/
├── components/          # Componentes organizados por Atomic Design
│   ├── atoms/          # Componentes básicos (Button, Typography, etc)
│   ├── molecules/      # Combinações de atoms (TaskCard, etc)
│   ├── organisms/      # Componentes complexos (KanbanBoard, Sidebar)
│   ├── templates/      # Layout templates
│   └── pages/          # Páginas da aplicação
├── contexts/           # Contextos React (Auth, Toast, Modal)
├── services/           # Serviços e APIs
├── types/              # Definições TypeScript
├── lib/                # Utilitários e helpers
└── assets/             # Recursos estáticos
```

## Funcionalidades Detalhadas

### Dashboard
- Métricas gerais de todos os projetos
- Gráficos de progresso e produtividade
- Acesso rápido aos projetos recentes
- Estatísticas de tarefas por status

### Gerenciamento de Projetos
- Criação de projetos com nome, descrição e prazos
- Edição completa de informações do projeto
- Sistema de colaboradores com diferentes permissões
- Exclusão segura com confirmação

### Sistema Kanban
- Três colunas: A Fazer, Em Progresso, Concluído
- Drag & drop para mover tarefas entre colunas
- Criação rápida de tarefas
- Detalhes completos de cada tarefa
- Prazos e prioridades

### Colaboração
- Adicionar colaboradores por email
- Diferentes níveis de permissão
- Visualização de todos os membros do projeto
- Histórico de atividades (planejado)

## Interface e UX

O design foi pensado para ser:
- **Limpo e moderno**: Friendly dark theme.
- **Intuitivo**: Fluxos de trabalho naturais
- **Responsivo**: Funciona bem em qualquer dispositivo
- **Acessível**: Componentes com boa acessibilidade
- **Performático**: Otimizações para carregamento rápido

### Tema Visual
- Paleta de cores escura para personalização de colunas
- Gradientes sutis azul-verde para elementos importantes, identidade da nossa pagina
- Typography consistente e legível
- Espaçamentos harmoniosos

## Decisões Técnicas

### Por que React + TypeScript?
- Type safety para reduzir bugs
- Melhor experiência de desenvolvimento
- Facilita manutenção e escalabilidade

### Por que Tailwind CSS?
- Desenvolvimento mais rápido
- Consistência visual
- Bundle otimizado
- Responsividade facilitada

### Por que Atomic Design?
- Componentes reutilizáveis
- Escalabilidade da aplicação
- Manutenção simplificada
- Testes mais focados

### Por que Local Storage?
- Demonstração sem necessidade de backend
- Funciona offline
- Simplicidade para prototipação
- Fácil migração para API real
