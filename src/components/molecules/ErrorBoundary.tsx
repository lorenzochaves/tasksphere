"use client"

import React from "react"
import { Component, ErrorInfo, ReactNode } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Button from "../atoms/Button"
import Card, { CardContent } from "../atoms/Card"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/dashboard'
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4">
          <div className="w-full max-w-md animate-fade-in">
            <Card className="shadow-medium text-center">
              <CardContent className="p-8 space-y-6">
                {/* Ícone */}
                <div className="flex justify-center">
                  <AlertTriangle className="h-16 w-16 text-red-500" />
                </div>

                {/* Título e descrição */}
                <div className="space-y-3">
                  <h1 className="text-2xl font-bold text-red-600">
                    Algo deu errado
                  </h1>
                  <p className="text-slate-600 leading-relaxed">
                    Ocorreu um erro inesperado na aplicação. Tente recarregar a página ou voltar ao dashboard.
                  </p>
                  
                  {/* Mostrar detalhes do erro em desenvolvimento */}
                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <div className="text-left bg-slate-100 p-3 rounded-lg mt-4">
                      <p className="text-xs font-mono text-slate-600 break-all">
                        {this.state.error.message}
                      </p>
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="space-y-3 pt-4">
                  <Button onClick={this.handleReload} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Recarregar Página
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={this.handleGoHome} 
                    className="w-full"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Ir para Dashboard
                  </Button>
                </div>

                {/* Informações adicionais */}
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    Se o problema persistir, entre em contato com o suporte técnico.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
