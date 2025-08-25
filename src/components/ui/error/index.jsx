"use client"

import { WifiOff, Home, RefreshCw, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function PaginaNaoEncontradaGoogleStyle() {
  const navigate = useNavigate()
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    setIsRetrying(true)
    // Simula um delay de retry
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRetrying(false)
    navigate("/Home")
  }

  const handleGoHome = () => {
    navigate("/")
  }

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4">
      <div className="bg-white shadow-xl rounded-3xl p-8 md:p-12 max-w-lg w-full text-center transform transition-all duration-300 hover:shadow-2xl hover:scale-105">
        {/* Ícone com animação */}
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-gradient-to-br from-red-100 to-red-50 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110">
            <WifiOff className="w-12 h-12 text-red-600 animate-pulse" />
          </div>
        </div>

        {/* Título melhorado */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 tracking-tight">Oops! Erro de Conexão</h1>

        {/* Descrição mais detalhada */}
        <p className="text-gray-600 mb-2 text-lg">Nenhum dado encontrado no banco de dados</p>
        <p className="text-gray-500 mb-8 text-sm">
          Verifique sua conexão com a internet ou tente novamente em alguns instantes.
        </p>

        {/* Botões de ação */}
        <div className="space-y-4">
          {/* Botão principal - Tentar Novamente */}
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Tentando novamente...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Tentar Novamente
              </>
            )}
          </button>

          {/* Botões secundários */}
          <div className="flex gap-3">
            <button
              onClick={handleGoBack}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>

            <button
              onClick={handleGoHome}
              className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Início
            </button>
          </div>
        </div>

        {/* Informação adicional */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">Código do erro: CONNECTION_ERROR_404</p>
        </div>
      </div>
    </div>
  )
}
