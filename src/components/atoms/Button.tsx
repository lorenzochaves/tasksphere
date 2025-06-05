import React from "react"
import { cn } from "../../lib/utils"

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive"
type ButtonSize = "sm" | "md" | "lg" | "icon"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
  children: React.ReactNode
}

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-[#238636] text-white hover:bg-[#2ea043] focus:ring-[#238636]",
  secondary: "bg-[#21262d] text-[#c9d1d9] border border-[#30363d] hover:bg-[#30363d] focus:ring-[#30363d]",
  outline: "bg-transparent border border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] focus:ring-[#30363d]",
  ghost: "bg-transparent text-[#c9d1d9] hover:bg-[#21262d] focus:ring-[#30363d]",
  destructive: "bg-[#da3633] text-white hover:bg-[#e5534b] focus:ring-[#da3633]",
} as const

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
  icon: "p-2",
} as const

const BASE_STYLES = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0d1117] disabled:opacity-50 disabled:cursor-not-allowed"

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  className = "",
  type = "button",
  asChild = false,
  ...props
}) => {
  const buttonClasses = cn(
    BASE_STYLES,
    BUTTON_VARIANTS[variant],
    BUTTON_SIZES[size],
    className
  )

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      className: buttonClasses,
      disabled,
      onClick,
      ...props,
    })
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button