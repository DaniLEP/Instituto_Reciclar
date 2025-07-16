import { useState, useEffect, useMemo } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ref, get, update, push, set } from "firebase/database"
import * as XLSX from "xlsx"
import { Link, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input/index"
import { Button } from "@/components/ui/button" 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/index"
import { Textarea } from "@/components/ui/textarea/textarea"
import { Label } from "@/components/ui/label"
import { Search,Download, FileText, Eye, Edit, Check, X, Plus, ArrowLeft, Filter, RefreshCw, ExternalLink, Copy } from "lucide-react"
import { dbRealtime, onValue } from "../../../../firebase"
import jsPDF from "jspdf"
import InputValorCaixa from "../../../components/valorCaixa/index"

// Status badge component for better visual representation
const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pendente": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Aprovado": return "bg-green-100 text-green-800 border-green-200"
      case "Cancelado": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }
  return <Badge className={`${getStatusColor(status)} border`}>{status}</Badge>
}
// Loading component
const LoadingSpinner = () => (<div className="flex items-center justify-center p-8"><RefreshCw className="h-6 w-6 animate-spin text-blue-500" /><span className="ml-2 text-gray-600">Carregando...</span></div>)

export default function StatusPedidos() {
  // State management (keeping all original states)
  const [pedidos, setPedidos] = useState([])
  const [pedidoSelecionado, setPedidoSelecionado] = useState({numeroPedido: "", recebido: "", status: "", fornecedor: {}, periodoInicio: null, desconto: 0, periodoFim: null, motivoCancelamento: "", produtos: [],})
  const [modalAberto, setModalAberto] = useState(false)
  const [modalAbertoCancelamento, setModalAbertoCancelamento] = useState(false)
  const [motivoCancelamento, setMotivoCancelamento] = useState("")
  const [modalAbertoEdit, setModalAbertoEdit] = useState(false)
  const [numeroPedidoFornecedor, setNumeroPedidoFornecedor] = useState("")
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [statusFiltro, setStatusFiltro] = useState("")
  const [projeto, setProjeto] = useState("")
  const [pedidosFiltrados, setPedidosFiltrados] = useState([])
  const [modalSelecionarProduto, setModalSelecionarProduto] = useState(false)
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([])
  const [modalAbertoAprovacao, setModalAbertoAprovacao] = useState(false)
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState("")
  const [chaveAcesso, setChaveAcesso] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [desconto, setDesconto] = useState(0)
  const [editandoDesconto, setEditandoDesconto] = useState(false)
  const [salvandoDesconto, setSalvandoDesconto] = useState(false)
  const [recebido, setRecebido] = useState("")
  const [valorCaixaDigitado, setValorCaixaDigitado] = useState("")
  const [sobras, setSobras] = useState(0)
  const [loading, setLoading] = useState(true)
  const [modalDuplicarAberto, setModalDuplicarAberto] = useState(false)
  const [novaDataPedido, setNovaDataPedido] = useState("")
  const [novoPeriodoInicio, setNovoPeriodoInicio] = useState("")
  const [novoPeriodoFim, setNovoPeriodoFim] = useState("")
  const [numeroDuplicado, setNumeroDuplicado] = useState("")



  const navigate = useNavigate()

  // All original useEffect hooks and functions remain the same
  useEffect(() => {if (pedidoSelecionado) {setDesconto(pedidoSelecionado.desconto || 0)}}, [pedidoSelecionado])
  useEffect(() => {
    const carregarPedidos = async () => {
      setLoading(true)
      try {
        const pedidosRef = ref(dbRealtime, "novosPedidos")
        const pedidosSnapshot = await get(pedidosRef)
        if (pedidosSnapshot.exists()) {
          const pedidosDados = Object.entries(pedidosSnapshot.val()).map(([id, pedido]) => ({ id, ...pedido }))
          setPedidos(pedidosDados); setPedidosFiltrados(pedidosDados);
        } else {toast.error("Nenhum pedido encontrado!")}
      } catch (error) {console.error("Erro ao carregar pedidos:", error)
        toast.error("Erro ao carregar pedidos")
      } finally {setLoading(false)}
    }; carregarPedidos()}, [])

  useEffect(() => {
    if (!modalSelecionarProduto) {setProdutosDisponiveis([]); return;}
    const carregarProdutos = () => {
      try {
        const produtosRef = ref(dbRealtime, "EntradaProdutos")
        onValue(produtosRef, (snapshot) => {
          const produtos = snapshot.val()
          const produtosList = produtos ? Object.keys(produtos).map((key) => ({ id: key, ...produtos[key] })) : []
          setProdutosDisponiveis(produtosList)
        });
      } catch (error) {toast.error("Erro ao carregar produtos")}
    }; carregarProdutos(); }, [modalSelecionarProduto])

  useEffect(() => {
    if (!modalSelecionarProduto) {setProdutosDisponiveis([]); return;}
  const carregarProdutos = () => {
    try {
      const produtosRef = ref(dbRealtime, "EntradaProdutos")
      onValue(produtosRef, (snapshot) => {
        const produtos = snapshot.val()
        const produtosList = produtos
          ? Object.entries(produtos).map(([id, item]) => ({id, sku: item.sku || item.SKU || item.codigo || "", name: item.name || item.nome || "", marca: item.marca || "", 
            tipo: item.tipo || "", category: item.category || "", peso: item.peso || "",unit: item.unit || item.unitMeasure || "", unitPrice: parseFloat(item.unitPrice || 0)})) : []; setProdutosDisponiveis(produtosList)})
    } catch (error) {console.error("Erro ao carregar produtos:", error); toast.error("Erro ao carregar produtos")}
  }; carregarProdutos(); }, [modalSelecionarProduto])

// Adiciona produto selecionado ao pedido
  const handleSelecionarProduto = (produtoSelecionado) => {
    console.log("Produto recebido:", produtoSelecionado)
    const precoUnitario = parseFloat(produtoSelecionado.unitPrice || 0)
    const novaQuantidade = 1
    const novoProduto = {...produtoSelecionado, quantidade: novaQuantidade, unitPrice: precoUnitario, totalPrice: parseFloat((precoUnitario * novaQuantidade).toFixed(2)), observacao: "",}
    setPedidoSelecionado((prev) => ({...prev, produtos: [...(prev.produtos || []), novoProduto],}))
    toast.success("Produto adicionado ao pedido")
  }
  const totalPedido = useMemo(() => {return pedidoSelecionado?.produtos?.reduce((acc, item) => acc + Number.parseFloat(item.totalPrice || 0), 0) || 0}, [pedidoSelecionado])
  const totalComDesconto = useMemo(() => {const valor = totalPedido - parseFloat(desconto || 0); return valor > 0 ? valor.toFixed(2) : "0.00";}, [totalPedido, desconto]);

  useEffect(() => {
    const caixa = Number.parseFloat(valorCaixaDigitado) || 0
    const total = Number.parseFloat(totalPedido) || 0
    setSobras(caixa - total); }, [valorCaixaDigitado, totalPedido]);

  const salvarValorCaixaNoBanco = async (valor) => {
    if (!pedidoSelecionado?.id) return;
    try {
      const pedidoRef = ref(dbRealtime, `novosPedidos/${pedidoSelecionado.id}`);
      await update(pedidoRef, { valorCaixa: parseFloat(valor) || 0 });
      toast.success("Valor do caixa salvo com sucesso!");
    } catch (error) {console.error("Erro ao salvar valor do caixa:", error); toast.error("Erro ao salvar valor do caixa");}
  };

  const handleAtualizarStatus = (pedidoId, novoStatus, motivo, numeroNotaFiscalParam, chaveAcessoParam) => {
    const pedidoRef = ref(dbRealtime, `novosPedidos/${pedidoId}`)
    const dataCadastro = new Date().toISOString()
    const updates = {status: novoStatus, ...(motivo && { motivoCancelamento: motivo }), ...(numeroNotaFiscalParam && { numeroNotaFiscal: numeroNotaFiscalParam }), ...(recebido && { recebido }), ...(chaveAcessoParam && { chaveAcesso: chaveAcessoParam }), dataCadastro,}
    update(pedidoRef, updates)
      .then(() => {
        toast.success(`Status atualizado para ${novoStatus}`)
        setPedidos((prev) => prev.map((p) => (p.id === pedidoId ? { ...p, ...updates } : p)))
        if (novoStatus === "Aprovado") {
          enviarParaEstoque(pedidoId)
        }
      })
      .catch(() => {
        toast.error("Erro ao atualizar status")
      })
  }

  const enviarParaEstoque = async (pedidoId) => {
    try {
      const pedidoRef = ref(dbRealtime, `novosPedidos/${pedidoId}`)
      const pedidoSnapshot = await get(pedidoRef)
      if (!pedidoSnapshot.exists()) {console.warn("Pedido não encontrado!"); return;}
      const pedido = pedidoSnapshot.val()
      const estoqueRef = ref(dbRealtime, "Estoque")
      const dataCadastro = new Date().toISOString().split("T")[0]
      const fornecedor = pedido.fornecedor

      const produtoPromises = pedido.produtos.map(async (produto) => {
        const dataProduto = {sku: produto.sku || "Indefinido", name: produto.name || "Indefinido", quantity: produto.quantidade || 0, projeto: produto.projeto || "Indefinido", category: produto.category || "Indefinido",
          tipo: produto.tipo || "Indefinido", marca: produto.marca || "Indefinido", peso: produto.peso || "Indefinido", unitmeasure: produto.unit || "Indefinido",
          supplier: fornecedor?.razaoSocial || "Indefinido", dateAdded: dataCadastro, unitPrice: produto.unitPrice || 0, totalPrice: produto.totalPrice || 0, expiryDate: produto.expiryDate || "",}
        const result = await push(estoqueRef, dataProduto)
        console.log("Produto salvo com ID:", result.key)
      })
      await Promise.all(produtoPromises)
      console.log("Todos os produtos foram enviados para o estoque.")
    } catch (error) {console.error("Erro ao enviar produtos para o estoque:", error); toast.error("Erro ao enviar produtos para o estoque")}
  }

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

  const exportToExcel = () => {
    if (!pedidoSelecionado || !pedidoSelecionado.produtos || pedidoSelecionado.produtos.length === 0) {
      toast.error("Nenhum produto para exportar!");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(
      pedidoSelecionado.produtos.map((produto) => ({Projeto: produto.projeto, SKU: produto.sku, Produto: produto.name, Marca: produto.marca, Peso: produto.peso, UnidadeMedida: produto.unit, Quantidade: `${produto.quantidade} unidades`,
        Tipo: produto.tipo, ValorUnitario: produto.unitPrice, ValorTotal: produto.totalPrice, Observação: produto.observacao || "",})),
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Produtos")
    XLSX.writeFile(wb, `Pedido_${pedidoSelecionado.numeroPedido}.xlsx`)
  }
  const handleEditar = (index, campo, valor) => {
    const novosProdutos = [...(pedidoSelecionado.produtos || [])]
    novosProdutos[index][campo] = valor
    const quantidade = Number.parseFloat(novosProdutos[index].quantidade) || 0
    const unitPrice = Number.parseFloat(novosProdutos[index].unitPrice) || 0
    novosProdutos[index].totalPrice = (quantidade * unitPrice).toFixed(2)
    setPedidoSelecionado((prev) => ({ ...prev, produtos: novosProdutos }))
  }

  const handleSalvarEdicao = () => {
    if (!pedidoSelecionado) { toast.error("Nenhum pedido selecionado para salvar!"); return;}
    const pedidoRef = ref(dbRealtime, `novosPedidos/${pedidoSelecionado.id}`);
    update(pedidoRef, { produtos: pedidoSelecionado.produtos })
      .then(() => {toast.success("Pedido atualizado com sucesso!");
        setModalAbertoEdit(false);
        setPedidos((prev) => prev.map((pedido) => pedido.id === pedidoSelecionado.id ? { ...pedido, produtos: pedidoSelecionado.produtos } : pedido,),)
        setPedidoSelecionado((prev) => ({ ...prev, produtos: pedidoSelecionado.produtos }));
      })
      .catch(() => {
        toast.error("Erro ao salvar edição!")
      })
  }

  const handleDelete = async (index) => {
    if (!pedidoSelecionado || !pedidoSelecionado.produtos) return
    const produtosAtualizados = pedidoSelecionado.produtos.filter((_, i) => i !== index)
    setPedidoSelecionado((prev) => ({ ...prev, produtos: produtosAtualizados }))
    try {
      const pedidoRef = ref(dbRealtime, `novosPedidos/${pedidoSelecionado.id}/produtos`)
      await set(pedidoRef, produtosAtualizados)
      toast.success("Produto removido com sucesso!")
    } catch (error) {
      toast.error("Erro ao remover produto.")
      console.error("Erro ao deletar produto do Firebase:", error)
    }
  }

  const produtosFiltrados = produtosDisponiveis.filter((produto) => produto.name?.toLowerCase().includes(searchTerm.toLowerCase()) || produto.sku?.toLowerCase().includes(searchTerm.toLowerCase()),)
  const handleLimparFiltros = () => {setProjeto(""); setNumeroPedidoFornecedor(""); setDataInicio(""); setDataFim(""); setStatusFiltro(""); setPedidosFiltrados(pedidos); setNumeroNotaFiscal("");}

  const handleFiltro = () => {
    let filteredPedidos = pedidos
    if (numeroPedidoFornecedor) {const termo = numeroPedidoFornecedor.toLowerCase()
      filteredPedidos = filteredPedidos.filter((pedido) => pedido.numeroPedido?.toLowerCase().includes(termo) || pedido.fornecedor?.razaoSocial?.toLowerCase().includes(termo),)}
    if (dataInicio) {filteredPedidos = filteredPedidos.filter((pedido) => new Date(pedido.dataPedido) >= new Date(dataInicio))}
    if (dataFim) {filteredPedidos = filteredPedidos.filter((pedido) => new Date(pedido.dataPedido) <= new Date(dataFim))}
    if (statusFiltro) {filteredPedidos = filteredPedidos.filter((pedido) => pedido.status === statusFiltro)}
    if (projeto) {filteredPedidos = filteredPedidos.filter((pedido) => pedido.status === projeto)}
    if (numeroNotaFiscal) {filteredPedidos = filteredPedidos.filter((pedido) => pedido.numeroNotaFiscal && pedido.numeroNotaFiscal.toString().includes(numeroNotaFiscal.toString()),)}
    setPedidosFiltrados(filteredPedidos);
  }
  const handleVoltar = () => navigate("/Pedidos")
  const exportarConsultaParaExcel = () => {
    if (pedidosFiltrados.length === 0) {toast.error("Nenhum pedido filtrado para exportar!"); return;}
    const dataParaExportar = pedidosFiltrados.map((pedido) => ({Número: pedido.numeroPedido, Data: formatDate(pedido.dataPedido), Fornecedor: pedido?.fornecedor?.razaoSocial || "Não informado",
      Categoria: pedido.category || "Não informado", Status: pedido.status, MotivoCancelamento: pedido.motivoCancelamento || "",}))
    const ws = XLSX.utils.json_to_sheet(dataParaExportar)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Status dos Pedidos")
    XLSX.writeFile(wb, "Pedidos_Filtrados.xlsx")
  }

  const headerImgSrc = "./Reciclar_30anos_Horizontal_Positivo.png";
  const segundaHeaderImgSrc = "./seloAtualizado.png";
  const footerImgSrc = "./selo.png";
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};



const exportToPDF = async () => {
  if (!pedidoSelecionado) {
    console.error("Pedido não selecionado.");
    return;
  }

  try {
    const [headerImg, segundaHeaderImg, footerImg] = await Promise.all([
      loadImage(headerImgSrc),
      loadImage(segundaHeaderImgSrc),
      loadImage(footerImgSrc),
    ]);

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    const headerX = 10, headerY = 6, headerWidth = 45, headerHeight = 9;
    const segundaHeaderX = 150, segundaHeaderY = 6, segundaHeaderWidth = 45, segundaHeaderHeight = 9;
    const footerX = 10, footerWidth = 90, footerHeight = 25;
    const footerY = pageHeight - footerHeight;

    const contentTop = headerY + headerHeight + 10;
    const contentBottom = footerY - 20;
    const marginLeft = 20;

    const addHeader = () => {
      doc.addImage(headerImg, "PNG", headerX, headerY, headerWidth, headerHeight);
      doc.addImage(segundaHeaderImg, "PNG", segundaHeaderX, segundaHeaderY, segundaHeaderWidth, segundaHeaderHeight);
    };

    const addFooter = () => {
      doc.addImage(footerImg, "PNG", footerX, footerY, footerWidth, footerHeight);
    };

    doc.setFont("Helvetica");
    doc.setFontSize(10);
    addHeader();
    addFooter();

    let y = contentTop;

    doc.text("Número do Pedido: " + (pedidoSelecionado.numeroPedido || ""), marginLeft, y); y += 8;
    doc.text("Projeto Custeador: " + (pedidoSelecionado.projeto || ""), marginLeft, y); y += 8;
    doc.text("Fornecedor: " + (pedidoSelecionado.fornecedor?.razaoSocial || ""), marginLeft, y); y += 8;
    doc.text("Data do Pedido: " + formatDate(pedidoSelecionado.dataPedido || ""), marginLeft, y); y += 8;
    const periodo = `Período que irá suprir: ${formatDate(pedidoSelecionado.periodoInicio)} até: ${formatDate(pedidoSelecionado.periodoFim)}`;
    doc.text(periodo, marginLeft, y); y += 22;

    const addTableHeader = (y) => {
      doc.setFontSize(9);
      doc.text("Produto", 20, y);
      doc.text("Peso", 60, y);
      doc.text("Unidade", 80, y);
      doc.text("Marca", 100, y);
      doc.text("Quantidade", 135, y);
      doc.text("Observação", 160, y);
      doc.line(20, y + 2, 190, y + 2);
    };

    addTableHeader(y);
    y += 10;

    doc.setFontSize(9);
    const lineHeight = 5;

    (pedidoSelecionado.produtos || []).forEach((produto) => {
      const nomeLines = doc.splitTextToSize(String(produto.name || ""), 35);
      const pesoLines = doc.splitTextToSize(String(produto.peso || ""), 15);
      const unidadeLines = doc.splitTextToSize(String(produto.unitMeasure || ""), 15);
      const marcaLines = doc.splitTextToSize(String(produto.marca || ""), 30);
      const quantidadeLines = doc.splitTextToSize(String(produto.quantidade || "0"), 15);
      const observacaoLines = doc.splitTextToSize(produto.observacao || "Sem observação", 40);

      const maxLines = Math.max(
        nomeLines.length,
        pesoLines.length,
        unidadeLines.length,
        marcaLines.length,
        quantidadeLines.length,
        observacaoLines.length
      );

      const rowHeight = Math.max(maxLines * lineHeight, 14);

      if (y + rowHeight > contentBottom) {
        doc.addPage();
        addHeader();
        addFooter();
        y = contentTop;
        addTableHeader(y);
        y += 10;
      }

      const baseY = y;
      for (let i = 0; i < maxLines; i++) {
        const offsetY = baseY + i * lineHeight;
        if (nomeLines[i]) doc.text(nomeLines[i], 20, offsetY);
        if (pesoLines[i]) doc.text(pesoLines[i], 60, offsetY);
        if (unidadeLines[i]) doc.text(unidadeLines[i], 80, offsetY);
        if (marcaLines[i]) doc.text(marcaLines[i], 100, offsetY);
        if (quantidadeLines[i]) doc.text(quantidadeLines[i], 135, offsetY);
        if (observacaoLines[i]) doc.text(observacaoLines[i], 160, offsetY);
      }

      y += rowHeight;
      doc.line(20, y, 190, y);
      y += 5;
    });

    addFooter();
    doc.save(`pedido_${pedidoSelecionado.numeroPedido || "sem_numero"}.pdf`);

  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
  }
};

  const salvarDescontoNoPedido = async () => {
    if (!pedidoSelecionado?.id) return
    setSalvandoDesconto(true)
    try {await update(ref(dbRealtime, `novosPedidos/${pedidoSelecionado.id}`), { desconto }); setEditandoDesconto(false); toast.success("Desconto salvo com sucesso!");}
    catch (error) {console.error("Erro ao salvar desconto:", error); toast.error("Erro ao salvar desconto")} 
    finally {setSalvandoDesconto(false);}
  }

    const abrirModalDuplicar = () => {
    const randomId = Math.floor(2000 + Math.random() * 10000) // Ex: PED-4321
    const novoNumero = `PED${randomId}`
    setNumeroDuplicado(novoNumero)
    setNovaDataPedido(new Date().toISOString().slice(0, 10))
    setNovoPeriodoInicio("")
    setNovoPeriodoFim("")
    setModalDuplicarAberto(true)
  }

    const handleDuplicarPedido = async () => {
    if (!novaDataPedido || !novoPeriodoInicio || !novoPeriodoFim) {
      toast.error("Preencha todos os campos.")
      return
    }

    const novoPedido = {...pedidoSelecionado, numeroPedido: numeroDuplicado, dataPedido: novaDataPedido, periodoInicio: novoPeriodoInicio, periodoFim: novoPeriodoFim, status: "Pendente", motivoCancelamento: "", recebido: "", numeroNotaFiscal: "", chaveAcesso: "",}
    delete novoPedido.id

    try {
      await push(ref(dbRealtime, "novosPedidos"), novoPedido)
      toast.success("Pedido duplicado com sucesso!")
      setModalDuplicarAberto(false)
      // Atualiza a lista
      const pedidosRef = ref(dbRealtime, "novosPedidos")
      const snapshot = await get(pedidosRef)
      if (snapshot.exists()) {
        const dados = Object.entries(snapshot.val()).map(([id, pedido]) => ({ id, ...pedido }))
        setPedidos(dados)
        setPedidosFiltrados(dados)
      }
    } catch (error) {
      console.error("Erro ao duplicar pedido:", error)
      toast.error("Erro ao duplicar pedido")
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer position="top-right" />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Pedidos</h1>
              <p className="mt-1 text-sm text-gray-500">Gerencie e acompanhe todos os pedidos</p>
            </div>
            <Button onClick={handleVoltar} variant="outline" className="flex items-center gap-2"><ArrowLeft className="h-4 w-4" />Voltar</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Card */}
        <Card className="mb-8">
          <CardHeader><CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" />Filtros de Consulta</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="pedido-fornecedor">Pedido ou Fornecedor</Label>
                <Input id="pedido-fornecedor" placeholder="Número do Pedido ou Fornecedor" value={numeroPedidoFornecedor} onChange={(e) => setNumeroPedidoFornecedor(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nota-fiscal">Nota Fiscal</Label>
                <Input id="nota-fiscal" placeholder="Número da Nota Fiscal" value={numeroNotaFiscal} onChange={(e) => setNumeroNotaFiscal(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-inicio">Data Início</Label>
                <Input id="data-inicio" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-fim">Data Fim</Label>
                <Input id="data-fim" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFiltro} onValueChange={setStatusFiltro}>
                  <SelectTrigger><SelectValue placeholder="Selecione o Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Aprovado">Aprovado</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="projeto">Projeto</Label>
                <Select value={projeto} onValueChange={setProjeto}>
                  <SelectTrigger><SelectValue placeholder="Selecione o Projeto" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="CONDECA">CONDECA</SelectItem>
                    <SelectItem value="FUMCAD">FUMCAD</SelectItem>
                    <SelectItem value="INSTITUTO RECICLAR">Instituto Reciclar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleFiltro} className="flex items-center gap-2"><Search className="h-4 w-4" />Consultar</Button>
              <Button onClick={handleLimparFiltros} variant="outline" className="flex items-center gap-2"><RefreshCw className="h-4 w-4" />Limpar Filtros</Button>
              <Button onClick={exportarConsultaParaExcel} variant="outline" className="flex items-center gap-2"><Download className="h-4 w-4" />Exportar Consulta</Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pedidos</CardTitle>
            <p className="text-sm text-gray-500">{pedidosFiltrados.length} pedido(s) encontrado(s)</p></CardHeader>
          <CardContent>
            {loading ? (<LoadingSpinner />) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Número</TableHead>
                      <TableHead className="text-center">Projeto</TableHead>
                      <TableHead className="text-center">Nota Fiscal</TableHead>
                      <TableHead className="text-center">Data</TableHead>
                      <TableHead className="text-center">Fornecedor</TableHead>
                      <TableHead className="text-center">Categoria</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pedidosFiltrados.length > 0 ? (
                      pedidosFiltrados.map((pedido) => (
                        <TableRow key={pedido.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-center">{pedido.numeroPedido}</TableCell>
                          <TableCell >{pedido.projeto}</TableCell>
                          <TableCell >{pedido.numeroNotaFiscal ? `Nº: ${pedido.numeroNotaFiscal}` : "-"}</TableCell>
                          <TableCell >{formatDate(pedido.dataPedido)}</TableCell>
                          <TableCell >{pedido?.fornecedor?.razaoSocial || "Não informado"}</TableCell>
                          <TableCell >{pedido.category || "Não informado"}</TableCell>
                          <TableCell ><StatusBadge status={pedido.status} /></TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button size="sm" variant="outline"
                                onClick={() => {setPedidoSelecionado(pedido); setModalAberto(true);}} className="flex items-center gap-1"><Eye className="h-3 w-3" />Ver</Button>
                              {pedido.status === "Pendente" && (
                                <>
                                  <Button size="sm" variant="outline" onClick={() => {setPedidoSelecionado(pedido); setModalAbertoEdit(true);}} className="flex items-center gap-1"><Edit className="h-3 w-3" />Editar</Button>
                                  <Button size="sm"onClick={() => {setPedidoSelecionado(pedido); setModalAbertoAprovacao(true)}} className="flex items-center gap-1 bg-green-600 hover:bg-green-700"><Check className="h-3 w-3" />Aprovar</Button>
                                  <Button size="sm" variant="destructive"onClick={() => {setPedidoSelecionado(pedido); setModalAbertoCancelamento(true)}} className="flex items-center gap-1"><X className="h-3 w-3" />Cancelar</Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">Nenhum pedido encontrado com os filtros aplicados.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Aprovação */}
      <Dialog open={modalAbertoAprovacao} onOpenChange={setModalAbertoAprovacao}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Aprovar Pedido #{pedidoSelecionado.numeroPedido}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nf-aprovacao">Número da Nota Fiscal *</Label>
              <Input id="nf-aprovacao" placeholder="Digite o número da nota fiscal" value={numeroNotaFiscal}onChange={(e) => setNumeroNotaFiscal(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chave-acesso">Chave de Acesso *</Label>
              <Input id="chave-acesso" placeholder="Digite a chave de acesso" value={chaveAcesso} onChange={(e) => setChaveAcesso(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recebido-por">Recebido por</Label>
              <Input id="recebido-por" placeholder="Nome de quem recebeu" value={recebido} onChange={(e) => setRecebido(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalAbertoAprovacao(false)}>Cancelar</Button>
              <Button onClick={() => {if (!numeroNotaFiscal || !chaveAcesso) {toast.error("Preencha a Nota Fiscal e a Chave de Acesso antes de aprovar."); return;}
                  handleAtualizarStatus(pedidoSelecionado.id, "Aprovado", "", numeroNotaFiscal, chaveAcesso, recebido)
                  setModalAbertoAprovacao(false); setNumeroNotaFiscal(""); setChaveAcesso(""); setRecebido("");}} className="bg-green-600 hover:bg-green-700">Confirmar Aprovação</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Cancelamento */}
      <Dialog open={modalAbertoCancelamento} onOpenChange={setModalAbertoCancelamento}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancelar Pedido #{pedidoSelecionado.numeroPedido}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="motivo-cancelamento">Motivo do Cancelamento *</Label>
              <Textarea id="motivo-cancelamento" placeholder="Descreva o motivo do cancelamento" value={motivoCancelamento} onChange={(e) => setMotivoCancelamento(e.target.value)} rows={4} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalAbertoCancelamento(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={() => { handleAtualizarStatus(pedidoSelecionado.id, "Cancelado", motivoCancelamento); setModalAbertoCancelamento(false); setMotivoCancelamento("");}}>Confirmar Cancelamento</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader> <DialogTitle className="text-2xl">Pedido #{pedidoSelecionado.numeroPedido}</DialogTitle></DialogHeader>
          <div className="space-y-6">
            {/* Informações Gerais */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Informações Gerais</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    ["Status", <StatusBadge key="status" status={pedidoSelecionado.status} />],
                    ["Projeto Custeador", pedidoSelecionado.projeto || "Não informado"],
                    ["Fornecedor", pedidoSelecionado.fornecedor?.razaoSocial || "Não informado"],
                    ["Contato", pedidoSelecionado.fornecedor?.contato || "Não informado"],
                    ["Telefone", pedidoSelecionado.fornecedor?.telefone || "Não informado"],
                    ["E-mail", pedidoSelecionado.fornecedor?.email || "Não informado"],
                    ["Período", `De: ${formatDate(pedidoSelecionado.periodoInicio)} Até: ${formatDate(pedidoSelecionado.periodoFim)}`,],
                    ["Motivo de Cancelamento", pedidoSelecionado.motivoCancelamento || "Não informado"],
                    ["Nota Fiscal", pedidoSelecionado.numeroNotaFiscal || "Não informado"],
                    ["Chave de Acesso", pedidoSelecionado.chaveAcesso || "Não informado"],
                    ["Recebido por", pedidoSelecionado.recebido || "Não informado"],
                  ].map(([label, value], index) => (
                    <div key={index} className="space-y-1">
                      <Label className="text-sm font-medium text-gray-600">{label}</Label>
                      <div className="text-sm">{value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Valores Financeiros */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Valores Financeiros</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">R$ {(Number(totalPedido) || 0).toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Valor Total</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                    {editandoDesconto ? (
                      <Input type="number" value={desconto}
                        onChange={(e) => setDesconto(Number(e.target.value))}
                        onKeyDown={(e) => e.key === "Enter" && salvarDescontoNoPedido()} onBlur={salvarDescontoNoPedido} className="text-center text-xl font-bold" autoFocus />
                    ) : (
                      <div className="cursor-pointer" onDoubleClick={() => setEditandoDesconto(true)}>
                        <div className="text-2xl font-bold text-orange-600">R$ {desconto.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">Desconto (clique 2x para editar)</div>
                      </div>
                    )}
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">R$ {(totalPedido - desconto).toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Total com Desconto</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Valor do Caixa */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Controle de Caixa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InputValorCaixa valorInicial={valorCaixaDigitado} onSalvar={(valor) => setValorCaixaDigitado(valor)}/>
                  <div className="flex items-center gap-4">
                    <Label>Sobra do Caixa:</Label>
                    <div className={`text-lg font-semibold px-3 py-1 rounded ${sobras >= 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50" }`}>R$ {sobras.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={exportToExcel} className="flex items-center gap-2"> <Download className="h-4 w-4" />Exportar Excel </Button>
              <Button onClick={exportToPDF} variant="outline" className="flex items-center gap-2"><FileText className="h-4 w-4" />Exportar PDF</Button>
              <Button asChild variant="outline" className="flex items-center gap-2">
                <Link to="https://www.nfce.fazenda.sp.gov.br/NFCeConsultaPublica/Paginas/ConsultaPublica.aspx" target="_blank"><ExternalLink className="h-4 w-4" />Consultar NF</Link></Button>
              <Button asChild variant="outline" className="flex items-center gap-2"><Link to="https://www.nfe.fazenda.gov.br/portal/principal.aspx" target="_blank"><ExternalLink className="h-4 w-4" />Consultar Cupom</Link></Button>
              <Button onClick={abrirModalDuplicar} variant="outline" className="flex items-center gap-1"><Copy className="w-4 h-4" />Duplicar Pedido</Button>
            </div>
            {/* MODAL DE DUPLICAÇÃO DE PEDIDOS */}
            <Dialog open={modalDuplicarAberto} onOpenChange={setModalDuplicarAberto}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Duplicar Pedido</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div><Label>Número do novo pedido</Label>
                    <Input value={numeroDuplicado} disabled />
                  </div>
                  <div><Label>Data do Pedido</Label>
                    <Input type="date" value={novaDataPedido} onChange={(e) => setNovaDataPedido(e.target.value)} />
                  </div>
                  <div><Label>Período Início</Label>
                    <Input type="date" value={novoPeriodoInicio} onChange={(e) => setNovoPeriodoInicio(e.target.value)} />
                  </div>
                  <div><Label>Período Fim</Label>
                    <Input type="date" value={novoPeriodoFim} onChange={(e) => setNovoPeriodoFim(e.target.value)} />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setModalDuplicarAberto(false)}>Cancelar</Button>
                    <Button onClick={handleDuplicarPedido}>Confirmar Duplicação</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            {/* Tabela de Produtos */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Produtos do Pedido</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto text-center">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">SKU</TableHead>
                        <TableHead className="text-center">Produto</TableHead>
                        <TableHead className="text-center">Marca</TableHead>
                        <TableHead className="text-center">Tipo</TableHead>
                        <TableHead className="text-center">Grupo</TableHead>
                        <TableHead className="text-center">Peso Unit.</TableHead>
                        <TableHead className="text-center">Unidade</TableHead>
                        <TableHead className="text-center">Quantidade</TableHead>
                        <TableHead className="text-center">Valor Unit.</TableHead>
                        <TableHead className="text-center">Valor Total</TableHead>
                        <TableHead className="text-center">Observações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(pedidoSelecionado?.produtos) && pedidoSelecionado.produtos.length > 0 ? (
                        pedidoSelecionado.produtos.map((produto, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-center">{produto.sku}</TableCell>
                            <TableCell className="text-center">{produto.name}</TableCell>
                            <TableCell className="text-center">{produto.marca}</TableCell>
                            <TableCell className="text-center">{produto.tipo}</TableCell>
                            <TableCell className="text-center">{produto.category}</TableCell>
                            <TableCell className="text-center">{produto.peso}</TableCell>
                            <TableCell className="text-center">{produto.unitMeasure}</TableCell>
                            <TableCell className="text-center">{produto.quantidade}</TableCell>
                            <TableCell className="text-center">R$ {produto.unitPrice}</TableCell>
                            <TableCell className="text-center">R$ {produto.totalPrice}</TableCell>
                            <TableCell className="text-center">{produto.observacao}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={11} className="text-center py-8 text-gray-500">Nenhum produto encontrado para este pedido.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={modalAbertoEdit} onOpenChange={setModalAbertoEdit}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-2xl">Editar Pedido #{pedidoSelecionado.numeroPedido}</DialogTitle></DialogHeader>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
                <StatusBadge status={pedidoSelecionado.status} />
              </div>
              <Button onClick={() => setModalSelecionarProduto(true)} className="flex items-center gap-2"><Plus className="h-4 w-4" />Adicionar Produto</Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Peso Unit.</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Valor Unit.</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Obs.</TableHead>
                    <TableHead>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedidoSelecionado?.produtos?.map((produto, index) => (
                    <TableRow key={index}>
                      <TableCell><Input type="text" value={produto.sku} onChange={(e) => handleEditar(index, "sku", e.target.value)} className="w-20" /></TableCell>
                      <TableCell><Input value={produto.name} onChange={(e) => handleEditar(index, "name", e.target.value)} className="min-w-32" /></TableCell>
                      <TableCell><Input value={produto.marca} onChange={(e) => handleEditar(index, "marca", e.target.value)} className="w-24"/></TableCell>
                      <TableCell><Input value={produto.tipo} onChange={(e) => handleEditar(index, "tipo", e.target.value)} className="w-24" /></TableCell>
                      <TableCell><Input value={produto.category} onChange={(e) => handleEditar(index, "category", e.target.value)} className="w-24"/></TableCell>
                      <TableCell><Input type="number" value={produto.peso} onChange={(e) => handleEditar(index, "peso", e.target.value)} className="w-20" /></TableCell>
                      <TableCell><Input value={produto.unit} onChange={(e) => handleEditar(index, "unit", e.target.value)} className="w-20" /></TableCell>
                      <TableCell><Input type="number" value={produto.quantidade} onChange={(e) => handleEditar(index, "quantidade", e.target.value)} className="w-20" /></TableCell>
                      <TableCell><Input type="number" value={produto.unitPrice} onChange={(e) => handleEditar(index, "unitPrice", e.target.value)} className="w-24" /></TableCell>
                      <TableCell className="font-medium">R$ {(produto.quantidade * produto.unitPrice).toFixed(2)}</TableCell>
                      <TableCell><Input value={produto.observacao} onChange={(e) => handleEditar(index, "observacao", e.target.value)}className="min-w-32" /></TableCell>
                      <TableCell><Button variant="destructive" size="sm" onClick={() => handleDelete(index)}><X className="h-3 w-3" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSalvarEdicao} className="flex items-center gap-2"><Check className="h-4 w-4" />Salvar Edição</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Seleção de Produto */}
      <Dialog open={modalSelecionarProduto} onOpenChange={setModalSelecionarProduto}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Selecionar Produto</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input placeholder="Buscar por nome ou SKU" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1" />
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtosFiltrados.map((produto) => (
                    <TableRow key={produto.sku}>
                      <TableCell>{produto.sku}</TableCell>
                      <TableCell>{produto.name}</TableCell>
                      <TableCell>{produto.marca}</TableCell>
                      <TableCell><Button size="sm" onClick={() => {handleSelecionarProduto(produto); setModalSelecionarProduto(false);}}>Selecionar</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}