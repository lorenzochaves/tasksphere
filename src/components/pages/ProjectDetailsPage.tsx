import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useToast } from "../../contexts/ToastContext"
import { persistentApi } from "../../services/localStorageApi"
import KanbanBoard from "../organisms/KanbanBoard"
import type { Project, Task } from "../../types"
import ProjectInfoModal from "../organisms/ProjectInfoModal"
import CollaboratorManager from "../organisms/CollaboratorManager"
import CollaboratorListModal from "../organisms/CollaboratorListModal"
import EditProjectModal from "../organisms/EditProjectModal"
import DashboardTemplate from "../templates/DashboardTemplate"
import Typography from "../atoms/Typography"
import Button from "../atoms/Button"
import { 
  Settings, 
  Calendar, 
  Users, 
  Clock, 
  FolderKanban,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  BarChart3,
  ChevronDown,
  Info
} from "lucide-react"

const ProjectDetailsPage: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const { id: projectId } = useParams<{ id: string }>()

  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProjectInfoOpen, setProjectInfoOpen] = useState(false)
  const [isCollaboratorManagerOpen, setCollaboratorManagerOpen] = useState(false)
  const [isCollaboratorListOpen, setCollaboratorListOpen] = useState(false)
  const [statsExpanded, setStatsExpanded] = useState(false) // ✅ Para mobile

  const fetchProjectAndTasks = async () => {
    try {
      setIsLoading(true)
      if (!projectId) return
      
      const projectData = await persistentApi.getProject(projectId)
      const taskData = await persistentApi.getTasks(projectId)
      
      setProject(projectData)
      setTasks(taskData)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar o projeto.",
        variant: "error",
      })
      navigate("/projects")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjectAndTasks()
  }, [projectId])

  // ✅ FUNÇÃO OTIMIZADA - Atualiza apenas o estado local
  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      await persistentApi.updateTask(taskId, updates)
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, ...updates }
            : task
        )
      )
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa.",
        variant: "error",
      })
      if (projectId) {
        const taskData = await persistentApi.getTasks(projectId)
        setTasks(taskData)
      }
    }
  }

  const handleTaskCreate = async (newTask: Task) => {
    setTasks(prevTasks => [...prevTasks, newTask])
  }

  const handleTaskDelete = async (taskId: string) => {
    try {
      await persistentApi.deleteTask(taskId)
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tarefa.",
        variant: "error",
      })
    }
  }

  const handleDeleteProject = async () => {
    if (!project) return
    
    if (window.confirm(`Tem certeza que deseja excluir o projeto "${project.name}"? Esta ação não pode ser desfeita.`)) {
      try {
        await persistentApi.deleteProject(project.id)
        toast({
          title: "Sucesso",
          description: "Projeto excluído com sucesso.",
          variant: "success",
        })
        navigate("/projects")
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível excluir o projeto.",
          variant: "error",
        })
      }
    }
  }

  // Calculate project stats
  const projectStats = React.useMemo(() => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(task => task.status === "done").length
    const inProgressTasks = tasks.filter(task => task.status === "in_progress").length
    const todoTasks = tasks.filter(task => task.status === "todo").length
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    
    const overdueTasks = tasks.filter(task => {
      if (!task.due_date || task.status === "done") return false
      return new Date(task.due_date) < new Date()
    }).length

    return {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      todo: todoTasks,
      overdue: overdueTasks,
      progress
    }
  }, [tasks])

  // Calculate project status
  const projectStatus = React.useMemo(() => {
    if (!project?.end_date) return { status: "active", color: "text-[#58a6ff]", label: "🚀 Em Andamento" }
    
    const endDate = new Date(project.end_date)
    const now = new Date()
    
    if (projectStats.progress === 100) {
      return { status: "completed", color: "text-[#3fb950]", label: "✅ Concluído" }
    }
    
    if (endDate < now) {
      return { status: "overdue", color: "text-[#f85149]", label: "⚠️ Atrasado" }
    }
    
    return { status: "active", color: "text-[#58a6ff]", label: "🚀 Em Andamento" }
  }, [project?.end_date, projectStats.progress])

  // Loading state
  if (isLoading) {
    return (
      <DashboardTemplate>
        <div className="space-y-4 sm:space-y-6 animate-pulse">
          {/* Mobile-friendly skeleton */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 sm:p-6">
            <div className="space-y-3">
              <div className="h-6 sm:h-8 w-3/4 bg-[#30363d] rounded"></div>
              <div className="h-4 w-full bg-[#30363d] rounded"></div>
              <div className="h-4 w-2/3 bg-[#30363d] rounded"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 sm:h-20 bg-[#0d1117] border border-[#30363d] rounded-lg"></div>
              ))}
            </div>
          </div>
          
          {/* Kanban skeleton */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
            <div className="h-64 bg-[#0d1117] rounded-lg"></div>
          </div>
        </div>
      </DashboardTemplate>
    )
  }

  if (!project || !user) {
    return (
      <DashboardTemplate>
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-[#f85149] mx-auto mb-4" />
            <Typography variant="h2" className="mb-2 text-lg sm:text-xl">Projeto não encontrado</Typography>
            <Typography variant="body" className="text-[#8b949e] mb-4 text-sm sm:text-base">
              O projeto que você está procurando não existe ou foi removido.
            </Typography>
            <Button variant="primary" onClick={() => navigate("/projects")} className="w-full sm:w-auto">
              Voltar aos Projetos
            </Button>
          </div>
        </div>
      </DashboardTemplate>
    )
  }

  return (
    <DashboardTemplate>
      <div className="space-y-4 sm:space-y-6">
        {/* ✅ Header responsivo melhorado */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 sm:p-6">
          {/* ✅ Mobile-first layout */}
          <div className="space-y-4">
            {/* Cabeçalho principal */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-[#3fb950] rounded-lg flex-shrink-0">
                <FolderKanban className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <Typography variant="h1" className="text-lg sm:text-2xl font-bold text-[#f0f6fc] truncate mb-1">
                      {project.name}
                    </Typography>
                    <span className={`inline-block text-xs sm:text-sm font-medium px-2 py-1 rounded-full bg-opacity-20 ${projectStatus.color}`}>
                      {projectStatus.label}
                    </span>
                  </div>
                  
                  {/* ✅ Botão configurações otimizado para mobile */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setProjectInfoOpen(true)}
                    className="flex items-center gap-1 text-[#8b949e] border-[#30363d] hover:text-[#58a6ff] hover:border-[#58a6ff] text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Configurações</span>
                  </Button>
                </div>
                
                {/* ✅ Descrição melhorada */}
                {project.description && (
                  <Typography variant="body" className="text-[#8b949e] mt-2 text-sm sm:text-base line-clamp-2">
                    {project.description}
                  </Typography>
                )}
              </div>
            </div>

            {/* ✅ Meta info em stack vertical no mobile */}
            <div className="space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-4 text-sm text-[#8b949e] border-t border-[#30363d] pt-3 sm:border-t-0 sm:pt-0">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Início: {new Date(project.start_date).toLocaleDateString('pt-BR')}</span>
              </div>
              
              {project.end_date && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Fim: {new Date(project.end_date).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
              
              {/* ✅ Colaboradores otimizado para mobile */}
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 flex-shrink-0" />
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {/* Preview compacto */}
                  <div className="flex -space-x-1">
                    {project.collaborators.slice(0, 2).map((collaborator) => (
                      <div
                        key={collaborator.id}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-[#161b22] bg-[#3fb950] flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                        title={collaborator.name}
                      >
                        {collaborator.avatar ? (
                          <img
                            src={collaborator.avatar}
                            alt={collaborator.name}
                            className="w-full h-full rounded-full"
                          />
                        ) : (
                          collaborator.name.charAt(0).toUpperCase()
                        )}
                      </div>
                    ))}
                    {project.collaborators.length > 2 && (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#30363d] border-2 border-[#161b22] flex items-center justify-center text-xs text-[#8b949e] flex-shrink-0">
                        +{project.collaborators.length - 2}
                      </div>
                    )}
                  </div>
                  
                  {/* Texto clicável */}
                  <button
                    onClick={() => setCollaboratorListOpen(true)}
                    className="hover:text-[#58a6ff] hover:underline transition-colors text-xs sm:text-sm truncate"
                  >
                    {project.collaborators.length} colaborador{project.collaborators.length !== 1 ? 'es' : ''}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Stats expansíveis no mobile */}
          <div className="mt-4 sm:mt-6">
            {/* Botão para expandir stats no mobile */}
            <button
              onClick={() => setStatsExpanded(!statsExpanded)}
              className="w-full sm:hidden flex items-center justify-between p-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#8b949e] hover:text-[#f0f6fc] transition-colors"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Estatísticas do Projeto</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${statsExpanded ? 'rotate-180' : ''}`} />
            </button>

            {/* Stats grid - sempre visível no desktop, expansível no mobile */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 ${statsExpanded ? 'block' : 'hidden sm:grid'} ${statsExpanded ? 'mt-3' : ''}`}>
              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-[#8b949e]" />
                  <Typography variant="small" className="text-[#8b949e] font-medium text-xs sm:text-sm">
                    Total
                  </Typography>
                </div>
                <Typography variant="h5" className="text-[#f0f6fc] text-lg sm:text-xl">
                  {projectStats.total}
                </Typography>
                <Typography variant="muted" className="text-[#8b949e] text-xs sm:text-sm">
                  tarefas
                </Typography>
              </div>

              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#3fb950]" />
                  <Typography variant="small" className="text-[#8b949e] font-medium text-xs sm:text-sm">
                    Concluídas
                  </Typography>
                </div>
                <Typography variant="h5" className="text-[#f0f6fc] text-lg sm:text-xl">
                  {projectStats.completed}
                </Typography>
                <Typography variant="muted" className="text-[#8b949e] text-xs sm:text-sm">
                  de {projectStats.total}
                </Typography>
              </div>

              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-[#58a6ff]" />
                  <Typography variant="small" className="text-[#8b949e] font-medium text-xs sm:text-sm">
                    Progresso
                  </Typography>
                </div>
                <Typography variant="h5" className="text-[#f0f6fc] text-lg sm:text-xl">
                  {projectStats.progress}%
                </Typography>
                <div className="w-full bg-[#21262d] rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-[#3fb950] h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${projectStats.progress}%` }}
                  />
                </div>
              </div>

              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#f85149]" />
                  <Typography variant="small" className="text-[#8b949e] font-medium text-xs sm:text-sm">
                    Atrasadas
                  </Typography>
                </div>
                <Typography variant="h5" className="text-[#f0f6fc] text-lg sm:text-xl">
                  {projectStats.overdue}
                </Typography>
                <Typography variant="muted" className="text-[#8b949e] text-xs sm:text-sm">
                  tarefas
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Kanban Board com header melhorado */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-[#30363d]">
            <Typography variant="h3" className="text-[#f0f6fc] flex items-center gap-2 text-base sm:text-lg">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              Quadro Kanban
            </Typography>
            <Typography variant="small" className="text-[#8b949e] mt-1 text-xs sm:text-sm">
              Gerencie suas tarefas arrastando entre as colunas
            </Typography>
          </div>
          
          <div className="p-2 sm:p-4">
            <KanbanBoard
              projectId={project.id}
              tasks={tasks}
              isOwner={project.creator_id === user.id}
              isCollaborator={project.collaborators.some(c => c.id === user.id)}
              onTaskUpdate={handleTaskUpdate}
              onTaskCreate={handleTaskCreate}
              onTaskDelete={handleTaskDelete}
              onRefreshTasks={fetchProjectAndTasks}
            />
          </div>
        </div>

        {/* Modals */}
        <CollaboratorListModal
          isOpen={isCollaboratorListOpen}
          onClose={() => setCollaboratorListOpen(false)}
          collaborators={project.collaborators}
          currentUserId={user?.id || null}
          projectOwnerId={project.creator_id}
        />

        <ProjectInfoModal
          isOpen={isProjectInfoOpen}
          onClose={() => setProjectInfoOpen(false)}
          project={project}
          isOwner={project.creator_id === user.id}
          onManageCollaborators={() => {
            setProjectInfoOpen(false)
            setCollaboratorManagerOpen(true)
          }}
          onDelete={handleDeleteProject}
        />

        {isCollaboratorManagerOpen && (
          <CollaboratorManager
            isOpen={isCollaboratorManagerOpen}
            onClose={() => setCollaboratorManagerOpen(false)}
            project={project}
            onCollaboratorsUpdate={async (updatedCollaborators) => {
              try {
                const updatedProject = await persistentApi.updateProject(project.id, {
                  ...project,
                  collaborators: updatedCollaborators
                })
                setProject(updatedProject)
                toast({
                  title: "Sucesso",
                  description: "Colaboradores atualizados com sucesso.",
                  variant: "success",
                })
              } catch (error) {
                toast({
                  title: "Erro",
                  description: "Não foi possível atualizar os colaboradores.",
                  variant: "error",
                })
              }
            }}
          />
        )}

        <EditProjectModal onProjectUpdate={async (updatedProject) => {
          setProject(updatedProject)
        }} />
      </div>
    </DashboardTemplate>
  )
}

export default ProjectDetailsPage