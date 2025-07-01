import { Link } from "react-router-dom"
import { FileText, Calendar, UtensilsCrossed, ArrowLeft, ChefHat, Clock, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const cardData = [
  {
    link: "/ficha-tecnica",
    icon: FileText,
    title: "Ficha Técnica",
    description: "Gerencie receitas e fichas técnicas detalhadas",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50 hover:bg-emerald-100",
    stats: "Receitas",
    category: "Técnico",
    iconEmoji: "📝",
    count: "45",
  },
  {
    link: "/cardapios",
    icon: Calendar,
    title: "Cardápios",
    description: "Organize e consulte cardápios do sistema",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 hover:bg-blue-100",
    stats: "Planejamento",
    category: "Gestão",
    iconEmoji: "📅",
    count: "28",
  },
  {
    link: "/refeicoes",
    icon: UtensilsCrossed,
    title: "Refeições",
    description: "Cadastre e consulte refeições servidas",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 hover:bg-orange-100",
    stats: "Servidas",
    category: "Operação",
    iconEmoji: "🍽️",
    count: "247",
  },
]

const NavigationCard = ({link, icon: Icon, title, description, color, bgColor, stats, category, iconEmoji, count}) => {
  return (
    <Card className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${bgColor}`}>
      <CardContent className="p-8 h-full flex flex-col items-center text-center relative">
        {/* Background gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
        {/* Category badge */}
        <div className="absolute top-4 left-4 z-20">
          <Badge className="bg-white/80 text-gray-700 border-0 text-xs px-2 py-1 shadow-sm">{category}</Badge>
        </div>
        {/* Stats badge */}
        <div className="absolute top-4 right-4 z-20">
          <Badge className={`bg-gradient-to-r ${color} text-white border-0 text-xs px-3 py-1 shadow-md`}>{stats}</Badge>
        </div>
        {/* Count badge */}
        <div className="absolute -top-2 -right-2 z-30">
          <div className={`w-10 h-10 bg-gradient-to-r ${color} rounded-full flex items-center justify-center shadow-lg`}>
            <span className="text-white text-sm font-bold">{count}</span>
          </div>
        </div>
        {/* Icon container */}
        <div className={`relative z-10 w-24 h-24 rounded-3xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-2`}>
          <Icon className="h-12 w-12 text-white" />
          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-3xl bg-white opacity-0 group-hover:opacity-20 animate-pulse"></div>
          {/* Emoji indicator */}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce"><span className="text-lg">{iconEmoji}</span></div>
        </div>
        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">{title}</h3>
          <p className="text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">{description}</p>
        </div>
        {/* Action indicator */}
        <div className="relative z-10 mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"><div className={`w-16 h-1 bg-gradient-to-r ${color} rounded-full mx-auto`}></div></div>
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
          <p className="text-white/70 group-hover:text-white/80 transition-colors">Retornar ao menu principal</p>
        </div>
        {/* Action indicator */}
        <div className="relative z-10 mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="w-16 h-1 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full mx-auto"></div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Cardapio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-emerald-300 rounded-full opacity-80 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-3/4 w-3 h-3 bg-blue-300 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-orange-300 rounded-full opacity-50 animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-60 animate-pulse"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-6xl">
          <div className="flex items-center justify-center mb-6">
            <ChefHat className="h-12 w-12 text-emerald-400 mr-4 animate-pulse" />
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-6 py-2 text-sm">Sistema Gastronômico</Badge>
            <Clock className="h-12 w-12 text-blue-400 ml-4 animate-pulse" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-emerald-200 to-orange-200 bg-clip-text text-transparent mb-6 leading-tight">Gestão Culinária</h1>
          <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-4 py-2">Ficha Técnica</Badge>
            <span className="text-white/50">•</span>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">Cardápios</Badge>
            <span className="text-white/50">•</span>
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 px-4 py-2">Refeições</Badge>
          </div>
          <p className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed">Centralize toda a gestão gastronômica do Instituto Reciclar em um só lugar</p>
        </div>

        {/* Cards Grid */}
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">{cardData.map((card, index) => (<Link key={index} to={card.link} className="block"><NavigationCard {...card} /></Link>))}</div>
          {/* Back Card - Separate row for emphasis */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm"><Link to="/home" className="block"><BackCard /></Link></div>
          </div>
        </div>
        {/* Feature Overview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"><FileText className="h-8 w-8 text-white" /></div>
            <div className="text-2xl font-bold text-emerald-400 mb-3">Ficha Técnica</div>
            <div className="text-white/70 text-sm leading-relaxed">Crie e gerencie fichas técnicas detalhadas com ingredientes, modo de preparo e informações nutricionais</div>
          </div>

          <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"><Calendar className="h-8 w-8 text-white" /></div>
            <div className="text-2xl font-bold text-blue-400 mb-3">Cardápios</div>
            <div className="text-white/70 text-sm leading-relaxed">Organize cardápios semanais e mensais com aprovação automática e controle de qualidade nutricional</div>
          </div>

          <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"><UtensilsCrossed className="h-8 w-8 text-white" /></div>
            <div className="text-2xl font-bold text-orange-400 mb-3">Refeições</div>
            <div className="text-white/70 text-sm leading-relaxed">Registre refeições servidas diariamente com controle de quantidade e feedback dos beneficiários</div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl w-full">
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mb-2">45</div>
            <div className="text-white/70 text-sm">Fichas Técnicas</div>
          </div>

          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-2">28</div>
            <div className="text-white/70 text-sm">Cardápios Ativos</div>
          </div>

          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <UtensilsCrossed className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-orange-400 mb-2">247</div>
            <div className="text-white/70 text-sm">Refeições Servidas</div>
          </div>

          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-purple-400 mb-2">98%</div>
            <div className="text-white/70 text-sm">Qualidade</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-4 py-2 hover:bg-emerald-500/30 transition-colors cursor-pointer">📝 Nova Receita</Badge>
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2 hover:bg-blue-500/30 transition-colors cursor-pointer">📅 Planejar Cardápio</Badge>
          <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 px-4 py-2 hover:bg-orange-500/30 transition-colors cursor-pointer">🍽️ Registrar Refeição</Badge>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2 hover:bg-purple-500/30 transition-colors cursor-pointer"> 📊 Relatórios</Badge>
        </div>

        {/* Meal Times Info */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 max-w-5xl">
          <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10 group hover:bg-white/10 transition-all duration-300">
            <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
            <div className="text-center">
              <div className="text-white font-semibold text-sm">Café da Manhã</div>
              <div className="text-white/60 text-xs">06:00 - 09:00</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10 group hover:bg-white/10 transition-all duration-300">
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="text-center">
              <div className="text-white font-semibold text-sm">Almoço</div>
              <div className="text-white/60 text-xs">11:30 - 14:00</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10 group hover:bg-white/10 transition-all duration-300">
            <div className="w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
            <div className="text-center">
              <div className="text-white font-semibold text-sm">Jantar</div>
              <div className="text-white/60 text-xs">17:30 - 20:00</div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center">
          <p className="text-white/50 text-sm">Instituto Reciclar - Sistema Integrado de Gestão Gastronômica</p>
        </div>
      </div>
    </div>
  )
}
