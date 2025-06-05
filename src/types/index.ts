// Main User interface without sensitive data
export interface User {
  id: string
  name: string
  email: string
  avatar_url?: string
  avatar?: string
  createdAt?: string
}

// Authentication types for temporary use only
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}


export interface Project {
  id: string
  name: string
  description: string
  owner_id?: string
  creator_id?: string
  start_date: string
  end_date: string
  collaborators: User[]
  members?: User[]
  tasks?: Task[]
  color?: string
  image_url?: string
  created_at: string
  updated_at: string
  creator_name?: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in_progress" | "done"
  priority: "low" | "medium" | "high"
  due_date: string
  image_url: string
  project_id: string
  creator_id: string
  creator_name: string
  project_name: string
  assignee?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  created_at: string
  updated_at: string
}

export interface KanbanColumnType {
  id: string
  title: string
  tasks: Task[]
  color?: string
  lastUpdate?: number 
}


export interface Toast {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message?: string
  description?: string
  duration?: number
  variant?: "success" | "error" | "warning" | "info"
}

export interface ToastProps {
  title: string
  description?: string
  variant?: "success" | "error" | "info"
  duration?: number
}


// For localStorage API
export interface StoredUser extends User {
  password: string
  createdAt: string
  avatar?: string
}

// Auth Context Type
export interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}
