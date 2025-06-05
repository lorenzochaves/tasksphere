import type React from "react"
import { cn } from "../../lib/utils"

type ProgressSize = "sm" | "md" | "lg"
type ProgressVariant = "default" | "success" | "warning" | "danger"

interface ProgressProps {
  value: number
  className?: string
  size?: ProgressSize
  variant?: ProgressVariant
}

const PROGRESS_SIZES: Record<ProgressSize, string> = {
  sm: "h-1",
  md: "h-2", 
  lg: "h-3",
} as const

const PROGRESS_VARIANTS: Record<ProgressVariant, string> = {
  default: "bg-[#1f6feb]",
  success: "bg-[#238636]",
  warning: "bg-[#d29922]",
  danger: "bg-[#da3633]",
} as const

const Progress: React.FC<ProgressProps> = ({ 
  value = 0, 
  className = "", 
  size = "md", 
  variant = "default" 
}) => {
  const clampedValue = Math.min(100, Math.max(0, value))

  // Dynamic color based on progress value (only for default variant)
  const getBarColor = (): string => {
    if (variant !== "default") return PROGRESS_VARIANTS[variant]
    
    if (clampedValue >= 100) return PROGRESS_VARIANTS.success
    if (clampedValue >= 70) return PROGRESS_VARIANTS.default
    if (clampedValue >= 30) return PROGRESS_VARIANTS.warning
    return PROGRESS_VARIANTS.danger
  }

  return (
    <div 
      className={cn(
        "w-full bg-[#30363d] rounded-full overflow-hidden",
        PROGRESS_SIZES[size],
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-out",
          getBarColor()
        )}
        style={{ width: `${clampedValue}%` }}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}

export default Progress