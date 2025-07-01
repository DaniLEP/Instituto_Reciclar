import { useEffect, useState } from "react"
import { ref, get, set, remove } from "firebase/database"
import { db, auth } from "../../../../firebase"
import { Button } from "@/components/ui/Button/button" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/index"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog/dialog"
import { Input } from "@/components/ui/input/index"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Calendar, User, AlertTriangle, ChefHat, XCircle, Send, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

const CardapiosReprovados = () => {
  const [cardapios, setCardapios] = useState([])
  const [modalEditar, setModalEditar] = useState(false)
  const [cardapioEditar, setCardapioEditar] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCardapios = async () => {
      const user = auth.currentUser
      if (!user) return
      const snapshot = await get(ref(db, "cardapiosReprovados"))
      const lista = []
      snapshot.forEach((childSnap) => {
        const valor = childSnap.val()
        if (valor.status === "reprovado") {lista.push({ id: childSnap.key, ...valor }) }
      })
      setCardapios(lista); setCarregando(false)
    }; fetchCardapios()
  }, [])

  const formatDate = (date) => {
    if (!date) return "-"; const d = new Date(date)
    return d.toLocaleDateString("pt-BR")
  }
  const abrirModalEditar = (cardapio) => {setCardapioEditar(cardapio); setModalEditar(true)}

  const handleInputChange = (semana, secao, dia, valor) => {
    setCardapioEditar((prev) => {
      if (!prev) return prev
      const novo = structuredClone(prev) // deep copy seguro
      if (!novo.composicoes[semana]) novo.composicoes[semana] = { cardapio: {} }
      if (!novo.composicoes[semana].cardapio) novo.composicoes[semana].cardapio = {}
      if (!novo.composicoes[semana].cardapio[secao]) novo.composicoes[semana].cardapio[secao] = {}
      novo.composicoes[semana].cardapio[secao][dia] = valor; return novo
    })
  }

  const salvarAlteracoes = async () => {
    if (!cardapioEditar?.id) return
    try {
      await set(ref(db, `cardapiosPendentes/${cardapioEditar.id}`), {...cardapioEditar, status: "pendente",})
      await remove(ref(db, `cardapiosReprovados/${cardapioEditar.id}`))
      setModalEditar(false)
      setCardapios((prev) => prev.filter((c) => c.id !== cardapioEditar.id))
      navigate("/Gerenciador-cardapios-reprovados")
    } catch (error) {alert("Erro ao salvar alterações: " + error.message)}
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4"><XCircle className="w-8 h-8 text-red-600" /></div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Cardápios Reprovados</h1>
              <p className="text-gray-600">Revise e corrija os cardápios que foram reprovados</p>
            </div>
            <div className="w-24"></div>
          </div>
          {/* Statistics */}
          {cardapios.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-8 h-8 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Reprovados</p>
                      <p className="text-2xl font-bold text-red-600">{cardapios.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <ChefHat className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Tipos Diferentes</p>
                      <p className="text-2xl font-bold text-blue-600">{new Set(cardapios.map((c) => c.tipo)).size}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Edit className="w-8 h-8 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Aguardando Correção</p>
                      <p className="text-2xl font-bold text-yellow-600">{cardapios.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        {/* Content */}
        {carregando ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Carregando cardápios reprovados...</p>
            </CardContent>
          </Card>
        ) : cardapios.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum cardápio reprovado</h3>
              <p className="text-gray-600">Todos os cardápios foram aprovados ou não há cardápios reprovados.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {cardapios.map((cardapio) => (
              <Card key={cardapio.id} className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-red-500">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2"><ChefHat className="w-5 h-5" />Cardápio - {cardapio.tipo}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(cardapio.periodo?.inicio)} até {formatDate(cardapio.periodo?.fim)}</div>
                        <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Reprovado</Badge>
                      </div>
                    </div>
                    <Button onClick={() => abrirModalEditar(cardapio)} className="bg-yellow-600 hover:bg-yellow-700"><Edit className="w-4 h-4 mr-2" />Editar e Reenviar</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Justificativa */}
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription><strong>Motivo da reprovação:</strong> {cardapio.justificativa}</AlertDescription>
                    </Alert>
                    {/* Composições */}
                    <div className="space-y-3">
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal de Edição */}
        <Dialog open={modalEditar} onOpenChange={setModalEditar}>
          <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Edit className="w-5 h-5" />Editar Cardápio Reprovado</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Justificativa da reprovação */}
              {cardapioEditar?.justificativa && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription><strong>Motivo da reprovação:</strong> {cardapioEditar.justificativa}</AlertDescription>
                </Alert>
              )}

              {cardapioEditar ? (
                Object.entries(cardapioEditar.composicoes || {}).map(([semana, dados]) => (
                  <div key={semana}>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{semana}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-500" />
                          <span><strong>Nutricionista:</strong> {dados.nutricionista?.nome} ({dados.nutricionista?.crn3})</span>
                        </div>
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-500" />
                          <span><strong>Período:</strong> {formatDate(dados.periodo?.inicio)} até{" "}{formatDate(dados.periodo?.fim)}</span>
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
                              {getDaysOfWeek().map((dia) => (
                                <td key={dia} className="border border-gray-200 px-2 py-2">
                                  <Input type="text"  value={dias[dia] || ""} onChange={(e) => handleInputChange(semana, secao, dia, e.target.value)} className="w-full min-w-[120px] text-sm" placeholder="Descreva o prato..." />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {semana !== Object.keys(cardapioEditar.composicoes || {}).slice(-1)[0] && (<Separator className="mt-6" />)}
                  </div>
                ))
              ) : (<div className="text-center py-8"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" /><p className="text-gray-600">Carregando dados do cardápio...</p></div>)}
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setModalEditar(false)}>Cancelar</Button>
              <Button onClick={salvarAlteracoes} className="bg-green-600 hover:bg-green-700"><Send className="w-4 h-4 mr-2" />Reenviar para Aprovação</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default CardapiosReprovados
