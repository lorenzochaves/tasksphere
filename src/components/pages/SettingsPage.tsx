import type React from "react"
import { useState } from "react"
import { Settings, User, Bell, Palette, Shield, Download, Trash2, Save } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { useToast } from "../../contexts/ToastContext"
import DashboardTemplate from "../templates/DashboardTemplate"
import Typography from "../atoms/Typography"
import Button from "../atoms/Button"
import Input from "../atoms/Input"
import Card, { CardContent, CardHeader, CardTitle } from "../atoms/Card"

const SettingsPage: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: ""
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    projectUpdates: true,
    taskReminders: true
  })

  // Theme settings
  const [theme, setTheme] = useState("dark")
  const [language, setLanguage] = useState("pt-BR")

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showActivity: false,
    allowCollaboration: true
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Mock delay
      toast({ 
        variant: "success",
        title: "Perfil atualizado", 
        description: "Suas informações foram salvas com sucesso." 
      })
    } catch (error) {
      toast({ 
        variant: "error",
        title: "Erro ao salvar", 
        description: "Não foi possível atualizar o perfil." 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      toast({ 
        variant: "success",
        title: "Notificações atualizadas", 
        description: "Suas preferências foram salvas." 
      })
    } catch (error) {
      toast({ 
        variant: "error",
        title: "Erro ao salvar", 
        description: "Não foi possível atualizar as notificações." 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      // Mock data export
      const mockData = {
        user: profileData,
        projects: ["Projeto A", "Projeto B"],
        tasks: ["Tarefa 1", "Tarefa 2", "Tarefa 3"],
        exportDate: new Date().toISOString()
      }
      const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'tasksphere-data.json'
      a.click()
      URL.revokeObjectURL(url)
      
      toast({ 
        variant: "success",
        title: "Dados exportados", 
        description: "Seu arquivo foi baixado com sucesso." 
      })
    } catch (error) {
      toast({ 
        variant: "error",
        title: "Erro na exportação", 
        description: "Não foi possível exportar os dados." 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = () => {
    toast({ 
      variant: "error",
      title: "Ação não disponível", 
      description: "A exclusão de conta será implementada em breve." 
    })
  }

  return (
    <DashboardTemplate>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-[#58a6ff] to-[#3fb950] rounded-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <Typography variant="h1" className="text-3xl font-bold text-[#f0f6fc] mb-1">
              Configurações
            </Typography>
            <Typography variant="body" className="text-[#8b949e]">
              Gerencie suas preferências e configurações da conta
            </Typography>
          </div>
        </div>

        {/* Profile Settings */}
        <Card className="bg-[#161b22] border border-[#30363d]">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-[#f0f6fc]">
              <User className="w-5 h-5" />
              Perfil da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Typography variant="small" as="label" className="block font-medium text-[#c9d1d9] mb-2">
                  Nome completo
                </Typography>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Seu nome completo"
                  className="w-full"
                />
              </div>
              <div>
                <Typography variant="small" as="label" className="block font-medium text-[#c9d1d9] mb-2">
                  Email
                </Typography>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="seu@email.com"
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-[#30363d]">
              <Button 
                onClick={handleSaveProfile} 
                disabled={isLoading}
                variant="primary"
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isLoading ? "Salvando..." : "Salvar Perfil"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-[#161b22] border border-[#30363d]">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-[#f0f6fc]">
              <Bell className="w-5 h-5" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Notificações por email', description: 'Receba updates importantes por email' },
                { key: 'pushNotifications', label: 'Notificações push', description: 'Notificações no navegador em tempo real' },
                { key: 'weeklyDigest', label: 'Resumo semanal', description: 'Relatório semanal de atividades' },
                { key: 'projectUpdates', label: 'Updates de projetos', description: 'Notificações sobre mudanças em projetos' },
                { key: 'taskReminders', label: 'Lembretes de tarefas', description: 'Alertas sobre prazos próximos' }
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-start justify-between p-5 bg-[#0d1117] border border-[#30363d] rounded-lg hover:bg-[#161b22] transition-colors">
                  <div className="flex-1 pr-6">
                    <Typography variant="small" className="font-medium text-[#f0f6fc] mb-2 block">
                      {label}
                    </Typography>
                    <Typography variant="muted" className="text-[#8b949e] text-sm leading-relaxed">
                      {description}
                    </Typography>
                  </div>
                  <div className="flex-shrink-0 pt-1">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications[key as keyof typeof notifications]}
                        onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                      />
                      <div className="w-11 h-6 bg-[#21262d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1f6feb]"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-[#30363d]">
              <Button 
                onClick={handleSaveNotifications} 
                disabled={isLoading}
                variant="outline"
                className="flex items-center gap-2 text-[#58a6ff] border-[#1f6feb] hover:bg-[#1f6feb]/10"
              >
                <Save className="w-4 h-4" />
                {isLoading ? "Salvando..." : "Salvar Notificações"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Theme & Language */}
        <Card className="bg-[#161b22] border border-[#30363d]">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-[#f0f6fc]">
              <Palette className="w-5 h-5" />
              Aparência e Idioma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Typography variant="small" as="label" className="block font-medium text-[#c9d1d9] mb-3">
                  Tema
                </Typography>
                <select 
                  value={theme} 
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full p-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] focus:border-[#1f6feb] focus:outline-none transition-colors"
                >
                  <option value="dark">🌙 Escuro</option>
                  <option value="light">☀️ Claro</option>
                  <option value="auto">🔄 Automático</option>
                </select>
              </div>
              <div>
                <Typography variant="small" as="label" className="block font-medium text-[#c9d1d9] mb-3">
                  Idioma
                </Typography>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] focus:border-[#1f6feb] focus:outline-none transition-colors"
                >
                  <option value="pt-BR">🇧🇷 Português (Brasil)</option>
                  <option value="en-US">🇺🇸 English (US)</option>
                  <option value="es-ES">🇪🇸 Español</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="bg-[#161b22] border border-[#30363d]">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-[#f0f6fc]">
              <Shield className="w-5 h-5" />
              Privacidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {[
                { key: 'profileVisible', label: 'Perfil público', description: 'Permitir que outros usuários vejam seu perfil' },
                { key: 'showActivity', label: 'Mostrar atividade', description: 'Exibir sua atividade recente para colaboradores' },
                { key: 'allowCollaboration', label: 'Permitir colaboração', description: 'Aceitar convites para projetos automaticamente' }
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-start justify-between p-5 bg-[#0d1117] border border-[#30363d] rounded-lg hover:bg-[#161b22] transition-colors">
                  <div className="flex-1 pr-6">
                    <Typography variant="small" className="font-medium text-[#f0f6fc] mb-2 block">
                      {label}
                    </Typography>
                    <Typography variant="muted" className="text-[#8b949e] text-sm leading-relaxed">
                      {description}
                    </Typography>
                  </div>
                  <div className="flex-shrink-0 pt-1">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={privacy[key as keyof typeof privacy]}
                        onChange={(e) => setPrivacy(prev => ({ ...prev, [key]: e.target.checked }))}
                      />
                      <div className="w-11 h-6 bg-[#21262d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1f6feb]"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-[#161b22] border border-[#30363d]">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-[#f0f6fc]">
              <Download className="w-5 h-5" />
              Gerenciamento de Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Typography variant="small" className="font-medium text-[#f0f6fc]">
                  Exportar Dados
                </Typography>
                <Typography variant="muted" className="text-[#8b949e] text-sm leading-relaxed">
                  Baixe uma cópia de todos os seus dados em formato JSON
                </Typography>
                <Button 
                  onClick={handleExportData} 
                  disabled={isLoading}
                  variant="outline"
                  className="w-full flex items-center gap-2 text-[#58a6ff] border-[#1f6feb] hover:bg-[#1f6feb]/10"
                >
                  <Download className="w-4 h-4" />
                  {isLoading ? "Exportando..." : "Exportar Dados"}
                </Button>
              </div>

              <div className="space-y-4">
                <Typography variant="small" className="font-medium text-[#f85149]">
                  Zona de Perigo
                </Typography>
                <Typography variant="muted" className="text-[#8b949e] text-sm leading-relaxed">
                  Excluir permanentemente sua conta e todos os dados
                </Typography>
                <Button 
                  onClick={handleDeleteAccount}
                  variant="outline"
                  className="w-full flex items-center gap-2 text-[#f85149] border-[#f85149] hover:bg-[#f85149]/10"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir Conta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardTemplate>
  )
}

export default SettingsPage