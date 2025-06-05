import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"
import type { Project } from "../types"

interface ModalContextType {
  // New Project Modal
  showNewProjectModal: boolean
  openNewProjectModal: () => void
  closeNewProjectModal: () => void

  // Edit Project Modal
  showEditProjectModal: boolean
  editingProject: Project | null
  openEditProjectModal: (project: Project) => void
  closeEditProjectModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

interface ModalProviderProps {
  children: ReactNode
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  // New Project Modal State
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)

  // Edit Project Modal State
  const [showEditProjectModal, setShowEditProjectModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const openNewProjectModal = () => {
    setShowNewProjectModal(true)
  }

  const closeNewProjectModal = () => {
    setShowNewProjectModal(false)
  }

  const openEditProjectModal = (project: Project) => {
    setEditingProject(project)
    setShowEditProjectModal(true)
  }

  const closeEditProjectModal = () => {
    setShowEditProjectModal(false)
    setEditingProject(null)
  }

  const value: ModalContextType = {
    showNewProjectModal,
    openNewProjectModal,
    closeNewProjectModal,
    showEditProjectModal,
    editingProject,
    openEditProjectModal,
    closeEditProjectModal,
  }

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider")
  }
  return context
}
