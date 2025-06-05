// src/services/localStorageApi.ts
import type { Project, Task, User, StoredUser } from "../types"

const STORAGE_KEYS = {
  users: 'tasksphere_users',
  projects: 'tasksphere_projects', 
  tasks: 'tasksphere_tasks',
  currentUser: 'tasksphere_current_user'
}

// Dados iniciais (só carregados se não existirem no localStorage)
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
    }
  ] as StoredUser[],
  projects: [
    {
      id: "1",
      name: "Website Redesign",
      description: "Complete redesign of the company website",
      start_date: "2024-01-01",
      end_date: "2024-03-31", 
      color: "#3B82F6",
      creator_id: "1",
      collaborators: [
        {
          id: "2",
          name: "Maria Silva",
          email: "maria@example.com", 
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b787?w=40&h=40&fit=crop&crop=face"
        }
      ],
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-15T00:00:00.000Z"
    },
    {
      id: "2", 
      name: "Mobile App",
      description: "Develop mobile application",
      start_date: "2024-02-01",
      end_date: "2024-06-30",
      color: "#10B981",
      creator_id: "2", // Maria é dona deste projeto
      collaborators: [
        {
          id: "1", // Admin é colaborador
          name: "Lorenzo Chaves",
          email: "lorenzo@tasksphere.com",
          avatar: "https://img.freepik.com/vetores-gratis/ilustracao-do-jovem-sorridente_1308-174669.jpg?semt=ais_items_boosted&w=740"
        }
      ],
      createdAt: "2024-02-01T00:00:00.000Z", 
      updatedAt: "2024-02-10T00:00:00.000Z"
    },
    {
      id: "3",
      name: "Marketing Campaign", 
      description: "Q1 marketing campaign",
      start_date: "2024-03-01",
      end_date: "2024-04-30",
      color: "#8B5CF6",
      creator_id: "3", // João é dono
      collaborators: [],
      createdAt: "2024-03-01T00:00:00.000Z",
      updatedAt: "2024-03-01T00:00:00.000Z"
    }
  ],
  tasks: [
    {
      id: "1",
      title: "Design Homepage",
      description: "Create new homepage design",
      status: "in_progress" as const,
      priority: "high" as const,
      due_date: "2024-02-15",
      image_url: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=200&fit=crop",
      project_id: "1", 
      creator_id: "1",
      creator_name: "Lorenzo Chaves",
      project_name: "Website Redesign",
      assignee: {
        id: "1",
        name: "Lorenzo Chaves", 
        email: "lorenzo@tasksphere.com",
        avatar: "https://img.freepik.com/vetores-gratis/ilustracao-do-jovem-sorridente_1308-174669.jpg?semt=ais_items_boosted&w=740"
      },
      created_at: "2024-01-01T00:00:00.000Z",
      updated_at: "2024-01-10T00:00:00.000Z"
    },
    {
      id: "2",
      title: "Authentication System",
      description: "Implement user login/register", 
      status: "todo" as const,
      priority: "medium" as const,
      due_date: "2024-03-01",
      image_url: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=400&h=200&fit=crop",
      project_id: "1",
      creator_id: "2", // Maria criou esta tarefa
      creator_name: "Maria Silva",
      project_name: "Website Redesign", 
      assignee: {
        id: "2",
        name: "Maria Silva",
        email: "maria@example.com",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b787?w=40&h=40&fit=crop&crop=face"
      },
      created_at: "2024-01-02T00:00:00.000Z",
      updated_at: "2024-01-02T00:00:00.000Z"
    },
    {
      id: "3",
      title: "Mobile UI Design",
      description: "Design mobile interface",
      status: "done" as const, 
      priority: "high" as const,
      due_date: "2024-02-20",
      image_url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop",
      project_id: "2",
      creator_id: "2", // Maria criou (é dona do projeto)
      creator_name: "Maria Silva",
      project_name: "Mobile App",
      assignee: {
        id: "1", // Admin está trabalhando nela
        name: "Lorenzo Chaves",
        email: "lorenzo@tasksphere.com", 
        avatar: "https://img.freepik.com/vetores-gratis/ilustracao-do-jovem-sorridente_1308-174669.jpg?semt=ais_items_boosted&w=740"
      },
      created_at: "2024-01-03T00:00:00.000Z",
      updated_at: "2024-01-20T00:00:00.000Z"
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
      (task.creator_id === userId || task.assignee?.id === userId)
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