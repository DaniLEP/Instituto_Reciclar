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
import {
  Search,
  Download,
  FileText,
  Eye,
  Edit,
  Check,
  X,
  Plus,
  ArrowLeft,
  Filter,
  RefreshCw,
  ExternalLink,
  Copy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { dbRealtime, onValue } from "../../../../firebase"
import jsPDF from "jspdf"
import InputValorCaixa from "../../../components/valorCaixa/index"

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pendente":
        return "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 border-amber-600 shadow-xl shadow-amber-300/50 dark:shadow-amber-500/30"
      case "Aprovado":
        return "bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 text-emerald-950 border-emerald-600 shadow-xl shadow-emerald-300/50 dark:shadow-emerald-500/30"
      case "Cancelado":
        return "bg-gradient-to-r from-rose-400 via-red-400 to-rose-500 text-rose-950 border-rose-600 shadow-xl shadow-rose-300/50 dark:shadow-rose-500/30"
      default:
        return "bg-gradient-to-r from-muted to-muted-foreground/20 text-foreground border-border shadow-lg"
    }
  }
  return (
    <Badge className={`${getStatusColor(status)} border-2 font-semibold px-3 py-1 transition-all hover:scale-105`}>
      {status}
    </Badge>
  )
}
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <RefreshCw className="h-6 w-6 animate-spin text-primary" />
    <span className="ml-2 text-muted-foreground">Carregando...</span>
  </div>
)

export default function StatusPedidos() {
  // State management (keeping all original states)
  const [pedidos, setPedidos] = useState([])
  const [pedidoSelecionado, setPedidoSelecionado] = useState({
    numeroPedido: "",
    recebido: "",
    status: "",
    fornecedor: {},
    periodoInicio: null,
    desconto: 0,
    periodoFim: null,
    motivoCancelamento: "",
    produtos: [],
  })
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
  const [fornecedores, setFornecedores] = useState([])
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null)
  const [modalFornecedorAberto, setModalFornecedorAberto] = useState(false)
  const [projetoSelecionado, setProjetoSelecionado] = useState(null)
  const [editandoPeriodo, setEditandoPeriodo] = useState(false);
  const [editPeriodoInicio, setEditPeriodoInicio] = useState("");
  const [editPeriodoFim, setEditPeriodoFim] = useState("");
  const [editandoDataId, setEditandoDataId] = useState(null);
  const [novaDataPedidoTabela, setNovaDataPedidoTabela] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const navigate = useNavigate()

  // All original useEffect hooks and functions remain the same
  useEffect(() => {
    if (pedidoSelecionado) {
      setDesconto(pedidoSelecionado.desconto || 0)
    }
  }, [pedidoSelecionado])
  useEffect(() => {
    const carregarPedidos = async () => {
      setLoading(true)
      try {
        const pedidosRef = ref(dbRealtime, "novosPedidos")
        const pedidosSnapshot = await get(pedidosRef)
        if (pedidosSnapshot.exists()) {
          const pedidosDados = Object.entries(pedidosSnapshot.val()).map(([id, pedido]) => ({ id, ...pedido }))
          setPedidos(pedidosDados)
          setPedidosFiltrados(pedidosDados)
        } else {
          toast.error("Nenhum pedido encontrado!")
        }
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error)
        toast.error("Erro ao carregar pedidos")
      } finally {
        setLoading(false)
      }
    }
    carregarPedidos()
  }, [])

  useEffect(() => {
    if (!modalSelecionarProduto) {
      setProdutosDisponiveis([])
      return
    }
    const carregarProdutos = () => {
      try {
        const produtosRef = ref(dbRealtime, "EntradaProdutos")
        onValue(produtosRef, (snapshot) => {
          const produtos = snapshot.val()
          const produtosList = produtos ? Object.keys(produtos).map((key) => ({ id: key, ...produtos[key] })) : []
          setProdutosDisponiveis(produtosList)
        })
      } catch (error) {
        toast.error("Erro ao carregar produtos")
      }
    }
    carregarProdutos()
  }, [modalSelecionarProduto])

  useEffect(() => {
    if (!modalSelecionarProduto) {setProdutosDisponiveis([]); return;}
    const carregarProdutos = () => {
      try {
        const produtosRef = ref(dbRealtime, "EntradaProdutos")
        onValue(produtosRef, (snapshot) => {
          const produtos = snapshot.val()
          const produtosList = produtos ? Object.entries(produtos).map(([id, item]) => ({id, sku: item.sku || item.SKU || item.codigo || "", name: item.name || item.nome || "", marca: item.marca || "", tipo: item.tipo || "",
            category: item.category || "", peso: item.peso || "", unit: item.unit || item.unitMeasure || "", unitPrice: Number.parseFloat(item.unitPrice || 0),})) : []
          setProdutosDisponiveis(produtosList)
        })
      } catch (error) { console.error("Erro ao carregar produtos:", error); toast.error("Erro ao carregar produtos");
      }
    }
    carregarProdutos()
  }, [modalSelecionarProduto])

  useEffect(() => {
    const carregarFornecedores = async () => {
      try {
        const fornecedoresRef = ref(dbRealtime, "CadastroFornecedores")
        const snapshot = await get(fornecedoresRef)
        if (snapshot.exists()) {const dados = Object.entries(snapshot.val()).map(([id, f]) => ({ id, ...f })); setFornecedores(dados)} 
        else {toast.error("Nenhum fornecedor encontrado!")}
      } catch (error) {
        console.error("Erro ao carregar fornecedores:", error)
        toast.error("Erro ao carregar fornecedores")
      }
    }
    carregarFornecedores()
  }, [])

  useEffect(() => {
    const calcularKilosTotais = async () => {
      try {
        const pedidosRef = ref(dbRealtime, "novosPedidos");
        const snapshot = await get(pedidosRef);
        if (!snapshot.exists()) return;
        const pedidos = snapshot.val();
        const atualizacoes = [];
        for (const [id, pedido] of Object.entries(pedidos)) {
          if (pedido.kilosTotais !== undefined && pedido.kilosTotais !== null) continue;
          if (!pedido.produtos || !Array.isArray(pedido.produtos)) continue;
          const totalKilos = pedido.produtos.reduce((acc, item) => {
            const peso = Number(item.peso || item.pesoUnitario || 0);
            const qtd = Number(item.quantidade || 0);
            return acc + peso * qtd;
          }, 0);
          const pedidoRef = ref(dbRealtime, `novosPedidos/${id}`);
          await update(pedidoRef, { kilosTotais: totalKilos.toFixed(2) });
          atualizacoes.push({ id, kilosTotais: totalKilos.toFixed(2) });
        }
        if (atualizacoes.length > 0) {
          console.log("Atualizações realizadas:", atualizacoes);
          toast.success(`Atualizado ${atualizacoes.length} pedido(s) com kilosTotais`);} 
        else {console.log("Nenhum pedido precisou de atualização.");}
      } catch (error) {
        console.error("Erro ao calcular kilosTotais:", error);
        toast.error("Erro ao calcular kilosTotais");
      }
    };
    calcularKilosTotais();
  }, []);

  const handleSelecionarProduto = (produtoSelecionado) => {console.log("Produto recebido:", produtoSelecionado)
    const precoUnitario = Number.parseFloat(produtoSelecionado.unitPrice || 0)
    const novoProduto = {sku: produtoSelecionado.sku || "", name: produtoSelecionado.name || "", marca: produtoSelecionado.marca || "", tipo: produtoSelecionado.tipo || "", category: produtoSelecionado.category || "",
      peso: produtoSelecionado.peso || produtoSelecionado.weight || 0, unitMeasure: produtoSelecionado.unit || produtoSelecionado.unitMeasure || "", quantidade: 1, unitPrice: precoUnitario, totalPrice: Number.parseFloat((precoUnitario * 1).toFixed(2)), observacao: "",}
    setPedidoSelecionado((prev) => ({...prev, produtos: [...(prev.produtos || []), novoProduto],}))
    toast.success("Produto adicionado ao pedido")
  }

  const totalPedido = useMemo(() => {
    return pedidoSelecionado?.produtos?.reduce((acc, item) => acc + Number.parseFloat(item.totalPrice || 0), 0) || 0
  }, [pedidoSelecionado])
  const totalComDesconto = useMemo(() => {
    const valor = totalPedido - Number.parseFloat(desconto || 0)
    return valor > 0 ? valor.toFixed(2) : "0.00"
  }, [totalPedido, desconto])

  useEffect(() => {
    const caixa = Number.parseFloat(valorCaixaDigitado) || 0
    const total = Number.parseFloat(totalPedido) || 0
    setSobras(caixa - total)
  }, [valorCaixaDigitado, totalPedido])

  const salvarValorCaixaNoBanco = async (valor) => {
    if (!pedidoSelecionado?.id) return
    try {
      const pedidoRef = ref(dbRealtime, `novosPedidos/${pedidoSelecionado.id}`)
      await update(pedidoRef, { valorCaixa: Number.parseFloat(valor) || 0 })
      toast.success("Valor do caixa salvo com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar valor do caixa:", error)
      toast.error("Erro ao salvar valor do caixa")
    }
  }


  const handleAtualizarStatus = (pedidoId, novoStatus, motivo, numeroNotaFiscalParam, chaveAcessoParam) => {
    const pedidoRef = ref(dbRealtime, `novosPedidos/${pedidoId}`)
    const dataCadastro = new Date().toISOString()
    const updates = {status: novoStatus, ...(motivo && { motivoCancelamento: motivo }),
      ...(numeroNotaFiscalParam && { numeroNotaFiscal: numeroNotaFiscalParam }), ...(recebido && { recebido }), ...(chaveAcessoParam && { chaveAcesso: chaveAcessoParam }), dataCadastro,
    }

    update(pedidoRef, updates)
      .then(() => {
        toast.success(`Status atualizado para ${novoStatus}`)
        setPedidos((prev) => prev.map((p) => (p.id === pedidoId ? { ...p, ...updates } : p)))
        if (novoStatus === "Aprovado") {enviarParaEstoque(pedidoId)}
      }).catch(() => {toast.error("Erro ao atualizar status")})
    }

  const enviarParaEstoque = async (pedidoId) => {
    try {
      const pedidoRef = ref(dbRealtime, `novosPedidos/${pedidoId}`);
      const pedidoSnapshot = await get(pedidoRef);
      if (!pedidoSnapshot.exists()) {console.warn("Pedido não encontrado!"); return;}
      const pedido = pedidoSnapshot.val();
      const fornecedor = pedido.fornecedor;
      const dataCadastro = new Date().toISOString().split("T")[0];
      const produtoPromises = pedido.produtos.map(async (produto) => {
        if (!produto.sku) {console.warn("Produto sem SKU, não será enviado para o estoque:", produto); return;}
        const produtoRef = ref(dbRealtime, `Estoque/${produto.sku}`);
        const snapshotProduto = await get(produtoRef);
        const qtdEntrada = Number(produto.quantidade ?? produto.quantity ?? 0);
        const pesoEntrada = Number(produto.peso ?? 0);
        const precoEntrada = Number(produto.totalPrice ?? 0);
        const dataProduto = {sku: produto.sku, name: produto.name || "Indefinido", projeto: produto.projeto || "Indefinido",
          category: produto.category || "Indefinido", tipo: produto.tipo || "Indefinido", marca: produto.marca || "Indefinido", unit: produto.unit || "", supplier: fornecedor?.razaoSocial || "Indefinido",
          unitPrice: Number(produto.unitPrice || 0), expiryDate: produto.expiryDate || "", dateAdded: dataCadastro,
        };
        const historicoRef = ref(dbRealtime, `Estoque/${produto.sku}/historicoEntradas`);
        const historicoSnapshot = await get(historicoRef);
        const historico = historicoSnapshot.val() || {};
        const pedidoJaRegistrado = Object.values(historico).some((item) => item.pedidoId === pedidoId);
        if (pedidoJaRegistrado) {console.warn(`⏩ Pedido ${pedidoId} já registrado no histórico do SKU ${produto.sku}. Ignorando duplicação.`);return;}
        if (snapshotProduto.exists()) {
          const existente = snapshotProduto.val();
          const quantidadeAntiga = Number(existente.quantity ?? 0);
          const pesoAntigo = Number(existente.peso ?? 0);
          const totalAntigo = Number(existente.totalPrice ?? 0);
          const novaQuantidade = quantidadeAntiga + qtdEntrada;
          const novoPeso = pesoAntigo + pesoEntrada;
          const novoTotal = totalAntigo + precoEntrada;
          await update(produtoRef, {...existente,  quantity: novaQuantidade, peso: novoPeso, totalPrice: novoTotal, dateUpdated: new Date().toISOString(),});
          console.log(`✅ SKU ${produto.sku}: estoque somado (${quantidadeAntiga} + ${qtdEntrada} = ${novaQuantidade})`);
        } else {await set(produtoRef, { ...dataProduto, quantity: qtdEntrada, peso: pesoEntrada, totalPrice: precoEntrada,});
          console.log(`🆕 SKU ${produto.sku}: produto novo adicionado ao estoque.`);
        }
        await push(historicoRef, {pedidoId, quantidade: qtdEntrada, peso: pesoEntrada, totalPrice: precoEntrada, fornecedor: fornecedor?.razaoSocial || "Indefinido", dataEntrada: dataCadastro,});
      });

      await Promise.all(produtoPromises);
      toast.success("Produtos enviados para o estoque com sucesso!");
      console.log("✅ Todos os produtos foram enviados e atualizados no estoque.");
    } catch (error) {
      console.error("❌ Erro ao enviar produtos para o estoque:", error);
      toast.error("Erro ao enviar produtos para o estoque");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Data inválida";

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Data inválida";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${day}/${month}/${year}`;
  };


  const exportToExcel = () => {
    if (!pedidoSelecionado || !pedidoSelecionado.produtos || pedidoSelecionado.produtos.length === 0) {
      toast.error("Nenhum produto para exportar!")
      return
    }
    const ws = XLSX.utils.json_to_sheet(
      pedidoSelecionado.produtos.map((produto) => ({Projeto: produto.projeto, SKU: produto.sku, Produto: produto.name, Marca: produto.marca, Peso: produto.peso, UnidadeMedida: produto.unit,
        Quantidade: `${produto.quantidade} unidades`, Tipo: produto.tipo, ValorUnitario: produto.unitPrice,
        ValorTotal: produto.totalPrice, Observação: produto.observacao || "", ValorTotalPedido: produto.totalPedido,
      })),
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
    if (!pedidoSelecionado) {toast.error("Nenhum pedido selecionado para salvar!"); return}
    const pedidoRef = ref(dbRealtime, `novosPedidos/${pedidoSelecionado.id}`)
    update(pedidoRef, { produtos: pedidoSelecionado.produtos })
      .then(() => {
        toast.success("Pedido atualizado com sucesso!")
        setModalAbertoEdit(false)
        setPedidos((prev) => prev.map((pedido) => pedido.id === pedidoSelecionado.id ? { ...pedido, produtos: pedidoSelecionado.produtos } : pedido,),)
        setPedidoSelecionado((prev) => ({ ...prev, produtos: pedidoSelecionado.produtos }))
      }).catch(() => {toast.error("Erro ao salvar edição!")})
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

  const produtosFiltrados = produtosDisponiveis.filter(
    (produto) =>
      produto.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.sku?.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const handleLimparFiltros = () => {setProjeto(""); setNumeroPedidoFornecedor(""); setDataInicio(""); setDataFim(""); setStatusFiltro(""); setPedidosFiltrados(pedidos); setNumeroNotaFiscal(""); setCurrentPage(1);}
  const handleFiltro = () => {
    let filteredPedidos = pedidos
    if (numeroPedidoFornecedor) {const termo = numeroPedidoFornecedor.toLowerCase()
      filteredPedidos = filteredPedidos.filter((pedido) => pedido.numeroPedido?.toLowerCase().includes(termo) || pedido.fornecedor?.razaoSocial?.toLowerCase().includes(termo),)}
    if (dataInicio) {filteredPedidos = filteredPedidos.filter((pedido) => new Date(pedido.dataPedido) >= new Date(dataInicio))}
    if (dataFim) {filteredPedidos = filteredPedidos.filter((pedido) => new Date(pedido.dataPedido) <= new Date(dataFim))}
    if (statusFiltro) {filteredPedidos = filteredPedidos.filter((pedido) => pedido.status === statusFiltro)}
    if (projeto) {filteredPedidos = filteredPedidos.filter((pedido) => pedido.status === projeto)}
    if (numeroNotaFiscal) {filteredPedidos = filteredPedidos.filter((pedido) => pedido.numeroNotaFiscal && pedido.numeroNotaFiscal.toString().includes(numeroNotaFiscal.toString()),)}
    setPedidosFiltrados(filteredPedidos)
    setCurrentPage(1)
  }
  const handleVoltar = () => navigate("/Pedidos")
  const exportarConsultaParaExcel = () => {
    if (pedidosFiltrados.length === 0) {toast.error("Nenhum pedido filtrado para exportar!"); return;}
    const dataParaExportar = pedidosFiltrados.map((pedido) => {
      const totalPedido = (pedido.produtos || []).reduce((acc, item) => acc + Number(item.totalPrice || 0), 0)
      const totalKilos = (pedido.produtos || []).reduce((acc, item) => acc + Number(item.peso || 0) * Number(item.quantidade || 0), 0,)
      return {Número: pedido.numeroPedido, Data: formatDate(pedido.dataPedido), Fornecedor: pedido?.fornecedor?.razaoSocial || "Não informado", Categoria: pedido.category || "Não informado", Status: pedido.status,
        MotivoCancelamento: pedido.motivoCancelamento || "", TotalPedido: totalPedido.toFixed(2), TotalKilos: totalKilos.toFixed(2)}
    })
    const ws = XLSX.utils.json_to_sheet(dataParaExportar)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Status dos Pedidos")
    XLSX.writeFile(wb, "Pedidos_Filtrados.xlsx")
  }

  const headerImgSrc = "./Reciclar_30anos_Horizontal_Positivo.png"
  const segundaHeaderImgSrc = "./seloAtualizado.png"
  const footerImgSrc = "./selo.png"
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image(); img.src = src; img.onload = () => resolve(img); img.onerror = (err) => reject(err)})
  }

  const exportToPDF = async () => {
    if (!pedidoSelecionado) {console.error("Pedido não selecionado."); return;}
    try {
      const [headerImg, segundaHeaderImg, footerImg] = await Promise.all([
        loadImage(headerImgSrc),
        loadImage(segundaHeaderImgSrc),
        loadImage(footerImgSrc),
      ])
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      // Margens menores
      const contentTop = 25
      const contentBottom = pageHeight - 25
      const marginLeft = 15
      // Helpers
      const addHeader = () => {
        doc.addImage(headerImg, "PNG", 10, 6, 40, 8)
        doc.addImage(segundaHeaderImg, "PNG", pageWidth - 55, 6, 40, 8)
      }
      const addFooter = (pageNumber) => {
        doc.addImage(footerImg, "PNG", 10, pageHeight - 22, 80, 20)
        doc.setFontSize(8)
        doc.text(`Página ${pageNumber}`, pageWidth - 25, pageHeight - 10)
      }
      const addLabelValue = (label, value, x, y, width = 40) => {
        doc.setFontSize(9)
        doc.setFont("Helvetica", "bold")
        doc.text(label, x, y)
        doc.setFont("Helvetica", "normal")
        doc.text(value, x + width, y)
      }
      // Início
      let currentPage = 1
      addHeader()
      addFooter(currentPage)
      doc.setFont("Helvetica", "bold")
      doc.setFontSize(12)
      doc.text("Resumo do Pedido", pageWidth / 2, contentTop, { align: "center" })
      let y = contentTop + 8
      // Dados do pedido em 2 colunas
      addLabelValue("Número:", String(pedidoSelecionado.numeroPedido || ""), marginLeft, y)
      addLabelValue("Data:", formatDate(pedidoSelecionado.dataPedido || ""), pageWidth / 2, y)
      y += 6
      addLabelValue("Projeto:", String(pedidoSelecionado.projeto || ""), marginLeft, y)
      addLabelValue("Fornecedor:", String(pedidoSelecionado.fornecedor?.razaoSocial || ""), pageWidth / 2, y)
      y += 6
      addLabelValue("Período:",`${formatDate(pedidoSelecionado.periodoInicio)} até ${formatDate(pedidoSelecionado.periodoFim)}`, marginLeft, y,
      )
      y += 12
      // Cabeçalho da tabela
      const addTableHeader = (y) => {
        doc.setFillColor(230, 230, 230)
        doc.rect(marginLeft, y - 4, pageWidth - marginLeft * 2, 7, "F")
        doc.setFontSize(8)
        doc.setFont("Helvetica", "bold")
        doc.text("Produto", marginLeft + 2, y)
        doc.text("Peso", 65, y)
        doc.text("Unid.", 80, y)
        doc.text("Marca", 95, y)
        doc.text("Qtd.", 125, y, { align: "right" })
        doc.text("Obs.", 135, y)
        doc.setFont("Helvetica", "normal")
      }
      addTableHeader(y)
      y += 6
      const lineHeight = 4.5
      doc.setFontSize(8)
      ;(pedidoSelecionado.produtos || []).forEach((produto, index) => {
        // Quebra observação longa
        let obs = produto.observacao || "Sem obs."
        if (obs.length > 80) obs = obs.slice(0, 77) + "..."
        const nome = String(produto.name || "")
        const peso = String(produto.peso || "")
        const unidade = String(produto.unitMeasure || "")
        const marca = String(produto.marca || "")
        const quantidade = String(produto.quantidade || "0")
        // Se passar do limite da página → nova página
        if (y + lineHeight > contentBottom) {
          doc.addPage()
          currentPage++
          addHeader()
          addFooter(currentPage)
          y = contentTop
          addTableHeader(y)
          y += 6
        }
        if (index % 2 === 0) {doc.setFillColor(245, 245, 245)
          doc.rect(marginLeft, y - 3.5, pageWidth - marginLeft * 2, lineHeight + 1, "F")
        }
        doc.text(doc.splitTextToSize(nome, 40), marginLeft + 2, y)
        doc.text(peso, 65, y)
        doc.text(unidade, 80, y)
        doc.text(marca, 95, y)
        doc.text(quantidade, 125, y, { align: "right" })
        doc.text(doc.splitTextToSize(obs, 55), 135, y)
        y += lineHeight + 1
      })
      if (y + 10 > contentBottom) {
        doc.addPage()
        currentPage++
        addHeader()
        addFooter(currentPage)
        y = contentTop
      }
      const totalQtd = (pedidoSelecionado.produtos || []).reduce((sum, p) => sum + Number(p.quantidade || 0), 0)
      doc.setFont("Helvetica", "bold")
      doc.setFontSize(9)
      doc.text(`Total de Itens: ${pedidoSelecionado.produtos?.length || 0}`, marginLeft, y + 6)
      doc.text(`Quantidade Total: ${totalQtd}`, pageWidth / 2, y + 6)
      doc.save(`pedido_${pedidoSelecionado.numeroPedido || "sem_numero"}.pdf`)
    } catch (error) { console.error("Erro ao gerar PDF:", error) }
  }

  const salvarDescontoNoPedido = async () => {
    if (!pedidoSelecionado?.id) return
    setSalvandoDesconto(true)
    try {
      await update(ref(dbRealtime, `novosPedidos/${pedidoSelecionado.id}`), { desconto })
      setEditandoDesconto(false)
      toast.success("Desconto salvo com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar desconto:", error)
      toast.error("Erro ao salvar desconto")
    }  finally {setSalvandoDesconto(false)}
  }

  const abrirModalDuplicar = () => {
    const randomId = Math.floor(2000 + Math.random() * 10000)
    const novoNumero = `PED${randomId}`; setNumeroDuplicado(novoNumero); setNovaDataPedido(new Date().toISOString().slice(0, 10))
    setNovoPeriodoInicio(""); setNovoPeriodoFim(""); setFornecedorSelecionado(null); setProjetoSelecionado(null); setModalDuplicarAberto(true);
  }

  const handleDuplicarPedido = async () => {
    if (!novaDataPedido || !novoPeriodoInicio || !novoPeriodoFim) { toast.error("Preencha todos os campos."); return; }
    if (!fornecedorSelecionado) { toast.error("Selecione um fornecedor."); return;}
    if (!projetoSelecionado) { toast.error("Selecione um projeto."); return; }

    const novoPedido = {...pedidoSelecionado, numeroPedido: numeroDuplicado, dataPedido: novaDataPedido, periodoInicio: novoPeriodoInicio, periodoFim: novoPeriodoFim, status: "Pendente", motivoCancelamento: "", recebido: "", numeroNotaFiscal: "", chaveAcesso: "",
      fornecedor: {razaoSocial: fornecedorSelecionado.razaoSocial, contato: fornecedorSelecionado.contato, telefone: fornecedorSelecionado.telefone,  email: fornecedorSelecionado.email,}, projeto: projetoSelecionado, }
    delete novoPedido.id // garante que o Firebase crie um novo ID

    try {
      await push(ref(dbRealtime, "novosPedidos"), novoPedido)
      toast.success("Pedido duplicado com sucesso!")
      setModalDuplicarAberto(false)

      // Atualiza a lista de pedidos
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

  const pedidosOrdenados = useMemo(() => {
    return [...pedidosFiltrados].sort((a, b) => {
      if (a.status === "Pendente" && b.status !== "Pendente") return -1
      if (a.status !== "Pendente" && b.status === "Pendente") return 1
      const dateA = new Date(a.dataPedido || 0)
      const dateB = new Date(b.dataPedido || 0)
      return dateB - dateA
    })}, [pedidosFiltrados])

  const totalPages = Math.ceil(pedidosOrdenados.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const pedidosPaginados = pedidosOrdenados.slice(startIndex, endIndex)
  const handlePreviousPage = () => {setCurrentPage((prev) => Math.max(prev - 1, 1))}
  const handleNextPage = () => {setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
  const handlePageClick = (pageNumber) => {setCurrentPage(pageNumber)}
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    if (totalPages <= maxVisiblePages) {for (let i = 1; i <= totalPages; i++) {pages.push(i)}} 
    else {
      if (currentPage <= 3) {for (let i = 1; i <= 4; i++) pages.push(i); pages.push("..."); pages.push(totalPages)} 
      else if (currentPage >= totalPages - 2) {pages.push(1); pages.push("..."); for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)} 
      else { pages.push(1); pages.push("..."); for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i); pages.push("..."); pages.push(totalPages)}
    }
    return pages;
  }

  const atualizarDadosDoFornecedor = (forn) => {setPedidoSelecionado((prev) => ({...prev,fornecedor: {razaoSocial: forn.razaoSocial, contato: forn.contato, telefone: forn.telefone, email: forn.email,},}))}
  const formatInputDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleEditarPeriodo = () => {setEditPeriodoInicio(formatInputDate(pedidoSelecionado.periodoInicio)); setEditPeriodoFim(formatInputDate(pedidoSelecionado.periodoFim)); setEditandoPeriodo(true);};
  const handleCancelarPeriodo = () => {setEditandoPeriodo(false); setEditPeriodoInicio(""); setEditPeriodoFim("");};
 
  const handleSalvarPeriodo = async () => {
    if (!pedidoSelecionado?.id) {toast.error("Nenhum pedido selecionado."); return;}
    if (!editPeriodoInicio || !editPeriodoFim) {toast.warn("As datas de início e fim são obrigatórias."); return;}
    const novoInicio = new Date(`${editPeriodoInicio}T00:00:00`).toISOString();
    const novoFim = new Date(`${editPeriodoFim}T00:00:00`).toISOString();
    if (new Date(novoFim) < new Date(novoInicio)) {toast.error("A data final não pode ser anterior à data inicial."); return;}
    const pedidoRef = ref(dbRealtime, `novosPedidos/${pedidoSelecionado.id}`);
    try {
      await update(pedidoRef, {periodoInicio: novoInicio, periodoFim: novoFim,});
      const pedidoAtualizado = {...pedidoSelecionado, periodoInicio: novoInicio, periodoFim: novoFim};
      setPedidoSelecionado(pedidoAtualizado);
      setPedidos(prev => prev.map(p =>p.id === pedidoSelecionado.id ? pedidoAtualizado : p));
      setPedidosFiltrados(prev => prev.map(p =>p.id === pedidoSelecionado.id ? pedidoAtualizado : p));
      toast.success("Período atualizado com sucesso!"); setEditandoPeriodo(false);
    } catch (error) {console.error("Erro ao salvar período:", error); toast.error("Erro ao salvar período.");}
  };

  const iniciarEdicaoData = (pedido) => {setEditandoDataId(pedido.id); setNovaDataPedidoTabela(formatInputDate(pedido.dataPedido));};
  const salvarDataPedidoTabela = async (pedido) => {
    try {
      const novaDataISO = new Date(`${novaDataPedidoTabela}T00:00:00`).toISOString();
      await update(ref(dbRealtime, `novosPedidos/${pedido.id}`), {dataPedido: novaDataISO,});
      setPedidos(prev => prev.map(p => p.id === pedido.id ? { ...p, dataPedido: novaDataISO } : p));
      setPedidosFiltrados(prev => prev.map(p => p.id === pedido.id ? { ...p, dataPedido: novaDataISO } : p));
      toast.success("Data atualizada!");} 
    catch (error) {toast.error("Erro ao atualizar data!");} 
    setEditandoDataId(null);};
  
  const handleKeyDownData = (e, pedido) => {if (e.key === "Enter") {salvarDataPedidoTabela(pedido);}};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
      <ToastContainer position="top-right" />
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-2xl border-b-4 border-purple-400/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">Gerenciamento de Pedidos</h1>
              <p className="mt-1 text-sm text-blue-50">Gerencie e acompanhe todos os pedidos</p>
            </div>
            <Button onClick={handleVoltar} variant="outline" className="flex items-center gap-2 bg-white/30 hover:bg-white/40 text-white border-2 border-white/60 backdrop-blur-sm transition-all hover:scale-105 shadow-xl">
              <ArrowLeft className="h-4 w-4" />Voltar</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8 shadow-2xl border-2 border-purple-300 dark:border-purple-700 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50">
          <CardHeader className="bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 border-b-2 border-purple-300 dark:border-purple-700">
            <CardTitle className="flex items-center gap-2 text-foreground"><Filter className="h-5 w-5 text-purple-600 dark:text-purple-400 drop-shadow-md" />Filtros de Consulta</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
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
              <Button onClick={handleFiltro}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <Search className="h-4 w-4" />Consultar</Button>
              <Button onClick={handleLimparFiltros} variant="outline"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800/50 dark:hover:to-pink-800/50 border-2 border-purple-400 dark:border-purple-600 transition-all hover:scale-105 shadow-lg text-purple-700 dark:text-purple-300">
                <RefreshCw className="h-4 w-4" />Limpar Filtros </Button>
              <Button onClick={exportarConsultaParaExcel} variant="outline"
                className="flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 hover:from-green-200 hover:to-emerald-200 dark:hover:from-green-800/50 dark:hover:to-emerald-800/50 border-2 border-green-400 dark:border-green-600 transition-all hover:scale-105 shadow-lg text-green-700 dark:text-green-300" >
                <Download className="h-4 w-4" />Exportar Consulta</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl border-2 border-blue-300 dark:border-blue-700 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50">
          <CardHeader className="bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 border-b-2 border-purple-300 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground flex items-center gap-2"><div className="h-8 w-1.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg"></div>Lista de Pedidos</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{pedidosOrdenados.length}</span>{" "}pedido(s) encontrado(s) • Página{" "}
                  <span className="font-semibold text-purple-600 dark:text-purple-400">{currentPage}</span> de{" "}
                  <span className="font-semibold text-pink-600 dark:text-pink-400">{totalPages}</span>
                </p>
              </div>
              <div className="text-sm font-medium px-4 py-2 rounded-lg bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800/50 dark:to-purple-800/50 border-2 border-purple-400 dark:border-purple-600 shadow-lg">
               Mostrando{" "} <span className="text-blue-700 dark:text-blue-300 font-bold"> {startIndex + 1}-{Math.min(endIndex, pedidosOrdenados.length)}</span>{" "}de <span className="text-purple-700 dark:text-purple-300 font-bold">{pedidosOrdenados.length}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (<LoadingSpinner />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-blue-300/50 via-purple-300/50 to-pink-300/50 dark:from-blue-700/50 dark:via-purple-700/50 dark:to-pink-700/50 border-b-2 border-purple-400 dark:border-purple-600">
                        <TableHead className="text-center font-bold text-foreground">Número</TableHead>
                        <TableHead className="text-center font-bold text-foreground">Projeto</TableHead>
                        <TableHead className="text-center font-bold text-foreground">Nota Fiscal</TableHead>
                        <TableHead className="text-center font-bold text-foreground">Data</TableHead>
                        <TableHead className="text-center font-bold text-foreground">Fornecedor</TableHead>
                        <TableHead className="text-center font-bold text-foreground">Categoria</TableHead>
                        <TableHead className="text-center font-bold text-foreground">Status</TableHead>
                        <TableHead className="text-center font-bold text-foreground">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pedidosPaginados.length > 0 ? (
                        pedidosPaginados.map((pedido, index) => (
                          <TableRow key={pedido.id}
                            className={`transition-all hover:bg-gradient-to-r hover:from-blue-100 hover:via-purple-100 hover:to-pink-100 dark:hover:from-blue-900/30 dark:hover:via-purple-900/30 dark:hover:to-pink-900/30 hover:scale-[1.01] hover:shadow-xl ${index % 2 === 0 ? "bg-purple-50/50 dark:bg-purple-900/20" : "bg-pink-50/50 dark:bg-pink-900/20"}`}>
                            <TableCell className="font-bold text-center text-blue-600 dark:text-blue-400">{pedido.numeroPedido}</TableCell>
                            <TableCell className="text-center font-medium">{pedido.projeto}</TableCell>
                            <TableCell className="text-center">
                              {pedido.numeroNotaFiscal ? (<span className="px-2 py-1 bg-emerald-200 text-emerald-800 rounded-md font-medium">Nº: {pedido.numeroNotaFiscal}</span>) : ("-")}
                            </TableCell>
                            <TableCell className="text-center cursor-pointer" onDoubleClick={() => iniciarEdicaoData(pedido)}>
                              {editandoDataId === pedido.id ? (
                                <Input type="date" autoFocus className="w-[150px]"
                                  value={novaDataPedidoTabela} onChange={(e) => setNovaDataPedidoTabela(e.target.value)} onKeyDown={(e) => handleKeyDownData(e, pedido)} />
                              ) : (<span>{formatDate(pedido.dataPedido)}</span>)}
                            </TableCell>
                            <TableCell className="text-center font-medium">{pedido?.fornecedor?.razaoSocial || "Não informado"}</TableCell>
                            <TableCell className="text-center">{pedido.category || "Não informado"}</TableCell>
                            <TableCell className="text-center"><StatusBadge status={pedido.status} /></TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Button size="sm" variant="outline" onClick={() => {setPedidoSelecionado(pedido); setModalAberto(true)}}
                                  className="flex items-center gap-1 bg-gradient-to-r from-blue-200 to-blue-300 dark:from-blue-800/50 dark:to-blue-900/50 hover:from-blue-300 hover:to-blue-400 dark:hover:from-blue-700/50 dark:hover:to-blue-800/50 border-2 border-blue-400 dark:border-blue-600 transition-all hover:scale-110 shadow-lg text-blue-700 dark:text-blue-300">
                                  <Eye className="h-3 w-3" />Ver</Button>
                                {pedido.status === "Pendente" && (
                                  <>
                                    <Button size="sm" variant="outline" onClick={() => {setPedidoSelecionado(pedido); setModalAbertoEdit(true)}}
                                      className="flex items-center gap-1 bg-gradient-to-r from-purple-200 to-purple-300 dark:from-purple-800/50 dark:to-purple-900/50 hover:from-purple-300 hover:to-purple-400 dark:hover:from-purple-700/50 dark:hover:to-purple-800/50 border-2 border-purple-400 dark:border-purple-600 transition-all hover:scale-110 shadow-lg text-purple-700 dark:text-purple-300">
                                      <Edit className="h-3 w-3" /> Editar </Button>
                                    <Button size="sm" onClick={() => {setPedidoSelecionado(pedido); setModalAbertoAprovacao(true)}}
                                      className="flex items-center gap-1 bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 hover:from-emerald-500 hover:via-green-500 hover:to-emerald-600 text-emerald-950 border-2 border-emerald-600 transition-all hover:scale-110 shadow-xl shadow-emerald-300/50">
                                      <Check className="h-3 w-3" />Aprovar</Button>
                                    <Button size="sm" variant="destructive" onClick={() => {setPedidoSelecionado(pedido); setModalAbertoCancelamento(true)}}
                                      className="flex items-center gap-1 bg-gradient-to-r from-rose-400 via-red-400 to-rose-500 hover:from-rose-500 hover:via-red-500 hover:to-rose-600 text-rose-950 border-2 border-rose-600 transition-all hover:scale-110 shadow-xl shadow-rose-300/50">
                                      <X className="h-3 w-3" />Cancelar</Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Nenhum pedido encontrado com os filtros aplicados.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {pedidosOrdenados.length > 0 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t-2 border-gradient-to-r from-blue-400/50 via-purple-400/50 to-pink-400/50">
                    <div className="text-sm flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-200 to-yellow-200 dark:from-amber-800/50 dark:to-yellow-800/50 border-2 border-amber-400 dark:border-amber-600 shadow-lg">
                      <div className="h-3 w-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 animate-pulse shadow-lg shadow-amber-400"></div>
                      <span className="font-medium text-amber-900 dark:text-amber-100">Pedidos pendentes são priorizados na primeira página</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}
                        className="flex items-center gap-1 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800/50 dark:to-purple-800/50 hover:from-blue-300 hover:to-purple-300 dark:hover:from-blue-700/50 dark:hover:to-purple-700/50 border-2 border-blue-400 dark:border-blue-600 disabled:opacity-50 transition-all hover:scale-105 shadow-lg text-blue-700 dark:text-blue-300">
                        <ChevronLeft className="h-4 w-4" /> Anterior</Button>
                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((pageNum, index) =>
                          pageNum === "..." ? (<span key={`ellipsis-${index}`} className="px-2 text-purple-600 dark:text-purple-400 font-bold">...</span>
                          ) : (<Button key={pageNum} variant={currentPage === pageNum ? "default" : "outline"} size="sm" onClick={() => handlePageClick(pageNum)}
                              className={`min-w-[40px] transition-all hover:scale-110 shadow-lg ${currentPage === pageNum
                                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl shadow-purple-400/50 border-2 border-purple-400"
                                  : "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800/50 dark:hover:to-pink-800/50 border-2 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                              }`}>{pageNum}</Button>
                          ),
                        )}
                      </div>
                      <Button variant="outline" size="sm" onClick={handleNextPage}  disabled={currentPage === totalPages}
                        className="flex items-center gap-1 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800/50 dark:to-pink-800/50 hover:from-purple-300 hover:to-pink-300 dark:hover:from-purple-700/50 dark:hover:to-pink-700/50 border-2 border-purple-400 dark:border-purple-600 disabled:opacity-50 transition-all hover:scale-105 shadow-lg text-purple-700 dark:text-purple-300">
                        Próxima<ChevronRight className="h-4 w-4" /></Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Modal de Aprovação */}
      <Dialog open={modalAbertoAprovacao} onOpenChange={setModalAbertoAprovacao}>
        <DialogContent className="max-w-md border-2 border-emerald-400 dark:border-emerald-600 shadow-2xl shadow-emerald-300/50 dark:shadow-emerald-900/50 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <div className="h-8 w-1 bg-gradient-to-b from-emerald-400 to-green-500 rounded-full shadow-lg"></div>
              Aprovar Pedido #{pedidoSelecionado.numeroPedido}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nf-aprovacao">Número da Nota Fiscal *</Label>
              <Input
                id="nf-aprovacao"
                placeholder="Digite o número da nota fiscal"
                value={numeroNotaFiscal}
                onChange={(e) => setNumeroNotaFiscal(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chave-acesso">Chave de Acesso *</Label>
              <Input
                id="chave-acesso"
                placeholder="Digite a chave de acesso"
                value={chaveAcesso}
                onChange={(e) => setChaveAcesso(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recebido-por">Recebido por</Label>
              <Input
                id="recebido-por"
                placeholder="Nome de quem recebeu"
                value={recebido}
                onChange={(e) => setRecebido(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalAbertoAprovacao(false)} className="border-2">
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (!numeroNotaFiscal || !chaveAcesso) {
                    toast.error("Preencha a Nota Fiscal e a Chave de Acesso antes de aprovar.")
                    return
                  }
                  handleAtualizarStatus(pedidoSelecionado.id, "Aprovado", "", numeroNotaFiscal, chaveAcesso, recebido)
                  setModalAbertoAprovacao(false)
                  setNumeroNotaFiscal("")
                  setChaveAcesso("")
                  setRecebido("")
                }}
                className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-emerald-950 shadow-xl shadow-emerald-300/50 transition-all hover:scale-105"
              >
                Confirmar Aprovação
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Cancelamento */}
      <Dialog open={modalAbertoCancelamento} onOpenChange={setModalAbertoCancelamento}>
        <DialogContent className="max-w-md border-2 border-rose-400 dark:border-rose-600 shadow-2xl shadow-rose-300/50 dark:shadow-rose-900/50 bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/50 dark:to-red-950/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-8 w-1 bg-gradient-to-b from-rose-400 to-red-500 rounded-full shadow-lg"></div>
              Cancelar Pedido #{pedidoSelecionado.numeroPedido}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="motivo-cancelamento">Motivo do Cancelamento *</Label>
              <Textarea
                id="motivo-cancelamento"
                placeholder="Descreva o motivo do cancelamento"
                value={motivoCancelamento}
                onChange={(e) => setMotivoCancelamento(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalAbertoCancelamento(false)} className="border-2">
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleAtualizarStatus(pedidoSelecionado.id, "Cancelado", motivoCancelamento)
                  setModalAbertoCancelamento(false)
                  setMotivoCancelamento("")
                }}
                className="bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 hover:from-rose-600 hover:via-red-600 hover:to-rose-700 text-rose-950 shadow-xl shadow-rose-300/50 transition-all hover:scale-105"
              >
                Confirmar Cancelamento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto border-2 border-purple-400 dark:border-purple-600 shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
          <DialogHeader>
            <DialogTitle className="text-2xl text-foreground flex items-center gap-2">
              <div className="h-10 w-1.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg"></div>
              Pedido #{pedidoSelecionado.numeroPedido}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">


<Card className="shadow-xl border-2 border-blue-300 dark:border-blue-700 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
              <CardHeader className="bg-gradient-to-r from-blue-400/40 to-purple-400/40 border-b-2 border-blue-400 dark:border-blue-600">
                <CardTitle className="text-lg text-foreground flex items-center gap-2">
                  <div className="h-6 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full shadow-md"></div>
                  Informações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    ["Status", <StatusBadge key="status" status={pedidoSelecionado.status} />],
                    ["Projeto Custeador", pedidoSelecionado.projeto || "Não informado"],
                    ["Fornecedor", pedidoSelecionado.fornecedor?.razaoSocial || "Não informado"],
                    ["Contato", pedidoSelecionado.fornecedor?.contato || "Não informado"],
                    ["Telefone", pedidoSelecionado.fornecedor?.telefone || "Não informado"],
                    ["E-mail", pedidoSelecionado.fornecedor?.email || "Não informado"],
                    
                    // --- INÍCIO DA MODIFICAÇÃO ---
                    [
                      "Período",
                      !editandoPeriodo ? (
                        // Modo de Visualização
                        <div className="flex items-center justify-between min-h-[36px]"> {/* Altura mínima para alinhar */}
                          <span>
                            {formatDate(pedidoSelecionado.periodoInicio)} até {formatDate(pedidoSelecionado.periodoFim)}
                          </span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleEditarPeriodo} title="Editar período">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        // Modo de Edição
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Início:</Label>
                          <Input
                            type="date"
                            value={editPeriodoInicio}
                            onChange={(e) => setEditPeriodoInicio(e.target.value)}
                            className="text-sm h-9"
                          />
                          <Label className="text-xs text-muted-foreground">Fim:</Label>
                           <Input
                            type="date"
                            value={editPeriodoFim}
                            onChange={(e) => setEditPeriodoFim(e.target.value)}
                            className="text-sm h-9"
                          />
                          <div className="flex gap-2 justify-end pt-1">
                            <Button variant="ghost" size="sm" onClick={handleCancelarPeriodo}>
                              <X className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                            <Button variant="default" size="sm" onClick={handleSalvarPeriodo}>
                              <Check className="h-4 w-4 mr-1" />
                              Salvar
                            </Button>
                          </div>
                        </div>
                      ),
                    ],
                    // --- FIM DA MODIFICAÇÃO ---
                    
                    ["Motivo de Cancelamento", pedidoSelecionado.motivoCancelamento || "Não informado"],
                    ["Nota Fiscal", pedidoSelecionado.numeroNotaFiscal || "Não informado"],
                    ["Chave de Acesso", pedidoSelecionado.chaveAcesso || "Não informado"],
                    ["Recebido por", pedidoSelecionado.recebido || "Não informado"],
                  ].map(([label, value], index) => (
                    <div key={index} className="space-y-1">
                      <Label className="text-sm font-medium text-gray-600">{label}</Label>
                      {/* O div abaixo agora renderiza JSX ou texto simples */}
                      <div className="text-sm">{value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-xl border-2 border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
              <CardHeader className="bg-gradient-to-r from-purple-400/40 to-pink-400/40 border-b-2 border-purple-400 dark:border-purple-600">
                <CardTitle className="text-lg text-foreground flex items-center gap-2">
                  <div className="h-6 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full shadow-md"></div>
                  Valores Financeiros
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-6 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl border-4 border-emerald-300 dark:border-emerald-700 shadow-xl shadow-emerald-200 dark:shadow-emerald-900/50 transition-all hover:scale-105">
                    <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 drop-shadow-md">
                      R$ {(Number(totalPedido) || 0).toFixed(2)}
                    </div>
                    <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">Valor Total</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-xl border-4 border-amber-300 dark:border-amber-700 shadow-xl shadow-amber-200 dark:shadow-amber-900/50 transition-all hover:scale-105">
                    {editandoDesconto ? (
                      <Input
                        type="number"
                        value={desconto}
                        onChange={(e) => setDesconto(Number(e.target.value))}
                        onKeyDown={(e) => e.key === "Enter" && salvarDescontoNoPedido()}
                        onBlur={salvarDescontoNoPedido}
                        className="text-center text-xl font-bold border-2 border-amber-400"
                        autoFocus
                      />
                    ) : (
                      <div className="cursor-pointer" onDoubleClick={() => setEditandoDesconto(true)}>
                        <div className="text-3xl font-bold text-amber-700 dark:text-amber-300 drop-shadow-md">R$ {desconto.toFixed(2)}</div>
                        <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-1">Desconto (clique 2x para editar)</div>
                      </div>
                    )}
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border-4 border-blue-300 dark:border-blue-700 shadow-xl shadow-blue-200 dark:shadow-blue-900/50 transition-all hover:scale-105">
                    <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 drop-shadow-md">R$ {(totalPedido - desconto).toFixed(2)}</div>
                    <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">Total com Desconto</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-xl border-2 border-pink-300 dark:border-pink-700 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30">
              <CardHeader className="bg-gradient-to-r from-pink-400/40 to-rose-400/40 border-b-2 border-pink-400 dark:border-pink-600">
                <CardTitle className="text-lg text-foreground flex items-center gap-2"><div className="h-6 w-1 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full shadow-md"></div>Controle de Caixa</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <InputValorCaixa valorInicial={valorCaixaDigitado} onSalvar={(valor) => {setValorCaixaDigitado(valor); salvarValorCaixaNoBanco(valor)}}/>
                  <div className="flex items-center gap-4">
                    <Label className="text-foreground font-semibold">Sobra do Caixa:</Label>
                    <div className={`text-xl font-bold px-6 py-3 rounded-xl border-4 shadow-xl transition-all hover:scale-105 ${sobras >= 0
                          ? "text-emerald-700 dark:text-emerald-300 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 border-emerald-300 dark:border-emerald-700 shadow-emerald-200 dark:shadow-emerald-900/50"
                          : "text-rose-700 dark:text-rose-300 bg-gradient-to-r from-rose-100 to-red-100 dark:from-rose-900/30 dark:to-red-900/30 border-rose-300 dark:border-rose-700 shadow-rose-200 dark:shadow-rose-900/50"}`}> 
                    R$ {sobras.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-wrap gap-3">
              <Button onClick={exportToExcel}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <Download className="h-4 w-4" />Exportar Excel</Button>
              <Button onClick={exportToPDF} variant="outline"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800/50 dark:to-pink-800/50 hover:from-purple-300 hover:to-pink-300 dark:hover:from-purple-700/50 dark:hover:to-pink-700/50 border-2 border-purple-400 dark:border-purple-600 transition-all hover:scale-105 shadow-lg text-purple-700 dark:text-purple-300">
                <FileText className="h-4 w-4" />Exportar PDF</Button>
              <Button asChild variant="outline"
               className="flex items-center gap-2 bg-gradient-to-r from-green-200 to-emerald-200 dark:from-green-800/50 dark:to-emerald-800/50 hover:from-green-300 hover:to-emerald-300 dark:hover:from-green-700/50 dark:hover:to-emerald-700/50 border-2 border-green-400 dark:border-green-600 transition-all hover:scale-105 shadow-lg text-green-700 dark:text-green-300">
                <Link to="https://www.nfce.fazenda.sp.gov.br/NFCeConsultaPublica/Paginas/ConsultaPublica.aspx" target="_blank"><ExternalLink className="h-4 w-4" />Consultar NF</Link>
              </Button>
              <Button asChild variant="outline"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-200 to-cyan-200 dark:from-blue-800/50 dark:to-cyan-800/50 hover:from-blue-300 hover:to-cyan-300 dark:hover:from-blue-700/50 dark:hover:to-cyan-700/50 border-2 border-blue-400 dark:border-blue-600 transition-all hover:scale-105 shadow-lg text-blue-700 dark:text-blue-300">
                <Link to="https://www.nfe.fazenda.gov.br/portal/principal.aspx" target="_blank"><ExternalLink className="h-4 w-4" />Consultar Cupom</Link>
              </Button>
              <Button onClick={abrirModalDuplicar} variant="outline"
                className="flex items-center gap-1 bg-gradient-to-r from-amber-200 to-yellow-200 dark:from-amber-800/50 dark:to-yellow-800/50 hover:from-amber-300 hover:to-yellow-300 dark:hover:from-amber-700/50 dark:hover:to-yellow-700/50 border-2 border-amber-400 dark:border-amber-600 transition-all hover:scale-105 shadow-lg text-amber-700 dark:text-amber-300">
                <Copy className="w-4 h-4" />Duplicar Pedido</Button>
            </div>
            {/* MODAL DE DUPLICAÇÃO DE PEDIDOS */}
            <Dialog open={modalDuplicarAberto} onOpenChange={setModalDuplicarAberto}>
              <DialogContent className="border-2 border-primary/30 shadow-xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2"><div className="h-8 w-1 bg-gradient-to-b from-primary via-secondary to-accent rounded-full"></div> Duplicar Pedido</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Número do novo pedido</Label>
                    <Input value={numeroDuplicado} disabled className="bg-muted" />
                  </div>
                  <div>
                    <Label>Data do Pedido</Label>
                    <Input type="date" value={novaDataPedido} onChange={(e) => setNovaDataPedido(e.target.value)} />
                  </div>
                  <div>
                    <Label>Período Início</Label>
                    <Input type="date" value={novoPeriodoInicio} onChange={(e) => setNovoPeriodoInicio(e.target.value)} />
                  </div>
                  <div>
                    <Label>Período Fim</Label>
                    <Input type="date" value={novoPeriodoFim} onChange={(e) => setNovoPeriodoFim(e.target.value)} />
                  </div>
                  <div>
                    <Label>Fornecedor</Label>
                    <Select value={fornecedorSelecionado?.id || ""}
                      onValueChange={(id) => {const f = fornecedores.find((f) => f.id === id); setFornecedorSelecionado(f); atualizarDadosDoFornecedor(f)}}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Selecione um fornecedor" />
                      </SelectTrigger>
                      <SelectContent>{fornecedores.map((f) => (<SelectItem key={f.id} value={f.id} className="hover:bg-primary/10">{f.razaoSocial} - {f.contato}</SelectItem>))}</SelectContent>
                    </Select>
                    <div>
                      <Label>Projeto</Label>
                      <Select value={projetoSelecionado || ""} onValueChange={(value) => setProjetoSelecionado(value)}>
                        <SelectTrigger className="bg-background border-border"><SelectValue placeholder="Selecione um projeto" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FUMCAD" className="hover:bg-primary/10">FUMCAD</SelectItem>
                          <SelectItem value="CONDECA" className="hover:bg-primary/10">CONDECA</SelectItem>
                          <SelectItem value="INSTITUTO RECICLAR" className="hover:bg-primary/10">INSTITUTO RECICLAR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* Botões */}
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setModalDuplicarAberto(false)} className="border-2">Cancelar</Button>
                    <Button onClick={handleDuplicarPedido} className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/30"> Confirmar Duplicação</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Modal de Seleção de Fornecedor */}
            <Dialog open={modalFornecedorAberto} onOpenChange={setModalFornecedorAberto}>
              <DialogContent className="border-2 border-accent/30 shadow-xl">
                <DialogHeader><DialogTitle className="flex items-center gap-2"><div className="h-8 w-1 bg-gradient-to-b from-accent to-primary rounded-full"></div> Selecionar Fornecedor</DialogTitle></DialogHeader>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {fornecedores.map((forn) => (
                    <Button key={forn.id} variant={fornecedorSelecionado?.id === forn.id ? "default" : "outline"}
                      onClick={() => { setFornecedorSelecionado(forn); setModalFornecedorAberto(false); atualizarDadosDoFornecedor(forn)}} className="w-full justify-start px-4 py-2 text-left">{forn.razaoSocial}</Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Card className="shadow-xl border-2 border-blue-300 dark:border-blue-700 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30">
            <CardHeader className="bg-gradient-to-r from-blue-400/40 via-cyan-400/40 to-blue-400/40 border-b-2 border-blue-400 dark:border-blue-600 flex justify-between items-center">
              <CardTitle className="text-lg text-foreground flex items-center gap-2"><div className="h-6 w-1 bg-gradient-to-b from-blue-500 via-cyan-500 to-blue-500 rounded-full shadow-md"></div> Produtos do Pedido</CardTitle>
              {/* 👇 Exibição dos quilos totais */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Kilos Totais:</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-lg shadow-sm">
                  {pedidoSelecionado?.kilosTotais ? `${Number(pedidoSelecionado.kilosTotais).toFixed(2)} kg` : "—"}</span>
              </div>
            </CardHeader>

              <CardContent className="pt-6">
                <div className="overflow-x-auto text-center">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-blue-300/50 via-cyan-300/50 to-blue-300/50 dark:from-blue-700/50 dark:via-cyan-700/50 dark:to-blue-700/50 border-b-2 border-blue-400 dark:border-blue-600">
                        <TableHead className="text-center font-bold text-foreground">SKU</TableHead>
                        <TableHead className="text-center font-bold text-foreground">Produto</TableHead>
                        <TableHead className="text-center font-bold text-foreground">Marca</TableHead>
                        <TableHead className="text-center font-bold text-foreground">Tipo</TableHead>
                        <TableHead className="text-center font-bold text-foreground">Grupo</TableHead>
                        <TableHead className="text-center font-bold text-foreground">Peso Unit.</TableHead>
                        <TableHead className="text-center font-bold text-foreground">Unidade</TableHead>
                        <TableHead className="text-center font-bold text-foreground">Quantidade</TableHead>
                        <TableHead className="text-center font-bold text-foreground">Valor Unit.</TableHead>
                        <TableHead className="text-center font-bold text-foreground">Valor Total</TableHead>
                        <TableHead className="text-center font-bold text-foreground">Observações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(pedidoSelecionado?.produtos) && pedidoSelecionado.produtos.length > 0 ? (
                        pedidoSelecionado.produtos.map((produto, index) => (
                          <TableRow key={index} className="hover:bg-muted/30 transition-colors">
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
                      ) : (<TableRow><TableCell colSpan={11} className="text-center py-8 text-gray-500">Nenhum produto encontrado para este pedido.</TableCell></TableRow>)}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={modalAbertoEdit} onOpenChange={setModalAbertoEdit}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto border-2 border-purple-400 dark:border-purple-600 shadow-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
          <DialogHeader>
            <DialogTitle className="text-2xl text-foreground flex items-center gap-2"><div className="h-10 w-1.5 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500 rounded-full shadow-lg">
              </div>Editar Pedido #{pedidoSelecionado.numeroPedido}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2"><span className="text-sm text-muted-foreground">Status:</span><StatusBadge status={pedidoSelecionado.status} /></div>
              <Button onClick={() => setModalSelecionarProduto(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <Plus className="h-4 w-4" />Adicionar Produto</Button>
            </div>
            <div className="flex justify-end mt-4"><span className="text-xl font-semibold text-foreground">Total do Pedido: R$ {totalPedido.toFixed(2)}</span></div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-purple-300/50 via-pink-300/50 to-purple-300/50 dark:from-purple-700/50 dark:via-pink-700/50 dark:to-purple-700/50 border-b-2 border-purple-400 dark:border-purple-600">
                    <TableHead className="text-center font-bold text-foreground">SKU</TableHead>
                    <TableHead className="text-center font-bold text-foreground">Produto</TableHead>
                    <TableHead className="text-center font-bold text-foreground">Marca</TableHead>
                    <TableHead className="text-center font-bold text-foreground">Tipo</TableHead>
                    <TableHead className="text-center font-bold text-foreground">Grupo</TableHead>
                    <TableHead className="text-center font-bold text-foreground">Peso Unit.</TableHead>
                    <TableHead className="text-center font-bold text-foreground">Unidade</TableHead>
                    <TableHead className="text-center font-bold text-foreground">Qtd</TableHead>
                    <TableHead className="text-center font-bold text-foreground">Valor Unit.</TableHead>
                    <TableHead className="text-center font-bold text-foreground">Total</TableHead>
                    <TableHead className="text-center font-bold text-foreground">Obs.</TableHead>
                    <TableHead className="text-center font-bold text-foreground">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedidoSelecionado?.produtos?.map((produto, index) => (
                    <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                      <TableCell><Input type="text" value={produto.sku} onChange={(e) => handleEditar(index, "sku", e.target.value)} className="w-20" /></TableCell>
                      <TableCell><Input value={produto.name} onChange={(e) => handleEditar(index, "name", e.target.value)} className="min-w-32" /></TableCell>
                      <TableCell><Input value={produto.marca} onChange={(e) => handleEditar(index, "marca", e.target.value)} className="w-24" /> </TableCell>
                      <TableCell><Input value={produto.tipo} onChange={(e) => handleEditar(index, "tipo", e.target.value)} className="w-24" /></TableCell>
                      <TableCell><Input value={produto.category} onChange={(e) => handleEditar(index, "category", e.target.value)} className="w-24" /></TableCell>
                      <TableCell><Input type="number" value={produto.peso} onChange={(e) => handleEditar(index, "peso", e.target.value)} className="w-20" /></TableCell>
                      <TableCell><Input value={produto.unitMeasure} onChange={(e) => handleEditar(index, "unitMeasure", e.target.value)} className="w-20" /></TableCell>
                      <TableCell><Input type="number" value={produto.quantidade} onChange={(e) => handleEditar(index, "quantidade", e.target.value)} className="w-20" /></TableCell>
                      <TableCell><Input type="number" value={produto.unitPrice} onChange={(e) => handleEditar(index, "unitPrice", e.target.value)} className="w-24" /></TableCell>
                      <TableCell className="font-medium">R$ {(produto.quantidade * produto.unitPrice).toFixed(2)}</TableCell>
                      <TableCell><Input value={produto.observacao} onChange={(e) => handleEditar(index, "observacao", e.target.value)} className="min-w-32" /></TableCell>
                      <TableCell><Button variant="destructive" size="sm" onClick={() => handleDelete(index)}><X className="h-3 w-3" /> </Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSalvarEdicao}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <Check className="h-4 w-4" />Salvar Edição</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Seleção de Produto */}
      <Dialog open={modalSelecionarProduto} onOpenChange={setModalSelecionarProduto}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-green-400 dark:border-green-600 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><div className="h-8 w-1 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full shadow-lg"></div> Selecionar Produto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input placeholder="Buscar por nome ou SKU" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1" />
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-green-300/50 to-emerald-300/50 dark:from-green-700/50 dark:to-emerald-700/50 border-b-2 border-green-400 dark:border-green-600">
                    <TableHead className="text-center font-bold text-foreground">SKU</TableHead>
                    <TableHead className="text-center font-bold text-foreground">Nome</TableHead>
                    <TableHead className="text-center font-bold text-foreground">Marca</TableHead>
                    <TableHead className="text-center font-bold text-foreground">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtosFiltrados.map((produto) => (
                    <TableRow key={produto.sku} className="hover:bg-muted/30 transition-colors">
                      <TableCell>{produto.sku}</TableCell>
                      <TableCell>{produto.name}</TableCell>
                      <TableCell>{produto.marca}</TableCell>
                      <TableCell><Button size="sm" onClick={() => { handleSelecionarProduto(produto); setModalSelecionarProduto(false) }}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-green-950 shadow-lg shadow-green-300/50">Selecionar</Button>
                      </TableCell>
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