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
import { Sparkles, Lock, Mail } from "lucide-react"

const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({ email: "", password: "" })

  const validateForm = () => {
    const emailError = validateField("email", formData.email, validationRules.email)
    const passwordError = validateField("password", formData.password, validationRules.password)
    
    setErrors({ email: emailError || "", password: passwordError || "" })
    return !emailError && !passwordError
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
      await login({ email: formData.email, password: formData.password })
      toast({ 
        title: "Login realizado com sucesso", 
        description: "Bem-vindo ao TaskSphere!",
        variant: "success"
      })
      navigate("/dashboard")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Email ou senha inválidos."
      toast({ variant: "error", title: "Falha no login", description: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestLogin = () => {
    setFormData({ 
      email: "lorenzo@tasksphere.com", 
      password: "123456" 
    })
  }

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
            Faça login para acessar sua esfera de produtividade
          </Typography>
        </div>

        {/* Card */}
        <Card className="bg-[#161b22] border border-[#30363d] shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-[#f0f6fc]">
              Bem-vindo de volta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  error={errors.email}
                />
              </div>
              
              <div>
                <Typography 
                  variant="small" 
                  as="label" 
                  className="block font-medium text-[#c9d1d9] mb-2 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Senha
                </Typography>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  error={errors.password}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading} variant="primary">
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <Typography variant="small" className="text-[#8b949e]">
                Não tem uma conta?{" "}
                <Link
                  to="/register"
                  className="font-medium text-[#58a6ff] hover:underline transition-colors"
                >
                  Cadastre-se gratuitamente
                </Link>
              </Typography>
              
              {/* Credenciais de teste melhoradas */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Typography variant="small" className="text-[#8b949e]">
                    Credenciais de teste:
                  </Typography>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleTestLogin}
                    className="text-xs py-1 px-2"
                  >
                    Preencher
                  </Button>
                </div>
                <Typography variant="small" className="font-mono text-[#c9d1d9] break-all">
                  <strong>lorenzo@tasksphere.com</strong> / <strong>123456</strong>
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage