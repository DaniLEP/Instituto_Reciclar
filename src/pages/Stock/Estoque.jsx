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

export default function Estoque() {
  const [searchTerm, setSearchTerm] = useState("");
  const [productsData, setProductsData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPeso, setTotalPeso] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
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
        calculateTotals(products);
      }
    });
  }, []);

  // Função para calcular totais
  const calculateTotals = (products) => {
    const totalQuantity = products.reduce(
      (acc, item) => acc + parseInt(item.quantity, 10),
      0
    );
    const totalPeso = products.reduce(
      (acc, item) => acc + parseFloat(item.peso || 0),
      0
    );
    const totalPrice = products.reduce((acc, item) => {
      const itemPrice = parseFloat(item.totalPrice) || 0;
      return acc + itemPrice;
    }, 0);

    setTotalQuantity(totalQuantity);
    setTotalPeso(totalPeso);
    setTotalPrice(totalPrice);
  };

  // Função de filtro para buscar produtos
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
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      setFilteredProducts(filtered);
      setIsSearched(true);
      calculateTotals(filtered);
    } else {
      setFilteredProducts([]);
      setIsSearched(false);
      setTotalQuantity(0);
      setTotalPeso(0);
      setTotalPrice(0);
    }
  };

  const handleBack = () => {
    setSearchTerm("");
    setFilteredProducts(productsData); // Resetando o filtro
    setIsSearched(false);
    calculateTotals(productsData);
  };

  const voltar = () => {
    navigate("/Home");
  };

  // Função para calcular os dias para o consumo
  const calculateConsumptionDays = (dateAdded, expiryDate) => {
    const today = new Date();
    const addedDate = new Date(dateAdded);
    const expirationDate = new Date(expiryDate);

    const timeToExpiry = expirationDate - today;
    const daysToExpiry = Math.floor(timeToExpiry / (1000 * 60 * 60 * 24));

    return daysToExpiry;
  };

  // Função para formatar datas
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;
  };

  // Função para verificar se o produto está vencido
  const isExpired = (expiryDate) => {
    const today = new Date();
    const expirationDate = new Date(expiryDate);
    return expirationDate < today;
  };

  // Estilo inline simplificado
  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    padding: "30px",
    backgroundColor: "#f4f6f9",
    margin: "0 auto",
    maxWidth: "1200px",
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
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#333" }}>Consulta de Estoque</h1>
      </div>

      <div style={searchContainerStyle}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por SKU, nome, fornecedor, marca, categoria ou tipo"
          style={searchInputStyle}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleSearch}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Consultar
          </button>
          {isSearched && (
            <button
              onClick={handleBack}
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {isSearched && filteredProducts.length === 0 && (
        <p style={{ color: "red", textAlign: "center" }}>Produto não encontrado.</p>
      )}

      {filteredProducts.length > 0 && (
        <div style={{ marginBottom: "30px", textAlign: 'center', fontFamily: 'Chakra-Petch', fontSize: '20px' }}>
          <h3>
            Quantidade Total de Produtos: {totalQuantity}
          </h3>
          <h3>
            Valor Total no Estoque: R$ {totalPrice.toFixed(2).replace(".", ",")}
          </h3>
          <h3>
            Peso Total no Estoque: {totalPeso.toFixed(2).replace(".", ",")} KG
          </h3>
          <strong><li style={{color: 'red'}}>Linha vermelha, indentifica produtos que já passaram da data de vencimento</li></strong>
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
                  style={{
                    backgroundColor: isExpired(item.expiryDate) ? "red" : "",
                    color: isExpired(item.expiryDate) ? "white" : "",
                  }}
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
                  <td style={tableCellStyle}>{item.unitPrice}</td>
                  <td style={tableCellStyle}>{item.totalPrice}</td>
                  <td style={tableCellStyle}>{formatDate(item.dateAdded)}</td>
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
  );
}
