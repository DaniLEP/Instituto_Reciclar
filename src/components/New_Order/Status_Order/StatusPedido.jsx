import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase, ref, get, update, push } from "firebase/database";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom"; // Importando o hook useNavigate
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";

// Configuração do Firebase
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

export default function StatusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalAbertoCancelamento, setModalAbertoCancelamento] = useState(false);
  const [motivoCancelamento, setMotivoCancelamento] = useState(""); // Novo estado para armazenar o motivo
  const [modalAbertoEdit, setModalAbertoEdit] = useState(false);
  const [numeroPedidoFornecedor, setNumeroPedidoFornecedor] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
  const [itensPedido, setItensPedido] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      const pedidosRef = ref(db, "novosPedidos");
      const pedidosSnapshot = await get(pedidosRef);
      if (pedidosSnapshot.exists()) {
        setPedidos(
          Object.entries(pedidosSnapshot.val()).map(([id, pedido]) => ({
            id, ...pedido,
          }))
        );setPedidosFiltrados(
          Object.entries(pedidosSnapshot.val()).map(([id, pedido]) => ({
            id, ...pedido,
          }))
        );
      } else {toast.error("Nenhum pedido encontrado!");}
    }; fetchPedidos();
  }, []);

  const handleAtualizarStatus = (pedidoId, novoStatus, motivo) => {
    const pedidoRef = ref(db, `novosPedidos/${pedidoId}`);
    const updates = { status: novoStatus };

    if (motivo) {updates.motivoCancelamento = motivo;} // Se houver motivo, adiciona ao pedido
    
    update(pedidoRef, updates)
      .then(() => {
        toast.success(`Status atualizado para ${novoStatus}`);
        setPedidos((prev) =>
          prev.map((p) => p.id === pedidoId ? { ...p, status: novoStatus, motivoCancelamento: motivo }: p));
        if (novoStatus === "Aprovado") {enviarParaEstoque(pedidoId);}
      }).catch(() => toast.error("Erro ao atualizar status"));
  };

  const enviarParaEstoque = async (pedidoId) => {
    const pedidoRef = ref(db, `novosPedidos/${pedidoId}`);
    const pedidoSnapshot = await get(pedidoRef);

    if (pedidoSnapshot.exists()) {
      const pedido = pedidoSnapshot.val();
      const estoqueRef = ref(db, "Estoque");

      const produtoPromises = pedido.produtos.map(async (produto) => {
        await push(estoqueRef, {sku: produto.sku || "Indefinido", name: produto.name || "Indefinido", quantity: produto.quantidade || 0, category: produto.category || "Indefinido", tipo: produto.tipo || "Indefinido", marca: produto.marca || "Indefinido", peso: produto.peso || "Indefinido", unit: produto.unitmeasure || "Indefinido", supplier: pedido.fornecedor?.razaoSocial || "Indefinido", "Data de Cadastro": new Date().toISOString(), "Valor Unitário": produto.unitPrice || 0, "Valor Total": produto.totalPrice || 0});
      });

      await Promise.all(produtoPromises); // Aguarda todas as inserções
      toast.success("Produtos adicionados ao estoque!");}
      else {toast.error("Erro: Pedido não encontrado.");}
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Data inválida";
    let date;
    if (typeof timestamp === "number") {date = new Date(timestamp);}
    else if (typeof timestamp === "string") {date = new Date(Date.parse(timestamp));}
    else {return "Data inválida";}
    if (isNaN(date.getTime())) return "Data inválida";

    // Ajustando a data para o fuso horário local
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const day = String(localDate.getDate()).padStart(2, "0");
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const year = localDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      pedidoSelecionado.produtos.map((produto) => ({SKU: produto.sku, Produto: produto.name, Marca: produto.marca, Peso: produto.peso, UnidadeMedida: produto.unit, Quantidade: `${produto.quantidade} unidades`, Tipo: produto.tipo, ValorUnitario: produto.unitPrice, ValorTotal: produto.totalPrice, Observação: produto.obersavacao,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Produtos");
    XLSX.writeFile(wb, `Pedido_${pedidoSelecionado.numeroPedido}.xlsx`); // Gerar e baixar o arquivo Excel
  };

  const handleEditar = (index, campo, valor) => {
    const novosProdutos = [...pedidoSelecionado.produtos];
    novosProdutos[index] = { ...novosProdutos[index], [campo]: valor };
    setPedidoSelecionado({ ...pedidoSelecionado, produtos: novosProdutos });
  };

  const handleSalvarEdicao = () => {
    // Verificar se existe algum pedido selecionado
    if (!pedidoSelecionado)
      {toast.error("Nenhum pedido selecionado para salvar!"); 
        return;
      }

    // Atualizar o banco de dados com os dados do pedido atualizado
    const pedidoRef = ref(db, `novosPedidos/${pedidoSelecionado.id}`);
    update(pedidoRef, { produtos: pedidoSelecionado.produtos })
      .then(() => {toast.success("Pedido atualizado com sucesso!");
        setModalAbertoEdit(false); // Fechar o modal após salvar a edição
      }).catch(() => {toast.error("Erro ao salvar edição!");});
  };

  const handleLimparFiltros = () => {
    setNumeroPedidoFornecedor("");
    setDataInicio("");
    setDataFim("");
    setStatusFiltro("");
    setPedidosFiltrados(pedidos);
  };

  const handleAdicionarNovoProduto = () => {
    const novoProduto = {sku: "", name: "", marca: "", tipo: "", category: "", peso: 0, unit: "", quantidade: 0, unitPrice: 0, observacoes: "",};
    setPedidoSelecionado((prev) => ({...prev, produtos: [...prev.produtos, novoProduto],}));
  };
  
  const handleDelete = (index) => {
    setPedidoSelecionado((prev) => {
      const novosProdutos = [...prev.produtos]; novosProdutos.splice(index, 1); // remove o item do array
        return {...prev,produtos: novosProdutos,};
    });
  };

  const handleFiltro = () => {
    let filteredPedidos = pedidos;
    if (numeroPedidoFornecedor) {
      const termo = numeroPedidoFornecedor.toLowerCase();
      filteredPedidos = filteredPedidos.filter((pedido) => pedido.numeroPedido?.toLowerCase().includes(termo) ||
        pedido.fornecedor?.razaoSocial?.toLowerCase().includes(termo));
    }
    if (dataInicio) {
      filteredPedidos = filteredPedidos.filter((pedido) => new Date(pedido.dataPedido) >= new Date(dataInicio));
    }
    if (dataFim) {
      filteredPedidos = filteredPedidos.filter((pedido) => new Date(pedido.dataPedido) <= new Date(dataFim));
    }
    if (statusFiltro) {
      filteredPedidos = filteredPedidos.filter((pedido) => pedido.status === statusFiltro);
    }
    setPedidosFiltrados(filteredPedidos);
  };

  const navigate = useNavigate(); // Criando uma função de navegação
  const handleVoltar = () => {navigate(-1);}; // Volta para a página anterior
  const exportarConsultaParaExcel = () => {
    if (pedidosFiltrados.length === 0) {toast.error("Nenhum pedido filtrado para exportar!"); return;}
  const dataParaExportar = pedidosFiltrados.map((pedido) => ({
  Número: pedido.numeroPedido, Data: formatDate(pedido.dataPedido), Fornecedor: pedido?.fornecedor?.razaoSocial || "Não informado",
  Categoria: pedido.category || "Não informado", Status: pedido.status, MotivoCancelamento: pedido.motivoCancelamento || ""}));
    const ws = XLSX.utils.json_to_sheet(dataParaExportar);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Status dos Pedidos");
    XLSX.writeFile(wb, "Pedidos_Filtrados.xlsx");
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
          <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="p-2 border border-gray-300 rounded w-full sm:w-auto"/>
          <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="p-2 border border-gray-300 rounded w-full sm:w-auto"/>
          <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full sm:w-auto">
              <option value="">Selecione o Status</option>
              <option value="Pendente">Pendente</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Cancelado">Cancelado</option>
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
                  <td className="p-2">{formatDate(pedido.dataPedido)}</td>
                  <td className="p-2">{pedido?.fornecedor?.razaoSocial || "Não informado"}</td>
                  <td className="p-2">{pedido.category || "Não informado"}</td>
                  <td className="p-2">{pedido.status}</td>
                  <td className="p-2"><Button onClick={() => {setPedidoSelecionado(pedido); setModalAberto(true);}}
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">Visualizar</Button>
                    {pedido.status === "Pendente" && (
                      <>
                        <Button className="bg-[#F20DE7] text-white px-4 py-1 mr-2 rounded" onClick={() => {setPedidoSelecionado(pedido); setModalAbertoEdit(true);}}>Editar</Button>
                        <Button className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600" onClick={() => handleAtualizarStatus(pedido.id, "Aprovado")}>Aprovar</Button>
                        <Button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => {setPedidoSelecionado(pedido); setModalAbertoCancelamento(true);}}>Cancelar</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))    ) : (<tr><td colSpan="6" className="p-4 text-center">Nenhum pedido encontrado.</td></tr> )}
          </tbody>
        </Table>
      </div>

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
              <Button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={() => {handleAtualizarStatus(pedidoSelecionado.id, "Cancelado", motivoCancelamento); setModalAbertoCancelamento(false); setMotivoCancelamento("");}}> Confirmar Cancelamento</Button>
            </div>
          </div>
        </div>
      )}
     {/* MODAL DE VISUALIZAÇÃO */} {modalAberto && pedidoSelecionado && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center animate-fade-in">
          <div className="bg-white p-6 rounded-lg shadow-lg relative animate-slide-up overflow-hidden max-w-3xl w-full">
            <Button className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600" onClick={() => setModalAberto(false)}>×</Button>
            <h3 className="text-2xl font-bold mb-4 text-center">Pedido #{pedidoSelecionado.numeroPedido}</h3>
            <h3 className="mb-4 font-semibold">Status:{" "}<span className="font-normal">{pedidoSelecionado.status}</span></h3>
            <p className="mb-2 font-semibold">Fornecedor:{" "}<span className="font-normal">{pedidoSelecionado.fornecedor?.razaoSocial || "Não informado"}</span></p>
            <p className="mb-4 font-semibold"> Contato:{" "}<span className="font-normal">{pedidoSelecionado.fornecedor?.contato || "Não informado"}</span></p>
            <p className="mb-4 font-semibold">Telefone:{" "}<span className="font-normal">{pedidoSelecionado.fornecedor?.telefone || "Não informado"}</span></p>
            <p className="mb-4 font-semibold">E-mail:{" "}<span className="font-normal">{pedidoSelecionado.fornecedor?.email || "Não informado"}</span></p>
            <p className="mb-4 font-semibold">Período que irá suprir: </p>
            <p className="mb-4 font-semibold">De:{" "}<span className="font-normal">{formatDate(pedidoSelecionado.periodoInicio || "Não informado")}</span>{" "} Até: <span className="font-normal">{" "}{formatDate(pedidoSelecionado.periodoFim || "Não informado")}</span></p> 
            <p className="mb-4 font-semibold"> Motivo de Cancelamento:{" "}<span className="font-normal">{pedidoSelecionado.motivoCancelamento || "Não informado"}</span></p>
            {/* Tabela dentro do modal */}
            <div className="overflow-x-auto mb-4 text-center">
              <Table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2">SKU</th>
                    <th className="p-2">Produto</th>
                    <th className="p-2">Marca</th>
                    <th className="p-2">Tipo</th>
                    <th className="p-2">Grupo</th>
                    <th className="p-2">Peso Unitário</th>
                    <th className="p-2">Unidade de Medida</th>
                    <th className="p-2">Quantidade</th>
                    <th className="p-2">Valor Unitário</th>
                    <th className="p-2">Valor Total</th>
                    <th className="p-2">Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidoSelecionado.produtos.map((produto, index) => (
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
                      <td className="px-4 py-2">{produto.obersavacao}</td>
                    </tr> ))}
                </tbody>
              </Table>
            </div>
            <div className="flex justify-end">
              <Button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={exportToExcel}> Exportar para    Excel</Button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL DE EDIÇÃO */}
      {modalAbertoEdit && pedidoSelecionado && (
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
                {pedidoSelecionado.produtos.map((produto, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-1"><Input type="number" value={produto.sku} onChange={(e) => handleEditar(index, "sku", e.target.value)} /></td>
                    <td className="p-1"><Input type="text" value={produto.name} onChange={(e) => handleEditar(index, "name", e.target.value)} /></td>
                    <td className="p-1"><Input type="text" value={produto.marca} onChange={(e) => handleEditar(index, "marca", e.target.value)} /></td>
                    <td className="p-1"><Input type="text" value={produto.tipo} onChange={(e) => handleEditar(index, "tipo", e.target.value)} /></td>
                    <td className="p-1"><Input type="text" value={produto.category} onChange={(e) => handleEditar(index, "category", e.target.value)} /></td>
                    <td className="p-1"><Input type="number" value={produto.peso} onChange={(e) => handleEditar(index, "peso", e.target.value)} /></td>
                    <td className="p-1"><Input type="text" value={produto.unit} onChange={(e) => handleEditar(index, "unit", e.target.value)} /></td>
                    <td className="p-1"><Input type="number" value={produto.quantidade} onChange={(e) => handleEditar(index, "quantidade", e.target.value)} /></td>
                    <td className="p-1"><Input type="number" value={produto.unitPrice} onChange={(e) => handleEditar(index, "unitPrice", e.target.value)} /></td>
                    <td className="p-1 text-center">R${(produto.quantidade * produto.unitPrice).toFixed(2)}</td>
                    <td className="p-1"><Input type="text" value={produto.observacoes} onChange={(e) => handleEditar(index, "observacoes", e.target.value)} /></td>
                    <td className="p-1 text-center"><Button variant="destructive" onClick={() => handleDelete(index)}>Excluir</Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="mt-6 flex justify-between">
            <Button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"onClick={handleAdicionarNovoProduto}> + Adicionar Produto</Button>
            <Button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" onClick={handleSalvarEdicao}>Salvar Edição</Button>
          </div>
        </div>
      </div>)}
    </div>
  );
}