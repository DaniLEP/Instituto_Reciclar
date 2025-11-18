import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { ref, get } from "firebase/database"
import { auth, db } from "../../../firebase" // Ajuste conforme seu arquivo firebase

import { Button } from "@/components/ui/Button/button" 
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Mail, ArrowLeft, LogOut, Loader2, Shield, Clock, Settings, Camera, Star, Activity, User, ChevronRight, Sparkles } from "lucide-react"

export default function Perfil() {
  const [usuario, setUsuario] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [profileCompletion, setProfileCompletion] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      const user = auth.currentUser
      if (user) {
        const dbRef = ref(db, "usuarios/" + user.uid)
        const snapshot = await get(dbRef)
        if (snapshot.exists()) {
          const userData = snapshot.val()
          // Formata último acesso
          const ultimoAcessoFormatado = userData.ultimoAcesso? new Date(userData.ultimoAcesso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short"}): "Desconhecido"
          setUsuario({ ...userData, ultimoAcessoFormatado })
          // Calcular progresso do perfil
          let completion = 0
          if (userData.nome) completion += 25
          if (userData.email) completion += 25
          if (userData.funcao) completion += 25
          if (userData.fotoPerfil) completion += 25
          setProfileCompletion(completion)} 
        else {console.warn("Usuário não encontrado no banco de dados."); navigate("/")}} 
      else {console.warn("Usuário não autenticado."); navigate("/")}
      setIsLoading(false);
    }

    fetchUserData()
  }, [navigate])

  const handleLogout = async () => {
    try { await signOut(auth); navigate("/");
    } catch (error) {console.error("Erro ao fazer logout:", error)}
  }

  const getInitials = (nome) => {
    if (!nome) return "U"
    return nome.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  const getFuncaoConfig = (funcao) => {
    const configs = {
      admin: { color: "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0", icon: Shield, label: "Administrador",},
      moderador: { color: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0", icon: Star, label: "Cozinha",},
      usuario: { color: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0", icon: User, label: "Nutricionista"},
      default: { color: "bg-gray-300 text-black", icon: User, label: "Usuário"},
    }
    return configs[funcao?.toLowerCase()] || configs.default
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/70 backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-2 text-center">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="w-full space-y-4">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
                <span className="text-sm font-medium text-gray-600">Carregando seu perfil...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!usuario) {return (<div className="min-h-screen flex items-center justify-center text-gray-500">Usuário não encontrado.</div>)}
  const funcaoConfig = getFuncaoConfig(usuario.funcao)
  const IconComponent = funcaoConfig.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
            <img src="/Reciclar_LOGO.png" alt="Logo da Reciclar" className="w-20 h-15" />
            <span className="font-bold text-xl bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">Reciclar</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cartão Principal */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-0 bg-white/70 backdrop-blur-xl overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 relative">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -bottom-12 left-8">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 ring-4 ring-white shadow-2xl">
                      <AvatarImage src={usuario.fotoPerfil || "/placeholder.svg"} alt={`Foto de perfil de ${usuario.nome}`} className="object-cover"/>
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-xl font-bold">{getInitials(usuario.nome)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="pt-16 pb-8 px-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{usuario.nome}<Sparkles className="inline h-6 w-6 text-yellow-500 ml-2" /></h1>
                    <p className="text-gray-600 mb-4">Bem-vindo de volta! 👋</p>
                    <Badge className={`${funcaoConfig.color} px-3 py-1 text-sm font-semibold shadow-lg`}><IconComponent className="h-4 w-4 mr-2" />{funcaoConfig.label} </Badge>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800">Perfil Completo</span>
                    <span className="text-sm font-bold text-green-600">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="h-2" />
                </div>

                {/* Dados */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard title="Email" value={usuario.email} icon={<Mail className="h-4 w-4 text-white" />} bgColor="bg-blue-500" textColor="text-blue"/>
                  <InfoCard title="Status" value="Ativo" icon={<Activity className="h-4 w-4 text-white" />} bgColor="bg-emerald-500" textColor="text-emerald" />
                  <InfoCard title="Último acesso" value={usuario.ultimoAcessoFormatado || "Desconhecido"} icon={<Clock className="h-4 w-4 text-white" />} bgColor="bg-orange-500" textColor="text-orange"/>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ações Rápidas */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Settings className="h-5 w-5 text-violet-600" />Ações Rápidas</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/Home">
                  <Button className="w-full h-12 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg group hover:scale-[1.02] transition-transform">
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />Voltar ao Início</Button>
                </Link>
                <Separator />
                <Button onClick={handleLogout} variant="destructive"
                  className="w-full h-12 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg group hover:scale-[1.02] transition-transform">
                  <LogOut className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />Sair da Conta</Button>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-violet-500 to-blue-600 text-white">
              <CardContent className="p-6 relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Star className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">Estatísticas</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Perfil completo</span>
                    <span className="font-bold">{profileCompletion}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Nível de acesso</span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">{funcaoConfig.label}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2"><Shield className="h-4 w-4" />Seus dados estão seguros e protegidos</p>
        </div>
      </div>
    </div>
  )
}

// Subcomponente para cards de informação
function InfoCard({ title, value, icon, bgColor, textColor }) {
  return (
    <div
      className={`group p-4 rounded-xl bg-gradient-to-br from-${textColor}-50 to-${textColor}-100 border border-${textColor}-100 hover:shadow-md transition-all duration-200 cursor-pointer`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 ${bgColor} rounded-lg`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-medium ${textColor}-800 uppercase tracking-wide`}>{title}</p>
          <p className={`text-sm font-semibold ${textColor}-900 truncate`}>{value}</p>
        </div>
        <ChevronRight className={`h-4 w-4 ${textColor}-400 group-hover:${textColor}-600 transition-colors`} />
      </div>
    </div>
  )
}
