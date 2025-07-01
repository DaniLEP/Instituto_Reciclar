import { ref, get, push, update, db } from "../../../../firebase"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Button } from "@/components/ui/Button/button" 
import { Input } from "@/components/ui/input/index"
import { Label } from "@/components/ui/label/index"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Calendar, Coffee, UtensilsCrossed, Cookie, ChefHat, Users, UserCheck, Clock, Save, Trash2, FileText, AlertTriangle, Calculator } from "lucide-react"

export default function CadastroRefeicoes() {
  const [formData, setFormData] = useState({dataRefeicao: "", cafeDescricao: "", cafeTotalQtd: 0, cafeFuncionariosQtd: 0, cafeJovensQtd: 0, almocoDescricao: "",
    almocoTotalQtd: 0, almocoFuncionariosQtd: 0,almocoJovensQtd: 0, almocoJovensTardeQtd: 0, lancheDescricao: "", lancheTotalQtd: 0, lancheFuncionariosQtd: 0,
    lancheJovensManhaQtd: 0, lancheJovensQtd: 0, outrasDescricao: "", outrasTotalQtd: 0, outrasFuncionariosQtd: 0, outrasJovensQtd: 0, outrasJovensTardeQtd: 0, sobrasDescricao: "", observacaoDescricao: "", desperdicioQtd: 0,});
  const [refeicoes, setRefeicoes] = useState([])
  const navigate = useNavigate()

  // Carregar refeições do Firebase ao montar o componente
  useEffect(() => {
    const refeicoesRef = ref(db, "refeicoesServidas")
    get(refeicoesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {const refeicoesData = []
          snapshot.forEach((childSnapshot) => {refeicoesData.push({ key: childSnapshot.key, ...childSnapshot.val() })}); 
          setRefeicoes(refeicoesData)} 
        else {console.log("Nenhuma refeição encontrada")}})
      .catch((error) => {console.error("Erro ao ler dados do Firebase:", error)})}, []);

  // Função para calcular jovens (total - funcionarios - jovensManha)
  const calcularTotal = (total, funcionarios, jovens = 0) => {return Math.max(0, total - funcionarios - jovens)};
  // Manipulador de mudanças dos inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    // Se for campo de descrição (texto), atualiza direto
    if (id.includes("Descricao")) {setFormData((prev) => ({ ...prev, [id]: value })); return;}
    // Campos numéricos
    const valorNumerico = Number.parseInt(value) || 0
    setFormData((prev) => {
      const novoEstado = { ...prev, [id]: valorNumerico }
      // Cálculos dependentes:
      if (id === "cafeTotalQtd" || id === "cafeFuncionariosQtd") {novoEstado.cafeJovensQtd = calcularTotal(novoEstado.cafeTotalQtd, novoEstado.cafeFuncionariosQtd)} 
      else if (id === "almocoTotalQtd" || id === "almocoFuncionariosQtd" || id === "almocoJovensQtd") {novoEstado.almocoJovensTardeQtd = calcularTotal(novoEstado.almocoTotalQtd, novoEstado.almocoFuncionariosQtd, novoEstado.almocoJovensQtd,)} 
      else if (id === "lancheTotalQtd" || id === "lancheFuncionariosQtd" || id === "lancheJovensManhaQtd") {novoEstado.lancheJovensQtd = calcularTotal(novoEstado.lancheTotalQtd, novoEstado.lancheFuncionariosQtd, novoEstado.lancheJovensManhaQtd,)} 
      else if (id === "outrasTotalQtd" || id === "outrasFuncionariosQtd" || id === "outrasJovensQtd") {novoEstado.outrasJovensTardeQtd = calcularTotal(novoEstado.outrasTotalQtd, novoEstado.outrasFuncionariosQtd, novoEstado.outrasJovensQtd,)};
      return novoEstado;})}
  // Atualizar data
  const handleDateChange = (e) => {setFormData((prev) => ({ ...prev, dataRefeicao: e.target.value }))}
  // Navegar para página anterior
  const handleBack = () => {navigate("/cardapio")}
  // Salvar dados no Firebase Realtime Database
  const salvarNoBanco = () => {
    if (!formData.dataRefeicao) {toast.error("Por favor, selecione a data da refeição."); return;}
    const refeicaoData = { ...formData }
    const newRefeicaoKey = push(ref(db, "refeicoesServidas")).key
    const updates = {}
    updates[`/refeicoesServidas/${newRefeicaoKey}`] = refeicaoData

    update(ref(db), updates)
      .then(() => {toast.success("Refeições salvas com sucesso!", {position: "top-right", autoClose: 3000, theme: "colored",})
        setFormData({dataRefeicao: "", cafeDescricao: "", cafeTotalQtd: 0, cafeFuncionariosQtd: 0, cafeJovensQtd: 0, almocoDescricao: "", almocoTotalQtd: 0, 
        almocoFuncionariosQtd: 0, almocoJovensQtd: 0, almocoJovensTardeQtd: 0, lancheDescricao: "", lancheTotalQtd: 0, lancheFuncionariosQtd: 0, lancheJovensManhaQtd: 0,
        lancheJovensQtd: 0, outrasDescricao: "", outrasTotalQtd: 0, outrasFuncionariosQtd: 0, outrasJovensQtd: 0, outrasJovensTardeQtd: 0, sobrasDescricao: "", 
        observacaoDescricao: "", desperdicioQtd: 0,})
      })
      .catch((error) => {console.error("Erro ao salvar refeição:", error)
        toast.error("Erro ao salvar refeição. Tente novamente.", { position: "top-right", autoClose: 3000, theme: "colored",})
      })
  }

  const mealTypes = [
    { id: "cafe", label: "Café da Manhã", icon: Coffee, color: "bg-amber-100 border-amber-200" },
    { id: "almoco", label: "Almoço", icon: UtensilsCrossed, color: "bg-green-100 border-green-200" },
    { id: "lanche", label: "Lanche", icon: Cookie, color: "bg-purple-100 border-purple-200" },
    { id: "outras", label: "Outras Refeições", icon: ChefHat, color: "bg-blue-100 border-blue-200" },
  ]

  const getTotalServings = () => {return formData.cafeTotalQtd + formData.almocoTotalQtd + formData.lancheTotalQtd + formData.outrasTotalQtd}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 px-4">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button onClick={handleBack} variant="outline" className="hover:bg-slate-100"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4"><UtensilsCrossed className="w-8 h-8 text-orange-600" /></div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Cadastro de Refeições</h1>
              <p className="text-gray-600">Registre as refeições servidas e controle o desperdício</p>
            </div>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>

          {/* Date Selection */}
          <Card className="max-w-md mx-auto">
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Calendar className="w-5 h-5" />Data da Refeição</CardTitle></CardHeader>
            <CardContent><Input type="date" id="dataRefeicao" value={formData.dataRefeicao} onChange={handleDateChange} className="h-12" /></CardContent>
          </Card>
        </div>

        {/* Summary Card */}
        {getTotalServings() > 0 && (
          <Card className="mb-8">
            <CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="w-5 h-5" />Resumo do Dia</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{getTotalServings()}</p>
                  <p className="text-sm text-gray-600">Total de Porções</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{formData.cafeFuncionariosQtd + formData.almocoFuncionariosQtd + formData.lancheFuncionariosQtd + formData.outrasFuncionariosQtd}</p>
                  <p className="text-sm text-gray-600">Funcionários</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{formData.cafeJovensQtd + formData.almocoJovensQtd + formData.lancheJovensManhaQtd + formData.outrasJovensQtd}</p>
                  <p className="text-sm text-gray-600">Jovens Manhã</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{formData.almocoJovensTardeQtd + formData.lancheJovensQtd + formData.outrasJovensTardeQtd}</p>
                  <p className="text-sm text-gray-600">Jovens Tarde</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Meal Registration Cards */}
        <div className="space-y-6 mb-8">
          {mealTypes.map(({ id, label, icon: Icon, color }) => (
            <Card key={id} className={`${color} shadow-sm`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><Icon className="w-6 h-6" />{label} {formData[`${id}TotalQtd`] > 0 && (<Badge variant="secondary">{formData[`${id}TotalQtd`]} porções</Badge>)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                <div>
                  <Label className="flex items-center gap-2 mb-2"><FileText className="w-4 h-4" />Descrição do Cardápio </Label>
                  <Textarea id={`${id}Descricao`} value={formData[`${id}Descricao`]} onChange={handleChange} placeholder="Descreva os pratos servidos..." className="min-h-[100px] resize-y" />
                </div>

                {/* Quantities Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="flex items-center gap-2 mb-2"><Users className="w-4 h-4" /> Total </Label>
                    <Input type="number" id={`${id}TotalQtd`} value={formData[`${id}TotalQtd`]} onChange={handleChange} min={0} className="h-12" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2 mb-2"><UserCheck className="w-4 h-4" /> Funcionários</Label>
                    <Input type="number" id={`${id}FuncionariosQtd`} value={formData[`${id}FuncionariosQtd`]} onChange={handleChange} min={0} className="h-12" />
                  </div>

                  {/* Jovens Manhã - only show for applicable meals */}
                  {formData[`${id}JovensManhaQtd`] !== undefined && (
                    <div>
                      <Label className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4" />Jovens Manhã</Label>
                      <Input type="number" id={`${id}JovensManhaQtd`} value={formData[`${id}JovensManhaQtd`] || ""} onChange={handleChange} min={0} className="h-12" />
                    </div>
                  )}
                  {/* Auto-calculated fields */}
                  {formData[`${id}JovensQtd`] !== undefined && (<div><Label className="flex items-center gap-2 mb-2"><Calculator className="w-4 h-4" />{id === "cafe" ? "Jovens" : "Jovens Manhã (calc.)"}</Label>
                      <Input type="number" value={formData[`${id}JovensQtd`]} disabled className="h-12 bg-gray-100 cursor-not-allowed" />
                    </div>
                  )}

                  {formData[`${id}JovensTardeQtd`] !== undefined && (<div>
                      <Label className="flex items-center gap-2 mb-2"><Calculator className="w-4 h-4" />Jovens Tarde (calc.)</Label>
                      <Input type="number" value={formData[`${id}JovensTardeQtd`]} disabled  className="h-12 bg-gray-100 cursor-not-allowed" />
                    </div>)}
                </div>

                {/* Auto-calculation info */}
                <Alert><Calculator className="h-4 w-4" /><AlertDescription>Os campos calculados automaticamente são baseados na fórmula: Total - Funcionários - Jovens Manhã = Jovens Tarde</AlertDescription></Alert>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Sobras */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Trash2 className="w-5 h-5" />Sobras / Restos</CardTitle></CardHeader>
            <CardContent><Textarea id="sobrasDescricao" value={formData.sobrasDescricao} onChange={handleChange} placeholder="Descreva as sobras ou restos do dia..." className="min-h-[120px] resize-y" /></CardContent>
          </Card>

          {/* Observações */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" />Observações Gerais</CardTitle></CardHeader>
            <CardContent>
              <Textarea id="observacaoDescricao" value={formData.observacaoDescricao} onChange={handleChange} placeholder="Observações sobre o dia, problemas, melhorias..." className="min-h-[120px] resize-y" />
            </CardContent>
          </Card>
        </div>

        {/* Desperdício */}
        <Card className="mb-8">
          <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-600" /> Controle de Desperdício</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Label className="text-gray-700 font-medium">Quantidade desperdiçada:</Label>
              <Input type="number" id="desperdicioQtd"value={formData.desperdicioQtd} onChange={handleChange} min={0} className="w-32 h-12"/>
              <span className="text-gray-600">kg</span>
            </div>
            {formData.desperdicioQtd > 0 && (<Alert className="mt-4" variant="destructive"> <AlertTriangle className="h-4 w-4" />
              <AlertDescription>Desperdício registrado: {formData.desperdicioQtd} KG. Considere revisar os processos para reduzir o desperdício.</AlertDescription></Alert>)}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button onClick={salvarNoBanco} size="lg" className="px-8 py-4 text-lg font-semibold bg-green-600 hover:bg-green-700"
            disabled={!formData.dataRefeicao}><Save className="w-5 h-5 mr-2" />Salvar Registro de Refeições</Button>
        </div>
        {!formData.dataRefeicao && (<Alert className="mt-4 max-w-md mx-auto"><Calendar className="h-4 w-4" /> <AlertDescription>Selecione uma data antes de salvar o registro.</AlertDescription></Alert>)}
      </div>
    </div>
  )
}