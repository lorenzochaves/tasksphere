import type React from "react"
import { useState, useEffect } from "react"
import { Search, Plus, X, Users, UserPlus, Mail } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { useToast } from "../../contexts/ToastContext"
import { fetchCollaboratorSuggestions, searchCollaborators } from "../../services/externalApi"
import { updateProjectCollaborators } from "../../services/api"
import Button from "../atoms/Button"
import Input from "../atoms/Input"
import Typography from "../atoms/Typography"
import type { User, Project } from "../../types"

interface CollaboratorManagerProps {
  project: Project
  onCollaboratorsUpdate: (collaborators: User[]) => void
  isOpen: boolean
  onClose: () => void
}

const CollaboratorManager: React.FC<CollaboratorManagerProps> = ({
  project,
  onCollaboratorsUpdate,
  isOpen,
  onClose
}) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<User[]>([])
  const [selectedCollaborators, setSelectedCollaborators] = useState<User[]>(
    project.collaborators || []
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadInitialSuggestions()
    }
  }, [isOpen])

  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch()
    } else {
      loadInitialSuggestions()
    }
  }, [searchTerm])

  const loadInitialSuggestions = async () => {
    setIsLoading(true)
    try {
      const collaborators = await fetchCollaboratorSuggestions(1000)
      const filtered = collaborators.filter(
        c => c.id !== user?.id && !selectedCollaborators.some(sc => sc.id === c.id)
      )
      setSuggestions(filtered)
    } catch {
      toast({ variant: "error", title: "Erro", description: "Falha ao carregar sugestões" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    setIsSearching(true)
    try {
      const results = await searchCollaborators(searchTerm, 10)
      const filtered = results.filter(
        c => c.id !== user?.id && !selectedCollaborators.some(sc => sc.id === c.id)
      )
      setSuggestions(filtered)
    } catch {
      toast({ variant: "error", title: "Erro", description: "Falha na busca" })
    } finally {
      setIsSearching(false)
    }
  }

  const addCollaborator = (collab: User) => {
    setSelectedCollaborators(prev => [...prev, collab])
    setSuggestions(prev => prev.filter(s => s.id !== collab.id))
    toast({ title: "Adicionado", description: `${collab.name} foi adicionado` })
  }

  const removeCollaborator = (id: string) => {
    if (id === user?.id) {
      toast({ 
        variant: "error", 
        title: "Erro", 
        description: "O proprietário do projeto não pode ser removido" 
      })
      return
    }
    
    const collab = selectedCollaborators.find(c => c.id === id)
    setSelectedCollaborators(prev => prev.filter(c => c.id !== id))
    if (collab) setSuggestions(prev => [collab, ...prev])
    toast({ title: "Removido", description: `${collab?.name} foi removido` })
  }

  const handleSave = async () => {
    try {
      await updateProjectCollaborators(project.id, selectedCollaborators)
      onCollaboratorsUpdate(selectedCollaborators)
      onClose()
      toast({ title: "Equipe atualizada com sucesso" })
    } catch {
      toast({ variant: "error", title: "Erro", description: "Falha ao salvar alterações" })
    }
  }

  const handleCancel = () => {
    setSelectedCollaborators(project.collaborators || [])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d]">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#58a6ff]" />
            <Typography variant="h4" className="text-white">
              Gerenciar Equipe
            </Typography>
          </div>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Equipe Atual */}
          <section>
            <Typography variant="h5" className="mb-3 flex items-center gap-2 text-[#f0f6fc]">
              <Users className="h-4 w-4" />
              Equipe Atual ({selectedCollaborators.filter(c => c.id !== user?.id).length + 1})
            </Typography>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {/* Owner */}
              <div className="flex items-center gap-3 p-3 bg-[#161b22] border border-[#30363d] rounded-lg">
                <img
                  src={user?.avatar || `https://i.pravatar.cc/40?u=${user?.id}`}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <Typography variant="small" className="font-medium text-[#f0f6fc] truncate">
                    {user?.name}
                  </Typography>
                  <Typography variant="muted" className="truncate">
                    {user?.email}
                  </Typography>
                </div>
                <span className="text-xs bg-[#238636]/20 text-[#3fb950] px-2 py-1 rounded-full font-medium">
                  Owner
                </span>
              </div>

              {/* Colaboradores */}
              {selectedCollaborators
                .filter(collaborator => collaborator.id !== user?.id)
                .map(collaborator => (
                <div
                  key={collaborator.id}
                  className="flex items-center gap-3 p-3 bg-[#161b22] border border-[#30363d] rounded-lg hover:bg-[#21262d] transition-colors"
                >
                  <img
                    src={collaborator.avatar || `https://i.pravatar.cc/40?u=${collaborator.id}`}
                    alt={collaborator.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <Typography variant="small" className="font-medium text-[#f0f6fc] truncate">
                      {collaborator.name}
                    </Typography>
                    <Typography variant="muted" className="truncate">
                      {collaborator.email}
                    </Typography>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCollaborator(collaborator.id)}
                    className="text-[#f85149] border-transparent hover:border-[#da3633] hover:bg-[#da3633]/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {selectedCollaborators.filter(c => c.id !== user?.id).length === 0 && (
                <Typography variant="small" className="text-[#8b949e] italic text-center py-4">
                  Nenhum colaborador adicionado além do proprietário
                </Typography>
              )}
            </div>
          </section>

          {/* Busca */}
          <section>
            <Typography variant="h5" className="mb-3 flex items-center gap-2 text-[#f0f6fc]">
              <UserPlus className="w-4 h-4" />
              Adicionar Colaboradores
            </Typography>

            <div className="relative mb-4">
              <Input
                placeholder="Buscar por nome ou email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#1f6feb] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {isLoading ? (
                <Typography variant="small" className="text-center text-[#8b949e]">
                  Carregando sugestões...
                </Typography>
              ) : suggestions.length > 0 ? (
                suggestions.map(s => (
                  <CollaboratorItem key={s.id} user={s} onAdd={() => addCollaborator(s)} />
                ))
              ) : (
                <Typography variant="small" className="text-center italic text-[#8b949e] py-4">
                  {searchTerm ? "Nenhum colaborador encontrado" : "Nenhuma sugestão disponível"}
                </Typography>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-[#30363d] bg-[#161b22]">
          <Button variant="primary" onClick={handleSave}>
            Salvar Alterações
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}

const CollaboratorItem: React.FC<{
  user: User
  onAdd?: () => void
}> = ({ user, onAdd }) => {
  return (
    <div className="flex items-center gap-3 bg-[#161b22] border border-[#30363d] p-3 rounded-lg hover:bg-[#21262d] transition-colors">
      <img
        src={user.avatar || `https://i.pravatar.cc/40?u=${user.id}`}
        alt={user.name}
        className="w-8 h-8 rounded-full"
      />
      <div className="flex-1 min-w-0">
        <Typography variant="small" className="font-medium text-[#f0f6fc] truncate">
          {user.name}
        </Typography>
        <Typography variant="muted" className="truncate flex items-center gap-1">
          <Mail className="h-3 w-3" /> {user.email}
        </Typography>
      </div>
      {onAdd && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAdd} 
          className="text-[#3fb950] hover:bg-[#238636]/10 border-transparent hover:border-[#238636]"
        >
          <Plus className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}

export default CollaboratorManager