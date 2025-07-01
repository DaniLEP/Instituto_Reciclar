import { useEffect, useState } from "react"
import { ref, onValue, update } from "firebase/database"
import { db } from "../../../../../firebase"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input/index"
import { Button } from "@/components/ui/Button/button" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { saveAs } from "file-saver"
import * as XLSX from "xlsx"
import { motion } from "framer-motion"
import {ArrowLeft,Download, Filter, FilterX, Calendar, User, FileText, Edit3, Search,  Clock} from "lucide-react"

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]

const ConsultaCardapioAlmoco = () => {
  const [cardapios, setCardapios] = useState([])
  const [filtroInicio, setFiltroInicio] = useState("")
  const [filtroFim, setFiltroFim] = useState("")
  const [celulaEditando, setCelulaEditando] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const cardapioRef = ref(db, "cardapiosAprovadosPorTipo/Almoco")
    onValue(cardapioRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const lista = Object.entries(data).map(([key, value]) => ({ id: key, ...value, })); setCardapios(lista)} 
      else {setCardapios([])};
      setLoading(false)
    })
  }, [])

  const filtrarCardapios = () => {
    return cardapios.filter((item) => {
      const dataInicio = new Date(item.periodo?.inicio)
      const dataFim = new Date(item.periodo?.fim)
      const filtroIni = filtroInicio ? new Date(filtroInicio) : null
      const filtroFi = filtroFim ? new Date(filtroFim) : null
      if (isNaN(dataInicio) || isNaN(dataFim)) return false
      const matchesPeriodo = (!filtroIni || dataInicio >= filtroIni) && (!filtroFi || dataFim <= filtroFi)

      const matchesSearch = !searchTerm || item.id.toLowerCase().includes(searchTerm.toLowerCase()) || Object.values(item.composicoes || {}).some((dados) => dados.nutricionista?.nome?.toLowerCase().includes(searchTerm.toLowerCase()),)
      return matchesPeriodo && matchesSearch
    })
  }

  const exportarExcel = () => {
    const dadosExportar = filtrarCardapios().flatMap((cardapio) =>
      Object.entries(cardapio.composicoes || {}).flatMap(([semana, dados]) =>
        Object.entries(dados.cardapio || {}).map(([secao, dias]) => ({ID: cardapio.id, Semana: semana, Nutricionista: dados.nutricionista?.nome || "", CRN3: dados.nutricionista?.crn3 || "", Início: cardapio.periodo?.inicio || "", Fim: cardapio.periodo?.fim || "", Seção: secao, ...dias,
        })),
      ),
    )

    const worksheet = XLSX.utils.json_to_sheet(dadosExportar)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cardápio")
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" })
    saveAs(blob, "cardapioAlmoco.xlsx")}
  const limparConsulta = () => {setFiltroInicio(""); setFiltroFim(""); setSearchTerm("");}
  const handleDoubleClick = (cardapioId, semana, secao, dia, valorAtual) => {setCelulaEditando({ cardapioId, semana, secao, dia, valor: valorAtual })}

  const handleBlur = async () => {
    const { cardapioId, semana, secao, dia, valor } = celulaEditando
    const caminho = `cardapiosAprovadosPorTipo/Almoco/${cardapioId}/composicoes/${semana}/cardapio/${secao}/${dia}`
    const objetoAtualizacao = {[caminho]: String(valor),}
    await update(ref(db), objetoAtualizacao)
    setCelulaEditando({})
  }

  const cardapiosFiltrados = filtrarCardapios()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando cardápios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-between mb-8">
          <Button onClick={() => navigate(-1)} variant="outline" size="sm" className="bg-white hover:bg-gray-50"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Consulta de Cardápios - Almoço</h1>
            <Badge variant="secondary" className="text-sm"><FileText className="h-3 w-3 mr-1" />{cardapios.length} cardápios cadastrados</Badge>
          </div>
          <div className="w-20" />
        </motion.div>

        {/* Filtros */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-lg"><Filter className="h-5 w-5 mr-2" />Filtros de Consulta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="ID ou nutricionista..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                  <Input type="date" value={filtroInicio} onChange={(e) => setFiltroInicio(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                  <Input type="date" value={filtroFim} onChange={(e) => setFiltroFim(e.target.value)} /></div>
                <div className="flex items-end"><Button onClick={limparConsulta} variant="outline" className="w-full"><FilterX className="h-4 w-4 mr-2" /> Limpar </Button></div>
                <div className="flex items-end"><Button onClick={exportarExcel} className="w-full bg-green-600 hover:bg-green-700" disabled={cardapiosFiltrados.length === 0}><Download className="h-4 w-4 mr-2" />Excel</Button></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resultados */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">{cardapiosFiltrados.length === 0 ? "Nenhum cardápio encontrado" : `${cardapiosFiltrados.length} cardápio(s) encontrado(s)`}</p>
          {cardapiosFiltrados.length > 0 && (<Badge variant="outline" className="text-xs"> <Edit3 className="h-3 w-3 mr-1" /> Duplo clique para editar</Badge>)}
        </div>
        {/* Lista de Cardápios */}
        <div className="space-y-6">
          {cardapiosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cardápio encontrado</h3>
                <p className="text-gray-500">Tente ajustar os filtros ou verificar se há cardápios cadastrados.</p>
              </CardContent>
            </Card>
          ) : (
            cardapiosFiltrados.map((item, idx) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center text-lg"><FileText className="h-5 w-5 mr-2 text-blue-600" />Cardápio {item.tipo.slice(-8)}</CardTitle>
                        <div className="flex items-center mt-2 text-sm text-gray-600"><Calendar className="h-4 w-4 mr-1" />{item.periodo?.inicio} até {item.periodo?.fim}</div>
                      </div>
                      <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />{Object.keys(item.composicoes || {}).length} semana(s)</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    {Object.entries(item.composicoes || {}).map(([semana, dados], i) => (
                      <div key={semana} className="mb-8 last:mb-0">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">Semana {i + 1}</h3>
                          <div className="flex items-center text-sm text-gray-600"><User className="h-4 w-4 mr-1" />{dados.nutricionista?.nome} | CRN3: {dados.nutricionista?.crn3}</div>
                        </div>
                        <div className="overflow-x-auto">
                          <div className="min-w-[800px]">
                            <div className="grid grid-cols-6 gap-2 mb-2">
                              <div className="font-semibold text-sm text-gray-700 p-3 bg-gray-50 rounded-md">Composição</div>
                              {diasSemana.map((dia) => (<div key={dia} className="font-semibold text-sm text-gray-700 p-3 bg-blue-50 rounded-md text-center">{dia}</div>))}
                            </div>

                            {Object.entries(dados.cardapio || {}).map(([secao, dias], index) => (
                              <div key={index} className="grid grid-cols-6 gap-2 mb-2">
                                <div className="bg-gray-50 p-3 rounded-md font-medium text-sm flex items-center">{secao}</div>
                                {diasSemana.map((dia) => (
                                  <div key={dia} className="p-2 border rounded-md cursor-pointer hover:bg-yellow-50 transition-colors min-h-[40px] flex items-center" onDoubleClick={() => handleDoubleClick(item.id, semana, secao, dia, dias[dia])}>
                                    {celulaEditando.cardapioId === item.id && celulaEditando.semana === semana && celulaEditando.secao === secao && celulaEditando.dia === dia ? (
                                      <Input className="h-8 text-sm" value={celulaEditando.valor} onChange={(e) => setCelulaEditando({ ...celulaEditando, valor: e.target.value })}onBlur={handleBlur}
                                        onKeyDown={(e) => {if (e.key === "Enter") handleBlur() }} autoFocus/>
                                    ) : (<span className="text-sm">{dias[dia] || "-"}</span>)}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                        {i < Object.keys(item.composicoes || {}).length - 1 && <Separator className="mt-6" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ConsultaCardapioAlmoco
