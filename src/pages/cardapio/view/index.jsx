import { useState } from "react"
import { Coffee, UtensilsCrossed, Cookie, ArrowLeft, Sparkles, Clock, Search, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/Button/button" 
import { Badge } from "@/components/ui/badge"
import ConsultaCardapioLanche from "../lanche/list_lanche"
import ConsultaCardapioCafe from "../breakfast/list_breakfast"
import ConsultaCardapioAlmoco from "../almoco/list_almoco"

const tiposCardapio = [
  {
    value: "cafe",
    label: "Café da Manhã",
    icon: Coffee,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    description: "Visualizar cardápios matinais",
    horario: "06:00 - 09:00",
    emoji: "☕",
    count: "12",
  },
  {
    value: "almoco",
    label: "Almoço",
    icon: UtensilsCrossed,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50",
    description: "Consultar refeições principais",
    horario: "11:30 - 14:00",
    emoji: "🍽️",
    count: "28",
  },
  {
    value: "lanche",
    label: "Lanche da Tarde",
    icon: Cookie,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    description: "Verificar lanches vespertinos",
    horario: "15:00 - 17:00",
    emoji: "🍪",
    count: "15",
  },
]

const TipoCard = ({ tipo, isSelected, onSelect }) => {
  const IconComponent = tipo.icon

  return (
    <Card className={`group relative overflow-hidden border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${isSelected ? `border-transparent bg-gradient-to-br ${tipo.color} text-white shadow-2xl` : `border-gray-200 hover:border-gray-300 ${tipo.bgColor} hover:shadow-lg`}`}
      onClick={() => onSelect(tipo.value)} >
      <CardContent className="p-6 text-center relative">
        {/* Background gradient overlay for selected state */}
        {isSelected && (<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"></div>)}
        {/* Selection indicator */}
        {isSelected && (<div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"><div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div></div>)}
        {/* Count badge */}
        <div className="absolute -top-2 -right-2 z-30">
          <div className={`w-8 h-8 bg-gradient-to-r ${tipo.color} rounded-full flex items-center justify-center shadow-lg`}>
            <span className="text-white text-xs font-bold">{tipo.count}</span>
          </div>
        </div>

        {/* Icon container */}
        <div className={`relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg transition-all duration-300 group-hover:scale-110 ${isSelected ? "bg-white/20 backdrop-blur-sm" : `bg-gradient-to-br ${tipo.color}`}`}>
          <IconComponent className={`h-10 w-10 ${isSelected ? "text-white" : "text-white"}`} />
          {/* Search indicator for consultation */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md"><Search className="h-3 w-3 text-white" /></div>
          {/* Emoji indicator */}
          <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"><span className="text-sm">{tipo.emoji}</span></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className={`text-xl font-bold mb-2 transition-colors ${isSelected ? "text-white" : "text-gray-800"}`}>{tipo.label}</h3>
          <p className={`text-sm mb-3 transition-colors ${isSelected ? "text-white/90" : "text-gray-600"}`}>{tipo.description}</p>
          {/* Horário badge */}
          <Badge className={`${isSelected ? "bg-white/20 text-white border-white/30" : `bg-gradient-to-r ${tipo.color} text-white border-0` } text-xs px-3 py-1 shadow-sm mb-2`}><Clock className="h-3 w-3 mr-1" />{tipo.horario}</Badge>
          {/* Count info */}
          <div className={`text-xs ${isSelected ? "text-white/80" : "text-gray-500"}`}>{tipo.count} cardápios disponíveis</div>
        </div>
        {/* Hover glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${tipo.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-xl`}></div>
      </CardContent>
    </Card>
  )
}

const ViewCardapio = () => {
  const [tipoSelecionado, setTipoSelecionado] = useState("")
  const navigate = useNavigate()
  const tipoAtual = tiposCardapio.find((tipo) => tipo.value === tipoSelecionado)

  const renderFormulario = () => {
    switch (tipoSelecionado) {
      case "cafe": return <ConsultaCardapioCafe />
      case "almoco": return <ConsultaCardapioAlmoco />
      case "lanche": return <ConsultaCardapioLanche />
      default:
        return (
          <Card className="border-dashed border-2 border-gray-300 bg-gray-50/50">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 opacity-50"> <Eye className="h-12 w-12 text-white" /></div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Selecione um Tipo de Cardápio</h3>
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed">Escolha o tipo de refeição acima para visualizar os cardápios disponíveis. Você poderá consultar
                detalhes, histórico e informações nutricionais.</p>
              <div className="mt-6 flex items-center justify-center space-x-4">
                <Badge className="bg-blue-100 text-blue-700 px-3 py-1"><Search className="h-3 w-3 mr-1" />Busca Avançada</Badge>
                <Badge className="bg-green-100 text-green-700 px-3 py-1"><Eye className="h-3 w-3 mr-1" />Visualização Detalhada</Badge>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-amber-300 rounded-full opacity-80 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-3/4 w-3 h-3 bg-emerald-300 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-purple-300 rounded-full opacity-50 animate-ping"></div>
      </div>

      <div className="relative z-10 min-h-screen p-6">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button onClick={() => navigate(-1)} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Search className="h-6 w-6 text-blue-400 mr-2 animate-pulse" />
                <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-1">Consulta de Cardápios</Badge>
                <Eye className="h-6 w-6 text-emerald-400 ml-2 animate-pulse" />
              </div>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-emerald-200 bg-clip-text text-transparent mb-4 leading-tight">Consultar Cardápios</h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">Visualize e consulte todos os cardápios cadastrados no sistema com filtros avançados e detalhes completos</p>
          </div>

          {/* Tipo Selection */}
          <Card className="bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl mb-8">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-800 mb-2">Tipo de Cardápio</CardTitle>
              <p className="text-gray-600">Escolha o tipo de refeição para consultar os cardápios</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">{tiposCardapio.map((tipo) => (<TipoCard key={tipo.value} tipo={tipo} isSelected={tipoSelecionado === tipo.value} onSelect={setTipoSelecionado}/>))}</div>
              {/* Selected Type Info */}
              {tipoAtual && (
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl border border-blue-200">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tipoAtual.color} flex items-center justify-center mr-4 shadow-lg relative`}><tipoAtual.icon className="h-6 w-6 text-white" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><Search className="h-2 w-2 text-white" /></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{tipoAtual.label} - Consulta</h3>
                      <p className="text-gray-600 text-sm">{tipoAtual.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <Badge className={`bg-gradient-to-r ${tipoAtual.color} text-white border-0 px-4 py-2`}><Clock className="h-4 w-4 mr-2" />Horário: {tipoAtual.horario}</Badge>
                    <Badge className="bg-blue-500 text-white border-0 px-4 py-2"><Eye className="h-4 w-4 mr-2" />{tipoAtual.count} Disponíveis</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-800 mb-2">{tipoAtual ? `Cardápios - ${tipoAtual.label}` : "Resultados da Consulta"}</CardTitle>
              <p className="text-gray-600">{tipoAtual ? `Visualize todos os cardápios de ${tipoAtual.label.toLowerCase()} cadastrados` : "Selecione um tipo de cardápio para visualizar os resultados"}</p>
            </CardHeader>
            <CardContent>{renderFormulario()}</CardContent>
          </Card>

          {/* Quick Stats */}
          {tipoSelecionado && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className={`w-12 h-12 bg-gradient-to-br ${tipoAtual.color} rounded-xl flex items-center justify-center mx-auto mb-4`}><tipoAtual.icon className="h-6 w-6 text-white" /></div>
                <div className="text-2xl font-bold text-white mb-2">{tipoAtual.count}</div>
                <div className="text-white/70 text-sm">Cardápios</div>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4"><Search className="h-6 w-6 text-white" /></div>
                <div className="text-2xl font-bold text-blue-400 mb-2">Busca</div>
                <div className="text-white/70 text-sm">Avançada</div>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4"><Eye className="h-6 w-6 text-white" /></div>
                <div className="text-2xl font-bold text-green-400 mb-2">Visualização</div>
                <div className="text-white/70 text-sm">Detalhada</div>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4"><Sparkles className="h-6 w-6 text-white" /></div>
                <div className="text-2xl font-bold text-purple-400 mb-2">Filtros</div>
                <div className="text-white/70 text-sm">Inteligentes</div>
              </div>
            </div>
          )}

          {/* Features Overview */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"><Search className="h-8 w-8 text-white" /></div>
              <div className="text-2xl font-bold text-blue-400 mb-3">Busca Inteligente</div>
              <div className="text-white/70 text-sm leading-relaxed">Encontre cardápios específicos com filtros por data, ingredientes, tipo de refeição e informações nutricionais</div>
            </div>

            <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"><Eye className="h-8 w-8 text-white" /></div>
              <div className="text-2xl font-bold text-emerald-400 mb-3">Visualização Completa</div>
              <div className="text-white/70 text-sm leading-relaxed">Veja todos os detalhes dos cardápios incluindo ingredientes, modo de preparo, valores nutricionais e histórico</div>
            </div>

            <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"><Sparkles className="h-8 w-8 text-white" /></div>
              <div className="text-2xl font-bold text-purple-400 mb-3">Relatórios Avançados</div>
              <div className="text-white/70 text-sm leading-relaxed">Gere relatórios detalhados sobre cardápios, frequência de uso, avaliações e análises nutricionais</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewCardapio
