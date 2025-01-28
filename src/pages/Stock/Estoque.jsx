import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.firebasestorage.app",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbProdutos = ref(db, "Estoque");

export default function Estoque  () {
  const [searchTerm, setSearchTerm] = useState("");
  const [productsData, setProductsData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPeso, setTotalPeso] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0); // Renomeado para totalPrice
  const [error, setError] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const navigate = useNavigate();

  // Buscar produtos no banco
  useEffect(() => {
    onValue(dbProdutos, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const products = Object.keys(data).map((key) => ({
          sku: key,
          ...data[key],
        }));
        setProductsData(products);
        setFilteredProducts(products); // Exibe todos os produtos inicialmente
  
        // Calcular totais ao carregar os produtos
        const totalQuantity = products.reduce(
          (acc, item) => acc + parseInt(item.quantity, 10),
          0
        );
        const totalPeso = products.reduce(
          (acc, item) => acc + parseFloat(item.peso || 0),
          0
        );
        const totalPrice = products.reduce(
          (acc, item) => {
            const itemPrice = parseFloat(item.totalPrice) || 0;
            return acc + itemPrice * itemPrice;
          },
          0
        );
  
        setTotalQuantity(totalQuantity);
        setTotalPeso(totalPeso);
        setTotalPrice(totalPrice); // Usando totalPrice calculado
      }
    });
  }, []);

  // Função para formatar data para o padrão brasileiro (DD/MM/YYYY)
  const formatDate = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("pt-BR");
  };

  // Função para calcular os dias para o consumo
  const calculateConsumptionDays = (dateAdded, expiryDate) => {
    const date1 = new Date(dateAdded);
    const date2 = new Date(expiryDate);
    const timeDifference = date2 - date1;
    const dayDifference = timeDifference / (1000 * 3600 * 24); // Converte milissegundos em dias
    return dayDifference; // Retorna o valor, mesmo que seja negativo
  };

  // Função de filtro para buscar produtos por qualquer termo
  const handleSearch = () => {
    const filtered = productsData.filter((item) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        item.sku.includes(lowerSearchTerm) ||
        item.name.toLowerCase().includes(lowerSearchTerm) ||
        item.supplier.toLowerCase().includes(lowerSearchTerm) ||
        item.marca.toLowerCase().includes(lowerSearchTerm) ||
        item.category?.toLowerCase().includes(lowerSearchTerm) ||
        item.tipo?.toLowerCase().includes(lowerSearchTerm)
      );
    });

    if (filtered.length > 0) {
      // Ordenar os produtos por nome (alfabeticamente)
      filtered.sort((a, b) => a.name.localeCompare(b.name));

      setFilteredProducts(filtered);
      setError("");

      const totalQuantity = filtered.reduce(
        (acc, item) => acc + parseInt(item.quantity, 10),
        0
      );
      setTotalQuantity(totalQuantity);

      const totalPeso = filtered.reduce(
        (acc, item) => acc + parseFloat(item.peso || 0),
        0
      );
      setTotalPeso(totalPeso);

      const totalPrice = filtered.reduce(
        (acc, item) => acc + (item.totalPrice || 0) * (item.totalPrice || 0),
        0
      );
      

      setTotalPrice(totalPrice); // Usando totalPrice
      setIsSearched(true);
    } else {
      setFilteredProducts([]);
      setError("Produto não encontrado.");
      setTotalQuantity(0);
      setTotalPrice(0); // Usando totalPrice
      setTotalPeso(0);
      setIsSearched(false);
    }
  };

  const handleBack = () => {
    setSearchTerm("");
    setFilteredProducts(productsData); // Resetando o filtro para exibir todos os produtos
    setTotalQuantity(0);
    setTotalPrice(0); // Usando totalPrice
    setTotalPeso(0);
    setError("");
    setIsSearched(false);
  };

  const voltar = () => {
    navigate("/Home");
  };

  // Função para verificar se o item está vencido ou perto de vencer
  const isExpired = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today; // Se a data de vencimento já passou, retorna true
  };

  // Estilo condicional para a linha da tabela
  const getRowStyle = (expiryDate) => {
    return isExpired(expiryDate)
      ? { backgroundColor: "red", color: "white" }
      : {};
  };

  // Estilos inline
  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    padding: "30px",
    backgroundColor: "#f4f6f9",
    margin: "0 auto",
    maxWidth: "1200px",
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "30px",
  };

  const headerTextStyle = {
    fontSize: "2.5rem",
    color: "#333",
  };

  const searchContainerStyle = {
    marginBottom: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const searchInputStyle = {
    width: "100%",
    maxWidth: "500px",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "1rem",
    marginBottom: "10px",
    boxSizing: "border-box",
  };

  const searchButtonsStyle = {
    display: "flex",
    gap: "10px",
  };

  const searchButtonStyle = {
    padding: "10px 20px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    backgroundColor: "#4CAF50",
    color: "white",
  };

  const clearButtonStyle = {
    padding: "10px 20px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#f44336",
    color: "white",
  };

  const errorMessageStyle = {
    color: "#d32f2f",
    fontSize: "1rem",
    textAlign: "center",
    marginTop: "10px",
  };

  const summaryStyle = {
    textAlign: "center",
    marginTop: "20px",
  };

  const summaryTextStyle = {
    fontSize: "1.2rem",
    color: "#333",
  };

  const tableContainerStyle = {
    overflowX: "auto",
    marginTop: "20px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #ccc",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  };

  const tableHeaderStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
  };

  const tableCellStyle = {
    padding: "12px",
    textAlign: "center",
    border: "1px solid #ddd",
  };

  const backButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "1rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={headerTextStyle}>Consulta de Estoque</h1>
      </div>
  
      <div style={searchContainerStyle}>
        <input
          type="text"
          value={searchTerm || ""} // Garante que o valor nunca seja undefined
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por SKU, nome, fornecedor, marca, categoria ou tipo"
          style={searchInputStyle}
        />
        <div style={searchButtonsStyle}>
          <button onClick={handleSearch} style={searchButtonStyle}>
            Consultar
          </button>
          {isSearched && (
            <button onClick={handleBack} style={clearButtonStyle}>
              Limpar
            </button>
          )}
        </div>
      </div>
  
      {error && <p style={errorMessageStyle}>{error}</p>}
  
      {productsData.length > 0 && (
        <div style={summaryStyle}>
          <h3 style={summaryTextStyle}>
            Quantidade Total de Produtos: {totalQuantity}
          </h3>
          <h3 style={summaryTextStyle}>
            Valor Total no Estoque: R$ {totalPrice.toFixed(2).replace(".", ",")}
          </h3>
          <h3 style={summaryTextStyle}>
            Peso Total no Estoque: {totalPeso.toFixed(2).replace(".", ",")} KG
          </h3>
        </div>
      )}
      
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={tableCellStyle}>SKU</th>
              <th style={tableCellStyle}>Nome</th>
              <th style={tableCellStyle}>Fornecedor</th>
              <th style={tableCellStyle}>Marca</th>
              <th style={tableCellStyle}>Categoria</th>
              <th style={tableCellStyle}>Tipo</th>
              <th style={tableCellStyle}>Peso Unitário</th>
              <th style={tableCellStyle}>Unidade de Medida</th>
              <th style={tableCellStyle}>Quantidade</th>
              <th style={tableCellStyle}>Valor Unitário</th>
              <th style={tableCellStyle}>Valor Total</th>
              <th style={tableCellStyle}>Data de Cadastro</th>
              <th style={tableCellStyle}>Data de Vencimento</th>
              <th style={tableCellStyle}>Dias para Consumo</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((item, index) => {
              const daysForConsumption = calculateConsumptionDays(
                item.dateAdded,
                item.expiryDate
              );
              return (
                <tr
                  key={`${item.sku}-${index}`}
                  style={getRowStyle(item.expiryDate)}
                >
                  <td style={tableCellStyle}>{item.sku}</td>
                  <td style={tableCellStyle}>{item.name}</td>
                  <td style={tableCellStyle}>{item.supplier}</td>
                  <td style={tableCellStyle}>{item.marca}</td>
                  <td style={tableCellStyle}>{item.category || "N/A"}</td>
                  <td style={tableCellStyle}>{item.tipo || "N/A"}</td>
                  <td style={tableCellStyle}>{item.peso}</td>
                  <td style={tableCellStyle}>{item.unitMeasure}</td>
                  <td style={tableCellStyle}>{item.quantity}</td>
                  <td style={tableCellStyle}>
                      {item.unitPrice}
                  </td>
                  <td style={tableCellStyle}>{item.totalPrice}</td>
                  <td style={tableCellStyle}>
                    {formatDate(item.dateAdded)}
                  </td>
                  <td style={tableCellStyle}>{formatDate(item.expiryDate)}</td>
                  <td style={tableCellStyle}>
                    {daysForConsumption >= 0 ? daysForConsumption : 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
  
      <button onClick={voltar} style={backButtonStyle}>
        Voltar
      </button>
    </div>
  )
};