import { useState, useEffect } from "react";
import { ref, onValue, update, db } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/Button/button";
import { Input } from "@/components/ui/input/index";
import { Label } from "@/components/ui/label/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Download, ArrowLeft, Filter, Calendar, Package, TrendingUp, Weight, DollarSign, AlertTriangle, CheckCircle, XCircle, RefreshCw, BarChart3, Eye,
  Edit3, Clock, Building2, Tag, Layers, Hash, Scale, Calculator, CalendarDays, Truck, FolderOpen, Zap, ClipboardEdit, PackageIcon,} from "lucide-react";
import { Textarea } from "@headlessui/react";
import { toast } from "react-toastify";
const dbProdutos = ref(db, "Estoque");

export default function Stock() {
  const [searchTerm, setSearchTerm] = useState("");
  const [productsData, setProductsData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPeso, setTotalPeso] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [filtroInicio, setFiltroInicio] = useState("");
  const [filtroFim, setFiltroFim] = useState("");
  const [editando, setEditando] = useState(null);
  const [valoresEditados, setValoresEditados] = useState({});
  const [statusFiltro, setStatusFiltro] = useState("");
  const [showInventario, setShowInventario] = useState(false);
  const [observacoes, setObservacoes] = useState({});
  const [historicoMes, setHistoricoMes] = useState("");
  const [dadosHistorico, setDadosHistorico] = useState(null);
  const [inventarioData, setInventarioData] = useState([]);
  const [buscaInventario, setBuscaInventario] = useState(""); 
  const [editingField, setEditingField] = useState({ sku: null, field: null });
  const [editValue, setEditValue] = useState("");
  const navigate = useNavigate();
  const calculateTotals = (products) => {const qty = products.reduce((acc, i) => acc + Number.parseInt(i.quantity, 10), 0);
  const peso = products.reduce((acc, i) => acc + Number.parseFloat(i.peso || 0), 0);
  const price = products.reduce((acc, i) => acc + (Number.parseFloat(i.totalPrice) || 0), 0);
  setTotalQuantity(qty); setTotalPeso(peso); setTotalPrice(price);
  };
  // Carregar dados do Firebase uma vez e setar estados
  useEffect(() => {
    const unsubscribe = onValue(dbProdutos, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const products = Object.keys(data).map((key) => ({sku: key, ...data[key],}));
        setProductsData(products); setFilteredProducts(products); calculateTotals(products);
      }
    });return () => unsubscribe();}, []);
  // Recalcula totais sempre que produtos filtrados mudarem
  useEffect(() => {calculateTotals(filteredProducts);}, [filteredProducts]);
  // Função para filtro por termo de busca
  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = productsData.filter((item) => {
      if (!term) return true;
      // Busca por número (SKU)
      if (!isNaN(searchTerm) && searchTerm.trim().length > 0) return String(item.sku) === searchTerm.trim();
      return [item.name, item.supplier, item.marca, item.category, item.tipo, item.status,].some((field) => field?.toLowerCase().includes(term));
    });
    setFilteredProducts(filtered);
  };
  // Função para filtro por intervalo de datas
  const handleDateFilter = () => {
    if (!filtroInicio && !filtroFim) {
      setFilteredProducts(productsData); return;}
    const inicio = filtroInicio ? new Date(filtroInicio) : null;
    const fim = filtroFim ? new Date(filtroFim) : null;
    const filtered = productsData.filter((item) => {
      const cad = item.dateAdded ? new Date(item.dateAdded.slice(0, 10)) : null;
      if (!cad) return false; return (!inicio || cad >= inicio) && (!fim || cad <= fim);});
    setFilteredProducts(filtered);
  };

  const clearDateFilter = () => {setFiltroInicio(""); setFiltroFim(""); setFilteredProducts(productsData);};
  // Navegação para home
  const voltar = () => navigate("/Home");
  // Calcular dias para consumo (aqui pode ser dias para expirar)
  const calculateDaysRemaining = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const exp = new Date(expiryDate);
    const diffTime = exp - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  // Verifica status do produto (estoque baixo, vencido, abastecido)
  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const daysRemaining = calculateDaysRemaining(expiryDate);
    return daysRemaining < 0;
  };
  const getStatus = (item) => {if (Number.parseInt(item.quantity, 10) < 5) return "Estoque Baixo"; if (isExpired(item.expiryDate)) return "Produto Vencido"; return "Estoque Abastecido";};
  // Filtra produtos pelo status
  const handleStatusFilter = (status) => {
    setStatusFiltro(status);
    if (!status || status === "all") {setFilteredProducts(productsData); return;}
    const filtered = productsData.filter((item) => getStatus(item) === status);
    setFilteredProducts(filtered);
  };

  const formatDate = (date) => {
    if (!date) return "--";
    try {
      const d = new Date(date);
      const day = String(d.getUTCDate()).padStart(2, "0");
      const month = String(d.getUTCMonth() + 1).padStart(2, "0");
      const year = d.getUTCFullYear();
      return `${day}/${month}/${year}`;
    } 
    catch {return "--";}
  };
  
  // Inicia a edição inline
  const startEditing = (sku, field, currentValue) => {
    setEditingField({ sku, field });
    if (field === 'expiryDate') {setEditValue(currentValue?.slice(0, 10) || "");} 
    else {setEditValue(currentValue || "");}
  };

  // Salva a edição inline no Firebase
  const handleSaveEdit = async (sku, field) => {
    const valorParaSalvar = editValue;
    if (valorParaSalvar === "") {setEditingField({ sku: null, field: null }); return;}
    const produtoRef = ref(db, `Estoque/${sku}`);
    let updateData = {};
    if (field === 'expiryDate') {updateData = { [field]: new Date(valorParaSalvar).toISOString().split("T")[0] };} 
    else if (field === 'quantity') {updateData = { [field]: Number.parseInt(valorParaSalvar, 10) };}
    else {updateData = { [field]: valorParaSalvar };}
    try {
        await update(produtoRef, updateData); 
        // Atualiza estados locais
        setProductsData(prev => prev.map(i => i.sku === sku ? { ...i, [field]: updateData[field] } : i));
        setFilteredProducts(prev => prev.map(i => i.sku === sku ? { ...i, [field]: updateData[field] } : i));
        setEditingField({ sku: null, field: null });
        toast.success("Produto atualizado com sucesso!");
    } catch (error) {
        console.error("Erro ao salvar a edição:", error);
        toast.error("Erro ao salvar: " + error.message);
    }
  };

  // Exporta os produtos para Excel
  const exportToExcel = (products) => {
    const ws = XLSX.utils.json_to_sheet(
      products.map((item) => ({Status: getStatus(item), SKU: item.sku, Nome: item.name, Marca: item.marca,Peso: Number(item.peso || 0), Quantidade: Number.parseInt(item.quantity, 10) || 0,
        "Valor Unit.": Number(item.unitPrice || 0), "Valor Total": Number(item.totalPrice || 0),  "Data Cadastro": formatDate(item.dateAdded), "Data Validade": formatDate(item.expiryDate),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estoque");
    XLSX.writeFile(wb, "Estoque.xlsx");
  };
  
  // Badges de status para UI
  const getStatusBadge = (item) => {
    const status = getStatus(item);
    if (status === "Produto Vencido") {
      return (
        <Badge variant="destructive" className="flex items-center gap-1.5 px-3 py-1 font-medium shadow-sm"><XCircle className="w-3.5 h-3.5" /> Vencido</Badge>
      );
    }
    if (status === "Estoque Baixo") {
      return (
        <Badge className="flex items-center gap-1.5 px-3 py-1 font-medium bg-amber-100 text-amber-800 border-amber-200 shadow-sm hover:bg-amber-200">
          <AlertTriangle className="w-3.5 h-3.5" /> Baixo</Badge>
      );
    }
    return (
      <Badge className="flex items-center gap-1.5 px-3 py-1 font-medium bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm hover:bg-emerald-200">
        {" "}<CheckCircle className="w-3.5 h-3.5" /> Normal{" "}</Badge>
    );
  };

  // Estatísticas do estoque por status
  const getStockStats = () => {
    const normal = productsData.filter((item) => getStatus(item) === "Estoque Abastecido").length;
    const low = productsData.filter((item) => getStatus(item) === "Estoque Baixo").length;
    const expired = productsData.filter((item) => getStatus(item) === "Produto Vencido").length; return { normal, low, expired };
  };
  const stats = getStockStats();
  // Abre modal de inventário com cópia dos dados para edição
  const handleInventario = () => {
    const dados = productsData.map((p) => ({...p, novaQuantidade: p.quantity, Peso: p.peso})); // garante que o peso seja copiado
    setInventarioData(dados); setShowInventario(true);};
  // Salva inventário atualizado no Firebase e gera log
  const salvarInventario = async () => {
    const agora = new Date();
    // Usa uma data formatada para a chave principal do inventário
    const dataInventario = agora.toISOString().split("T")[0]; 
    const promessas = inventarioData.map(async (item) => {
      const { sku, name, quantity, novaQuantidade, Peso, expiryDate } = item;
      const novaQtd = Number(novaQuantidade || 0);
      // 1. Atualiza o estoque principal (Estoque/SKU)
      await update(ref(db, `Estoque/${sku}`), { quantity: novaQtd });
      // 2. Cria ou atualiza o log de inventário para o dia (inventario/data/SKU)
      await update(ref(db, `Inventarios/${dataInventario}/${sku}`), {sku, nome: name,
        anterior: Number(quantity), atual: novaQtd, Peso: Peso, observacao: observacoes[sku] || "", data: agora.toISOString(), expiryDate: expiryDate || null, });
    });

    try {await Promise.all(promessas); setShowInventario(false);
        toast.success("Inventário salvo com sucesso e estoque atualizado!", {position: "top-right", autoClose: 3000, hideProgressBar: false,});
    } catch (error) {console.error("Erro ao salvar inventário:", error);toast.error("Erro ao salvar inventário. Tente novamente.");}
  };

  // Busca histórico do inventário por mês selecionado (Ajustado para o path "Inventarios")
  const buscarHistorico = () => {
    if (!historicoMes) return;
    const refHist = ref(db, `Inventarios/${historicoMes}`); 
    onValue(refHist,
      (snap) => {setDadosHistorico(snap.val());
        if (!snap.exists()) {toast.info(`Nenhum inventário encontrado para a data ${historicoMes}.`);}
      },
      { onlyOnce: true }
    );
  };
  
  // Função para formatar números em moeda BRL (R$)
  const formatCurrency = (value) => {const num = Number(value || 0); return `R$ ${num.toFixed(2).replace('.', ',')}`;};
  // Função para formatar peso em KG
  const formatWeight = (value) => {const num = Number(value || 0); return `${num.toFixed(2)} KG`;};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <CardHeader className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/20"><Package className="w-8 h-8 text-white" /></div>
                <div>
                  <CardTitle className="text-3xl font-bold text-white mb-1">Controle de Estoque</CardTitle>
                  <p className="text-blue-100 text-sm font-medium">Sistema inteligente de gestão de inventário</p>
                </div>
              </div>
              <Button onClick={voltar} variant="secondary"
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30 transition-all duration-200" ><ArrowLeft className="w-4 h-4" />Voltar </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-emerald-700">Valor Total</p>
                  <p className="text-2xl font-bold text-emerald-900">{/* ✅ Formatação de Moeda */}{formatCurrency(totalPrice)}</p>
                  <p className="text-xs text-emerald-600">Inventário completo</p>
                </div>
                <div className="p-3 bg-emerald-500 rounded-xl shadow-lg"><DollarSign className="w-6 h-6 text-white" /></div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-700">Peso Total</p>
                  <p className="text-2xl font-bold text-blue-900">{formatWeight(totalPeso)}</p>{/* ✅ Formatação de Peso */}
                  <p className="text-xs text-blue-600">Massa do estoque</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-xl shadow-lg">{" "}<Weight className="w-6 h-6 text-white" /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-purple-700">Quantidade Total</p>
                  <p className="text-2xl font-bold text-purple-900">{totalQuantity}</p>
                  <p className="text-xs text-purple-600">Unidades em estoque</p>
                </div>
                <div className="p-3 bg-purple-500 rounded-xl shadow-lg"><TrendingUp className="w-6 h-6 text-white" /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-orange-700">Produtos Ativos</p>
                  <p className="text-2xl font-bold text-orange-900">{filteredProducts.length}</p>
                  <p className="text-xs text-orange-600">Itens filtrados</p>
                </div>
                <div className="p-3 bg-orange-500 rounded-xl shadow-lg"><BarChart3 className="w-6 h-6 text-white" /></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Estoque Normal</p>
                  <p className="text-2xl font-bold">{stats.normal}</p>
                </div><CheckCircle className="w-8 h-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Estoque Baixo</p>
                  <p className="text-2xl font-bold">{stats.low}</p>
                </div> <AlertTriangle className="w-8 h-8 text-amber-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Produtos Vencidos</p>
                  <p className="text-2xl font-bold">{stats.expired}</p>
                </div><XCircle className="w-8 h-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-xl">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <CardTitle className="flex items-center gap-3 text-xl"><div className="p-2 bg-blue-100 rounded-lg"><Filter className="w-5 h-5 text-blue-600" /></div>Filtros e Pesquisa Avançada</CardTitle>
          </CardHeader>
          {/* 🔍 Pesquisa Inteligente */}
          <CardContent className="p-6 space-y-10">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Search className="w-4 h-4" /> Pesquisa Inteligente</Label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input type="text" placeholder="Buscar por SKU, nome, fornecedor, marca, categoria ou tipo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-base border-2 border-slate-200 focus:border-blue-500 rounded-xl shadow-sm"/>
                </div>
                <Button onClick={handleSearch} className="h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg rounded-xl">
                  <Search className="w-4 h-4 mr-2" /> Pesquisar</Button>
              </div>
            </div>
            <Separator />
            {/* 📊 Status do Estoque */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Eye className="w-4 h-4" /> Filtrar por Status do Estoque</Label>
              <select value={statusFiltro} onChange={(e) => handleStatusFilter(e.target.value)}
                className="w-full h-12 p-3 border-2 border-slate-200 rounded-xl bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 shadow-sm text-base">
                <option value="all">🔍 Visualizar todos os status</option>
                <option value="Estoque Abastecido">✅ Estoque Abastecido ({stats.normal} itens)</option>
                <option value="Estoque Baixo">⚠️ Estoque Baixo ({stats.low} itens)</option>
                <option value="Produto Vencido">❌ Produto Vencido ({stats.expired} itens)</option>
              </select>
            </div>
            <Separator />
            {/* 📅 Período de Cadastro */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Calendar className="w-4 h-4" /> Filtro por Período de Cadastro</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-600 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Data Início</Label>
                  <Input type="date" value={filtroInicio} onChange={(e) => setFiltroInicio(e.target.value)}
                    className="h-11 border-2 border-slate-200 focus:border-blue-500 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-600 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Data Fim</Label>
                  <Input type="date" value={filtroFim} onChange={(e) => setFiltroFim(e.target.value)}
                    className="h-11 border-2 border-slate-200 focus:border-blue-500 rounded-lg" />
                </div>
                <div className="col-span-full flex justify-end gap-3">
                  <Button className="h-11 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg rounded-lg" 
                    onClick={handleDateFilter}><Filter className="w-4 h-4 mr-2" /> Aplicar Filtro</Button>
                  <Button onClick={clearDateFilter} variant="outline" className="h-11 border-2 border-slate-200 hover:bg-slate-50 rounded-lg"><RefreshCw className="w-4 h-4 mr-2" /> Limpar Filtros</Button>
                </div>
              </div>
            </div>
            <Separator />
            {/* 📆 Histórico Mensal */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-slate-700">Consultar Estoque de um Dia (Formato YYYY-MM-DD):</Label>
              <div className="flex items-center gap-4">
                <Input type="date" value={historicoMes} onChange={(e) => setHistoricoMes(e.target.value)}
                  className="w-48 h-11 border-2 border-slate-200 focus:border-blue-500 rounded-lg" />
                <Button onClick={buscarHistorico} className="h-11 bg-purple-600 hover:bg-purple-700"><FolderOpen className="w-4 h-4 mr-2" /> Buscar Histórico</Button>
              </div>
              {dadosHistorico && (
                <div className="mt-6 bg-white rounded-xl shadow-lg border border-slate-200 p-4">
                  <h3 className="font-semibold text-lg text-slate-800 mb-3 flex items-center gap-2"><Clock className="w-5 h-5 text-slate-600" />Inventário do Dia {formatDate(historicoMes)}</h3>
                  <div className="max-h-60 overflow-y-auto space-y-3">
                    {Object.entries(dadosHistorico).map(([sku, info]) => (
                      <div key={sku} className="border border-slate-100 p-3 rounded-lg bg-slate-50 shadow-sm">
                        <p className="font-bold text-slate-800 flex items-center justify-between"><span>{info.nome}</span> <span className="font-mono text-sm text-slate-500">SKU: {sku}</span></p>
                        <p className="text-sm text-slate-600 mt-1"><span className="text-red-500">Anterior: {info.anterior}</span> → 
                        <span className="text-green-600 font-semibold">Atual: {info.atual}</span> | Peso: {Number(info.Peso || 0).toFixed(2)} KG
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Obs: {info.observacao || "Nenhuma observação."}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Separator />
            {/* 📋 Inventário */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button onClick={handleInventario}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2 flex items-center gap-2 shadow-md hover:shadow-lg transition-all"><ClipboardEdit className="w-4 h-4" /> Realizar Inventário
              </Button>
              <Button onClick={() => navigate("/visualizar-inventario")} variant="outline" className="border-2 border-slate-200 rounded-lg shadow-sm hover:bg-slate-50">Visualizar Inventário</Button>
            </div>
            {/* 📋 Modal de Inventário */}
            {showInventario && (
              <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center p-4 overflow-auto backdrop-blur-sm">
                <div className="bg-white rounded-xl w-full max-w-6xl p-8 shadow-2xl space-y-6 transform transition-all duration-300 scale-95 opacity-0 animate-in fade-in zoom-in-95">
                  <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-3"><ClipboardEdit className="w-6 h-6" /> Contagem de Estoque (Inventário)</h2>
                  <p className="text-sm text-slate-600">Ajuste a **Nova Quantidade** para refletir a contagem física atual de cada produto.</p>
                  {/* Barra de pesquisa */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input type="text" placeholder="Pesquisar por SKU, nome ou marca..." value={buscaInventario} onChange={(e) => setBuscaInventario(e.target.value)}
                      className="w-full pl-10 h-11 border-2 border-slate-200 rounded-lg" />
                  </div>
                  {/* Tabela de inventário (Ajustada para melhor visualização e scroll) */}
                  <div className="max-h-[60vh] overflow-y-auto border border-slate-200 rounded-lg shadow-inner">
                    <div className="sticky top-0 bg-slate-100 grid grid-cols-10 gap-2 p-3 text-xs font-semibold uppercase text-slate-600 border-b">
                        <div className="col-span-1">SKU</div>
                        <div className="col-span-3">Nome do Produto</div>
                        <div className="col-span-1 text-center">Peso</div>
                        <div className="col-span-1 text-center">Qtd. Atual</div>
                        <div className="col-span-1 text-center text-indigo-700">Nova Qtd.</div>
                        <div className="col-span-2">Observações</div>
                        <div className="col-span-1 text-center">Validade</div>
                    </div>
                    {inventarioData.filter((item) => [item.sku, item.name, item.marca].some((campo) => campo?.toLowerCase().includes(buscaInventario.toLowerCase())))
                      .map((item) => (
                        <div key={item.sku} className="grid grid-cols-10 gap-2 items-center p-3 text-sm border-b hover:bg-slate-50">
                          <div className="col-span-1 font-mono text-xs text-slate-500 truncate">{item.sku || "-"}</div>
                          <div className="col-span-3 font-medium text-slate-700">{item.name}</div>
                          <div className="col-span-1 text-center text-slate-600">
                            {/* ✅ Formatação de Peso no modal */}
                            {Number(item.peso || 0).toFixed(2)} KG
                          </div>
                          <div className="col-span-1 text-center text-slate-600">{item.quantity}</div>
                          <div className="col-span-1">
                            <Input type="number" min="0" className="w-full text-center font-bold text-indigo-600 h-9" value={item.novaQuantidade}
                              onChange={(e) => {
                                const valor = e.target.value; setInventarioData((prev) => prev.map((p) => p.sku === item.sku ? { ...p, novaQuantidade: valor } : p));
                              }} />
                          </div>
                          <div className="col-span-2">
                            <Input placeholder="Obs." className="w-full text-xs h-9" value={observacoes[item.sku] || ""}
                              onChange={(e) => setObservacoes((prev) => ({...prev, [item.sku]: e.target.value,}))}/>
                          </div>
                          <div className="col-span-1 text-center text-xs text-slate-500">{formatDate(item.expiryDate)}</div>
                        </div>
                      ))}
                    {inventarioData.length === 0 && (<div className="text-center p-4 text-gray-500">Nenhum item encontrado no estoque principal.</div>)}
                  </div>
                  {/* Botões do modal */}
                  <div className="flex justify-end gap-3 mt-4">
                    <Button variant="outline" className="h-11 border-2 border-slate-200 hover:bg-slate-50 rounded-lg" onClick={() => setShowInventario(false)}>Cancelar</Button>
                    <Button onClick={salvarInventario} className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md"><Zap className="w-4 h-4 mr-2" /> Salvar Inventário e Atualizar Estoque</Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legenda */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-slate-100">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border">
                <CheckCircle className="w-5 h-5 text-emerald-600" /><span className="font-medium text-slate-700">Estoque Normal</span>
              </div>
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border">
                <AlertTriangle className="w-5 h-5 text-amber-600" /><span className="font-medium text-slate-700">Estoque Baixo de 5 unidades</span>
              </div>
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border">
                <XCircle className="w-5 h-5 text-red-600" /><span className="font-medium text-slate-700">Produto Vencido</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Produtos */}
        <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg"><PackageIcon className="w-5 h-5 text-indigo-600" /></div>
                    <CardTitle className="text-xl">Lista de Produtos em Estoque ({filteredProducts.length})</CardTitle>
                </div>
                <Button onClick={() => exportToExcel(filteredProducts)} className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-4 py-2 flex items-center gap-2">
                  <Download className="w-4 h-4" /> Exportar para Excel</Button>
            </div>
            </CardHeader>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">SKU</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Produto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Qtd.</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Peso (KG)</th> {/* ✅ Formatação aplicada aqui */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Valor Unitário</th> {/* ✅ Formatação aplicada aqui */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Valor Total</th> {/* ✅ Formatação aplicada aqui */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Validade</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {filteredProducts.map((item) => (
                            <tr key={item.sku} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{item.sku}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{item.name}</td>
                                {/* QTD - Edição Inline */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-center">
                                    {editingField.sku === item.sku && editingField.field === 'quantity' ? (
                                        <div className="flex items-center gap-2">
                                            <Input type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => handleSaveEdit(item.sku, 'quantity')}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleSaveEdit(item.sku, 'quantity');
                                                    if (e.key === 'Escape') setEditingField({ sku: null, field: null });
                                                }} autoFocus className="w-20 h-8 p-1 text-center border-blue-500" />
                                            <CheckCircle className="w-4 h-4 text-green-500 cursor-pointer" onClick={() => handleSaveEdit(item.sku, 'quantity')} />
                                        </div>
                                    ) : (
                                        <div onDoubleClick={() => startEditing(item.sku, 'quantity', item.quantity)}
                                          className="cursor-pointer hover:bg-yellow-100/50 p-1 rounded-md min-w-[50px] text-center">{item.quantity}
                                          <Edit3 className="w-3 h-3 text-slate-400 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{formatWeight(item.peso)}</td>{/* ✅ Peso (KG) - Formatação */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{formatCurrency(item.unitPrice)}</td>{/* ✅ Valor Unitário - Formatação */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-700">{formatCurrency(item.totalPrice)}</td>{/* ✅ Valor Total - Formatação */}
                                {/* Data de Validade - Edição Inline */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    {editingField.sku === item.sku && editingField.field === 'expiryDate' ? (
                                        <div className="flex items-center gap-2 group">
                                            <Input type="date" value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => handleSaveEdit(item.sku, 'expiryDate')}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleSaveEdit(item.sku, 'expiryDate');
                                                    if (e.key === 'Escape') setEditingField({ sku: null, field: null });
                                                }}
                                                autoFocus className="w-32 h-8 p-1 border-blue-500" />
                                            <CheckCircle className="w-4 h-4 text-green-500 cursor-pointer" onClick={() => handleSaveEdit(item.sku, 'expiryDate')} />
                                        </div>
                                    ) : (
                                        <div onDoubleClick={() => startEditing(item.sku, 'expiryDate', item.expiryDate)} className="cursor-pointer hover:bg-yellow-100/50 p-1 rounded-md group">
                                            {formatDate(item.expiryDate)}<Edit3 className="w-3 h-3 text-slate-400 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && (<div className="text-center py-10 text-slate-500">Nenhum produto encontrado com os filtros aplicados.</div>)}
            </div>
        </Card>
      </div>
    </div>
  );
}

// Componente para importar estoque via planilha Excel
// (Desativado temporariamente)
// -------------------------------------------------------------------
// import { useState } from "react";
// import * as XLSX from "xlsx";
// import { getDatabase, ref, set } from "firebase/database";
// import { toast } from "react-toastify";
// import { Input } from "@/components/ui/input";
// const db = getDatabase();
// export default function ImportarEstoqueViaPlanilha() {
//   const [loading, setLoading] = useState(false);
//   const safeParseInt = (value) => {
//     const parsed = parseInt(value, 10);
//     return isNaN(parsed) ? 0 : parsed;
//   };
//   const safeParseFloat = (value) => {
//     if (typeof value === "string") value = value.replace(",", ".");
//     const parsed = parseFloat(value);
//     return isNaN(parsed) ? 0 : parsed;
//   };
//   const handleFileUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setLoading(true);dateAdded
//     const reader = new FileReader();
//     reader.onload = async (evt) => {
//       try {
//         const binaryStr = evt.target?.result;
//         const workbook = XLSX.read(binaryStr, { type: "binary" });
//         const firstSheet = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[firstSheet];
//         const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
//         for (const item of jsonData) {
//           const sku = item.sku?.toString().trim();
//           if (!sku) continue;
//           const produto = {
//             sku,
//             name: item.name?.toString().trim() || "",
//             marca: item.marca?.toString().trim() || "",
//             peso: safeParseFloat(item.peso),
//             unit: item.unit?.toString().trim() || "",
//             quantity: safeParseInt(item.quantity),
//             unitPrice: safeParseFloat(item.unitPrice),
//             totalPrice: safeParseFloat(item.totalPrice),
//             expiryDate: item.expiryDate || "",
//             dateAdded: item.dateAdded || new Date().toISOString().split("T")[0],
//             supplier: item.supplier?.toString().trim() || "",
//             category: item.category?.toString().trim() || "",
//             tipo: item.tipo?.toString().trim() || "",
//           };
//           if (isNaN(produto.quantity) || isNaN(produto.peso)) {
//             console.warn("⚠️ Produto ignorado por conter valores inválidos:", produto);
//             continue;
//           }
//           const estoqueRef = ref(db, `Estoque/${sku}`);
//           await set(estoqueRef, produto);
//         }
//         toast.success("✅ Estoque importado com sucesso!");
//       } catch (error) {
//         console.error("❌ Erro ao importar:", error);
//         toast.error("Erro ao importar planilha.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     reader.readAsBinaryString(file);
//   };
//   return (
//     <div className="my-6">
//       <label className="font-medium mb-2 block">
//         📥 Importar planilha de estoque (.xlsx ou .xls)
//       </label>
//       <Input
//         type="file"
//         accept=".xlsx,.xls"
//         onChange={handleFileUpload}
//         disabled={loading}
//       />
//       {loading && <p className="text-blue-700 mt-2">Importando dados para o estoque...</p>}
//     </div>
//   );
// }