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
import {
  Search,
  Download,
  ArrowLeft,
  Filter,
  Calendar,
  Package,
  TrendingUp,
  Weight,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  BarChart3,
  Eye,
  Edit3,
  Clock,
  Building2,
  Tag,
  Layers,
  Hash,
  Scale,
  Calculator,
  CalendarDays,
  Truck,
  FolderOpen,
  Zap,
  ClipboardEdit,
  PackageIcon,
} from "lucide-react";
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
  const [valorEditado, setValorEditado] = useState("");
  const [editando, setEditando] = useState(null);
  const [statusFiltro, setStatusFiltro] = useState("");
  const [showInventario, setShowInventario] = useState(false);
  const [observacoes, setObservacoes] = useState({});
  const [historicoMes, setHistoricoMes] = useState("");
  const [dadosHistorico, setDadosHistorico] = useState(null);
  const [inventarioData, setInventarioData] = useState([]);
  const [buscaInventario, setBuscaInventario] = useState(""); // <- adicionado

  const navigate = useNavigate();

  // Função para calcular totais (quantidade, peso, preço)
  const calculateTotals = (products) => {
    const qty = products.reduce(
      (acc, i) => acc + Number.parseInt(i.quantity, 10),
      0
    );
    const peso = products.reduce(
      (acc, i) => acc + Number.parseFloat(i.peso || 0),
      0
    );
    const price = products.reduce(
      (acc, i) => acc + (Number.parseFloat(i.totalPrice) || 0),
      0
    );
    setTotalQuantity(qty);
    setTotalPeso(peso);
    setTotalPrice(price);
  };

  // Carregar dados do Firebase uma vez e setar estados
  useEffect(() => {
    const unsubscribe = onValue(dbProdutos, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const products = Object.keys(data).map((key) => ({
          sku: key,
          ...data[key],
        }));
        setProductsData(products);
        setFilteredProducts(products);
        calculateTotals(products);
      }
    });
    return () => unsubscribe();
  }, []);

  // Recalcula totais sempre que produtos filtrados mudarem
  useEffect(() => {
    calculateTotals(filteredProducts);
  }, [filteredProducts]);

  // Função para filtro por termo de busca
  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = productsData.filter((item) => {
      if (!term) return true;
      if (!isNaN(searchTerm)) return String(item.sku) === searchTerm.trim();
      return [
        item.name,
        item.supplier,
        item.marca,
        item.category,
        item.tipo,
        item.status,
      ].some((field) => field?.toLowerCase().includes(term));
    });
    setFilteredProducts(filtered);
  };

  // Função para filtro por intervalo de datas
  const handleDateFilter = () => {
    if (!filtroInicio && !filtroFim) {
      setFilteredProducts(productsData);
      return;
    }
    const inicio = filtroInicio ? new Date(filtroInicio) : null;
    const fim = filtroFim ? new Date(filtroFim) : null;

    const filtered = productsData.filter((item) => {
      const cad = item.dateAdded ? new Date(item.dateAdded.slice(0, 10)) : null;
      if (!cad) return false;
      return (!inicio || cad >= inicio) && (!fim || cad <= fim);
    });
    setFilteredProducts(filtered);
  };

  const clearDateFilter = () => {
    setFiltroInicio("");
    setFiltroFim("");
    setFilteredProducts(productsData);
  };

  // Navegação para home
  const voltar = () => navigate("/Home");

  // Calcular dias para consumo
  const calculateConsumptionDays = (dateAdded, expiryDate) => {
    const today = new Date();
    const exp = new Date(expiryDate);
    const diff = exp - today;
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  // Verifica status do produto (estoque baixo, vencido, abastecido)
  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = new Date(expiryDate);
    exp.setHours(0, 0, 0, 0);
    return exp < today;
  };

  const getStatus = (item) => {
    if (Number.parseInt(item.quantity, 10) < 5) return "Estoque Baixo";
    if (isExpired(item.expiryDate)) return "Produto Vencido";
    return "Estoque Abastecido";
  };

  // Filtra produtos pelo status
  const handleStatusFilter = (status) => {
    setStatusFiltro(status);
    if (!status) {
      setFilteredProducts(productsData);
      return;
    }
    const filtered = productsData.filter((item) => getStatus(item) === status);
    setFilteredProducts(filtered);
  };

  // Formata data para dd/mm/yyyy sem shift de fuso
  const formatDate = (date) => {
    if (!date) return "--";
    try {
      const d = new Date(date);
      const day = String(d.getUTCDate()).padStart(2, "0");
      const month = String(d.getUTCMonth() + 1).padStart(2, "0");
      const year = d.getUTCFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return "--";
    }
  };
  // Edição inline da data de validade
  const handleDoubleClick = (sku, value) => {
    setEditando(sku);
    setValorEditado(value?.slice(0, 10) || "");
  };
  const handleChange = (e) => setValorEditado(e.target.value);
  const handleSave = (sku) => {
    if (!valorEditado) return;
    const formatted = new Date(valorEditado).toISOString().split("T")[0];
    const produtoRef = ref(db, `Estoque/${sku}`);
    update(produtoRef, { expiryDate: formatted })
      .then(() => {
        setProductsData((prev) =>
          prev.map((i) => (i.sku === sku ? { ...i, expiryDate: formatted } : i))
        );
        setFilteredProducts((prev) =>
          prev.map((i) => (i.sku === sku ? { ...i, expiryDate: formatted } : i))
        );
        setEditando(null);
      })
      .catch(console.error);
  };

  // Exporta os produtos para Excel
  const exportToExcel = (products) => {
    const ws = XLSX.utils.json_to_sheet(
      products.map((item) => ({
        Status:
          Number.parseInt(item.quantity, 10) < 5
            ? "Estoque baixo"
            : isExpired(item.expiryDate)
            ? "Produto vencido"
            : "Estoque Abastecido",
        SKU: item.sku,
        Nome: item.name,
        Marca: item.marca,
        Peso: item.peso,
        Quantidade: item.quantity,
        // Adicione mais campos se desejar
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estoque");
    XLSX.writeFile(wb, "Estoque.xlsx");
  };
  // Badges de status para UI
  const getStatusBadge = (item) => {
    const low = Number.parseInt(item.quantity, 10) < 5;
    const expired = isExpired(item.expiryDate);
    if (expired) {
      return (
        <Badge
          variant="destructive"
          className="flex items-center gap-1.5 px-3 py-1 font-medium shadow-sm"
        >
          <XCircle className="w-3.5 h-3.5" /> Vencido
        </Badge>
      );
    }
    if (low) {
      return (
        <Badge className="flex items-center gap-1.5 px-3 py-1 font-medium bg-amber-100 text-amber-800 border-amber-200 shadow-sm hover:bg-amber-200">
          <AlertTriangle className="w-3.5 h-3.5" /> Baixo
        </Badge>
      );
    }
    return (
      <Badge className="flex items-center gap-1.5 px-3 py-1 font-medium bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm hover:bg-emerald-200">
        {" "}
        <CheckCircle className="w-3.5 h-3.5" /> Normal{" "}
      </Badge>
    );
  };

  // Estatísticas do estoque por status
  const getStockStats = () => {
    const normal = filteredProducts.filter(
      (item) => getStatus(item) === "Estoque Abastecido"
    ).length;
    const low = filteredProducts.filter(
      (item) => getStatus(item) === "Estoque Baixo"
    ).length;
    const expired = filteredProducts.filter(
      (item) => getStatus(item) === "Produto Vencido"
    ).length;
    return { normal, low, expired };
  };

  const stats = getStockStats();

// Abre modal de inventário com cópia dos dados para edição
const handleInventario = () => {
  const dados = productsData.map((p) => ({
    ...p,
    novaQuantidade: p.quantity,
    Peso: p.peso // garante que o peso seja copiado
  }));
  setInventarioData(dados);
  setShowInventario(true);
};

// Salva inventário atualizado no Firebase e gera log
const salvarInventario = async () => {
  const agora = new Date();
  const dataFormatada = agora.toISOString().split("T")[0]; // YYYY-MM-DD

  const promessas = inventarioData.map(async (item) => {
    const { sku, name, quantity, novaQuantidade, Peso, expiryDate } = item; // pega Peso do item
    const novaQtd = Number(novaQuantidade || 0);

    // Atualiza estoque
    await update(ref(db, `Estoque/${sku}`), { quantity: novaQtd });

    // Atualiza ou cria registro no inventário do dia
    await update(ref(db, `inventario/${dataFormatada}/${sku}`), {
      sku,
      nome: name,
      anterior: Number(quantity),
      atual: novaQtd,
      Peso: Peso, // usa o peso do item
      observacao: observacoes[sku] || "",
      data: agora.toISOString(),
      expiryDate: expiryDate || null, // salva a data de validade
    });
  });

  await Promise.all(promessas);

  setShowInventario(false);
  toast.success("Inventário salvo com sucesso!", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};


  // Busca histórico do inventário por mês selecionado
  const buscarHistorico = () => {
    if (!historicoMes) return;
    const refHist = ref(db, `Inventarios/${historicoMes}`);
    onValue(
      refHist,
      (snap) => {
        setDadosHistorico(snap.val());
      },
      { onlyOnce: true }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <CardHeader className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/20">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold text-white mb-1">
                    Controle de Estoque
                  </CardTitle>
                  <p className="text-blue-100 text-sm font-medium">
                    Sistema inteligente de gestão de inventário
                  </p>
                </div>
              </div>
              <Button
                onClick={voltar}
                variant="secondary"
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-emerald-700">
                    Valor Total
                  </p>
                  <p className="text-2xl font-bold text-emerald-900">
                    R$ {totalPrice.toFixed(2).replace(".", ",")}
                  </p>
                  <p className="text-xs text-emerald-600">
                    Inventário completo
                  </p>
                </div>
                <div className="p-3 bg-emerald-500 rounded-xl shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-700">
                    Peso Total
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {totalPeso.toFixed(2)} KG
                  </p>
                  <p className="text-xs text-blue-600">Massa do estoque</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                  {" "}
                  <Weight className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-purple-700">
                    Quantidade Total
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {totalQuantity}
                  </p>
                  <p className="text-xs text-purple-600">Unidades em estoque</p>
                </div>
                <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-orange-700">
                    Produtos Ativos
                  </p>
                  <p className="text-2xl font-bold text-orange-900">
                    {filteredProducts.length}
                  </p>
                  <p className="text-xs text-orange-600">Itens filtrados</p>
                </div>
                <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
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
                  <p className="text-emerald-100 text-sm font-medium">
                    Estoque Normal
                  </p>
                  <p className="text-2xl font-bold">{stats.normal}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">
                    Estoque Baixo
                  </p>
                  <p className="text-2xl font-bold">{stats.low}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-amber-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">
                    Produtos Vencidos
                  </p>
                  <p className="text-2xl font-bold">{stats.expired}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-xl">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Filter className="w-5 h-5 text-blue-600" />
              </div>
              Filtros e Pesquisa Avançada
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-10">
            {/* 🔍 Pesquisa Inteligente */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Search className="w-4 h-4" /> Pesquisa Inteligente
              </Label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Buscar por SKU, nome, fornecedor, marca, categoria ou tipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-base border-2 border-slate-200 focus:border-blue-500 rounded-xl shadow-sm"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg rounded-xl"
                >
                  <Search className="w-4 h-4 mr-2" /> Pesquisar
                </Button>
              </div>
            </div>

            <Separator />

            {/* 📊 Status do Estoque */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Eye className="w-4 h-4" /> Filtrar por Status do Estoque
              </Label>
              <select
                value={statusFiltro}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="w-full h-12 p-3 border-2 border-slate-200 rounded-xl bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 shadow-sm text-base"
              >
                <option value="all">🔍 Visualizar todos os status</option>
                <option value="Estoque Abastecido">
                  ✅ Estoque Abastecido ({stats.normal} itens)
                </option>
                <option value="Estoque Baixo">
                  ⚠️ Estoque Baixo ({stats.low} itens)
                </option>
                <option value="Produto Vencido">
                  ❌ Produto Vencido ({stats.expired} itens)
                </option>
              </select>
            </div>

            <Separator />

            {/* 📅 Período de Cadastro */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Filtro por Período de Cadastro
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-600 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" /> Data Início
                  </Label>
                  <Input
                    type="date"
                    value={filtroInicio}
                    onChange={(e) => setFiltroInicio(e.target.value)}
                    className="h-11 border-2 border-slate-200 focus:border-blue-500 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-600 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" /> Data Fim
                  </Label>
                  <Input
                    type="date"
                    value={filtroFim}
                    onChange={(e) => setFiltroFim(e.target.value)}
                    className="h-11 border-2 border-slate-200 focus:border-blue-500 rounded-lg"
                  />
                </div>

                <div className="col-span-full flex justify-end gap-3">
                  <Button
                    onClick={handleDateFilter}
                    className="h-11 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg rounded-lg"
                  >
                    <Filter className="w-4 h-4 mr-2" /> Aplicar Filtro
                  </Button>
                  <Button
                    onClick={clearDateFilter}
                    variant="outline"
                    className="h-11 border-2 border-slate-200 hover:bg-slate-50 rounded-lg"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Limpar Filtros
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* 📆 Histórico Mensal */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-slate-700">
                Consultar Estoque de um Mês:
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  type="month"
                  value={historicoMes}
                  onChange={(e) => setHistoricoMes(e.target.value)}
                  className="w-48 h-11 border-2 border-slate-200 focus:border-blue-500 rounded-lg"
                />
                <Button onClick={buscarHistorico} className="h-11">
                  Buscar
                </Button>
              </div>

              {dadosHistorico && (
                <div className="mt-6 bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Estoque de {historicoMes}
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(dadosHistorico).map(([sku, info]) => (
                      <div key={sku} className="border p-2 rounded">
                        <p>
                          <strong>{info.nome}</strong> (SKU: {sku})
                        </p>
                        <p>
                          Anterior: {info.anterior} → Atual: {info.atual}
                        </p>
                        <p>Observação: {info.observacao || "--"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* 📋 Inventário */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button
                onClick={handleInventario}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2 flex items-center gap-2"
              >
                <ClipboardEdit className="w-4 h-4" /> Realizar Inventário
              </Button>
              <Button
                onClick={() => navigate("/visualizar-inventario")}
                variant="outline"
                className="border-2 border-slate-200 rounded-lg"
              >
                Visualizar Inventário
              </Button>
            </div>

            {/* 📋 Modal de Inventário */}
            {showInventario && (
              <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-start pt-10 overflow-auto">
                <div className="bg-white rounded-lg w-full max-w-5xl p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Estoque Semanal
                  </h2>

                  {/* Barra de pesquisa */}
                  <Input
                    type="text"
                    placeholder="Pesquisar por SKU, nome ou marca..."
                    value={buscaInventario}
                    onChange={(e) => setBuscaInventario(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                  />

                  {/* Lista de produtos */}
                  <div className="max-h-[60vh] overflow-y-auto border rounded divide-y">
                    {inventarioData
                      .filter((item) =>
                        [item.sku, item.name, item.marca].some((campo) =>
                          campo
                            ?.toLowerCase()
                            .includes(buscaInventario.toLowerCase())
                        )
                      )
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col md:flex-row gap-4 py-3 px-2 hover:bg-gray-50"
                        >
                          <div className="w-28 font-mono text-sm text-gray-600">
                            {item.sku || "-"}
                          </div>
                          <div className="flex-1">
                            {item.name}{" "} {item.peso}{item.unit}
                            <span className="text-sm text-slate-500">
                              (Atual: {item.quantity})
                            </span>
                          </div>
                          <div className="w-32 text-gray-700">
                            {item.marca || "-"}
                          </div>
                          <div className="w-28 text-gray-700">
                            {formatDate(item.expiryDate || "-")}
                          </div>
                          <Input
                            type="number"
                            min="0"
                            className="w-24"
                            value={item.novaQuantidade}
                            onChange={(e) => {
                              const valor = e.target.value;
                              setInventarioData((prev) =>
                                prev.map((p) =>
                                  p.sku === item.sku
                                    ? { ...p, novaQuantidade: valor }
                                    : p
                                )
                              );
                            }}
                          />
                          <Textarea
                            placeholder="Observações"
                            className="flex-1"
                            value={observacoes[item.sku] || ""}
                            onChange={(e) =>
                              setObservacoes((prev) => ({
                                ...prev,
                                [item.sku]: e.target.value,
                              }))
                            }
                          />
                        </div>
                      ))}
                    {inventarioData.length === 0 && (
                      <div className="text-center p-4 text-gray-500">
                        Nenhum item encontrado
                      </div>
                    )}
                  </div>

                  {/* Botões do modal */}
                  <div className="flex justify-end gap-3 mt-4">
                    <Button
                      variant="outline"
                      className="h-11 border-2 border-slate-200 hover:bg-slate-50 rounded-lg"
                      onClick={() => setShowInventario(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={salvarInventario}
                      className="h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Salvar Inventário
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-slate-100">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-slate-700">
                  Estoque Normal
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-slate-700">
                  Estoque Baixo de 5 unidades
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-slate-700">
                  Produto Vencido
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Package className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Estoque Atual</CardTitle>
                  <p className="text-sm text-slate-600 mt-1">
                    {" "}
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1
                      ? "produto encontrado"
                      : "produtos encontrados"}
                  </p>
                </div>
              </div>
             <div className="flex gap-4">
      {/* Botão Exportar Excel */}
      <Button
        onClick={() => exportToExcel(filteredProducts)}
        className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg flex items-center"
      >
        <Download className="w-4 h-4 mr-2" />
        Exportar Excel
      </Button>

      {/* Botão Realizar Retirada */}
      <Button
        onClick={() => navigate("/Retirada")}
        className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg flex items-center"
      >
        <PackageIcon className="w-4 h-4 mr-2" />
        Realizar Retirada
      </Button>
    </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="max-h-[700px] overflow-y-auto">
                <table className="w-full min-w-[1600px]">
                  <thead className="bg-gradient-to-r from-slate-100 to-slate-200 sticky top-0 z-10 border-b-2 border-slate-300">
                    <tr>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Status
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          SKU
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Nome
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          Marca
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Scale className="w-4 h-4" />
                          Peso
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          Un. Medida
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Qtd.
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Valor Unit.
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Calculator className="w-4 h-4" />
                          Valor Total
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Vencimento
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Dias Rest.
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4" />
                          Cadastro
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          Fornecedor
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FolderOpen className="w-4 h-4" />
                          Categoria
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          Tipo
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {filteredProducts.map((item, idx) => {
                      const days = calculateConsumptionDays(
                        item.dateAdded,
                        item.expiryDate
                      );
                      return (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50/80 transition-all duration-200 group"
                        >
                          <td className="px-4 py-4">{getStatusBadge(item)}</td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md">
                              {item.sku}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-sm font-medium text-slate-800">
                              {item.name}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-sm text-slate-700">
                              {item.marca}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-sm text-slate-700 font-medium">
                              {item.peso}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-sm text-slate-700">
                              {item.unit}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-sm font-semibold text-slate-900">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-sm text-slate-700">
                              {item.unitPrice}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-sm font-semibold text-slate-900">
                              {item.totalPrice}
                            </span>
                          </td>
                          <td
                            className="px-4 py-4 text-center cursor-pointer hover:bg-blue-50 rounded-lg transition-colors group-hover:bg-blue-100/50"
                            onDoubleClick={() =>
                              handleDoubleClick(item.sku, item.expiryDate)
                            }
                            title="Clique duplo para editar a data de vencimento"
                          >
                            {editando === item.sku ? (
                              <Input
                                type="date"
                                value={valorEditado}
                                onChange={handleChange}
                                onBlur={() => handleSave(item.sku)}
                                className="w-full text-sm border-2 border-blue-300 focus:border-blue-500"
                                autoFocus
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-700">
                                  {formatDate(item.expiryDate)}
                                </span>
                                <Edit3 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                days <= 7
                                  ? "bg-red-100 text-red-800 border border-red-200"
                                  : days <= 30
                                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                                  : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              }`}
                            >
                              {days} dias
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-sm text-slate-700">
                              {formatDate(item.dateAdded)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-sm text-slate-700">
                              {item.supplier}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-sm text-slate-700">
                              {item.category || "N/A"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-sm text-slate-700">
                              {item.tipo || "N/A"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan="15" className="px-4 py-16 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-slate-100 rounded-full">
                              <Package className="w-12 h-12 text-slate-400" />
                            </div>
                            <div className="space-y-2">
                              <p className="text-lg font-medium text-slate-600">
                                Nenhum produto encontrado
                              </p>
                              <p className="text-sm text-slate-500">
                                Tente ajustar os filtros de pesquisa ou
                                verificar os critérios aplicados
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
