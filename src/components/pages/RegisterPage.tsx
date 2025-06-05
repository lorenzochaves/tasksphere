import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useToast } from "../../contexts/ToastContext"
import { validationRules, validateField } from "../../utils/validation"
import Button from "../atoms/Button"
import Input from "../atoms/Input"
import Typography from "../atoms/Typography"
import Card, { CardContent, CardHeader, CardTitle } from "../atoms/Card"
import { Sparkles, User, Mail, Lock, Eye, EyeOff } from "lucide-react"

const RegisterPage: React.FC = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const validateForm = () => {
    const nameError = validateField("name", formData.name, [
      { required: true, message: "Nome é obrigatório" },
      { minLength: 2, message: "Nome deve ter pelo menos 2 caracteres" }
    ])
    const emailError = validateField("email", formData.email, validationRules.email)
    const passwordError = validateField("password", formData.password, validationRules.password)
    
    let confirmPasswordError = ""
    if (!formData.confirmPassword) {
      confirmPasswordError = "Confirmação de senha é obrigatória"
    } else if (formData.password !== formData.confirmPassword) {
      confirmPasswordError = "Senhas não coincidem"
    }

    setErrors({ 
      name: nameError || "", 
      email: emailError || "", 
      password: passwordError || "", 
      confirmPassword: confirmPasswordError 
    })
    return !nameError && !emailError && !passwordError && !confirmPasswordError
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast({ 
        variant: "error", 
        title: "Dados inválidos", 
        description: "Por favor, corrija os erros no formulário" 
      })
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulação de delay
      await register({ 
        name: formData.name, 
        email: formData.email, 
        password: formData.password 
      })
      toast({ 
        variant: "success",
        title: "Conta criada com sucesso", 
        description: "Bem-vindo ao TaskSphere!" 
      })
      navigate("/dashboard")
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Não foi possível criar sua conta. Tente novamente."
      toast({ 
        variant: "error", 
        title: "Falha no registro", 
        description: errorMessage 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  // Password strength indicator
  const getPasswordStrength = () => {
    const password = formData.password
    if (!password) return { strength: 0, label: "", color: "" }
    
    let strength = 0
    if (password.length >= 6) strength += 1
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    const labels = ["Muito fraca", "Fraca", "Média", "Forte", "Muito forte"]
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"]
    
    return {
      strength,
      label: labels[strength - 1] || "",
      color: colors[strength - 1] || "bg-gray-300"
    }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header melhorado */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#58a6ff] to-[#1f6feb] text-white shadow-lg">
              <Sparkles className="h-6 w-6" />
            </div>
            <Typography variant="h1" className="text-2xl font-bold text-[#f0f6fc]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58a6ff] to-[#3fb950]">
                TaskSphere
              </span>
            </Typography>
          </div>
          <Typography variant="body" className="text-[#8b949e]">
            Junte-se à nossa esfera de produtividade colaborativa
          </Typography>
        </div>

        {/* Card */}
        <Card className="bg-[#161b22] border border-[#30363d] shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-[#f0f6fc]">
              Cadastre-se gratuitamente
            </CardTitle>
            <Typography variant="small" className="text-center text-[#8b949e] mt-2">
              Crie sua conta em poucos passos
            </Typography>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nome */}
              <div>
                <Typography 
                  variant="small" 
                  as="label" 
                  className="block font-medium text-[#c9d1d9] mb-2 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Nome completo
                </Typography>
                <Input
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  error={errors.name}
                />
              </div>

              {/* Email */}
              <div>
                <Typography 
                  variant="small" 
                  as="label" 
                  className="block font-medium text-[#c9d1d9] mb-2 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Typography>
                <Input
                  type="email"
                  placeholder="nome@exemplo.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  error={errors.email}
                />
              </div>

              {/* Senha */}
              <div>
                <Typography 
                  variant="small" 
                  as="label" 
                  className="block font-medium text-[#c9d1d9] mb-2 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Senha
                </Typography>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                    error={errors.password}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8b949e] hover:text-[#c9d1d9]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password strength indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 bg-[#21262d] rounded-full h-1.5">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                        />
                      </div>
                      <Typography variant="small" className="text-[#8b949e]">
                        {passwordStrength.label}
                      </Typography>
                    </div>
                    <Typography variant="muted" className="text-[#8b949e]">
                      Use pelo menos 6 caracteres com letras, números e símbolos
                    </Typography>
                  </div>
                )}
              </div>

              {/* Confirmar Senha */}
              <div>
                <Typography 
                  variant="small" 
                  as="label" 
                  className="block font-medium text-[#c9d1d9] mb-2 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Confirmar senha
                </Typography>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    required
                    error={errors.confirmPassword}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8b949e] hover:text-[#c9d1d9]"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password match indicator */}
                {formData.confirmPassword && formData.password && (
                  <div className="mt-1 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      formData.password === formData.confirmPassword 
                        ? 'bg-green-500' 
                        : 'bg-red-500'
                    }`} />
                    <Typography variant="muted" className={
                      formData.password === formData.confirmPassword 
                        ? 'text-green-500' 
                        : 'text-red-500'
                    }>
                      {formData.password === formData.confirmPassword 
                        ? 'Senhas coincidem' 
                        : 'Senhas não coincidem'
                      }
                    </Typography>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading} variant="primary">
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Criando conta...
                  </>
                ) : (
                  "Criar conta"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <Typography variant="small" className="text-[#8b949e]">
                Já tem uma conta?{" "}
                <Link
                  to="/login"
                  className="font-medium text-[#58a6ff] hover:underline transition-colors"
                >
                  Faça login
                </Link>
              </Typography>

              <div className="text-center">
                <Typography variant="muted" className="text-[#6e7681]">
                  Ao criar uma conta, você concorda com nossos{" "}
                  <a href="#" className="text-[#58a6ff] hover:underline">
                    Termos de Serviço
                  </a>{" "}
                  e{" "}
                  <a href="#" className="text-[#58a6ff] hover:underline">
                    Política de Privacidade
                  </a>
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RegisterPage