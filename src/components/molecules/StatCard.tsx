import type React from "react"
import type { LucideIcon } from "lucide-react"
import Card, { CardHeader, CardContent } from "../atoms/Card"
import Typography from "../atoms/Typography"
import { cn } from "../../lib/utils"

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  variant?: "default" | "success" | "warning" | "danger" | "info"
  className?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  variant = "default",
  className,
  trend
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return {
          bg: "border-[#238636]/20 bg-[#238636]/5",
          icon: "text-[#3fb950]",
          value: "text-[#3fb950]"
        }
      case "warning":
        return {
          bg: "border-[#d29922]/20 bg-[#d29922]/5",
          icon: "text-[#d29922]",
          value: "text-[#d29922]"
        }
      case "danger":
        return {
          bg: "border-[#da3633]/20 bg-[#da3633]/5",
          icon: "text-[#f85149]",
          value: "text-[#f85149]"
        }
      case "info":
        return {
          bg: "border-[#1f6feb]/20 bg-[#1f6feb]/5",
          icon: "text-[#58a6ff]",
          value: "text-[#58a6ff]"
        }
      default:
        return {
          bg: "border-[#30363d] bg-[#0d1117]",
          icon: "text-[#8b949e]",
          value: "text-[#f0f6fc]"
        }
    }
  }

  const variantClasses = getVariantClasses()

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-lg",
        variantClasses.bg,
        className
      )} 
      hover
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Typography variant="small" className="font-medium text-[#8b949e]">
          {title}
        </Typography>
        <Icon className={cn("h-4 w-4", variantClasses.icon)} />
      </CardHeader>
      
      <CardContent className="space-y-2">
        <div className="flex items-baseline gap-2">
          <Typography 
            variant="large" 
            className={cn("font-bold", variantClasses.value)}
          >
            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
          </Typography>
          
          {trend && (
            <span className={cn(
              "text-xs font-medium flex items-center gap-1",
              trend.isPositive ? "text-[#3fb950]" : "text-[#f85149]"
            )}>
              {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default StatCard