import type React from "react"
import { Search } from "lucide-react"
import { cn } from "../../lib/utils"
import Input from "../atoms/Input"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onSubmit?: () => void
  disabled?: boolean
  autoFocus?: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Pesquisar...",
  className = "",
  onSubmit,
  disabled = false,
  autoFocus = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className={cn("relative", className)}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        autoFocus={autoFocus}
        leftIcon={<Search className="w-4 h-4" />}
      />
    </div>
  )
}

export default SearchBar