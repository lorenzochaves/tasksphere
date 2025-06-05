// src/services/localStorageApi.ts
import type { Project, Task, User, StoredUser } from "../types"

const STORAGE_KEYS = {
  users: 'tasksphere_users',
  projects: 'tasksphere_projects', 
  tasks: 'tasksphere_tasks',
  currentUser: 'tasksphere_current_user'
}

// Dados iniciais (só carregados se não existirem no localStorage)
// Atualizar a função getInitialData() no localStorageApi.ts
const getInitialData = () => ({
  users: [
    {
      id: "1",
      name: "Lorenzo Chaves",
      email: "lorenzo@tasksphere.com",
      password: "123456",
      avatar: "https://img.freepik.com/vetores-gratis/ilustracao-do-jovem-sorridente_1308-174669.jpg?semt=ais_items_boosted&w=740",
      createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
      id: "2",
      name: "Maria Silva",
      email: "maria@example.com",
      password: "123456",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b787?w=40&h=40&fit=crop&crop=face",
      createdAt: "2024-01-02T00:00:00.000Z"
    },
    {
      id: "3",
      name: "João Santos",
      email: "joao@example.com",
      password: "123456",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      createdAt: "2024-01-03T00:00:00.000Z"
    },
    {
      id: "4",
      name: "Ana Costa",
      email: "ana@example.com",
      password: "123456",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      createdAt: "2024-01-04T00:00:00.000Z"
    },
    {
      id: "5",
      name: "Carlos Lima",
      email: "carlos@example.com",
      password: "123456",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      createdAt: "2024-01-05T00:00:00.000Z"
    },
    {
      id: "6",
      name: "Julia Mendes",
      email: "julia@example.com",
      password: "123456",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face",
      createdAt: "2024-01-06T00:00:00.000Z"
    },
    {
      id: "7",
      name: "Pedro Oliveira",
      email: "pedro@example.com",
      password: "123456",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      createdAt: "2024-01-07T00:00:00.000Z"
    },
    {
      id: "8",
      name: "Sofia Rodrigues",
      email: "sofia@example.com",
      password: "123456",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face",
      createdAt: "2024-01-08T00:00:00.000Z"
    }
  ] as StoredUser[],

  projects: [
    // Projetos onde Lorenzo é OWNER (10 projetos)
    {
      id: "1",
      name: "TaskSphere Platform",
      description: "Sistema completo de gerenciamento de projetos e tarefas",
      start_date: "2024-01-01",
      end_date: "2024-06-30",
      color: "#3B82F6",
      creator_id: "1",
      collaborators: [
        { id: "2", name: "Maria Silva", email: "maria@example.com", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b787?w=40&h=40&fit=crop&crop=face" },
        { id: "3", name: "João Santos", email: "joao@example.com", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" }
      ],
      created_at: "2024-01-01T00:00:00.000Z",
      updated_at: "2024-01-15T00:00:00.000Z"
    },
    {
      id: "2",
      name: "E-commerce Mobile App",
      description: "Aplicativo mobile para vendas online",
      start_date: "2024-02-01",
      end_date: "2024-08-31",
      color: "#10B981",
      creator_id: "1",
      collaborators: [
        { id: "4", name: "Ana Costa", email: "ana@example.com", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" },
        { id: "5", name: "Carlos Lima", email: "carlos@example.com", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" }
      ],
      created_at: "2024-02-01T00:00:00.000Z",
      updated_at: "2024-02-10T00:00:00.000Z"
    },
    {
      id: "3",
      name: "Dashboard Analytics",
      description: "Dashboard para análise de dados em tempo real",
      start_date: "2024-01-15",
      end_date: "2024-05-15",
      color: "#8B5CF6",
      creator_id: "1",
      collaborators: [
        { id: "6", name: "Julia Mendes", email: "julia@example.com", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face" }
      ],
      created_at: "2024-01-15T00:00:00.000Z",
      updated_at: "2024-01-20T00:00:00.000Z"
    },
    {
      id: "4",
      name: "API Gateway",
      description: "Sistema de gateway para microserviços",
      start_date: "2024-03-01",
      end_date: "2024-07-31",
      color: "#F59E0B",
      creator_id: "1",
      collaborators: [
        { id: "7", name: "Pedro Oliveira", email: "pedro@example.com", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" },
        { id: "2", name: "Maria Silva", email: "maria@example.com", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b787?w=40&h=40&fit=crop&crop=face" }
      ],
      created_at: "2024-03-01T00:00:00.000Z",
      updated_at: "2024-03-05T00:00:00.000Z"
    },
    {
      id: "5",
      name: "CRM System",
      description: "Sistema de gestão de relacionamento com clientes",
      start_date: "2024-02-15",
      end_date: "2024-09-30",
      color: "#EF4444",
      creator_id: "1",
      collaborators: [
        { id: "8", name: "Sofia Rodrigues", email: "sofia@example.com", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face" },
        { id: "3", name: "João Santos", email: "joao@example.com", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" }
      ],
      created_at: "2024-02-15T00:00:00.000Z",
      updated_at: "2024-02-20T00:00:00.000Z"
    },
    {
      id: "6",
      name: "DevOps Pipeline",
      description: "Automatização de deploy e CI/CD",
      start_date: "2024-01-20",
      end_date: "2024-04-30",
      color: "#06B6D4",
      creator_id: "1",
      collaborators: [
        { id: "4", name: "Ana Costa", email: "ana@example.com", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" }
      ],
      created_at: "2024-01-20T00:00:00.000Z",
      updated_at: "2024-01-25T00:00:00.000Z"
    },
    {
      id: "7",
      name: "Design System",
      description: "Sistema de design unificado para produtos",
      start_date: "2024-03-15",
      end_date: "2024-06-15",
      color: "#84CC16",
      creator_id: "1",
      collaborators: [
        { id: "6", name: "Julia Mendes", email: "julia@example.com", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face" },
        { id: "8", name: "Sofia Rodrigues", email: "sofia@example.com", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face" }
      ],
      created_at: "2024-03-15T00:00:00.000Z",
      updated_at: "2024-03-18T00:00:00.000Z"
    },
    {
      id: "8",
      name: "Monitoring System",
      description: "Sistema de monitoramento de aplicações",
      start_date: "2024-04-01",
      end_date: "2024-08-01",
      color: "#F97316",
      creator_id: "1",
      collaborators: [
        { id: "5", name: "Carlos Lima", email: "carlos@example.com", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" }
      ],
      created_at: "2024-04-01T00:00:00.000Z",
      updated_at: "2024-04-03T00:00:00.000Z"
    },
    {
      id: "9",
      name: "Security Audit",
      description: "Auditoria de segurança dos sistemas",
      start_date: "2024-03-10",
      end_date: "2024-05-10",
      color: "#DC2626",
      creator_id: "1",
      collaborators: [
        { id: "7", name: "Pedro Oliveira", email: "pedro@example.com", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" },
        { id: "2", name: "Maria Silva", email: "maria@example.com", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b787?w=40&h=40&fit=crop&crop=face" }
      ],
      created_at: "2024-03-10T00:00:00.000Z",
      updated_at: "2024-03-12T00:00:00.000Z"
    },
    {
      id: "10",
      name: "Documentation Portal",
      description: "Portal centralizado de documentação técnica",
      start_date: "2024-02-20",
      end_date: "2024-06-20",
      color: "#7C3AED",
      creator_id: "1",
      collaborators: [
        { id: "3", name: "João Santos", email: "joao@example.com", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
        { id: "6", name: "Julia Mendes", email: "julia@example.com", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face" }
      ],
      created_at: "2024-02-20T00:00:00.000Z",
      updated_at: "2024-02-22T00:00:00.000Z"
    },

    // Projetos onde Lorenzo é COLABORADOR (10 projetos)
    {
      id: "11",
      name: "Marketing Automation",
      description: "Automatização de campanhas de marketing",
      start_date: "2024-01-10",
      end_date: "2024-05-30",
      color: "#EC4899",
      creator_id: "2",
      collaborators: [
        { id: "1", name: "Lorenzo Chaves", email: "lorenzo@tasksphere.com", avatar: "https://img.freepik.com/vetores-gratis/ilustracao-do-jovem-sorridente_1308-174669.jpg?semt=ais_items_boosted&w=740" },
        { id: "4", name: "Ana Costa", email: "ana@example.com", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" }
      ],
      created_at: "2024-01-10T00:00:00.000Z",
      updated_at: "2024-01-12T00:00:00.000Z"
    },
    {
      id: "12",
      name: "Mobile Banking App",
      description: "Aplicativo bancário para dispositivos móveis",
      start_date: "2024-02-05",
      end_date: "2024-10-31",
      color: "#059669",
      creator_id: "3",
      collaborators: [
        { id: "1", name: "Lorenzo Chaves", email: "lorenzo@tasksphere.com", avatar: "https://img.freepik.com/vetores-gratis/ilustracao-do-jovem-sorridente_1308-174669.jpg?semt=ais_items_boosted&w=740" },
        { id: "5", name: "Carlos Lima", email: "carlos@example.com", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" }
      ],
      created_at: "2024-02-05T00:00:00.000Z",
      updated_at: "2024-02-08T00:00:00.000Z"
    },
    {
      id: "13",
      name: "AI Chatbot",
      description: "Chatbot com inteligência artificial para atendimento",
      start_date: "2024-03-01",
      end_date: "2024-07-15",
      color: "#0EA5E9",
      creator_id: "4",
      collaborators: [
        { id: "1", name: "Lorenzo Chaves", email: "lorenzo@tasksphere.com", avatar: "https://img.freepik.com/vetores-gratis/ilustracao-do-jovem-sorridente_1308-174669.jpg?semt=ais_items_boosted&w=740" },
        { id: "7", name: "Pedro Oliveira", email: "pedro@example.com", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" }
      ],
      created_at: "2024-03-01T00:00:00.000Z",
      updated_at: "2024-03-03T00:00:00.000Z"
    },
    {
      id: "14",
      name: "Social Media Platform",
      description: "Plataforma de redes sociais corporativa",
      start_date: "2024-01-25",
      end_date: "2024-08-25",
      color: "#8B5CF6",
      creator_id: "5",
      collaborators: [
        { id: "1", name: "Lorenzo Chaves", email: "lorenzo@tasksphere.com", avatar: "https://img.freepik.com/vetores-gratis/ilustracao-do-jovem-sorridente_1308-174669.jpg?semt=ais_items_boosted&w=740" },
        { id: "8", name: "Sofia Rodrigues", email: "sofia@example.com", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face" }
      ],
      created_at: "2024-01-25T00:00:00.000Z",
      updated_at: "2024-01-28T00:00:00.000Z"
    },
    {
      id: "15",
      name: "Inventory Management",
      description: "Sistema de gestão de estoque e inventário",
      start_date: "2024-02-10",
      end_date: "2024-06-10",
      color: "#D97706",
      creator_id: "6",
      collaborators: [
        { id: "1", name: "Lorenzo Chaves", email: "lorenzo@tasksphere.com", avatar: "https://img.freepik.com/vetores-gratis/ilustracao-do-jovem-sorridente_1308-174669.jpg?semt=ais_items_boosted&w=740" },
        { id: "2", name: "Maria Silva", email: "maria@example.com", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b787?w=40&h=40&fit=crop&crop=face" }
      ],
      created_at: "2024-02-10T00:00:00.000Z",
      updated_at: "2024-02-12T00:00:00.000Z"
    },
    {
      id: "16",
      name: "Event Management System",
      description: "Sistema para gerenciamento de eventos corporativos",
      start_date: "2024-03-20",
      end_date: "2024-09-20",
      color: "#BE185D",
      creator_id: "7",
      collaborators: [
        { id: "1", name: "Lorenzo Chaves", email: "lorenzo@tasksphere.com", avatar: "https://img.freepik.com/vetores-gratis/ilustracao-do-jovem-sorridente_1308-174669.jpg?semt=ais_items_boosted&w=740" },
        { id: "3", name: "João Santos", email: "joao@example.com", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" }
      ],
      created_at: "2024-03-20T00:00:00.000Z",
      updated_at: "2024-03-22T00:00:00.000Z"
    },
    {
      id: "17",
      name: "Learning Management System",
      description: "Plataforma de ensino e treinamento online",
      start_date: "2024-04-05",
      end_date: "2024-11-30",
      color: "#16A34A",
      creator_id: "8",
      collaborators: [
        { id: "1", name: "Lorenzo Chaves", email: "lorenzo@tasksphere.com", avatar: "https://img.freepik.com/vetores-gratis/ilustracao-do-jovem-sorridente_1308-174669.jpg?semt=ais_items_boosted&w=740" },
        { id: "4", name: "Ana Costa", email: "ana@example.com", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" }
      ],
      created_at: "2024-04-05T00:00:00.000Z",
      updated_at: "2024-04-07T00:00:00.000Z"
    },
    {
      id: "18",
      name: "Payment Gateway",
      description: "Gateway de pagamentos seguro",
      start_date: "2024-01-30",
      end_date: "2024-07-30",
      color: "#0891B2",
      creator_id: "2",
      collaborators: [
        { id: "1", name: "Lorenzo Chaves", email: "lorenzo@tasksphere.com", avatar: "https://img.freepik.com/vetores-gratis/ilustracao-do-jovem-sorridente_1308-174669.jpg?semt=ais_items_boosted&w=740" },
        { id: "5", name: "Carlos Lima", email: "carlos@example.com", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" }
      ],
      created_at: "2024-01-30T00:00:00.000Z",
      updated_at: "2024-02-01T00:00:00.000Z"
    },
    {
      id: "19",
      name: "Data Warehouse",
      description: "Arquitetura de data warehouse para analytics",
      start_date: "2024-02-25",
      end_date: "2024-08-25",
      color: "#7C2D12",
      creator_id: "3",
      collaborators: [
        { id: "1", name: "Lorenzo Chaves", email: "lorenzo@tasksphere.com", avatar: "https://img.freepik.com/vetores-gratis/ilustracao-do-jovem-sorridente_1308-174669.jpg?semt=ais_items_boosted&w=740" },
        { id: "6", name: "Julia Mendes", email: "julia@example.com", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face" }
      ],
      created_at: "2024-02-25T00:00:00.000Z",
      updated_at: "2024-02-27T00:00:00.000Z"
    },
    {
      id: "20",
      name: "Healthcare Portal",
      description: "Portal de saúde para pacientes e médicos",
      start_date: "2024-04-10",
      end_date: "2024-12-10",
      color: "#DC2626",
      creator_id: "4",
      collaborators: [
        { id: "1", name: "Lorenzo Chaves", email: "lorenzo@tasksphere.com", avatar: "https://img.freepik.com/vetores-gratis/ilustracao-do-jovem-sorridente_1308-174669.jpg?semt=ais_items_boosted&w=740" },
        { id: "7", name: "Pedro Oliveira", email: "pedro@example.com", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" }
      ],
      created_at: "2024-04-10T00:00:00.000Z",
      updated_at: "2024-04-12T00:00:00.000Z"
    }
  ],
    tasks: [
  // === TAREFAS CRIADAS POR LORENZO (28 tarefas) ===
  
  // TaskSphere Platform (Projeto 1) - 4 tarefas
  {
    id: "1",
    title: "Setup inicial do projeto",
    description: "Configurar estrutura base do projeto com React, TypeScript e Tailwind",
    status: "done",
    priority: "high",
    due_date: "2024-01-05",
    image_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
    project_id: "1",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "TaskSphere Platform",
    created_at: "2024-01-01T08:00:00.000Z",
    updated_at: "2024-01-05T18:30:00.000Z"
  },
  {
    id: "2",
    title: "Implementar sistema de autenticação",
    description: "Criar login, logout e controle de sessão",
    status: "done",
    priority: "high",
    due_date: "2024-01-10",
    image_url: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=400&h=300&fit=crop",
    project_id: "1",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "TaskSphere Platform",
    assignee: { id: "2", name: "Maria Silva", email: "maria@example.com" },
    created_at: "2024-01-02T09:15:00.000Z",
    updated_at: "2024-01-10T16:45:00.000Z"
  },
  {
    id: "3",
    title: "Desenvolver componentes de design system",
    description: "Criar Button, Input, Typography e outros componentes base",
    status: "in_progress",
    priority: "medium",
    due_date: "2024-01-20",
    image_url: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop",
    project_id: "1",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "TaskSphere Platform",
    created_at: "2024-01-08T10:30:00.000Z",
    updated_at: "2024-01-15T14:20:00.000Z"
  },
  {
    id: "4",
    title: "Criar dashboard principal",
    description: "Desenvolver página inicial com métricas e resumo de projetos",
    status: "todo",
    priority: "medium",
    due_date: "2024-01-25",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    project_id: "1",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "TaskSphere Platform",
    assignee: { id: "3", name: "João Santos", email: "joao@example.com" },
    created_at: "2024-01-12T11:45:00.000Z",
    updated_at: "2024-01-12T11:45:00.000Z"
  },

  // E-commerce Mobile App (Projeto 2) - 3 tarefas
  {
    id: "5",
    title: "Definir arquitetura do app",
    description: "Planejar estrutura de navegação e fluxo de dados",
    status: "done",
    priority: "high",
    due_date: "2024-02-05",
    image_url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
    project_id: "2",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "E-commerce Mobile App",
    created_at: "2024-02-01T08:30:00.000Z",
    updated_at: "2024-02-05T17:00:00.000Z"
  },
  {
    id: "6",
    title: "Implementar carrinho de compras",
    description: "Desenvolver funcionalidade de adicionar/remover produtos do carrinho",
    status: "in_progress",
    priority: "high",
    due_date: "2024-02-15",
    image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    project_id: "2",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "E-commerce Mobile App",
    assignee: { id: "4", name: "Ana Costa", email: "ana@example.com" },
    created_at: "2024-02-08T09:20:00.000Z",
    updated_at: "2024-02-12T15:30:00.000Z"
  },
  {
    id: "7",
    title: "Integrar gateway de pagamento",
    description: "Conectar com API de pagamentos e processar transações",
    status: "todo",
    priority: "high",
    due_date: "2024-02-25",
    image_url: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=300&fit=crop",
    project_id: "2",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "E-commerce Mobile App",
    created_at: "2024-02-10T14:15:00.000Z",
    updated_at: "2024-02-10T14:15:00.000Z"
  },

  // Dashboard Analytics (Projeto 3) - 3 tarefas
  {
    id: "8",
    title: "Conectar com APIs de dados",
    description: "Integrar com fontes de dados externas e APIs",
    status: "done",
    priority: "high",
    due_date: "2024-01-20",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    project_id: "3",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "Dashboard Analytics",
    created_at: "2024-01-15T10:00:00.000Z",
    updated_at: "2024-01-20T16:20:00.000Z"
  },
  {
    id: "9",
    title: "Criar gráficos em tempo real",
    description: "Implementar visualizações de dados dinâmicas com Chart.js",
    status: "in_progress",
    priority: "medium",
    due_date: "2024-01-30",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    project_id: "3",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "Dashboard Analytics",
    assignee: { id: "6", name: "Julia Mendes", email: "julia@example.com" },
    created_at: "2024-01-18T11:30:00.000Z",
    updated_at: "2024-01-25T13:45:00.000Z"
  },
  {
    id: "10",
    title: "Implementar filtros avançados",
    description: "Adicionar filtros por data, categoria e métricas customizadas",
    status: "todo",
    priority: "medium",
    due_date: "2024-02-05",
    image_url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=300&fit=crop",
    project_id: "3",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "Dashboard Analytics",
    created_at: "2024-01-22T09:45:00.000Z",
    updated_at: "2024-01-22T09:45:00.000Z"
  },

  // API Gateway (Projeto 4) - 3 tarefas
  {
    id: "11",
    title: "Configurar load balancer",
    description: "Implementar distribuição de carga entre microserviços",
    status: "done",
    priority: "high",
    due_date: "2024-03-05",
    image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
    project_id: "4",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "API Gateway",
    created_at: "2024-03-01T08:20:00.000Z",
    updated_at: "2024-03-05T15:10:00.000Z"
  },
  {
    id: "12",
    title: "Implementar rate limiting",
    description: "Adicionar controle de taxa de requisições por usuário",
    status: "in_progress",
    priority: "medium",
    due_date: "2024-03-15",
    image_url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop",
    project_id: "4",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "API Gateway",
    assignee: { id: "7", name: "Pedro Oliveira", email: "pedro@example.com" },
    created_at: "2024-03-03T10:15:00.000Z",
    updated_at: "2024-03-10T14:30:00.000Z"
  },
  {
    id: "13",
    title: "Configurar monitoramento",
    description: "Implementar logs e métricas de performance do gateway",
    status: "todo",
    priority: "medium",
    due_date: "2024-03-20",
    image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
    project_id: "4",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "API Gateway",
    created_at: "2024-03-08T12:00:00.000Z",
    updated_at: "2024-03-08T12:00:00.000Z"
  },

  // CRM System (Projeto 5) - 3 tarefas
  {
    id: "14",
    title: "Modelar entidades do CRM",
    description: "Definir estrutura de dados para clientes, leads e oportunidades",
    status: "done",
    priority: "high",
    due_date: "2024-02-20",
    image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
    project_id: "5",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "CRM System",
    created_at: "2024-02-15T09:30:00.000Z",
    updated_at: "2024-02-20T17:45:00.000Z"
  },
  {
    id: "15",
    title: "Criar pipeline de vendas",
    description: "Implementar funil de vendas com drag & drop",
    status: "in_progress",
    priority: "high",
    due_date: "2024-03-01",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    project_id: "5",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "CRM System",
    assignee: { id: "8", name: "Sofia Rodrigues", email: "sofia@example.com" },
    created_at: "2024-02-18T11:20:00.000Z",
    updated_at: "2024-02-25T16:10:00.000Z"
  },
  {
    id: "16",
    title: "Integrar com email marketing",
    description: "Conectar CRM com ferramentas de automação de email",
    status: "todo",
    priority: "medium",
    due_date: "2024-03-10",
    image_url: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=300&fit=crop",
    project_id: "5",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "CRM System",
    created_at: "2024-02-22T13:45:00.000Z",
    updated_at: "2024-02-22T13:45:00.000Z"
  },

  // DevOps Pipeline (Projeto 6) - 2 tarefas
  {
    id: "17",
    title: "Configurar CI/CD com GitHub Actions",
    description: "Automatizar build, test e deploy",
    status: "done",
    priority: "high",
    due_date: "2024-01-25",
    image_url: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=300&fit=crop",
    project_id: "6",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "DevOps Pipeline",
    created_at: "2024-01-20T08:00:00.000Z",
    updated_at: "2024-01-25T19:30:00.000Z"
  },
  {
    id: "18",
    title: "Implementar monitoramento de aplicações",
    description: "Configurar alertas e métricas de saúde das aplicações",
    status: "in_progress",
    priority: "medium",
    due_date: "2024-02-01",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    project_id: "6",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "DevOps Pipeline",
    assignee: { id: "4", name: "Ana Costa", email: "ana@example.com" },
    created_at: "2024-01-22T10:30:00.000Z",
    updated_at: "2024-01-28T14:15:00.000Z"
  },

  // Design System (Projeto 7) - 2 tarefas
  {
    id: "19",
    title: "Criar tokens de design",
    description: "Definir cores, tipografia, espaçamentos e outros tokens",
    status: "done",
    priority: "high",
    due_date: "2024-03-20",
    image_url: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop",
    project_id: "7",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "Design System",
    created_at: "2024-03-15T09:00:00.000Z",
    updated_at: "2024-03-20T18:00:00.000Z"
  },
  {
    id: "20",
    title: "Documentar componentes no Storybook",
    description: "Criar documentação interativa de todos os componentes",
    status: "in_progress",
    priority: "medium",
    due_date: "2024-04-01",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    project_id: "7",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "Design System",
    assignee: { id: "6", name: "Julia Mendes", email: "julia@example.com" },
    created_at: "2024-03-18T11:30:00.000Z",
    updated_at: "2024-03-25T15:45:00.000Z"
  },

  // Monitoring System (Projeto 8) - 2 tarefas
  {
    id: "21",
    title: "Configurar Prometheus e Grafana",
    description: "Implementar coleta de métricas e dashboards",
    status: "in_progress",
    priority: "high",
    due_date: "2024-04-10",
    image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
    project_id: "8",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "Monitoring System",
    created_at: "2024-04-01T08:30:00.000Z",
    updated_at: "2024-04-05T16:20:00.000Z"
  },
  {
    id: "22",
    title: "Implementar alertas customizados",
    description: "Criar sistema de notificações para eventos críticos",
    status: "todo",
    priority: "medium",
    due_date: "2024-04-20",
    image_url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
    project_id: "8",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "Monitoring System",
    assignee: { id: "5", name: "Carlos Lima", email: "carlos@example.com" },
    created_at: "2024-04-03T10:45:00.000Z",
    updated_at: "2024-04-03T10:45:00.000Z"
  },

  // Security Audit (Projeto 9) - 2 tarefas
  {
    id: "23",
    title: "Realizar análise de vulnerabilidades",
    description: "Executar testes de penetração e análise de código",
    status: "in_progress",
    priority: "high",
    due_date: "2024-03-20",
    image_url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
    project_id: "9",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "Security Audit",
    created_at: "2024-03-10T09:15:00.000Z",
    updated_at: "2024-03-15T14:30:00.000Z"
  },
  {
    id: "24",
    title: "Implementar correções de segurança",
    description: "Aplicar patches e melhorias identificadas na auditoria",
    status: "todo",
    priority: "high",
    due_date: "2024-04-01",
    image_url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
    project_id: "9",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "Security Audit",
    assignee: { id: "7", name: "Pedro Oliveira", email: "pedro@example.com" },
    created_at: "2024-03-12T11:00:00.000Z",
    updated_at: "2024-03-12T11:00:00.000Z"
  },

  // Documentation Portal (Projeto 10) - 2 tarefas
  {
    id: "25",
    title: "Estruturar arquitetura da informação",
    description: "Organizar conteúdo e criar estrutura de navegação",
    status: "done",
    priority: "medium",
    due_date: "2024-02-25",
    image_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    project_id: "10",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "Documentation Portal",
    created_at: "2024-02-20T08:45:00.000Z",
    updated_at: "2024-02-25T17:20:00.000Z"
  },
  {
    id: "26",
    title: "Implementar busca avançada",
    description: "Adicionar motor de busca com filtros e indexação",
    status: "in_progress",
    priority: "medium",
    due_date: "2024-03-15",
    image_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop",
    project_id: "10",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "Documentation Portal",
    assignee: { id: "3", name: "João Santos", email: "joao@example.com" },
    created_at: "2024-02-22T10:30:00.000Z",
    updated_at: "2024-03-01T15:45:00.000Z"
  },

  // Tarefas como colaborador em projetos onde Lorenzo participa (2 tarefas)
  {
    id: "27",
    title: "Implementar segmentação de usuários",
    description: "Criar funcionalidade para segmentar clientes por comportamento",
    status: "in_progress",
    priority: "medium",
    due_date: "2024-02-01",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    project_id: "11",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "Marketing Automation",
    assignee: { id: "2", name: "Maria Silva", email: "maria@example.com" },
    created_at: "2024-01-15T09:30:00.000Z",
    updated_at: "2024-01-28T16:15:00.000Z"
  },
  {
    id: "28",
    title: "Otimizar performance mobile",
    description: "Melhorar tempo de carregamento e responsividade",
    status: "todo",
    priority: "high",
    due_date: "2024-03-01",
    image_url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
    project_id: "12",
    creator_id: "1",
    creator_name: "Lorenzo Chaves",
    project_name: "Mobile Banking App",
    created_at: "2024-02-10T11:45:00.000Z",
    updated_at: "2024-02-10T11:45:00.000Z"
  },

  // === TAREFAS CRIADAS POR OUTROS USUÁRIOS (52 tarefas) ===
  
  // Tarefas por Maria Silva (12 tarefas)
  {
    id: "29",
    title: "Implementar autenticação biométrica",
    description: "Adicionar login por impressão digital e reconhecimento facial",
    status: "in_progress",
    priority: "high",
    due_date: "2024-03-15",
    image_url: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=400&h=300&fit=crop",
    project_id: "12",
    creator_id: "2",
    creator_name: "Maria Silva",
    project_name: "Mobile Banking App",
    assignee: { id: "1", name: "Lorenzo Chaves", email: "lorenzo@tasksphere.com" },
    created_at: "2024-02-08T10:20:00.000Z",
    updated_at: "2024-02-15T14:30:00.000Z"
  },
  {
    id: "30",
    title: "Desenvolver sistema de transferências",
    description: "Criar funcionalidade para transferências entre contas",
    status: "todo",
    priority: "high",
    due_date: "2024-03-25",
    image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    project_id: "12",
    creator_id: "2",
    creator_name: "Maria Silva",
    project_name: "Mobile Banking App",
    assignee: { id: "5", name: "Carlos Lima", email: "carlos@example.com" },
    created_at: "2024-02-12T09:45:00.000Z",
    updated_at: "2024-02-12T09:45:00.000Z"
  },
  {
    id: "31",
    title: "Configurar notificações push",
    description: "Implementar sistema de notificações para transações",
    status: "done",
    priority: "medium",
    due_date: "2024-02-20",
    image_url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
    project_id: "12",
    creator_id: "2",
    creator_name: "Maria Silva",
    project_name: "Mobile Banking App",
    created_at: "2024-02-05T11:30:00.000Z",
    updated_at: "2024-02-20T16:45:00.000Z"
  },
  {
    id: "32",
    title: "Criar templates de email",
    description: "Desenvolver templates responsivos para campanhas",
    status: "done",
    priority: "medium",
    due_date: "2024-01-20",
    image_url: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=300&fit=crop",
    project_id: "11",
    creator_id: "2",
    creator_name: "Maria Silva",
    project_name: "Marketing Automation",
    created_at: "2024-01-12T08:15:00.000Z",
    updated_at: "2024-01-20T17:30:00.000Z"
  },
  {
    id: "33",
    title: "Implementar A/B testing",
    description: "Criar sistema para testar diferentes versões de campanhas",
    status: "in_progress",
    priority: "medium",
    due_date: "2024-02-10",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    project_id: "11",
    creator_id: "2",
    creator_name: "Maria Silva",
    project_name: "Marketing Automation",
    assignee: { id: "4", name: "Ana Costa", email: "ana@example.com" },
    created_at: "2024-01-18T10:45:00.000Z",
    updated_at: "2024-02-05T15:20:00.000Z"
  },
  {
    id: "34",
    title: "Configurar webhook para integração",
    description: "Implementar webhooks para sincronização com CRM",
    status: "todo",
    priority: "low",
    due_date: "2024-02-25",
    image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
    project_id: "11",
    creator_id: "2",
    creator_name: "Maria Silva",
    project_name: "Marketing Automation",
    created_at: "2024-01-25T12:00:00.000Z",
    updated_at: "2024-01-25T12:00:00.000Z"
  },
  {
    id: "35",
    title: "Desenvolver API de pagamentos recorrentes",
    description: "Implementar cobrança automática para assinaturas",
    status: "in_progress",
    priority: "high",
    due_date: "2024-02-15",
    image_url: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=300&fit=crop",
    project_id: "18",
    creator_id: "2",
    creator_name: "Maria Silva",
    project_name: "Payment Gateway",
    assignee: { id: "1", name: "Lorenzo Chaves", email: "lorenzo@tasksphere.com" },
    created_at: "2024-02-01T09:30:00.000Z",
    updated_at: "2024-02-08T14:15:00.000Z"
  },
  {
    id: "36",
    title: "Implementar anti-fraude",
    description: "Adicionar sistema de detecção de transações suspeitas",
    status: "todo",
    priority: "high",
    due_date: "2024-03-01",
    image_url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
    project_id: "18",
    creator_id: "2",
    creator_name: "Maria Silva",
    project_name: "Payment Gateway",
    assignee: { id: "5", name: "Carlos Lima", email: "carlos@example.com" },
    created_at: "2024-02-05T11:20:00.000Z",
    updated_at: "2024-02-05T11:20:00.000Z"
  },
  {
    id: "37",
    title: "Configurar multi-currency",
    description: "Adicionar suporte para múltiplas moedas",
    status: "todo",
    priority: "medium",
    due_date: "2024-03-15",
    image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
    project_id: "18",
    creator_id: "2",
    creator_name: "Maria Silva",
    project_name: "Payment Gateway",
    created_at: "2024-02-08T13:45:00.000Z",
    updated_at: "2024-02-08T13:45:00.000Z"
  },
  {
    id: "38",
    title: "Otimizar consultas do banco de dados",
    description: "Melhorar performance das queries mais pesadas",
    status: "done",
    priority: "medium",
    due_date: "2024-01-30",
    image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
    project_id: "4",
    creator_id: "2",
    creator_name: "Maria Silva",
    project_name: "API Gateway",
    created_at: "2024-01-20T10:15:00.000Z",
    updated_at: "2024-01-30T18:20:00.000Z"
  },
  {
    id: "39",
    title: "Implementar cache distribuído",
    description: "Configurar Redis para cache de respostas da API",
    status: "in_progress",
    priority: "medium",
    due_date: "2024-02-10",
    image_url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop",
    project_id: "4",
    creator_id: "2",
    creator_name: "Maria Silva",
    project_name: "API Gateway",
    assignee: { id: "7", name: "Pedro Oliveira", email: "pedro@example.com" },
    created_at: "2024-01-25T11:30:00.000Z",
    updated_at: "2024-02-05T16:45:00.000Z"
  },
  {
    id: "40",
    title: "Criar documentação da API",
    description: "Gerar documentação automática com Swagger",
    status: "todo",
    priority: "low",
    due_date: "2024-02-20",
    image_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    project_id: "4",
    creator_id: "2",
    creator_name: "Maria Silva",
    project_name: "API Gateway",
    created_at: "2024-02-01T14:00:00.000Z",
    updated_at: "2024-02-01T14:00:00.000Z"
  },

  // Tarefas por João Santos (10 tarefas)
  {
    id: "41",
    title: "Implementar processamento de linguagem natural",
    description: "Desenvolver NLP para entender intenções do usuário",
    status: "in_progress",
    priority: "high",
    due_date: "2024-03-20",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
    project_id: "13",
    creator_id: "3",
    creator_name: "João Santos",
    project_name: "AI Chatbot",
    assignee: { id: "1", name: "Lorenzo Chaves", email: "lorenzo@tasksphere.com" },
    created_at: "2024-03-05T09:20:00.000Z",
    updated_at: "2024-03-12T15:30:00.000Z"
  },
  {
    id: "42",
    title: "Treinar modelo de IA",
    description: "Coletar dados e treinar modelo para respostas automáticas",
    status: "todo",
    priority: "high",
    due_date: "2024-04-01",
    image_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop",
    project_id: "13",
    creator_id: "3",
    creator_name: "João Santos",
    project_name: "AI Chatbot",
    assignee: { id: "7", name: "Pedro Oliveira", email: "pedro@example.com" },
    created_at: "2024-03-08T11:45:00.000Z",
    updated_at: "2024-03-08T11:45:00.000Z"
  },
  {
    id: "43",
    title: "Implementar analytics de conversas",
    description: "Criar dashboard para analisar interações do chatbot",
    status: "todo",
    priority: "medium",
    due_date: "2024-04-15",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    project_id: "13",
    creator_id: "3",
    creator_name: "João Santos",
    project_name: "AI Chatbot",
    created_at: "2024-03-10T13:20:00.000Z",
    updated_at: "2024-03-10T13:20:00.000Z"
  },
  {
    id: "44",
    title: "Implementar ETL para data warehouse",
    description: "Criar pipeline de extração, transformação e carga",
    status: "in_progress",
    priority: "high",
    due_date: "2024-03-15",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    project_id: "19",
    creator_id: "3",
    creator_name: "João Santos",
    project_name: "Data Warehouse",
    assignee: { id: "1", name: "Lorenzo Chaves", email: "lorenzo@tasksphere.com" },
    created_at: "2024-03-01T08:30:00.000Z",
    updated_at: "2024-03-08T16:45:00.000Z"
  },
  {
    id: "45",
    title: "Configurar data lake",
    description: "Implementar armazenamento para dados não estruturados",
    status: "todo",
    priority: "medium",
    due_date: "2024-03-30",
    image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
    project_id: "19",
    creator_id: "3",
    creator_name: "João Santos",
    project_name: "Data Warehouse",
    assignee: { id: "6", name: "Julia Mendes", email: "julia@example.com" },
    created_at: "2024-03-05T10:15:00.000Z",
    updated_at: "2024-03-05T10:15:00.000Z"
  },
  {
    id: "46",
    title: "Implementar data governance",
    description: "Criar políticas de qualidade e governança de dados",
    status: "todo",
    priority: "medium",
    due_date: "2024-04-10",
    image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
    project_id: "19",
    creator_id: "3",
    creator_name: "João Santos",
    project_name: "Data Warehouse",
    created_at: "2024-03-08T12:30:00.000Z",
    updated_at: "2024-03-08T12:30:00.000Z"
  },
  {
    id: "47",
    title: "Desenvolver interface de administração",
    description: "Criar painel para gerenciar usuários e permissões",
    status: "done",
    priority: "medium",
    due_date: "2024-01-25",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    project_id: "1",
    creator_id: "3",
    creator_name: "João Santos",
    project_name: "TaskSphere Platform",
    created_at: "2024-01-10T09:00:00.000Z",
    updated_at: "2024-01-25T17:15:00.000Z"
  },
  {
    id: "48",
    title: "Implementar sistema de backup",
    description: "Configurar backup automático dos dados",
    status: "in_progress",
    priority: "high",
    due_date: "2024-02-05",
    image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
    project_id: "1",
    creator_id: "3",
    creator_name: "João Santos",
    project_name: "TaskSphere Platform",
    assignee: { id: "2", name: "Maria Silva", email: "maria@example.com" },
    created_at: "2024-01-20T11:20:00.000Z",
    updated_at: "2024-01-30T14:40:00.000Z"
  },
  {
    id: "49",
    title: "Criar sistema de notificações",
    description: "Implementar notificações em tempo real para atualizações",
    status: "todo",
    priority: "medium",
    due_date: "2024-02-15",
    image_url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
    project_id: "1",
    creator_id: "3",
    creator_name: "João Santos",
    project_name: "TaskSphere Platform",
    created_at: "2024-01-25T13:45:00.000Z",
    updated_at: "2024-01-25T13:45:00.000Z"
  },
  {
    id: "50",
    title: "Otimizar SEO do portal",
    description: "Melhorar indexação e ranking nos motores de busca",
    status: "done",
    priority: "low",
    due_date: "2024-03-10",
    image_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop",
    project_id: "10",
    creator_id: "3",
    creator_name: "João Santos",
    project_name: "Documentation Portal",
    created_at: "2024-02-25T10:30:00.000Z",
    updated_at: "2024-03-10T16:20:00.000Z"
  },

  // Tarefas por Ana Costa (8 tarefas)
  {
    id: "51",
    title: "Criar módulo de agendamento",
    description: "Desenvolver sistema para agendar consultas médicas",
    status: "in_progress",
    priority: "high",
    due_date: "2024-05-01",
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
    project_id: "20",
    creator_id: "4",
    creator_name: "Ana Costa",
    project_name: "Healthcare Portal",
    assignee: { id: "1", name: "Lorenzo Chaves", email: "lorenzo@tasksphere.com" },
    created_at: "2024-04-15T09:30:00.000Z",
    updated_at: "2024-04-20T15:45:00.000Z"
  },
  {
    id: "52",
    title: "Implementar prontuário eletrônico",
    description: "Criar sistema de registros médicos digitais",
    status: "todo",
    priority: "high",
    due_date: "2024-05-20",
    image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    project_id: "20",
    creator_id: "4",
    creator_name: "Ana Costa",
    project_name: "Healthcare Portal",
    assignee: { id: "7", name: "Pedro Oliveira", email: "pedro@example.com" },
    created_at: "2024-04-18T11:15:00.000Z",
    updated_at: "2024-04-18T11:15:00.000Z"
  },
  {
    id: "53",
    title: "Integrar com sistemas hospitalares",
    description: "Conectar portal com sistemas existentes dos hospitais",
    status: "todo",
    priority: "medium",
    due_date: "2024-06-01",
    image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
    project_id: "20",
    creator_id: "4",
    creator_name: "Ana Costa",
    project_name: "Healthcare Portal",
    created_at: "2024-04-20T13:20:00.000Z",
    updated_at: "2024-04-20T13:20:00.000Z"
  },
  {
    id: "54",
    title: "Desenvolver funcionalidades de networking",
    description: "Criar sistema de conexões entre profissionais",
    status: "in_progress",
    priority: "medium",
    due_date: "2024-02-15",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    project_id: "14",
    creator_id: "4",
    creator_name: "Ana Costa",
    project_name: "Social Media Platform",
    assignee: { id: "1", name: "Lorenzo Chaves", email: "lorenzo@tasksphere.com" },
    created_at: "2024-02-01T10:45:00.000Z",
    updated_at: "2024-02-08T16:30:00.000Z"
  },
  {
    id: "55",
    title: "Implementar feed de notícias",
    description: "Criar timeline personalizada para cada usuário",
    status: "todo",
    priority: "medium",
    due_date: "2024-03-01",
    image_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop",
    project_id: "14",
    creator_id: "4",
    creator_name: "Ana Costa",
    project_name: "Social Media Platform",
    assignee: { id: "8", name: "Sofia Rodrigues", email: "sofia@example.com" },
    created_at: "2024-02-05T12:30:00.000Z",
    updated_at: "2024-02-05T12:30:00.000Z"
  },
  {
    id: "56",
    title: "Criar sistema de moderação",
    description: "Implementar ferramentas para moderar conteúdo",
    status: "todo",
    priority: "high",
    due_date: "2024-03-15",
    image_url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
    project_id: "14",
    creator_id: "4",
    creator_name: "Ana Costa",
    project_name: "Social Media Platform",
    created_at: "2024-02-08T14:15:00.000Z",
    updated_at: "2024-02-08T14:15:00.000Z"
  },
  {
    id: "57",
    title: "Configurar testes automatizados",
    description: "Implementar suite de testes para CI/CD",
    status: "done",
    priority: "medium",
    due_date: "2024-02-10",
    image_url: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=300&fit=crop",
    project_id: "6",
    creator_id: "4",
    creator_name: "Ana Costa",
    project_name: "DevOps Pipeline",
    created_at: "2024-01-28T09:20:00.000Z",
    updated_at: "2024-02-10T18:45:00.000Z"
  },
  {
    id: "58",
    title: "Implementar rollback automático",
    description: "Criar sistema de reversão automática em caso de falhas",
    status: "in_progress",
    priority: "high",
    due_date: "2024-02-25",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    project_id: "6",
    creator_id: "4",
    creator_name: "Ana Costa",
    project_name: "DevOps Pipeline",
    assignee: { id: "1", name: "Lorenzo Chaves", email: "lorenzo@tasksphere.com" },
    created_at: "2024-02-05T11:40:00.000Z",
    updated_at: "2024-02-15T14:25:00.000Z"
  },

  // Tarefas por Carlos Lima (6 tarefas)
  {
    id: "59",
    title: "Implementar checkout one-click",
    description: "Criar processo de compra simplificado em um clique",
    status: "in_progress",
    priority: "high",
    due_date: "2024-03-10",
    image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    project_id: "2",
    creator_id: "5",
    creator_name: "Carlos Lima",
    project_name: "E-commerce Mobile App",
    assignee: { id: "4", name: "Ana Costa", email: "ana@example.com" },
    created_at: "2024-02-20T10:30:00.000Z",
    updated_at: "2024-03-01T16:15:00.000Z"
  },
  {
    id: "60",
    title: "Implementar sistema de reviews",
    description: "Criar funcionalidade para avaliações de produtos",
    status: "todo",
    priority: "medium",
    due_date: "2024-03-25",
    image_url: "https://images.unsplash.com/photo-1556661533-7bdb9067ecce?w=400&h=300&fit=crop",
    project_id: "2",
    creator_id: "5",
    creator_name: "Carlos Lima",
    project_name: "E-commerce Mobile App",
    created_at: "2024-02-25T12:45:00.000Z",
    updated_at: "2024-02-25T12:45:00.000Z"
  },
  {
    id: "61",
    title: "Configurar sistema de recomendação",
    description: "Implementar algoritmo de recomendação de produtos",
    status: "todo",
    priority: "low",
    due_date: "2024-04-15",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    project_id: "2",
    creator_id: "5",
    creator_name: "Carlos Lima",
    project_name: "E-commerce Mobile App",
    assignee: { id: "1", name: "Lorenzo Chaves", email: "lorenzo@tasksphere.com" },
    created_at: "2024-03-01T14:20:00.000Z",
    updated_at: "2024-03-01T14:20:00.000Z"
  },
  {
    id: "62",
    title: "Implementar relatórios financeiros",
    description: "Criar dashboards para análise de vendas e receita",
    status: "in_progress",
    priority: "medium",
    due_date: "2024-03-20",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    project_id: "5",
    creator_id: "5",
    creator_name: "Carlos Lima",
    project_name: "CRM System",
    assignee: { id: "8", name: "Sofia Rodrigues", email: "sofia@example.com" },
    created_at: "2024-03-05T09:30:00.000Z",
    updated_at: "2024-03-12T15:45:00.000Z"
  },
  {
    id: "63",
    title: "Criar automações de follow-up",
    description: "Implementar sequências automáticas de acompanhamento",
    status: "todo",
    priority: "medium",
    due_date: "2024-04-01",
    image_url: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=300&fit=crop",
    project_id: "5",
    creator_id: "5",
    creator_name: "Carlos Lima",
    project_name: "CRM System",
    assignee: { id: "3", name: "João Santos", email: "joao@example.com" },
    created_at: "2024-03-08T11:15:00.000Z",
    updated_at: "2024-03-08T11:15:00.000Z"
  }
  ]
})

// Utilitários para localStorage
const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return defaultValue
  }
}

// Inicializar dados se não existirem
const initializeData = () => {
  const initialData = getInitialData()
  
  // Só inicializa se não existir dados
  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    saveToStorage(STORAGE_KEYS.users, initialData.users)
  }
  if (!localStorage.getItem(STORAGE_KEYS.projects)) {
    saveToStorage(STORAGE_KEYS.projects, initialData.projects)
  }
  if (!localStorage.getItem(STORAGE_KEYS.tasks)) {
    saveToStorage(STORAGE_KEYS.tasks, initialData.tasks)
  }
}

// Função para forçar reinicialização (útil para debugging)
const forceReinitialize = () => {
  const initialData = getInitialData()
  saveToStorage(STORAGE_KEYS.users, initialData.users)
  saveToStorage(STORAGE_KEYS.projects, initialData.projects)
  saveToStorage(STORAGE_KEYS.tasks, initialData.tasks)
  localStorage.removeItem(STORAGE_KEYS.currentUser)
  console.log('LocalStorage reiniciado com dados padrão')
}

// Simular delay de API
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Gerar IDs únicos
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

// API Functions
export const persistentApi = {
  // Inicializar dados
  initialize: () => {
    initializeData()
  },

  // Forçar reinicialização (para debugging)
  forceReset: () => {
    forceReinitialize()
  },

  // Limpar localStorage completamente (para debugging)
  clearAll: () => {
    localStorage.clear()
    console.log('LocalStorage limpo completamente')
  },

  // Auth
async login(credentials: { email: string; password: string }): Promise<User> {
    await delay()
    const users = loadFromStorage<StoredUser[]>(STORAGE_KEYS.users, [])
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password)

    if (!user) {
      throw new Error("Credenciais inválidas")
    }

    const { password: _, ...userWithoutPassword } = user
    saveToStorage(STORAGE_KEYS.currentUser, userWithoutPassword)
    return userWithoutPassword
  },

  async register(name: string, email: string, password: string): Promise<User> {
    await delay()

    let users = loadFromStorage<StoredUser[]>(STORAGE_KEYS.users, [])

    // Proteção extra: se não for um array, reinicialize
    if (!Array.isArray(users)) {
      console.warn("[Register] Dados de usuários inválidos, reinicializando...")
      initializeData()
      users = loadFromStorage<StoredUser[]>(STORAGE_KEYS.users, [])
    }

    const emailExists = users.some((u) => u.email && u.email.toLowerCase() === email?.toLowerCase())
    if (emailExists) {
      throw new Error("E-mail já está em uso")
    }

    const newUser: StoredUser = {
      id: generateId(),
      name,
      email,
      password,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ef4444&color=fff`,
      createdAt: new Date().toISOString()
    }

    const updatedUsers = [...users, newUser]
    saveToStorage(STORAGE_KEYS.users, updatedUsers)

    const { password: _, ...userWithoutPassword } = newUser
    saveToStorage(STORAGE_KEYS.currentUser, userWithoutPassword)
    return userWithoutPassword
  },

  async logout(): Promise<void> {
    await delay(200)
    localStorage.removeItem(STORAGE_KEYS.currentUser)
  },

  getCurrentUser(): User | null {
    return loadFromStorage<User | null>(STORAGE_KEYS.currentUser, null)
  },

  // Projects
  async getProjects(userId: string): Promise<Project[]> {
    await delay()
    const projects = loadFromStorage<Project[]>(STORAGE_KEYS.projects, [])
    
    return projects.filter(project => 
      project.creator_id === userId || 
      project.collaborators.some(c => c.id === userId)
    )
  },

  async getProject(projectId: string): Promise<Project> {
    await delay()
    const projects = loadFromStorage<Project[]>(STORAGE_KEYS.projects, [])
    const project = projects.find(p => p.id === projectId)
    
    if (!project) {
      throw new Error("Projeto não encontrado")
    }
    
    // Carregar as tasks do projeto
    const tasks = loadFromStorage<Task[]>(STORAGE_KEYS.tasks, [])
    const projectTasks = tasks.filter(t => t.project_id === projectId)
    
    return {
      ...project,
      tasks: projectTasks
    }
  },

  async createProject(projectData: Partial<Project>): Promise<Project> {
    await delay()
    const projects = loadFromStorage<Project[]>(STORAGE_KEYS.projects, [])
    
    const newProject: Project = {
      id: generateId(),
      name: projectData.name!,
      description: projectData.description || "",
      start_date: projectData.start_date!,
      end_date: projectData.end_date!,
      color: projectData.color || "#3B82F6",
      creator_id: projectData.creator_id!,
      collaborators: projectData.collaborators || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const updatedProjects = [...projects, newProject]
    saveToStorage(STORAGE_KEYS.projects, updatedProjects)
    return newProject
  },

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    await delay()
    const projects = loadFromStorage<Project[]>(STORAGE_KEYS.projects, [])
    const index = projects.findIndex(p => p.id === projectId)
    
    if (index === -1) {
      throw new Error("Projeto não encontrado")
    }
    
    const updatedProject = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    projects[index] = updatedProject
    saveToStorage(STORAGE_KEYS.projects, projects)
    return updatedProject
  },

  async deleteProject(projectId: string): Promise<void> {
    await delay()
    const projects = loadFromStorage<Project[]>(STORAGE_KEYS.projects, [])
    const tasks = loadFromStorage<Task[]>(STORAGE_KEYS.tasks, [])
    
    // Remover projeto
    const updatedProjects = projects.filter(p => p.id !== projectId)
    saveToStorage(STORAGE_KEYS.projects, updatedProjects)
    
    // Remover tarefas do projeto
    const updatedTasks = tasks.filter(t => t.project_id !== projectId)
    saveToStorage(STORAGE_KEYS.tasks, updatedTasks)
  },

  // Tasks
  async getTasks(projectId: string): Promise<Task[]> {
    await delay()
    const tasks = loadFromStorage<Task[]>(STORAGE_KEYS.tasks, [])
    return tasks.filter(t => t.project_id === projectId)
  },

  async getAllUserTasks(userId: string): Promise<Task[]> {
    await delay()
    const tasks = loadFromStorage<Task[]>(STORAGE_KEYS.tasks, [])
    const projects = loadFromStorage<Project[]>(STORAGE_KEYS.projects, [])
    
    // Buscar projetos onde o usuário participa
    const userProjects = projects.filter(project => 
      project.creator_id === userId || 
      project.collaborators.some(c => c.id === userId)
    )
    
    const userProjectIds = userProjects.map(p => p.id)
    
    // Retornar apenas tarefas dos projetos do usuário que foram criadas por ele OU atribuídas a ele
    return tasks.filter(task => 
      task.project_id && 
      userProjectIds.includes(task.project_id) &&
      task.creator_id === userId
    )
  },

  async createTask(taskData: Partial<Task>): Promise<Task> {
    await delay()
    const tasks = loadFromStorage<Task[]>(STORAGE_KEYS.tasks, [])
    
    const newTask: Task = {
      id: generateId(),
      title: taskData.title!,
      description: taskData.description || "",
      status: taskData.status || "todo",
      priority: taskData.priority || "medium",
      due_date: taskData.due_date || new Date().toISOString().split('T')[0],
      image_url: taskData.image_url || "",
      project_id: taskData.project_id!,
      creator_id: taskData.creator_id!,
      creator_name: taskData.creator_name || "",
      project_name: taskData.project_name || "",
      assignee: taskData.assignee,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const updatedTasks = [...tasks, newTask]
    saveToStorage(STORAGE_KEYS.tasks, updatedTasks)
    return newTask
  },

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    await delay()
    const tasks = loadFromStorage<Task[]>(STORAGE_KEYS.tasks, [])
    const index = tasks.findIndex(t => t.id === taskId)
    
    if (index === -1) {
      throw new Error("Tarefa não encontrada")
    }
    
    const updatedTask = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    tasks[index] = updatedTask
    saveToStorage(STORAGE_KEYS.tasks, tasks)
    return updatedTask
  },

  async deleteTask(taskId: string): Promise<void> {
    await delay()
    const tasks = loadFromStorage<Task[]>(STORAGE_KEYS.tasks, [])
    const updatedTasks = tasks.filter(t => t.id !== taskId)
    saveToStorage(STORAGE_KEYS.tasks, updatedTasks)
  }
}