
// import { useState, useEffect } from "react";
// import * as XLSX from "xlsx";
// import { ref, get } from "firebase/database";
// import database from "../../firebaseConfig"; // Importando a configuração do Firebase

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
//     const estoqueRef = ref(database, "Estoque");
//     get(estoqueRef).then((snapshot) => {
//       if (snapshot.exists()) {
//         const dadosEstoque = snapshot.val();
//         const pedidosArray = Object.keys(dadosEstoque).map((key) => ({
//           ...dadosEstoque[key],
//           id: key,
//         }));
//         setPedidos(pedidosArray);
//       } else {
//         console.log("Nenhum dado encontrado em Estoque");
//       }
//     });

//     // Buscar dados da tabela "CadastroFornecedor"
//     const fornecedoresRef = ref(database, "CadastroFornecedores");
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
//             <select
//               id="filtroStatus"
//               style={{
//                 marginRight: "10px",
//                 padding: "8px",
//                 borderRadius: "5px",
//                 border: "1px solid #ddd",
//               }}
//               onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
//             >
//               <option value="">Selecione</option>
//               <option value="Aprovado">Aprovado</option>
//               <option value="Cancelado">Cancelado</option>
//             </select>
//           </div>
//           <div>
//             <label htmlFor="filtroPedido">Número do Pedido:</label>
//             <input
//               type="text"
//               id="filtroPedido"
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
//               padding: "8px 15px",
//               cursor: "pointer",
//               backgroundColor: "#00009C",
//               color: "white",
//               border: "none",
//               borderRadius: "5px",
//               transition: "background-color 0.3s",
//             }}
//             onMouseEnter={(e) => (e.target.style.backgroundColor = "#003366")}
//             onMouseLeave={(e) => (e.target.style.backgroundColor = "#00009C")}
//           >
//             Aplicar Filtros
//           </button>
//         </div>
//       </div>

//       {/* Tabela de Pedidos */}
//       <div style={{ marginTop: "20px" }}>
//         <h2>Pedidos</h2>
//         <table
//           id="pedidosTable"
//           border="1"
//           cellpadding="5"
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//             borderRadius: "8px",
//             overflow: "hidden",
//           }}
//         >
//           <thead style={{ backgroundColor: "#00009C", color: "white" }}>
//             <tr>
//               <th>Data do Pedido</th>
//               <th>Número do Pedido</th>
//               <th>Data Inicial</th>
//               <th>Data Final</th>
//               <th>Razão Social</th>
//               <th>Status</th>
//               <th>Ações</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pedidos.map((pedido) => (
//               <tr key={pedido.id} style={{ backgroundColor: "#fff", textAlign: "center" }}>
//                 <td>{pedido.dataHoje}</td>
//                 <td>{pedido.numeroPedido}</td>
//                 <td>{pedido.dataPedido}</td>
//                 <td>{pedido.dataAté}</td>
//                 <td>{pedido.razaoSocial}</td>
//                 <td>{pedido.status}</td>
//                 <td>
//                   <button
//                     onClick={() => abrirModalExportar(pedido)}
//                     style={{
//                       padding: "5px 10px",
//                       cursor: "pointer",
//                       backgroundColor: "#4CAF50",
//                       color: "white",
//                       border: "none",
//                       borderRadius: "5px",
//                       transition: "background-color 0.3s",
//                     }}
//                     onMouseEnter={(e) => (e.target.style.backgroundColor = "#45a049")}
//                     onMouseLeave={(e) => (e.target.style.backgroundColor = "#4CAF50")}
//                   >
//                     Visualizar Pedido
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal de Exportação */}
//       {modalPedido && (
//         <div
//           id="exportarModal"
//           style={{
//             display: "block",
//             position: "fixed",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             backgroundColor: "white",
//             padding: "20px",
//             boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//             width: "80%",
//             maxWidth: "800px",
//             borderRadius: "8px",
//           }}
//         >
//           <h2>Detalhes do Pedido</h2>
//           <p>
//             <strong>Data do Pedido:</strong> {modalPedido.dataHoje}
//           </p>
//           <p>
//             <strong>Número do Pedido:</strong> {modalPedido.numeroPedido}
//           </p>
//           <p>
//             <strong>Data Inicial:</strong> {modalPedido.dataPedido}
//           </p>
//           <p>
//             <strong>Data Final:</strong> {modalPedido.dataAté}
//           </p>
//           <p>
//             <strong>Razão Social:</strong> {modalPedido.razaoSocial}
//           </p>

//           <table
//             id="produtosTable"
//             border="1"
//             cellpadding="5"
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               borderRadius: "8px",
//               overflow: "hidden",
//             }}
//           >
//             <thead style={{ backgroundColor: "#00009C", color: "white" }}>
//               <tr>
//                 <th>SKU</th>
//                 <th>Descrição</th>
//                 <th>Quantidade</th>
//                 <th>Valor Unitário</th>
//                 <th>Valor Total</th>
//                 <th>Tipo</th>
//                 <th>Unidade</th>
//                 <th>Observação</th>
//               </tr>
//             </thead>
//             <tbody>
//               {modalPedido.produtos.map((produto, index) => (
//                 <tr key={index} style={{ backgroundColor: "#fff" }}>
//                   <td>{produto.sku}</td>
//                   <td>{produto.descricao}</td>
//                   <td>{produto.quantidade}</td>
//                   <td>{formatarMoeda(produto.valorUnitario)}</td>
//                   <td>{formatarMoeda(produto.valorTotal)}</td>
//                   <td>{produto.tipo}</td>
//                   <td>{produto.unidade}</td>
//                   <td>{produto.observacao}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <button
//             onClick={exportarParaExcel}
//             style={{
//               padding: "8px 15px",
//               cursor: "pointer",
//               backgroundColor: "#4CAF50",
//               color: "white",
//               border: "none",
//               borderRadius: "5px",
//               marginTop: "20px",
//             }}
//           >
//             Exportar para Excel
//           </button>
//           <button
//             onClick={fecharModalExportar}
//             style={{
//               padding: "8px 15px",
//               cursor: "pointer",
//               backgroundColor: "#f44336",
//               color: "white",
//               border: "none",
//               borderRadius: "5px",
//               marginTop: "10px",
//               marginLeft: "10px",
//             }}
//           >
//             Fechar
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

