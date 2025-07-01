import { Link } from "react-router-dom"
import { Clock, XCircle, ArrowLeft, Calendar, CheckCircle, AlertTriangle, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const cardData = [
  {
    link: "/Gerenciador-cardapios",
    icon: Clock,
    title: "Cardápios Pendentes",
    description: "Revisar e aprovar cardápios aguardando análise",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50 hover:bg-amber-100",
    stats: "Aguardando",
    count: "12",
    priority: "high",
  },
  {
    link: "/Gerenciador-cardapios-reprovados",
    icon: XCircle,
    title: "Cardápios Reprovados",
    description: "Consultar cardápios que precisam de revisão",
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-50 hover:bg-red-100",
    stats: "Revisar",
    count: "3",
    priority: "medium",
  },
]

const NavigationCard = ({ link, icon: Icon, title, description, color, bgColor, stats, count, priority }) => {
  const getPriorityColor = () => {
    switch (priority) {
      case "high": return "bg-red-500"
      case "medium": return "bg-yellow-500"
      case "low": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <Card
      className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${bgColor}`}
    >
      <CardContent className="p-8 h-full flex flex-col items-center text-center relative">
        {/* Background gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

        {/* Priority indicator */}
        <div className="absolute top-4 left-4 z-20">
          <div className={`w-3 h-3 ${getPriorityColor()} rounded-full animate-pulse`}></div>
        </div>
        {/* Stats badge */}
        <div className="absolute top-4 right-4 z-20"><Badge className={`bg-gradient-to-r ${color} text-white border-0 text-xs px-3 py-1 shadow-md`}>{stats}</Badge></div>
        {/* Count badge */}
        <div className="absolute -top-2 -right-2 z-30">
          <div className={`w-8 h-8 bg-gradient-to-r ${color} rounded-full flex items-center justify-center shadow-lg`}>
            <span className="text-white text-sm font-bold">{count}</span>
          </div>
        </div>
        {/* Icon container */}
        <div className={`relative z-10 w-24 h-24 rounded-3xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-2`}>
          <Icon className="h-12 w-12 text-white" />
          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-3xl bg-white opacity-0 group-hover:opacity-20 animate-pulse"></div>
          {/* Sparkle effect */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce">
            <Sparkles className="h-3 w-3 text-gray-600" />
          </div>
        </div>
        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">{title}</h3>
          <p className="text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">{description}</p>
        </div>
        {/* Action indicator */}
        <div className="relative z-10 mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className={`w-16 h-1 bg-gradient-to-r ${color} rounded-full mx-auto`}></div>
        </div>
        {/* Hover glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-xl`}></div>
      </CardContent>
    </Card>
  )
}

const BackCard = () => {
  return (
    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/10 backdrop-blur-sm border border-white/20">
      <CardContent className="p-8 h-full flex flex-col items-center text-center relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-700 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        {/* Icon container */}
        <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:-rotate-2">
          <ArrowLeft className="h-10 w-10 text-white" />
          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-10 animate-pulse"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gray-100 transition-colors">Voltar</h3>
          <p className="text-white/70 group-hover:text-white/80 transition-colors">Retornar aos cardápios</p>
        </div>
        {/* Action indicator */}
        <div className="relative z-10 mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="w-16 h-1 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full mx-auto"></div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function GerenciadorCardapios() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-amber-300 rounded-full opacity-80 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-3/4 w-3 h-3 bg-red-300 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-purple-300 rounded-full opacity-50 animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-60 animate-pulse"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-5xl">
          <div className="flex items-center justify-center mb-6">
            <Calendar className="h-10 w-10 text-amber-400 mr-4 animate-pulse" />
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-6 py-2 text-sm">Sistema de Aprovação</Badge>
            <AlertTriangle className="h-10 w-10 text-red-400 ml-4 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-amber-200 to-red-200 bg-clip-text text-transparent mb-4 leading-tight">Gerencie os Cardápios</h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 px-4 py-2">Pendentes</Badge>
            <span className="text-white/50">•</span><Badge className="bg-red-500/20 text-red-300 border-red-500/30 px-4 py-2">Reprovados</Badge>
          </div>
          <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">Centralize a aprovação e revisão de todos os cardápios do sistema de forma eficiente e organizada</p>
        </div>

        {/* Cards Grid */}
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {cardData.map((card, index) => (<Link key={index} to={card.link} className="block"><NavigationCard {...card} /></Link>))}
          </div>

          {/* Back Card - Separate row for emphasis */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <Link to="/cardapios" className="block"><BackCard /></Link>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl w-full">
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"><Clock className="h-6 w-6 text-white" /></div>
            <div className="text-2xl font-bold text-amber-400 mb-2">12</div>
            <div className="text-white/70 text-sm">Pendentes</div>
          </div>

          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"><XCircle className="h-6 w-6 text-white" /></div>
            <div className="text-2xl font-bold text-red-400 mb-2">3</div>
            <div className="text-white/70 text-sm">Reprovados</div>
          </div>

          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"><CheckCircle className="h-6 w-6 text-white" /></div>
            <div className="text-2xl font-bold text-green-400 mb-2">47</div>
            <div className="text-white/70 text-sm">Aprovados</div>
          </div>

          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-2">62</div>
            <div className="text-white/70 text-sm">Total</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 px-4 py-2 hover:bg-amber-500/30 transition-colors cursor-pointer">⏰ Aprovação Rápida</Badge>
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30 px-4 py-2 hover:bg-red-500/30 transition-colors cursor-pointer">📝 Revisar Pendências</Badge>
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2 hover:bg-blue-500/30 transition-colors cursor-pointer">📊 Relatório de Status</Badge>
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2 hover:bg-green-500/30 transition-colors cursor-pointer">✅ Histórico de Aprovações </Badge>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center">
          <p className="text-white/50 text-sm">Instituto Reciclar - Sistema de Gerenciamento de Cardápios</p>
        </div>
      </div>
    </div>
  )
}
