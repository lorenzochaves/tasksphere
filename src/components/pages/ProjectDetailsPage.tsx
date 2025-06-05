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
  BarChart3
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
      // Atualiza no localStorage
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

  // Para quando uma nova tarefa é criada
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

  // Calculate project status - ✅ Usando useMemo
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
        <div className="space-y-6 animate-pulse">
          {/* Header skeleton */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2 flex-1">
                <div className="h-8 w-64 bg-[#30363d] rounded"></div>
                <div className="h-4 w-96 bg-[#30363d] rounded"></div>
              </div>
              <div className="h-10 w-10 bg-[#30363d] rounded-lg"></div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-[#0d1117] border border-[#30363d] rounded-lg"></div>
              ))}
            </div>
          </div>
          
          {/* Kanban skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 bg-[#161b22] border border-[#30363d] rounded-lg"></div>
            ))}
          </div>
        </div>
      </DashboardTemplate>
    )
  }

  if (!project || !user) {
    return (
      <DashboardTemplate>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-[#f85149] mx-auto mb-4" />
            <Typography variant="h2" className="mb-2">Projeto não encontrado</Typography>
            <Typography variant="body" className="text-[#8b949e] mb-4">
              O projeto que você está procurando não existe ou foi removido.
            </Typography>
            <Button variant="primary" onClick={() => navigate("/projects")}>
              Voltar aos Projetos
            </Button>
          </div>
        </div>
      </DashboardTemplate>
    )
  }

  return (
    <DashboardTemplate>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="p-3 bg-[#3fb950] rounded-lg flex-shrink-0">
                <FolderKanban className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <Typography variant="h1" className="text-2xl font-bold text-[#f0f6fc] truncate">
                    {project.name}
                  </Typography>
                  <span className={`text-sm font-medium ${projectStatus.color}`}>
                    {projectStatus.label}
                  </span>
                </div>
                <Typography variant="body" className="text-[#8b949e] mb-3">
                  {project.description || "Sem descrição"}
                </Typography>
                
                {/* Project Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#8b949e]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Início: {new Date(project.start_date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  {project.end_date && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Fim: {new Date(project.end_date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                  
                  {/* ✅ COLABORADORES COM PREVIEW E CLIQUE */}
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <div className="flex items-center gap-2">
                      {/* Preview dos primeiros 3 colaboradores */}
                      <div className="flex -space-x-2">
                        {project.collaborators.slice(0, 3).map((collaborator) => (
                          <div
                            key={collaborator.id}
                            className="w-6 h-6 rounded-full border-2 border-[#161b22] hover:z-10 hover:scale-110 transition-transform bg-[#3fb950] flex items-center justify-center text-white text-xs font-medium"
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
                        {project.collaborators.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-[#30363d] border-2 border-[#161b22] flex items-center justify-center text-xs text-[#8b949e]">
                            +{project.collaborators.length - 3}
                          </div>
                        )}
                      </div>
                      
                      {/* Contador clicável */}
                      <button
                        onClick={() => setCollaboratorListOpen(true)}
                        className="hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer"
                      >
                        {project.collaborators.length} colaborador{project.collaborators.length !== 1 ? 'es' : ''}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProjectInfoOpen(true)}
              className="flex items-center gap-2 text-[#8b949e] border-[#30363d] hover:text-[#58a6ff] hover:border-[#58a6ff]"
            >
              <Settings className="w-4 h-4" />
              Configurações
            </Button>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-[#8b949e]" />
                <Typography variant="small" className="text-[#8b949e] font-medium">
                  Total
                </Typography>
              </div>
              <Typography variant="h5" className="text-[#f0f6fc]">
                {projectStats.total}
              </Typography>
              <Typography variant="muted" className="text-[#8b949e]">
                tarefas
              </Typography>
            </div>

            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-[#3fb950]" />
                <Typography variant="small" className="text-[#8b949e] font-medium">
                  Concluídas
                </Typography>
              </div>
              <Typography variant="h5" className="text-[#f0f6fc]">
                {projectStats.completed}
              </Typography>
              <Typography variant="muted" className="text-[#8b949e]">
                de {projectStats.total}
              </Typography>
            </div>

            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#58a6ff]" />
                <Typography variant="small" className="text-[#8b949e] font-medium">
                  Progresso
                </Typography>
              </div>
              <Typography variant="h5" className="text-[#f0f6fc]">
                {projectStats.progress}%
              </Typography>
              <div className="w-full bg-[#21262d] rounded-full h-1.5 mt-2">
                <div 
                  className="bg-[#3fb950] h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${projectStats.progress}%` }}
                />
              </div>
            </div>

            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-[#f85149]" />
                <Typography variant="small" className="text-[#8b949e] font-medium">
                  Atrasadas
                </Typography>
              </div>
              <Typography variant="h5" className="text-[#f0f6fc]">
                {projectStats.overdue}
              </Typography>
              <Typography variant="muted" className="text-[#8b949e]">
                tarefas
              </Typography>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#30363d]">
            <Typography variant="h3" className="text-[#f0f6fc] flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Quadro Kanban
            </Typography>
            <Typography variant="small" className="text-[#8b949e] mt-1">
              Gerencie suas tarefas arrastando entre as colunas
            </Typography>
          </div>
          
          <div className="p-4">
            <KanbanBoard
              projectId={project.id}
              tasks={tasks}
              isOwner={project.creator_id === user.id}
              isCollaborator={project.collaborators.some(c => c.id === user.id)}
              onTaskUpdate={handleTaskUpdate} // ✅ Função otimizada
              onTaskCreate={handleTaskCreate} // ✅ Função otimizada  
              onTaskDelete={handleTaskDelete} // ✅ Função otimizada
              onRefreshTasks={fetchProjectAndTasks} // ✅ Apenas para casos excepcionais
            />
          </div>
        </div>

        {/* ✅ MODAL DE COLABORADORES */}
        <CollaboratorListModal
          isOpen={isCollaboratorListOpen}
          onClose={() => setCollaboratorListOpen(false)}
          collaborators={project.collaborators}
          currentUserId={user?.id || null}
          projectOwnerId={project.creator_id}
        />

        {/* Modals existentes */}
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