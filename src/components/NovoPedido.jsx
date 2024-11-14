// import { useState} from 'react';
// import { Link } from 'react-router-dom';

// const ShoppingListPage = () => {
//   const [sku, setSku] = useState('');
//   const [product, setProduct] = useState('');
//   const [supplier, setSupplier] = useState('');
//   const [quantity, setQuantity] = useState(1);
//   const [categoria, setCategoria] = useState('');
//   const [notes, setNotes] = useState('');
//   const [shoppingList, setShoppingList] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(null);

//   // Função para adicionar ou editar um produto
//   const handleAddOrEditProduct = () => {
//     const newItem = { sku, product, supplier, quantity, categoria, notes };

//     if (isEditing) {
//       // Atualiza o item existente na lista
//       const updatedList = shoppingList.map((item, index) =>
//         index === currentIndex ? newItem : item
//       );
//       setShoppingList(updatedList);
//       setIsEditing(false);
//       setCurrentIndex(null);
//     } else {
//       // Adiciona um novo item à lista
//       setShoppingList([...shoppingList, newItem]);
//     }

//     // Limpa os campos após adicionar/editar
//     resetFields();
//   };

//   // Função para remover um produto
//   const handleRemoveProduct = (index) => {
//     const updatedList = shoppingList.filter((_, i) => i !== index);
//     setShoppingList(updatedList);
//   };

//   // Função para iniciar a edição de um produto
//   const handleEditProduct = (index) => {
//     const item = shoppingList[index];
//     setSku(item.sku);
//     setProduct(item.product);
//     setSupplier(item.supplier);
//     setQuantity(item.quantity);
//     setCategoria(item.categoria);
//     setNotes(item.notes);
//     setIsEditing(true);
//     setCurrentIndex(index);
//   };

//   // Função para resetar os campos do formulário
//   const resetFields = () => {
//     setSku('');
//     setProduct('');
//     setSupplier('');
//     setQuantity(1);
//     setCategoria(1);
//     setNotes('');
//   };

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.title}>Novo Pedido</h1>
//       <div style={styles.formContainer}>
//         {/* Formulário para adicionar ou editar produtos */}
//         <div style={styles.form}>
//           <input
//             type="text"
//             placeholder="Sku"
//             value={sku}
//             onChange={(e) => setSku(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             type="text"
//             placeholder="Produto"
//             value={product}
//             onChange={(e) => setProduct(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             type="text"
//             placeholder="Fornecedor"
//             value={supplier}
//             onChange={(e) => setSupplier(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             type="number"
//             placeholder="Quantidade"
//             value={quantity}
//             onChange={(e) => setQuantity(Number(e.target.value))}
//             min="1"
//             style={styles.input}
//           />
//             <input
//             type="text"
//             placeholder="Categoria"
//             value={categoria}
//             onChange={(e) => setCategoria(e.target.value)}
//             min="1"
//             style={styles.input}          
//           />
//           <input
//             type="text"
//             placeholder="Observações"
//             value={notes}
//             onChange={(e) => setNotes(e.target.value)}
//             style={styles.input}
//           />
//           <button onClick={handleAddOrEditProduct} style={styles.button}>
//             {isEditing ? 'Salvar Alterações' : 'Adicionar Produto'}
//           </button>
//         </div>

//         {/* Exibindo a lista de produtos */}
//         <h2 style={styles.productListTitle}>Produtos Adicionados</h2>
//         {shoppingList.length === 0 ? (
//           <p style={styles.emptyMessage}>Nenhum produto adicionado.</p>
//         ) : (
//           <div style={styles.tableContainer}>
//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   {['Sku', 'Produto', 'Fornecedor',  'Observações', 'Categoria', 'Ações'].map((header) => (
//                     <th key={header} style={styles.tableHeader}>{header}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {shoppingList.map((item, index) => (
//                   <tr key={index}>
//                     <td style={styles.tableData}>{item.sku}</td>
//                     <td style={styles.tableData}>{item.product}</td>
//                     <td style={styles.tableData}>{item.supplier}</td>
//                     <td style={styles.tableData}>{item.quantity}</td>
//                     <td style={styles.tableData}>{item.categoria}</td>
//                     <td style={styles.tableData}>{item.notes}</td>
//                     <td style={styles.tableData}>
//                       <button onClick={() => handleEditProduct(index)} style={styles.actionButton}>Editar</button>
//                       <button onClick={() => handleRemoveProduct(index)} style={styles.actionButton}>Remover</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//       <Link to={'/Pedidos'}>
//         <button type="button" id="return" style={styles.returnButton}>Voltar</button>
//       </Link>
//       <style >{`
//         #return:hover img {
//           transform: scale(1.1);
//         }
        
//         @media (max-width: 768px) {
//           #return {
//             top: 15vh; /* Ajusta a posição do botão de voltar em telas menores */
//             right: 5vh;
//           }

//           h1 {
//             font-size: 2rem;
//           }

//           h2 {
//             font-size: 1.5rem;
//           }

//           table {
//             font-size: 0.8rem; /* Ajusta o tamanho da fonte da tabela em telas menores */
//           }

//           input, button {
//             font-size: 14px; /* Ajusta o tamanho da fonte dos inputs e botões em telas menores */
//           }
//         }
        
//         @media (max-width: 480px) {
//           input {
//             flex: 1 1 100%; /* Faz os inputs ocuparem toda a largura da tela em dispositivos muito pequenos */
//           }

//           button {
//             width: 100%; /* Faz o botão ocupar toda a largura da tela em dispositivos muito pequenos */
//           }

//             returnButton: {
//             padding: "12px 20px",
//             position: "relative",
//             right: "-1%",
//             top: "1vh",
//             background: "#F20DE7",
//             color: "#fff",
//             borderRadius: "12px",
//             cursor: "pointer",
//             border: "none",
//             transition: "background-color 0.3s ease",
//             whiteSpace: "nowrap"
//           }

//         }
//       `}</style>
//     </div>
//   );
// };

// // Estilos do componente
// const styles = {
//   container: {
//     background: "#00009c",
//     padding: '20px',
//     color: "white",
//     minHeight: '100vh'
//   },
//   title: {
//     textAlign: "center",
//     fontSize: "2.5rem",
//     fontWeight: "bold"
//   },
//   formContainer: {
//     maxWidth: "1100px",
//     margin: "0 auto",
//     backgroundColor: "#fff",
//     padding: "20px",
//     borderRadius: "8px",
//     color: "black",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//     overflowX: "auto"
//   },
//   form: {
//     marginBottom: '20px',
//     display: 'flex',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     gap: '10px'
//   },
//   input: {
//     flex: "1 1 20%",
//     padding: "10px",
//     border: "1px solid rgb(115 113 113)",
//     borderRadius: "12px",
//     fontSize: "16px"
//   },
//   button: {
//     padding: "12px 20px",
//     background: "#F20DE7",
//     color: "#fff",
//     borderRadius: "12px",
//     cursor: "pointer",
//     border: "none",
//     transition: "background-color 0.3s ease",
//     whiteSpace: "nowrap"
//   },
//   productListTitle: {
//     textAlign: 'center',
//     fontSize: '20px'
//   },
//   emptyMessage: {
//     textAlign: "center"
//   },
//   tableContainer: {
//     overflowX: 'auto'
//   },
//   table: {
//     marginTop: "5vh",
//     width: '100%',
//     backgroundColor: "#00009C",
//     color: "#fff",
//     borderCollapse: "collapse",
//     textAlign: "center"
//   },
//   tableHeader: {
//     padding: "10px",
//     borderBottom: "1px solid #ddd"
//   },
//   tableData: {
//     padding: "10px",
//     borderBottom: "1px solid #ddd"
//   },
//   actionButton: {
//     marginRight: '10px'
//   },
//   returnButton: {
//     padding: "12px 20px",
//     position: "relative",
//     right: "-8%",
//     top: "1vh",
//     background: "#F20DE7",
//     color: "#fff",
//     borderRadius: "12px",
//     cursor: "pointer",
//     border: "none",
//     transition: "background-color 0.3s ease",
//     whiteSpace: "nowrap"
//   },
// };

// export default ShoppingListPage;


import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

const NovoPedido = () => {
  const [sku, setSku] = useState('');
  const [product, setProduct] = useState('');
  const [supplier, setSupplier] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [categoria, setCategoria] = useState('');
  const [notes, setNotes] = useState('');
  const [shoppingList, setShoppingList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const handleAddOrEditProduct = () => {
    const newItem = { sku, product, supplier, quantity, categoria, notes };

    if (isEditing) {
      const updatedList = shoppingList.map((item, index) =>
        index === currentIndex ? newItem : item
      );
      setShoppingList(updatedList);
      setIsEditing(false);
      setCurrentIndex(null);
    } else {
      setShoppingList([...shoppingList, newItem]);
    }
    resetFields();
  };

  const handleRemoveProduct = (index) => {
    const updatedList = shoppingList.filter((_, i) => i !== index);
    setShoppingList(updatedList);
  };

  const handleEditProduct = (index) => {
    const item = shoppingList[index];
    setSku(item.sku);
    setProduct(item.product);
    setSupplier(item.supplier);
    setQuantity(item.quantity);
    setCategoria(item.categoria);
    setNotes(item.notes);
    setIsEditing(true);
    setCurrentIndex(index);
  };

  const resetFields = () => {
    setSku('');
    setProduct('');
    setSupplier('');
    setQuantity(1);
    setCategoria('');
    setNotes('');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(shoppingList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Compras');
    XLSX.writeFile(workbook, 'Lista_de_Compras.xlsx');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Novo Pedido</h1>
      <div style={styles.formContainer}>
        <div style={styles.form}>
          <input
            type="text"
            placeholder="Sku"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Produto"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Fornecedor"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={styles.input}          
          />
          <input
            type="text"
            placeholder="Observações"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleAddOrEditProduct} style={styles.button}>
            {isEditing ? 'Salvar Alterações' : 'Adicionar Produto'}
          </button>
        </div>

        <h2 style={styles.productListTitle}>Produtos Adicionados</h2>
        {shoppingList.length === 0 ? (
          <p style={styles.emptyMessage}>Nenhum produto adicionado.</p>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Sku', 'Produto', 'Fornecedor', 'Quantidade', 'Categoria', 'Observações', 'Ações'].map((header) => (
                    <th key={header} style={styles.tableHeader}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shoppingList.map((item, index) => (
                  <tr key={index}>
                    <td style={styles.tableData}>{item.sku}</td>
                    <td style={styles.tableData}>{item.product}</td>
                    <td style={styles.tableData}>{item.supplier}</td>
                    <td style={styles.tableData}>{item.quantity}</td>
                    <td style={styles.tableData}>{item.categoria}</td>
                    <td style={styles.tableData}>{item.notes}</td>
                    <td style={styles.tableData}>
                      <button onClick={() => handleEditProduct(index)} style={styles.actionButton}>Editar</button>
                      <button onClick={() => handleRemoveProduct(index)} style={styles.actionButton}>Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <button onClick={exportToExcel} style={styles.exportButton}>Exportar para Excel</button>
      <Link to={'/Pedidos'}>
        <button type="button" id="return" style={styles.returnButton}>Voltar</button>
      </Link>
    </div>
  );
};

// Estilos do componente
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: "#00009c",
    padding: '20px',
    color: "white",
    minHeight: '100vh'
  },
  title: {
    textAlign: "center",
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "20px"
  },
  formContainer: {
    width: "100%",
    maxWidth: "900px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    color: "black",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px"
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '10px'
  },
  input: {
    flex: "1 1 calc(50% - 20px)",
    minWidth: "250px",
    padding: "10px",
    border: "1px solid rgb(115 113 113)",
    borderRadius: "12px",
    fontSize: "16px"
  },
  button: {
    width: "100%",
    padding: "12px 20px",
    background: "#F20DE7",
    color: "#fff",
    borderRadius: "12px",
    cursor: "pointer",
    border: "none",
    marginTop: "10px"
  },
  productListTitle: {
    textAlign: 'center',
    fontSize: '20px',
    marginTop: "20px"
  },
  emptyMessage: {
    textAlign: "center"
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    marginTop: "20px",
    width: '100%',
    backgroundColor: "white",
    color: "black",
    borderCollapse: "collapse",
    textAlign: "center"
  },
  tableHeader: {
    padding: "10px",
    borderBottom: "1px solid #F20DE7",
    background: "#F20DE7",
    color: "white"
  },
  tableData: {
    padding: "10px",
    borderBottom: "1px solid #ddd"
  },
  actionButton: {
    marginRight: '10px',
    background: '#00009c',
    color: 'white',
    padding: '10px',
    borderRadius: '10%'
  },
  returnButton: {
    padding: "12px 20px",
    background: "#F20DE7",
    color: "#fff",
    borderRadius: "12px",
    cursor: "pointer",
    border: "none",
    marginTop: "20px"
  },
  exportButton: {
    padding: '10px 20px',
    background: "#00DD62",
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default NovoPedido;
