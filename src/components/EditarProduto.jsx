// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const EditarProduto = () => {
//   const [produtos, setProdutos] = useState([
//     { id: 1, nome: 'Produto A', descricao: 'Descrição do Produto A', preco: 'R$ 15,00', quantidade: 10, valorTotal: 'R$ 150,00' },
//     { id: 2, nome: 'Produto B', descricao: 'Descrição do Produto B', preco: 'R$ 25,00', quantidade: 5, valorTotal: 'R$ 125,00' },
//     { id: 3, nome: 'Produto C', descricao: 'Descrição do Produto C', preco: 'R$ 30,00', quantidade: 8, valorTotal: 'R$ 240,00' },
//   ]);

//   const [produtoSelecionado, setProdutoSelecionado] = useState(null);

//   const handleEdit = (produto) => {
//     setProdutoSelecionado(produto);
//   };

//   const formatCurrency = (value) => {
//     value = value.replace(/\D/g, '');
//     const formattedValue = (value / 100).toLocaleString('pt-BR', {
//       style: 'currency',
//       currency: 'BRL',
//     });
//     return formattedValue;
//   };

//   const calculateTotal = (preco, quantidade) => {
//     const numericPreco = parseFloat(preco.replace(/[^\d,-]/g, '').replace(',', '.'));
//     const total = numericPreco * quantidade;
//     return isNaN(total)
//       ? 'R$ 0,00'
//       : total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
//   };

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     let updatedProduto = { ...produtoSelecionado, [name]: value };

//     if (name === 'preco') {
//       updatedProduto.preco = formatCurrency(value);
//     }

//     if (name === 'preco' || name === 'quantidade') {
//       updatedProduto.valorTotal = calculateTotal(updatedProduto.preco, updatedProduto.quantidade);
//     }

//     setProdutoSelecionado(updatedProduto);
//   };

//   const handleSave = (event) => {
//     event.preventDefault();
//     const produtosAtualizados = produtos.map((produto) =>
//       produto.id === produtoSelecionado.id ? produtoSelecionado : produto
//     );
//     setProdutos(produtosAtualizados);
//     setProdutoSelecionado(null);
//   };

//   const navigate = useNavigate()

//   const handleHome = () => navigate ("/Status_Pedido")

//   return (
//     <div style={styles.container}>
//       <div style={styles.tableContainer}>
//         <h2 style={styles.title}>Lista de Produtos</h2>
//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th style={styles.tableHeader}>Produto</th>
//               <th style={styles.tableHeader}>Descrição</th>
//               <th style={styles.tableHeader}>Valor Unitário</th>
//               <th style={styles.tableHeader}>Quantidade</th>
//               <th style={styles.tableHeader}>Valor Total</th>
//               <th style={styles.tableHeader}>Ações</th>
//             </tr>
//           </thead>
//           <tbody>
//             {produtos.map((produto) => (
//               <tr key={produto.id}>
//                 <td style={styles.tableCell}>{produto.nome}</td>
//                 <td style={styles.tableCell}>{produto.descricao}</td>
//                 <td style={styles.tableCell}>{produto.preco}</td>
//                 <td style={styles.tableCell}>{produto.quantidade}</td>
//                 <td style={styles.tableCell}>{produto.valorTotal}</td>
//                 <td style={styles.tableCell}>
//                   <button style={styles.editButton} onClick={() => handleEdit(produto)}>
//                     Editar
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {produtoSelecionado && (
//         <div style={styles.formContainer}>
//           <h2 style={styles.title1}>Editar Produto</h2>
//           <form onSubmit={handleSave} style={styles.form}>
//             <label style={styles.label}>
//               Produto:
//               <input
//                 type="text"
//                 name="nome"
//                 value={produtoSelecionado.nome}
//                 onChange={handleInputChange}
//                 style={styles.input}
//               />
//             </label>

//             <label style={styles.label}>
//               Descrição:
//               <input
//                 type="text"
//                 name="descricao"
//                 value={produtoSelecionado.descricao}
//                 onChange={handleInputChange}
//                 style={styles.input}
//               />
//             </label>

//             <label style={styles.label}>
//               Valor Unitário:
//               <input
//                 type="text"
//                 name="preco"
//                 value={produtoSelecionado.preco}
//                 onChange={handleInputChange}
//                 style={styles.input}
//               />
//             </label>

//             <label style={styles.label}>
//               Quantidade:
//               <input
//                 type="number"
//                 name="quantidade"
//                 value={produtoSelecionado.quantidade}
//                 onChange={handleInputChange}
//                 style={styles.input}
//               />
//             </label>

//             <label style={styles.label}>
//               Valor Total:
//               <input
//                 type="text"
//                 name="valorTotal"
//                 value={produtoSelecionado.valorTotal}
//                 readOnly
//                 style={styles.input}
//               />
//             </label>

//             <button type="submit" style={styles.button}>
//               Salvar Alterações
//             </button>
//           </form>

//         </div>
//       )}
//           <button type="button" onClick={handleHome} style={styles.backButton}>
//             Voltar
//           </button>
//     </div>
//   );
// };

// const styles = {
//   // ... (manter os estilos existentes)
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     padding: '20px',
//     backgroundColor: '#00009c',
//     minHeight: '100vh',
//   },
//   tableContainer: {
//     width: '100%',
//     maxWidth: '800px',
//     marginBottom: '20px',
//   },
//   title: {
//     textAlign: 'center',
//     color: 'white',
//     fontSize: '1.8em',
//     marginBottom: '20px',
//   },
//   title1: {
//     textAlign: 'center',
//     color: 'black',
//     fontSize: '1.8em',
//     marginBottom: '20px',
//   },
//   table: {
//     width: '100%',
//     borderCollapse: 'collapse',
//     boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
//     backgroundColor: 'white'
//   },
//   tableHeader: {
//     backgroundColor: '#4CAF50',
//     color: '#fff',
//     padding: '10px',
//     textAlign: 'left',
//   },
//   tableCell: {
//     padding: '10px',
//     borderBottom: '1px solid #ddd',
//     textAlign: 'left',
//   },
//   editButton: {
//     backgroundColor: '#2196F3',
//     color: '#fff',
//     padding: '5px 10px',
//     border: 'none',
//     borderRadius: '3px',
//     cursor: 'pointer',
//   },
//   formContainer: {
//     backgroundColor: '#fff',
//     borderRadius: '10px',
//     boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
//     padding: '30px',
//     width: '100%',
//     maxWidth: '400px',
//     marginTop: '20px',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '15px',
//   },
//   label: {
//     display: 'flex',
//     flexDirection: 'column',
//     fontWeight: 'bold',
//     fontSize: '1em',
//     color: '#555',
//   },
//   input: {
//     padding: '10px',
//     borderRadius: '5px',
//     border: '1px solid #ccc',
//     fontSize: '1em',
//     marginTop: '5px',
//   },
//   button: {
//     backgroundColor: '#4CAF50',
//     color: '#fff',
//     padding: '12px',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     fontSize: '1em',
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   backButton: {
//     backgroundColor: '#F20DE7',
//     color: '#fff',
//     padding: '10px',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     fontSize: '1em',
//     marginTop: '10px',
//     fontWeight: 'bold',
//   },
// };

// export default EditarProduto;

// import { useState, useEffect } from "react";
// import firebase from "firebase/compat/app";
// import "firebase/compat/database";
// import { useParams, useNavigate } from "react-router-dom";

// // Referência ao banco de dados
// const dbPedidos = firebase.database().ref("Pedidos");

// export default function EditarPedido() {
//   const { id } = useParams(); // Pegando o ID da URL
//   const [pedido, setPedido] = useState(null);
//   const [formData, setFormData] = useState({
//     status: "",
//     data: "",
//     fornecedor: "",
//     categoria: "",
//     valor: "",
//   });

//   const navigate = useNavigate(); // Definindo o navigate fora do clique

//   // Função para buscar os dados do pedido
//   const fetchPedido = () => {
//     dbPedidos
//       .child(id)
//       .get()
//       .then((snapshot) => {
//         if (snapshot.exists()) {
//           setPedido(snapshot.val());
//           setFormData({
//             status: snapshot.val().status || "",
//             data: snapshot.val().data,
//             fornecedor: snapshot.val().fornecedor,
//             categoria: snapshot.val().categoria,
//             valor: snapshot.val().valor || "",
//           });
//         } else {
//           alert("Pedido não encontrado!");
//           navigate("/Status_Pedido"); // Redireciona para a página principal
//         }
//       });
//   };

//   useEffect(() => {
//     fetchPedido();
//   }, [id]);

//   const handleSubmitEdit = (e) => {
//     e.preventDefault();
//     const { status, data, fornecedor, categoria, valor } = formData;

//     dbPedidos
//       .child(id)
//       .update({
//         status,
//         data,
//         fornecedor,
//         categoria,
//         valor,
//       })
//       .then(() => {
//         alert("Pedido atualizado com sucesso!");
//         navigate("/Status_Pedido"); // Redireciona para a página de Status_Pedido após a atualização
//       })
//       .catch((error) => {
//         console.error("Erro ao atualizar pedido:", error);
//         alert("Erro ao atualizar o pedido. Tente novamente.");
//       });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   if (!pedido) return <div>Carregando...</div>;

//   return (
//     <div
//       style={{
//         padding: "30px",
//         backgroundColor: "#00009c",
//         maxWidth: "1000px",
//         margin: "30px auto",
//         borderRadius: "12px",
//         boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//       }}
//     >
//       <h2
//         style={{
//           textAlign: "center",
//           fontSize: "2.5rem",
//           color: "#fff",
//           marginBottom: "20px",
//           fontWeight: "600",
//         }}
//       >
//         Editar Pedido - {pedido.id}
//       </h2>
//       <form onSubmit={handleSubmitEdit}>
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             gap: "20px",
//           }}
//         >
//           <label
//             style={{
//               fontSize: "1.1rem",
//               color: "#fff",
//               marginBottom: "5px",
//               fontWeight: "500",
//             }}
//           >
//             Status:
//           </label>
//           <input
//             type="text"
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             required
//             style={{
//               padding: "12px",
//               fontSize: "1.1rem",
//               border: "1px solid #ddd",
//               borderRadius: "8px",
//               outline: "none",
//               boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//               transition: "border-color 0.3s ease",
//               marginBottom: "15px",
//               backgroundColor: "#fff",
//               color: "#333",
//             }}
//           />

//           <label
//             style={{
//               fontSize: "1.1rem",
//               color: "#fff",
//               marginBottom: "5px",
//               fontWeight: "500",
//             }}
//           >
//             Data:
//           </label>
//           <input
//             type="date"
//             name="data"
//             value={formData.data}
//             onChange={handleChange}
//             required
//             style={{
//               padding: "12px",
//               fontSize: "1.1rem",
//               border: "1px solid #ddd",
//               borderRadius: "8px",
//               outline: "none",
//               boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//               transition: "border-color 0.3s ease",
//               marginBottom: "15px",
//               backgroundColor: "#fff",
//               color: "#333",
//             }}
//           />

//           <label
//             style={{
//               fontSize: "1.1rem",
//               color: "#fff",
//               marginBottom: "5px",
//               fontWeight: "500",
//             }}
//           >
//             Fornecedor:
//           </label>
//           <input
//             type="text"
//             name="fornecedor"
//             value={formData.fornecedor}
//             onChange={handleChange}
//             required
//             style={{
//               padding: "12px",
//               fontSize: "1.1rem",
//               border: "1px solid #ddd",
//               borderRadius: "8px",
//               outline: "none",
//               boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//               transition: "border-color 0.3s ease",
//               marginBottom: "15px",
//               backgroundColor: "#fff",
//               color: "#333",
//             }}
//           />

//           <label
//             style={{
//               fontSize: "1.1rem",
//               color: "#fff",
//               marginBottom: "5px",
//               fontWeight: "500",
//             }}
//           >
//             Categoria:
//           </label>
//           <input
//             type="text"
//             name="categoria"
//             value={formData.categoria}
//             onChange={handleChange}
//             required
//             style={{
//               padding: "12px",
//               fontSize: "1.1rem",
//               border: "1px solid #ddd",
//               borderRadius: "8px",
//               outline: "none",
//               boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//               transition: "border-color 0.3s ease",
//               marginBottom: "15px",
//               backgroundColor: "#fff",
//               color: "#333",
//             }}
//           />

//           <label
//             style={{
//               fontSize: "1.1rem",
//               color: "#fff",
//               marginBottom: "5px",
//               fontWeight: "500",
//             }}
//           >
//             Valor:
//           </label>
//           <input
//             type="number"
//             name="valor"
//             value={formData.valor}
//             onChange={handleChange}
//             required
//             style={{
//               padding: "12px",
//               fontSize: "1.1rem",
//               border: "1px solid #ddd",
//               borderRadius: "8px",
//               outline: "none",
//               boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//               transition: "border-color 0.3s ease",
//               marginBottom: "20px",
//               backgroundColor: "#fff",
//               color: "#333",
//             }}
//           />
//           <button
//             type="submit"
//             style={{
//               backgroundColor: "#007bff",
//               color: "#fff",
//               padding: "14px 22px",
//               fontSize: "1.1rem",
//               border: "none",
//               borderRadius: "8px",
//               cursor: "pointer",
//               transition: "background-color 0.3s ease, transform 0.2s ease-in-out",
//               boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//             }}
//             onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
//             onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
//           >
//             Atualizar Pedido
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update } from 'firebase/database';

// Configuração do Firebase (substitua com suas credenciais do Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.firebasestorage.app",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2"
};
// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const EditarProduto = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const navigate = useNavigate();

  // Função para buscar produtos do Firebase
  useEffect(() => {
    const produtosRef = ref(db, 'produtos/');
    get(produtosRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const produtosList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setProdutos(produtosList);
      } else {
        console.log('Nenhum dado encontrado');
      }
    });
  }, []);

  const handleEdit = (produto) => {
    setProdutoSelecionado(produto);
  };

  const formatCurrency = (value) => {
    value = value.replace(/\D/g, '');
    const formattedValue = (value / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return formattedValue;
  };

  const calculateTotal = (preco, quantidade) => {
    const numericPreco = parseFloat(preco.replace(/[^\d,-]/g, '').replace(',', '.'));
    const total = numericPreco * quantidade;
    return isNaN(total)
      ? 'R$ 0,00'
      : total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let updatedProduto = { ...produtoSelecionado, [name]: value };

    if (name === 'preco') {
      updatedProduto.preco = formatCurrency(value);
    }

    if (name === 'preco' || name === 'quantidade') {
      updatedProduto.valorTotal = calculateTotal(updatedProduto.preco, updatedProduto.quantidade);
    }

    setProdutoSelecionado(updatedProduto);
  };

  const handleSave = (event) => {
    event.preventDefault();
    const produtoRef = ref(db, 'produtos/' + produtoSelecionado.id);
    update(produtoRef, {
      nome: produtoSelecionado.nome,
      descricao: produtoSelecionado.descricao,
      preco: produtoSelecionado.preco,
      quantidade: produtoSelecionado.quantidade,
      valorTotal: produtoSelecionado.valorTotal
    }).then(() => {
      // Atualiza a lista de produtos com os dados mais recentes
      setProdutos(prevProdutos =>
        prevProdutos.map(produto =>
          produto.id === produtoSelecionado.id ? produtoSelecionado : produto
        )
      );
      setProdutoSelecionado(null);
    }).catch((error) => {
      console.error("Erro ao salvar o produto: ", error);
    });
  };

  const handleHome = () => navigate("/Status_Pedido");

  return (
    <div style={styles.container}>
      <div style={styles.tableContainer}>
        <h2 style={styles.title}>Lista de Produtos</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Produto</th>
              <th style={styles.tableHeader}>Descrição</th>
              <th style={styles.tableHeader}>Valor Unitário</th>
              <th style={styles.tableHeader}>Quantidade</th>
              <th style={styles.tableHeader}>Valor Total</th>
              <th style={styles.tableHeader}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id}>
                <td style={styles.tableCell}>{produto.nome}</td>
                <td style={styles.tableCell}>{produto.descricao}</td>
                <td style={styles.tableCell}>{produto.preco}</td>
                <td style={styles.tableCell}>{produto.quantidade}</td>
                <td style={styles.tableCell}>{produto.valorTotal}</td>
                <td style={styles.tableCell}>
                  <button style={styles.editButton} onClick={() => handleEdit(produto)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {produtoSelecionado && (
        <div style={styles.formContainer}>
          <h2 style={styles.title1}>Editar Produto</h2>
          <form onSubmit={handleSave} style={styles.form}>
            <label style={styles.label}>
              Produto:
              <input
                type="text"
                name="nome"
                value={produtoSelecionado.nome}
                onChange={handleInputChange}
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Descrição:
              <input
                type="text"
                name="descricao"
                value={produtoSelecionado.descricao}
                onChange={handleInputChange}
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Valor Unitário:
              <input
                type="text"
                name="preco"
                value={produtoSelecionado.preco}
                onChange={handleInputChange}
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Quantidade:
              <input
                type="number"
                name="quantidade"
                value={produtoSelecionado.quantidade}
                onChange={handleInputChange}
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Valor Total:
              <input
                type="text"
                name="valorTotal"
                value={produtoSelecionado.valorTotal}
                readOnly
                style={styles.input}
              />
            </label>

            <button type="submit" style={styles.button}>
              Salvar Alterações
            </button>
          </form>
        </div>
      )}
      <button type="button" onClick={handleHome} style={styles.backButton}>
        Voltar
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#00009c',
    minHeight: '100vh',
  },
  tableContainer: {
    width: '100%',
    maxWidth: '800px',
    marginBottom: '20px',
  },
  title: {
    textAlign: 'center',
    color: 'white',
    fontSize: '1.8em',
    marginBottom: '20px',
  },
  title1: {
    textAlign: 'center',
    color: 'black',
    fontSize: '1.8em',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white'
  },
  tableHeader: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '10px',
    textAlign: 'left',
  },
  tableCell: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left',
  },
  editButton: {
    backgroundColor: '#2196F3',
    color: '#fff',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '30px',
    width: '100%',
    maxWidth: '400px',
    marginTop: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontWeight: 'bold',
    fontSize: '1em',
    color: '#555',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1em',
    marginTop: '5px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1.2em',
    cursor: 'pointer',
  },
  backButton: {
    padding: '10px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1.2em',
    cursor: 'pointer',
    marginTop: '20px',
  }
};

export default EditarProduto;
