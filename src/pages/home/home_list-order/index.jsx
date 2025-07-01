import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, Clock, List, ArrowLeft, Package, TrendingUp, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const cardData = [
  {
    onClick: () => {},
    icon: ShoppingCart,
    title: "Novo Pedido",
    description: "Criar um novo pedido de compras",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50 hover:bg-emerald-100",
    stats: "Rápido e fácil",
    route: "/Cadastro_Produtos",
  },
  {
    onClick: () => {},
    icon: Clock,
    title: "Status do Pedido",
    description: "Acompanhar pedidos em andamento",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 hover:bg-blue-100",
    stats: "Em tempo real",
    route: "/Gestão_Pedido",
  },
  {
    onClick: () => {},
    icon: List,
    title: "Lista de Compras",
    description: "Visualizar todas as compras",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 hover:bg-purple-100",
    stats: "Organizado",
    route: "/Lista_Compras",
  },
]

const NavigationCard = ({ onClick, icon: Icon, title, description, color, bgColor, stats, route, navigate }) => {
  const handleClick = () => {navigate(route)}

  return (
    <Card className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${bgColor}`} onClick={handleClick} >
      <CardContent className="p-8 h-full flex flex-col items-center text-center relative">
        {/* Background gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
        {/* Stats badge */}
        <div className="absolute top-4 right-4 z-20"><Badge className={`bg-gradient-to-r ${color} text-white border-0 text-xs px-2 py-1 shadow-md`}>{stats}</Badge></div>
        {/* Icon container */}
        <div className={`relative z-10 w-24 h-24 rounded-3xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
          <Icon className="h-12 w-12 text-white" />
          {/* Sparkle effect */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"><Sparkles className="h-3 w-3 text-gray-600" /></div>
        </div>
        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">{title}</h3>
          <p className="text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">{description}</p>
        </div>
        {/* Action indicator */}
        <div className="relative z-10 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"><div className={`w-12 h-1 bg-gradient-to-r ${color} rounded-full mx-auto`}></div></div>
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
        <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
          <ArrowLeft className="h-10 w-10 text-white" />
        </div>
        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gray-100 transition-colors">Voltar</h3>
          <p className="text-white/70 group-hover:text-white/80 transition-colors">Retornar ao menu principal</p>
        </div>
        {/* Action indicator */}
        <div className="relative z-10 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="w-12 h-1 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full mx-auto"></div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ListaPedidos() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-300 rounded-full opacity-80 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-3/4 w-3 h-3 bg-pink-300 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-300 rounded-full opacity-50 animate-ping"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-4xl">
          <div className="flex items-center justify-center mb-6">
            <Package className="h-10 w-10 text-emerald-400 mr-4 animate-pulse" />
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-6 py-2 text-sm">Sistema de Compras</Badge>
            <TrendingUp className="h-10 w-10 text-blue-400 ml-4 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6 leading-tight">Pedidos & Compras</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed"> Gerencie todos os seus pedidos e compras de forma eficiente e organizada</p>
        </div>

        {/* Cards Grid */}
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {cardData.map((card, index) => (
              <NavigationCard key={index} {...card} navigate={navigate} />
            ))}
          </div>

          {/* Back Card - Separate row for emphasis */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm"><Link to="/Home" className="block"><BackCard /></Link></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="text-3xl font-bold text-emerald-400 mb-2">24/7</div>
            <div className="text-white/70 text-sm">Disponibilidade</div>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
            <div className="text-white/70 text-sm">Segurança</div>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="text-3xl font-bold text-purple-400 mb-2">∞</div>
            <div className="text-white/70 text-sm">Possibilidades</div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center"><p className="text-white/50 text-sm">Instituto Reciclar - Sistema de Gestão de Compras</p></div>
      </div>
    </div>
  )
}
