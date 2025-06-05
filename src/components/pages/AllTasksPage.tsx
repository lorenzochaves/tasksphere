import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Grid, List, CheckSquare, Plus, Clock, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { fetchAllUserTasks } from "../../services/api"
import DashboardTemplate from "../templates/DashboardTemplate"
import SearchBar from "../molecules/SearchBar"
import FilterSelect from "../molecules/FilterSelect"
import TaskCard from "../molecules/TaskCard"
import TaskModal from "../organisms/TaskModal"
import Pagination from "../molecules/Pagination"
import Button from "../atoms/Button"
import Typography from "../atoms/Typography"
import type { Task } from "../../types"

const AllTasksPage: React.FC = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedTask, setSelectedTask] = useState<Task | undefined>()
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 6

  // Load tasks
  useEffect(() => {
    const loadTasks = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const tasksData = await fetchAllUserTasks(user.id)
        setTasks(tasksData)
      } catch (error) {
        console.error("Failed to load tasks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [user])

  // Memoized filtering and pagination
  const { filteredTasks, paginatedTasks, totalPages, taskStats } = useMemo(() => {
    let filtered = tasks

    // Apply filters
    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.project_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    if (priorityFilter) {
      filtered = filtered.filter((task) => task.priority === priorityFilter)
    }

    // Calculate stats
    const stats = {
      total: filtered.length,
      pending: filtered.filter(t => t.status !== "done").length,
      highPriority: filtered.filter(t => t.priority === "high").length,
      overdue: filtered.filter(t => {
        if (!t.due_date) return false
        return new Date(t.due_date) < new Date()
      }).length
    }

    // Pagination
    const totalPages = Math.ceil(filtered.length / tasksPerPage)
    const startIndex = (currentPage - 1) * tasksPerPage
    const paginated = filtered.slice(startIndex, startIndex + tasksPerPage)

    return { 
      filteredTasks: filtered, 
      paginatedTasks: paginated, 
      totalPages,
      taskStats: stats
    }
  }, [tasks, searchTerm, statusFilter, priorityFilter, currentPage, tasksPerPage])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, priorityFilter])

  // Options for filters
  const statusOptions = [
    { value: "", label: "Todos os Status" },
    { value: "todo", label: "📋 Backlog" },
    { value: "in_progress", label: "⚡ Em Progresso" },
    { value: "done", label: "✅ Concluídos" },
  ]

  const priorityOptions = [
    { value: "", label: "Todas as Prioridades" },
    { value: "high", label: "🔥 Alta" },
    { value: "medium", label: "⚡ Média" },
    { value: "low", label: "📌 Baixa" },
  ]

  // Handlers
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsTaskModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsTaskModalOpen(false)
    setSelectedTask(undefined)
  }

  const handleTaskUpdate = async () => {
    if (!user) return
    try {
      const tasksData = await fetchAllUserTasks(user.id)
      setTasks(tasksData)
    } catch (error) {
      console.error("Failed to reload tasks:", error)
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("")
    setPriorityFilter("")
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
          
          {/* Filters skeleton */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
            <div className="flex gap-4">
              <div className="h-10 flex-1 animate-pulse rounded bg-[#30363d]"></div>
              <div className="h-10 w-32 animate-pulse rounded bg-[#30363d]"></div>
              <div className="h-10 w-32 animate-pulse rounded bg-[#30363d]"></div>
            </div>
          </div>
          
          {/* Grid skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-lg bg-[#161b22] border border-[#30363d]"></div>
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
            <div className="p-2 bg-[#f85149] rounded-lg">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <Typography variant="h1" className="text-2xl font-bold text-[#f0f6fc]">
                Todas as Tarefas
              </Typography>
              <Typography variant="body" className="text-[#8b949e]">
                {filteredTasks.length} {filteredTasks.length === 1 ? "tarefa" : "tarefas"} encontradas
              </Typography>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex items-center gap-2 text-[#58a6ff] border-[#1f6feb] hover:bg-[#1f6feb]/10"
          >
            <Link to="/projects">
              <Plus className="w-4 h-4" />
              Novo Projeto
            </Link>
          </Button>
        </div>

        {/* Quick Stats */}
        {taskStats.total > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#8b949e]" />
                <Typography variant="small" className="text-[#8b949e] font-medium">
                  Total
                </Typography>
              </div>
              <Typography variant="h5" className="text-[#f0f6fc] mt-1">
                {taskStats.total}
              </Typography>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d29922]" />
                <Typography variant="small" className="text-[#8b949e] font-medium">
                  Pendentes
                </Typography>
              </div>
              <Typography variant="h5" className="text-[#f0f6fc] mt-1">
                {taskStats.pending}
              </Typography>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#f85149]" />
                <Typography variant="small" className="text-[#8b949e] font-medium">
                  Alta Prior.
                </Typography>
              </div>
              <Typography variant="h5" className="text-[#f0f6fc] mt-1">
                {taskStats.highPriority}
              </Typography>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#f85149]"></div>
                <Typography variant="small" className="text-[#8b949e] font-medium">
                  Atrasadas
                </Typography>
              </div>
              <Typography variant="h5" className="text-[#f0f6fc] mt-1">
                {taskStats.overdue}
              </Typography>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por título ou projeto..."
              className="flex-1"
            />
            
            <FilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              placeholder="Status"
              className="w-full sm:w-48"
            />
            
            <FilterSelect
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={priorityOptions}
              placeholder="Prioridade"
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
                title="Visualização em grid"
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
            {(searchTerm || statusFilter || priorityFilter) && (
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

        {/* Tasks Container */}
        <div className="min-h-[500px] flex flex-col">
          {filteredTasks.length === 0 ? (
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-12 flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="p-4 bg-[#8b949e]/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckSquare className="w-8 h-8 text-[#8b949e]" />
                </div>
                <Typography variant="h5" className="text-[#f0f6fc] mb-2">
                  {searchTerm || statusFilter || priorityFilter
                    ? "Nenhuma tarefa encontrada"
                    : "Nenhuma tarefa disponível"}
                </Typography>
                <Typography variant="body" className="text-[#8b949e] mb-4">
                  {searchTerm || statusFilter || priorityFilter
                    ? "Tente ajustar os filtros de busca ou criar novas tarefas."
                    : "Crie seu primeiro projeto para começar a organizar suas tarefas."}
                </Typography>
                <Button variant="primary" asChild>
                  <Link to="/projects">
                    <Plus className="w-4 h-4 mr-2" />
                    {tasks.length === 0 ? "Criar Primeiro Projeto" : "Ver Projetos"}
                  </Link>
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
                  {paginatedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => handleTaskClick(task)}
                      showProject
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
                    itemsPerPage={tasksPerPage}
                    totalItems={filteredTasks.length}
                    showInfo
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal */}
        <TaskModal
          task={selectedTask}
          isOpen={isTaskModalOpen}
          onClose={handleCloseModal}
          onTaskUpdate={handleTaskUpdate}
        />
      </div>
    </DashboardTemplate>
  )
}

export default AllTasksPage