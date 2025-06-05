import React, { useState } from "react"
import { Droppable } from "@hello-pangea/dnd"
import { cn } from "../../lib/utils"
import { Plus, Palette } from "lucide-react"
import KanbanCard from "./KanbanCard"
import Pagination from "./Pagination"
import Button from "../atoms/Button"
import Typography from "../atoms/Typography"
import type { Task, KanbanColumnType as ColumnType } from "../../types"

const COLUMN_COLORS = [
  { name: "Default", value: "bg-[#161b22]" },
  { name: "Blue", value: "bg-blue-900/30" },
  { name: "Green", value: "bg-green-900/30" },
  { name: "Yellow", value: "bg-yellow-900/30" },
  { name: "Purple", value: "bg-purple-900/30" },
  { name: "Pink", value: "bg-pink-900/30" },
  { name: "Orange", value: "bg-orange-900/30" },
  { name: "Cyan", value: "bg-cyan-900/30" },
] as const

interface ColumnProps {
  column: ColumnType
  onAddTask?: (columnId: string) => void
  onTaskClick: (task: Task) => void
  onUpdateColumn: (columnId: string, updates: Partial<ColumnType>) => void
  isOwner: boolean
  isCollaborator: boolean
  projectId: string
}

const TASKS_PER_PAGE = 5

const KanbanColumn: React.FC<ColumnProps> = ({
  column,
  onAddTask,
  onTaskClick,
  onUpdateColumn,
  isOwner,
  isCollaborator,
  projectId,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleColorChange = (color: string) => {
    onUpdateColumn(column.id, { color })
    setShowColorPicker(false)
    
    // Save to localStorage safely
    try {
      const storageKey = `kanban_column_${projectId}_${column.id}`
      localStorage.setItem(storageKey, JSON.stringify({ color }))
    } catch (error) {
      console.warn('Failed to save column color to localStorage:', error)
    }
  }

  const startIndex = (currentPage - 1) * TASKS_PER_PAGE
  const endIndex = startIndex + TASKS_PER_PAGE
  const visibleTasks = column.tasks.slice(startIndex, endIndex)
  const hasPages = column.tasks.length > TASKS_PER_PAGE

  const headerColor = column.color || "bg-[#161b22]"

  return (
    <div className="w-full flex flex-col rounded-md shadow-sm bg-[#0d1117] border border-[#30363d] h-full">
      {/* Header */}
      <div className={cn("p-2 md:p-3 flex justify-between items-center border-b border-[#30363d] rounded-t-md", headerColor)}>
        <Typography variant="h5" className="text-white text-sm md:text-base">
          {column.title}
        </Typography>
        <div className="flex items-center gap-1">
          <Typography 
            variant="small" 
            className="bg-[#30363d] text-[#8b949e] px-2 py-1 rounded"
          >
            {column.tasks.length}
          </Typography>
          
          {/* Color picker (only for owners/collaborators) */}
          {(isOwner || isCollaborator) && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6 text-[#8b949e] hover:text-white hover:bg-[#30363d]"
                onClick={() => setShowColorPicker(!showColorPicker)}
                aria-label="Alterar cor da coluna"
              >
                <Palette className="h-3 w-3" />
              </Button>
              
              {showColorPicker && (
                <div className="absolute top-8 right-0 z-50 w-56 md:w-64 bg-[#0d1117] border border-[#30363d] rounded-md p-3 shadow-lg">
                  <Typography variant="small" className="font-semibold mb-2 text-white">
                    Cor da Coluna
                  </Typography>
                  <div className="grid grid-cols-4 gap-2">
                    {COLUMN_COLORS.map((color) => (
                      <button
                        key={color.name}
                        className={cn(
                          "h-8 w-full rounded-md border border-[#30363d] hover:opacity-80 transition-opacity",
                          color.value
                        )}
                        onClick={() => handleColorChange(color.value)}
                        title={color.name}
                        aria-label={`Cor ${color.name}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Droppable area - CUIDADO: Não modificar estrutura para não quebrar DnD */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 p-2 space-y-2 overflow-y-auto min-h-0",
              snapshot.isDraggingOver && "bg-[#1c2128]"
            )}
          >
            {visibleTasks.map((task, index) => (
              <KanbanCard
                key={task.id}
                task={task}
                index={startIndex + index} // IMPORTANTE: índice correto para DnD
                onClick={() => onTaskClick(task)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Pagination */}
      {hasPages && (
        <div className="p-2 border-t border-[#30363d]">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(column.tasks.length / TASKS_PER_PAGE)}
            onPageChange={setCurrentPage}
            itemsPerPage={TASKS_PER_PAGE}
            totalItems={column.tasks.length}
            showInfo={false}
            className="justify-center"
          />
        </div>
      )}

      {/* Add task button */}
      {(isOwner || isCollaborator) && (
        <div className="p-1 md:p-2 border-t border-[#30363d]">
          <Button
            variant="ghost"
            className="w-full text-white hover:bg-[#30363d] justify-center text-xs md:text-sm py-1 md:py-2"
            onClick={() => onAddTask?.(column.id)}
          >
            <Plus className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
            Nova Tarefa
          </Button>
        </div>
      )}
    </div>
  )
}

export default KanbanColumn