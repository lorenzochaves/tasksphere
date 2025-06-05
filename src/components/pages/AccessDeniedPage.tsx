"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { AlertTriangle, ArrowLeft, Home, LogIn } from "lucide-react"
import Button from "../atoms/Button"
import Card, { CardContent } from "../atoms/Card"

interface AccessDeniedPageProps {
  message?: string
  type?: "403" | "404" | "500" | "unauthorized"
}

const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({ 
  message, 
  type = "403" 
}) => {
  const navigate = useNavigate()

  const errorConfig = {
    "403": {
      title: "Acesso Negado",
      description: message || "Você não tem permissão para acessar este recurso.",
      icon: <AlertTriangle className="h-16 w-16 text-red-500" />,
      color: "text-red-600"
    },
    "404": {
      title: "Página Não Encontrada",
      description: message || "A página que você está procurando não existe.",
      icon: <AlertTriangle className="h-16 w-16 text-amber-500" />,
      color: "text-amber-600"
    },
    "500": {
      title: "Erro Interno",
      description: message || "Ocorreu um erro interno no servidor. Tente novamente mais tarde.",
      icon: <AlertTriangle className="h-16 w-16 text-red-500" />,
      color: "text-red-600"
    },
    "unauthorized": {
      title: "Login Necessário",
      description: message || "Você precisa estar logado para acessar esta página.",
      icon: <LogIn className="h-16 w-16 text-blue-500" />,
      color: "text-blue-600"
    }
  }

  const config = errorConfig[type]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-medium text-center">
          <CardContent className="p-8 space-y-6">
            {/* Ícone */}
            <div className="flex justify-center">
              {config.icon}
            </div>

            {/* Título e descrição */}
            <div className="space-y-3">
              <h1 className={`text-2xl font-bold ${config.color}`}>
                {config.title}
              </h1>
              <p className="text-slate-600 leading-relaxed">
                {config.description}
              </p>
            </div>

            {/* Ações */}
            <div className="space-y-3 pt-4">
              {type === "unauthorized" ? (
                <>
                  <Button 
                    onClick={() => navigate("/login")} 
                    className="w-full"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Fazer Login
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/")} 
                    className="w-full"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Página Inicial
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => navigate(-1)} 
                    className="w-full"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/dashboard")} 
                    className="w-full"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Ir para Dashboard
                  </Button>
                </>
              )}
            </div>

            {/* Informações adicionais */}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                Se você acredita que isso é um erro, entre em contato com o suporte.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AccessDeniedPage
