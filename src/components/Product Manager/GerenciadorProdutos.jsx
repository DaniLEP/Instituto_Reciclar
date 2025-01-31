import { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, onValue } from "firebase/database";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import debounce from 'lodash.debounce'; // Certifique-se que está aqui
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
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 20px;
  background: linear-gradient(135deg, #F20DE7, #D90DD0);
  color: #fff;
  text-decoration: none;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  width: fit-content;
  margin: 20px auto;

  &:hover {
    background: linear-gradient(135deg, #D90DD0, #B508BD);
    transform: scale(1.05);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 18px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px 16px;
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
  overflow-x: auto;
  margin-top: 20px;
`;

const ResponsiveTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* Sombra suave na tabela */
  border-radius: 8px; /* Bordas arredondadas */
  background-color: #fff; /* Cor de fundo para a tabela */

  thead {
    background-color: #007bff;
    color: white;

    th {
      padding: 15px 20px;
      text-align: center;
      font-weight: bold;
      border-bottom: 2px solid #ddd;
    }
  }

  tbody {
    background-color: #f8f8f8;
    
    td {
      padding: 15px 20px;
      text-align: center;
      border: 1px solid #ddd;
      word-wrap: break-word;
      font-size: 14px; /* Ajuste no tamanho da fonte */
      transition: background-color 0.3s ease; /* Efeito suave ao passar o mouse */
    }

    td:hover {
      background-color: #f1f1f1; /* Destaca a célula ao passar o mouse */
    }
  }

  /* Responsividade */
  @media (max-width: 768px) {
    font-size: 14px;

    thead {
      display: none; /* Esconde os cabeçalhos da tabela */
    }

    tbody {
      display: block;
    }

    tbody td {
      display: block;
      padding: 12px 10px;
      text-align: left;
      position: relative;
      border: none;
      background-color: #fff;
      border-radius: 4px;
      margin-bottom: 10px; /* Espaço entre as linhas */
    }

    tbody td:before {
      content: attr(data-label); /* Exibe o nome da coluna como rótulo */
      font-weight: bold;
      text-transform: uppercase;
      display: block;
      margin-bottom: 5px;
      color: #555;
    }

    tbody tr {
      margin-bottom: 10px;
      display: block;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra suave nas linhas */
    }
  }

  /* Ajuste para telas menores */
  @media (max-width: 480px) {
    font-size: 12px;

    td {
      padding: 10px;
    }

    tbody td:before {
      font-size: 12px; /* Tamanho da fonte menor */
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

const SearchWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 90%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  text-align: center;
`;

const tableContainerStyle = {
  overflowX: "auto",
  marginTop: "20px",
};


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
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Indicador de carregamento
  const db = getDatabase();

  useEffect(() => {
    const dbRef = ref(db, "EntradaProdutos");
    onValue(dbRef, (snapshot) => {
      setLoading(false);
      const data = snapshot.val();
      if (data) {
        const loadedProducts = Object.keys(data).map((key) => ({ ...data[key], id: key }));
        setProducts(loadedProducts);
      }
    });
  }, [db]);

  // Função de debouncing para a busca
  const handleSearchChange = debounce((value) => {
    setSearchTerm(value);
  }, 500);

  const filteredProducts = products.filter((product) => {
    return (
      (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.supplier && product.supplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.tipo && product.tipo.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

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
      update(productRef, {
        ...editingProduct,
      })
        .then(() => {
          const dbRef = ref(db, "EntradaProdutos");
          onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const loadedProducts = Object.keys(data).map((key) => ({ ...data[key], id: key }));
              setProducts(loadedProducts);
            }
          });
          toast.success("Produto atualizado com sucesso!");
          closeModal();
        })
        .catch((error) => {
          toast.error("Erro ao atualizar: " + error.message);
        });
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
      <SearchWrapper>
      <SearchInput
        type="text"
        placeholder="Filtrar por SKU, Nome, Fornecedor, Categoria ou Tipo..."
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      </SearchWrapper>
      <BackButton to="/Cadastro">Voltar</BackButton>
      {loading ? (
        <div style={{ textAlign: "center", color: "#fff", fontSize: "18px" }}>
          Carregando produtos...
        </div>
      ) : (
        <div style={tableContainerStyle}>
        <TableWrapper>
          <ResponsiveTable>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Produto</th>
                <th>Fornecedor</th>
                <th>Tipo</th>
                <th>Grupo</th>
                <th>Peso (KG)</th>
                <th>Unidade de Medida</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.sku}</td>
                  <td>{product.name}</td>
                  <td>{product.supplier}</td>
                  <td>{product.tipo}</td>
                  <td>{product.category}</td>
                  <td>{product.peso} {product.unitMeasure}</td>
                  <td>{product.unit}</td>
                  <td>
                    <Button onClick={() => openModal(product)}>Editar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </ResponsiveTable>
        </TableWrapper>
        </div>
      )}

      {isModalOpen && (
        <>
          <Overlay onClick={closeModal} />
          <Modal>
            <h2 style={{ textAlign: 'center', fontSize: '20px' }}>Atualizar Produto</h2>
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
            <label>Peso:</label>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
              <input
                type="number"
                name="peso"
                value={editingProduct.peso  || ""}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
                placeholder="Digite o peso"
              />
              <select
              name="unitMeasure"
              value={editingProduct.unitMeasure || ""}
              onChange={handleInputChange}
              style={{
                width: "100%",
                display: 'flex',
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                marginBottom: "15px",
                fontSize: "1rem",
              }}
            >
              <option value="g">Gramas</option>
              <option value="kg">Quilos</option>
              <option value="L">Litros</option>
              <option value="ml">Mili-Litros</option>
            </select>
            </div>
            <label>Unidade de Medida:</label>
             <select
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
            >
               <option value="un">Unidade</option>
            <option value="fd">Fardo</option>
            <option value="cx">Caixa</option>
            </select>
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
