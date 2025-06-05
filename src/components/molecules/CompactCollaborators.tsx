import type React from "react"
import { cn } from "../../lib/utils"
import { getInitials } from "../../lib/utils"
import Typography from "../atoms/Typography"
import type { User } from "../../types"

type CollaboratorSize = "sm" | "md" | "lg"

interface CompactCollaboratorsProps {
  collaborators: User[]
  maxVisible?: number
  size?: CollaboratorSize
  className?: string
}

const SIZE_CLASSES: Record<CollaboratorSize, string> = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-sm", 
  lg: "w-10 h-10 text-base"
} as const

const CompactCollaborators: React.FC<CompactCollaboratorsProps> = ({ 
  collaborators, 
  maxVisible = 3, 
  size = "md",
  className = ""
}) => {
  const visibleCollaborators = collaborators.slice(0, maxVisible)
  const remainingCount = Math.max(0, collaborators.length - maxVisible)

  if (collaborators.length === 0) {
    return (
      <div className={cn("flex items-center", className)}>
        <Typography variant="muted" className="text-sm">
          Nenhum colaborador
        </Typography>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center", className)}>
      {/* Avatares visíveis */}
      <div className="flex -space-x-2">
        {visibleCollaborators.map((collaborator, index) => (
          <div
            key={collaborator.id}
            className={cn(
              "rounded-full border-2 border-[#161b22] flex items-center justify-center overflow-hidden relative",
              SIZE_CLASSES[size]
            )}
            style={{ zIndex: 10 - index }}
            title={collaborator.name}
          >
            {collaborator.avatar ? (
              <img
                src={collaborator.avatar}
                alt={collaborator.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            ) : (
              <div className="w-full h-full bg-[#30363d] flex items-center justify-center text-[#c9d1d9] font-medium">
                {getInitials(collaborator.name)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Indicador de colaboradores restantes */}
      {remainingCount > 0 && (
        <div
          className={cn(
            "rounded-full bg-[#30363d] border-2 border-[#161b22] flex items-center justify-center text-[#8b949e] font-medium ml-1",
            SIZE_CLASSES[size]
          )}
          title={`+${remainingCount} colaboradores`}
        >
          +{remainingCount}
        </div>
      )}

      {/* Texto com total */}
      <Typography variant="small" className="ml-3 text-[#8b949e]">
        {collaborators.length} {collaborators.length === 1 ? 'colaborador' : 'colaboradores'}
      </Typography>
    </div>
  )
}

export default CompactCollaborators