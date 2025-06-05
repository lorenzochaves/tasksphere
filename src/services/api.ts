import { persistentApi } from './localStorageApi'
import type { Project, User } from "../types"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api"

// Auth API
export const authApi = {
  login: persistentApi.login,
  register: persistentApi.register,
  logout: persistentApi.logout,
  getCurrentUser: persistentApi.getCurrentUser
}

// Projects API
export const fetchProjects = async (userId?: string): Promise<Project[]> => {
  if (!userId) {
    return persistentApi.getProjects()
  }
  return persistentApi.getProjects(userId)
}

export const fetchProject = persistentApi.getProject
export const createProject = persistentApi.createProject
export const updateProject = persistentApi.updateProject
export const deleteProject = persistentApi.deleteProject

export const updateProjectCollaborators = async (projectId: string, collaborators: User[]): Promise<Project> => {
  const project = await persistentApi.getProject(projectId)
  if (!project) {
    throw new Error("Project not found")
  }
  return await persistentApi.updateProject(projectId, { ...project, collaborators })
}

export const leaveProject = async (projectId: string, userId: string): Promise<void> => {
  const project = await persistentApi.getProject(projectId)
  const updatedCollaborators = (project.collaborators || []).filter(c => c.id !== userId)
  await persistentApi.updateProject(projectId, { collaborators: updatedCollaborators })
}

// Tasks API
export const fetchTasks = persistentApi.getTasks
export const fetchAllUserTasks = persistentApi.getAllUserTasks
export const createTask = persistentApi.createTask
export const updateTask = persistentApi.updateTask
export const deleteTask = persistentApi.deleteTask

export const fetchTeamMembers = async (projectId: string): Promise<User[]> => {
  const project = await persistentApi.getProject(projectId)
  return project.collaborators || []
}

export const addTeamMember = async (
  projectId: string,
  email: string
): Promise<User> => {
  const project = await persistentApi.getProject(projectId)
  const users = await persistentApi.getUsers()
  const user = users.find((u: User) => u.email === email)
  
  if (!user) {
    throw new Error("User not found")
  }

  const updatedCollaborators = [...(project.collaborators || []), user]
  await persistentApi.updateProject(projectId, { collaborators: updatedCollaborators })
  return user
}

export const removeTeamMember = async (
  projectId: string,
  memberId: string
): Promise<void> => {
  const project = await persistentApi.getProject(projectId)
  const updatedCollaborators = (project.collaborators || []).filter(c => c.id !== memberId)
  await persistentApi.updateProject(projectId, { collaborators: updatedCollaborators })
}

export const login = async (credentials: { email: string; password: string }): Promise<{ token: string; user: User }> => {
  try {
    const user = await persistentApi.login(credentials)
    const token = "dummy-token" // Simulando um token para o localStorage
    return { token, user }
  } catch (error) {
    console.error("Login error:", error)
    throw new Error("Invalid credentials")
  }
}

export const register = async ({
  name,
  email,
  password
}: {
  name: string
  email: string
  password: string
}): Promise<{ token: string; user: User }> => {
  try {
    const user = await persistentApi.register(name, email, password) // <- corrige aqui!
    const token = "dummy-token"
    return { token, user }
  } catch (error) {
    console.error("Registration error:", error)
    throw new Error("Failed to register user")
  }
}
