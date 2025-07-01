import { useEffect, useState } from "react"
import { db } from "../../../../firebase"
import { ref, onValue, push, set, get } from "firebase/database"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input/index"
import { Button } from "@/components/ui/Button/button" 
import { Label } from "@/components/ui/label/index"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/index"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, AlertTriangle, ShoppingCart, Package, Building2, Calendar, FileText, Search, Plus, Minus, Trash2, Check, User, Phone, Mail, Tag, Layers, FolderOpen, ClipboardList, FilePlus, Save } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { auth } from "../../../../firebase" // ajuste o caminho conforme sua estrutura
import { onAuthStateChanged } from "firebase/auth"
import { toast } from "sonner"


export default function BaixoEstoquePage() {
  const navigate = useNavigate()
  const [produtosBaixoEstoque, setProdutosBaixoEstoque] = useState([])
  const [listaCompras, setListaCompras] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [modalFornecedorAberto, setModalFornecedorAberto] = useState(false)
  const [fornecedor, setFornecedor] = useState("")
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null)
  const [buscaFornecedor, setBuscaFornecedor] = useState("")
  const [fornecedores, setFornecedores] = useState([])
  const [periodoInicio, setPeriodoInicio] = useState("")
  const [periodoFim, setPeriodoFim] = useState("")
  const [category, setCategory] = useState("")
  const [tipo, setTipo] = useState("")
  const [projeto, setProjeto] = useState("")
  const [numeroPedido, setNumeroPedido] = useState("")
  const [loading, setLoading] = useState(true)
  const [rascunhosDisponiveis, setRascunhosDisponiveis] = useState([]);
const [modalRascunhosAberto, setModalRascunhosAberto] = useState(false);


  useEffect(() => {
    const estoqueRef = ref(db, "Estoque")
    onValue(estoqueRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const produtos = Object.entries(data).map(([id, item]) => ({ id, ...item }));
        const filtrados = produtos.filter((p) => Number.parseInt(p.quantity) < 5);
        setProdutosBaixoEstoque(filtrados);
      }
      setLoading(false);
    })

    const fornecedoresRef = ref(db, "CadastroFornecedores")
    onValue(fornecedoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {const lista = Object.entries(data).map(([id, item]) => ({ id, ...item })); setFornecedores(lista);}
    })

    const pedidosRef = ref(db, "novosPedidos")
    get(pedidosRef).then((snapshot) => {
      const data = snapshot.val();
      const numero = data ? Object.keys(data).length + 1 : 1;
      setNumeroPedido(`Lista-${numero.toString().padStart(4, "0")}`);
    })}, [])
    // Rascunho lista de compras


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        const rascunhoRef = ref(db, `RascunhosCompras/${userId}`);
        get(rascunhoRef).then((snapshot) => {
          const data = snapshot.val();
          if (data) {setListaCompras(data.listaCompras || []); setFornecedor(data.fornecedor || ""); setFornecedorSelecionado(data.fornecedorSelecionado || null); setPeriodoInicio(data.periodoInicio || ""); setPeriodoFim(data.periodoFim || "");
            setCategory(data.category || ""); setTipo(data.tipo || "");  setProjeto(data.projeto || "");
          }});
    }}); return () => unsubscribe();}, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const userId = user.uid;
    const rascunhoRef = ref(db, `RascunhosCompras/${userId}/auto`);
    const rascunho = {listaCompras, fornecedor, fornecedorSelecionado, periodoInicio, periodoFim, category, tipo, projeto, };
    set(rascunhoRef, rascunho);
  }, [listaCompras, fornecedor, fornecedorSelecionado, periodoInicio, periodoFim, category, tipo, projeto]);

  const salvarComoRascunho = () => {
    const user = auth.currentUser;
    if (!user) return;
    if (listaCompras.length === 0) {
      toast.warning("A lista de compras está vazia."); return; }
    const userId = user.uid;
    const rascunhoRef = push(ref(db, `RascunhosCompras/${userId}`));

    const rascunho = {listaCompras, fornecedor, fornecedorSelecionado, periodoInicio, periodoFim, category, tipo, projeto,  criadoEm: new Date().toISOString(),};
    set(rascunhoRef, rascunho).then(() => toast.success("Rascunho salvo com sucesso!")) .catch((error) => toast.error(`Erro ao salvar: ${error.message}`));
  };
// Final do rascunho

  const adicionarItemLista = (item) => {if (!listaCompras.some((i) => i.id === item.id)) {setListaCompras((prev) => [...prev, { ...item, quantidade: item.quantidade || 1, observacao: item.observacao || "" },])}}
  const removerItemLista = (id) => {setListaCompras((prev) => prev.filter((item) => item.id !== id)) }
  const salvarListaCompras = () => {if (!fornecedorSelecionado || !periodoInicio || !periodoFim || listaCompras.length === 0 || !projeto || !category) {alert("Preencha todos os campos obrigatórios."); return;}
  const novaListaRef = push(ref(db, "novosPedidos"))
  const dataPedidoFormatada = new Date().toISOString().split("T")[0]
  const dataCriacaoFormatada = new Date().toISOString()

  const pedido = { numeroPedido,fornecedor: {cnpj: fornecedorSelecionado.cnpj || "", contato: fornecedorSelecionado.contato || "", email: fornecedorSelecionado.email || "", grupo: fornecedorSelecionado.grupo || "",
      razaoSocial: fornecedorSelecionado.razaoSocial || "", telefone: fornecedorSelecionado.telefone || "",},
      dataPedido: dataPedidoFormatada, dataCriacao: dataCriacaoFormatada, periodoInicio, periodoFim, category, projeto, status: "Pendente",
      produtos: listaCompras.map((item) => ({category, marca: item.marca || "", name: item.name || "",observacao: item.observacao || "", tipo: item.tipo || "",
      peso: item.peso || 1, quantidade: item.quantidade || 1, sku: item.sku || "", supplier: fornecedorSelecionado.razaoSocial || "", unit: item.unit || "", unitMeasure: item.unitMeasure || "",})),
    }
    set(novaListaRef, pedido).then(() => {setListaCompras([]); setModalAberto(false); setFornecedor(""); setFornecedorSelecionado(null); setPeriodoInicio(""); setPeriodoFim(""); setCategory(""); setProjeto("");})
  }

  const atualizarItemLista = (index, campo, valor) => { setListaCompras((prev) => {const novaLista = [...prev]; novaLista[index] = { ...novaLista[index], [campo]: valor }; return novaLista;})}
  const getQuantityColor = (quantity) => {
    const qty = Number.parseInt(quantity);
    if (qty === 0) return "bg-red-100 text-red-800";
    if (qty <= 2) return "bg-orange-100 text-orange-800";
    return "bg-yellow-100 text-yellow-800";
  }

  const getCategoryColor = (categoria) => {
    const colors = {Proteina: "bg-red-100 text-red-800", Mantimento: "bg-yellow-100 text-yellow-800", Hortifrut: "bg-green-100 text-green-800", Doações: "bg-blue-100 text-blue-800", "Produtos de Limpeza": "bg-purple-100 text-purple-800",}
    return colors[categoria] || "bg-gray-100 text-gray-800";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8" />
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-bold">Produtos em Baixo Estoque</CardTitle>
                  <p className="text-orange-100 mt-1">Gerencie produtos com estoque crítico</p>
                </div>
              </div>

              <Button  variant="secondary" onClick={() => {const user = auth.currentUser;
              if (!user) return; const userId = user.uid;
              const rascunhosRef = ref(db, `RascunhosCompras/${userId}`);
              get(rascunhosRef).then((snapshot) => {
                const data = snapshot.val();
                if (data) {const lista = Object.entries(data).map(([id, item]) => ({ id, ...item }));
                  setRascunhosDisponiveis(lista.reverse()); setModalRascunhosAberto(true);} 
                else {alert("Nenhum rascunho encontrado.");
                }
              });
            }} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <FilePlus className="w-4 h-4 mr-2" />Ver Rascunhos</Button>
                                      
              <Button variant="outline" onClick={() => navigate("/Pedidos")} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
            </div>
          </CardHeader>
          <Dialog open={modalRascunhosAberto} onOpenChange={setModalRascunhosAberto}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><ClipboardList className="w-5 h-5 text-blue-600" />Rascunhos Salvos</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {rascunhosDisponiveis.map((r) => (
                <div key={r.id}  className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => {setListaCompras(r.listaCompras || []); setFornecedor(r.fornecedor || ""); setFornecedorSelecionado(r.fornecedorSelecionado || null); setPeriodoInicio(r.periodoInicio || "");
                    setPeriodoFim(r.periodoFim || ""); setCategory(r.category || ""); setTipo(r.tipo || ""); setProjeto(r.projeto || ""); setModalRascunhosAberto(false);}}>
                  <p className="font-medium text-gray-800">Rascunho de {new Date(r.criadoEm).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{r.listaCompras?.length || 0} itens salvos</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        </Card>

        {/* Produtos com Baixo Estoque */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-600" /><span className="font-semibold text-gray-800">{produtosBaixoEstoque.length} produto(s) com estoque baixo</span>
              </div>
              <Badge variant="outline" className="flex items-center gap-1 text-orange-600 border-orange-200"><AlertTriangle className="w-3 h-3" />Estoque crítico</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700"><div className="flex items-center gap-2"><Tag className="w-4 h-4" />SKU</div></TableHead>
                      <TableHead className="font-semibold text-gray-700"><div className="flex items-center gap-2"><Package className="w-4 h-4" />Produto</div></TableHead>
                      <TableHead className="font-semibold text-gray-700"><div className="flex items-center gap-2"><Building2 className="w-4 h-4" />Marca</div></TableHead>
                      <TableHead className="font-semibold text-gray-700">Estoque Atual</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtosBaixoEstoque.map((produto) => (
                      <TableRow key={produto.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-mono text-sm font-medium">{produto.sku}</TableCell>
                        <TableCell className="font-medium">{produto.name}</TableCell>
                        <TableCell>{produto.marca}</TableCell>
                        <TableCell><Badge className={getQuantityColor(produto.quantity)} variant="secondary">{produto.quantity} unidades</Badge></TableCell>
                        <TableCell className="text-center">
                          <Button onClick={() => adicionarItemLista(produto)} size="sm" className="bg-blue-600 hover:bg-blue-700" disabled={listaCompras.some((i) => i.id === produto.id)}>
                            <Plus className="w-4 h-4 mr-1" />{listaCompras.some((i) => i.id === produto.id) ? "Adicionado" : "Adicionar"}</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lista de Compras */}
        {listaCompras.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader className="bg-green-50 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-800">Lista de Compras ({listaCompras.length} itens)</span>
                </div>
                <Button onClick={() => setModalAberto(true)} className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4 mr-2" /> Finalizar Lista</Button>
                <Button onClick={salvarComoRascunho} variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
  <Save className="w-4 h-4 mr-2" />
  Salvar como Rascunho
</Button>

              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-gray-50">
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Observação</TableHead>
                      <TableHead className="text-center">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listaCompras.map((item, index) => (
                      <TableRow key={item.id || index} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.marca}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => atualizarItemLista(index, "quantidade", Math.max(1, (item.quantidade || 1) - 1))} className="h-8 w-8 p-0"><Minus className="w-3 h-3" /></Button>
                            <Input type="number" min="1" className="w-16 h-8 text-center" value={item.quantidade} onChange={(e) => atualizarItemLista(index, "quantidade", Number.parseInt(e.target.value) || 1)} />
                            <Button size="sm" variant="outline" onClick={() => atualizarItemLista(index, "quantidade", (item.quantidade || 1) + 1)} className="h-8 w-8 p-0"><Plus className="w-3 h-3" /></Button>
                          </div>
                        </TableCell>
                        <TableCell><Input type="text" placeholder="Observações..." value={item.observacao || ""} onChange={(e) => atualizarItemLista(index, "observacao", e.target.value)} className="h-8" /></TableCell>
                        <TableCell className="text-center"><Button variant="outline" size="sm" onClick={() => removerItemLista(item.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50" ><Trash2 className="w-4 h-4" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal de Finalizar Lista */}
        <Dialog open={modalAberto} onOpenChange={setModalAberto}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="text-xl font-bold flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" />Finalizar Lista de Compras</DialogTitle></DialogHeader>
            <div className="space-y-6 mt-4">
              {/* Fornecedor */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2"><Building2 className="w-5 h-5 text-blue-600" />Fornecedor</h3>
                <div className="space-y-2">
                  <Label htmlFor="fornecedor">Selecionar Fornecedor *</Label>
                  <Input id="fornecedor" placeholder="Clique para selecionar fornecedor" value={fornecedor} onClick={() => setModalFornecedorAberto(true)} readOnly className="cursor-pointer h-11" />
                </div>
                {fornecedorSelecionado && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"><User className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-600">Contato</p>
                        <p className="font-medium">{fornecedorSelecionado.contato}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"><Phone className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-600">Telefone</p>
                        <p className="font-medium">{fornecedorSelecionado.telefone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"><Mail className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-600">Email</p>
                        <p className="font-medium text-sm">{fornecedorSelecionado.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Período */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2"><Calendar className="w-5 h-5 text-blue-600" />Período que irá suprir</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataInicio">Data Início *</Label>
                    <Input id="dataInicio" type="date" value={periodoInicio} onChange={(e) => setPeriodoInicio(e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataFim">Data Fim *</Label>
                    <Input id="dataFim" type="date" value={periodoFim} onChange={(e) => setPeriodoFim(e.target.value)} className="h-11" />
                  </div>
                </div>
              </div>

              {/* Classificação */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2"><Layers className="w-5 h-5 text-blue-600" />Classificação</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="h-11"><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Proteina">Proteína</SelectItem>
                        <SelectItem value="Mantimento">Mantimento</SelectItem>
                        <SelectItem value="Hortifrut">Hortifrut</SelectItem>
                        <SelectItem value="Doações">Doações</SelectItem>
                        <SelectItem value="Produtos de Limpeza">Produtos de Limpeza</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select value={tipo} onValueChange={setTipo}>
                      <SelectTrigger className="h-11"><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aves">Aves</SelectItem>
                        <SelectItem value="Suínos">Suínos</SelectItem>
                        <SelectItem value="Bovinos">Bovinos</SelectItem>
                        <SelectItem value="Pescados">Pescados</SelectItem>
                        <SelectItem value="Frutas">Frutas</SelectItem>
                        <SelectItem value="Legumes">Legumes</SelectItem>
                        <SelectItem value="Verduras">Verduras</SelectItem>
                        <SelectItem value="ProdutosConsumo">Produtos de Consumo</SelectItem>
                        <SelectItem value="ProdutosLimpeza">Produtos de Limpeza</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projeto">Projeto *</Label>
                    <Select value={projeto} onValueChange={setProjeto}>
                      <SelectTrigger className="h-11"><SelectValue placeholder="Selecione o projeto" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CONDECA">CONDECA</SelectItem>
                        <SelectItem value="FUMCAD">FUMCAD</SelectItem>
                        <SelectItem value="INSTITUTO RECICLAR">Instituto Reciclar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6"><Button onClick={salvarListaCompras} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 h-11 px-8"><Check className="w-4 h-4 mr-2" />Salvar Pedido</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de seleção de fornecedor */}
        <Dialog open={modalFornecedorAberto} onOpenChange={setModalFornecedorAberto}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle className="flex items-center gap-2"><Search className="w-5 h-5 text-blue-600" />Selecionar Fornecedor</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Buscar fornecedor por nome..." value={buscaFornecedor} onChange={(e) => setBuscaFornecedor(e.target.value)} className="pl-10 h-11" />
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {fornecedores.filter((f) => f?.razaoSocial?.toLowerCase().includes(buscaFornecedor.toLowerCase()))
                  .map((forn) => (<div key={forn.id}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200"
                      onClick={() => {setFornecedor(forn.razaoSocial); setFornecedorSelecionado(forn);setModalFornecedorAberto(false);}} role="button" tabIndex={0}
                      onKeyDown={(e) => {if (e.key === "Enter" || e.key === " ") { setFornecedor(forn.razaoSocial); setFornecedorSelecionado(forn);setModalFornecedorAberto(false);}}}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{forn.razaoSocial}</p>
                          <p className="text-sm text-gray-600">{forn.contato}</p>
                        </div>
                        <Badge className={getCategoryColor(forn.grupo)} variant="secondary">{forn.grupo} </Badge>
                      </div>
                    </div>
                  ))}
                {fornecedores.filter((f) => f?.razaoSocial?.toLowerCase().includes(buscaFornecedor.toLowerCase()))
                  .length === 0 && (
                  <div className="text-center py-8">
                    <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Nenhum fornecedor encontrado</p>
                    <p className="text-sm text-gray-400">Tente ajustar o termo de busca</p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}