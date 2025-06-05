import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Grid, List, FolderKanban } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { useModal } from "../../contexts/ModalContext"
import { persistentApi } from "../../services/localStorageApi"
import DashboardTemplate from "../templates/DashboardTemplate"
import ProjectCard from "../molecules/ProjectCard"
import SearchBar from "../molecules/SearchBar"
import FilterSelect from "../molecules/FilterSelect"
import Pagination from "../molecules/Pagination"
import Button from "../atoms/Button"
import Typography from "../atoms/Typography"
import type { Project } from "../../types"

const MyProjectsPage: React.FC = () => {
  const { user } = useAuth()
  const { openNewProjectModal } = useModal()
  const [projects, setProjects] = useState<Project[]>([])
  const [projectProgress, setProjectProgress] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const projectsPerPage = 9
  const navigate = useNavigate()

  // Load projects
  useEffect(() => {
    const loadProjects = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const projectsData = await persistentApi.getProjects(user.id)
        setProjects(projectsData)

        // Calculate progress for each project
        const progressData: Record<string, number> = {}
        for (const project of projectsData) {
          try {
            const tasks = await persistentApi.getTasks(project.id)
            const completedTasks = tasks.filter((task) => task.status === "done")
            const progress = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0
            progressData[project.id] = Math.round(progress)
          } catch (error) {
            progressData[project.id] = 0
          }
        }
        setProjectProgress(progressData)
      } catch (error) {
        console.error("Failed to load projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [user])

  // Memoized filtering and pagination
  const { filteredProjects, paginatedProjects, totalPages, projectStats } = useMemo(() => {
    let filtered = projects

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter) {
      const now = new Date()
      filtered = filtered.filter((project) => {
        switch (statusFilter) {
          case "active":
            return !project.end_date || new Date(project.end_date) > now
          case "completed":
            return projectProgress[project.id] === 100
          case "overdue":
            return project.end_date && new Date(project.end_date) < now && projectProgress[project.id] < 100
          default:
            return true
        }
      })
    }

    // Calculate stats
    const now = new Date()
    const stats = {
      total: filtered.length,
      active: filtered.filter(p => !p.end_date || new Date(p.end_date) > now).length,
      completed: filtered.filter(p => projectProgress[p.id] === 100).length,
      overdue: filtered.filter(p => p.end_date && new Date(p.end_date) < now && projectProgress[p.id] < 100).length
    }

    // Pagination
    const totalPages = Math.ceil(filtered.length / projectsPerPage)
    const startIndex = (currentPage - 1) * projectsPerPage
    const paginated = filtered.slice(startIndex, startIndex + projectsPerPage)

    return { 
      filteredProjects: filtered, 
      paginatedProjects: paginated, 
      totalPages,
      projectStats: stats
    }
  }, [projects, searchTerm, statusFilter, projectProgress, currentPage, projectsPerPage])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  const statusOptions = [
    { value: "", label: "Todos os Status" },
    { value: "active", label: "🚀 Em Andamento" },
    { value: "completed", label: "✅ Concluídos" },
    { value: "overdue", label: "⚠️ Atrasados" },
  ]

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("")
    setCurrentPage(1)
  }

  // Loading state
  if (isLoading) {
    return (
      <DashboardTemplate>
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-48 animate-pulse rounded bg-[#30363d]"></div>
              <div className="h-4 w-32 animate-pulse rounded bg-[#30363d]"></div>
            </div>
            <div className="h-10 w-32 animate-pulse rounded bg-[#30363d]"></div>
          </div>
          
          {/* Stats skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-[#161b22] border border-[#30363d]"></div>
            ))}
          </div>
          
          {/* Grid skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-lg bg-[#161b22] border border-[#30363d]"></div>
            ))}
          </div>
        </div>
      </DashboardTemplate>
    )
  }

  return (
    <DashboardTemplate>
      <div className="space-y-6">
        {/* Header com estatísticas */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#3fb950] rounded-lg">
              <FolderKanban className="w-5 h-5 text-white" />
            </div>
            <div>
              <Typography variant="h1" className="text-2xl font-bold text-[#f0f6fc]">
                Meus Projetos
              </Typography>
              <Typography variant="body" className="text-[#8b949e]">
                {filteredProjects.length} {filteredProjects.length === 1 ? "projeto" : "projetos"} encontrados
              </Typography>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={openNewProjectModal}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Projeto
          </Button>
        </div>

        {/* Filtros */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar projetos por nome ou descrição..."
              className="flex-1"
            />
            
            <FilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              placeholder="Status"
              className="w-full sm:w-48"
            />

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-[#0d1117] border border-[#30363d] rounded-lg p-1">
              <button
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-[#1f6feb] text-white shadow-sm"
                    : "text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
                }`}
                onClick={() => setViewMode("grid")}
                title="Visualização em grade"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-[#1f6feb] text-white shadow-sm"
                    : "text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
                }`}
                onClick={() => setViewMode("list")}
                title="Visualização em lista"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Clear Filters */}
            {(searchTerm || statusFilter) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-[#8b949e] border-[#30363d] hover:text-[#e6edf3]"
              >
                Limpar
              </Button>
            )}
          </div>
        </div>

        {/* Projects Container */}
        <div className="min-h-[500px] flex flex-col">
          {filteredProjects.length === 0 ? (
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-12 flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="p-4 bg-[#8b949e]/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FolderKanban className="w-8 h-8 text-[#8b949e]" />
                </div>
                <Typography variant="h5" className="text-[#f0f6fc] mb-2">
                  {searchTerm || statusFilter
                    ? "Nenhum projeto encontrado"
                    : "Nenhum projeto criado"}
                </Typography>
                <Typography variant="body" className="text-[#8b949e] mb-4">
                  {searchTerm || statusFilter
                    ? "Tente ajustar os filtros de busca ou criar novos projetos."
                    : "Crie seu primeiro projeto para começar a organizar suas tarefas."}
                </Typography>
                <Button variant="primary" onClick={openNewProjectModal}>
                  <Plus className="w-4 h-4 mr-2" />
                  {projects.length === 0 ? "Criar Primeiro Projeto" : "Novo Projeto"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Content */}
              <div className="flex-1 mb-6">
                <div className={
                  viewMode === "grid"
                    ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                    : "space-y-4"
                }>
                  {paginatedProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      progress={projectProgress[project.id] || 0}
                      isOwner={project.creator_id === user?.id}
                      onClick={() => navigate(`/projects/${project.id}`)}
                    />
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center pt-4 border-t border-[#30363d]">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={projectsPerPage}
                    totalItems={filteredProjects.length}
                    showInfo
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardTemplate>
  )
}

export default MyProjectsPage