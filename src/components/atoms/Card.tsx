import type React from "react"
import { forwardRef } from "react"
import { cn } from "../../lib/utils"
import Typography from "./Typography"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = "", onClick, hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-[#0d1117] border border-[#30363d] rounded-lg shadow-sm overflow-hidden",
          hover && "hover:border-[#484f58] transition-all duration-200 hover:shadow-md",
          onClick && "cursor-pointer",
          className,
        )}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    )
  },
)

Card.displayName = "Card"

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = "" }) => (
  <div className={cn("p-6 border-b border-[#30363d]", className)}>
    {children}
  </div>
)

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = "" }) => (
  <div className={cn("p-6", className)}>
    {children}
  </div>
)

interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = "" }) => (
  <Typography variant="h5" className={className}>
    {children}
  </Typography>
)

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = "" }) => (
  <div className={cn("p-6 border-t border-[#30363d] bg-[#21262d]", className)}>
    {children}
  </div>
)

export default Card