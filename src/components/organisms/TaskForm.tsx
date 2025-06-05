import React, { useState, useEffect, useMemo } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useToast } from "../../contexts/ToastContext"
import { createTask, updateTask } from "../../services/api"
import { persistentApi } from "../../services/localStorageApi"
import { validateField, validationRules } from "../../utils/validation"
import Button from "../atoms/Button"
import Input from "../atoms/Input"
import Typography from "../atoms/Typography"
import { Calendar, Image, FileText, Flag } from "lucide-react"
import type { Task } from "../../types"

interface TaskFormProps {
  task?: Task
  onSave: (task: Task) => void
  onCancel: () => void
  defaultStatus?: "todo" | "in_progress" | "done"
  projectId?: string
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  task, 
  onSave, 
  onCancel, 
  defaultStatus = "todo", 
  projectId 
}) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    title: "",
    status: defaultStatus,
    priority: "medium" as "low" | "medium" | "high",
    due_date: "",
    image_url: "",
  })

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        due_date: task.due_date ? task.due_date.split("T")[0] : "",
        image_url: task.image_url || "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop",
      })
    } else {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setFormData(prev => ({
        ...prev,
        due_date: tomorrow.toISOString().split("T")[0],
        image_url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop",
      }))
    }
  }, [task, defaultStatus])

  const characterCount = useMemo(() => ({
    title: formData.title.length,
    isTitleValid: formData.title.trim().length >= 3 && formData.title.length <= 100,
  }), [formData.title])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório"
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Título deve ter no mínimo 3 caracteres"
    } else if (formData.title.length > 100) {
      newErrors.title = "Título deve ter no máximo 100 caracteres"
    }

    const imageUrlError = validateField("image_url", formData.image_url, [
      { required: true, message: "URL da imagem é obrigatória" },
      ...validationRules.imageUrl
    ])
    if (imageUrlError) newErrors.image_url = imageUrlError

    const dueDateError = validateField("due_date", formData.due_date, validationRules.dueDate)
    if (dueDateError) newErrors.due_date = dueDateError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!validateForm()) {
      toast({
        variant: "error",
        title: "Formulário inválido",
        description: "Verifique os campos destacados em vermelho"
      })
      return
    }

    setIsLoading(true)
    try {
      let projectName = task?.project_name || "Projeto Padrão"
      if (!task?.project_name && projectId) {
        try {
          const project = await persistentApi.getProject(projectId)
          projectName = project.name
        } catch (error) {
          console.warn("Failed to fetch project name, using fallback:", error)
        }
      }

      const taskData = {
        ...formData,
        title: formData.title.trim(),
        project_id: task?.project_id || projectId || "default",
        project_name: projectName,
        creator_id: user.id,
        creator_name: user.name,
      }

      if (task) {
        const updatedTask = await updateTask(task.id, taskData)
        toast({ 
          title: "Tarefa atualizada!",
          description: "As alterações foram salvas com sucesso.",
          variant: "success"
        })
        onSave(updatedTask)
      } else {
        const newTask = await createTask(taskData)
        toast({ 
          title: "Tarefa criada!",
          description: "Sua nova tarefa foi criada com sucesso.",
          variant: "success"
        })
        onSave(newTask)
      }
    } catch (error) {
      console.error("Task save error:", error)
      toast({
        variant: "error",
        title: `Erro ao ${task ? "atualizar" : "criar"} tarefa`,
        description: "Ocorreu um erro inesperado. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const statusOptions = [
    { value: "todo", label: "Backlog", color: "text-[#8b949e]" },
    { value: "in_progress", label: "Em Progresso", color: "text-[#d29922]" },
    { value: "done", label: "Concluído", color: "text-[#3fb950]" },
  ]

  const priorityOptions = [
    { value: "low", label: "Baixa", color: "text-[#238636]", bg: "bg-[#238636]" },
    { value: "medium", label: "Média", color: "text-[#d29922]", bg: "bg-[#d29922]" },
    { value: "high", label: "Alta", color: "text-[#f85149]", bg: "bg-[#f85149]" },
  ]

  const canSubmit = characterCount.isTitleValid && formData.title.trim()

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div>
        <Typography variant="small" as="label" className="mb-2 font-medium text-[#e6edf3] flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Título *
        </Typography>
        <Input
          type="text"
          placeholder="Digite um título descritivo para a tarefa"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          error={errors.title}
          maxLength={100}
          className={characterCount.isTitleValid ? "" : "border-[#f85149]"}
        />
        <div className="flex justify-between items-center mt-1">
          <Typography variant="muted" className={`text-xs ${errors.title ? 'text-[#f85149]' : ''}`}>
            {errors.title || "Mínimo 3 caracteres"}
          </Typography>
          <Typography 
            variant="muted" 
            className={`text-xs ${
              characterCount.isTitleValid 
                ? 'text-[#3fb950]' 
                : characterCount.title > 100 
                  ? 'text-[#f85149]' 
                  : 'text-[#8b949e]'
            }`}
          >
            {characterCount.title}/100
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Typography variant="small" as="label" className="mb-2 font-medium text-[#e6edf3]">
            Status
          </Typography>
          <select
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-sm text-[#e6edf3] focus:outline-none focus:ring-1 focus:ring-[#1f6feb] focus:border-[#1f6feb]"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Typography variant="small" as="label" className="mb-2 font-medium text-[#e6edf3] flex items-center gap-2">
            <Flag className="w-4 h-4" />
            Prioridade
          </Typography>
          <select
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-sm text-[#e6edf3] focus:outline-none focus:ring-1 focus:ring-[#1f6feb] focus:border-[#1f6feb]"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 mt-2">
            <Typography variant="muted" className="text-xs">
              Prioridade atual:
            </Typography>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${priorityOptions.find(p => p.value === formData.priority)?.bg}`}></div>
              <Typography variant="muted" className="text-xs">
                {priorityOptions.find(p => p.value === formData.priority)?.label}
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Typography variant="small" as="label" className="mb-2 font-medium text-[#e6edf3] flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Data de Vencimento *
        </Typography>
        <Input
          type="date"
          value={formData.due_date}
          onChange={(e) => handleChange("due_date", e.target.value)}
          error={errors.due_date}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      <div>
        <Typography variant="small" as="label" className="mb-2 font-medium text-[#e6edf3] flex items-center gap-2">
          <Image className="w-4 h-4" />
          URL da Imagem *
        </Typography>
        <Input
          type="url"
          placeholder="https://exemplo.com/imagem.jpg"
          value={formData.image_url}
          onChange={(e) => handleChange("image_url", e.target.value)}
          error={errors.image_url}
        />
        {formData.image_url && (
          <div className="mt-2 p-2 bg-[#161b22] border border-[#30363d] rounded-md">
            <Typography variant="muted" className="text-xs mb-2">
              Preview da imagem:
            </Typography>
            <img 
              src={formData.image_url} 
              alt="Preview" 
              className="w-full h-20 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        )}
        <Typography variant="muted" className="text-xs mt-1">
          Formatos suportados: JPG, PNG, GIF, WebP
        </Typography>
      </div>

      <div className="flex gap-3 pt-4 border-t border-[#30363d]">
        <Button 
          type="submit" 
          disabled={isLoading || !canSubmit}
          variant="primary"
          className="flex-1 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {task ? "Salvando..." : "Criando..."}
            </>
          ) : (
            <>
              {task ? "Atualizar Tarefa" : "Criar Tarefa"}
            </>
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={isLoading}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}

export default TaskForm