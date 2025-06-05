import type React from "react"
import { Users, Crown, Mail } from "lucide-react"
import type { User } from "../../types"
import Modal from "../atoms/Modal"
import Typography from "../atoms/Typography"
import { getInitials } from "../../lib/utils"

interface CollaboratorListModalProps {
  isOpen: boolean
  onClose: () => void
  collaborators: User[]
  currentUserId: string | null
  projectOwnerId?: string 
}

const CollaboratorListModal: React.FC<CollaboratorListModalProps> = ({
  isOpen,
  onClose,
  collaborators,
  currentUserId,
  projectOwnerId
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Colaboradores do Projeto" size="md">
      <div className="p-6">
        {collaborators.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-[#8b949e] mx-auto mb-3" />
            <Typography variant="body" className="text-[#8b949e]">
              Nenhum colaborador adicionado
            </Typography>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            <Typography variant="small" className="text-[#8b949e] mb-4">
              {collaborators.length} colaborador{collaborators.length !== 1 ? 'es' : ''}
            </Typography>
            
            {collaborators.map((person) => (
              <div
                key={person.id}
                className="flex items-center gap-3 p-3 bg-[#0d1117] border border-[#30363d] rounded-lg hover:bg-[#161b22] transition-colors"
              >
                {/* Avatar */}
                <div className="relative">
                  {person.avatar ? (
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#3fb950] flex items-center justify-center text-white font-medium text-sm">
                      {getInitials(person.name)}
                    </div>
                  )}
                  
                  {/* Owner badge */}
                  {person.id === projectOwnerId && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#d29922] rounded-full flex items-center justify-center">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Typography variant="small" className="font-medium text-[#f0f6fc] truncate">
                      {person.name}
                    </Typography>
                    {person.id === currentUserId && (
                      <span className="text-xs bg-[#3fb950] text-white px-2 py-0.5 rounded-full">
                        Você
                      </span>
                    )}
                    {person.id === projectOwnerId && (
                      <span className="text-xs bg-[#d29922] text-white px-2 py-0.5 rounded-full">
                        Dono
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3 text-[#8b949e]" />
                    <Typography variant="muted" className="text-[#8b949e] text-xs truncate">
                      {person.email}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default CollaboratorListModal