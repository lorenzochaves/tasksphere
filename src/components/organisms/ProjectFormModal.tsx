import React, { useState, useEffect, useMemo } from "react"
import { X, Calendar, Target, Users, Plus, Lightbulb, Edit } from "lucide-react"
import Modal from "../atoms/Modal"
import Button from "../atoms/Button"
import Input from "../atoms/Input"
import Typography from "../atoms/Typography"
import { useToast } from "../../contexts/ToastContext"
import { useAuth } from "../../contexts/AuthContext"
import { createProject, updateProject } from "../../services/api"
import type { Project } from "../../types"

interface ProjectFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  project?: Project // Se existir, é edit mode
  mode?: "create" | "edit"
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  project,
  mode = project ? "edit" : "create"
}) => {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
  })

  // Preencher form se for edit mode
  useEffect(() => {
    if (project && mode === "edit") {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        start_date: project.start_date?.split("T")[0] || "",
        end_date: project.end_date?.split("T")[0] || "",
      })
    }
  }, [project, mode])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // 🚀 Validação do título (3-70 caracteres)
    if (!formData.name.trim()) {
      newErrors.name = "Nome do projeto é obrigatório"
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Nome do projeto deve ter no mínimo 3 caracteres"
    } else if (formData.name.length > 70) {
      newErrors.name = "Nome do projeto deve ter no máximo 70 caracteres"
    }

    // 🚀 Validação da descrição (máximo 500 caracteres)
    if (formData.description.length > 500) {
      newErrors.description = "Descrição deve ter no máximo 500 caracteres"
    }

    // 🚀 Validação das datas
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date)
      const endDate = new Date(formData.end_date)
      if (endDate < startDate) {
        newErrors.end_date = "Data de fim deve ser posterior à data de início"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !user) return

    try {
      setIsSubmitting(true)
      
      const projectData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
      }

      if (mode === "edit" && project) {
        await updateProject(project.id, projectData)
        toast({
          title: "Projeto atualizado!",
          description: "As alterações foram salvas com sucesso.",
          variant: "success",
        })
      } else {
        await createProject({
          ...projectData,
          creator_id: user.id,
          collaborators: [user],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        toast({
          title: "Projeto criado!",
          description: "Seu novo projeto foi criado com sucesso.",
          variant: "success",
        })
      }

      handleClose()
      onSuccess()
    } catch (error) {
      console.error("Failed to save project:", error)
      toast({
        title: `Erro ao ${mode === "edit" ? "atualizar" : "criar"} projeto`,
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      // Reset form apenas se for create mode
      if (mode === "create") {
        setFormData({
          name: "",
          description: "",
          start_date: new Date().toISOString().split("T")[0],
          end_date: "",
        })
      }
      setErrors({})
    }
  }

  // 🚀 Memoizar contadores para performance
  const characterCounts = useMemo(() => ({
    name: formData.name.length,
    description: formData.description.length,
    isNameValid: formData.name.trim().length >= 3 && formData.name.length <= 70,
    isDescriptionValid: formData.description.length <= 500
  }), [formData.name, formData.description])

  if (!isOpen) return null

  const isEditMode = mode === "edit"
  const modalTitle = isEditMode ? "Editar Projeto" : "Criar Novo Projeto"
  const modalSubtitle = isEditMode 
    ? "Atualize as informações do seu projeto" 
    : "Configure seu projeto e comece a colaborar"
  const submitText = isEditMode ? "Salvar Alterações" : "Criar Projeto"
  const ModalIcon = isEditMode ? Edit : Plus

  // Verificar se pode submeter
  const canSubmit = characterCounts.isNameValid && characterCounts.isDescriptionValid && formData.name.trim()

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="full">
      <div className="bg-[#21262d] rounded-lg w-full max-w-5xl mx-auto shadow-lg border border-[#30363d]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d] sticky top-0 bg-[#21262d] z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isEditMode ? 'bg-[#1f6feb]' : 'bg-[#238636]'}`}>
              <ModalIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <Typography variant="h4" className="text-[#e6edf3]">
                {modalTitle}
              </Typography>
              <Typography variant="small" className="text-[#8b949e]">
                {modalSubtitle}
              </Typography>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-[#8b949e] hover:text-[#e6edf3]"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row overflow-hidden max-h-[80vh]">
          {/* Main Form */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 🚀 Nome do Projeto com contador */}
              <div>
                <Typography variant="small" as="label" className="mb-2 font-medium text-[#e6edf3]">
                  Nome do Projeto *
                </Typography>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Digite o nome do projeto"
                  disabled={isSubmitting}
                  error={errors.name}
                  maxLength={70}
                />
                <div className="flex justify-between items-center mt-1">
                  <Typography variant="muted" className="text-xs">
                    Mínimo 3 caracteres
                  </Typography>
                  <Typography 
                    variant="muted" 
                    className={`text-xs ${
                      characterCounts.isNameValid 
                        ? 'text-[#3fb950]' 
                        : characterCounts.name > 70 
                          ? 'text-[#f85149]' 
                          : characterCounts.name >= 3
                            ? 'text-[#3fb950]'
                            : 'text-[#8b949e]'
                    }`}
                  >
                    {characterCounts.name}/70
                  </Typography>
                </div>
              </div>

              {/* 🚀 Descrição com contador */}
              <div>
                <Typography variant="small" as="label" className="mb-2 font-medium text-[#e6edf3]">
                  Descrição
                </Typography>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Descreva o objetivo e escopo do projeto..."
                  rows={4}
                  disabled={isSubmitting}
                  maxLength={500}
                  className={`w-full px-3 py-2 bg-[#0d1117] border rounded-md
                  text-sm text-[#e6edf3] placeholder:text-[#8b949e] 
                  focus:outline-none focus:ring-1 focus:ring-[#1f6feb] focus:border-[#1f6feb]
                  disabled:opacity-50 disabled:cursor-not-allowed resize-none
                  ${errors.description 
                    ? 'border-[#f85149]' 
                    : characterCounts.isDescriptionValid 
                      ? 'border-[#30363d]' 
                      : 'border-[#f85149]'
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  <Typography variant="muted" className={`text-xs ${errors.description ? 'text-[#f85149]' : ''}`}>
                    {errors.description || "Máximo 500 caracteres (opcional)"}
                  </Typography>
                  <Typography 
                    variant="muted" 
                    className={`text-xs ${
                      characterCounts.isDescriptionValid 
                        ? characterCounts.description === 0 
                          ? 'text-[#8b949e]'
                          : 'text-[#3fb950]' 
                        : 'text-[#f85149]'
                    }`}
                  >
                    {characterCounts.description}/500
                  </Typography>
                </div>
              </div>

              {/* Datas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" as="label" className="mb-2 font-medium text-[#e6edf3]">
                    Data de Início
                  </Typography>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange("start_date", e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Typography variant="small" as="label" className="mb-2 font-medium text-[#e6edf3]">
                    Data de Fim
                  </Typography>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange("end_date", e.target.value)}
                    min={formData.start_date}
                    disabled={isSubmitting}
                    error={errors.end_date}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !canSubmit}
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {isEditMode ? "Salvando..." : "Criando..."}
                    </>
                  ) : (
                    <>
                      <ModalIcon className="w-4 h-4" />
                      {submitText}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <ProjectFormSidebar mode={mode} />
        </div>
      </div>
    </Modal>
  )
}

const ProjectFormSidebar: React.FC<{ mode: "create" | "edit" }> = ({ mode }) => {
  const isEditMode = mode === "edit"

  return (
    <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-[#30363d] p-6 bg-[#161b22] overflow-y-auto">
      <div className="space-y-6 text-sm">
        <div>
          <Typography variant="small" className="font-medium text-[#e6edf3] mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" />
            {isEditMode ? "Atualização" : "Configuração Inicial"}
          </Typography>
          <Typography variant="small" className="text-[#8b949e] leading-relaxed">
            {isEditMode 
              ? "Atualize as informações do projeto conforme necessário. As alterações serão salvas imediatamente."
              : "Defina as informações básicas do seu projeto. Você poderá editar todos os campos posteriormente."
            }
          </Typography>
        </div>

        <div>
          <Typography variant="small" className="font-medium text-[#e6edf3] mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" /> Equipe
          </Typography>
          <Typography variant="small" className="text-[#8b949e] leading-relaxed">
            {isEditMode
              ? "Gerencie colaboradores na página do projeto após salvar as alterações."
              : "Você será automaticamente adicionado como administrador. Adicione colaboradores após a criação."
            }
          </Typography>
        </div>

        <div>
          <Typography variant="small" className="font-medium text-[#e6edf3] mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" /> Dicas
          </Typography>
          <ul className="text-[#8b949e] list-disc pl-5 space-y-1 text-xs">
            <li><strong>Títulos:</strong> 3-70 caracteres, descritivos</li>
            <li><strong>Descrição:</strong> Até 500 chars, opcional</li>
            <li><strong>Datas:</strong> Defina prazos realistas</li>
            <li><strong>Organização:</strong> Use o quadro Kanban</li>
          </ul>
        </div>

        {!isEditMode && (
          <div>
            <Typography variant="small" className="font-medium text-[#e6edf3] mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Próximos Passos
            </Typography>
            <ul className="text-[#8b949e] space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></span>
                Adicionar colaboradores
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></span>
                Criar suas primeiras tarefas
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></span>
                Configurar o quadro Kanban
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></span>
                Definir prioridades
              </li>
            </ul>
          </div>
        )}
      </div>
    </aside>
  )
}

export default ProjectFormModal