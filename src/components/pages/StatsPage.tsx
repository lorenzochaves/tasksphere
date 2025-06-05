import type React from "react"
import DashboardTemplate from "../templates/DashboardTemplate"
import DashboardStats from "../organisms/DashboardStats"
import Typography from "../atoms/Typography"
import { TrendingUp, BarChart3, Activity } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

const StatsPage: React.FC = () => {
  const { user } = useAuth()
  const userName = typeof user?.name === "string" ? user.name.split(" ")[0] : "Usuário"

  return (
    <DashboardTemplate>
      <div className="max-w-screen-xl mx-auto px-4 py-10 space-y-10">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-[#d29922] to-[#f85149] rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <Typography variant="h1" className="text-2xl md:text-3xl font-bold text-[#f0f6fc]">
                Estatísticas Sphere
              </Typography>
              <Typography variant="body" className="text-[#8b949e]">
                Análise completa da sua produtividade, {userName}
              </Typography>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#58a6ff]/20 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-[#58a6ff]" />
                </div>
                <div>
                  <Typography variant="small" className="text-[#8b949e] font-medium">
                    Performance
                  </Typography>
                  <Typography variant="h5" className="text-[#f0f6fc]">
                    Em Tempo Real
                  </Typography>
                </div>
              </div>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#3fb950]/20 rounded-lg">
                  <Activity className="w-5 h-5 text-[#3fb950]" />
                </div>
                <div>
                  <Typography variant="small" className="text-[#8b949e] font-medium">
                    Análise
                  </Typography>
                  <Typography variant="h5" className="text-[#f0f6fc]">
                    Detalhada
                  </Typography>
                </div>
              </div>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#d29922]/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-[#d29922]" />
                </div>
                <div>
                  <Typography variant="small" className="text-[#8b949e] font-medium">
                    Insights
                  </Typography>
                  <Typography variant="h5" className="text-[#f0f6fc]">
                    Inteligentes
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Component */}
        <section>
          <DashboardStats />
        </section>
      </div>
    </DashboardTemplate>
  )
}

export default StatsPage