import React,  { useState, useEffect, useMemo  } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ref, get, update, push, set } from "firebase/database";
import * as XLSX from "xlsx";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button/button";
import { Table } from "@/components/ui/table/table";
import { db, dbRealtime, onValue, auth } from "../../../../firebase"; 
import jsPDF from "jspdf";
import InputValorCaixa from "../../../components/valorCaixa/index";


export default function StatusPedidos() {
  const [pedidos, setPedidos] = useState([]);
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
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [modalAbertoCancelamento, setModalAbertoCancelamento] = useState(false);
  const [motivoCancelamento, setMotivoCancelamento] = useState("");
  const [modalAbertoEdit, setModalAbertoEdit] = useState(false);
  const [numeroPedidoFornecedor, setNumeroPedidoFornecedor] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [projeto, setProjeto] = useState("");
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
  const [modalSelecionarProduto, setModalSelecionarProduto] = useState(false);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [modalAbertoAprovacao, setModalAbertoAprovacao] = useState(false);
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState("");
  const [chaveAcesso, setChaveAcesso] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [desconto, setDesconto] = useState(0);
  const [editandoDesconto, setEditandoDesconto] = useState(false);
  const [salvandoDesconto, setSalvandoDesconto] = useState(false);
  const [recebido, setRecebido] = useState("");
  const [valorCaixaDigitado, setValorCaixaDigitado] = useState("");
  const [sobras, setSobras] = useState(0);

  const navigate = useNavigate();

  // Atualiza desconto quando pedidoSelecionado mudar
  useEffect(() => {
    if (pedidoSelecionado) {
      setDesconto(pedidoSelecionado.desconto || 0);
    }
  }, [pedidoSelecionado]);

  // Carrega pedidos do Firebase
  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        const pedidosRef = ref(dbRealtime, "novosPedidos");
        const pedidosSnapshot = await get(pedidosRef);
        if (pedidosSnapshot.exists()) {
          const pedidosDados = Object.entries(pedidosSnapshot.val()).map(
            ([id, pedido]) => ({ id, ...pedido })
          );
          setPedidos(pedidosDados);
          setPedidosFiltrados(pedidosDados);
        } else {
          toast.error("Nenhum pedido encontrado!");
        }
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        toast.error("Erro ao carregar pedidos");
      }
    };
    carregarPedidos();
  }, []);

  // Carrega produtos disponíveis quando modal de seleção é aberto
  useEffect(() => {
    if (!modalSelecionarProduto) {
      setProdutosDisponiveis([]);
      return;
    }

    const carregarProdutos = () => {
      try {
        const produtosRef = ref(dbRealtime, "EntradaProdutos");
        onValue(produtosRef, (snapshot) => {
          const produtos = snapshot.val();
          const produtosList = produtos
            ? Object.keys(produtos).map((key) => ({ id: key, ...produtos[key] }))
            : [];
          setProdutosDisponiveis(produtosList);
        });
      } catch (error) {
        toast.error("Erro ao carregar produtos");
      }
    };

    carregarProdutos();
  }, [modalSelecionarProduto]);

  // Calcula total do pedido somando totalPrice de todos os produtos
  const totalPedido = useMemo(() => {
    return pedidoSelecionado?.produtos?.reduce(
      (acc, item) => acc + parseFloat(item.totalPrice || 0),
      0
    ) || 0;
  }, [pedidoSelecionado]);

  // Total com desconto aplicado
  const totalComDesconto = useMemo(() => {
    const valor = totalPedido - parseFloat(desconto || 0);
    return valor > 0 ? valor.toFixed(2) : "0.00";
  }, [totalPedido, desconto]);

  // Atualiza sobras sempre que valorCaixaDigitado ou totalPedido mudam
  useEffect(() => {
    const caixa = parseFloat(valorCaixaDigitado) || 0;
    const total = parseFloat(totalPedido) || 0;
    setSobras(caixa - total);
  }, [valorCaixaDigitado, totalPedido]);

  // Salva valor do caixa no banco
  const salvarValorCaixaNoBanco = async (valor) => {
    if (!pedidoSelecionado?.id) return;
    try {
      const pedidoRef = ref(dbRealtime, `novosPedidos/${pedidoSelecionado.id}`);
      await update(pedidoRef, { valorCaixa: parseFloat(valor) || 0 });
      toast.success("Valor do caixa salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar valor do caixa:", error);
      toast.error("Erro ao salvar valor do caixa");
    }
  };

  // Atualiza status do pedido no banco e localmente
  const handleAtualizarStatus = (
    pedidoId,
    novoStatus,
    motivo,
    numeroNotaFiscalParam,
    chaveAcessoParam
  ) => {
    const pedidoRef = ref(dbRealtime, `novosPedidos/${pedidoId}`);
    const dataCadastro = new Date().toISOString();
    const updates = {
      status: novoStatus,
      ...(motivo && { motivoCancelamento: motivo }),
      ...(numeroNotaFiscalParam && { numeroNotaFiscal: numeroNotaFiscalParam }),
      ...(recebido && { recebido }),
      ...(chaveAcessoParam && { chaveAcesso: chaveAcessoParam }),
      dataCadastro,
    };
    update(pedidoRef, updates)
      .then(() => {
        toast.success(`Status atualizado para ${novoStatus}`);
        setPedidos((prev) =>
          prev.map((p) => (p.id === pedidoId ? { ...p, ...updates } : p))
        );
        if (novoStatus === "Aprovado") {
          enviarParaEstoque(pedidoId);
        }
      })
      .catch(() => {
        toast.error("Erro ao atualizar status");
      });
  };

  // Envia produtos do pedido para estoque
  const enviarParaEstoque = async (pedidoId) => {
    try {
      const pedidoRef = ref(dbRealtime, `novosPedidos/${pedidoId}`);
      const pedidoSnapshot = await get(pedidoRef);

      if (!pedidoSnapshot.exists()) {
        console.warn("Pedido não encontrado!");
        return;
      }

      const pedido = pedidoSnapshot.val();
      const estoqueRef = ref(dbRealtime, "Estoque");
      const dataCadastro = new Date().toISOString().split("T")[0];
      const fornecedor = pedido.fornecedor;

      const produtoPromises = pedido.produtos.map(async (produto) => {
        const dataProduto = {
          sku: produto.sku || "Indefinido",
          name: produto.name || "Indefinido",
          quantity: produto.quantidade || 0,
          projeto: produto.projeto || "Indefinido",
          category: produto.category || "Indefinido",
          tipo: produto.tipo || "Indefinido",
          marca: produto.marca || "Indefinido",
          peso: produto.peso || "Indefinido",
          unitmeasure: produto.unit || "Indefinido",
          supplier: fornecedor?.razaoSocial || "Indefinido",
          dateAdded: dataCadastro,
          unitPrice: produto.unitPrice || 0,
          totalPrice: produto.totalPrice || 0,
          expiryDate: produto.expiryDate || "",
        };
        const result = await push(estoqueRef, dataProduto);
        console.log("Produto salvo com ID:", result.key);
      });

      await Promise.all(produtoPromises);
      console.log("Todos os produtos foram enviados para o estoque.");
    } catch (error) {
      console.error("Erro ao enviar produtos para o estoque:", error);
      toast.error("Erro ao enviar produtos para o estoque");
    }
  };

  // Formata data para dd/mm/yyyy
  const formatDate = (timestamp) => {
    if (!timestamp) return "Data inválida";
    let date =
      typeof timestamp === "string" ? new Date(Date.parse(timestamp)) : new Date(timestamp);
    if (isNaN(date.getTime())) return "Data inválida";
    // Ajusta fuso horário local
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const day = String(localDate.getDate()).padStart(2, "0");
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const year = localDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Exporta pedido selecionado para Excel
  const exportToExcel = () => {
    if (!pedidoSelecionado || !pedidoSelecionado.produtos || pedidoSelecionado.produtos.length === 0) {
      toast.error("Nenhum produto para exportar!");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(
      pedidoSelecionado.produtos.map((produto) => ({
        Projeto: produto.projeto,
        SKU: produto.sku,
        Produto: produto.name,
        Marca: produto.marca,
        Peso: produto.peso,
        UnidadeMedida: produto.unit,
        Quantidade: `${produto.quantidade} unidades`,
        Tipo: produto.tipo,
        ValorUnitario: produto.unitPrice,
        ValorTotal: produto.totalPrice,
        Observação: produto.observacao || "", // corrigido typo observacao
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Produtos");
    XLSX.writeFile(wb, `Pedido_${pedidoSelecionado.numeroPedido}.xlsx`);
  };

  // Edita um campo do produto na lista do pedido selecionado
  const handleEditar = (index, campo, valor) => {
    const novosProdutos = [...(pedidoSelecionado.produtos || [])];
    novosProdutos[index][campo] = valor;
    const quantidade = parseFloat(novosProdutos[index].quantidade) || 0;
    const unitPrice = parseFloat(novosProdutos[index].unitPrice) || 0;
    novosProdutos[index].totalPrice = (quantidade * unitPrice).toFixed(2);
    setPedidoSelecionado((prev) => ({ ...prev, produtos: novosProdutos }));
  };

  // Salva edição dos produtos no Firebase
  const handleSalvarEdicao = () => {
    if (!pedidoSelecionado) {
      toast.error("Nenhum pedido selecionado para salvar!");
      return;
    }
    const pedidoRef = ref(dbRealtime, `novosPedidos/${pedidoSelecionado.id}`);
    update(pedidoRef, { produtos: pedidoSelecionado.produtos })
      .then(() => {
        toast.success("Pedido atualizado com sucesso!");
        setModalAbertoEdit(false);
        setPedidos((prev) =>
          prev.map((pedido) =>
            pedido.id === pedidoSelecionado.id
              ? { ...pedido, produtos: pedidoSelecionado.produtos }
              : pedido
          )
        );
        setPedidoSelecionado((prev) => ({ ...prev, produtos: pedidoSelecionado.produtos }));
      })
      .catch(() => {
        toast.error("Erro ao salvar edição!");
      });
  };

  // Remove produto do pedido e atualiza Firebase
  const handleDelete = async (index) => {
    if (!pedidoSelecionado || !pedidoSelecionado.produtos) return;
    const produtosAtualizados = pedidoSelecionado.produtos.filter((_, i) => i !== index);
    setPedidoSelecionado((prev) => ({ ...prev, produtos: produtosAtualizados }));
    try {
      const pedidoRef = ref(dbRealtime, `novosPedidos/${pedidoSelecionado.id}/produtos`);
      await set(pedidoRef, produtosAtualizados);
      toast.success("Produto removido com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover produto.");
      console.error("Erro ao deletar produto do Firebase:", error);
    }
  };

  // Adiciona produto selecionado ao pedido
  const handleSelecionarProduto = (produtoSelecionado) => {
    const novoProduto = {
      ...produtoSelecionado,
      quantidade: 1,
      unitPrice: parseFloat(produtoSelecionado.unitPrice || 0),
      totalPrice: parseFloat(produtoSelecionado.unitPrice || 0).toFixed(2),
      observacao: "",
    };
    setPedidoSelecionado((prev) => ({
      ...prev,
      produtos: [...(prev.produtos || []), novoProduto],
    }));
  };

  // Filtra produtos disponíveis conforme termo de busca
  const produtosFiltrados = produtosDisponiveis.filter(
    (produto) =>
      produto.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Limpa filtros e reseta pedidos filtrados
  const handleLimparFiltros = () => {
    setProjeto("");
    setNumeroPedidoFornecedor("");
    setDataInicio("");
    setDataFim("");
    setStatusFiltro("");
    setPedidosFiltrados(pedidos);
    setNumeroNotaFiscal("");
  };

  // Aplica filtros aos pedidos
  const handleFiltro = () => {
    let filteredPedidos = pedidos;
    if (numeroPedidoFornecedor) {
      const termo = numeroPedidoFornecedor.toLowerCase();
      filteredPedidos = filteredPedidos.filter(
        (pedido) =>
          pedido.numeroPedido?.toLowerCase().includes(termo) ||
          pedido.fornecedor?.razaoSocial?.toLowerCase().includes(termo)
      );
    }
    if (dataInicio) {
      filteredPedidos = filteredPedidos.filter(
        (pedido) => new Date(pedido.dataPedido) >= new Date(dataInicio)
      );
    }
    if (dataFim) {
      filteredPedidos = filteredPedidos.filter(
        (pedido) => new Date(pedido.dataPedido) <= new Date(dataFim)
      );
    }
    if (statusFiltro) {
      filteredPedidos = filteredPedidos.filter((pedido) => pedido.status === statusFiltro);
    }
    if (projeto) {
      filteredPedidos = filteredPedidos.filter((pedido) => pedido.status === projeto);
    }
    if (numeroNotaFiscal) {
      filteredPedidos = filteredPedidos.filter(
        (pedido) =>
          pedido.numeroNotaFiscal &&
          pedido.numeroNotaFiscal.toString().includes(numeroNotaFiscal.toString())
      );
    }
    setPedidosFiltrados(filteredPedidos);
  };

  // Navega para página anterior
  const handleVoltar = () => navigate(-1);

  // Exporta pedidos filtrados para Excel
  const exportarConsultaParaExcel = () => {
    if (pedidosFiltrados.length === 0) {
      toast.error("Nenhum pedido filtrado para exportar!");
      return;
    }
    const dataParaExportar = pedidosFiltrados.map((pedido) => ({
      Número: pedido.numeroPedido,
      Data: formatDate(pedido.dataPedido),
      Fornecedor: pedido?.fornecedor?.razaoSocial || "Não informado",
      Categoria: pedido.category || "Não informado",
      Status: pedido.status,
      MotivoCancelamento: pedido.motivoCancelamento || "",
    }));
    const ws = XLSX.utils.json_to_sheet(dataParaExportar);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Status dos Pedidos");
    XLSX.writeFile(wb, "Pedidos_Filtrados.xlsx");
  };

  // Exporta pedido selecionado para PDF
  const exportToPDF = () => {
    if (!pedidoSelecionado) {
      console.error("Pedido não selecionado.");
      return;
    }

    const doc = new jsPDF();
    doc.setFont("Helvetica");
    doc.setFontSize(10);
    doc.text("Projeto Custeador: " + (pedidoSelecionado.projeto || ""), 20, 10);
    doc.text("Fornecedor: " + (pedidoSelecionado.fornecedor?.razaoSocial || ""), 20, 20);
    doc.text("Data do Pedido: " + (pedidoSelecionado.dataPedido || ""), 20, 30);

    const periodo = `Período que irá suprir: ${formatDate(
      pedidoSelecionado.periodoInicio
    )} até: ${formatDate(pedidoSelecionado.periodoFim)}`;
    doc.text(periodo, 20, 40);

    let y = 50;
    const col1X = 20;
    const col2X = 60;
    const col3X = 80;
    const col4X = 110;
    const col5X = 140;

    doc.text("Produto", col1X, y);
    doc.text("Marca", col2X, y);
    doc.text("Unidade", col3X, y);
    doc.text("Quantidade", col4X, y);
    doc.text("Observação", col5X, y);

    y += 5;
    doc.line(col1X, y, col5X + 40, y);

    (pedidoSelecionado.produtos || []).forEach((produto) => {
      y += 10;
      doc.text(String(produto.name || ""), col1X, y);
      doc.text(String(produto.marca || ""), col2X, y);
      doc.text(String(produto.unit || ""), col3X, y);
      doc.text(String(produto.quantidade || "0"), col4X, y);
      doc.text(String(produto.observacao || "Nenhuma observação"), col5X, y);
      y += 5;
      doc.line(col1X, y, col5X + 40, y);
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("pedido.pdf");
  };

  // Salva desconto no pedido no Firebase
  const salvarDescontoNoPedido = async () => {
    if (!pedidoSelecionado?.id) return;
    setSalvandoDesconto(true);
    try {
      await update(ref(dbRealtime, `novosPedidos/${pedidoSelecionado.id}`), { desconto });
      setEditandoDesconto(false);
      toast.success("Desconto salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar desconto:", error);
      toast.error("Erro ao salvar desconto");
    } finally {
      setSalvandoDesconto(false);
    }
  };
    
return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Status dos Pedidos</h2>
      <Button onClick={handleVoltar} className="mb-4 w-full sm:w-auto sm:px-6 sm:py-2 sm:text-lg bg-gray-300 rounded">Voltar</Button>
      {/*Bloco de Consulta de Pedidos */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-4"> 
          <Input type="text" placeholder="Número do Pedido ou Fornecedor" value={numeroPedidoFornecedor} onChange={(e) => setNumeroPedidoFornecedor(e.target.value)} className="p-2 border border-gray-300 rounded w-full sm:w-auto"/>
          <Input type="text" placeholder="Nota Fiscal" value={numeroNotaFiscal} onChange={(e) => setNumeroNotaFiscal(e.target.value)} className="p-2 border border-gray-300 rounded w-full sm:w-auto"/>
          <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="p-2 border border-gray-300 rounded w-full sm:w-auto"/>
          <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="p-2 border border-gray-300 rounded w-full sm:w-auto"/>
          <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}className="p-2 border border-gray-300 rounded w-full sm:w-auto">
              <option value="">Selecione o Status</option>
              <option value="Pendente">Pendente</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Cancelado">Cancelado</option>
          </select>
            <select value={projeto} onChange={(e) => setProjeto(e.target.value)}className="p-2 border border-gray-300 rounded w-full sm:w-auto">
              <option value="">Selecione o Projeto</option>
              <option value="CONDECA">CONDECA</option>
              <option value="FUMCAD">FUMCAD</option>
              <option value="INSTITUTO RECICLAR">Instituto Reciclar</option>
          </select>
          <Button onClick={handleFiltro} className="bg-blue-500 text-white p-2 rounded w-full sm:w-auto">Consultar</Button>
          <Button onClick={handleLimparFiltros} className="bg-blue-500 text-white p-2 rounded w-full sm:w-auto">Limpar Filtro</Button>
          <Button onClick={exportarConsultaParaExcel} className="bg-green-600 text-white p-2 rounded w-full sm:w-auto">Exportar Consulta</Button>
        </div>
      </div>
      {/* Tabela de consulta */}
      <div className="overflow-x-auto">
        <Table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Número</th>
              <th className="p-2">Projeto Custeador</th>
              <th className="p-2">Nota Fiscal</th>
              <th className="p-2">Data</th>
              <th className="p-2">Fornecedor</th>
              <th className="p-2">Categoria</th>
              <th className="p-2">Status</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
          {pedidosFiltrados.length > 0 ? ( pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id} className="border-b hover:bg-gray-100 text-center">
                  <td className="p-2">{pedido.numeroPedido}</td>
                  <td className="p-2">{pedido.projeto}</td>
                  <td className="p-2">Nº: {pedido.numeroNotaFiscal}</td>
                  <td className="p-2">{formatDate(pedido.dataPedido)}</td>
                  <td className="p-2">{pedido?.fornecedor?.razaoSocial || "Não informado"}</td>
                  <td className="p-2">{pedido.category || "Não informado"}</td>
                  <td className="p-2">{pedido.status}</td>
                  <td className="p-2"><Button onClick={() => {setPedidoSelecionado(pedido); setModalAberto(true);}}
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">Visualizar</Button>
                    {pedido.status === "Pendente" && (
                      <>
                        <Button className="bg-[#F20DE7] text-white px-4 py-1 mr-2 rounded" onClick={() => {setPedidoSelecionado(pedido); setModalAbertoEdit(true);}}>Editar</Button>
                        <Button className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"onClick={() => { setPedidoSelecionado(pedido); setModalAbertoAprovacao(true); }}>Aprovar</Button>  
                        <Button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => {setPedidoSelecionado(pedido); setModalAbertoCancelamento(true);}}>Cancelar</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))) : (<tr><td colSpan="6" className="p-4 text-center">Nenhum pedido encontrado.</td></tr> )}
          </tbody>
        </Table>
      </div>
      {/* Bloco de Aprovação de pedido */}
      {modalAbertoAprovacao && pedidoSelecionado && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center animate-fade-in">
          <div className="bg-white p-6 rounded-lg shadow-lg relative animate-slide-up overflow-hidden max-w-3xl w-full">
            <Button className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600" onClick={() => setModalAbertoAprovacao(false)}>X</Button>
            <h3 className="text-2xl font-bold mb-4 text-center">Pedido #{pedidoSelecionado.numeroPedido}</h3>
            <h3 className="mb-4 font-semibold">Status:{" "}<span className="font-normal">{pedidoSelecionado.status}</span></h3>
              <div className="mb-4">{/* Campo para numero de acesso e nf */}
              <Input type="text" placeholder="Número da Nota Fiscal" value={numeroNotaFiscal} className="mb-4" onChange={(e) => setNumeroNotaFiscal(e.target.value)} /> 
              <Input type="text" placeholder="Digite a Chave de Acesso" value={chaveAcesso} className="mb-4" onChange={(e) => setChaveAcesso(e.target.value)} /> 
              <Input type="text" placeholder="Digite o Nome de quem recebeu" value={recebido} onChange={(e) => setRecebido(e.target.value)} />

              </div>
            <div className="flex justify-end">{/*Limpar o motivo após o cancelamento*/}
              <Button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={() => {if (!numeroNotaFiscal || !chaveAcesso) {toast.error("Preencha a Nota Fiscal e a Chave de Acesso antes de aprovar.");return;} 
                handleAtualizarStatus(pedidoSelecionado.id, "Aprovado", "", numeroNotaFiscal, chaveAcesso, recebido); setModalAbertoAprovacao(false); setNumeroNotaFiscal(""); setChaveAcesso(""); setRecebido(""); }}> Confirmar Aprovação</Button>
            </div>
          </div>
        </div>
      )}
      {/* Bloco de Cancelamento de pedido */}
      {modalAbertoCancelamento && pedidoSelecionado && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center animate-fade-in">
          <div className="bg-white p-6 rounded-lg shadow-lg relative animate-slide-up overflow-hidden max-w-3xl w-full">
            <Button className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600" onClick={() => setModalAbertoCancelamento(false)}>X</Button>
            <h3 className="text-2xl font-bold mb-4 text-center">Pedido #{pedidoSelecionado.numeroPedido}</h3>
            <h3 className="mb-4 font-semibold">Status:{" "}<span className="font-normal">{pedidoSelecionado.status}</span></h3>
              <div className="mb-4">{/* Campo para o motivo do cancelamento */}
                <label className="font-semibold" htmlFor="motivoCancelamento">Motivo do Cancelamento:</label>
                <textarea id="motivoCancelamento" value={motivoCancelamento} rows="4" onChange={(e) => setMotivoCancelamento(e.target.value)} className="w-full p-2 border border-gray-300 rounded"></textarea>
              </div>
            <div className="flex justify-end">{/*Limpar o motivo após o cancelamento*/}
              <Button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" onClick={() => {handleAtualizarStatus(pedidoSelecionado.id, "Cancelado", motivoCancelamento); setModalAbertoCancelamento(false); setMotivoCancelamento("");}}> Confirmar Cancelamento</Button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de Visualização */}
      {modalAberto && pedidoSelecionado && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center px-4 z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg relative animate-slide-up w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <Button className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600" onClick={() => setModalAberto(false)}>×</Button>
            <h3 className="text-2xl font-bold mb-4 text-center">Pedido #{pedidoSelecionado.numeroPedido}</h3>
            {/* Informações gerais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {[
                ["Status", pedidoSelecionado.status],
                ["Projeto Custeador", pedidoSelecionado.projeto || "Não informado"],
                ["Fornecedor", pedidoSelecionado.fornecedor?.razaoSocial || "Não informado"],
                ["Contato", pedidoSelecionado.fornecedor?.contato || "Não informado"],
                ["Telefone", pedidoSelecionado.fornecedor?.telefone || "Não informado"],
                ["E-mail", pedidoSelecionado.fornecedor?.email || "Não informado"],
                ["Período que irá suprir", `De: ${formatDate(pedidoSelecionado.periodoInicio)} Até: ${formatDate(pedidoSelecionado.periodoFim)}`],
                ["Motivo de Cancelamento", pedidoSelecionado.motivoCancelamento || "Não informado"],
                ["Nota Fiscal", pedidoSelecionado.numeroNotaFiscal || "Não informado"],
                ["Chave de Acesso", pedidoSelecionado.chaveAcesso || "Não informado"],
                ["Recebido por", pedidoSelecionado.recebido || "Não informado"]
              ].map(([label, value], index) => (
                <div key={index} className="flex flex-col">
                  <span className="font-semibold">{label}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>

            {/* Valores financeiros */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-gray-100 p-4 rounded-lg shadow">
              <div className="text-lg font-semibold">Valor Total do Pedido:
                <span className="text-green-600"> R$ {(Number(totalPedido) || 0).toFixed(2)}</span>
                <span className="text-xs block text-gray-500 text-center">Valor sem desconto</span>
              </div>

              <div className="text-lg font-semibold">
                {editandoDesconto ? (
                  <input type="number" value={desconto} onChange={(e) => setDesconto(Number(e.target.value))} onKeyDown={(e) => e.key === "Enter" && salvarDescontoNoPedido()} onBlur={salvarDescontoNoPedido}
                    className="border border-gray-300 rounded px-2 py-1 w-32 text-right" autoFocus />) : (
                  <span className="cursor-pointer" onDoubleClick={() => setEditandoDesconto(true)}>
                    Desconto: <span className="text-orange-600">R$ {desconto.toFixed(2)}</span>
                    <span className="text-xs block text-gray-500">Clique duas vezes para editar</span>
                  </span> )}
              </div>
              <div className="text-lg font-semibold">Total com Desconto:
                <span className="text-blue-600"> R$ {(totalPedido - desconto).toFixed(2)}</span>
              </div>
            </div>




          <InputValorCaixa
        valorInicial={valorCaixaDigitado}
        onSalvar={(valor) => setValorCaixaDigitado(valor)}
      />

      {/* Campo que mostra a sobra */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Sobra do Caixa:</label>
        <input
          type="number"
          value={sobras.toFixed(2)}
          readOnly
          className="border border-gray-300 rounded px-3 py-1 w-48 bg-gray-100 cursor-not-allowed"
        />
      </div>


            {/* Botões de ação */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button className="bg-green-600 text-white" onClick={exportToExcel}> Exportar Produtos para Excel </Button>
              <Link to="https://www.nfce.fazenda.sp.gov.br/NFCeConsultaPublica/Paginas/ConsultaPublica.aspx"target="_blank" >
                <Button className="bg-blue-600 text-white">Consultar NF</Button>
              </Link>
              <Link to="https://www.nfe.fazenda.gov.br/portal/principal.aspx" target="_blank">
                <Button className="bg-yellow-600 text-white">Consultar Cupom Fiscal</Button>
              </Link>
              <Button className="bg-red-600 text-white" onClick={exportToPDF}> Exportar PDF </Button>
            </div>

            {/* Tabela de produtos */}
            <h4 className="text-xl font-bold mt-6 mb-2">Produtos do Pedido</h4>
            <div className="overflow-x-auto">
              <table className="min-w-[1000px] w-full bg-white border border-gray-300 rounded-lg shadow text-sm text-center">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2">SKU</th>
                    <th className="p-2">Produto</th>
                    <th className="p-2">Marca</th>
                    <th className="p-2">Tipo</th>
                    <th className="p-2">Grupo</th>
                    <th className="p-2">Peso Unitário</th>
                    <th className="p-2">Unidade</th>
                    <th className="p-2">Quantidade</th>
                    <th className="p-2">Valor Unitário</th>
                    <th className="p-2">Valor Total</th>
                    <th className="p-2">Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(pedidoSelecionado?.produtos) && pedidoSelecionado.produtos.length > 0 ? (
                    pedidoSelecionado.produtos.map((produto, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">{produto.sku}</td>
                        <td className="px-4 py-2">{produto.name}</td>
                        <td className="px-4 py-2">{produto.marca}</td>
                        <td className="px-4 py-2">{produto.tipo}</td>
                        <td className="px-4 py-2">{produto.category}</td>
                        <td className="px-4 py-2">{produto.peso}</td>
                        <td className="px-4 py-2">{produto.unit}</td>
                        <td className="px-4 py-2">{produto.quantidade}</td>
                        <td className="px-4 py-2">{produto.unitPrice}</td>
                        <td className="px-4 py-2">{produto.totalPrice}</td>
                        <td className="px-4 py-2">{produto.observacao}</td>
                      </tr>
                    ))
                  ) : (<tr><td colSpan={11} className="text-center p-4 text-gray-500"> 
                  Nenhum produto encontrado para este pedido. </td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {modalAbertoEdit && pedidoSelecionado && (/* MODAL DE EDIÇÃO */
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative">
            <Button className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600" onClick={() => setModalAbertoEdit(false)}>×</Button>
            <h3 className="text-3xl font-bold text-center mb-2">Editar Pedido #{pedidoSelecionado.numeroPedido}</h3>
            <p className="text-center mb-6 text-gray-700 font-medium">Status: <span className="font-normal">{pedidoSelecionado.status}</span></p>
            <div className="overflow-x-auto">
              <Table className="min-w-full text-sm border rounded-xl shadow">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-2">SKU</th>
                    <th className="p-2">Produto</th>
                    <th className="p-2">Marca</th>
                    <th className="p-2">Tipo</th>
                    <th className="p-2">Grupo</th>
                    <th className="p-2">Peso Unit.</th>
                    <th className="p-2">Unidade</th>
                    <th className="p-2">Qtd</th>
                    <th className="p-2">Valor Unit.</th>
                    <th className="p-2">Total</th>
                    <th className="p-2">Obs.</th>
                    <th className="p-2">Ação</th>
                  </tr>
                </thead>
                <tbody>
                {pedidoSelecionado?.produtos?.map((produto, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-1 text-center"><Input type="number" value={produto.sku} onChange={(e) => handleEditar(index, "sku", e.target.value)} /></td>
                      <td className="p-1 text-center"><Input type="text" value={produto.name} onChange={(e) => handleEditar(index, "name", e.target.value)} /></td>
                      <td className="p-1 text-center"><Input type="text" value={produto.marca} onChange={(e) => handleEditar(index, "marca", e.target.value)} /></td>
                      <td className="p-1 text-center"><Input type="text" value={produto.tipo} onChange={(e) => handleEditar(index, "tipo", e.target.value)} /></td>
                      <td className="p-1 text-center"><Input type="text" value={produto.category} onChange={(e) => handleEditar(index, "category", e.target.value)} /></td>
                      <td className="p-1 text-center"><Input type="number" value={produto.peso} onChange={(e) => handleEditar(index, "peso", e.target.value)} /></td>
                      <td className="p-1 text-center"><Input type="text" value={produto.uniteasure} onChange={(e) => handleEditar(index, "unit", e.target.value)} /></td>
                      <td className="p-1 text-center"><Input type="number" value={produto.quantidade} onChange={(e) => handleEditar(index, "quantidade", e.target.value)} /></td>
                      <td className="p-1 text-center"><Input type="number" value={produto.unitPrice} onChange={(e) => handleEditar(index, "unitPrice", e.target.value)} /></td>
                      <td className="p-[1px] text-center">{(produto.quantidade * produto.unitPrice).toFixed(2)}</td>
                      <td className="p-1 text-center"><Input type="text" value={produto.observacao} onChange={(e) => handleEditar(index, "observacao", e.target.value)} /></td>
                      <td className="p-1 text-center"><Button variant="destructive" onClick={() => handleDelete(index)}>Excluir</Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="mt-6 flex justify-between">
              <Button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"  onClick={() => setModalSelecionarProduto(true)}> + Adicionar Produto</Button>
              <Button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" onClick={handleSalvarEdicao}>Salvar Edição</Button>
            </div>
            {modalSelecionarProduto && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
                <Button className="absolute top-4 right-4 bg-red-500 text-white w-10 h-10 rounded-full hover:bg-red-600" onClick={() => setModalSelecionarProduto(false)} aria-label="Fechar modal"> ×</Button>
                <h3 className="text-2xl font-bold text-center mb-4">Selecionar Produto</h3>
                <div className="flex justify-center mb-4">
                  <Input type="text" placeholder="Buscar por nome ou SKU" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="p-2 border border-gray-300 rounded w-full max-w-md" />
                </div>
                <Table className="min-w-full text-sm border rounded-xl shadow">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-2">SKU</th>
                      <th className="p-2">Nome</th>
                      <th className="p-2">Marca</th>
                      <th className="p-2">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtosFiltrados.map((produto) => (
                      <tr key={produto.sku} className="border-t hover:bg-gray-50">
                        <td className="p-2 text-center">{produto.sku}</td>
                        <td className="p-2 text-center">{produto.name}</td>
                        <td className="p-2 text-center">{produto.marca}</td>
                        <td className="p-2 text-center"><Button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" 
                          onClick={() => {handleSelecionarProduto(produto); setModalSelecionarProduto(false); }}> Selecionar </Button></td>
                      </tr>))}
                  </tbody>
                </Table>
              </div>
            </div>)}
        </div>
      </div>)}
    </div>
  );
}