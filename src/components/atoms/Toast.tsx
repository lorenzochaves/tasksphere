import type React from "react"
import { useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "../../lib/utils"

type ToastVariant = "success" | "error" | "info"

interface ToastProps {
  title: string
  description?: string
  variant?: ToastVariant
  onClose: () => void
  duration?: number
}

const TOAST_VARIANTS = {
  success: {
    bg: "bg-[#238636]/10 border-[#238636]/30",
    icon: CheckCircle,
    iconColor: "text-[#3fb950]",
    titleColor: "text-[#3fb950]",
  },
  error: {
    bg: "bg-[#da3633]/10 border-[#da3633]/30",
    icon: AlertCircle,
    iconColor: "text-[#f85149]",
    titleColor: "text-[#f85149]",
  },
  info: {
    bg: "bg-[#1f6feb]/10 border-[#1f6feb]/30",
    icon: Info,
    iconColor: "text-[#58a6ff]",
    titleColor: "text-[#58a6ff]",
  },
} as const

const Toast: React.FC<ToastProps> = ({ 
  title, 
  description, 
  variant = "success", 
  onClose, 
  duration = 5000 
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const config = TOAST_VARIANTS[variant]
  const Icon = config.icon

  return (
    <div className={cn(
      "border rounded-md p-4 shadow-lg max-w-sm w-full animate-slide-in backdrop-blur-sm",
      config.bg
    )}>
      <div className="flex items-start">
        <Icon className={cn("w-5 h-5 mt-0.5 mr-3 flex-shrink-0", config.iconColor)} />
        <div className="flex-1 min-w-0">
          <h4 className={cn("text-sm font-medium", config.titleColor)}>
            {title}
          </h4>
          {description && (
            <p className="text-sm text-[#8b949e] mt-1">
              {description}
            </p>
          )}
        </div>
        <button 
          onClick={onClose} 
          className="ml-3 text-[#8b949e] hover:text-[#c9d1d9] transition-colors p-1 rounded-md hover:bg-[#30363d]/30"
          aria-label="Fechar notificação"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default Toast