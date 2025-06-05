// Serviço para integração com APIs externas
import type { User } from "../types"

// Interface para resposta da API randomuser.me
interface RandomUserResponse {
  results: Array<{
    gender: string
    name: {
      title: string
      first: string
      last: string
    }
    location: {
      street: {
        number: number
        name: string
      }
      city: string
      state: string
      country: string
      postcode: string | number
    }
    email: string
    login: {
      uuid: string
      username: string
    }
    dob: {
      date: string
      age: number
    }
    registered: {
      date: string
      age: number
    }
    phone: string
    cell: string
    id: {
      name: string
      value: string
    }
    picture: {
      large: string
      medium: string
      thumbnail: string
    }
    nat: string
  }>
  info: {
    seed: string
    results: number
    page: number
    version: string
  }
}

// Configuração da API
const RANDOMUSER_API_BASE = "https://randomuser.me/api"

// Cache para evitar múltiplas requisições desnecessárias
let collaboratorCache: User[] = []
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

/**
 * Busca colaboradores sugeridos da API randomuser.me
 * @param count Número de colaboradores a buscar (padrão: 10)
 * @param nationality Nacionalidade dos usuários (padrão: 'br,us,gb')
 * @returns Promise com array de usuários
 */
export const fetchCollaboratorSuggestions = async (
  count: number = 10,
  nationality: string = 'br,us,gb'
): Promise<User[]> => {
  try {
    // Verificar cache
    const now = Date.now()
    if (collaboratorCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
      return collaboratorCache.slice(0, count)
    }

    // Fazer requisição para a API
    const response = await fetch(
      `${RANDOMUSER_API_BASE}/?results=${Math.max(count, 20)}&nat=${nationality}&inc=name,email,picture,login`
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: RandomUserResponse = await response.json()

    // Transformar dados da API para nosso formato
    const users: User[] = data.results.map(user => ({
      id: user.login.uuid,
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      avatar: user.picture.medium
    }))

    // Atualizar cache
    collaboratorCache = users
    cacheTimestamp = now

    return users.slice(0, count)
  } catch (error) {
    console.error('Erro ao buscar colaboradores:', error)
    
    // Retornar usuários mockados em caso de erro
    return getFallbackCollaborators(count)
  }
}

/**
 * Busca colaboradores com filtro de busca
 * @param searchTerm Termo de busca para filtrar por nome ou email
 * @param count Número máximo de resultados
 * @returns Promise com array de usuários filtrados
 */
export const searchCollaborators = async (
  searchTerm: string,
  count: number = 10
): Promise<User[]> => {
  try {
    // Primeiro, garantir que temos dados no cache
    if (collaboratorCache.length === 0) {
      await fetchCollaboratorSuggestions(50) // Buscar mais para ter opções de filtro
    }

    // Filtrar colaboradores pelo termo de busca
    const filtered = collaboratorCache.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return filtered.slice(0, count)
  } catch (error) {
    console.error('Erro ao buscar colaboradores:', error)
    return getFallbackCollaborators(count)
  }
}

/**
 * Colaboradores de fallback caso a API falhe
 */
const getFallbackCollaborators = (count: number): User[] => {
  const fallbackUsers: User[] = [
    {
      id: "1",
      name: "Lorenzo Chaves",
      email: "lorenzo@tasksphere.com",
      avatar: "https://img.freepik.com/vetores-gratis/ilustracao-do-jovem-sorridente_1308-174669.jpg?semt=ais_items_boosted&w=740"
    },
    {
      id: "2", 
      name: "Maria Silva",
      email: "maria@example.com",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b787?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: "3",
      name: "João Santos", 
      email: "joao@example.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    }
  ]

  return fallbackUsers.slice(0, count)
}

/**
 * Limpar cache de colaboradores (útil para testes ou atualizações forçadas)
 */
export const clearCollaboratorCache = (): void => {
  collaboratorCache = []
  cacheTimestamp = 0
}

/**
 * Verificar se um email já existe na lista de colaboradores sugeridos
 * @param email Email para verificar
 * @returns Promise com boolean indicando se o email existe
 */
export const checkCollaboratorEmailExists = async (email: string): Promise<boolean> => {
  try {
    if (collaboratorCache.length === 0) {
      await fetchCollaboratorSuggestions(50)
    }

    return collaboratorCache.some(user => 
      user.email.toLowerCase() === email.toLowerCase()
    )
  } catch (error) {
    console.error('Erro ao verificar email:', error)
    return false
  }
}
