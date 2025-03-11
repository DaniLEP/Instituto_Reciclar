import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import "./css/Estoque.css"; // Importando o arquivo CSS

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
  const [filtroInicio, setFiltroInicio] = useState("");
  const [filtroFim, setFiltroFim] = useState("");
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

  const resetTime = (date) => {
    date.setHours(0, 0, 0, 0); // Reseta as horas, minutos, segundos e milissegundos para 0
    return date;
  };

  // Função de filtro para buscar produtos
  const handleSearch = () => {
    const filtered = productsData.filter((item) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        String(item.sku).includes(lowerSearchTerm) || // Conversão explícita para string
        item.name.toLowerCase().includes(lowerSearchTerm) ||
        item.supplier.toLowerCase().includes(lowerSearchTerm) ||
        item.marca.toLowerCase().includes(lowerSearchTerm) ||
        (item.category?.toLowerCase().includes(lowerSearchTerm) || false) ||
        (item.tipo?.toLowerCase().includes(lowerSearchTerm) || false)
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

  const handleDateFilter = () => {
    const inicio = filtroInicio ? resetTime(new Date(filtroInicio)) : null;
    const fim = filtroFim ? resetTime(new Date(filtroFim)) : null;

    // Filtra os produtos com base nas datas de cadastro
    const filteredByDate = productsData.filter((item) => {
      const dataCadastro = resetTime(new Date(item.dateAdded));

      if (
        (!inicio || dataCadastro >= inicio) &&
        (!fim || dataCadastro <= fim)
      ) {
        return true;
      }
      return false;
    });

    setFilteredProducts(filteredByDate);
    calculateTotals(filteredByDate);
  };

  const clearDateFilter = () => {
    setFiltroInicio(""); // Limpa o filtro de início
    setFiltroFim(""); // Limpa o filtro de fim
    setFilteredProducts(productsData); // Restaura todos os produtos
    calculateTotals(productsData); // Recalcula os totais para todos os produtos
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Consulta de Estoque</h1>
      </div>

      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por SKU, nome, fornecedor, marca, categoria ou tipo"
          className="search-input"
        />
        <div className="button-container">
          <button onClick={handleSearch} className="search-button">
            Consultar
          </button>
          {isSearched && (
            <button onClick={handleBack} className="clear-button">
              Limpar
            </button>
          )}
        </div>
      </div>

      <div className="date-container">
        <p>Período de:</p>
        <input
          type="date"
          value={filtroInicio}
          onChange={(e) => setFiltroInicio(e.target.value)}
          className="date-input"
        />

        <p>Até:</p>
        <input
          type="date"
          value={filtroFim}
          onChange={(e) => setFiltroFim(e.target.value)}
          className="date-input"
        />

        <button
          onClick={handleDateFilter}
          className="date-input"
          style={{
            background:
              "linear-gradient(135deg,rgb(93, 192, 118),rgb(54, 204, 62))",
            color: "white",
          }}
        >
          Filtrar por Data
        </button>
        <button
          onClick={clearDateFilter}
          className="date-input"
          style={{
            background:
              "linear-gradient(135deg,rgb(199, 81, 81),rgb(230, 110, 110))",
            color: "white",
          }}
        >
          Limpar
        </button>
      </div>
      {isSearched && filteredProducts.length === 0 && (
        <p className="error-message">Produto não encontrado.</p>
      )}

      {filteredProducts.length > 0 && (
        <div className="text-center mt-10">
          <h3>Quantidade Total de Produtos: {totalQuantity}</h3>
          <h3>
            Valor Total no Estoque: R$ {totalPrice.toFixed(2).replace(".", ",")}
          </h3>
          <h3>
            Peso Total no Estoque: {totalPeso.toFixed(2).replace(".", ",")} KG
          </h3>
          <strong>
            <li className="text-[red]">
              Linha vermelha, indentifica produtos que já passaram da data de
              vencimento
            </li>
          </strong>
        </div>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr className="table-header">
              <th className="table-cell">SKU</th>
              <th className="table-cell">Nome</th>
              <th className="table-cell">Fornecedor</th>
              <th className="table-cell">Marca</th>
              <th className="table-cell">Categoria</th>
              <th className="table-cell">Tipo</th>
              <th className="table-cell">Peso Unitário</th>
              <th className="table-cell">Unidade de Medida</th>
              <th className="table-cell">Quantidade</th>
              <th className="table-cell">Valor Unitário</th>
              <th className="table-cell">Valor Total</th>
              <th className="table-cell">Data de Cadastro</th>
              <th className="table-cell">Data de Vencimento</th>
              <th className="table-cell">Dias para Consumo</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((item, index) => {
              const daysForConsumption = calculateConsumptionDays(
                item.dateAdded,
                item.expiryDate
              );

              const expired = isExpired(item.expiryDate);

              return (
                <tr
                  key={`${item.sku}-${index}`}
                  className={expired ? "expired" : ""}
                >
                  <td className="table-cell">{item.sku}</td>
                  <td className="table-cell">{item.name}</td>
                  <td className="table-cell">{item.supplier}</td>
                  <td className="table-cell">{item.marca}</td>
                  <td className="table-cell">{item.category || "N/A"}</td>
                  <td className="table-cell">{item.tipo || "N/A"}</td>
                  <td className="table-cell">{item.peso}</td>
                  <td className="table-cell">{item.unitmeasure}</td>
                  <td className="table-cell">{item.quantity}</td>
                  <td className="table-cell">{item.unitPrice}</td>
                  <td className="table-cell">{item.totalPrice}</td>
                  <td className="table-cell">{formatDate(item.dateAdded)}</td>
                  <td className="table-cell">{formatDate(item.expiryDate)}</td>
                  <td className="table-cell">
                    {daysForConsumption >= 0 ? daysForConsumption : 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button onClick={voltar} className="back-button">
        Voltar
      </button>
    </div>
  );
}
