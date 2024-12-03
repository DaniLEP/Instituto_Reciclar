import { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, onValue } from "firebase/database";
import { Link } from "react-router-dom";

// Estilos globais
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #00009C;
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    color: black;
  }
`;

// Estilos para os componentes
const Container = styled.div`
  max-width: 1400px;
  margin: 50px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 20px;
    margin: 20px;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  color: #00009c;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    font-size: 0.9rem;
  }

  th {
    background-color: #00009c;
    color: white;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    overflow-x: auto;
    display: block;
    width: 100%;
  }
`;

const Modal = styled.div`
  position: relative;
  top: 7vh;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  width: 90%;
  max-width: 500px;

  h2 {
    margin-bottom: 20px;
    text-align: center;
    color: black;
    font-size: 30px;
  }

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 8px;
  }

  input,
  select {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;

    &:focus {
      border-color: #00009c;
      outline: none;
    }
  }

  button {
    width: 100%;
    margin-top: 10px;
    gap: 10px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
`;
const Button = styled.button`
  padding: 10px 15px;
  background: #f20de7;
  color: #fff;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  @media (max-width: 490px) {
    width: 100%; 
    margin-bottom: 10px;
  }

  &:hover {
    background-color: #d10ccf;
  }
`;

const CloseButton = styled(Button)`
  background: #ff4d4f;
  margin-top: 10px;

  @media (max-width: 490px) {
    background: #ff4d4f;
    margin-top: 10px;
    margin-left: 0;
    margin-right: 0;
    display: block;
    margin: 10px auto;
    width: 100%;
  }

  &:hover {
    background-color: #e33c3e;
  }
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 55px;
  left: 35px;
  background: none;
  border: none;
  cursor: pointer;

  img {
    width: 40px;
    height: 40px;

    @media (max-width: 498px) {
      width: 30px;
      height: 30px;
    }
  }
`;

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.firebasestorage.app",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function Gerenciador() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const dbProdutos = ref(db, "EntradaProdutos");
    onValue(dbProdutos, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedProducts = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
        setProducts(loadedProducts);
      }
    });
  }, []);

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
          alert("Produto atualizado com sucesso!");
          closeModal();
        })
        .catch((error) =>
          alert("Erro ao atualizar o produto: " + error.message)
        );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "unitPrice") {
      // Remover o formato de moeda (R$) e manter apenas o número
      const numericValue = value.replace(/[^\d,]/g, "").replace(",", ".");
      setEditingProduct({
        ...editingProduct,
        [name]: parseFloat(numericValue),
      });
    } else {
      setEditingProduct({ ...editingProduct, [name]: value });
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <BackButton to="/Cadastro">
          <img src="/return.svg" alt="Voltar" />
        </BackButton>
        <Title>Produtos Cadastrados</Title>
        <Table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Nome</th>
              <th>Marca</th>
              <th>Fornecedor</th>
              <th>Unidade de Medida</th>
              <th>Data Cadastrada</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.sku}</td>
                <td>{product.name}</td>
                <td>{product.marca}</td>
                <td>{product.supplier}</td>
                <td>{product.unit}</td>
                <td>{product.dateAdded}</td>
                <td>{product.category}</td>
                <td>
                  <Button onClick={() => openModal(product)}>Alterar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      {isModalOpen && (
        <>
          <Overlay onClick={closeModal} />
          <Modal>
            <h2>Editar Produto</h2>
            <label>Nome:</label>
            <input
              type="text"
              name="name"
              value={editingProduct.name || ""}
              onChange={handleInputChange}
            />
            <label>Marca:</label>
            <input
              type="text"
              name="marca"
              value={editingProduct.marca || ""}
              onChange={handleInputChange}
            />
            <label>Fornecedor:</label>
            <input
              type="text"
              name="supplier"
              value={editingProduct.supplier || ""}
              onChange={handleInputChange}
            />
            <label>Unidade de Medida:</label>
            <input
              type="text"
              name="unit"
              value={editingProduct.unit || ""}
              onChange={handleInputChange}
            />
           
            <label>Categoria:</label>
            <select
              name="category"
              value={editingProduct.category || ""}
              onChange={handleInputChange}
            >
              <option value="Proteína">Proteína</option>
              <option value="Mantimento">Mantimento</option>
              <option value="Hortaliças">Hortaliças</option>
              <option value="Doações">Doações</option>
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
