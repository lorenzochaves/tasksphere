import type React from "react"
import { format } from "date-fns"
import { Calendar, User } from "lucide-react"
import { cn } from "../../lib/utils"
import Typography from "../atoms/Typography"
import type { Task } from "../../types"

interface TaskCardProps {
  task: Task
  onClick?: () => void
  showProject?: boolean
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, showProject = false }) => {
  const isOverdue = task.due_date ? new Date(task.due_date) < new Date() && task.status !== "done" : false

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-[#da3633]"     // Vermelho
      case "medium": return "bg-[#d29922]"   // Amarelo
      case "low": return "bg-[#238636]"      // Verde
      default: return "bg-[#8b949e]"         // Cinza padrão
    }
  }

  const getPriorityTitle = (priority: string) => {
    switch (priority) {
      case "high": return "Prioridade Alta"
      case "medium": return "Prioridade Média" 
      case "low": return "Prioridade Baixa"
      default: return "Sem prioridade"
    }
  }

  return (
    <div
      className="bg-[#0d1117] border border-[#30363d] hover:border-[#484f58] rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md"
      onClick={onClick}
    >
      {/* Imagem da tarefa */}
      {task.image_url && (
        <div className="relative h-20 w-full overflow-hidden bg-[#21262d]">
          <img 
            src={task.image_url} 
            alt={task.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="p-3 space-y-3">
        {/* Título e bolinhas */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Typography 
              variant="h6" 
              className="line-clamp-2 text-sm"
            >
              {task.title}
            </Typography>
          </div>
          
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Bolinha de prioridade */}
            {task.priority && (
              <div 
                className={cn(
                  "w-3 h-3 rounded-full",
                  getPriorityColor(task.priority)
                )}
                title={getPriorityTitle(task.priority)}
              />
            )}
          </div>
        </div>

        {/* Informações da tarefa */}
        <div className="space-y-2">
          {/* Data de vencimento */}
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 flex-shrink-0 text-[#8b949e]" />
            <Typography 
              variant="small" 
              className={cn(
                "text-[#8b949e]",
                isOverdue && "text-[#f85149] font-medium"
              )}
            >
              {task.due_date ? format(new Date(task.due_date), "dd/MM/yyyy") : "Sem data"}
            </Typography>
          </div>

          {/* Criador da tarefa */}
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 flex-shrink-0 text-[#8b949e]" />
            <Typography variant="small" className="text-[#8b949e] truncate">
              {task.creator_name || "Não atribuída"}
            </Typography>
          </div>

          {/* Nome do projeto (opcional) */}
          {showProject && task.project_name && (
            <div className="flex items-center gap-2">
              <svg className="h-3 w-3 text-[#8b949e]" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M1.75 0A1.75 1.75 0 000 1.75v12.5C0 15.216.784 16 1.75 16h12.5A1.75 1.75 0 0016 14.25V1.75A1.75 1.75 0 0014.25 0H1.75zM1.5 1.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v12.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25V1.75zM11.75 3a.75.75 0 00-.75.75v7.5a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75zm-8.25.75a.75.75 0 011.5 0v5.5a.75.75 0 01-1.5 0v-5.5zM8 3a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 008 3z"></path>
              </svg>
              <Typography variant="small" className="text-[#8b949e] font-medium truncate">
                {task.project_name}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskCard