import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Package, Building2, ArrowLeft, Search, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table";
import { Textarea } from "@/components/ui/textarea/textarea";
import { getDatabase, ref, get, push, set, remove } from "firebase/database";
import { getApp, getApps, initializeApp } from "firebase/app";
import { Badge } from "@/components/ui/badge";
import { getAuth } from "firebase/auth";
import { Button } from "@/components/ui/button";

// CONFIGURAÇÃO DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.appspot.com",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export default function NovoPedido() {
  const navigate = useNavigate();
  const [numeroPedido, setNumeroPedido] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [periodoInicio, setPeriodoInicio] = useState("");
  const [periodoFim, setPeriodoFim] = useState("");
  const [category, setCategory] = useState("");
  const [projeto, setProjeto] = useState("");
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
  const [dadosFornecedor, setDadosFornecedor] = useState({});
  const [showModalFornecedor, setShowModalFornecedor] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [productSelecionado, setProductSelecionado] = useState(null);
  const [dadosProduct, setDadosProduct] = useState({ quantidade: 1, observacao: "" });
  const [showModalProduto, setShowModalProduto] = useState(false);
  const [itensPedido, setItensPedido] = useState([]);
  const [rascunhoDisponivel, setRascunhoDisponivel] = useState(false);
  const [dadosRascunho, setDadosRascunho] = useState(null);

  useEffect(() => {
    setNumeroPedido(`PED${Math.floor(Math.random() * 1000000)}`);

    const fetchFornecedores = async () => {
      const refFornecedor = ref(db, "CadastroFornecedores");
      const snap = await get(refFornecedor);
      if (snap.exists()) setFornecedores(Object.values(snap.val()));
      else toast.error("Nenhum fornecedor encontrado!");
    };

    const fetchProdutos = async () => {
      const refProdutos = ref(db, "EntradaProdutos");
      const snap = await get(refProdutos);
      if (snap.exists()) setProducts(Object.values(snap.val()));
      else toast.error("Nenhum produto encontrado!");
    };

    fetchFornecedores();
    fetchProdutos();
  }, []);

  const handleFornecedorSelect = (f) => {
    setFornecedorSelecionado(f);
    setDadosFornecedor(f);
    setShowModalFornecedor(false);
    toast.success("Fornecedor selecionado!");
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    const rascunhoRef = ref(db, `rascunhosPedidos/${user.uid}`);
    get(rascunhoRef).then((snap) => {
      if (snap.exists()) {
        setRascunhoDisponivel(true);
        setDadosRascunho(snap.val());
      } else {
        setNumeroPedido(`PED${Math.floor(Math.random() * 1000000)}`);
      }
    });
  }, []);

  const aplicarRascunho = () => {
    if (!dadosRascunho) return;
    setNumeroPedido(dadosRascunho.numeroPedido || `PED${Math.floor(Math.random() * 1000000)}`);
    setDataSelecionada(dadosRascunho.dataSelecionada || "");
    setPeriodoInicio(dadosRascunho.periodoInicio || "");
    setPeriodoFim(dadosRascunho.periodoFim || "");
    setCategory(dadosRascunho.category || "");
    setProjeto(dadosRascunho.projeto || "");
    setFornecedorSelecionado(dadosRascunho.fornecedorSelecionado || null);
    setDadosFornecedor(dadosRascunho.dadosFornecedor || {});
    setItensPedido(dadosRascunho.itensPedido || []);
    setRascunhoDisponivel(false);
    toast.success("Rascunho carregado com sucesso!");
  };

  // Função auxiliar para atualizar o rascunho
  const atualizarRascunho = async (novaListaItens) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    const rascunhoRef = ref(db, `rascunhosPedidos/${user.uid}`);
    await set(rascunhoRef, { numeroPedido, dataSelecionada, periodoInicio, periodoFim, category, projeto, fornecedorSelecionado, dadosFornecedor, itensPedido: novaListaItens });
  };

  // Converte o peso unitário sempre para gramas
  const getPesoEmGramas = (item) => {
    if (!item?.peso) return 0;
    if (item.unitMeasure?.toLowerCase() === "kg") {return item.peso * 1000;} return item.peso;};
  
  const handleQuantidadeChange = async (index, value, modoKg = true) => {
    const item = itensPedido[index];
    const pesoUnitario = getPesoEmGramas(item);
    let novaQuantidade = 0;
    let kilosDesejados = item.kilosDesejados || 0;
    if (modoKg) { kilosDesejados = parseFloat(value) || 0;
      if (pesoUnitario > 0) { novaQuantidade = Math.ceil((kilosDesejados * 1000) / pesoUnitario); }
    } 
    else {novaQuantidade = parseInt(value) || 0;
      if (pesoUnitario > 0) {kilosDesejados = (novaQuantidade * pesoUnitario) / 1000;}
    }
    const novaLista = itensPedido.map((prod, i) => i === index ? { ...prod, quantidade: novaQuantidade, kilosDesejados } : prod);
    setItensPedido(novaLista);
    await atualizarRascunho(novaLista);
  };

  const handleObservacaoChange = async (index, novaObs) => { const novaLista = itensPedido.map((item, i) => i === index ? { ...item, observacao: novaObs } : item); setItensPedido(novaLista); await atualizarRascunho(novaLista);};
  const handleProductSelect = (p) => { setProductSelecionado(p); setDadosProduct({ ...p, quantidade: 1, observacao: "" }); setShowModalProduto(false); toast.success("Produto selecionado!");};
  const handleAddProductToOrder = async () => {
    if (!productSelecionado || dadosProduct.quantidade <= 0) {toast.error("Selecione um produto e insira uma quantidade válida!"); return;}
    const novaLista = [...itensPedido, dadosProduct];
    setItensPedido(novaLista);
    setProductSelecionado(null);
    setDadosProduct({ quantidade: 1, observacao: "" });
    await atualizarRascunho(novaLista);
    toast.info("Produto adicionado ao pedido.");
  };
  

  const handleDelete = async (index) => { const clone = [...itensPedido]; clone.splice(index, 1); setItensPedido(clone);  await atualizarRascunho(clone);};
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dataSelecionada || !periodoInicio || !periodoFim || !category || !projeto || !fornecedorSelecionado || itensPedido.length === 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios!"); return;}
    const pedido = { numeroPedido, projeto, dataPedido: dataSelecionada, periodoInicio, periodoFim, category, fornecedor: dadosFornecedor, produtos: itensPedido, status: "Pendente", dataCriacao: new Date().toISOString(), };
    try {
      const pedidosRef = ref(db, "novosPedidos");
      const newPedidoRef = push(pedidosRef);
      await set(newPedidoRef, pedido);
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {const rascunhoRef = ref(db, `rascunhosPedidos/${user.uid}`); await remove(rascunhoRef);}
      toast.success("Pedido finalizado e rascunho removido!");
      setDataSelecionada(""); setPeriodoInicio(""); setPeriodoFim(""); setCategory(""); setProjeto(""); setFornecedorSelecionado(null); setItensPedido([]);
    } catch (error) { toast.error("Erro ao salvar o pedido: " + error.message);}
  };

  const filteredProducts = products.filter((p) => {
    const termo = searchTerm.toLowerCase();
    return (p.name?.toLowerCase().includes(termo) || p.tipo?.toLowerCase().includes(termo) || p.category?.toLowerCase().includes(termo));
  });

  const salvarRascunhoManual = async (e) => {
    e?.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) { toast.error("❌ Usuário não autenticado."); return;}
    const rascunho = {numeroPedido, dataSelecionada, periodoInicio, periodoFim, category, projeto, fornecedorSelecionado, dadosFornecedor, itensPedido,};
    try {
      const rascunhoRef = ref(db, `rascunhosPedidos/${user.uid}`);
      await set(rascunhoRef, rascunho);
      toast.success("✅ Rascunho salvo com sucesso!");
    } catch (error) {
      toast.error("❌ Erro ao salvar rascunho: " + error.message);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      {/* CARD INICIAL DO PEDIDO */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">Cadastro de Pedido</CardTitle>
          <CardDescription className="text-lg"><Badge variant="outline" className="text-lg px-3 py-1">Número do Pedido: {numeroPedido}</Badge>
          </CardDescription>
          <p className="text-gray-600">Preencha os detalhes do pedido abaixo</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="order-date" className="flex items-center gap-2"><Calendar className="h-4 w-4" />Data do Pedido</Label>
            <Input id="order-date" type="date" value={dataSelecionada} onChange={(e) => setDataSelecionada(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="period-start">Período - Início</Label>
            <Input id="period-start" type="date" value={periodoInicio} onChange={(e) => setPeriodoInicio(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="period-end">Período - Fim</Label>
            <Input id="period-end" type="date" value={periodoFim} onChange={(e) => setPeriodoFim(e.target.value)}/>
          </div>
          <div>
            <Label>Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
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
            <Label>Projeto</Label>
            <Select value={projeto} onValueChange={setProjeto}>
              <SelectTrigger><SelectValue placeholder="Selecione o projeto" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="CONDECA">CONDECA</SelectItem>
                <SelectItem value="FUMCAD">FUMCAD</SelectItem>
                <SelectItem value="INSTITUTO RECICLAR">Instituto Reciclar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        {rascunhoDisponivel && (
          <div className="flex justify-center w-full mb-8">
            <Card className="bg-yellow-50 border-yellow-200 shadow-md w-[700px]">
              <CardContent className="p-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-yellow-800 text-sm md:text-base">Você possui um pedido em andamento salvo automaticamente. Deseja continuar de onde parou?</div>
                <div className="flex gap-2">
                  <Button variant="default" onClick={aplicarRascunho}>Continuar Rascunho</Button>
                  <Button variant="outline" onClick={() => setRascunhoDisponivel(false)}> Ignorar </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Card>

      {/* MODAL FORNECEDOR */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Fornecedor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog open={showModalFornecedor} onOpenChange={setShowModalFornecedor}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto"><Plus className="h-4 w-4 mr-2" />Selecionar Fornecedor </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Selecione um Fornecedor</DialogTitle>
                <DialogDescription>Escolha o fornecedor para este pedido</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {fornecedores.map((f) => (
                  <Card key={f.cnpj} className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-semibold">{f.razaoSocial}</h4>
                          <p className="text-sm text-gray-600">CNPJ: {f.cnpj}</p>
                          <p className="text-sm text-gray-600">Grupo: {f.grupo}</p>
                          <p className="text-sm text-gray-600">Contato: {f.contato}</p>
                        </div>
                        <Button onClick={() => handleFornecedorSelect(f)}>Selecionar</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button className="w-full" variant="outline"  onClick={() => navigate("/Cadastro_Fornecedor")}><Plus className="h-4 w-4 mr-2" />Novo Fornecedor</Button>
              </div>
            </DialogContent>
          </Dialog>

          {fornecedorSelecionado && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-800 mb-2">Fornecedor Selecionado</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Razão Social:</strong> {fornecedorSelecionado.razaoSocial}</div>
                  <div><strong>CNPJ:</strong> {fornecedorSelecionado.cnpj}</div>
                  <div><strong>Grupo:</strong> {fornecedorSelecionado.grupo}</div>
                  <div><strong>Contato:</strong> {fornecedorSelecionado.contato}</div>
                  <div><strong>E-mail:</strong> {fornecedorSelecionado.email}</div>
                  <div><strong>Telefone:</strong> {fornecedorSelecionado.telefone}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* MODAL PRODUTOS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"> <Package className="h-5 w-5" />Produtos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog open={showModalProduto} onOpenChange={setShowModalProduto}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />Selecionar Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Selecione um Produto</DialogTitle>
                <DialogDescription>Escolha o produto para adicionar ao pedido</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Filtrar por produto, tipo ou grupo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Grupo</TableHead>
                        <TableHead>Peso</TableHead>
                        <TableHead>Unidade</TableHead>
                        <TableHead>Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.sku}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.tipo}</TableCell>
                          <TableCell>{product.marca}</TableCell>
                          <TableCell><Badge variant="secondary">{product.category}</Badge></TableCell>
                          <TableCell>{product.peso}</TableCell>
                          <TableCell>{product.unitMeasure}</TableCell>
                          <TableCell><Button size="sm" onClick={() => handleProductSelect(product)}>Selecionar</Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Button className="w-full" variant="outline" onClick={() => navigate("/Cadastro_Geral")}> <Plus className="h-4 w-4 mr-2" /> Cadastrar Novo Produto </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* CARD DO PRODUTO SELECIONADO */}
          {productSelecionado && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 space-y-4">
                <h4 className="font-semibold text-blue-800">Produto Selecionado</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label>SKU</Label>
                    <Input value={dadosProduct.sku} readOnly />
                  </div>
                  <div>
                    <Label>Nome</Label>
                    <Input value={dadosProduct.name} readOnly />
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Input value={dadosProduct.tipo} readOnly />
                  </div>
                  <div>
                    <Label>Marca</Label>
                    <Input value={dadosProduct.marca || ""} onChange={(e) => setDadosProduct({ ...dadosProduct, marca: e.target.value })} />
                  </div>
                  <div>
                    <Label>Grupo</Label>
                    <Input value={dadosProduct.category} readOnly />
                  </div>
                  <div>
                    <Label>Peso</Label>
                    <Input value={`${dadosProduct.peso} ${dadosProduct.unitMeasure}`} readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantidade *</Label>
                    <Input id="quantity" type="number" min="1" value={dadosProduct.quantidade} onChange={(e) => setDadosProduct({ ...dadosProduct, quantidade: Number(e.target.value) })} placeholder="Digite a quantidade" />
                  </div>
                  <div>
                    <Label htmlFor="observation">Observação</Label>
                    <Textarea id="observation" value={dadosProduct.observacao} onChange={(e) => setDadosProduct({ ...dadosProduct, observacao: e.target.value })} placeholder="Observações sobre o produto..." rows={3} />
                  </div>
                </div>
                <Button onClick={handleAddProductToOrder} className="w-full"><Plus className="h-4 w-4 mr-2" />Adicionar Produto ao Pedido</Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* TABELA DE ITENS DO PEDIDO */}
      {itensPedido.length > 0 && (
        <Card className="text-center">
          <CardHeader><CardTitle>Itens do Pedido</CardTitle></CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Filtrar por produto, tipo ou grupo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Peso</TableHead>
                  <TableHead>Kg Desejados</TableHead>
                  <TableHead>Quantidade Calculada</TableHead>
                  <TableHead>Observação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itensPedido.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.tipo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  item.category.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.tipo}</TableCell>
                      <TableCell><Input className="w-32 text-sm" value={item.marca || ""}
                          onChange={async (e) => {const novaLista = itensPedido.map((prod, i) => i === idx ? { ...prod, marca: e.target.value } : prod); setItensPedido(novaLista); await atualizarRascunho(novaLista);}}/></TableCell>
                      <TableCell><Badge variant="secondary">{item.category}</Badge></TableCell>
                      <TableCell>{item.peso} {item.unitMeasure}</TableCell>
                      {/* Campo 1: Kg desejados */}
                      <TableCell>
                        <Input type="number" min="0" step="0.1" className="w-24 border rounded px-2 py-1 text-sm text-center"
                          value={item.kilosDesejados || ""} onChange={(e) => handleQuantidadeChange(idx, parseFloat(e.target.value) || 0, true) } placeholder="Kg" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" min="0" className="w-24 border rounded px-2 py-1 text-sm text-center" value={item.quantidade || ""} onChange={(e) => handleQuantidadeChange(idx, parseInt(e.target.value) || 0, false)} placeholder="Qtd"/></TableCell>
                      <TableCell>
                        <Textarea className="w-full min-w-[200px] text-sm" rows={2} value={item.observacao || ""} onChange={(e) => handleObservacaoChange(idx, e.target.value)} placeholder="Digite a observação..." />
                      </TableCell>
                      <TableCell><Button size="sm" variant="destructive" onClick={() => handleDelete(idx)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* BOTOES FINAIS */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/Pedidos")}><ArrowLeft size={16} /> Voltar</Button>
        <Button variant="secondary" onClick={salvarRascunhoManual}>💾 Salvar Rascunho</Button>
        <Button className="bg-green-600 hover:bg-green-700" type="submit" onClick={handleSubmit}>Finalizar Pedido</Button>
      </div>
    </div>
  );
}