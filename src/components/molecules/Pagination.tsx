import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utils"
import Button from "../atoms/Button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage: number
  totalItems: number
  showInfo?: boolean
  className?: string
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  showInfo = true,
  className = "",
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePageClick = (page: number) => {
    onPageChange(page)
  }

  const getVisiblePages = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
      const end = Math.min(totalPages, start + maxVisible - 1)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {showInfo && (
        <div className="text-sm text-[#8b949e]">
          Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} a{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} itens
        </div>
      )}
      
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {getVisiblePages().map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "primary" : "outline"}
            size="sm"
            onClick={() => handlePageClick(page)}
            className="px-3"
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default Pagination