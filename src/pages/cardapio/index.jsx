import { useState } from "react"
import { Coffee, UtensilsCrossed, Cookie, ArrowLeft, Sparkles, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/Button/button" 
import { Badge } from "@/components/ui/badge"
import CadastroCardapioAlmoco from "./almoco"
import CadastroCardapioCafe from "./breakfast"
import CadastroCardapioLanche from "./lanche"

const tiposCardapio = [
  {
    value: "cafe",
    label: "Café da Manhã",
    icon: Coffee,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    description: "Refeição matinal nutritiva",
    horario: "06:00 - 09:00",
    emoji: "☕",
  },
  {
    value: "almoco",
    label: "Almoço",
    icon: UtensilsCrossed,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50",
    description: "Refeição principal do dia",
    horario: "11:30 - 14:00",
    emoji: "🍽️",
  },
  {
    value: "lanche",
    label: "Lanche da Tarde",
    icon: Cookie,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    description: "Lanche nutritivo vespertino",
    horario: "15:00 - 17:00",
    emoji: "🍪",
  },
]

const TipoCard = ({ tipo, isSelected, onSelect }) => {
  const IconComponent = tipo.icon

  return (
    <Card className={`group relative overflow-hidden border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${isSelected ? `border-transparent bg-gradient-to-br ${tipo.color} text-white shadow-2xl` : `border-gray-200 hover:border-gray-300 ${tipo.bgColor} hover:shadow-lg`}`}
      onClick={() => onSelect(tipo.value)}>
      <CardContent className="p-6 text-center relative">
        {/* Background gradient overlay for selected state */}
        {isSelected && (<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"></div>)}
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        )}
        {/* Icon container */}
        <div className={`relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg transition-all duration-300 group-hover:scale-110 ${isSelected ? "bg-white/20 backdrop-blur-sm" : `bg-gradient-to-br ${tipo.color}`}`}>
          <IconComponent className={`h-10 w-10 ${isSelected ? "text-white" : "text-white"}`} />
          {/* Emoji indicator */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"><span className="text-sm">{tipo.emoji}</span></div>
        </div>
        {/* Content */}
        <div className="relative z-10">
          <h3 className={`text-xl font-bold mb-2 transition-colors ${isSelected ? "text-white" : "text-gray-800"}`}>{tipo.label}</h3>
          <p className={`text-sm mb-3 transition-colors ${isSelected ? "text-white/90" : "text-gray-600"}`}>{tipo.description}</p>
          {/* Horário badge */}
          <Badge className={`${isSelected ? "bg-white/20 text-white border-white/30" : `bg-gradient-to-r ${tipo.color} text-white border-0`} text-xs px-3 py-1 shadow-sm`}><Clock className="h-3 w-3 mr-1" />{tipo.horario}</Badge>
        </div>
        {/* Hover glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${tipo.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-xl`}></div>
      </CardContent>
    </Card>
  )
}

const CadastroCardapio = () => {
  const [tipoSelecionado, setTipoSelecionado] = useState("")
  const navigate = useNavigate()
  const tipoAtual = tiposCardapio.find((tipo) => tipo.value === tipoSelecionado)

  const renderFormulario = () => {
    switch (tipoSelecionado) {case "cafe": return <CadastroCardapioCafe />
      case "almoco": return <CadastroCardapioAlmoco />
      case "lanche": return <CadastroCardapioLanche />
      default:
        return (
          <Card className="border-dashed border-2 border-gray-300 bg-gray-50/50">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6 opacity-50">
                <UtensilsCrossed className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Selecione um Tipo de Cardápio</h3>
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed"> Escolha o tipo de refeição acima para começar o cadastro do cardápio. Cada tipo tem campos específicos para suas necessidades.</p>
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
            <Button onClick={() => navigate(-1)} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Button>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="h-6 w-6 text-amber-400 mr-2 animate-pulse" />
                <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-1">Cadastro de Cardápio</Badge>
                <Sparkles className="h-6 w-6 text-emerald-400 ml-2 animate-pulse" />
              </div>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-amber-200 to-emerald-200 bg-clip-text text-transparent mb-4 leading-tight">Novo Cardápio</h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">Selecione o tipo de refeição e configure o cardápio com todos os detalhes necessários</p>
          </div>

          {/* Tipo Selection */}
          <Card className="bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl mb-8">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-800 mb-2">Tipo de Cardápio</CardTitle>
              <p className="text-gray-600">Escolha o tipo de refeição para cadastrar</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {tiposCardapio.map((tipo) => (<TipoCard key={tipo.value} tipo={tipo} isSelected={tipoSelecionado === tipo.value} onSelect={setTipoSelecionado}/>))}
              </div>

              {/* Selected Type Info */}
              {tipoAtual && (
                <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tipoAtual.color} flex items-center justify-center mr-4 shadow-lg`}><tipoAtual.icon className="h-6 w-6 text-white" /></div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{tipoAtual.label} Selecionado</h3>
                      <p className="text-gray-600 text-sm">{tipoAtual.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <Badge className={`bg-gradient-to-r ${tipoAtual.color} text-white border-0 px-4 py-2`}><Clock className="h-4 w-4 mr-2" />Horário: {tipoAtual.horario}</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Form Section */}
          <Card className="bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-800 mb-2">{tipoAtual ? `Cadastro - ${tipoAtual.label}` : "Formulário de Cadastro"}</CardTitle>
              <p className="text-gray-600">{tipoAtual ? `Configure os detalhes do cardápio para ${tipoAtual.label.toLowerCase()}` : "Selecione um tipo de cardápio para continuar"}</p>
            </CardHeader>
            <CardContent>{renderFormulario()}</CardContent>
          </Card>

          {/* Quick Stats */}
          {tipoSelecionado && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className={`w-12 h-12 bg-gradient-to-br ${tipoAtual.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <tipoAtual.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">{tipoAtual.emoji}</div>
                <div className="text-white/70 text-sm">{tipoAtual.label}</div>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4"><Clock className="h-6 w-6 text-white" /></div>
                <div className="text-2xl font-bold text-blue-400 mb-2">Horário</div>
                <div className="text-white/70 text-sm">{tipoAtual.horario}</div>
              </div>

              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4"><Sparkles className="h-6 w-6 text-white" /></div>
                <div className="text-2xl font-bold text-green-400 mb-2">Status</div>
                <div className="text-white/70 text-sm">Em Cadastro</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CadastroCardapio