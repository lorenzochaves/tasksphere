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
      {/* ✅ Mobile sidebar overlay - só quando aberto */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ✅ Sidebar - sem duplicação */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar onMobileClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* ✅ Mobile header LIMPO - sem X */}
        <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#30363d] bg-[#161b22]/95 backdrop-blur-md px-4 lg:hidden">
          <div className="flex items-center gap-3">
            {/* ✅ Só botão de menu */}
            <button 
              className="p-2 rounded-lg text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc] transition-colors" 
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* ✅ Logo TaskSphere com gradiente correto */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#58a6ff] to-[#3fb950] flex items-center justify-center">
                <span className="text-white font-bold text-sm">TS</span>
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-[#58a6ff] to-[#3fb950] bg-clip-text text-transparent">
                TaskSphere
              </h1>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
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