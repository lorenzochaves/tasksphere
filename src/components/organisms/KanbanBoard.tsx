import type React from "react"
import { useEffect, useState, useCallback, useMemo } from "react"
import { DragDropContext, DropResult } from "@hello-pangea/dnd"
import KanbanColumn from "../molecules/KanbanColumn"
import TaskModal from "./TaskModal"
import Typography from "../atoms/Typography"
import type { Task, KanbanColumnType } from "../../types"

export interface KanbanBoardProps {
  projectId: string
  tasks: Task[]
  isOwner: boolean
  isCollaborator: boolean
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>
  onRefreshTasks?: () => Promise<void>
}

const COLUMN_ORDER = ["todo", "in_progress", "done"] as const

const INITIAL_COLUMNS: Record<string, Omit<KanbanColumnType, 'tasks'>> = {
  todo: { id: "todo", title: "Backlog", color: "bg-[#161b22]" },
  in_progress: { id: "in_progress", title: "Em Progresso", color: "bg-[#161b22]" },
  done: { id: "done", title: "Concluído", color: "bg-[#161b22]" },
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  projectId,
  tasks,
  isOwner,
  isCollaborator,
  onTaskUpdate,
  onRefreshTasks
}) => {
  const [columns, setColumns] = useState<Record<string, KanbanColumnType>>(() => 
    Object.fromEntries(
      Object.entries(INITIAL_COLUMNS).map(([id, col]) => [id, { ...col, tasks: [] }])
    )
  )
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedColumnForNewTask, setSelectedColumnForNewTask] = useState<string | null>(null)

  // 🚀 Estado separado para controlar re-renders
  const [columnKeys, setColumnKeys] = useState<Record<string, number>>({
    todo: 0,
    in_progress: 0,
    done: 0
  })

  // Memoizar chaves de localStorage para evitar recálculos
  const storageKeys = useMemo(() => ({
    getColorKey: (colId: string) => `kanban_column_${projectId}_${colId}`,
    getOrderKey: (colId: string) => `kanban_order_${projectId}_${colId}`,
  }), [projectId])

  // Função otimizada para carregar cores das colunas
  const loadColumnColors = useCallback(() => {
    setColumns(prevColumns => {
      const updatedColumns = { ...prevColumns }
      
      COLUMN_ORDER.forEach((colId) => {
        try {
          const saved = localStorage.getItem(storageKeys.getColorKey(colId))
          if (saved) {
            const { color } = JSON.parse(saved)
            updatedColumns[colId] = { ...updatedColumns[colId], color }
          }
        } catch (error) {
          console.error(`Error loading color for column ${colId}:`, error)
        }
      })
      
      return updatedColumns
    })
  }, [storageKeys])

  // Função otimizada para organizar tarefas por coluna
  const organizeTasks = useCallback(() => {
    setColumns(prevColumns => {
      const updatedColumns = { ...prevColumns }
      
      COLUMN_ORDER.forEach((colId) => {
        const columnTasks = tasks.filter(t => t.status === colId)
        
        try {
          const savedOrder = localStorage.getItem(storageKeys.getOrderKey(colId))
          
          if (savedOrder) {
            const taskOrder = JSON.parse(savedOrder)
            // Ordenar tarefas baseado na ordem salva
            const orderedTasks = taskOrder
              .map((taskId: string) => columnTasks.find(t => t.id === taskId))
              .filter(Boolean)
            
            // Adicionar tarefas novas que não estão na ordem salva
            const newTasks = columnTasks.filter(t => !taskOrder.includes(t.id))
            
            updatedColumns[colId] = { 
              ...updatedColumns[colId], 
              tasks: [...orderedTasks, ...newTasks]
            }
          } else {
            updatedColumns[colId] = { ...updatedColumns[colId], tasks: columnTasks }
          }
        } catch (error) {
          console.error(`Error organizing tasks for column ${colId}:`, error)
          updatedColumns[colId] = { ...updatedColumns[colId], tasks: columnTasks }
        }
      })
      
      return updatedColumns
    })
  }, [tasks, storageKeys])

  // Efeitos otimizados
  useEffect(() => {
    loadColumnColors()
  }, [loadColumnColors])

  useEffect(() => {
    organizeTasks()
  }, [organizeTasks])

  // Função para salvar ordem das tarefas
  const saveTaskOrder = useCallback((columnId: string, taskIds: string[]) => {
    try {
      localStorage.setItem(storageKeys.getOrderKey(columnId), JSON.stringify(taskIds))
    } catch (error) {
      console.error(`Error saving task order for column ${columnId}:`, error)
    }
  }, [storageKeys])

  const handleDragEnd = useCallback(async (result: DropResult) => {
    const { source, destination } = result
    
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    // Reordenação dentro da mesma coluna
    if (source.droppableId === destination.droppableId) {
      const columnTasks = [...columns[source.droppableId].tasks]
      const [movedTask] = columnTasks.splice(source.index, 1)
      columnTasks.splice(destination.index, 0, movedTask)

      setColumns(prev => ({
        ...prev,
        [source.droppableId]: { ...prev[source.droppableId], tasks: columnTasks },
      }))
      
      const taskIds = columnTasks.map(task => task.id)
      saveTaskOrder(source.droppableId, taskIds)
      return
    }

    // Mover entre colunas diferentes
    const sourceColumn = [...columns[source.droppableId].tasks]
    const destColumn = [...columns[destination.droppableId].tasks]
    const [movedTask] = sourceColumn.splice(source.index, 1)

    movedTask.status = destination.droppableId as Task["status"]
    destColumn.splice(destination.index, 0, movedTask)

    setColumns(prev => ({
      ...prev,
      [source.droppableId]: { ...prev[source.droppableId], tasks: sourceColumn },
      [destination.droppableId]: { ...prev[destination.droppableId], tasks: destColumn },
    }))

    // Salvar ordem para ambas as colunas
    saveTaskOrder(source.droppableId, sourceColumn.map(task => task.id))
    saveTaskOrder(destination.droppableId, destColumn.map(task => task.id))

    // 🚀 Atualizar keys para forçar re-render
    setColumnKeys(prev => ({
      ...prev,
      [source.droppableId]: Date.now(),
      [destination.droppableId]: Date.now()
    }))

    try {
      await onTaskUpdate(movedTask.id, { status: movedTask.status })
    } catch (error) {
      console.error("Error updating task status:", error)
    }
  }, [columns, onTaskUpdate, saveTaskOrder])

  const handleAddTask = useCallback((columnId: string) => {
    setSelectedColumnForNewTask(columnId)
    setSelectedTask(null)
    setShowModal(true)
  }, [])

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task)
    setSelectedColumnForNewTask(null)
    setShowModal(true)
  }, [])

  const handleUpdateColumn = useCallback((columnId: string, updates: Partial<KanbanColumnType>) => {
    setColumns(prev => ({
      ...prev,
      [columnId]: { ...prev[columnId], ...updates },
    }))

    // Salvar cor da coluna no localStorage
    if (updates.color) {
      try {
        localStorage.setItem(
          storageKeys.getColorKey(columnId), 
          JSON.stringify({ color: updates.color })
        )
      } catch (error) {
        console.error(`Error saving column color for ${columnId}:`, error)
      }
    }
  }, [storageKeys])

  const handleTaskUpdate = useCallback(async () => {
    setShowModal(false)
    setSelectedTask(null)
    setSelectedColumnForNewTask(null)
    
    if (onRefreshTasks) {
      await onRefreshTasks()
    }
  }, [onRefreshTasks])

  const handleCloseModal = useCallback(() => {
    setShowModal(false)
    setSelectedTask(null)
    setSelectedColumnForNewTask(null)
  }, [])

  const getDefaultStatus = useCallback((): "todo" | "in_progress" | "done" => {
    return (selectedColumnForNewTask as "todo" | "in_progress" | "done") || "todo"
  }, [selectedColumnForNewTask])

  // 🚀 Estatísticas atualizadas com prioridades
  const stats = useMemo(() => {
    const priorityStats = tasks.reduce((acc, task) => {
      const priority = task.priority || "medium"
      acc[priority] = (acc[priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: tasks.length,
      completion: tasks.length > 0 ? Math.round((columns.done.tasks.length / tasks.length) * 100) : 0,
      low: priorityStats.low || 0,
      medium: priorityStats.medium || 0,
      high: priorityStats.high || 0,
    }
  }, [tasks, columns.done.tasks.length])

  return (
    <div className="flex flex-col h-full bg-[#010409]">
      {/* 🚀 Header atualizado com TaskSphere Board */}
      <div className="flex-shrink-0 px-3 md:px-6 py-4 border-b border-[#30363d]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          {/* 🚀 Legendas de Prioridade */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Typography variant="small" className="text-[#8b949e] font-medium mr-2">
                Prioridade:
              </Typography>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#238636]"></div>
              <Typography variant="small" className="text-[#8b949e]">
                Baixa: {stats.low}
              </Typography>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#d29922]"></div>
              <Typography variant="small" className="text-[#8b949e]">
                Média: {stats.medium}
              </Typography>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f85149]"></div>
              <Typography variant="small" className="text-[#8b949e]">
                Alta: {stats.high}
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Board - ALTURA FIXA */}
      <div className="flex-1 px-3 md:px-6 py-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-3 md:gap-6 h-[calc(100vh-240px)] overflow-x-auto">
            {COLUMN_ORDER.map((colId) => (
              <div key={colId} className="flex-shrink-0 w-[320px] md:flex-1 md:min-w-[300px] md:max-w-[400px]">
                <KanbanColumn
                  key={`${colId}-${columnKeys[colId]}`} // 🚀 Usar estado separado
                  column={columns[colId]}
                  onAddTask={handleAddTask}
                  onTaskClick={handleTaskClick}
                  onUpdateColumn={handleUpdateColumn}
                  isOwner={isOwner}
                  isCollaborator={isCollaborator}
                  projectId={projectId}
                />
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={showModal}
        onClose={handleCloseModal}
        task={selectedTask}
        projectId={projectId}
        defaultStatus={getDefaultStatus()}
        onTaskUpdate={handleTaskUpdate}
      />
    </div>
  )
}

export default KanbanBoard