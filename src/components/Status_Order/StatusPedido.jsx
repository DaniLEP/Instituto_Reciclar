// import { useState, useEffect } from "react";
// import * as XLSX from "xlsx";
// import { ref, get } from "firebase/database";
// import { initializeApp, getApp, getApps } from 'firebase/app';
// import { getDatabase } from 'firebase/database';

// // Configuração do Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
//   authDomain: "bancoestoquecozinha.firebaseapp.com",
//   databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
//   projectId: "bancoestoquecozinha",
//   storageBucket: "bancoestoquecozinha.appspot.com",
//   messagingSenderId: "71775149511",
//   appId: "1:71775149511:web:bb2ce1a1872c65d1668de2"
// };

// // Inicializando o Firebase (só se não houver app inicializado)
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const db = getDatabase(app);

// export default function TabelaPedidos() {
//   const [pedidos, setPedidos] = useState([]);
//   const [fornecedores, setFornecedores] = useState([]);
//   const [filtros, setFiltros] = useState({
//     dataInicial: "",
//     dataFinal: "",
//     fornecedor: "",
//     status: "",
//     numeroPedido: "",
//   });

//   const [modalPedido, setModalPedido] = useState(null);
//   const [detalhesPedido, setDetalhesPedido] = useState(null);

//   // Função para formatar valores em moeda
//   const formatarMoeda = (valor) => {
//     return new Intl.NumberFormat("pt-BR", {
//       style: "currency",
//       currency: "BRL",
//     }).format(valor);
//   };

//   // Função para buscar os dados das tabelas "Estoque" e "CadastroFornecedor"
//   useEffect(() => {
//     // Buscar dados da tabela "Estoque"
//     const estoqueRef = ref(db, "novosPedidos");
//     get(estoqueRef).then((snapshot) => {
//       if (snapshot.exists()) {
//         const dadosEstoque = snapshot.val();
//         const pedidosArray = Object.keys(dadosEstoque).map((key) => ({
//           ...dadosEstoque[key],
//           id: key,
//         }));
//         setPedidos(pedidosArray);
//       } else {
//         console.log("Nenhum dado encontrado em Pedidos");
//       }
//     });

//     // Buscar dados da tabela "CadastroFornecedor"
//     const fornecedoresRef = ref(db, "Fornecedor");
//     get(fornecedoresRef).then((snapshot) => {
//       if (snapshot.exists()) {
//         const dadosFornecedores = snapshot.val();
//         const fornecedoresArray = Object.keys(dadosFornecedores).map((key) => ({
//           ...dadosFornecedores[key],
//           id: key,
//         }));
//         setFornecedores(fornecedoresArray);
//       } else {
//         console.log("Nenhum dado encontrado em Cadastro Fornecedor");
//       }
//     });
//   }, []);

//   // Função para aplicar os filtros nos pedidos
//   const aplicarFiltros = () => {
//     const pedidosFiltrados = pedidos.filter((pedido) => {
//       const dataInicialValida =
//         !filtros.dataInicial || pedido.dataPedido >= filtros.dataInicial;
//       const dataFinalValida =
//         !filtros.dataFinal || pedido.dataAté <= filtros.dataFinal;
//       const fornecedorValido =
//         !filtros.fornecedor ||
//         pedido.razaoSocial.toLowerCase().includes(filtros.fornecedor.toLowerCase());
//       const statusValido =
//         !filtros.status || pedido.status.toLowerCase() === filtros.status.toLowerCase();
//       const numeroPedidoValido =
//         !filtros.numeroPedido ||
//         pedido.numeroPedido.includes(filtros.numeroPedido);

//       return (
//         dataInicialValida &&
//         dataFinalValida &&
//         fornecedorValido &&
//         statusValido &&
//         numeroPedidoValido
//       );
//     });
//     setPedidos(pedidosFiltrados);
//   };

//   // Função para exportar os pedidos para Excel
//   const exportarParaExcel = () => {
//     if (!modalPedido) return;

//     const dataHoje = modalPedido.dataHoje || "Não informado";
//     const numeroPedido = modalPedido.numeroPedido || "";
//     const dataInicial = modalPedido.dataPedido || "";
//     const dataFinal = modalPedido.dataAté || "";
//     const razaoSocial = modalPedido.razaoSocial || "";
//     const cnpj = "CNPJ não disponível";
//     const contato = "Contato não disponível";
//     const email = "Email não disponível";
//     const telefone = "Telefone não disponível";

//     const produtos = modalPedido.produtos.map((produto) => ({
//       SKU: produto.sku,
//       Descrição: produto.descricao,
//       Quantidade: produto.quantidade,
//       "Valor Unitário": formatarMoeda(produto.valorUnitario),
//       "Valor Total": formatarMoeda(produto.valorTotal),
//       Tipo: produto.tipo,
//       Unidade: produto.unidade,
//       Observação: produto.observacao,
//     }));

//     const wsData = [
//       ["Data do Pedido", dataHoje],
//       ["Número do Pedido", numeroPedido],
//       ["Data Inicial", dataInicial],
//       ["Data Final", dataFinal],
//       ["Razão Social", razaoSocial],
//       ["CNPJ", cnpj],
//       ["Contato", contato],
//       ["Email", email],
//       ["Telefone", telefone],
//       [],
//       ["SKU", "Descrição", "Quantidade", "Valor Unitário", "Valor Total", "Tipo", "Unidade", "Observação"],
//     ];

//     produtos.forEach((produto) => {
//       wsData.push(Object.values(produto));
//     });

//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.aoa_to_sheet(wsData);
//     XLSX.utils.book_append_sheet(wb, ws, "Pedido");
//     XLSX.writeFile(wb, `Pedido_${numeroPedido}.xlsx`);
//   };

//   // Função para ver os detalhes do pedido
//   const verDetalhesPedido = (pedido) => {
//     setDetalhesPedido({ ...pedido });
//   };

//   // Função para fechar a visualização de detalhes do pedido
//   const fecharDetalhesPedido = () => {
//     setDetalhesPedido(null);
//   };

//   // Função para atualizar os itens do pedido
//   const atualizarPedido = () => {
//     // Aqui você pode atualizar os dados do pedido no Firebase ou no estado
//     console.log(detalhesPedido);
//     // Fechar o modal após salvar
//     fecharDetalhesPedido();
//   };

//   // Função para atualizar a quantidade de um item no pedido
//   const atualizarItem = (index, novaQuantidade) => {
//     const novosItens = [...detalhesPedido.produtos];
//     novosItens[index].quantidade = novaQuantidade;
//     setDetalhesPedido({
//       ...detalhesPedido,
//       produtos: novosItens,
//     });
//   };

//   const abrirModalExportar = (pedido) => {
//     setModalPedido(pedido);
//   };

//   const fecharModalExportar = () => {
//     setModalPedido(null);
//   };

//   return (
//     <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f4", padding: "0 20px" }}>
//       {/* Cabeçalho */}
//       <div
//         style={{
//           padding: "20px",
//           backgroundColor: "#00009C",
//           color: "white",
//           textAlign: "center",
//           borderRadius: "8px",
//           marginTop: "20px",
//         }}
//       >
//         <h1>Gestão de Pedidos</h1>
//       </div>

//       {/* Filtros */}
//       <div
//         style={{
//           padding: "20px",
//           backgroundColor: "#fff",
//           borderRadius: "8px",
//           marginTop: "20px",
//           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <h2>Filtros</h2>
//         <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
//           <div>
//             <label htmlFor="dataInicial">Data Inicial:</label>
//             <input
//               type="date"
//               id="dataInicial"
//               style={{
//                 marginRight: "10px",
//                 padding: "8px",
//                 borderRadius: "5px",
//                 border: "1px solid #ddd",
//               }}
//               onChange={(e) => setFiltros({ ...filtros, dataInicial: e.target.value })}
//             />
//           </div>
//           <div>
//             <label htmlFor="dataFinal">Data Final:</label>
//             <input
//               type="date"
//               id="dataFinal"
//               style={{
//                 marginRight: "10px",
//                 padding: "8px",
//                 borderRadius: "5px",
//                 border: "1px solid #ddd",
//               }}
//               onChange={(e) => setFiltros({ ...filtros, dataFinal: e.target.value })}
//             />
//           </div>
//           <div>
//             <label htmlFor="filtroFornecedor">Fornecedor:</label>
//             <input
//               type="text"
//               id="filtroFornecedor"
//               style={{
//                 marginRight: "10px",
//                 padding: "8px",
//                 borderRadius: "5px",
//                 border: "1px solid #ddd",
//               }}
//               onChange={(e) => setFiltros({ ...filtros, fornecedor: e.target.value })}
//             />
//           </div>
//           <div>
//             <label htmlFor="filtroStatus">Status:</label>
//             <input
//               type="text"
//               id="filtroStatus"
//               style={{
//                 marginRight: "10px",
//                 padding: "8px",
//                 borderRadius: "5px",
//                 border: "1px solid #ddd",
//               }}
//               onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
//             />
//           </div>
//           <div>
//             <label htmlFor="filtroNumeroPedido">Número do Pedido:</label>
//             <input
//               type="text"
//               id="filtroNumeroPedido"
//               style={{
//                 marginRight: "10px",
//                 padding: "8px",
//                 borderRadius: "5px",
//                 border: "1px solid #ddd",
//               }}
//               onChange={(e) => setFiltros({ ...filtros, numeroPedido: e.target.value })}
//             />
//           </div>
//           <button
//             onClick={aplicarFiltros}
//             style={{
//               backgroundColor: "#00009C",
//               color: "white",
//               padding: "10px 20px",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//             }}
//           >
//             Aplicar Filtros
//           </button>
//         </div>
//       </div>

//       {/* Tabela de Pedidos */}
//       <div
//         style={{
//           marginTop: "20px",
//           backgroundColor: "#fff",
//           borderRadius: "8px",
//           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//           padding: "20px",
//         }}
//       >
//         <h2>Pedidos</h2>
//         <table
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//             marginTop: "10px",
//             boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//           }}
//         >
//           <thead>
//             <tr>
//               <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>
//                 Número do Pedido
//               </th>
//               <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>
//                 Fornecedor
//               </th>
//               <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>
//                 Data do Pedido
//               </th>
//               <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>
//                 Status
//               </th>
//               <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>
//                 Ações
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {pedidos.map((pedido) => (
//               <tr key={pedido.id}>
//                 <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
//                   {pedido.numeroPedido}
//                 </td>
//                 <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
//                   {pedido.razaoSocial}
//                 </td>
//                 <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
//                   {pedido.dataPedido}
//                 </td>
//                 <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
//                   {pedido.status}
//                 </td>
//                 <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
//                   <button
//                     onClick={() => verDetalhesPedido(pedido)}
//                     style={{
//                       backgroundColor: "#4CAF50",
//                       color: "white",
//                       padding: "5px 10px",
//                       border: "none",
//                       borderRadius: "5px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Ver Detalhes
//                   </button>
//                   <button
//                     onClick={() => abrirModalExportar(pedido)}
//                     style={{
//                       backgroundColor: "#1E88E5",
//                       color: "white",
//                       padding: "5px 10px",
//                       border: "none",
//                       borderRadius: "5px",
//                       cursor: "pointer",
//                       marginLeft: "10px",
//                     }}
//                   >
//                     Exportar
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal de Detalhes do Pedido */}
//       {detalhesPedido && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "#fff",
//               padding: "20px",
//               borderRadius: "8px",
//               width: "80%",
//               maxHeight: "80vh",
//               overflowY: "auto",
//             }}
//           >
//             <h2>Detalhes do Pedido</h2>
//             <p><strong>Número do Pedido:</strong> {detalhesPedido.numeroPedido}</p>
//             <p><strong>Fornecedor:</strong> {detalhesPedido.razaoSocial}</p>
//             <p><strong>Data do Pedido:</strong> {detalhesPedido.dataPedido}</p>
//             <p><strong>Data que irá suprir de:</strong> {detalhesPedido.dataInicio}</p>
//             <p><strong>até:</strong> {detalhesPedido.dataFim}</p>
//             <h3>Produtos:</h3>
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr>
//                   <th style={{ padding: "10px", textAlign: "left" }}>SKU</th>
//                   <th style={{ padding: "10px", textAlign: "left" }}>Descrição</th>
//                   <th style={{ padding: "10px", textAlign: "left" }}>Quantidade</th>
//                   <th style={{ padding: "10px", textAlign: "left" }}>Valor Unitário</th>
//                   <th style={{ padding: "10px", textAlign: "left" }}>Valor Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {detalhesPedido.produtos.map((produto, index) => (
//                   <tr key={index}>
//                     <td style={{ padding: "10px" }}>{produto.sku}</td>
//                     <td style={{ padding: "10px" }}>{produto.name}</td>
//                     <td style={{ padding: "10px" }}>
//                       <input
//                         type="number"
//                         value={produto.quantidade}
//                         onChange={(e) => atualizarItem(index, e.target.value)}
//                         style={{
//                           width: "60px",
//                           padding: "5px",
//                           borderRadius: "5px",
//                           border: "1px solid #ddd",
//                         }}
//                       />
//                     </td>
//                     <td style={{ padding: "10px" }}>{formatarMoeda(produto.valorUnitario)}</td>
//                     <td style={{ padding: "10px" }}>{formatarMoeda(produto.valorTotal)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div style={{ marginTop: "20px", textAlign: "center" }}>
//               <button
//                 onClick={atualizarPedido}
//                 style={{
//                   backgroundColor: "#4CAF50",
//                   color: "white",
//                   padding: "10px 20px",
//                   border: "none",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Atualizar Pedido
//               </button>
//               <button
//                 onClick={fecharDetalhesPedido}
//                 style={{
//                   backgroundColor: "#f44336",
//                   color: "white",
//                   padding: "10px 20px",
//                   border: "none",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                   marginLeft: "10px",
//                 }}
//               >
//                 Fechar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { ref, get } from "firebase/database";
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.appspot.com",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2"
};

// Inicializando o Firebase (só se não houver app inicializado)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export default function TabelaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [filtros, setFiltros] = useState({
    dataInicial: "",
    dataFinal: "",
    fornecedor: "",
    status: "",
    numeroPedido: "",
  });

  const [modalPedido, setModalPedido] = useState(null);
  const [detalhesPedido, setDetalhesPedido] = useState(null);

  // Função para formatar valores em moeda
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  // Função para buscar os dados das tabelas "Estoque" e "CadastroFornecedor"
  useEffect(() => {
    const estoqueRef = ref(db, "novosPedidos");
    get(estoqueRef).then((snapshot) => {
      if (snapshot.exists()) {
        const dadosEstoque = snapshot.val();
        const pedidosArray = Object.keys(dadosEstoque).map((key) => ({
          ...dadosEstoque[key],
          id: key,
        }));
        setPedidos(pedidosArray);
      } else {
        console.log("Nenhum dado encontrado em Pedidos");
      }
    });

    // Buscar dados da tabela "CadastroFornecedor"
    const fornecedoresRef = ref(db, "CadastroFornecedor");
    get(fornecedoresRef).then((snapshot) => {
      if (snapshot.exists()) {
        const dadosFornecedores = snapshot.val();
        const fornecedoresArray = Object.keys(dadosFornecedores).map((key) => ({
          ...dadosFornecedores[key],
          id: key,
        }));
        setFornecedores(fornecedoresArray);
      } else {
        console.log("Nenhum dado encontrado em Cadastro Fornecedor");
      }
    });
  }, []);

  // Função para aplicar os filtros nos pedidos
  const aplicarFiltros = () => {
    const pedidosFiltrados = pedidos.filter((pedido) => {
      const dataInicialValida =
        !filtros.dataInicial || new Date(pedido.dataPedido) >= new Date(filtros.dataInicial);
      const dataFinalValida =
        !filtros.dataFinal || new Date(pedido.dataAté) <= new Date(filtros.dataFinal);
      const fornecedorValido =
        !filtros.fornecedor ||
        (pedido.razaoSocial && pedido.razaoSocial.toLowerCase().includes(filtros.fornecedor.toLowerCase()));
      const statusValido =
        !filtros.status || pedido.status.toLowerCase() === filtros.status.toLowerCase();
      const numeroPedidoValido =
        !filtros.numeroPedido ||
        pedido.numeroPedido.includes(filtros.numeroPedido);

      return (
        dataInicialValida &&
        dataFinalValida &&
        fornecedorValido &&
        statusValido &&
        numeroPedidoValido
      );
    });
    setPedidos(pedidosFiltrados);
  };

  // Função para exportar os pedidos para Excel
  const exportarParaExcel = () => {
    if (!modalPedido) return;

    const dataHoje = modalPedido.dataHoje || "Não informado";
    const numeroPedido = modalPedido.numeroPedido || "";
    const dataInicial = modalPedido.dataPedido || "";
    const dataFinal = modalPedido.dataAté || "";
    const razaoSocial = modalPedido.razaoSocial || "";
    const cnpj = "CNPJ não disponível";
    const contato = "Contato não disponível";
    const email = "Email não disponível";
    const telefone = "Telefone não disponível";

    const produtos = modalPedido.produtos.map((produto) => ({
      SKU: produto.sku,
      Descrição: produto.descricao,
      Quantidade: produto.quantidade,
      "Valor Unitário": formatarMoeda(produto.valorUnitario),
      "Valor Total": formatarMoeda(produto.valorTotal),
      Tipo: produto.tipo,
      Unidade: produto.unidade,
      Observação: produto.observacao,
    }));

    const wsData = [
      ["Data do Pedido", dataHoje],
      ["Número do Pedido", numeroPedido],
      ["Data Inicial", dataInicial],
      ["Data Final", dataFinal],
      ["Razão Social", razaoSocial],
      ["CNPJ", cnpj],
      ["Contato", contato],
      ["Email", email],
      ["Telefone", telefone],
      [],
      ["SKU", "Descrição", "Quantidade", "Valor Unitário", "Valor Total", "Tipo", "Unidade", "Observação"],
    ];

    produtos.forEach((produto) => {
      wsData.push(Object.values(produto));
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Pedido");
    XLSX.writeFile(wb, `Pedido_${numeroPedido}.xlsx`);
  };

  // Função para ver os detalhes do pedido
  const verDetalhesPedido = (pedido) => {
    setDetalhesPedido({ ...pedido });
  };

  // Função para fechar a visualização de detalhes do pedido
  const fecharDetalhesPedido = () => {
    setDetalhesPedido(null);
  };

  // Função para atualizar os itens do pedido
  const atualizarPedido = () => {
    // Aqui você pode atualizar os dados do pedido no Firebase ou no estado
    console.log(detalhesPedido);
    // Fechar o modal após salvar
    fecharDetalhesPedido();
  };

  // Função para atualizar a quantidade de um item no pedido
  const atualizarItem = (index, novaQuantidade) => {
    const novosItens = [...detalhesPedido.produtos];
    novosItens[index].quantidade = novaQuantidade;
    setDetalhesPedido({
      ...detalhesPedido,
      produtos: novosItens,
    });
  };

  const abrirModalExportar = (pedido) => {
    setModalPedido(pedido);
  };

  const fecharModalExportar = () => {
    setModalPedido(null);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f4", padding: "0 20px" }}>
      {/* Cabeçalho */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#00009C",
          color: "white",
          textAlign: "center",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <h1>Gestão de Pedidos</h1>
      </div>

      {/* Filtros */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          marginTop: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2>Filtros</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <label htmlFor="dataInicial">Data Inicial:</label>
            <input
              type="date"
              id="dataInicial"
              style={{
                marginRight: "10px",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              onChange={(e) => setFiltros({ ...filtros, dataInicial: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="dataFinal">Data Final:</label>
            <input
              type="date"
              id="dataFinal"
              style={{
                marginRight: "10px",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              onChange={(e) => setFiltros({ ...filtros, dataFinal: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="filtroFornecedor">Fornecedor:</label>
            <input
              type="text"
              id="filtroFornecedor"
              style={{
                marginRight: "10px",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              onChange={(e) => setFiltros({ ...filtros, fornecedor: e.target.value })}
            />
          </div>
         
          <div>
            <label htmlFor="numeroPedido">Número do Pedido:</label>
            <input
              type="text"
              id="numeroPedido"
              style={{
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              onChange={(e) => setFiltros({ ...filtros, numeroPedido: e.target.value })}
            />
          </div>
          <button
            onClick={aplicarFiltros}
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              backgroundColor: "#00009C",
              color: "white",
              cursor: "pointer",
              border: "none",
              marginTop: "10px",
            }}
          >
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* Tabela de Pedidos */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          marginTop: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2>Pedidos</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            borderRadius: "8px",
            overflow: "hidden",
            marginTop: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#00009C", color: "white" }}>
              <th style={{ padding: "10px", textAlign: "center" }}>Número Pedido</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Fornecedor</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Data Pedido</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Status</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td style={{ padding: "10px", textAlign: "center" }}>{pedido.numeroPedido}</td>
                <td style={{ padding: "10px", textAlign: "center" }}>{pedido.razaoSocial}</td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  {new Date(pedido.dataPedido).toLocaleDateString()}
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>{pedido.status}</td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  <button
                    onClick={() => abrirModalExportar(pedido)}
                    style={{
                      padding: "5px 15px",
                      backgroundColor: "#28a745",
                      color: "white",
                      borderRadius: "5px",
                      cursor: "pointer",
                      border: "none",
                    }}
                  >
                    Exportar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Exportação */}
      {modalPedido && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "600px",
            }}
          >
            <h3>Detalhes do Pedido {modalPedido.numeroPedido}</h3>
            <div style={{ marginBottom: "10px" }}>
              <button
                onClick={fecharModalExportar}
                style={{
                  padding: "5px 15px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                Fechar
              </button>
              <button
                onClick={exportarParaExcel}
                style={{
                  padding: "5px 15px",
                  backgroundColor: "#00009C",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                  border: "none",
                  marginLeft: "10px",
                }}
              >
                Exportar para Excel
              </button>
            </div>
            {/* Exibição dos detalhes do pedido */}
            <div>
              <strong>Fornecedor:</strong> {modalPedido.razaoSocial}
            </div>
            <div>
              <strong>CNPJ:</strong> {modalPedido.cnpj}
            </div>
            <div>
              <strong>Data Inicial:</strong> {modalPedido.dataPedido}
            </div>
            <div>
              <strong>Data Final:</strong> {modalPedido.dataAté}
            </div>
            <div>
              <strong>Produtos:</strong>
              <ul>
                {modalPedido.produtos.map((produto, index) => (
                  <li key={index}>
                    {produto.sku} - {produto.descricao} - {produto.quantidade}{" "}
                    {produto.unidade}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
