import { useState, useEffect } from "react"
import { getDatabase, ref, update, push, get, remove } from "firebase/database"
import { app } from "../../../../firebase"
import { Button } from "@/components/ui/Button/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label/index"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/hooks/use-toast"
import { Search, Package, AlertTriangle, ArrowLeft, Hash, Calendar, User, Weight, Tag, Layers, ShoppingCart, Clock, CheckCircle2, XCircle } from "lucide-react"
import { Toaster } from "sonner"
import { useNavigate } from "react-router-dom"

export default function Retirada() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const db = getDatabase(app)
  const [sku, setSku] = useState("")
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [tipo, setTipo] = useState("")
  const [quantity, setQuantity] = useState("")
  const [marca, setMarca] = useState("")
  const [peso, setPeso] = useState("")
  const [retirante, setRetirante] = useState("")
  const [produtos, setProdutos] = useState([])
  const [filteredProdutos, setFilteredProdutos] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split("T")[0])
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const calcularDiasParaValidade = (expiryDate) => {
    if (!expiryDate) return Number.POSITIVE_INFINITY
    const now = new Date()
    const validadeDate = new Date(expiryDate)
    const diffTime = validadeDate - now
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
  const formatDate = (date) => {
    if (!date) return "--"
    try {const d = new Date(date)
      if (isNaN(d)) return "--"; return d.toLocaleDateString("pt-BR")
    } catch { return "--" }
  }

  useEffect(() => {
    const fetchProdutos = async () => {
      setIsLoading(true)
      try {
        const produtosRef = ref(db, "Estoque")
        const snapshot = await get(produtosRef)
        if (snapshot.exists()) {
          const data = snapshot.val()
          let produtosList = Object.entries(data).map(([id, produto]) => ({id, ...produto, dataValidade: produto.dataValidade || produto.expiryDate || null, 
            validadeStatus: calcularDiasParaValidade(produto.dataValidade || produto.expiryDate),}))
          // Ordenar por validade (mais crítico primeiro)
          produtosList = produtosList.sort((a, b) => a.validadeStatus - b.validadeStatus)
          setProdutos(produtosList); setFilteredProdutos(produtosList)
          const temProximoVencimento = produtosList.some((p) => p.validadeStatus <= 7)
          if (temProximoVencimento) { toast({ title: "Atenção", description: "Existem produtos próximos do vencimento!", variant: "warning", }) }
        } 
        else {setProdutos([]); setFilteredProdutos([])}
      } catch (error) {
        console.error("Erro ao buscar produtos:", error)
        toast({title: "Erro", description: "Não foi possível carregar produtos do estoque.", variant: "error",})
      } 
      finally {setIsLoading(false)}
    }; fetchProdutos();}, [])


  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProdutos(produtos)
    } 
    else { 
      let filtered = produtos.filter(
        (produto) => (produto.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || (produto.sku || "").toLowerCase().includes(searchTerm.toLowerCase()))
      // Ordenar também os filtrados
      filtered = filtered.sort((a, b) => a.validadeStatus - b.validadeStatus); setFilteredProdutos(filtered)
    }}, [searchTerm, produtos])

  const handleProdutoSelecionado = (produto) => {
    setSku(produto.sku || ""); setName(produto.name || ""); setMarca(produto.marca || ""); 
    setCategory(produto.category || ""); setTipo(produto.tipo || ""); setPeso(produto.peso || "");
    setQuantidadeDisponivel(Number(produto.quantity) || 0); setQuantity(""); setIsModalOpen(false);
    toast({description: `Produto "${produto.name}" selecionado!`, variant: "success", duration: 2000})
  }

  const handleRetirada = async () => {
      if (!sku || !name || !marca || !category || !tipo || !quantity || !peso || !retirante) {
        toast({description: "Por favor, preencha todos os campos.", variant: "error"})
        return;
      }
    const retiradaNum = Number(quantity)
      if (isNaN(retiradaNum) || retiradaNum <= 0) {
        toast({description: "A quantidade deve ser um número maior que zero.",variant: "error",})
        return
      } setIsSubmitting(true);
    
    try {
      const estoqueRef = ref(db, "Estoque")
      const snapshot = await get(estoqueRef)
        if (!snapshot.exists()) {
          toast({description: "Não foi possível encontrar produtos no estoque.", variant: "error",})
          return;
        }
      const estoqueData = snapshot.val()
      const produtoEncontrado = Object.entries(estoqueData).find(([_, produto]) => produto.sku === sku)
        if (!produtoEncontrado) {
          toast({description: "Este produto não existe no estoque.", variant: "error",})
          return;
        }
      const [produtoId, produto] = produtoEncontrado
      const estoqueAtual = Number(produto.quantity)
        if (retiradaNum > estoqueAtual) {
          toast({description: `Quantidade solicitada (${retiradaNum}) maior que disponível (${estoqueAtual}).`, variant: "error",})
          return;
        }
      await push(ref(db, "Retiradas"), {sku, name, marca, category, tipo, quantity: retiradaNum, peso, retirante, dataPedido: dataSelecionada,})
      const novaQuantidade = estoqueAtual - retiradaNum
      const produtoRef = ref(db, `Estoque/${produtoId}`)
        if (novaQuantidade <= 0) {
          await remove(produtoRef)
          toast({description: "Produto removido do estoque após retirada.", variant: "success", })
          setProdutos((prev) => prev.filter((p) => p.sku !== sku))
        } 
        else {
          await update(produtoRef, { quantity: novaQuantidade })
          toast({description: `${retiradaNum} unidades retiradas por ${retirante}.`, variant: "success",})
          setProdutos((prev) => prev.map((p) => (p.sku === sku ? { ...p, quantity: novaQuantidade } : p)))
        }

      setSku(""); setName(""); setMarca(""); setCategory(""); setTipo(""); setQuantity(""); setPeso(""); setRetirante("");
      setDataSelecionada(new Date().toISOString().split("T")[0]); setQuantidadeDisponivel(0);
    } catch (error) {console.error(error);
      toast({ description: "Não foi possível registrar a retirada.", variant: "error" })
    } finally {setIsSubmitting(false); }
  }

  const getValidadeBadge = (dias) => {
    if (dias <= 0)
      return (<Badge variant="destructive" className="flex items-center gap-1 animate-pulse"><XCircle className="w-3 h-3" /> Vencido</Badge>)
    if (dias <= 7)
      return (<Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Crítico</Badge>)
    if (dias <= 30)
      return (<Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Atenção</Badge>)
      return (<Badge variant="outline" className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Normal</Badge>)
  }

  const isFormValid = sku && name && marca && category && tipo && quantity && peso && retirante && !isSubmitting

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header aprimorado */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Retirada de Produtos</h1>
                <p className="text-gray-600">Gerencie a saída de produtos do estoque de forma eficiente</p>
              </div>
            </div>
            <Button variant="outline" size="lg" className="flex items-center gap-2 hover:bg-gray-50 transition-colors bg-transparent" onClick={() => navigate("/home-retirada")}>
              <ArrowLeft className="w-4 h-4" /> Voltar</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Formulário Principal - Ocupa mais espaço */}
          <div className="xl:col-span-3">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl"><ShoppingCart className="w-6 h-6" />Informações da Retirada</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Seleção de Produto */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-900">Seleção do Produto</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="sku" className="flex items-center gap-2 text-sm font-medium text-gray-700"> <Hash className="w-4 h-4 text-blue-500" /> SKU do Produto</Label>
                      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                          <div className="relative">
                            <Input id="sku" placeholder={sku ? sku : "Clique para selecionar produto"} value={sku} readOnly
                              className="cursor-pointer h-12 pl-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300 transition-colors" />
                            <Package className="absolute left-4 top-3.5 w-5 h-5 text-blue-500" />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="w-full max-w-5xl max-h-[85vh] flex flex-col">
                          <DialogHeader className="pb-4">
                            <DialogTitle className="flex items-center gap-3 text-xl"><Search className="w-6 h-6 text-blue-500" />Selecionar Produto do Estoque</DialogTitle>
                            <p className="text-gray-600">Encontre e selecione o produto que deseja retirar do estoque</p>
                          </DialogHeader>

                          <div className="flex-1 flex flex-col gap-6 min-h-0">
                            {/* Barra de Busca Aprimorada */}
                            <div className="flex-shrink-0 space-y-3">
                              <div className="relative">
                                <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                <Input placeholder="Buscar por nome do produto ou SKU..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                  className="pl-12 h-14 text-lg border-2 focus:border-blue-500 transition-colors" />
                              </div>
                              {searchTerm && (
                                <div className="flex items-center justify-between">
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">{filteredProdutos.length}</span> produto(s) encontrado(s)</p>
                                  {searchTerm && (<Button variant="ghost" size="sm" onClick={() => setSearchTerm("")} className="text-gray-500 hover:text-gray-700">Limpar busca</Button>)}
                                </div>
                              )}
                            </div>

                            {/* Lista de Produtos Aprimorada */}
                            <div className="flex-1 overflow-y-auto min-h-1">
                              {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                                  <p className="text-gray-600">Carregando produtos...</p>
                                </div>
                              ) : filteredProdutos.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                                  <Package className="w-20 h-20 mb-6 opacity-30" />
                                  <h3 className="text-xl font-medium mb-3">Nenhum produto encontrado</h3>
                                  <p className="text-center max-w-md"> {searchTerm ? "Tente ajustar os termos de busca ou verifique a ortografia" : "Não há produtos disponíveis no estoque no momento"}</p>
                                </div>
                              ) : (
                                <div className="grid gap-4">
                                  {filteredProdutos.map((produto) => (
                                    <Card key={produto.id} onClick={() => handleProdutoSelecionado(produto)}
                                      className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l- border-l-transparent hover:border-l-blue-500 hover:scale-[1.02] bg-gradient-to-r from-white to-gray-50">
                                      <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                          <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-lg text-gray-900 truncate mb-1">{produto.name} - {produto.peso}{produto.unit}</h4>
                                            <p className="text-gray-600 font-medium">{produto.marca}</p>
                                          </div>
                                          <div className="ml-4 flex-shrink-0">{getValidadeBadge(produto.validadeStatus)}</div>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                          <div className="bg-gray-50 p-3 rounded-lg">
                                            <span className="text-gray-500 block mb-1">SKU</span>
                                            <span className="font-mono font-bold text-gray-900">{produto.sku}</span>
                                          </div>
                                          <div className="bg-blue-50 p-3 rounded-lg">
                                            <span className="text-gray-500 block mb-1">Quantidade</span>
                                            <span className="font-bold text-blue-700">{produto.quantity} un.</span>
                                          </div>
                                          <div className="bg-green-50 p-3 rounded-lg">
                                            <span className="text-gray-500 block mb-1">Categoria</span>
                                            <span className="font-medium text-green-700">{produto.category}</span>
                                          </div>
                                          <div className="bg-purple-50 p-3 rounded-lg">
                                            <span className="text-gray-500 block mb-1">Validade</span>
                                            <span className="font-medium text-purple-700">{formatDate(produto.expiryDate)}</span>
                                          </div>
                                        </div>

                                        {produto.validadeStatus <= 7 && (
                                          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                                            <div className="flex items-center gap-3 text-red-700">
                                              <AlertTriangle className="w-5 h-5" />
                                              <span className="font-semibold">{produto.validadeStatus <= 0 ? "⚠️ Produto vencido!" : `⏰ Vence em ${produto.validadeStatus} dias`}</span>
                                            </div>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex-shrink-0 flex items-center justify-between pt-6 border-t bg-gray-50 -mx-6 px-6 -mb-6 pb-6 rounded-b-lg">
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">{filteredProdutos.length}</span> de{" "}
                                <span className="font-medium">{produtos.length}</span> produtos
                              </div>
                              <Button variant="outline" onClick={() => setIsModalOpen(false)} size="lg">Cancelar</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="produto" className="flex items-center gap-2 text-sm font-medium text-gray-700"><Package className="w-4 h-4 text-green-500" /> Nome do Produto</Label>
                      <Input id="produto" value={name} readOnly className="bg-gray-50 h-12 border-gray-200" placeholder="Produto será preenchido automaticamente" />
                    </div>
                  </div>
                </div>

                {/* Informações do Produto */}
                {sku && (
                  <div className="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-gray-900">Detalhes do Produto Selecionado</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="marca" className="flex items-center gap-2 text-sm font-medium text-gray-700"><Tag className="w-4 h-4 text-orange-500" /> Marca</Label>
                        <Input id="marca" value={marca} readOnly className="bg-white border-gray-200 h-11" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoria" className="flex items-center gap-2 text-sm font-medium text-gray-700"><Layers className="w-4 h-4 text-purple-500" /> Categoria</Label>
                        <Input id="categoria" value={category} readOnly className="bg-white border-gray-200 h-11" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tipo" className="flex items-center gap-2 text-sm font-medium text-gray-700"><Package className="w-4 h-4 text-indigo-500" /> Tipo</Label>
                        <Input id="tipo" value={tipo} readOnly className="bg-white border-gray-200 h-11" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="peso" className="flex items-center gap-2 text-sm font-medium text-gray-700"><Weight className="w-4 h-4 text-gray-500" /> Peso</Label>
                        <Input id="peso" value={peso} readOnly className="bg-white border-gray-200 h-11" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantidadeDisponivel" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Package className="w-4 h-4 text-green-500" /> Disponível
                        </Label>
                        <Input id="quantidadeDisponivel" value={`${quantidadeDisponivel} unidades`} readOnly className="bg-green-50 border-green-200 h-11 font-semibold text-green-700" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Informações da Retirada */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-900">Dados da Retirada</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="quantidade" className="flex items-center gap-2 text-sm font-medium text-gray-700"> <ShoppingCart className="w-4 h-4 text-blue-500" /> Quantidade a Retirar</Label>
                      <Input id="quantidade" type="number" min={1} max={quantidadeDisponivel} value={quantity} onChange={(e) => setQuantity(e.target.value)} 
                        placeholder="Digite a quantidade" className="h-12 text-lg border-2 focus:border-blue-500" disabled={!sku} />
                      {quantity && quantidadeDisponivel > 0 && (
                        <p className="text-sm text-gray-600">Restará:{" "} <span className="font-semibold text-green-600"> {quantidadeDisponivel - Number(quantity)} unidades </span></p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="retirante" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <User className="w-4 h-4 text-purple-500" /> Nome do Responsável pela Retirada
                      </Label>
                      <Input id="retirante" value={retirante} onChange={(e) => setRetirante(e.target.value)} placeholder="Quem está retirando o produto?"
                        className="h-12 text-lg border-2 focus:border-purple-500" />
                    </div>

                    <div className="space-y-3 md:col-span-2">
                      <Label htmlFor="dataPedido" className="flex items-center gap-2 text-sm font-medium text-gray-700"> <Calendar className="w-4 h-4 text-green-500" /> Data da Retirada</Label>
                      <Input id="dataPedido" type="date" value={dataSelecionada} onChange={(e) => setDataSelecionada(e.target.value)}
                        max={new Date().toISOString().split("T")[0]} className="h-12 text-lg border-2 focus:border-green-500 max-w-xs" />
                    </div>
                  </div>
                </div>

                {/* Botão de Confirmação */}
                <div className="pt-6 border-t">
                  <Button className={`w-full h-14 text-lg font-semibold transition-all duration-200 ${isFormValid
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl" : "bg-gray-300 cursor-not-allowed"
                      }`} onClick={handleRetirada} disabled={!isFormValid}>
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>Processando Retirada...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3"><CheckCircle2 className="w-6 h-6" />Confirmar Retirada</div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card Produtos em Alerta - Sidebar */}
          <div className="xl:col-span-1">
            <Card className="sticky top-4 shadow-lg border-0 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3"><AlertTriangle className="w-5 h-5" />Produtos em Alerta</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex flex-col items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mb-3"></div>
                      <p className="text-sm text-amber-700">Verificando produtos...</p>
                    </div>
                  ) : produtos.filter((p) => p.validadeStatus <= 7).length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <p className="text-sm text-green-700 font-medium">Nenhum produto em alerta</p>
                      <p className="text-xs text-green-600 mt-1">Todos os produtos estão dentro da validade</p>
                    </div>
                  ) : (produtos.filter((p) => p.validadeStatus <= 7).map((produto) => (
                        <button key={produto.id} onClick={() => handleProdutoSelecionado(produto)}
                          className="w-full text-left p-4 bg-white border-2 border-amber-200 rounded-xl hover:bg-amber-50 hover:border-amber-300 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-amber-900 truncate">{produto.name}</p>
                              <p className="text-xs text-amber-700 font-mono">SKU: {produto.sku}</p>
                            </div>
                            <div className="ml-2 flex-shrink-0">{getValidadeBadge(produto.validadeStatus)}</div>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-center p-2 bg-amber-50 rounded-lg">
                              <span className="text-amber-700">Disponível:</span>
                              <span className="font-bold text-amber-900">{produto.quantity} un.</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-amber-50 rounded-lg">
                              <span className="text-amber-700">Validade:</span>
                              <span className="font-bold text-amber-900">{formatDate(produto.dataValidade || produto.expiryDate)}</span>
                            </div>
                          </div>
                        </button>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  )
}