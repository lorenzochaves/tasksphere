import type React from "react"
import { format } from "date-fns"
import { Calendar, Eye, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "../../lib/utils"
import CompactCollaborators from "./CompactCollaborators"
import Progress from "../atoms/Progress"
import Button from "../atoms/Button"
import Typography from "../atoms/Typography"
import type { Project } from "../../types"

interface ProjectCardProps {
  project: Project
  progress?: number
  isOwner?: boolean
  onClick?: () => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  progress = 0,
  isOwner = false,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) onClick()
  }

  const getProgressColor = () => {
    if (progress >= 100) return "text-[#3fb950]"
    if (progress >= 70) return "text-[#58a6ff]"
    if (progress >= 40) return "text-[#d29922]"
    return "text-[#f85149]"
  }

  return (
    <div
      className="group bg-[#0d1117] border border-[#30363d] hover:border-[#484f58] rounded-lg shadow-sm transition-all duration-200 cursor-pointer overflow-hidden flex flex-col hover:shadow-md"
      onClick={handleClick}
    >
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div title={project.name}>
            <Typography 
              variant="h4" 
              className="line-clamp-1 group-hover:text-white transition-colors"
            >
              {project.name}
            </Typography>
          </div>

          {isOwner && (
            <Typography 
              variant="small"
              className="ml-2 px-2 py-0.5 font-semibold bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 rounded-full"
            >
              Criador
            </Typography>
          )}
        </div>
      </div>

      <div className="px-4 pt-3 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <Typography variant="muted">Progresso</Typography>
            <Typography 
              variant="small"
              className={cn("font-semibold", getProgressColor())}
            >
              {progress}%
            </Typography>
          </div>
          <div className="relative">
            <Progress 
              value={progress} 
              variant={progress >= 100 ? "success" : progress < 30 ? "danger" : "default"} 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#8b949e] mt-2">
          <CompactCollaborators 
            collaborators={project.collaborators || []} 
            maxVisible={3} 
            size="sm" 
          />
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <Typography variant="small" className="text-[#8b949e]">
              {project.end_date ? format(new Date(project.end_date), "dd/MM/yyyy") : "Sem prazo"}
            </Typography>
          </div>
        </div>

        <Button
          asChild
          variant="primary"
          className="mt-4 w-full group/button"
        >
          <Link
            to={`/projects/${project.id}`}
            className="flex items-center justify-center gap-2"
          >
            <Eye className="h-4 w-4 group-hover/button:scale-110 transition-transform duration-200" />
            <span>Ver Projeto</span>
            <ArrowRight className="h-4 w-4 transform translate-x-0 group-hover/button:translate-x-1 opacity-0 group-hover/button:opacity-100 transition-all duration-200" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default ProjectCard