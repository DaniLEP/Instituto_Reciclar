"use client"

import { useState, useEffect } from "react"
import { X, Menu, User, ExternalLink, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getDatabase, ref, get } from "firebase/database"
import { Button } from "../Button/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@radix-ui/react-separator"

export default function Header() {
  const [click, setClick] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)

  const handleClick = () => setClick(!click)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 5)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const auth = getAuth()
    const db = getDatabase()

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = ref(db, `usuarios/${user.uid}`)
          const snapshot = await get(userRef)
          if (snapshot.exists()) {
            const data = snapshot.val()
            setUserRole(data.funcao)
          } else {
            setUserRole(null)
          }
        } catch {
          setUserRole(null)
        }
      } else {
        setUserRole(null)
      }
      setLoading(false)
    })
  }, [])

  const menuLinks = [
    { path: "/Pedidos", label: "Pedidos", shortLabel: "Pedidos", funcao: ["Admin", ""], icon: "🛒" },
    { path: "/Cadastro", label: "Cadastros", shortLabel: "Cadastros", funcao: ["Admin", "editor"], icon: "📝" },
    {
      path: "/Dashboard",
      label: "Relatórios",
      shortLabel: "Relatórios",
      funcao: ["", "editor", "analista"],
      icon: "📊",
    },
    { path: "/home-retirada", label: "Retirada", shortLabel: "Retirada", funcao: ["Admin", "Cozinha"], icon: "📦" },
    { path: "/Verificacao_Usuario", label: "Usuários", shortLabel: "Usuários", funcao: ["Admin"], icon: "👥" },
    { path: "/Estoque", label: "Estoque", shortLabel: "Estoque", funcao: ["Admin", "Cozinha"], icon: "📋" },
    {
      path: "/cardapio",
      label: "Cardápio",
      shortLabel: "Cardápio",
      funcao: ["Admin", "Cozinha", "Nutricionista"],
      icon: "🍽️",
    },
    {
      path: "/manutencao-home",
      label: "Manutenção",
      shortLabel: "Manutenção",
      funcao: ["Admin", "tecnico"],
      icon: "🔧",
    },
    {
      path: "https://drive.google.com/drive/folders/1QdXTwo0zggBmHP1MBih6IMVCQ-WaoBBa?usp=sharing",
      label: "Docs",
      shortLabel: "Docs",
      funcao: ["Admin"],
      external: true,
      icon: "📚",
    },
  ]

  const getRoleColor = (role) => {
    const colors = {
      Admin: "bg-gradient-to-r from-purple-500 to-pink-500",
      Cozinha: "bg-gradient-to-r from-orange-500 to-red-500",
      editor: "bg-gradient-to-r from-blue-500 to-cyan-500",
      analista: "bg-gradient-to-r from-green-500 to-emerald-500",
      tecnico: "bg-gradient-to-r from-gray-500 to-slate-500",
      Nutricionista: "bg-gradient-to-r from-yellow-500 to-orange-500",
    }
    return colors[role] || "bg-gradient-to-r from-gray-500 to-gray-600"
  }

  const renderLinks = (isMobile = false) => {
    if (loading) {
      return (
        <div className={`flex ${isMobile ? "flex-col space-y-2" : "space-x-2"}`}>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className={`${isMobile ? "h-8 w-32" : "h-6 w-16"} bg-white/20`} />
          ))}
        </div>
      )
    }

    if (!userRole) {
      return (
        <div className="flex items-center">
          <Badge variant="outline" className="border-red-300 text-red-600 bg-red-50 text-xs py-0">
            Não autenticado
          </Badge>
        </div>
      )
    }

    const filteredLinks = menuLinks.filter((link) => link.funcao.includes(userRole))

    return (
      <div className={`flex ${isMobile ? "flex-col space-y-1" : "items-center flex-wrap gap-1"}`}>
        {filteredLinks.map((link, index) => (
          <div key={index} className="group relative">
            {link.external ? (
              <a
                href={link.path}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center space-x-1.5 px-2 py-1.5 rounded-md transition-all duration-200 ${
                  isMobile
                    ? "text-white hover:bg-white/20 w-full justify-start text-sm"
                    : "text-gray-700 hover:text-purple-600 hover:bg-purple-50 text-xs"
                } group-hover:scale-105`}
                onClick={isMobile ? handleClick : undefined}
              >
                <span className={isMobile ? "text-base" : "text-sm"}>{link.icon}</span>
                <span className="font-medium whitespace-nowrap">{isMobile ? link.label : link.shortLabel}</span>
                {link.external && <ExternalLink className="h-2.5 w-2.5 opacity-60" />}
              </a>
            ) : (
              <Link
                to={link.path}
                className={`flex items-center space-x-1.5 px-2 py-1.5 rounded-md transition-all duration-200 ${
                  isMobile
                    ? "text-white hover:bg-white/20 w-full justify-start text-sm"
                    : "text-gray-700 hover:text-purple-600 hover:bg-purple-50 text-xs"
                } group-hover:scale-105`}
                onClick={isMobile ? handleClick : undefined}
              >
                <span className={isMobile ? "text-base" : "text-sm"}>{link.icon}</span>
                <span className="font-medium whitespace-nowrap">{isMobile ? link.label : link.shortLabel}</span>
              </Link>
            )}
            {!isMobile && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></div>
            )}
          </div>
        ))}
      </div>
    )
  }

    return (
      <>
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50" : "bg-white shadow-md"
          }`}
        >
          <div className="flex items-center justify-between h-34 px-3 sm:px-4 lg:px-6 max-w-full mx-auto">
            {/* Logo Section */}
            <div className="flex items-center space-x-3 min-w-0">
              <div className="relative group flex-shrink-0">
                <br />
                <img
                  src="/Reciclar_30anos_Blocado_Positivo.png"
                  alt="Logo-Instituto-Reciclar"
                  className="w-32 sm:w-36 md:w-20 lg:w-36 transition-transform duration-300 group-hover:scale-105"
                />
                <br />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-pink-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Role Badge - Hidden on small screens */}
              {userRole && !loading && (
                <Badge className={`${getRoleColor(userRole)} text-white border-0 shadow-sm text-xs py-0 px-2 hidden md:flex`}>
                  {userRole}
                </Badge>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2 flex-1 justify-center max-w-4xl overflow-hidden">
              <div className="flex items-center justify-center w-full">{renderLinks()}</div>
            </div>

            {/* User Profile & Mobile Menu */}
            <div className="flex items-center space-x-2">
              {/* User Profile - Desktop */}
              <Link to="/Meu_Perfil" className="group relative hidden lg:block">
                <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-purple-500 transition-all duration-300">
                  <AvatarImage src="/user.png" alt="User" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
              </Link>

              {/* Role Badge Mobile */}
              {userRole && !loading && (
                <Badge
                  className={`${getRoleColor(userRole)} text-white border-0 shadow-sm text-xs py-0 px-1.5 lg:hidden`}
                >
                  {userRole}
                </Badge>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden relative z-50 h-8 w-8 hover:bg-purple-50"
                onClick={handleClick}
                aria-label="Menu"
              >
                <div className="relative">
                  <Menu
                    className={`h-5 w-5 transition-all duration-300 ${
                      click ? "rotate-180 opacity-0" : "rotate-0 opacity-100"
                    }`}
                  />
                  <X
                    className={`h-5 w-5 absolute top-0 left-0 transition-all duration-300 ${
                      click ? "rotate-0 opacity-100" : "rotate-180 opacity-0"
                    }`}
                  />
                </div>
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
            click ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={handleClick}
        />

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-72 max-w-[85vw] z-40 transition-transform duration-300 ease-out lg:hidden ${
            click ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full bg-blue backdrop-blur-xl text-black-800">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <div className="flex items-center space-x-2">
                <Avatar className="h-10 w-10 ring-2 ring-white/30">
                  <AvatarImage src="/myUser.svg" alt="User" />
                  <AvatarFallback className="bg-white/20 text-white">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-semibold text-sm">Meu Perfil</p>
                  {userRole && <Badge className="bg-white/20 text-white border-white/30 text-xs py-0">{userRole}</Badge>}
                </div>
              </div>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex flex-col p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-120px)]">
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                  <span className="ml-2 text-white text-sm">Carregando...</span>
                </div>
              ) : (
                <>
                  {renderLinks(true)}

                  {/* Profile Link */}
                  <div className="pt-3 border-t border-white/20 mt-3">
                    <Link
                      to="/Meu_Perfil"
                      onClick={handleClick}
                      className="flex items-center space-x-2 px-2 py-2 rounded-md text-white hover:bg-white/20 transition-all duration-200 w-full text-sm"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/myUser.svg" alt="User" />
                        <AvatarFallback className="bg-white/20 text-white text-xs">
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">Meu Perfil</span>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/20 backdrop-blur-sm">
              <p className="text-white/70 text-xs text-center">Instituto Reciclar © 2024</p>
            </div>
          </div>
        </div>

        {/* Spacer for fixed header */}
        <div className="h-14"></div>
      </>
    )
  }
