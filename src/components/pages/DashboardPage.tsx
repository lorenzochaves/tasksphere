import type React from "react"
import DashboardTemplate from "../templates/DashboardTemplate"
import RecentProjects from "../organisms/RecentProjects"
import TaskOverview from "../organisms/TaskOverview"
import Typography from "../atoms/Typography"
import { Sparkles } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

const DashboardPage: React.FC = () => {
  const { user } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  const userName = typeof user?.name === "string" ? user.name.split(" ")[0] : "Usuário"

  return (
    <DashboardTemplate>
      <div className="max-w-screen-xl mx-auto px-4 py-10 space-y-10">
        {/* Welcome Header - Limpo */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-[#58a6ff]" />
            <Typography variant="small" className="text-[#8b949e] font-medium">
              {getGreeting()}, {userName}!
            </Typography>
          </div>
          
          <Typography variant="h1" className="text-3xl md:text-4xl font-bold text-white">
            Bem-vindo ao{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58a6ff] to-[#3fb950]">
              TaskSphere
            </span>
          </Typography>
          
          <Typography variant="body" className="text-[#8b949e] text-base sm:text-lg max-w-2xl mx-auto">
            Gerencie seus projetos e tarefas com praticidade e elegância. 
            Sua produtividade em uma esfera completa de organização.
          </Typography>
        </div>

        {/* Recent Projects */}
        <section>
          <RecentProjects />
        </section>

        {/* Task Overview */}
        <section>
          <TaskOverview />
        </section>
      </div>
    </DashboardTemplate>
  )
}

export default DashboardPage