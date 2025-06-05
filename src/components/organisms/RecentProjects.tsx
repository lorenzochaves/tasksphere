import React, { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { Plus, ArrowRight, Briefcase, TrendingUp } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { useModal } from "../../contexts/ModalContext"
import { fetchProjects, fetchTasks } from "../../services/api"
import ProjectCard from "../molecules/ProjectCard"
import Button from "../atoms/Button"
import Typography from "../atoms/Typography"
import type { Project } from "../../types"

interface ProjectProgress {
  progress: number
  totalTasks: number
  completedTasks: number
}

const RecentProjects: React.FC = () => {
  const { user } = useAuth()
  const { openNewProjectModal } = useModal()
  const [projects, setProjects] = useState<Project[]>([])
  const [progressMap, setProgressMap] = useState<Record<string, ProjectProgress>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProjectsData = useCallback(async () => {
    if (!user) return

    try {
      setIsLoading(true)
      setError(null)
      
      const data = await fetchProjects(user.id)
      
      // Ordenar por data de atualização mais recente e pegar os 3 primeiros
      const sortedProjects = data
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 3)
      
      setProjects(sortedProjects)

      // Carregar progresso para cada projeto
      const progressPromises = sortedProjects.map(async (project) => {
        try {
          const tasks = await fetchTasks(project.id)
          const completedTasks = tasks.filter(t => t.status === "done").length
          const totalTasks = tasks.length
          const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
          
          return {
            projectId: project.id,
            data: { progress, totalTasks, completedTasks }
          }
        } catch (error) {
          console.error(`Error loading tasks for project ${project.id}:`, error)
          return {
            projectId: project.id,
            data: { progress: 0, totalTasks: 0, completedTasks: 0 }
          }
        }
      })

      const progressResults = await Promise.all(progressPromises)
      const progressMap = progressResults.reduce((acc, { projectId, data }) => {
        acc[projectId] = data
        return acc
      }, {} as Record<string, ProjectProgress>)

      setProgressMap(progressMap)
    } catch (error) {
      console.error("Error loading projects:", error)
      setError("Erro ao carregar projetos. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadProjectsData()
  }, [loadProjectsData])

  const handleCreateProject = () => {
    openNewProjectModal()
  }

  const handleRetry = () => {
    loadProjectsData()
  }

  return (
    <section className="space-y-6">
      {/* Header simplificado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-[#58a6ff] to-[#3fb950] rounded-lg">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <Typography variant="h4" className="text-[#f0f6fc]">
              Projetos Recentes
            </Typography>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateProject}
            className="flex items-center gap-2 text-[#3fb950] border-[#238636] hover:bg-[#238636]/10"
          >
            <Plus className="w-4 h-4" />
            Novo Projeto
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex items-center gap-2 text-[#58a6ff] border-[#1f6feb] hover:bg-[#1f6feb]/10"
          >
            <Link to="/projects">
              Ver Todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className="h-48 rounded-lg bg-[#161b22] border border-[#30363d] animate-pulse"
            >
              <div className="p-4 space-y-3">
                <div className="h-4 bg-[#21262d] rounded animate-pulse"></div>
                <div className="h-3 bg-[#21262d] rounded w-3/4 animate-pulse"></div>
                <div className="h-2 bg-[#21262d] rounded animate-pulse"></div>
                <div className="h-6 bg-[#21262d] rounded mt-4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8 bg-[#161b22] border border-[#30363d] rounded-lg">
          <Typography variant="h5" className="text-[#f85149] mb-2">
            Erro ao carregar projetos
          </Typography>
          <Typography variant="body" className="text-[#8b949e] mb-4 text-center">
            {error}
          </Typography>
          <Button
            variant="outline"
            onClick={handleRetry}
            className="text-[#58a6ff] border-[#1f6feb] hover:bg-[#1f6feb]/10"
          >
            Tentar Novamente
          </Button>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-[#161b22] border border-[#30363d] rounded-lg">
          <div className="p-4 bg-[#8b949e]/10 rounded-full mb-4">
            <Briefcase className="w-8 h-8 text-[#8b949e]" />
          </div>
          <Typography variant="h5" className="text-[#f0f6fc] mb-2">
            Nenhum projeto encontrado
          </Typography>
          <Typography variant="body" className="text-[#8b949e] mb-4 text-center max-w-md">
            Você ainda não criou nenhum projeto. Comece criando seu primeiro projeto e organize suas tarefas.
          </Typography>
          <Button
            variant="primary"
            onClick={handleCreateProject}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Criar Primeiro Projeto
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              progress={progressMap[project.id]?.progress || 0}
              isOwner={project.creator_id === user?.id}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default RecentProjects