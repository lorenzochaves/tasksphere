import type React from "react"
import { cn } from "../../lib/utils"

type TypographyVariant = 
  | "h1" 
  | "h2" 
  | "h3" 
  | "h4" 
  | "h5" 
  | "h6" 
  | "p" 
  | "body"  
  | "small" 
  | "muted" 
  | "lead" 
  | "large"

type TypographyElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | "label"

interface TypographyProps {
  variant?: TypographyVariant
  as?: TypographyElement
  children: React.ReactNode
  className?: string
}

const TYPOGRAPHY_VARIANTS: Record<TypographyVariant, string> = {
  h1: "text-3xl md:text-4xl font-bold text-[#f0f6fc] leading-tight",
  h2: "text-2xl md:text-3xl font-semibold text-[#f0f6fc] leading-tight",
  h3: "text-xl md:text-2xl font-semibold text-[#f0f6fc] leading-snug",
  h4: "text-lg md:text-xl font-semibold text-[#f0f6fc] leading-snug", 
  h5: "text-base md:text-lg font-medium text-[#f0f6fc] leading-normal",
  h6: "text-sm md:text-base font-medium text-[#f0f6fc] leading-normal",
  p: "text-sm md:text-base text-[#c9d1d9] leading-relaxed",
  body: "text-sm md:text-base text-[#c9d1d9] leading-relaxed", 
  small: "text-xs md:text-sm text-[#8b949e] leading-normal",
  muted: "text-xs text-[#8b949e] leading-normal",
  lead: "text-base md:text-lg text-[#c9d1d9] leading-relaxed font-medium",
  large: "text-lg md:text-xl text-[#f0f6fc] leading-relaxed",
} as const

const Typography: React.FC<TypographyProps> = ({ 
  variant = "p", 
  as, 
  children, 
  className 
}) => {

  const getDefaultElement = (): TypographyElement => {
    if (as) return as
    
    switch (variant) {
      case "h1": return "h1"
      case "h2": return "h2" 
      case "h3": return "h3"
      case "h4": return "h4"
      case "h5": return "h5"
      case "h6": return "h6"
      case "p":
      case "body": return "p"  
      case "small":
      case "muted": return "span"
      default: return "p"
    }
  }

  const Element = getDefaultElement()

  return (
    <Element className={cn(TYPOGRAPHY_VARIANTS[variant], className)}>
      {children}
    </Element>
  )
}

export default Typography