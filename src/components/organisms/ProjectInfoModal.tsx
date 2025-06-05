import type React from "react"
import { Calendar, Clock, Users, Pencil, Trash2, Info, GitBranch } from "lucide-react"
import { useModal } from "../../contexts/ModalContext"
import Modal from "../atoms/Modal"
import Button from "../atoms/Button"
import Typography from "../atoms/Typography"
import type { Project } from "../../types"

interface ProjectInfoModalProps {
  project: Project
  isOwner: boolean
  isOpen: boolean
  onClose: () => void
  onManageCollaborators: () => void
  onDelete?: () => void
}

const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({
  project,
  isOwner,
  isOpen,
  onClose,
  onManageCollaborators,
  onDelete,
}) => {
  const { openEditProjectModal } = useModal()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric"
    })
  }

  const getProjectStatus = () => {
    const now = new Date()
    const startDate = project.start_date ? new Date(project.start_date) : null
    const endDate = project.end_date ? new Date(project.end_date) : null

    if (endDate && now > endDate) {
      return { text: "Finalizado", color: "text-[#8b949e]" }
    }
    if (startDate && now < startDate) {
      return { text: "Agendado", color: "text-[#58a6ff]" }
    }
    return { text: "Em andamento", color: "text-[#3fb950]" }
  }

  const status = getProjectStatus()

  const handleEditProject = () => {
    openEditProjectModal(project)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg max-w-2xl w-full mx-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#30363d]">
          <div className="p-2 bg-[#238636] rounded-lg">
            <Info className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <Typography variant="h4" className="text-[#f0f6fc]">
              {project.name}
            </Typography>
            <Typography variant="small" className="text-[#8b949e]">
              Detalhes do projeto
            </Typography>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            status.color === "text-[#3fb950]" ? "bg-[#238636]/20 text-[#3fb950]" :
            status.color === "text-[#58a6ff]" ? "bg-[#1f6feb]/20 text-[#58a6ff]" :
            "bg-[#8b949e]/20 text-[#8b949e]"
          }`}>
            {status.text}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Descrição */}
          <section>
            <Typography variant="h5" className="text-[#f0f6fc] mb-3 flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Descrição
            </Typography>
            
            {/* 🚀 Box com scroll vertical corrigido */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 max-h-32 overflow-y-auto overflow-x-hidden">
              <Typography variant="body" className="text-[#c9d1d9] leading-relaxed break-words whitespace-pre-wrap">
                {project.description || (
                  <span className="text-[#8b949e] italic">
                    Nenhuma descrição foi fornecida para este projeto.
                  </span>
                )}
              </Typography>
            </div>
          </section>

          {/* Cronograma */}
          <section>
            <Typography variant="h5" className="text-[#f0f6fc] mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Cronograma
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-[#161b22] border border-[#30363d] rounded-lg">
                <Calendar className="w-5 h-5 text-[#58a6ff]" />
                <div>
                  <Typography variant="small" className="text-[#8b949e] font-medium">
                    Data de Início
                  </Typography>
                  <Typography variant="body" className="text-[#f0f6fc]">
                    {project.start_date ? formatDate(project.start_date) : "Não definida"}
                  </Typography>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-[#161b22] border border-[#30363d] rounded-lg">
                <Clock className="w-5 h-5 text-[#d29922]" />
                <div>
                  <Typography variant="small" className="text-[#8b949e] font-medium">
                    Data de Fim
                  </Typography>
                  <Typography variant="body" className="text-[#f0f6fc]">
                    {project.end_date ? formatDate(project.end_date) : "Não definida"}
                  </Typography>
                </div>
              </div>
            </div>
          </section>

          {/* Informações Técnicas */}
          <section>
            <Typography variant="h5" className="text-[#f0f6fc] mb-3">
              Informações do Sistema
            </Typography>
            <div className="space-y-3">
              <InfoRow 
                label="Status do Projeto" 
                value={status.text}
                className={status.color}
              />
              <InfoRow 
                label="Proprietário" 
                value={isOwner ? "Você" : "Outro usuário"}
              />
              <InfoRow 
                label="Identificador" 
                value={project.id}
                mono
              />
              <InfoRow 
                label="Criado em" 
                value={formatDate(project.created_at)}
              />
              <InfoRow 
                label="Última atualização" 
                value={formatDate(project.updated_at)}
              />
              <InfoRow 
                label="Colaboradores" 
                value={`${(project.collaborators?.length || 0) + 1} membros`}
              />
            </div>
          </section>

          {/* Ações do Owner */}
          {isOwner && (
            <section className="pt-4 border-t border-[#30363d]">
              <Typography variant="h5" className="text-[#f0f6fc] mb-3">
                Ações de Gerenciamento
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  onClick={handleEditProject}
                  variant="outline"
                  className="flex items-center gap-2 text-[#3fb950] border-[#238636] hover:bg-[#238636]/10"
                >
                  <Pencil className="w-4 h-4" />
                  Editar Projeto
                </Button>
                
                <Button
                  onClick={onManageCollaborators}
                  variant="outline" 
                  className="flex items-center gap-2 text-[#58a6ff] border-[#1f6feb] hover:bg-[#1f6feb]/10"
                >
                  <Users className="w-4 h-4" />
                  Gerenciar Equipe
                </Button>
              </div>

              {onDelete && (
                <div className="mt-4 pt-4 border-t border-[#30363d]">
                  <Button
                    onClick={onDelete}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 text-[#f85149] border-[#da3633] hover:bg-[#da3633]/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir Projeto
                  </Button>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </Modal>
  )
}

const InfoRow: React.FC<{
  label: string
  value: string
  className?: string
  mono?: boolean
}> = ({ label, value, className, mono }) => (
  <div className="flex justify-between items-center py-2">
    <Typography variant="small" className="text-[#8b949e] font-medium">
      {label}:
    </Typography>
    <Typography 
      variant="small" 
      className={`${className || "text-[#f0f6fc]"} ${mono ? "font-mono text-xs" : ""} text-right`}
    >
      {value}
    </Typography>
  </div>
)

export default ProjectInfoModal