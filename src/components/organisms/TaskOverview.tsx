import React, { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, CheckSquare, Plus, Clock } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { fetchAllUserTasks } from "../../services/api"
import TaskCard from "../molecules/TaskCard"
import Button from "../atoms/Button"
import Typography from "../atoms/Typography"
import type { Task } from "../../types"

const TaskOverview: React.FC = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTasks = useCallback(async () => {
    if (!user) return

    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchAllUserTasks(user.id)
      
      // Ordenar por prioridade e data de vencimento
      const sortedTasks = data
        .sort((a, b) => {
          // Prioridade alta primeiro
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          const priorityDiff = (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2)
          if (priorityDiff !== 0) return priorityDiff
          
          // Depois por data de vencimento mais próxima
          const dateA = new Date(a.due_date || '9999-12-31')
          const dateB = new Date(b.due_date || '9999-12-31')
          return dateA.getTime() - dateB.getTime()
        })
        .slice(0, 6)
      
      setTasks(sortedTasks)
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error)
      setError("Erro ao carregar tarefas. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const handleRetry = () => {
    loadTasks()
  }

  // Estatísticas das tarefas
  const stats = React.useMemo(() => {
    const totalTasks = tasks.length
    const pendingTasks = tasks.filter(t => t.status !== "done").length
    const todayTasks = tasks.filter(t => {
      if (!t.due_date) return false
      const today = new Date().toISOString().split("T")[0]
      return t.due_date.split("T")[0] === today
    }).length

    return { totalTasks, pendingTasks, todayTasks }
  }, [tasks])

  return (
    <section className="space-y-6">
      {/* Header com estatísticas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-[#58a6ff] to-[#3fb950] rounded-lg">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <Typography variant="h4" className="text-[#f0f6fc]">
              Minhas Tarefas
            </Typography>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex items-center gap-2 text-[#58a6ff] border-[#1f6feb] hover:bg-[#1f6feb]/10"
          >
            <Link to="/tasks">
              Ver Todas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div 
              key={i} 
              className="h-32 rounded-lg bg-[#161b22] border border-[#30363d] animate-pulse"
            >
              <div className="p-4 space-y-3">
                <div className="h-4 bg-[#21262d] rounded animate-pulse"></div>
                <div className="h-3 bg-[#21262d] rounded w-2/3 animate-pulse"></div>
                <div className="flex justify-between items-center mt-3">
                  <div className="h-2 bg-[#21262d] rounded w-1/4 animate-pulse"></div>
                  <div className="h-5 bg-[#21262d] rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8 bg-[#161b22] border border-[#30363d] rounded-lg">
          <Typography variant="h5" className="text-[#f85149] mb-2">
            Erro ao carregar tarefas
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
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-[#161b22] border border-[#30363d] rounded-lg">
          <div className="p-4 bg-[#8b949e]/10 rounded-full mb-4">
            <CheckSquare className="w-8 h-8 text-[#8b949e]" />
          </div>
          <Typography variant="h5" className="text-[#f0f6fc] mb-2">
            Nenhuma tarefa encontrada
          </Typography>
          <Typography variant="body" className="text-[#8b949e] mb-4 text-center max-w-md">
            Você ainda não tem tarefas criadas. Comece criando um projeto e suas primeiras tarefas!
          </Typography>
          <Button
            variant="primary"
            asChild
            className="flex items-center gap-2"
          >
            <Link to="/projects">
              <Plus className="w-4 h-4" />
              Criar Primeiro Projeto
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} showProject />
          ))}
        </div>
      )}
    </section>
  )
}

export default TaskOverview