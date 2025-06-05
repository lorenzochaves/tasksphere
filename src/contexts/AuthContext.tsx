"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, LoginCredentials, RegisterData } from "../types"
import { persistentApi } from "../services/localStorageApi"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<User>
  register: (data: RegisterData) => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = persistentApi.getCurrentUser()
    if (storedUser) {
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      const user = await persistentApi.login(credentials)
      setUser(user)
      return user
    } catch (error) {
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const user = await persistentApi.register(data)
      setUser(user)
      return user
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await persistentApi.logout()
      setUser(null)
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
