import { useState, useEffect } from "react";
import { getDatabase, ref, update, push, get, remove } from "firebase/database";
import { app } from "../../../../firebase";
import { Button } from "@/components/ui/Button/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label/index";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/index";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/hooks/use-toast";
import { Search, Package, AlertTriangle, ArrowLeft, Calendar, User, Hash } from "lucide-react";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Retirada() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const db = getDatabase(app);
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [tipo, setTipo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [marca, setMarca] = useState("");
  const [peso, setPeso] = useState("");
  const [retirante, setRetirante] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split("T")[0]);
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState(0);

  const calcularDiasParaValidade = (expiryDate) => {
    if (!expiryDate) return Infinity;
    const now = new Date();
    const validadeDate = new Date(expiryDate);
    const diffTime = validadeDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Carrega produtos do Firebase
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const produtosRef = ref(db, "Estoque");
        const snapshot = await get(produtosRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const produtosList = Object.entries(data).map(([id, produto]) => ({id, ...produto, validadeStatus: calcularDiasParaValidade(produto.dataValidade || produto.expiryDate),}));
          setProdutos(produtosList);
          setFilteredProdutos(produtosList);
          const temProximoVencimento = produtosList.some(p => p.validadeStatus <= 7);
          if (temProximoVencimento) {
            toast.warn("Atenção: Existem produtos próximos do vencimento!", {position: "top-right", duration: 7000, pauseOnHover: true, closeOnClick: true, draggable: true, });}} 
        else {setProdutos([]); setFilteredProdutos([]);}} 
      catch (error) {console.error("Erro ao buscar produtos:", error); toast.error("Erro ao carregar produtos do estoque.");}

    };
    fetchProdutos();}, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProdutos(produtos);
    } else {
      const filtered = produtos.filter((produto) =>(produto.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || (produto.sku || "").toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredProdutos(filtered);
    }
  }, [searchTerm, produtos]);

  const handleProdutoSelecionado = (produto) => {
    setSku(produto.sku || ""); setName(produto.name || ""); setMarca(produto.marca || ""); setCategory(produto.category || ""); setTipo(produto.tipo || ""); setPeso(produto.peso || "");
    setQuantidadeDisponivel(Number(produto.quantity) || 0); setQuantity(""); setIsModalOpen(false);
  };


  const handleRetirada = async () => {
  if (!sku || !name || !marca || !category || !tipo || !quantity || !peso || !retirante) {
    toast({variant: "destructive", title: "Campos obrigatórios", description: "Por favor, preencha todos os campos.",});
    return;
  }

  const retiradaNum = Number(quantity);
  if (isNaN(retiradaNum) || retiradaNum <= 0) {
    toast({variant: "destructive", title: "Quantidade inválida", description: "A quantidade deve ser um número maior que zero.",});
    return;
  }

  try {
    const estoqueRef = ref(db, "Estoque");
    const snapshot = await get(estoqueRef);

    if (!snapshot.exists()) {
      toast({ variant: "destructive", title: "Estoque vazio",description: "Não foi possível encontrar produtos no estoque.",});
      return;
    }

    const estoqueData = snapshot.val();
    const produtoEncontrado = Object.entries(estoqueData).find(([_, produto]) => produto.sku === sku);

    if (!produtoEncontrado) {
      toast({variant: "destructive", title: "Produto não encontrado",description: "Este produto não existe no estoque.",});
      return;
    }

    const [produtoId, produto] = produtoEncontrado;
    const estoqueAtual = Number(produto.quantity);

    if (retiradaNum > estoqueAtual) {
      toast({variant: "destructive",title: "Quantidade excedida", description: `Solicitada: ${retiradaNum}, disponível: ${estoqueAtual}.`,});
      return;
    }

    // Registrar retirada
    const retiradaRef = ref(db, "Retiradas");
    await push(retiradaRef, {sku, name, marca, category, tipo, quantity: retiradaNum, peso, retirante, dataPedido: dataSelecionada,});
    const novaQuantidade = estoqueAtual - retiradaNum;
    const produtoRef = ref(db, `Estoque/${produtoId}`);

    if (novaQuantidade <= 0) {
      await remove(produtoRef);
      toast({title: "Estoque zerado", description: "Produto removido do estoque após retirada.",});
      setProdutos((prev) => prev.filter((p) => p.sku !== sku));
    } 
    else {
      await update(produtoRef, { quantity: novaQuantidade });
      toast({title: "Retirada realizada", description: "Produto retirado e estoque atualizado."});
      setProdutos((prev) =>prev.map((p) => (p.sku === sku ? { ...p, quantity: novaQuantidade } : p)));
    }
    setSku(""); setName(""); setMarca(""); setCategory(""); setTipo(""); setQuantity(""); setPeso(""); setRetirante("");
    setDataSelecionada(new Date().toISOString().split("T")[0]); setQuantidadeDisponivel(0);
  } 
  catch (error) {
    console.error(error);
    toast({variant: "destructive", title: "Erro inesperado", description: "Não foi possível registrar a retirada"});
  }
};

  const formatDate = (date) => {
    if (!date || typeof date !== "string") return "--";
    try {const [y, m, d] = date.slice(0, 10).split("-");
      return `${d}/${m}/${y}`;} 
    catch {return "--";}
  };

  const getValidadeBadge = (dias) => {
    if (dias <= 0) {return (<Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Vencido</Badge>);} 
    else if (dias <= 7) {return (<Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Crítico</Badge>);}
    else if (dias <= 30) {return (<Badge variant="secondary" className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Atenção</Badge>);}
    return <Badge variant="outline">Normal</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><Package className="w-6 h-6 text-primary" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Retirada de Produtos</h1>
              <p className="text-sm text-gray-600">Gerencie a saída de produtos do estoque</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => navigate("/home-retirada")}><ArrowLeft className="w-4 h-4" /> Voltar</Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" /> Informações da Retirada</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku" className="flex items-center gap-2"><Hash className="w-4 h-4" /> SKU</Label>
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                      <DialogTrigger asChild><Input id="sku" placeholder="Clique para selecionar produto" value={sku} readOnly className="cursor-pointer"/></DialogTrigger>
                      <DialogContent className="w-full max-w-3xl max-h-[80vh] flex flex-col">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2"><Search className="w-5 h-5" />Selecionar Produto do Estoque</DialogTitle>
                          <p className="text-sm text-gray-600">Encontre e selecione o produto que deseja retirar do estoque</p>
                        </DialogHeader>
                        <div className="flex-1 flex flex-col gap-4 min-h-0">
                          {/* Barra de Busca */}
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                              <Input placeholder="Buscar por nome do produto ou SKU..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-12" />
                            </div>
                            {searchTerm && (<p className="text-sm text-gray-600 mt-2">{filteredProdutos.length} produto(s) encontrado(s)</p>)}
                          </div>
                          {/* Lista de Produtos */}
                          <div className="flex-1 overflow-y-auto min-h-0">
                            {filteredProdutos.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-12 text-gray-500"><Package className="w-26 h-16 mb-4 opacity-50" />
                                <h3 className="text-lg font-medium mb-2">Nenhum produto encontrado</h3>
                                <p className="text-sm text-center">{searchTerm ? "Tente ajustar os termos de busca" : "Não há produtos disponíveis no estoque"}</p>
                              </div>) : (
                              <div className="grid gap-3">
                                {filteredProdutos.map((produto) => (
                                  <Card key={produto.id} onClick={() => handleProdutoSelecionado(produto)} className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-transparent hover:border-l-primary">
                                    <CardContent className="p-4">
                                      <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1 min-w-0">
                                              <h4 className="font-semibold text-gray-900 truncate">{produto.name}</h4>
                                              <p className="text-sm text-gray-600">{produto.marca}</p>
                                            </div>
                                            <div className="ml-4 flex-shrink-0">{getValidadeBadge(produto.validadeStatus)}
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                            <div>
                                              <span className="text-gray-500 block">SKU</span>
                                              <span className="font-mono font-medium"> {produto.sku}</span>
                                            </div>
                                            <div>
                                              <span className="text-gray-500 block">Quantidade</span>
                                              <span className="font-medium">{produto.quantity} un.</span>
                                            </div>
                                            <div>
                                              <span className="text-gray-500 block">Categoria</span>
                                              <span className="font-medium">{produto.category}</span>
                                            </div>
                                            <div>
                                              <span className="text-gray-500 block">Validade</span>
                                              <span className="font-medium">{formatDate(produto.dataValidade || produto.expiryDate)}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                          <Button size="sm" className="whitespace-nowrap" onClick={(e) => {e.stopPropagation(); handleProdutoSelecionado(produto);}}>Selecionar</Button>
                                        </div>
                                      </div>
                                      {produto.validadeStatus <= 7 && (
                                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                                          <div className="flex items-center gap-2 text-red-700">
                                            <AlertTriangle className="w-4 h-4" />
                                            <span className="text-sm font-medium">{produto.validadeStatus <= 0 ? "Produto vencido!" : `Vence em ${produto.validadeStatus} dias`}</span>
                                          </div>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t">
                            <div className="text-sm text-gray-600">{filteredProdutos.length} de {produtos.length}{" "} produtos</div>
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="produto">Produto</Label>
                    <Input id="produto" value={name} readOnly className="bg-gray-50"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marca">Marca</Label>
                    <Input id="marca" value={marca} readOnly className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marca">Categoria</Label>
                    <Input id="marca" value={category} readOnly className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input id="quantidade" type="number" min="1" placeholder="Digite a quantidade" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                    {quantidadeDisponivel > 0 && (<p className="text-sm mt-1 text-muted-foreground">Disponível: <strong>{quantidadeDisponivel}</strong></p>)}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retirante" className="flex items-center gap-2"> <User className="w-4 h-4" />Responsável</Label>
                    <Select value={retirante} onValueChange={setRetirante}>
                      <SelectTrigger><SelectValue placeholder="Selecione o responsável" /></SelectTrigger>
                      <SelectContent className="w-[20px]">
                        <SelectItem value="Camila">Camila</SelectItem>
                        <SelectItem value="Maria José">Maria José</SelectItem>
                        <SelectItem value="Mislene">Mislene</SelectItem>
                        <SelectItem value="Rose">Rose</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data" className="flex items-center gap-2"><Calendar className="w-4 h-4" />Data da Retirada</Label>
                  <Input id="data" type="date" value={dataSelecionada} onChange={(e) => setDataSelecionada(e.target.value)} />
                </div>
                <Button onClick={handleRetirada} className="w-full" size="lg"> Registrar Retirada</Button>
              </CardContent>
            </Card>
          </div>

          {/* Resumo */}
          <div className="space-y-4">
            <Card>
              <CardHeader> <CardTitle className="text-lg">Resumo da Retirada</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {name ? (
                  <>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="font-medium text-blue-900">{name}</p>
                      <p className="text-sm text-blue-700">{marca}</p>
                      <p className="text-xs text-blue-600 font-mono">{sku}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantidade:</span>
                        <span className="font-medium">{quantity || "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Responsável:</span>
                        <span className="font-medium">{retirante || "Não selecionado"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data:</span>
                        <span className="font-medium">{formatDate(dataSelecionada)}</span>
                      </div>
                    </div>
                  </>) : (
                  <div className="text-center py-8 text-gray-500"><Package className="w-12 h-12 mx-auto mb-2 opacity-50" />{" "}<p>Selecione um produto para ver o resumo</p></div>
                )}
              </CardContent>
            </Card>

            {/* Alertas */}
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2 text-amber-800"><AlertTriangle className="w-5 h-5" /> Produtos em Alerta</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {produtos.filter((p) => p.validadeStatus <= 7).map((produto) => (
                      <div key={produto.id} className="flex items-center justify-between p-2 bg-white rounded border border-amber-200">
                        <div>
                          <p className="font-medium text-sm">{produto.name}</p>
                          <p className="text-xs text-gray-600">{produto.sku}</p>
                        </div>
                        {getValidadeBadge(produto.validadeStatus)}
                      </div>
                    ))}
                  {produtos.filter((p) => p.validadeStatus <= 7).length ===0 && (<p className="text-sm text-amber-700">Nenhum produto em alerta</p>)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}