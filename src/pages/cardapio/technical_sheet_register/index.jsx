import { useState } from "react"
import { push, ref as dbRef, serverTimestamp } from "firebase/database"
import { db } from "../../../../firebase"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Button } from "@/components/ui/Button/button" 
import { Input } from "@/components/ui/input/index"
import { Label } from "@/components/ui/label/index"
import { Textarea } from "@/components/ui/textarea/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, ChefHat, Plus, Trash2, Upload, ImageIcon, Clock, User, Utensils, BookOpen, Save, RotateCcw, AlertTriangle, Camera, Scale } from "lucide-react"
const CadastroReceitas = () => {
  const navigate = useNavigate()
  const [nome, setNome] = useState("")
  const [classificacao, setClassificacao] = useState("")
  const [utensilios, setUtensilios] = useState("")
  const [espessuraCorte, setEspessuraCorte] = useState("")
  const [ingredientes, setIngredientes] = useState([{ nome: "", peso: "" }])
  const [modoPreparo, setModoPreparo] = useState("")
  const [modoServir, setModoServir] = useState("")
  const [armazenamento, setArmazenamento] = useState("")
  const [validadeRefrigerado, setValidadeRefrigerado] = useState("")
  const [validadeCongelado, setValidadeCongelado] = useState("")
  const [nomeNutri, setNomeNutri] = useState("")
  const [crn3Nutri, setCrn3Nutri] = useState("")
  const [imagemBase64, setImagemBase64] = useState("")
  const [loading, setLoading] = useState(false)

  // Lê e converte imagem para base64
  const handleImagemChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith("image/")) {toast.error("Por favor, selecione um arquivo de imagem válido."); return;}
      const reader = new FileReader()
      reader.onloadend = () => {setImagemBase64(reader.result)}
      reader.readAsDataURL(file);
    }
  }

  const adicionarIngrediente = () => {setIngredientes((prev) => [...prev, { nome: "", peso: "" }])}
  const removerIngrediente = (index) => {if (ingredientes.length > 1) {setIngredientes((prev) => prev.filter((_, i) => i !== index))}}
  const alterarIngrediente = (index, field, value) => {const novosIngredientes = [...ingredientes]; novosIngredientes[index][field] = value; setIngredientes(novosIngredientes)}

  const validarCampos = () => {
    if (!nome.trim() || !classificacao.trim() || !utensilios.trim() || !espessuraCorte.trim() || ingredientes.some((i) => !i.nome.trim() || !i.peso.trim()) || !modoPreparo.trim() || !modoServir.trim() || !armazenamento.trim() ||
      !validadeRefrigerado.trim() || !validadeCongelado.trim() || !nomeNutri.trim() || !crn3Nutri.trim() || !imagemBase64) 
    {return false}
    return true;
  }

  const limparCampos = () => {setNome(""); setClassificacao(""); setUtensilios(""); setEspessuraCorte(""); setIngredientes([{ nome: "", peso: "" }]); setModoPreparo("");
   setModoServir(""); setArmazenamento(""); setValidadeRefrigerado(""); setValidadeCongelado(""); setNomeNutri(""); setCrn3Nutri(""); setImagemBase64("");}
  const handleSubmit = async () => {
    if (!validarCampos()) {toast.warn("Por favor, preencha todos os campos corretamente."); return}
    setLoading(true)
    const novaReceita = {nome, classificacao, utensilios, espessuraCorte, ingredientes, modoPreparo, modoServir, armazenamento,
      prazoValidade: { refrigerado: validadeRefrigerado, congelado: validadeCongelado },
      nutricionista: { nome: nomeNutri, crn3: crn3Nutri }, imagemBase64, dataCadastro: serverTimestamp(),
    }
    try {await push(dbRef(db, "receitas"), novaReceita); toast.success("Receita cadastrada com sucesso!"); limparCampos();} 
    catch (error) {console.error(error); toast.error("Erro ao salvar receita. Tente novamente.")} 
    finally {setLoading(false)}
  }

  const getTotalIngredientes = () => {return ingredientes.filter((ing) => ing.nome.trim() && ing.peso.trim()).length}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 px-4">
      <ToastContainer position="top-right" autoClose={3500} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button onClick={() => navigate("/cardapio")} variant="outline" className="hover:bg-slate-100"><ArrowLeft className="w-4 h-4 mr-2" /> Voltar</Button>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4"><ChefHat className="w-8 h-8 text-orange-600" /></div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Cadastro de Receitas</h1>
              <p className="text-gray-600">Registre novas receitas com informações detalhadas</p>
            </div>
            <div className="w-24"></div>
          </div>

          {/* Progress Indicator */}
          {getTotalIngredientes() > 0 && (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Ingredientes adicionados</span>
                  </div>
                  <Badge variant="secondary">{getTotalIngredientes()}</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          {/* Informações Básicas */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" />Informações Básicas</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="flex items-center gap-2"><ChefHat className="w-4 h-4" /> Nome da Receita</Label>
                  <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite o nome da receita" className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classificacao" className="flex items-center gap-2"><Badge className="w-4 h-4" /> Classificação do Prato</Label>
                  <Input id="classificacao" value={classificacao} onChange={(e) => setClassificacao(e.target.value)} placeholder="Ex: Prato principal, sobremesa, entrada" className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="utensilios" className="flex items-center gap-2"><Utensils className="w-4 h-4" />Utensílios Necessários</Label>
                  <Input id="utensilios" value={utensilios} onChange={(e) => setUtensilios(e.target.value)} placeholder="Liste os utensílios necessários" className="h-12" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="espessura" className="flex items-center gap-2"><Scale className="w-4 h-4" />Espessura do Corte</Label>
                  <Input id="espessura" value={espessuraCorte} onChange={(e) => setEspessuraCorte(e.target.value)} placeholder="Ex: 2cm, fatias finas" className="h-12"/>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ingredientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Scale className="w-5 h-5" />Ingredientes e Peso Per Capita Cru (g/ml)<Badge variant="secondary">{ingredientes.length} itens</Badge></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ingredientes.map((ingrediente, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Ingrediente {index + 1}</Label>
                      <Input value={ingrediente.nome} onChange={(e) => alterarIngrediente(index, "nome", e.target.value)} placeholder="Nome do ingrediente" className="h-12" />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>Peso (g/ml)</Label>
                      <Input value={ingrediente.peso} onChange={(e) => alterarIngrediente(index, "peso", e.target.value)} placeholder="Peso" className="h-12" />
                    </div>
                    <Button type="button" variant="outline" size="icon" onClick={() => removerIngrediente(index)} disabled={ingredientes.length === 1} className="h-12 w-12"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
                <Button type="button" onClick={adicionarIngrediente} variant="outline" className="w-full"><Plus className="w-4 h-4 mr-2" />Adicionar Ingrediente</Button>
              </div>
            </CardContent>
          </Card>

          {/* Instruções */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" />Instruções de Preparo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="preparo">Modo de Preparo</Label>
                  <Textarea id="preparo" value={modoPreparo} onChange={(e) => setModoPreparo(e.target.value)}
                    placeholder="Descreva o passo a passo do preparo..." className="min-h-[120px] resize-y" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="servir">Modo de Servir</Label>
                  <Textarea id="servir"  value={modoServir} onChange={(e) => setModoServir(e.target.value)} placeholder="Como deve ser servido o prato..." className="min-h-[120px] resize-y" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="armazenamento">Armazenamento</Label>
                  <Textarea id="armazenamento" value={armazenamento} onChange={(e) => setArmazenamento(e.target.value)} placeholder="Instruções de armazenamento..." className="min-h-[120px] resize-y" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validade */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" />Prazo de Validade</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="refrigerado">Prazo Refrigerado</Label>
                  <Input id="refrigerado" value={validadeRefrigerado} onChange={(e) => setValidadeRefrigerado(e.target.value)} placeholder="Ex: 3 dias, 1 semana" className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="congelado">Prazo Congelado</Label>
                  <Input id="congelado" value={validadeCongelado} onChange={(e) => setValidadeCongelado(e.target.value)} placeholder="Ex: 30 dias, 3 meses" className="h-12" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nutricionista */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5" />Informações do Nutricionista</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nomeNutri">Nome do Nutricionista</Label>
                  <Input id="nomeNutri" value={nomeNutri} onChange={(e) => setNomeNutri(e.target.value)} placeholder="Nome completo" className="h-12" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crn3">CRN3</Label>
                  <Input id="crn3" value={crn3Nutri} onChange={(e) => setCrn3Nutri(e.target.value)} placeholder="Número do CRN3" className="h-12" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Imagem */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Camera className="w-5 h-5" />Foto da Receita</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <Label htmlFor="imagem" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para enviar</span> ou arraste e solte</p>
                      <p className="text-xs text-gray-500">PNG, JPG ou JPEG (MAX. 10MB)</p>
                    </div>
                    <input id="imagem" type="file" accept="image/*" onChange={handleImagemChange} className="hidden" />
                  </Label>
                </div>

                {imagemBase64 && (
                  <div className="relative">
                    <img src={imagemBase64 || "/placeholder.svg"} alt="Pré-visualização da receita" className="w-full max-h-64 object-cover rounded-lg shadow-md" />
                    <Badge className="absolute top-2 right-2 bg-green-600"><ImageIcon className="w-3 h-3 mr-1" /> Imagem carregada</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Validation Alert */}
          {!validarCampos() && (nome || classificacao || ingredientes.some((i) => i.nome || i.peso)) && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Preencha todos os campos obrigatórios antes de salvar a receita. Verifique se todos os ingredientes têm
                nome e peso definidos.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button onClick={limparCampos} variant="outline" disabled={loading} className="h-12"><RotateCcw className="w-4 h-4 mr-2" />Limpar Campos</Button>
            <Button onClick={handleSubmit} disabled={loading || !validarCampos()} className="h-12 px-8">
              {loading ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Salvando...</>) : (<><Save className="w-4 h-4 mr-2" />Salvar Receita</>)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CadastroReceitas