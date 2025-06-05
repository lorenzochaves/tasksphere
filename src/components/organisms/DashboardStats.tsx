import React, { useState, useEffect } from "react"
import { FolderOpen, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { fetchProjects, fetchAllUserTasks } from "../../services/api"
import StatCard from "../molecules/StatCard"

const DashboardStats: React.FC = () => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  })

  useEffect(() => {
    const load = async () => {
      if (!user) return
      try {
        const [projects, tasks] = await Promise.all([
          fetchProjects(user.id),
          fetchAllUserTasks(user.id),
        ])

        const today = new Date()
        const overdue = tasks.filter(t => 
          t.status !== "done" && 
          t.due_date && 
          new Date(t.due_date) < today
        ).length

        setStats({
          totalProjects: projects.length,
          completedTasks: tasks.filter(t => t.status === "done").length,
          pendingTasks: tasks.filter(t => t.status !== "done").length,
          overdueTasks: overdue,
        })
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [user])

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl w-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <div 
              key={i} 
              className="h-32 bg-[#161b22] border border-[#30363d] rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  const completionRate = stats.completedTasks + stats.pendingTasks > 0 
    ? Math.round((stats.completedTasks / (stats.completedTasks + stats.pendingTasks)) * 100)
    : 0

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full">
        <StatCard
          title="Projetos Criados"
          value={stats.totalProjects}
          icon={FolderOpen}
          variant="info"
          trend={stats.totalProjects > 0 ? { value: 12, isPositive: true } : undefined}
        />
        
        <StatCard
          title="Taxa de Conclusão"
          value={`${completionRate}%`}
          icon={TrendingUp}
          variant={completionRate >= 80 ? "success" : completionRate >= 50 ? "warning" : "danger"}
          trend={{ value: completionRate, isPositive: completionRate >= 50 }}
        />
        
        <StatCard
          title="Tarefas Concluídas"
          value={stats.completedTasks}
          icon={CheckCircle}
          variant="success"
        />
        
        <StatCard
          title={stats.overdueTasks > 0 ? "Tarefas Atrasadas" : "Tarefas Pendentes"}
          value={stats.overdueTasks > 0 ? stats.overdueTasks : stats.pendingTasks}
          icon={stats.overdueTasks > 0 ? AlertCircle : Clock}
          variant={stats.overdueTasks > 0 ? "danger" : "warning"}
        />
      </div>
    </div>
  )
}

export default DashboardStats