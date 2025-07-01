import { useEffect, useState } from "react"
import { ref, onValue, remove, set } from "firebase/database"
import { db } from "../../../../firebase"
import { ToastContainer, toast } from "react-toastify"
import { Button } from "@/components/ui/Button/button" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/index"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog/dialog"
import { Textarea } from "@/components/ui/textarea/textarea"
import { Label } from "@/components/ui/label/index"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CheckCircle, XCircle, Eye, Calendar, User, FileText, Clock, AlertTriangle, ChefHat, Utensils } from "lucide-react"
import { useNavigate } from "react-router-dom"

const AprovacaoCardapios = () => {
  const [pendentes, setPendentes] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [justificativa, setJustificativa] = useState("")
  const [selecionado, setSelecionado] = useState(null)
  const [modalVerMaisAberto, setModalVerMaisAberto] = useState(false)
  const [cardapioVerMais, setCardapioVerMais] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const unsub = onValue(ref(db, "cardapiosPendentes"), (snapshot) => {
      const data = snapshot.val()
      if (data) {const lista = Object.entries(data).map(([id, valor]) => ({ id, ...valor })); setPendentes(lista)} 
      else {setPendentes([])}
    })
    return () => unsub()
  }, [])

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

  const aprovar = async (cardapio) => {
    try {
      const tipo = cardapio.tipo || "naoInformado"
      await set(ref(db, `cardapiosAprovados/${cardapio.id}`), {...cardapio, status: "aprovado", aprovadoEm: new Date().toISOString(),})
      await set(ref(db, `cardapiosAprovadosPorTipo/${tipo}/${cardapio.id}`), {...cardapio, status: "aprovado", aprovadoEm: new Date().toISOString(),})
      await remove(ref(db, `cardapiosPendentes/${cardapio.id}`))
      toast.success("✅ Cardápio aprovado!")
    } catch (error) {console.error(error); toast.error("❌ Erro ao aprovar cardápio.")}
  }

  const reprovar = async () => {
    if (!justificativa.trim()) {toast.warn("⚠️ Informe uma justificativa."); return}
    try {
      await set(ref(db, `cardapiosReprovados/${selecionado.id}`), {...selecionado, status: "reprovado", justificativa, reprovadoEm: new Date().toISOString(),})
      await remove(ref(db, `cardapiosPendentes/${selecionado.id}`))
      toast.info("🔴 Cardápio reprovado.");
      setJustificativa("");
      setModalAberto(false);
    } catch (error) {toast.error("❌ Erro ao reprovar cardápio.")}
  }

  const getDaysOfWeek = () => ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button onClick={() => navigate(-1)} variant="outline" className="hover:bg-slate-100"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4"><ChefHat className="w-8 h-8 text-orange-600" /></div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Aprovação de Cardápios</h1>
              <p className="text-gray-600">Analise e aprove os cardápios pendentes</p>
            </div>
            <div className="w-24"></div>
          </div>
          {/* Statistics */}
          {pendentes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Pendentes</p>
                      <p className="text-2xl font-bold text-yellow-600">{pendentes.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Tipos Diferentes</p>
                      <p className="text-2xl font-bold text-blue-600">{new Set(pendentes.map((p) => p.tipo || "naoInformado")).size}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <User className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Nutricionistas</p>
                      <p className="text-2xl font-bold text-green-600">{new Set(pendentes.flatMap((p) => Object.values(p.composicoes || {}).map((c) => c.nutricionista?.nome),), ).size}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Content */}
        {pendentes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum cardápio pendente</h3>
              <p className="text-gray-600">Todos os cardápios foram processados ou não há novos cardápios para aprovar.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {pendentes.map((cardapio) => (
              <Card key={cardapio.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2"><Utensils className="w-5 h-5" />Cardápio - {cardapio.tipo || "Tipo não informado"}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(cardapio.periodo?.inicio)} até {formatDate(cardapio.periodo?.fim)}
                        </div>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => aprovar(cardapio)} className="bg-green-600 hover:bg-green-700"><CheckCircle className="w-4 h-4 mr-2" />Aprovar</Button>
                      <Button onClick={() => {setSelecionado(cardapio); setModalAberto(true)}}
                        variant="destructive"><XCircle className="w-4 h-4 mr-2" />Reprovar</Button>
                      <Button onClick={() => {setCardapioVerMais(cardapio); setModalVerMaisAberto(true)}}
                        variant="outline"><Eye className="w-4 h-4 mr-2" />Ver Detalhes</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(cardapio.composicoes || {}).map(([semana, dados]) => (
                      <div key={semana} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">{semana}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span><strong>Nutricionista:</strong> {dados.nutricionista?.nome} ({dados.nutricionista?.crn3})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal Reprovação */}
        <Dialog open={modalAberto} onOpenChange={setModalAberto}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><XCircle className="w-5 h-5 text-red-600" />Justificativa da Reprovação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Descreva detalhadamente o motivo da reprovação para que o responsável possa fazer as correções necessárias.</AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="justificativa">Motivo da reprovação</Label>
                <Textarea id="justificativa" value={justificativa} onChange={(e) => setJustificativa(e.target.value)}
                  placeholder="Ex: Cardápio não atende às diretrizes nutricionais, falta de variedade nos pratos, ingredientes inadequados..." className="min-h-[120px] resize-none" />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setModalAberto(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={reprovar} disabled={!justificativa.trim()}><XCircle className="w-4 h-4 mr-2" />Reprovar Cardápio</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal Ver Mais */}
        <Dialog open={modalVerMaisAberto} onOpenChange={setModalVerMaisAberto}>
          <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><FileText className="w-5 h-5" />Detalhes do Cardápio</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {cardapioVerMais &&
                Object.entries(cardapioVerMais.composicoes || {}).map(([semana, dados]) => (
                  <div key={semana}>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{semana}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span><strong>Nutricionista:</strong> {dados.nutricionista?.nome} ({dados.nutricionista?.crn3})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>
                            <strong>Período:</strong> {formatDate(dados.periodo?.inicio)} até{" "}
                            {formatDate(dados.periodo?.fim)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-200 px-3 py-2 text-left font-semibold">Composição</th>
                            {getDaysOfWeek().map((dia) => (<th key={dia} className="border border-gray-200 px-3 py-2 text-center font-semibold">{dia}</th>))}
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(dados.cardapio || {}).map(([secao, dias]) => (
                            <tr key={secao} className="hover:bg-gray-50">
                              <td className="border border-gray-200 px-3 py-2 font-medium bg-gray-50">{secao}</td>
                              {getDaysOfWeek().map((dia) => (<td key={dia} className="border border-gray-200 px-3 py-2 text-center">{dias[dia] || "-"}</td>))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {semana !== Object.keys(cardapioVerMais.composicoes || {}).slice(-1)[0] && (<Separator className="mt-6" />)}</div>
                ))}
            </div>

            <DialogFooter><Button variant="outline" onClick={() => setModalVerMaisAberto(false)}>Fechar</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <ToastContainer position="bottom-right" theme="light" />
      </div>
    </div>
  )
}

export default AprovacaoCardapios
