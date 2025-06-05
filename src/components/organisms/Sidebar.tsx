import React, { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  CheckSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { useModal } from "../../contexts/ModalContext"
import Avatar from "../atoms/Avatar"
import Typography from "../atoms/Typography"
import { cn } from "../../lib/utils"

interface SidebarProps {
  onMobileClose?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ onMobileClose }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const { openNewProjectModal } = useModal()

  const handleLogout = async () => {
    await logout()
    navigate("/auth")
    onMobileClose?.()
  }

  const handleNavClick = () => {
    onMobileClose?.()
  }

  const navItems = [
    { 
      title: "Dashboard", 
      href: "/dashboard", 
      icon: LayoutDashboard,
      description: "Visão geral dos projetos"
    },
    { 
      title: "Projetos", 
      href: "/projects", 
      icon: FolderKanban,
      description: "Todos os seus projetos"
    },
    { 
      title: "Tarefas", 
      href: "/tasks", 
      icon: CheckSquare,
      description: "Gerenciar tarefas"
    },
   { 
      title: "Estatísticas", 
      href: "/stats", 
      icon: TrendingUp,
      description: "Análise de produtividade"
    },
    { 
      title: "Configurações", 
      href: "/settings", 
      icon: Settings,
      description: "Preferências do usuário"
    },
  ]

  return (
    <div className="flex h-full flex-col bg-[#0d1117] border-r border-[#21262d]">
      {/* ✅ Cabeçalho com botão X no mobile */}
      <div className="flex h-16 items-center justify-between border-b border-[#21262d] px-4 bg-[#161b22]/50">
        <Link 
          to="/dashboard" 
          onClick={handleNavClick}
          className={cn(
            "flex items-center gap-3 font-bold text-white transition-all duration-200",
            "hover:text-[#58a6ff] group",
            collapsed && "justify-center"
          )}
        >
          <div className={cn(
            "flex items-center justify-center rounded-xl font-bold text-sm transition-all duration-200",
            "bg-gradient-to-r from-[#58a6ff] to-[#3fb950] text-white shadow-lg",
            "group-hover:shadow-xl group-hover:scale-105",
            collapsed ? "w-10 h-10" : "w-9 h-9"
          )}>
            TS
          </div>
          {!collapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-[#58a6ff] to-[#3fb950] bg-clip-text text-transparent">
              TaskSphere
            </span>
          )}
        </Link>
        
        {/* ✅ Botão X no mobile ou collapse no desktop */}
        {onMobileClose ? (
          <button 
            className="p-2 rounded-lg text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc] transition-colors lg:hidden" 
            onClick={onMobileClose}
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "hidden md:flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
              "text-[#8b949e] hover:text-white hover:bg-[#21262d]",
              "transform hover:scale-105 active:scale-95"
            )}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* ✅ Navigation melhorada */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Botão de Novo Projeto */}
        <button
          onClick={() => {
            openNewProjectModal()
            onMobileClose?.()
          }}
          className={cn(
            "w-full group relative overflow-hidden",
            "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
            "bg-gradient-to-r from-[#238636] to-[#2ea043]",
            "text-white shadow-lg hover:shadow-xl",
            "hover:from-[#2ea043] hover:to-[#238636]",
            "transform hover:scale-[1.02] active:scale-[0.98]",
            collapsed && "justify-center px-3"
          )}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <PlusCircle className={cn("w-5 h-5 relative z-10", !collapsed && "mr-3")} />
          {!collapsed && (
            <span className="relative z-10 font-semibold">Novo Projeto</span>
          )}
        </button>

        {/* Links de Navegação */}
        <div className="space-y-1 pt-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || 
                            (item.href === "/projects" && location.pathname.startsWith("/project/"))
            
            return (
              <Link key={item.href} to={item.href} onClick={handleNavClick} className="block">
                <div
                  className={cn(
                    "group flex items-center px-4 py-3 rounded-lg text-sm transition-all duration-200",
                    "hover:bg-[#161b22] hover:border-[#30363d] border border-transparent",
                    isActive
                      ? "bg-[#161b22] text-[#58a6ff] border-[#1f6feb]/50 font-medium shadow-sm"
                      : "text-[#e6edf3] hover:text-white",
                    collapsed && "justify-center px-3"
                  )}
                >
                  <item.icon 
                    className={cn(
                      "w-5 h-5 transition-colors duration-200",
                      isActive ? "text-[#58a6ff]" : "text-[#8b949e] group-hover:text-[#e6edf3]",
                      !collapsed && "mr-3"
                    )} 
                  />
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.title}</div>
                      {!isActive && (
                        <div className="text-xs text-[#8b949e] group-hover:text-[#c9d1d9] transition-colors duration-200 mt-0.5">
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Indicador ativo */}
                  {isActive && (
                    <div className="w-1 h-6 bg-[#58a6ff] rounded-full ml-auto"></div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* ✅ Rodapé com usuário */}
      <div className="border-t border-[#21262d] p-4 bg-[#161b22]/30">
        <div className={cn(
          "flex items-center gap-3 mb-3 p-2 rounded-lg",
          "bg-[#161b22] border border-[#21262d]",
          collapsed && "justify-center"
        )}>
          <Avatar 
            src={user?.avatar} 
            alt={user?.name || "User"} 
            size={collapsed ? "sm" : "md"}
            className="ring-2 ring-[#21262d]"
          />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <Typography variant="small" className="text-[#e6edf3] font-medium truncate">
                {user?.name || "Usuário"}
              </Typography>
            </div>
          )}
        </div>
        
        <button
          className={cn(
            "w-full flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200",
            "text-[#f85149] hover:text-white hover:bg-[#f85149]/10",
            "border border-transparent hover:border-[#f85149]/20",
            "transform hover:scale-[1.02] active:scale-[0.98]",
            collapsed && "justify-center"
          )}
          onClick={handleLogout}
        >
          <LogOut className={cn("w-4 h-4", !collapsed && "mr-2")} />
          {!collapsed && "Sair"}
        </button>
      </div>
    </div>
  )
}

export default Sidebar