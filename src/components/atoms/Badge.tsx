import type React from "react"
import { cn } from "../../lib/utils"

type BadgeVariant = 
  | "default" 
  | "primary" 
  | "secondary" 
  | "outline" 
  | "success" 
  | "warning" 
  | "danger" 
  | "info"

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  default: "bg-[#21262d] text-[#c9d1d9] border border-[#30363d]",
  primary: "bg-[#1f6feb] text-white border border-[#1f6feb]",
  secondary: "bg-[#30363d] text-[#c9d1d9] border border-[#484f58]",
  outline: "bg-transparent border border-[#30363d] text-[#8b949e]",
  success: "bg-[#238636] text-white border border-[#238636]",
  warning: "bg-[#d29922] text-[#0d1117] border border-[#d29922]",
  danger: "bg-[#da3633] text-white border border-[#da3633]",
  info: "bg-[#1f6feb] text-white border border-[#1f6feb]",
} as const

const Badge: React.FC<BadgeProps> = ({ 
  variant = "default", 
  children, 
  className 
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        BADGE_VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

export default Badge