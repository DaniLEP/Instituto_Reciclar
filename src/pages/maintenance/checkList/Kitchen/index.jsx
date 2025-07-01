import { useState } from "react"
import { db } from "../../../../../firebase"
import { ref, push } from "firebase/database"
import { format } from "date-fns"
import { Input } from "@/components/ui/input/index"
import { Button } from "@/components/ui/Button/button" 
import { Label } from "@/components/ui/label/index"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Calendar, ChefHat, CheckCircle2, XCircle, AlertTriangle, Save, Clock, Utensils, Thermometer, Shield, ClipboardList } from "lucide-react"

const checklistStructure = {
  Cozinha: ["Utensilios disponíveis para se servir", "Plaquinhas Indentificações", "Modo certo de servir", "Alimentos servidos no horário correto?", "Temperatura Alimentos",
    "Temperatura Equipamentos", "Amostra de alimentos", "EPI's necessarios", "Papel toalha no banheiro", "Acessorios não permitidos",
    "Etiqueta de validade nos produtos abertos", "Etiqueta de validade nos produtos abertos da geladeira", "Etiqueta de validade nos produtos congelados",
    "Cardapio do dia", "Alimentos do cardapio do dia seguinte já separado", "Bancada arrumada", "Celular na área de trabalho",
    "Luz acesa", "Organização do estoque", "Chão limpo", "Bancada limpa",
  ],
}

const getItemIcon = (item) => {
  if (item.toLowerCase().includes("temperatura")) return <Thermometer className="w-4 h-4" />
  if (item.toLowerCase().includes("utensil")) return <Utensils className="w-4 h-4" />
  if (item.toLowerCase().includes("epi")) return <Shield className="w-4 h-4" />
  if (item.toLowerCase().includes("cardapio")) return <ClipboardList className="w-4 h-4" />
  if (item.toLowerCase().includes("horário")) return <Clock className="w-4 h-4" />
  return <CheckCircle2 className="w-4 h-4" />
}

export default function Checklist() {
  const [selectedDate, setSelectedDate] = useState("")
  const [checklist, setChecklist] = useState({})
  const navigate = useNavigate()
  const handleOptionChange = (section, item, resposta) => {setChecklist((prev) => ({...prev, [section]: {...prev[section], [item]: { ...prev[section]?.[item], resposta }},}))}
  const handleObservationChange = (section, item, observacao) => {setChecklist((prev) => ({...prev,[section]: {...prev[section],[item]: { ...prev[section]?.[item], observacao },},}))}

const handleSave = async () => {
  if (!selectedDate) {alert("Por favor, selecione uma data."); return;}
  const formattedDate = format(new Date(selectedDate), "yyyy-MM-dd")
  const dataToSave = {data: formattedDate, checklist, timestamp: Date.now(),}
  try {await push(ref(db, "checklists"), dataToSave); alert("Checklist salvo com sucesso!");
    // Limpar o formulário após salvar
    setSelectedDate(""); setChecklist({});
  } catch (error) {console.error("Erro ao salvar checklist:", error); alert("Erro ao salvar checklist.");}
}

  // Calculate progress
  const totalItems = Object.values(checklistStructure).flat().length
  const answeredItems = Object.values(checklist).flat().filter((item) => item?.resposta).length
  const progressPercentage = totalItems > 0 ? (answeredItems / totalItems) * 100 : 0
  const completedItems = Object.values(checklist).flat().filter((item) => item?.resposta === "Sim").length
  const failedItems = Object.values(checklist).flat().filter((item) => item?.resposta === "Não").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button onClick={() => navigate(-1)} variant="outline" className="mb-6 hover:bg-slate-100"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4"><ChefHat className="w-8 h-8 text-orange-600" /></div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Checklist Cozinha</h1>
            <p className="text-gray-600">Verificação diária dos procedimentos e padrões da cozinha</p>
          </div>
        </div>
        {/* Date Selection */}
        <Card className="mb-8 shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" />Data da Verificação</CardTitle></CardHeader>
          <CardContent>
            <div className="max-w-xs">
              <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="h-12" />
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        {answeredItems > 0 && (
          <Card className="mb-8 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2"><ClipboardList className="w-5 h-5" /> Progresso da Verificação</span>
                <Badge variant="outline">{answeredItems}/{totalItems} itens</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2"><span>Progresso geral</span> <span>{Math.round(progressPercentage)}%</span></div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Conformes: {completedItems}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm">Não conformes: {failedItems}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Checklist Items */}
        {Object.entries(checklistStructure).map(([section, items]) => (
          <Card key={section} className="mb-8 shadow-sm">
            <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><ChefHat className="w-6 h-6 text-orange-600" />{section}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => {
                  const itemData = checklist[section]?.[item] || {}
                  const isAnswered = !!itemData.resposta
                  const isCompliant = itemData.resposta === "Sim"
                  const hasIssue = itemData.resposta === "Não"
                  return (
                    <div key={item} className={`border rounded-lg p-4 transition-all duration-200 ${isAnswered ? isCompliant ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{getItemIcon(item)}</div>
                          <div>
                            <p className="font-medium text-gray-900">{item}</p>
                            <p className="text-sm text-gray-500">Item {index + 1} de {items.length}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name={`${section}-${item}`}
                                value="Sim" checked={itemData.resposta === "Sim"} onChange={() => handleOptionChange(section, item, "Sim")}
                                className="w-4 h-4 text-green-600 focus:ring-green-500" />
                              <span className="text-sm font-medium text-green-700 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Sim</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name={`${section}-${item}`} value="Não" checked={itemData.resposta === "Não"} onChange={() => handleOptionChange(section, item, "Não")} className="w-4 h-4 text-red-600 focus:ring-red-500" />
                              <span className="text-sm font-medium text-red-700 flex items-center gap-1"><XCircle className="w-4 h-4" />Não</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {itemData.resposta === "Não" && (
                        <div className="mt-4 pt-4 border-t border-red-200">
                          <Alert variant="destructive" className="mb-3"><AlertTriangle className="h-4 w-4" /><AlertDescription>Item não conforme - observação obrigatória</AlertDescription></Alert>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Descreva o motivo da não conformidade:</Label>
                          <Input type="text" placeholder="Ex: Equipamento com temperatura inadequada, falta de identificação..."
                            value={itemData.observacao || ""} onChange={(e) => handleObservationChange(section, item, e.target.value)} className="border-red-300 focus:border-red-500 focus:ring-red-500" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
        {/* Save Button */}
        <div className="flex justify-center pb-8">
          <Button onClick={handleSave} size="lg" className="px-8 py-3 text-lg font-medium bg-green-600 hover:bg-green-700" disabled={!selectedDate}><Save className="w-5 h-5 mr-2" />Salvar Checklist</Button>
        </div>
        {!selectedDate && (<Alert className="mb-8"><Calendar className="h-4 w-4" /><AlertDescription>Selecione uma data antes de salvar o checklist.</AlertDescription></Alert>)}
      </div>
    </div>
  )
}