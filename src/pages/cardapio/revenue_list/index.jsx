import { useEffect, useState } from "react"
import { getDatabase, ref, get, update } from "firebase/database"
import { useNavigate } from "react-router-dom"
import * as XLSX from "xlsx"
import { Input } from "@/components/ui/input/index"
import { Button } from "@/components/ui/Button/button" 
import { Label } from "@/components/ui/label/index"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/index"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Download, Filter, RotateCcw, Edit3, Coffee, UtensilsCrossed, Cookie, ChefHat, Users, UserCheck, Clock, Trash2, FileText, Search, TableIcon, Grid3X3 } from "lucide-react"
import { getApps, initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.appspot.com",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const database = getDatabase(app)

export default function ExibirRefeicoes() {
  const [refeicoes, setRefeicoes] = useState([])
  const [filtroInicio, setFiltroInicio] = useState("")
  const [filtroFim, setFiltroFim] = useState("")
  const [valorEditado, setValorEditado] = useState("")
  const [editando, setEditando] = useState(null)
  const [viewMode, setViewMode] = useState("cards") // 'cards' or 'table'
  const navigate = useNavigate()

  const formatDate = (timestamp) => {
    if (!timestamp) return "Data inválida"
    const date = typeof timestamp === "string" ? new Date(Date.parse(timestamp)) : new Date(timestamp)
    if (isNaN(date.getTime())) return "Data inválida"
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
    const day = String(localDate.getDate()).padStart(2, "0")
    const month = String(localDate.getMonth() + 1).padStart(2, "0")
    const year = localDate.getFullYear()
    return `${day}/${month}/${year}`
  }

  useEffect(() => {
    const refeicoesRef = ref(database, "refeicoesServidas")
    get(refeicoesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = []
        snapshot.forEach((child) => {const item = child.val(); data.push({key: child.key, dataRefeicao: formatDate(item.dataRefeicao), dataRefeicaoObj: new Date(item.dataRefeicao), ...item,})}); setRefeicoes(data)}
    })
  }, [])

  const handleDoubleClick = (id, field, value) => {setEditando({ id, field }); setValorEditado(value);}

  const handleChange = (e) => setValorEditado(e.target.value)

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const refeicaoRef = ref(database, `refeicoesServidas/${editando.id}`)
      update(refeicaoRef, { [editando.field]: valorEditado }).then(() => {setRefeicoes((prev) => prev.map((item) => (item.key === editando.id ? { ...item, [editando.field]: valorEditado } : item)),); setEditando(null);})
    }
  }

  const handleBlur = () => {const refeicaoRef = ref(database, `refeicoesServidas/${editando.id}`); update(refeicaoRef, { [editando.field]: valorEditado }).then(() => setEditando(null))}
  const resetTime = (date) => {date.setHours(0, 0, 0, 0); return date}
  const filtrarRefeicoes = () => {
    const inicio = filtroInicio ? resetTime(new Date(filtroInicio)) : null
    const fim = filtroFim ? resetTime(new Date(filtroFim)) : null
    setRefeicoes((prev) => prev.filter(({ dataRefeicaoObj }) => { const data = resetTime(new Date(dataRefeicaoObj)); return (!inicio || data >= inicio) && (!fim || data <= fim)}),)
  }

  const limparFiltros = () => { setFiltroInicio(""); setFiltroFim("");
    const refeicoesRef = ref(database, "refeicoesServidas")
    get(refeicoesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = []; snapshot.forEach((child) => {
          const item = child.val();
          data.push({key: child.key, dataRefeicao: formatDate(item.dataRefeicao), dataRefeicaoObj: new Date(item.dataRefeicao), ...item,})
        })
        setRefeicoes(data);
      }
    })
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(refeicoes)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Refeições")
    XLSX.writeFile(workbook, "Refeicoes.xlsx")
  }

  const EditableField = ({ value, onDoubleClick, isEditing, onChange, onKeyDown, onBlur }) => {
    if (isEditing) {return (<Input type="text" value={valorEditado} onChange={onChange} onKeyDown={onKeyDown} onBlur={onBlur} autoFocus className="w-full min-w-[100px]" />)}
    return (<div className="cursor-pointer hover:bg-gray-100 p-2 rounded min-h-[40px] flex items-center group" onDoubleClick={onDoubleClick}><span className="flex-1">{value || "-"}</span><Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-50 ml-2" /></div>)
  }

  const MealCard = ({ refeicao }) => {
    const mealTypes = [
      { id: "cafe", label: "Café da Manhã", icon: Coffee, color: "bg-amber-50 border-amber-200" },
      { id: "almoco", label: "Almoço", icon: UtensilsCrossed, color: "bg-green-50 border-green-200" },
      { id: "lanche", label: "Lanche", icon: Cookie, color: "bg-purple-50 border-purple-200" },
      { id: "outras", label: "Outras Refeições", icon: ChefHat, color: "bg-blue-50 border-blue-200" },
    ]

    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> {refeicao.dataRefeicao}</CardTitle>
            <Badge variant="outline"> Total:{" "} {(refeicao.cafeTotalQtd || 0) +(refeicao.almocoTotalQtd || 0) + (refeicao.lancheTotalQtd || 0) + (refeicao.outrasTotalQtd || 0)}{" "} porções</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cafe" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {mealTypes.map(({ id, icon: Icon }) => (
                <TabsTrigger key={id} value={id} className="flex items-center gap-1">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline"> {id === "cafe" ? "Café" : id === "almoco" ? "Almoço" : id === "lanche" ? "Lanche" : "Outras"}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {mealTypes.map(({ id, label, color }) => (
              <TabsContent key={id} value={id} className="mt-4">
                <div className={`p-4 rounded-lg border ${color}`}>
                  <h4 className="font-semibold mb-3">{label}</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Descrição:</Label>
                      <EditableField value={refeicao[`${id}Descricao`]} onDoubleClick={() => handleDoubleClick(refeicao.key, `${id}Descricao`, refeicao[`${id}Descricao`])}
                        isEditing={editando?.id === refeicao.key && editando.field === `${id}Descricao`} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur} />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <Label className="text-sm font-medium flex items-center gap-1"><Users className="w-3 h-3" />Total</Label>
                        <EditableField value={refeicao[`${id}TotalQtd`]} onDoubleClick={() => handleDoubleClick(refeicao.key, `${id}TotalQtd`, refeicao[`${id}TotalQtd`])}
                          isEditing={editando?.id === refeicao.key && editando.field === `${id}TotalQtd`} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur} />
                      </div>

                      <div>
                        <Label className="text-sm font-medium flex items-center gap-1"><UserCheck className="w-3 h-3" /> Funcionários</Label>
                        <EditableField value={refeicao[`${id}FuncionariosQtd`]} onDoubleClick={() => handleDoubleClick(refeicao.key, `${id}FuncionariosQtd`, refeicao[`${id}FuncionariosQtd`])}
                          isEditing={editando?.id === refeicao.key && editando.field === `${id}FuncionariosQtd`} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur}/>
                      </div>

                      <div>
                        <Label className="text-sm font-medium flex items-center gap-1"><Clock className="w-3 h-3" />Jovens Manhã</Label>
                        <EditableField value={refeicao[`${id}JovensQtd`]} onDoubleClick={() => handleDoubleClick(refeicao.key, `${id}JovensQtd`, refeicao[`${id}JovensQtd`])}
                          isEditing={editando?.id === refeicao.key && editando.field === `${id}JovensQtd`} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur} />
                      </div>

                      {refeicao[`${id}JovensTardeQtd`] !== undefined && (
                        <div>
                          <Label className="text-sm font-medium flex items-center gap-1"><Clock className="w-3 h-3" />Jovens Tarde </Label>
                          <EditableField value={refeicao[`${id}JovensTardeQtd`]} onDoubleClick={() => handleDoubleClick(refeicao.key, `${id}JovensTardeQtd`, refeicao[`${id}JovensTardeQtd`])}
                            isEditing={editando?.id === refeicao.key && editando.field === `${id}JovensTardeQtd`} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium flex items-center gap-1 mb-2"><Trash2 className="w-3 h-3" /> Sobras</Label>
              <EditableField value={refeicao.sobrasDescricao} onDoubleClick={() => handleDoubleClick(refeicao.key, "sobrasDescricao", refeicao.sobrasDescricao)}
                isEditing={editando?.id === refeicao.key && editando.field === "sobrasDescricao"} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur} />
            </div>
            <div>
              <Label className="text-sm font-medium flex items-center gap-1 mb-2"><FileText className="w-3 h-3" />Observações</Label>
              <EditableField value={refeicao.observacaoDescricao} onDoubleClick={() =>handleDoubleClick(refeicao.key, "observacaoDescricao", refeicao.observacaoDescricao)}
                isEditing={editando?.id === refeicao.key && editando.field === "observacaoDescricao"} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur} />
            </div>
          </div>
          <div className="mt-4">
            <Label className="text-sm font-medium flex items-center gap-1 mb-2">
              <Trash2 className="w-3 h-3 text-red-600" />Desperdício (kg) </Label>
            <EditableField value={refeicao.desperdicioQtd} onDoubleClick={() => handleDoubleClick(refeicao.key, "desperdicioQtd", refeicao.desperdicioQtd)}
              isEditing={editando?.id === refeicao.key && editando.field === "desperdicioQtd"} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur} />
          </div>
        </CardContent>
      </Card>
    )
  }

  const headers = ["Data Refeição", "Café Descrição", "Café Total (kg)", "Café Funcionários","Café Turma Manhã", "Almoço Descrição", "Almoço Total (kg)", "Almoço Funcionários", 
    "Almoço Turma Manhã", "Almoço Turma Tarde", "Lanche Descrição", "Lanche Total (kg)", "Lanche Funcionários", "Lanche Turma Tarde", "Outras Descrição", "Outras Ref. Total (kg)", 
    "Outras Ref. Funcionários", "Outras Ref. Turma Manhã", "Outras Ref. Turma Tarde", "Sobras", "Observação", "Desperdícios (kg)",]

  const fields = ["dataRefeicao", "cafeDescricao", "cafeTotalQtd", "cafeFuncionariosQtd", "cafeJovensQtd", "almocoDescricao", "almocoTotalQtd", "almocoFuncionariosQtd", "almocoJovensQtd", 
    "almocoJovensTardeQtd", "lancheDescricao", "lancheTotalQtd", "lancheFuncionariosQtd", "lancheJovensQtd", "outrasDescricao", "outrasTotalQtd", "outrasFuncionariosQtd", "outrasJovensQtd", 
    "outrasJovensTardeQtd", "sobrasDescricao", "observacaoDescricao", "desperdicioQtd" ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button onClick={() => navigate(-1)} variant="outline" className="hover:bg-slate-100"><ArrowLeft className="w-4 h-4 mr-2" />Voltar </Button>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <UtensilsCrossed className="w-8 h-8 text-orange-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Refeições Cadastradas</h1>
              <p className="text-gray-600">Visualize e edite os registros de refeições servidas</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader><CardTitle className="flex items-center gap-2"> <Filter className="w-5 h-5" /> Filtros e Ações </CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 max-w-xs">
                <Label className="flex items-center gap-2 mb-2"> <Calendar className="w-4 h-4" /> Data Início </Label>
                <Input type="date" value={filtroInicio} onChange={(e) => setFiltroInicio(e.target.value)}className="h-10" />
              </div>
              <div className="flex-1 max-w-xs">
                <Label className="flex items-center gap-2 mb-2"><Calendar className="w-4 h-4" />Data Fim</Label>
                <Input type="date" value={filtroFim} onChange={(e) => setFiltroFim(e.target.value)} className="h-10" />
              </div>
              <div className="flex gap-3">
                <Button onClick={filtrarRefeicoes} className="h-10"><Search className="w-4 h-4 mr-2" />Filtrar</Button>
                <Button onClick={limparFiltros} variant="outline" className="h-10"><RotateCcw className="w-4 h-4 mr-2" />Limpar</Button>
                <Button onClick={exportToExcel} variant="outline" className="h-10"><Download className="w-4 h-4 mr-2" />Excel</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button variant={viewMode === "cards" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("cards")} className="flex items-center gap-2"><Grid3X3 className="w-4 h-4" />Cards</Button>
            <Button variant={viewMode === "table" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("table")} className="flex items-center gap-2"><TableIcon className="w-4 h-4" />Tabela</Button>
          </div>
        </div>

        {/* Content */}
        {refeicoes.length === 0 ? (
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>Nenhuma refeição encontrada. Ajuste os filtros ou cadastre novas refeições.</AlertDescription>
          </Alert>
        ) : viewMode === "cards" ? (<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{refeicoes.map((refeicao) => (<MealCard key={refeicao.key} refeicao={refeicao} />))}</div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>{headers.map((header, i) => (<th key={i} className="px-4 py-3 text-left font-semibold text-gray-900 border-b whitespace-nowrap">{header}</th>))}</tr>
                  </thead>
                  <tbody>
                    {refeicoes.map((refeicao) => (
                      <tr key={refeicao.key} className="hover:bg-gray-50 border-b">
                        {fields.map((field) => (
                          <td key={field} className="px-4 py-2 border-r last:border-r-0 whitespace-nowrap">
                            {editando?.id === refeicao.key && editando.field === field ? (
                              <Input type="text" value={valorEditado} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur} autoFocus className="w-full min-w-[100px]" />
                            ) : (
                              <div className="cursor-pointer hover:bg-gray-100 p-1 rounded min-h-[32px] flex items-center" onDoubleClick={() => handleDoubleClick(refeicao.key, field, refeicao[field])}>
                                {field === "dataRefeicao" ? formatDate(refeicao[field]) : refeicao[field] || "-"}
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Instructions */}
        <Alert className="mt-6">
          <Edit3 className="h-4 w-4" /><AlertDescription>Dica: Clique duas vezes em qualquer campo para editá-lo. Pressione Enter para salvar ou clique fora do campo.</AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
