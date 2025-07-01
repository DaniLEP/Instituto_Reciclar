import { useEffect, useState } from "react"
import { db } from "../../../../../../firebase"
import { ref, onValue } from "firebase/database"
import { isWithinInterval, parseISO, format } from "date-fns"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import { Label } from "@/components/ui/label/index"
import { Button } from "@/components/ui/Button/button" 
import { Input } from "@/components/ui/input/index"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Download, Calendar, FileText, CheckCircle2, XCircle, AlertTriangle, Filter, ChefHat, Clock, BarChart3, Loader2 } from "lucide-react"

export default function ChecklistConsulta() {
  const [checklists, setChecklists] = useState([])
  const [filtered, setFiltered] = useState([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checklistRef = ref(db, "checklists")
    onValue(checklistRef, (snapshot) => {
      const data = snapshot.val();
      const lista = data ? Object.values(data).map((item) => ({ ...item, data: item.data })) : []; 
    setChecklists(lista); setFiltered(lista); setLoading(false); })}, 
  [])

  const formatDate = (timestamp) => {
    if (!timestamp) return "Data inválida"
    const date = typeof timestamp === "string" ? new Date(Date.parse(timestamp)) : new Date(timestamp);
    if (isNaN(date.getTime())) return "Data inválida";
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const day = String(localDate.getDate()).padStart(2, "0");
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const year = localDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleFilter = () => {if (!startDate || !endDate) return;
    const filteredData = checklists.filter((item) =>
      isWithinInterval(parseISO(item.data), {start: parseISO(startDate), end: parseISO(endDate),}),)
    setFiltered(filteredData);
  }

  const exportToExcel = () => {
    const rows = []
    filtered.forEach((entry) => {
      Object.entries(entry.checklist).forEach(([secao, itens]) => {
        Object.entries(itens).forEach(([item, info]) => {rows.push({Data: entry.data, Seção: secao, Item: item, Resposta: info.resposta, Observação: info.observacao || "",})})
      })
    })

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Checklists")
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" })
    saveAs(blob, `checklists_${format(new Date(), "yyyyMMdd")}.xlsx`)
  }

  // Calculate statistics
  const getStatistics = () => {
    let totalItems = 0
    let compliantItems = 0
    let nonCompliantItems = 0
    filtered.forEach((entry) => {
      Object.entries(entry.checklist).forEach(([, items]) => {
        Object.entries(items).forEach(([, info]) => {
          totalItems++
          if (info.resposta === "Sim") compliantItems++
          if (info.resposta === "Não") nonCompliantItems++
        })
      })
    })
    return { totalItems, compliantItems, nonCompliantItems };
  }

  const stats = getStatistics()
  const complianceRate = stats.totalItems > 0 ? (stats.compliantItems / stats.totalItems) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><BarChart3 className="w-6 h-6 text-blue-600" /></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Consulta de Checklists</h1>
              <p className="text-gray-600">Filtre e exporte seus checklists para análise detalhada</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total de Checklists</p>
                    <p className="text-2xl font-bold">{filtered.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3"><CheckCircle2 className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Itens Conformes</p>
                    <p className="text-2xl font-bold text-green-600">{stats.compliantItems}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3"><XCircle className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Não Conformes</p>
                    <p className="text-2xl font-bold text-red-600">{stats.nonCompliantItems}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3"><BarChart3 className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Taxa de Conformidade</p>
                    <p className="text-2xl font-bold text-blue-600">{complianceRate.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Filter Section */}
        <Card className="mb-8">
          <CardHeader><CardTitle className="flex items-center gap-2"><Filter className="w-5 h-5" /> Filtros e Exportação</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 max-w-xs">
                <Label htmlFor="startDate" className="flex items-center gap-2 mb-2"><Calendar className="w-4 h-4" />Data Início</Label>
                <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-10"/>
              </div>
              <div className="flex-1 max-w-xs">
                <Label htmlFor="endDate" className="flex items-center gap-2 mb-2"><Calendar className="w-4 h-4" />Data Fim</Label>
                <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-10" />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleFilter} className="h-10" disabled={!startDate || !endDate}><Search className="w-4 h-4 mr-2" />Filtrar</Button>
                <Button onClick={exportToExcel} variant="outline" className="h-10" disabled={filtered.length === 0}><Download className="w-4 h-4 mr-2" />Exportar Excel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Results Section */}
        <div className="space-y-6">
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Carregando checklists...</p>
              </CardContent>
            </Card>) : filtered.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{checklists.length === 0 ? "Nenhum checklist encontrado no sistema.": "Nenhum checklist encontrado para o intervalo selecionado. Ajuste as datas do filtro."}</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {filtered.map((entry, index) => (
                <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2"><ChefHat className="w-5 h-5 text-orange-600" />Checklist Cozinha Reiclar</CardTitle>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <Badge variant="outline">{formatDate(parseISO(entry.data))}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(entry.checklist).map(([section, items]) => (
                        <div key={section}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                            {section}
                          </h3>
                          <div className="grid gap-3">
                            {Object.entries(items).map(([item, info]) => (
                              <div key={item} className={`p-4 rounded-lg border-l-4 ${
                                  info.resposta === "Sim" ? "border-green-500 bg-green-50" : info.resposta === "Não" ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"}`}>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                  <span className="font-medium text-gray-900">{item}</span>
                                  <div className="flex items-center gap-2">
                                    {info.resposta === "Sim" ? (
                                      <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" />Conforme</Badge>
                                    ) : info.resposta === "Não" ? (<Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Não Conforme</Badge>) : (<Badge variant="secondary">Não Respondido</Badge>)}
                                  </div>
                                </div>
                                {info.resposta === "Não" && info.observacao && (
                                  <div className="mt-3 pt-3 border-t border-red-200">
                                    <div className="flex items-start gap-2">
                                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium text-red-800 mb-1">Observação:</p>
                                        <p className="text-sm text-red-700">{info.observacao}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          {section !== Object.keys(entry.checklist)[Object.keys(entry.checklist).length - 1] && (<Separator className="mt-6" />)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}