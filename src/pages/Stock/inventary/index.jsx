import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import * as XLSX from "xlsx"
import { Search, Calendar, Package, Filter, FileSpreadsheet, Clock, Wifi, WifiOff, TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight } from "lucide-react"
import { db } from "../../../../firebase"
import { ref, onValue, off } from "firebase/database"

const VisualizarInventarioFinal = () => {
  const [inventarioData, setInventarioData] = useState({})
  const [busca, setBusca] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [isExporting, setIsExporting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [connectionError, setConnectionError] = useState(null)
  const itensPorPagina = 20

  useEffect(() => {
    setIsLoading(true); setConnectionError(null);
    const inventarioRef = ref(db, "inventario")
    const unsubscribe = onValue(
      inventarioRef,
      (snapshot) => {
        try {
          const data = snapshot.val()
          if (data) {setInventarioData(data); setConnectionError(null)} 
        else {setInventarioData({}); setConnectionError("Nenhum dado encontrado no banco de dados")}
        } catch (error) {
          console.error("Erro ao processar dados:", error)
          setConnectionError("Erro ao processar dados do Firebase")
        } finally {setIsLoading(false)}
      },
      (error) => {console.error("Erro ao conectar com Firebase:", error); setConnectionError(`Erro de conexão: ${error.message}`); setIsLoading(false);},
    )
    return () => {off(inventarioRef, "value", unsubscribe)}}, [])

  // Intervalo rápido de datas
  const setIntervaloRapido = (tipo) => {
    const hoje = new Date()
    let inicio, fim

    switch (tipo) {
      case "hoje": inicio = fim = hoje.toISOString().split("T")[0]; break
      case "7dias":
        inicio = new Date(hoje)
        inicio.setDate(hoje.getDate() - 6)
        fim = hoje; 
        inicio = inicio.toISOString().split("T")[0]; fim = fim.toISOString().split("T")[0]
        break
      case "30dias":
        inicio = new Date(hoje)
        inicio.setDate(hoje.getDate() - 29)
        fim = hoje
        inicio = inicio.toISOString().split("T")[0]
        fim = fim.toISOString().split("T")[0]
        break
      case "mesAtual":
        inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split("T")[0]
        fim = hoje.toISOString().split("T")[0]
        break
      default: inicio = fim = ""
    }

    setStartDate(inicio); setEndDate(fim); setPaginaAtual(1)
  }

  // Formatar datas
  const formatDate = (date) => {
    if (!date) return "--"
    const d = new Date(date)
    if (isNaN(d.getTime())) return "--"
    const day = String(d.getUTCDate()).padStart(2, "0")
    const month = String(d.getUTCMonth() + 1).padStart(2, "0")
    const year = d.getUTCFullYear()
    return `${day}/${month}/${year}`
  }

  // Filtrar datas dentro do intervalo
  const datasFiltradas = Object.keys(inventarioData)
    .filter((data) => {
      if (!startDate && !endDate) return true
      if (startDate && data < startDate) return false
      if (endDate && data > endDate) return false
      return true
    }).sort((a, b) => b.localeCompare(a))

  // Filtrar itens por busca
  const itensFiltrados = datasFiltradas.flatMap((data) =>
    Object.values(inventarioData[data] || {}).filter((item) => item.sku.toLowerCase().includes(busca.toLowerCase()) || item.nome.toLowerCase().includes(busca.toLowerCase()),).map((item) => ({ ...item, dia: data })),)
  const totalPaginas = Math.ceil(itensFiltrados.length / itensPorPagina)
  const itensPagina = itensFiltrados.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina)

  // Exportar Excel
  const exportarParaExcel = async () => {
    if (itensFiltrados.length === 0) return
    setIsExporting(true)
    try {
      const dias = [...new Set(itensFiltrados.map((item) => item.dia))]
      const workbook = XLSX.utils.book_new()
      dias.forEach((dia) => {
        const itemsDia = itensFiltrados.filter((item) => item.dia === dia)
        // Incluindo o campo peso
        const worksheet = XLSX.utils.json_to_sheet(itemsDia.map(({ dia, peso, ...rest }) => ({...rest, Peso: peso || "",})))
        XLSX.utils.book_append_sheet(workbook, worksheet, dia)
      })
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
      const data = new Blob([excelBuffer], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",})
      const url = window.URL.createObjectURL(data)
      const link = document.createElement("a")
      link.href = url; link.download = `inventario_completo_${new Date().toISOString().split("T")[0]}.xlsx`
      document.body.appendChild(link); link.click(); document.body.removeChild(link); window.URL.revokeObjectURL(url)
    } catch (error) {console.error("Erro ao exportar:", error)} 
    finally {setIsExporting(false);}
  }

  const mudarPagina = (num) => {if (num < 1 || num > totalPaginas) return; setPaginaAtual(num);}
  const getStockStatus = (atual, anterior) => {
    const diff = atual - (anterior || 0)
    if (diff > 0)
    return {status: "increase", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: TrendingUp, text: "Aumento",}
    if (diff < 0)
    return {status: "decrease", color: "bg-red-50 text-red-700 border-red-200", icon: TrendingDown, text: "Redução",}
    return {status: "stable", color: "bg-gray-50 text-gray-700 border-gray-200", icon: Minus, text: "Estável",}
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardContent className="pt-8 pb-8 flex flex-col items-center gap-6">
            <div className="relative">
              <div className="animate-spin h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full" />
              <Package className="absolute inset-0 m-auto h-5 w-5 text-blue-600" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg text-slate-900">Carregando inventário...</h3>
              <p className="text-sm text-slate-600">Conectando com o banco de dados</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (connectionError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardContent className="pt-8 pb-8 flex flex-col items-center gap-6">
            <div className="p-4 bg-red-50 rounded-full"> <WifiOff className="h-8 w-8 text-red-600" /></div>
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-lg text-slate-900">Erro de Conexão</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{connectionError}</p>
            </div>
            <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white px-6">Tentar Novamente</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl"><Package className="h-8 w-8 text-blue-600" /></div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">Inventário Final</h1>
              <p className="text-slate-600">Visualização completa do inventário com filtros avançados</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-200">
            <Wifi className="h-4 w-4" /><span className="text-sm font-medium">Conectado ao Firebase</span>
          </div>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-4 bg-slate-50/50">
          <CardTitle className="flex items-center gap-3 text-xl text-slate-900"><div className="p-2 bg-slate-100 rounded-lg"><Filter className="h-5 w-5 text-slate-700" /></div>Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Filtros Rápidos</h4>
            <div className="flex flex-wrap gap-3">
              {[
                { key: "hoje", label: "Hoje", icon: Clock },
                { key: "7dias", label: "Últimos 7 dias", icon: Calendar },
                { key: "30dias", label: "Últimos 30 dias", icon: Calendar },
                { key: "mesAtual", label: "Mês Atual", icon: Calendar },
              ].map(({ key, label, icon: Icon }) => (
                <Button key={key} variant="outline" size="sm" onClick={() => setIntervaloRapido(key)}
                  className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200"><Icon className="h-4 w-4 mr-2" />{label}</Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><Calendar className="h-4 w-4" /> Data Inicial</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><Calendar className="h-4 w-4" /> Data Final </label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><Search className="h-4 w-4" /> Buscar Produto</label>
              <Input placeholder="SKU ou nome do produto..." value={busca} onChange={(e) => { setBusca(e.target.value); setPaginaAtual(1)}}
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Exportar Dados</label>
              <Button onClick={exportarParaExcel} disabled={itensFiltrados.length === 0 || isExporting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                {isExporting ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />Exportando...</div>
                ) : (<div className="flex items-center"><FileSpreadsheet className="h-4 w-4 mr-2" /> Exportar Excel</div>)}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-slate-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600">Mostrando <span className="font-semibold text-slate-900">{itensPagina.length}</span> de{" "}
          <span className="font-semibold text-slate-900">{itensFiltrados.length}</span> itens
          </div>
          {(startDate || endDate || busca) && (<Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">Filtros ativos</Badge>)}
        </div>
        {totalPaginas > 1 && (<div className="text-sm text-slate-600">Página {paginaAtual} de {totalPaginas}</div>)}
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-0">
          {itensPagina.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 bg-slate-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhum item encontrado</h3>
              <p className="text-slate-600">Tente ajustar os filtros ou termos de busca</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {itensPagina.map((item, idx) => {
                const stockStatus = getStockStatus(item.quantidade, item.estoqueAnterior)
                const StatusIcon = stockStatus.icon

                return (
                  <div key={idx} className="p-6 hover:bg-slate-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg text-slate-900 mb-1">{item.nome} {''} {item.peso}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span className="bg-slate-100 px-2 py-1 rounded font-mono">SKU: {item.sku}</span>
                            <span>Data: {formatDate(item.dia)}</span>
                            {item.validade && <span>Validade: {formatDate(item.validade)}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-900 mb-1">{item.quantidade}</div>
                          <div className="text-sm text-slate-600">em estoque</div>
                        </div>
                        {item.estoqueAnterior !== undefined && (<Badge className={`${stockStatus.color} border flex items-center gap-1 px-3 py-1`}><StatusIcon className="h-3 w-3" />{stockStatus.text}</Badge>)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button onClick={() => mudarPagina(paginaAtual - 1)} disabled={paginaAtual === 1} variant="outline" size="sm" className="hover:bg-slate-50"><ChevronLeft className="h-4 w-4 mr-1" />Anterior</Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
              let pageNum
              if (totalPaginas <= 5) {pageNum = i + 1} 
              else if (paginaAtual <= 3) {pageNum = i + 1} 
              else if (paginaAtual >= totalPaginas - 2) {pageNum = totalPaginas - 4 + i} 
              else {pageNum = paginaAtual - 2 + i}

              return (
                <Button key={pageNum} onClick={() => mudarPagina(pageNum)}
                  variant={paginaAtual === pageNum ? "default" : "outline"} size="sm" className={paginaAtual === pageNum ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-slate-50"}>{pageNum}</Button>
              )
            })}
          </div>
          <Button onClick={() => mudarPagina(paginaAtual + 1)} disabled={paginaAtual === totalPaginas} variant="outline" size="sm" className="hover:bg-slate-50">Próxima<ChevronRight className="h-4 w-4 ml-1" /></Button>
        </div>
      )}
    </div>
  )
}

export default VisualizarInventarioFinal