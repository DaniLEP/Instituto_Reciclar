import { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, onValue } from "firebase/database";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Estilos Globais
const GlobalStyle = createGlobalStyle`
  body {
  background: linear-gradient(135deg, rgb(140, 78, 207), rgb(168, 55, 212));
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    color: #333;
  }
`;

// Estilização dos Componentes
const BackButton = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  img {
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
`;

const Button = styled.button`
  padding: 12px;
  background: #F20DE7;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  text-align: center;

  &:hover {
    background: rgb(167, 104, 192);
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px;
  }
`;



const CloseButton = styled(Button)`
margin-top: 10px;
  background: #dc3545;

  &:hover {
    background: #b02a37;
  }
`;





const Modal = styled.div`
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  width: 90%;
  max-width: 500px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto; /* Permite rolagem horizontal em telas pequenas */
  margin-top: 20px;
`;

const ResponsiveTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
  
  thead {
    background-color: #007bff;

    th {
      padding: 12px;
      color: white;
      text-align: center;
      font-weight: bold;
    }
  }

  tbody {
    background-color:rgb(248, 248, 248);

    }

    td {
      padding: 12px;
      border: 1px solid #ddd;
      text-align: center;
      word-wrap: break-word; /* Evita que textos longos quebrem a tabela */
    }
  }

  @media (max-width: 1024px) {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    font-size: 12px;

    thead th {
      padding: 8px;
    }

    tbody td {
      padding: 8px;
    }

    /* Reduzir o tamanho das colunas na versão mobile */
    th, td {
      padding: 8px;
    }
  }

  @media (max-width: 480px) {
    font-size: 10px;
    
    th, td {
      padding: 6px;
    }

    /* Transformar a tabela em lista de itens em dispositivos muito pequenos */
    tbody tr {
      display: block;
      margin-bottom: 10px;
      background: #fff;
    }

    tbody td {
      display: block;
      text-align: left;
      padding: 8px 10px;
      width: 100%;
    }

    tbody td::before {
      content: attr(data-label);
      font-weight: bold;
      display: inline-block;
      width: 100%;
      text-transform: capitalize;
    }
  }
`;


const Title = styled.h1`
  text-align: center;
  font-size: 50px;
  font-weight: bold;
  color: white;
  margin-bottom: 15px;
`;

// Firebase Configuração
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.firebasestorage.app",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
};

initializeApp(firebaseConfig);

function Gerenciador() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const db = getDatabase();

  
  useEffect(() => {
    const dbRef = ref(db, "EntradaProdutos");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedProducts = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
  
        // Ordena os produtos pela propriedade 'name' em ordem alfabética
        loadedProducts.sort((a, b) => a.name.localeCompare(b.name));
  
        setProducts(loadedProducts);
      }
    });
  }, [db]);

  const openModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const handleUpdate = () => {
    if (editingProduct) {
      const productRef = ref(db, `EntradaProdutos/${editingProduct.id}`);
      update(productRef, editingProduct)
        .then(() => {
          toast.success("Produto atualizado com sucesso!");
          closeModal();
        })
        .catch((error) => toast.error("Erro ao atualizar: " + error.message));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  return (
    <>
      <GlobalStyle />
      <ToastContainer />
      <Title>Cadastro de Produtos</Title>

        <BackButton to="/Cadastro">
          <img src="/return.svg" alt="Voltar" />
        </BackButton>
        <TableWrapper>
  <ResponsiveTable>
    <thead>
      <tr>
        <th>SKU</th>
        <th>Nome</th>
        <th>Marca</th>
        <th>Fornecedor</th>
        <th>Peso (KG)</th>
        <th>Unidade de Medida</th>
        <th>Categoria</th>
        <th>Tipo</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      {products.map((product) => (
        <tr key={product.id}>
          <td data-label="SKU">{product.sku}</td>
          <td data-label="Nome">{product.name}</td>
          <td data-label="Marca">{product.marca}</td>
          <td data-label="Fornecedor">{product.supplier}</td>
          <td data-label="Peso (KG)">{product.peso}</td>
          <td data-label="Unidade de Medida">{product.unit}</td>
          <td data-label="Categoria">{product.category}</td>
          <td data-label="Tipo">{product.tipo}</td>
          <td>
            <Button onClick={() => openModal(product)}>Editar</Button>
          </td>
        </tr>
      ))}
    </tbody>
  </ResponsiveTable>
</TableWrapper>

      {isModalOpen && (
        <>
          <Overlay onClick={closeModal} />
          <Modal>
             <h2 style={{textAlign: 'center', fontSize: '20px'}}>Atualizar Produto</h2>
             <label>Nome:</label>
             <input
              type="text"
              name="name"
              value={editingProduct.name || ""}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                marginBottom: "15px",
                fontSize: "1rem",
              }}
            />
            <label>Marca:</label>
            <input
              type="text"
              name="marca"
              value={editingProduct.marca || ""}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                marginBottom: "15px",
                fontSize: "1rem",
              }}
            />
            <label>Fornecedor:</label>
            <input
              type="text"
              name="supplier"
              value={editingProduct.supplier || ""}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                marginBottom: "15px",
                fontSize: "1rem",
              }}
            />
            <label>Peso(KG):</label>
            <input
              type="text"
              name="peso"
              value={editingProduct.peso || ""}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                marginBottom: "15px",
                fontSize: "1rem",
              }}
            />
            <label>Unidade de Medida:</label>
            <input
              type="text"
              name="unit"
              value={editingProduct.unit || ""}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                marginBottom: "15px",
                fontSize: "1rem",
              }}
            />
           
            <label>Categoria:</label>
            <select
              name="category"
              value={editingProduct.category || ""}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                marginBottom: "15px",
                fontSize: "1rem",
              }}
            >
              <option value="Proteína">Proteína</option>
              <option value="Mantimento">Mantimento</option>
              <option value="Hortaliças">Hortaliças</option>
              <option value="Doações">Doações</option>
            </select>

            <label>Tipo:</label>
            <select
              name="tipo"
              value={editingProduct.tipo || ""}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                marginBottom: "15px",
                fontSize: "1rem",
              }}
            >
              <option value="Frutas">Frutas</option>
              <option value="Legumes">Legumes</option>
              <option value="Verduras">Verduras</option>
              <option value="Bovina">Bovina</option>              
              <option value="Ave">Ave</option>
              <option value="Suína">Suína</option>
              <option value="Pescado">Pescado</option>
              <option value="Mercado">Mercado</option>

            </select>
            <Button onClick={handleUpdate}>Atualizar</Button>
            <CloseButton onClick={closeModal}>Fechar</CloseButton>
          </Modal>
        </>
      )}
    </>
  );
}

export default Gerenciador;
