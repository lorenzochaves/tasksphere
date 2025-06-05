import type React from "react"
import { createContext, useContext, useState, useCallback, useMemo } from "react"
import Toast from "../components/atoms/Toast"
import type { ToastProps } from "../types"

interface ToastContextType {
  toast: (toast: ToastProps) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
}

interface ToastWithId extends ToastProps {
  id: number
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastWithId[]>([])

  const addToast = useCallback((toast: ToastProps) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, toast.duration || 3000)
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const contextValue = useMemo(() => ({ toast: addToast }), [addToast])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
