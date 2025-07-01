import { Link } from "react-router-dom"
import { Package, PackageOpen, Building2, List, Users, ArrowLeft, Sparkles, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card/index"
import { Badge } from "@/components/ui/badge"

const cardData = [
  {
    link: "/Cadastro_Geral",
    icon: Package,
    title: "Produtos",
    description: "Cadastrar novos produtos",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 hover:bg-blue-100",
  },
  {
    link: "/Entrada_Produtos",
    icon: PackageOpen,
    title: "Entrada de Produtos",
    description: "Registrar entrada de estoque",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 hover:bg-green-100",
  },
  {
    link: "/Cadastro_Fornecedor",
    icon: Building2,
    title: "Fornecedores",
    description: "Gerenciar fornecedores",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 hover:bg-purple-100",
  },
  {
    link: "/Gerenciador_Produtos",
    icon: List,
    title: "Lista de Produtos",
    description: "Visualizar todos os produtos",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 hover:bg-orange-100",
  },
  {
    link: "/Visualizar_Fornecedores",
    icon: Users,
    title: "Lista de Fornecedores",
    description: "Visualizar fornecedores",
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50 hover:bg-indigo-100",
  },
]

const NavigationCard = ({ link, icon: Icon, title, description, color, bgColor, isBackCard = false }) => {
  return (
    <Card className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${bgColor || "bg-gray-50 hover:bg-gray-100"}`}>
      <CardContent className="p-6 h-full flex flex-col items-center text-center relative">
        {/* Background gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color || "from-gray-400 to-gray-600"} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
        {/* Icon container */}
        <div className={`relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br ${color || "from-gray-400 to-gray-600"} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
          <Icon className="h-10 w-10 text-white" />
          {!isBackCard && (<div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"><Plus className="h-3 w-3 text-gray-600" /></div>)}
        </div>
        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">{title}</h3>
          {description && (<p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">{description}</p>)}
        </div>
        {/* Hover effect indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </CardContent>
    </Card>
  )
}

export default function Cadastro() {
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
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Header Section */}
        <div className="text-center mb-12 max-w-4xl">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-purple-400 mr-3 animate-pulse" />
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-1">Sistema de Gestão</Badge>
            <Sparkles className="h-8 w-8 text-pink-400 ml-3 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">Cadastros</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">Gerencie todos os aspectos do seu sistema de forma centralizada e eficiente</p>
        </div>

        {/* Cards Grid */}
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {cardData.map((card, index) => (<Link key={index} to={card.link} className="block"><NavigationCard {...card} /></Link>))}
          </div>

          {/* Back Card - Separate row for emphasis */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <Link to="/Home" className="block">
                <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/10 backdrop-blur-sm border border-white/20">
                  <CardContent className="p-6 h-full flex flex-col items-center text-center relative">
                    {/* Background gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-700 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    {/* Icon container */}
                    <div className="relative z-10 w-16 h-16 rounded-xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <ArrowLeft className="h-8 w-8 text-white" />
                    </div>
                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gray-100 transition-colors">Voltar</h3>
                      <p className="text-sm text-white/70 group-hover:text-white/80 transition-colors">Retornar ao menu principal</p>
                    </div>
                    {/* Hover effect indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
        {/* Footer info */}
        <div className="mt-12 text-center">
          <p className="text-white/50 text-sm">Instituto Reciclar - Sistema de Gestão Integrada</p>
        </div>
      </div>
    </div>
  )
}