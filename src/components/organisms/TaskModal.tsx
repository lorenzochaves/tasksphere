import React from "react"
import Modal from "../atoms/Modal"
import TaskForm from "./TaskForm"
import type { Task } from "../../types"

interface TaskModalProps {
  task?: Task | null
  isOpen: boolean
  onClose: () => void
  onTaskUpdate: () => void
  defaultStatus?: "todo" | "in_progress" | "done"
  projectId?: string
}

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onTaskUpdate,
  defaultStatus = "todo",
  projectId,
}) => {
  const handleSave = (_savedTask: Task) => {
    onTaskUpdate()
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? "Editar Tarefa" : "Nova Tarefa"}
      size="lg"
    >
      <TaskForm
        task={task || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
        defaultStatus={defaultStatus}
        projectId={projectId}
      />
    </Modal>
  )
}

export default TaskModal