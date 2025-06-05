// Utilitários de validação para formulários
import React from 'react'
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
  message?: string
}

export interface ValidationRules {
  [key: string]: ValidationRule[]
}

export interface ValidationError {
  field: string
  message: string
}

// Regras de validação para diferentes campos
export const validationRules = {
  // Validações de usuário
  email: [
    { required: true, message: "Email é obrigatório" },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Formato de email inválido"
    }
  ],
  password: [
    { required: true, message: "Senha é obrigatória" },
    { minLength: 6, message: "Senha deve ter pelo menos 6 caracteres" }
  ],
  
  // Validações de projeto
  projectName: [
    { required: true, message: "Nome do projeto é obrigatório" },
    { minLength: 3, message: "Nome do projeto deve ter pelo menos 3 caracteres" },
    { maxLength: 50, message: "Nome do projeto deve ter no máximo 50 caracteres" }
  ],
  projectDescription: [
    { maxLength: 500, message: "Descrição deve ter no máximo 500 caracteres" }
  ],
  
  // Validações de tarefa
  taskTitle: [
    { required: true, message: "Título da tarefa é obrigatório" },
    { minLength: 3, message: "Título da tarefa deve ter pelo menos 3 caracteres" },
    { maxLength: 100, message: "Título da tarefa deve ter no máximo 100 caracteres" }
  ],
  taskDescription: [
    { maxLength: 1000, message: "Descrição deve ter no máximo 1000 caracteres" }
  ],
  
  // Validações de data
  startDate: [
    { required: true, message: "Data de início é obrigatória" }
  ],
  endDate: [
    { required: true, message: "Data de término é obrigatória" }
  ],
  dueDate: [
    { required: true, message: "Data de vencimento é obrigatória" },
    {
      custom: (value: string) => {
        if (!value) return true
        const today = new Date()
        today.setHours(23, 59, 59, 999) // End of today
        const dueDate = new Date(value)
        return dueDate > today
      },
      message: "Data de vencimento deve ser uma data futura"
    }
  ],
  
  // Validações de URL
  imageUrl: [
    { required: true, message: "URL da imagem é obrigatória" },
    {
      pattern: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
      message: "URL da imagem deve ser válida e terminar com .jpg, .jpeg, .png, .gif ou .webp"
    }
  ],
  
  // Validação personalizada para datas relacionadas
  dateRange: (startDate: string, endDate: string): ValidationError[] => {
    const errors: ValidationError[] = []
    
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      if (end <= start) {
        errors.push({
          field: "endDate",
          message: "Data de término deve ser posterior à data de início"
        })
      }
    }
    
    return errors
  }
}

// Função principal de validação
export const validateField = (fieldName: string, value: any, rules: ValidationRule[]): string | null => {
  for (const rule of rules) {
    // Validação de campo obrigatório
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return rule.message || `${fieldName} é obrigatório`
    }
    
    // Se o campo está vazio e não é obrigatório, pula as outras validações
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      continue
    }
    
    // Validação de comprimento mínimo
    if (rule.minLength && value.length < rule.minLength) {
      return rule.message || `${fieldName} deve ter pelo menos ${rule.minLength} caracteres`
    }
    
    // Validação de comprimento máximo
    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.message || `${fieldName} deve ter no máximo ${rule.maxLength} caracteres`
    }
    
    // Validação de padrão (regex)
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || `Formato de ${fieldName} inválido`
    }
    
    // Validação customizada
    if (rule.custom) {
      const result = rule.custom(value)
      if (result !== true) {
        return typeof result === 'string' ? result : (rule.message || `${fieldName} inválido`)
      }
    }
  }
  
  return null
}

// Função para validar múltiplos campos
export const validateForm = (formData: Record<string, any>, rules: ValidationRules): ValidationError[] => {
  const errors: ValidationError[] = []
  
  for (const [fieldName, fieldRules] of Object.entries(rules)) {
    const value = formData[fieldName]
    const error = validateField(fieldName, value, fieldRules)
    
    if (error) {
      errors.push({ field: fieldName, message: error })
    }
  }
  
  return errors
}

// Hook personalizado para validação em tempo real
export const useFormValidation = (initialData: Record<string, any>, rules: ValidationRules) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isValid, setIsValid] = React.useState(false)
  
  const validateFormData = (data: Record<string, any>) => {
    const validationErrors = validateForm(data, rules)
    const errorMap: Record<string, string> = {}
    
    validationErrors.forEach(error => {
      errorMap[error.field] = error.message
    })
    
    setErrors(errorMap)
    setIsValid(validationErrors.length === 0)
    
    return errorMap
  }
  
  const validateSingleField = (fieldName: string, value: any) => {
    const fieldRules = rules[fieldName]
    if (!fieldRules) return null
    
    const error = validateField(fieldName, value, fieldRules)
    setErrors(prev => ({
      ...prev,
      [fieldName]: error || ''
    }))
    
    return error
  }
  
  return {
    errors,
    isValid,
    validateForm: validateFormData,
    validateField: validateSingleField,
    clearErrors: () => setErrors({})
  }
}

