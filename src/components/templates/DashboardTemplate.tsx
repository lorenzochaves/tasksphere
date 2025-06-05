import type React from "react"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import Sidebar from "../organisms/Sidebar"
import ProjectFormModal from "../organisms/ProjectFormModal"
import { useModal } from "../../contexts/ModalContext"
import { cn } from "../../lib/utils"

interface DashboardTemplateProps {
  children: React.ReactNode
}

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { showNewProjectModal, closeNewProjectModal } = useModal()

  const handleProjectCreated = () => {
    // Recarregar a página atual para mostrar o novo projeto
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[#30363d] bg-[#161b22]/90 backdrop-blur-sm px-4 lg:hidden">
          <button 
            className="p-2 rounded-md text-[#8b949e] hover:bg-[#30363d]" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h1 className="text-lg font-semibold bg-gradient-to-r from-[#58a6ff] to-[#1f6feb] bg-clip-text text-transparent">TaskFlow</h1>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* Global Modals */}
      <ProjectFormModal 
        isOpen={showNewProjectModal} 
        onClose={closeNewProjectModal}
        onSuccess={handleProjectCreated}
        mode="create"
      />
    </div>
  )
}

export default DashboardTemplate