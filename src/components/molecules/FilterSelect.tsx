import type React from "react"
import Select from "../atoms/Select"
import Typography from "../atoms/Typography"

interface FilterOption {
  value: string
  label: string
}

interface FilterSelectProps {
  value: string
  onChange: (value: string) => void
  options: FilterOption[]
  placeholder?: string
  className?: string
  label?: string
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Filtrar...",
  className = "",
  label,
}) => {
  return (
    <div className="flex flex-col">
      {label && (
        <Typography variant="small" as="label" className="mb-1 font-medium text-[#8b949e]">
          {label}
        </Typography>
      )}
      <Select
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        className={className}
      />
    </div>
  )
}

export default FilterSelect