import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { fetchProject } from "../../services/api"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireOwnership?: boolean
  projectId?: string
  fallbackPath?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireOwnership = false, 
  projectId,
  fallbackPath = "/access-denied"
}) => {
  const { user, isLoading } = useAuth()
  const [ownershipLoading, setOwnershipLoading] = useState(false)
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)

  // Memoizar para evitar re-renders desnecessários
  const shouldCheckOwnership = useMemo(() => 
    requireOwnership && projectId && user,
    [requireOwnership, projectId, user]
  )

  useEffect(() => {
    const checkOwnership = async () => {
      if (!shouldCheckOwnership) {
        setHasAccess(true)
        return
      }

      setOwnershipLoading(true)
      try {
        const project = await fetchProject(projectId!)
        
        const isOwner = project.creator_id === user!.id
        const isCollaborator = project.collaborators?.some(c => c.id === user!.id) ?? false
        const isMember = project.members?.some(m => m.id === user!.id) ?? false
        
        setHasAccess(isOwner || isCollaborator || isMember)
      } catch (error) {
        console.error("Error checking project access:", error)
        setHasAccess(false)
      } finally {
        setOwnershipLoading(false)
      }
    }

    checkOwnership()
  }, [shouldCheckOwnership, projectId, user])

  // Early returns para melhor performance
  if (isLoading || ownershipLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0d1117]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#30363d] border-t-[#1f6feb]" />
          <span className="text-sm text-[#8b949e]">Verificando permissões...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireOwnership && !projectId) {
    return <Navigate to={fallbackPath} replace />
  }

  if (requireOwnership && hasAccess === false) {
    return <Navigate to={fallbackPath} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute