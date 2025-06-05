import type React from "react"
import { useRef, useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: ModalSize
  className?: string
  showCloseButton?: boolean
}

const MODAL_SIZES: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  full: "max-w-6xl",
} as const

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className = "",
  showCloseButton = true
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={cn(
          "bg-[#0d1117] border border-[#30363d] rounded-lg w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-in",
          MODAL_SIZES[size],
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-[#30363d] px-5 py-4 bg-[#21262d]">
            <h2 className="text-base font-semibold text-[#f0f6fc]">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-[#8b949e] hover:text-[#c9d1d9] p-1 rounded-md hover:bg-[#30363d] transition-colors"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        <div className="overflow-y-auto max-h-[calc(90vh-4rem)] px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal