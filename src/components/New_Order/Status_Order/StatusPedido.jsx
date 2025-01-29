
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase, ref, get, update, push } from "firebase/database";
import * as XLSX from "xlsx";

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

  useEffect(() => {
    const fetchPedidos = async () => {
      const pedidosRef = ref(db, "novosPedidos");
      const pedidosSnapshot = await get(pedidosRef);
      if (pedidosSnapshot.exists()) {
        setPedidos(
          Object.entries(pedidosSnapshot.val()).map(([id, pedido]) => ({
            id,
            ...pedido,
          }))
        );
      } else {
        toast.error("Nenhum pedido encontrado!");
      }
    };
    fetchPedidos();
  }, []);

  const handleAtualizarStatus = (pedidoId, novoStatus) => {
    const pedidoRef = ref(db, `novosPedidos/${pedidoId}`);
    update(pedidoRef, { status: novoStatus })
      .then(() => {
        toast.success(`Status atualizado para ${novoStatus}`);
        setPedidos((prev) =>
          prev.map((p) =>
            p.id === pedidoId ? { ...p, status: novoStatus } : p
          )
        );
        if (novoStatus === "Aprovado") {
          enviarParaEstoque(pedidoId);
        }
      })
      .catch(() => toast.error("Erro ao atualizar status"));
  };

  const enviarParaEstoque = async (pedidoId) => {
    const pedidoRef = ref(db, `novosPedidos/${pedidoId}`);
    const pedidoSnapshot = await get(pedidoRef);

    if (pedidoSnapshot.exists()) {
      const pedido = pedidoSnapshot.val();
      const estoqueRef = ref(db, "Estoque");

      const produtoPromises = pedido.produtos.map(async (produto) => {
        await push(estoqueRef, {
          sku: produto.sku || "Indefinido",
          name: produto.name || "Indefinido",
          quantity: produto.quantidade || 0,
          supplier: pedido.fornecedor?.razaoSocial || "Indefinido",
          "Data de Cadastro": new Date().toISOString(),
          "Valor Unitário": produto.unitPrice || 0,
          "Valor Total": produto.totalPrice || 0,
        });
      });

      await Promise.all(produtoPromises); // Aguarda todas as inserções
      toast.success("Produtos adicionados ao estoque!");
    } else {
      toast.error("Erro: Pedido não encontrado.");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Data inválida";
    let date;
    if (typeof timestamp === "number") {
      date = new Date(timestamp);
    } else if (typeof timestamp === "string") {
      date = new Date(Date.parse(timestamp));
    } else {
      return "Data inválida";
    }
    if (isNaN(date.getTime())) return "Data inválida";

    // Ajustando a data para o fuso horário local
    const localDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    );

    const day = String(localDate.getDate()).padStart(2, "0");
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const year = localDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      pedidoSelecionado.produtos.map((produto) => ({
        SKU: produto.sku,
        Produto: produto.name,
        Marca: produto.marca,
        Peso: produto.peso,
        UnidadeMedida: produto.unit,
        Quantidade: `${produto.quantidade} unidades`,
        Tipo: produto.tipo,
        ValorUnitario: produto.unitPrice,
        ValorTotal: produto.totalPrice,
        Observação: produto.obersavacao,

      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Produtos");

    // Gerar e baixar o arquivo Excel
    XLSX.writeFile(wb, `Pedido_${pedidoSelecionado.numeroPedido}.xlsx`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Status dos Pedidos</h2>
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
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
          {pedidos.length > 0 ? (
            pedidos.map((pedido) => (
              <tr
                key={pedido.id}
                className="border-b hover:bg-gray-100 text-center"
              >
                <td className="p-2">{pedido.numeroPedido}</td>
                <td className="p-2">{formatDate(pedido.dataPedido)}</td>
                <td className="p-2">
                  {pedido?.fornecedor?.razaoSocial || "Não informado"}
                </td>
                <td className="p-2">{pedido.category || "Não informado"}</td>
                <td className="p-2">{pedido.status}</td>
                <td className="p-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                    onClick={() => {
                      setPedidoSelecionado(pedido);
                      setModalAberto(true);
                    }}
                  >
                    Visualizar
                  </button>
                  {pedido.status === "Pendente" && (
                    <>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                        onClick={() =>
                          handleAtualizarStatus(pedido.id, "Aprovado")
                        }
                      >
                        Aprovar
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() =>
                          handleAtualizarStatus(pedido.id, "Cancelado")
                        }
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-4 text-center">
                Nenhum pedido encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {modalAberto && pedidoSelecionado && (
        <div className="fixed top-0  left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center animate-fade-in">
          <div className="bg-white p-6 rounded-lg shadow-lg w-100 relative animate-slide-up overflow-hidden">
            <button
              className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600"
              onClick={() => setModalAberto(false)}
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4 text-center">
              Pedido #{pedidoSelecionado.numeroPedido}
            </h3>
            <h3 className="mb-4 font-semibold">
              Status:{" "}
              <span className="font-normal">{pedidoSelecionado.status}</span>
            </h3>
            <p className="mb-2 font-semibold">
              Fornecedor:{" "}
              <span className="font-normal">
                {pedidoSelecionado.fornecedor?.razaoSocial || "Não informado"}
              </span>
            </p>
            <p className="mb-4 font-semibold">
              Contato:{" "}
              <span className="font-normal">{pedidoSelecionado.fornecedor?.contato || "Não informado"}</span>
            </p>
            <p className="mb-4 font-semibold">
              Telefone:{" "}
              <span className="font-normal">{pedidoSelecionado.fornecedor?.telefone || "Não informado"}</span>
            </p>
            <p className="mb-4 font-semibold">
              E-mail:{" "}
              <span className="font-normal">{pedidoSelecionado.fornecedor?.email || "Não informado"}</span>
            </p>
            <p className="mb-4 font-semibold">
              Período que irá suprir:{" "}
            </p>            
            <p className="mb-4 font-semibold">
              De:{" "}
              <span className="font-normal">{formatDate(pedidoSelecionado.periodoInicio || "Não informado")}</span> Até:
               <span className="font-normal"> {formatDate(pedidoSelecionado.periodoFim || "Não informado")}</span>
            </p>
            {/* Tabela dentro do modal */}
            <div className="overflow-x-auto mb-4 text-center">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2">SKU</th>
                    <th className="p-2">Produto</th>
                    <th className="p-2">Marca</th>
                    <th className="p-2">Peso Unitário</th>
                    <th className="p-2">Quantidade</th>
                    <th className="p-2">Unidade de Medida</th>
                    <th className="p-2">Tipo</th>
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
                      <td className="px-4 py-2">{produto.peso}</td>
                      <td className="px-4 py-2">{produto.quantidade}</td>
                      <td className="px-4 py-2">{produto.unit}</td>
                      <td className="px-4 py-2">{produto.tipo}</td>
                      <td className="px-4 py-2">{produto.unitPrice}</td>
                      <td className="px-4 py-2">{produto.totalPrice}</td>
                      <td className="px-4 py-2">{produto.obersavacao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Botão para exportar em Excel */}
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={exportToExcel}
              >
                Exportar para Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
