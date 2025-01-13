// import { useState, useEffect } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { initializeApp, getApp, getApps } from "firebase/app";
// import { getDatabase, ref, get, update } from "firebase/database";

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

//   const handleVisualizarPedido = (pedido) => {
//     setPedidoSelecionado(pedido);
//     setModalAberto(true);
//   };

//   const handleFecharModal = () => {
//     setModalAberto(false);
//     setPedidoSelecionado(null);
//   };

//   // Função para atualizar o status no Firebase
//   const handleAtualizarStatus = (pedidoId, novoStatus) => {
//     const pedidoRef = ref(db, `novosPedidos/${pedidoId}`);
//     update(pedidoRef, { status: novoStatus })
//       .then(() => {
//         toast.success(`Status do pedido atualizado para "${novoStatus}"`);
//         // Atualizar o estado local dos pedidos
//         setPedidos((prevPedidos) =>
//           prevPedidos.map((pedido) =>
//             pedido.numeroPedido === pedidoId
//               ? { ...pedido, status: novoStatus }
//               : pedido
//           )
//         );
//       })
//       .catch((error) => {
//         toast.error("Erro ao atualizar o status do pedido.");
//         console.error("Erro ao atualizar status:", error);
//       });
//   };

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

//   return (
//     <div style={styles.container}>
//       <ToastContainer />
//       <h2>Status dos Pedidos</h2>
//       <table style={styles.table}>
//         <thead style={styles.tableHeader}>
//           <tr>
//             <th style={styles.tableCell}>Número do Pedido</th>
//             <th style={styles.tableCell}>Data do Pedido</th>
//             <th style={styles.tableCell}>Fornecedor</th>
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
//                   {pedido?.fornecedor?.razaoSocial || "Fornecedor não informado"}
//                 </td>
//                 <td style={styles.tableCell}>
//                   <span
//                     style={{
//                       color:
//                         pedido.status === "Pendente"
//                           ? "orange"
//                           : pedido.status === "Aprovado"
//                           ? "green"
//                           : "red",
//                     }}
//                   >
//                     {pedido.status}
//                   </span>
//                 </td>
//                 <td style={styles.tableCell}>
//                   <button
//                     onClick={() => handleVisualizarPedido(pedido)}
//                     style={{ marginRight: "10px" }}
//                   >
//                     Visualizar
//                   </button>
//                   {pedido.status === "Pendente" && (
//                     <>
//                       <button
//                         onClick={() =>
//                           handleAtualizarStatus(pedido.numeroPedido, "Aprovado")
//                         }
//                         style={{ backgroundColor: "green", color: "white" }}
//                       >
//                         Aprovar
//                       </button>
//                       <button
//                         onClick={() =>
//                           handleAtualizarStatus(pedido.numeroPedido, "Cancelado")
//                         }
//                         style={{ backgroundColor: "red", color: "white" }}
//                       >
//                         Cancelar
//                       </button>
//                     </>
//                   )}
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
//       {modalAberto && pedidoSelecionado && (
//         <div style={styles.modal}>
//           <div style={styles.modalContent}>
//             <h3 style={styles.modalHeader}>
//               Pedido #{pedidoSelecionado.numeroPedido}
//             </h3>
//             <p><strong>Data do Pedido:</strong> {new Date(pedidoSelecionado.dataPedido).toLocaleDateString()}</p>
//             <p><strong>Fornecedor:</strong> {pedidoSelecionado.fornecedor?.razaoSocial || "Não informado"}</p>
//             <p><strong>Status:</strong> {pedidoSelecionado.status}</p>
//             <h4>Produtos</h4>
//             <table style={styles.productTable}>
//               <thead style={styles.productTableHeader}>
//                 <tr>
//                   <th style={styles.productTableCell}>SKU</th>
//                   <th style={styles.productTableCell}>Nome</th>
//                   <th style={styles.productTableCell}>Quantidade</th>
//                   <th style={styles.productTableCell}>Valor Unitário</th>
//                   <th style={styles.productTableCell}>Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pedidoSelecionado.produtos.map((produto, index) => (
//                   <tr key={index}>
//                     <td style={styles.productTableCell}>{produto.sku}</td>
//                     <td style={styles.productTableCell}>{produto.name}</td>
//                     <td style={styles.productTableCell}>{produto.quantidade}</td>
//                     <td style={styles.productTableCell}>
//                       {produto.valorUnitario?.toFixed(2)}
//                     </td>
//                     <td style={styles.productTableCell}>
//                       {(produto.valorUnitario * produto.quantidade)?.toFixed(2)}
//                     </td>
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
  const [modoEdicao, setModoEdicao] = useState(false);

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
    setModoEdicao(false); // Desabilitar o modo de edição ao visualizar
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setPedidoSelecionado(null);
  };

  const handleAlterarStatus = async (pedidoId, novoStatus) => {
    try {
      const pedidoRef = ref(db, `novosPedidos/${pedidoId}`);
      await update(pedidoRef, { status: novoStatus });
      toast.success(`Pedido ${pedidoId} atualizado para: ${novoStatus}`);
      // Atualizando o estado local após a alteração
      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.numeroPedido === pedidoId
            ? { ...pedido, status: novoStatus }
            : pedido
        )
      );
    } catch (error) {
      toast.error("Erro ao atualizar o status do pedido.");
    }
  };

  const handleSalvarEdicao = async () => {
    try {
      const pedidoRef = ref(db, `novosPedidos/${pedidoSelecionado.numeroPedido}`);
      await update(pedidoRef, {
        produtos: pedidoSelecionado.produtos,
      });
      toast.success("Pedido atualizado com sucesso!");
      setModoEdicao(false); // Desabilitar o modo de edição
    } catch (error) {
      toast.error("Erro ao salvar a edição do pedido.");
    }
  };

  const handleAlterarItem = (index, campo, valor) => {
    const novoPedido = { ...pedidoSelecionado };
    novoPedido.produtos[index][campo] = valor;

    // Atualizar o valor total automaticamente
    if (campo === "quantidade" || campo === "valorUnitario") {
      const produto = novoPedido.produtos[index];
      produto.valorTotal = produto.quantidade * produto.valorUnitario;
    }

    setPedidoSelecionado(novoPedido);
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
    input: {
      padding: "5px",
      width: "100px",
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
                  {pedido?.fornecedor?.razaoSocial || "Fornecedor não informado"}
                </td>
                <td style={styles.tableCell}>
                  <span
                    style={{
                      color: pedido.status === "Aprovado" ? "green" : pedido.status === "Cancelado" ? "red" : "black",
                    }}
                  >
                    {pedido.status}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <button onClick={() => handleVisualizarPedido(pedido)}>
                    Visualizar
                  </button>
                  {pedido.status === "Pendente" && (
                    <div>
                      <button
                        onClick={() => handleAlterarStatus(pedido.numeroPedido, "Aprovado")}
                        style={{ backgroundColor: "green", color: "white", margin: "5px" }}
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleAlterarStatus(pedido.numeroPedido, "Cancelado")}
                        style={{ backgroundColor: "red", color: "white", margin: "5px" }}
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
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
      {modalAberto && pedidoSelecionado && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalHeader}>
              Pedido #{pedidoSelecionado.numeroPedido}
            </h3>
            <p><strong>Data do Pedido:</strong> {new Date(pedidoSelecionado.dataPedido).toLocaleDateString()}</p>
            <p><strong>Fornecedor:</strong> {pedidoSelecionado.fornecedor?.razaoSocial || "Não informado"}</p>
            <p><strong>Status:</strong> {pedidoSelecionado.status}</p>
            
            <h4>Produtos</h4>
            <table style={styles.productTable}>
              <thead style={styles.productTableHeader}>
                <tr>
                  <th style={styles.productTableCell}>SKU</th>
                  <th style={styles.productTableCell}>Nome</th>
                  <th style={styles.productTableCell}>Quantidade</th>
                  <th style={styles.productTableCell}>Valor Unitário</th>
                  <th style={styles.productTableCell}>Total</th>
                </tr>
              </thead>
              <tbody>
                {pedidoSelecionado.produtos.map((produto, index) => (
                  <tr key={index}>
                    <td style={styles.productTableCell}>{produto.sku}</td>
                    <td style={styles.productTableCell}>{produto.name}</td>
                    <td style={styles.productTableCell}>
                      {modoEdicao ? (
                        <input
                          style={styles.input}
                          type="number"
                          value={produto.quantidade}
                          onChange={(e) =>
                            handleAlterarItem(index, "quantidade", e.target.value)
                          }
                        />
                      ) : (
                        produto.quantidade
                      )}
                    </td>
                    <td style={styles.productTableCell}>
                      {modoEdicao ? (
                        <input
                          style={styles.input}
                          type="number"
                          value={produto.valorUnitario}
                          onChange={(e) =>
                            handleAlterarItem(index, "valorUnitario", e.target.value)
                          }
                        />
                      ) : (
                        produto.valorUnitario?.toFixed(2)
                      )}
                    </td>
                    <td style={styles.productTableCell}>
                      {(produto.valorUnitario * produto.quantidade)?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {modoEdicao ? (
              <div>
                <button
                  style={{ backgroundColor: "blue", color: "white" }}
                  onClick={handleSalvarEdicao}
                >
                  Salvar Alterações
                </button>
                <button
                  style={{ backgroundColor: "#F44336", color: "white", marginLeft: "10px" }}
                  onClick={() => setModoEdicao(false)}
                >
                  Cancelar Edição
                </button>
              </div>
            ) : (
              <button
                style={{ backgroundColor: "orange", color: "white" }}
                onClick={() => setModoEdicao(true)}
              >
                Editar Pedido
              </button>
            )}

            <button style={styles.modalCloseButton} onClick={handleFecharModal}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

