import { Link, useNavigate } from "react-router-dom"
import Header from "../../../components/ui/header/index"
import { useEffect, useState } from "react"
import { auth, dbRealtime } from "../../../../firebase"
import { ref, get } from "firebase/database"
import { onAuthStateChanged } from "firebase/auth"
import { Card, CardContent } from "@/components/ui/card/index"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button/button" 
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Wallet, UserPlus, Package, BarChart3, Download, Users, UtensilsCrossed, Settings, FileText, Clock, User, ExternalLink, Grid3X3, List, Search, ChevronRight } from "lucide-react"
import { Separator } from "@radix-ui/react-separator"

const iconMap = {
  "Pedidos/Compras": ShoppingCart,
  Saldo: Wallet,
  Cadastros: UserPlus,
  Estoque: Package,
  Relatórios: BarChart3,
  Retirada: Download,
  "Gerenciador de Usuários": Users,
  "Cardápio / Ficha Técnica / Refeições": UtensilsCrossed,
  Manutenção: Settings, 
  Documentação: FileText,
}

const ModernCard = ({ to, title, external = false, index, viewMode }) => {
  const IconComponent = iconMap[title]

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, y: 0, scale: 1,
      transition: { delay: index * 0.08, duration: 0.4, ease: "easeOut" },
    },
  }

  const content = (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" className="group h-full">
      <Card className="h-full bg-white/90 backdrop-blur-md border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/95 overflow-hidden relative">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardContent className={`p-6 flex ${viewMode === "list" ? "flex-row items-center space-x-4" : "flex-col items-center text-center"} h-full justify-between relative z-10`}>
          <div className={`flex ${viewMode === "list" ? "flex-row items-center space-x-4" : "flex-col items-center space-y-4"}`}>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                {IconComponent && <IconComponent className="h-8 w-8 text-white" />}
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ChevronRight className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className={viewMode === "list" ? "text-left" : "text-center"}>
              <h3 className="text-gray-800 text-sm font-semibold leading-tight group-hover:text-blue-600 transition-colors mb-1">{title}</h3>
              <p className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Clique para acessar</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {external && (<Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700"><ExternalLink className="h-3 w-3 mr-1" />Externo</Badge>)}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" aria-label={title} className="block">
        {content}
      </a>
    )
  }

  return (
    <Link to={to} aria-label={title} className="block">
      {content}
    </Link>
  )
}

const QuickStats = ({ usuario }) => {
  const stats = [
    { label: "Módulos Disponíveis", value: "8", icon: Grid3X3, color: "text-blue-600" },
    { label: "Último Acesso", value: usuario.ultimoAcessoFormatado || "Desconhecido", icon: Clock, color: "text-green-600" },
    { label: "Perfil", value: usuario.funcao, icon: User, color: "text-purple-600" },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="font-semibold text-gray-900">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  )
}

export default function Home() {
  const [usuario, setUsuario] = useState(null)
  const [time, setTime] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/")
        return
      }
      try {
        const dbRef = ref(dbRealtime, `usuarios/${user.uid}`)
        const snapshot = await get(dbRef)
        if (snapshot.exists()) {
          const dados = snapshot.val()
          const ultimoAcessoFormatado = dados.ultimoAcesso
            ? new Date(dados.ultimoAcesso).toLocaleString("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              })
            : "Desconhecido"

          setUsuario({ ...dados, ultimoAcessoFormatado })
        } else {
          console.warn("Usuário não encontrado no banco de dados.")
          setUsuario(null)
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error)
        setUsuario(null)
      } finally {
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <div
              className="absolute inset-0 rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            ></div>
          </div>
          <p className="text-gray-600 font-medium">Carregando seu painel...</p>
          <p className="text-gray-400 text-sm mt-1">Aguarde um momento</p>
        </motion.div>
      </div>
    )
  }

  if (!usuario || !usuario.funcao) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro de Autenticação</h3>
          <p className="text-gray-600 mb-4">Não foi possível carregar seus dados</p>
          <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
            Fazer Login Novamente
          </Button>
        </motion.div>
      </div>
    )
  }

  const cards = [
    { to: "/Pedidos", title: "Pedidos/Compras", funcao: ["Admin"] },
    { to: "/sistema-caixa", title: "Saldo", funcao: ["Admin"] },
    { to: "/Cadastro", title: "Cadastros", funcao: ["Admin"] },
    { to: "/Estoque", title: "Estoque", funcao: ["Admin", "Cozinha"] },
    { to: "/Dashboard", title: "Relatórios", funcao: ["Admin"] },
    { to: "/home-retirada", title: "Retirada", funcao: ["Admin", "Cozinha"] },
    { to: "/Verificacao_Usuario", title: "Gerenciador de Usuários", funcao: ["Admin"] },
    { to: "/cardapio", title: "Cardápio / Ficha Técnica / Refeições", funcao: ["Admin", "Nutricionista", "Cozinha"] },
    { to: "/manutencao-home", title: "Manutenção", funcao: ["Admin"] },
    {
      to: "https://drive.google.com/drive/folders/1QdXTwo0zggBmHP1MBih6IMVCQ-WaoBBa?usp=sharing",
      title: "Documentação",
      funcao: ["Admin"],
      external: true,
    },
  ]

  const cardsPermitidos = cards.filter(
    (card) => card.funcao.includes(usuario.funcao) && card.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleColor = (funcao) => {
    switch (funcao) {
      case "Admin":
        return "bg-gradient-to-r from-red-500 to-pink-500"
      case "Nutricionista":
        return "bg-gradient-to-r from-green-500 to-emerald-500"
      case "Cozinha":
        return "bg-gradient-to-r from-orange-500 to-amber-500"
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500"
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getGreeting = () => {
    const hour = time.getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-blue/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-30 shadow-sm text-black">
        <Header />
      </div>
      {/* Welcome Section */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Separator />
          <br />
          <br />
          <br />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
              >
                {getGreeting()}, {usuario.nome?.split(" ")[0] || "Usuário"}! 👋
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 mb-4"
              >
                Bem-vindo ao seu painel de controle. Gerencie todas as operações do sistema de forma eficiente.
              </motion.p>
              <div className="flex flex-wrap items-center gap-3">
                <Badge className={`${getRoleColor(usuario.funcao)} text-white px-3 py-1 shadow-lg`}>
                  <User className="h-3 w-3 mr-1" />
                  {usuario.funcao}
                </Badge>
                <Badge variant="outline" className="bg-white/80 border-gray-300">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(time)}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Horário atual</p>
                <p className="font-mono text-2xl font-bold text-gray-900 bg-white/80 px-4 py-2 rounded-lg shadow-sm">{formatTime(time)}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <QuickStats usuario={usuario} />
      </div>
      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm"
        >
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Módulos do Sistema</h2>
            <p className="text-gray-600 text-sm">
              {cardsPermitidos.length} módulo{cardsPermitidos.length !== 1 ? "s" : ""} disponível{cardsPermitidos.length !== 1 ? "s" : ""}
              {" "}para seu perfil
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar módulos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/90 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="h-8 w-8 p-0">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="h-8 w-8 p-0">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          {cardsPermitidos.length === 0 ? (
            <motion.p
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-500 mt-20"
            >
              Nenhum módulo encontrado para a busca "{searchTerm}"
            </motion.p>
          ) : viewMode === "grid" ? (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {cardsPermitidos.map((card, index) => (
                <ModernCard
                  key={card.title}
                  to={card.to}
                  imgSrc={card.img}
                  imgAlt={card.title}
                  title={card.title}
                  external={card.external}
                  index={index}
                  viewMode="grid"
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col space-y-4"
            >
              {cardsPermitidos.map((card, index) => (
                <ModernCard
                  key={card.title}
                  to={card.to}
                  imgSrc={card.img}
                  imgAlt={card.title}
                  title={card.title}
                  external={card.external}
                  index={index}
                  viewMode="list"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-md border-t border-gray-200/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <img src="/Reciclar_30anos_Horizontal_Positivo.png" alt="Logo" className="h-10 md:h-12" />
              <div>
                <p className="font-semibold text-gray-900">Sistema de Gestão</p>
                <p className="text-sm text-gray-600">Versão 2.0 - Atualizada</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600">© 2024 - Todos os direitos reservados</p>
              <p className="text-xs text-gray-500">Desenvolvido com ❤️ para eficiência</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}