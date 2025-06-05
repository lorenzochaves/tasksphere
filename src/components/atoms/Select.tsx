import type React from "react"
import { cn } from "../../lib/utils"
import Typography from "./Typography"

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[]
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
  error?: string
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Selecione...",
  value,
  onChange,
  className = "",
  error,
  disabled = false,
  ...props
}) => {
  return (
    <div className="w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md",
          "text-sm text-[#c9d1d9] placeholder:text-[#8b949e]",
          "focus:outline-none focus:border-[#1f6feb] focus:ring-1 focus:ring-[#1f6feb]",
          "disabled:bg-[#21262d] disabled:text-[#8b949e] disabled:cursor-not-allowed",
          "transition-colors duration-200",
          "appearance-none bg-no-repeat",
          // Custom dropdown arrow usando SVG inline
          "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%20fill%3D%22none%22%20stroke%3D%22%238b949e%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M2%205l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.75rem_center] pr-8",
          error && "border-[#da3633] focus:border-[#da3633] focus:ring-[#da3633]",
          className,
        )}
        disabled={disabled}
        {...props}
      >
        <option value="" disabled={!value}>
          {placeholder}
        </option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            className="bg-[#21262d] text-[#c9d1d9]"
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <Typography variant="small" className="mt-1 text-[#da3633]">
          {error}
        </Typography>
      )}
    </div>
  )
}

export default Select
