import type React from "react"
import { cn } from "../../lib/utils"
import { getInitials } from "../../lib/utils"

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"

interface AvatarProps {
  src?: string
  alt: string
  size?: AvatarSize
  className?: string
}

const AVATAR_SIZES: Record<AvatarSize, string> = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs", 
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
} as const

const FALLBACK_STYLES = "bg-[#30363d] flex items-center justify-center text-[#c9d1d9] font-medium"

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = "md", 
  className 
}) => {
  const baseClasses = cn(
    "rounded-full object-cover flex-shrink-0",
    AVATAR_SIZES[size],
    className
  )

  if (src) {
    return (
      <img 
        src={src} 
        alt={alt} 
        className={baseClasses}
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement
          target.style.display = 'none'
        }}
      />
    )
  }

  return (
    <div className={cn(baseClasses, FALLBACK_STYLES)}>
      {getInitials(alt)}
    </div>
  )
}

export default Avatar