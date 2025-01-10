

// import { useState, useEffect } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { initializeApp, getApp, getApps } from "firebase/app";
// import { getDatabase, ref, get, set, update } from "firebase/database";

// // Configuração do Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
//   authDomain: "bancoestoquecozinha.firebaseapp.com",
//   databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
//   projectId: "bancoestoquecozinha",
//   storageBucket: "bancoestoquecozinha.appspot.com",
//   messagingSenderId: "71775149511",
//   appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
// };

// // Inicializando o Firebase (só se não houver app inicializado)
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const db = getDatabase(app);

// export default function StatusPedidos() {
//   const [pedidos, setPedidos] = useState([]);
//   const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
//   const [modalAberto, setModalAberto] = useState(false);

//   useEffect(() => {
//     const fetchPedidos = async () => {
//       const pedidosRef = ref(db, "novosPedidos");
//       const pedidosSnapshot = await get(pedidosRef);
//       if (pedidosSnapshot.exists()) {
//         setPedidos(Object.values(pedidosSnapshot.val()));
//       } else {
//         toast.error("Nenhum pedido encontrado!");
//       }
//     };

//     fetchPedidos();
//   }, []);

//   const styles = {
//     container: {
//       maxWidth: "1200px",
//       margin: "0 auto",
//       padding: "40px 20px",
//       fontFamily: "Arial, sans-serif",
//       backgroundColor: "#f4f6f9",
//       borderRadius: "8px",
//       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//     },
//     header: {
//       backgroundColor: "rgba(231, 223, 223, 0.4)",
//       marginBottom: "40px",
//       textAlign: "center",
//     },
//     title: {
//       fontSize: "2.5rem",
//       color: "#333",
//       marginBottom: "10px",
//     },
//     table: {
//       width: "100%",
//       borderCollapse: "collapse",
//     },
//     tableHeader: {
//       backgroundColor: "#f2f2f2",
//       textAlign: "left",
//     },
//     tableCell: {
//       padding: "8px",
//       borderBottom: "1px solid #ddd",
//       textAlign: "center",
//     },
//     statusBadge: {
//       padding: "5px 15px",
//       borderRadius: "8px",
//       color: "#fff",
//       fontWeight: "bold",
//     },
//     statusPending: {
//       backgroundColor: "#FF9800",
//     },
//     statusApproved: {
//       backgroundColor: "#4CAF50",
//     },
//     statusCancelled: {
//       backgroundColor: "#F44336",
//     },
//     actionButton: {
//       margin: "5px",
//       padding: "8px 16px",
//       border: "none",
//       borderRadius: "5px",
//       cursor: "pointer",
//       color: "#fff",
//       fontWeight: "bold",
//     },
//     approveButton: {
//       backgroundColor: "#4CAF50",
//     },
//     cancelButton: {
//       backgroundColor: "#F44336",
//     },
//     viewButton: {
//       backgroundColor: "#FF9800",
//     },
//     modal: {
//       position: "fixed",
//       top: "0",
//       left: "0",
//       width: "100%",
//       height: "100%",
//       backgroundColor: "rgba(0, 0, 0, 0.5)",
//       display: modalAberto ? "flex" : "none",
//       justifyContent: "center",
//       alignItems: "center",
//       zIndex: "1000",
//     },
//     modalContent: {
//       backgroundColor: "white",
//       padding: "20px",
//       borderRadius: "8px",
//       maxWidth: "800px",
//       width: "100%",
//     },
//     modalHeader: {
//       fontSize: "1.5rem",
//       marginBottom: "20px",
//     },
//     modalCloseButton: {
//       backgroundColor: "#F44336",
//       color: "white",
//       border: "none",
//       padding: "5px 10px",
//       borderRadius: "5px",
//       cursor: "pointer",
//     },
//     productTable: {
//       width: "100%",
//       borderCollapse: "collapse",
//       marginTop: "20px",
//     },
//     productTableHeader: {
//       backgroundColor: "#f2f2f2",
//     },
//     productTableCell: {
//       padding: "8px",
//       borderBottom: "1px solid #ddd",
//       textAlign: "center",
//     },
//   };

//   const renderStatusBadge = (status) => {
//     if (status === "Pendente") {
//       return (
//         <span style={{ ...styles.statusBadge, ...styles.statusPending }}>
//           Pendente
//         </span>
//       );
//     }
//     if (status === "Aprovado") {
//       return (
//         <span style={{ ...styles.statusBadge, ...styles.statusApproved }}>
//           Aprovado
//         </span>
//       );
//     }
//     if (status === "Cancelado") {
//       return (
//         <span style={{ ...styles.statusBadge, ...styles.statusCancelled }}>
//           Cancelado
//         </span>
//       );
//     }
//     return null;
//   };

//   const handleVisualizarPedido = (pedido) => {
//     setPedidoSelecionado(pedido);
//     setModalAberto(true);
//   };

//   const handleFecharModal = () => {
//     setModalAberto(false);
//     setPedidoSelecionado(null);
//   };

//   const handleAprovarPedido = async (pedido) => {
//     try {
//       const pedidoRef = ref(db, `novosPedidos/${pedido.numeroPedido}`);
//       await update(pedidoRef, { status: "Aprovado" });

//       const estoqueRef = ref(db, "Estoque");
//       for (const produto of pedido.produtos) {
//         const produtoRef = ref(estoqueRef, produto.name);
//         const snapshot = await get(produtoRef);
//         if (snapshot.exists()) {
//           const currentProduto = snapshot.val();
//           await update(produtoRef, {
//             quantidade: currentProduto.quantidade + produto.quantidade,
//             unidade: produto.unit,
//           });
//         } else {
//           await set(produtoRef, {
//             quantidade: produto.quantidade,
//             unidade: produto.unit,
//           });
//         }
//       }

//       toast.success("Pedido aprovado e itens enviados para o estoque!");
//     } catch (error) {
//       toast.error("Erro ao aprovar o pedido!");
//     }
//   };

//   const handleCancelarPedido = async (pedido) => {
//     try {
//       const pedidoRef = ref(db, `novosPedidos/${pedido.numeroPedido}`);
//       await update(pedidoRef, { status: "Cancelado" });

//       toast.success("Pedido cancelado com sucesso!");
//     } catch (error) {
//       toast.error("Erro ao cancelar o pedido!");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <ToastContainer />
//       <div style={styles.header}>
//         <h2 style={styles.title}>Status dos Pedidos</h2>
//         <p style={{ fontSize: "18px", color: "#555" }}>
//           Acompanhe o status dos pedidos realizados
//         </p>
//       </div>

//       <table style={styles.table}>
//         <thead style={styles.tableHeader}>
//           <tr>
//             <th style={styles.tableCell}>Número do Pedido</th>
//             <th style={styles.tableCell}>Data do Pedido</th>
//             <th style={styles.tableCell}>Fornecedor</th>
//             <th style={styles.tableCell}>Data</th>
//             <th style={styles.tableCell}>Irá suprir até</th>

//             <th style={styles.tableCell}>Status</th>
//             <th style={styles.tableCell}>Ações</th>
//           </tr>
//         </thead>
//         <tbody>
//           {pedidos.length > 0 ? (
//             pedidos.map((pedido, index) => (
//               <tr key={index}>
//                 <td style={styles.tableCell}>{pedido.numeroPedido}</td>
//                 <td style={styles.tableCell}>
//                   {new Date(pedido.dataPedido).toLocaleDateString()}
//                 </td>
//                 <td style={styles.tableCell}>
//                   {pedido?.fornecedor?.razaoSocial ||
//                     "Fornecedor não informado"}
//                 </td>
//                 <td style={styles.tableCell}>
//                   {pedido.dataInicio}
//                 </td>
//                 <td style={styles.tableCell}>
//                   {pedido.dataFim}
//                 </td>
//                 <td style={styles.tableCell}>
//                   {renderStatusBadge(pedido.status)}
//                 </td>
//                 <td style={styles.tableCell}>
//                   <button
//                     style={{ ...styles.actionButton, ...styles.viewButton }}
//                     onClick={() => handleVisualizarPedido(pedido)}
//                   >
//                     Visualizar
//                   </button>
//                   <button
//                     style={{ ...styles.actionButton, ...styles.approveButton }}
//                     onClick={() => handleAprovarPedido(pedido)}
//                     disabled={
//                       pedido.status === "Aprovado" ||
//                       pedido.status === "Cancelado"
//                     }
//                   >
//                     Aprovar
//                   </button>
//                   <button
//                     style={{ ...styles.actionButton, ...styles.cancelButton }}
//                     onClick={() => handleCancelarPedido(pedido)}
//                     disabled={
//                       pedido.status === "Aprovado" ||
//                       pedido.status === "Cancelado"
//                     }
//                   >
//                     Cancelar
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" style={styles.tableCell}>
//                 Nenhum pedido encontrado.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Modal de Detalhes do Pedido */}
//       {pedidoSelecionado && (
//         <div style={styles.modal}>
//           <div style={styles.modalContent}>
//             <h3 style={styles.modalHeader}>
//               Detalhes do Pedido: {pedidoSelecionado.numeroPedido}
//             </h3>
//             <table style={styles.productTable}>
//               <thead style={styles.productTableHeader}>
//                 <tr>
//                   <th style={styles.productTableCell}>SKU</th>
//                   <th style={styles.productTableCell}>Produto</th>
//                   <th style={styles.productTableCell}>Marca</th>
//                   <th style={styles.productTableCell}>Quantidade</th>
//                   <th style={styles.productTableCell}>Unidade</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pedidoSelecionado.produtos.map((produto, index) => (
//                   <tr key={index}>
//                     <td style={styles.productTableCell}>{produto.sku}</td>
//                     <td style={styles.productTableCell}>{produto.name}</td>
//                     <td style={styles.productTableCell}>{produto.marca}</td>
//                     <td style={styles.productTableCell}>{produto.quantidade}</td>
//                     <td style={styles.productTableCell}>{produto.unit}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <button style={styles.modalCloseButton} onClick={handleFecharModal}>
//               Fechar
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase, ref, get, update } from "firebase/database";

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

// Inicializando o Firebase (só se não houver app inicializado)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export default function StatusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null); // Estado para saber qual produto está sendo editado
  const [quantidade, setQuantidade] = useState(""); // Quantidade editada
  const [valorUnitario, setValorUnitario] = useState(""); // Valor unitário editado

  useEffect(() => {
    const fetchPedidos = async () => {
      const pedidosRef = ref(db, "novosPedidos");
      const pedidosSnapshot = await get(pedidosRef);
      if (pedidosSnapshot.exists()) {
        setPedidos(Object.values(pedidosSnapshot.val()));
      } else {
        toast.error("Nenhum pedido encontrado!");
      }
    };

    fetchPedidos();
  }, []);

  const handleVisualizarPedido = (pedido) => {
    setPedidoSelecionado(pedido);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setPedidoSelecionado(null);
  };

  const handleEditProduto = (produto) => {
    setEditando(produto.sku); // Marca qual produto está sendo editado
    setQuantidade(produto.quantidade); // Define a quantidade inicial
    setValorUnitario(produto.valorUnitario); // Define o valor unitário inicial
  };


 const handleSalvarProdutoEditado = async (produto) => {
  // Recalcular o valor total com base na quantidade e no valor unitário
  const total = parseFloat(valorUnitario) * parseInt(quantidade);

  // Atualizar o produto com as novas informações (quantidade, valorUnitario, total)
  const updatedProduto = { ...produto, quantidade, valorUnitario, total };

  // Atualiza o pedido no estado local, mas sem adicionar um novo produto
  const updatedPedidos = pedidos.map((pedido) => {
    if (pedido.numeroPedido === pedidoSelecionado.numeroPedido) {
      // Aqui estamos atualizando os produtos no pedido selecionado
      const updatedProdutos = pedido.produtos.map((prod) => {
        if (prod.sku === produto.sku) {
          // Se o SKU do produto coincidir com o produto editado, substituímos ele
          return updatedProduto;
        }
        return prod; // Se não for o produto editado, mantém o produto original
      });
      
      // Atualiza o pedido com os produtos modificados
      return { ...pedido, produtos: updatedProdutos };
    }
    return pedido; // Se não for o pedido selecionado, mantém o pedido original
  });

  // Atualiza o estado com os pedidos modificados
  setPedidos(updatedPedidos);
  setEditando(null); // Limpa o estado de edição

  // Atualizar no Firebase
  const pedidoRef = ref(db, "novosPedidos/" + pedidoSelecionado.numeroPedido);
  await update(pedidoRef, {
    produtos: pedidoSelecionado.produtos.map((prod) => {
      if (prod.sku === produto.sku) {
        // Atualiza o produto com os novos dados
        return updatedProduto;
      }
      return prod; // Mantém os outros produtos
    }),
  });

  toast.success("Produto atualizado com sucesso!");
};

  
  
  const handleChangeQuantidade = (e) => {
    setQuantidade(e.target.value);
  };

  const handleChangeValorUnitario = (e) => {
    setValorUnitario(e.target.value);
  };

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "40px 20px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f4f6f9",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      backgroundColor: "#f2f2f2",
      textAlign: "left",
    },
    tableCell: {
      padding: "8px",
      borderBottom: "1px solid #ddd",
      textAlign: "center",
    },
    statusBadge: {
      padding: "5px 15px",
      borderRadius: "8px",
      color: "#fff",
      fontWeight: "bold",
    },
    statusPending: {
      backgroundColor: "#FF9800",
    },
    statusApproved: {
      backgroundColor: "#4CAF50",
    },
    statusCancelled: {
      backgroundColor: "#F44336",
    },
    actionButton: {
      margin: "5px",
      padding: "8px 16px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      color: "#fff",
      fontWeight: "bold",
    },
    approveButton: {
      backgroundColor: "#4CAF50",
    },
    cancelButton: {
      backgroundColor: "#F44336",
    },
    viewButton: {
      backgroundColor: "#FF9800",
    },
    modal: {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: modalAberto ? "flex" : "none",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "1000",
    },
    modalContent: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      maxWidth: "800px",
      width: "100%",
    },
    modalHeader: {
      fontSize: "1.5rem",
      marginBottom: "20px",
    },
    modalCloseButton: {
      backgroundColor: "#F44336",
      color: "white",
      border: "none",
      padding: "5px 10px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    productTable: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
    },
    productTableHeader: {
      backgroundColor: "#f2f2f2",
    },
    productTableCell: {
      padding: "8px",
      borderBottom: "1px solid #ddd",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      <h2>Status dos Pedidos</h2>
      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.tableCell}>Número do Pedido</th>
            <th style={styles.tableCell}>Data do Pedido</th>
            <th style={styles.tableCell}>Fornecedor</th>
            <th style={styles.tableCell}>Data</th>
            <th style={styles.tableCell}>Irá suprir até</th>
            <th style={styles.tableCell}>Status</th>
            <th style={styles.tableCell}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.length > 0 ? (
            pedidos.map((pedido, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>{pedido.numeroPedido}</td>
                <td style={styles.tableCell}>
                  {new Date(pedido.dataPedido).toLocaleDateString()}
                </td>
                <td style={styles.tableCell}>
                  {pedido?.fornecedor?.razaoSocial ||
                    "Fornecedor não informado"}
                </td>
                <td style={styles.tableCell}>{pedido.dataInicio}</td>
                <td style={styles.tableCell}>{pedido.dataFim}</td>
                <td style={styles.tableCell}>
                  {pedido.status === "Pendente" && (
                    <span style={{ ...styles.statusBadge, ...styles.statusPending }}>
                      Pendente
                    </span>
                  )}
                  {pedido.status === "Aprovado" && (
                    <span style={{ ...styles.statusBadge, ...styles.statusApproved }}>
                      Aprovado
                    </span>
                  )}
                  {pedido.status === "Cancelado" && (
                    <span style={{ ...styles.statusBadge, ...styles.statusCancelled }}>
                      Cancelado
                    </span>
                  )}
                </td>
                <td style={styles.tableCell}>
                  <button
                    style={{ ...styles.actionButton, ...styles.viewButton }}
                    onClick={() => handleVisualizarPedido(pedido)}
                  >
                    Visualizar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={styles.tableCell}>
                Nenhum pedido encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal de Detalhes do Pedido */}
      {pedidoSelecionado && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalHeader}>
              Detalhes do Pedido: {pedidoSelecionado.numeroPedido}
            </h3>
            <table style={styles.productTable}>
              <thead style={styles.productTableHeader}>
                <tr>
                  <th style={styles.productTableCell}>SKU</th>
                  <th style={styles.productTableCell}>Produto</th>
                  <th style={styles.productTableCell}>Marca</th>
                  <th style={styles.productTableCell}>Quantidade</th>
                  <th style={styles.productTableCell}>Valor Unitário</th>
                  <th style={styles.productTableCell}>Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {pedidoSelecionado.produtos.map((produto, index) => (
                  <tr key={index}>
                    <td style={styles.productTableCell}>{produto.sku}</td>
                    <td style={styles.productTableCell}>{produto.name}</td>
                    <td style={styles.productTableCell}>{produto.marca}</td>
                    <td style={styles.productTableCell}>
                      {editando === produto.sku ? (
                        <input
                          type="number"
                          value={quantidade}
                          onChange={handleChangeQuantidade}
                        />
                      ) : (
                        produto.quantidade
                      )}
                    </td>
                    <td style={styles.productTableCell}>
                      {editando === produto.sku ? (
                        <input
                          type="number"
                          value={valorUnitario}
                          onChange={handleChangeValorUnitario}
                        />
                      ) : (
                        produto.valorUnitario
                      )}
                    </td>
                    <td style={styles.productTableCell}>
                      {editando === produto.sku ? (
                        (parseFloat(valorUnitario) * parseInt(quantidade)).toFixed(2)
                      ) : (
                        produto.total || (produto.valorUnitario * produto.quantidade).toFixed(2)
                      )}
                    </td>
                    <td>
                      {editando === produto.sku ? (
                        <button
                          onClick={() => handleSalvarProdutoEditado(produto)}
                        >
                          Salvar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditProduto(produto)}
                        >
                          Editar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button style={styles.modalCloseButton} onClick={handleFecharModal}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
