import React from "react"
import { Draggable } from "@hello-pangea/dnd"
import { format } from "date-fns"
import { Calendar, User } from "lucide-react"
import { cn } from "../../lib/utils"
import Card, { CardContent, CardHeader } from "../atoms/Card"
import Typography from "../atoms/Typography"
import type { Task } from "../../types"

interface KanbanCardProps {
  task: Task
  onClick: () => void
  index: number
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task, onClick, index }) => {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date()

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
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          hover
          className={cn(
            "cursor-pointer transition-all duration-150",
            snapshot.isDragging && "opacity-60 rotate-1 shadow-lg scale-105",
            isOverdue && "border-[#da3633]",
          )}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <Typography 
                variant="h6" 
                className="line-clamp-2 leading-tight flex-1"
              >
                {task.title}
              </Typography>
              
              {/* Bolinha de prioridade */}
              {task.priority && (
                <div 
                  className={cn(
                    "w-3 h-3 rounded-full flex-shrink-0",
                    getPriorityColor(task.priority)
                  )}
                  title={getPriorityTitle(task.priority)}
                />
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-2">
            {/* Imagem da tarefa */}
            {task.image_url && (
              <div className="w-full h-20 rounded-md overflow-hidden bg-[#21262d]">
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

            {/* Data de vencimento */}
            <div className="flex items-center gap-2 text-xs text-[#8b949e]">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <Typography 
                variant="small" 
                className={cn("text-[#8b949e]", isOverdue && "text-[#f85149] font-medium")}
              >
                {task.due_date ? format(new Date(task.due_date), "dd/MM/yyyy") : "Sem data"}
              </Typography>
            </div>

            {/* Criador da tarefa */}
            <div className="flex items-center gap-2 text-xs text-[#8b949e]">
              <User className="h-3 w-3 flex-shrink-0" />
              <Typography variant="small" className="text-[#8b949e] truncate">
                {task.creator_name || "Não atribuída"}
              </Typography>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  )
}

export default KanbanCard