import { useState, useEffect } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx"; // Importando a biblioteca para exportação Excel
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
  const [valorEditado, setValorEditado] = useState("");
  const [editando, setEditando] = useState(null);
  const navigate = useNavigate();

  // Carregar produtos do Firebase
  useEffect(() => {
    const unsubscribe = onValue(dbProdutos, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const products = Object.keys(data).map((key) => ({
          sku: key,
          ...data[key],
        }));
        setProductsData(products);
        setFilteredProducts(products); // Inicializa a lista de produtos filtrados com todos os dados
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    calculateTotals(filteredProducts);
  }, [filteredProducts]);

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
    date.setHours(0, 0, 0, 0);
    return date;
  };

  // Função de filtro para buscar produtos
  const handleSearch = () => {
    const filtered = productsData.filter((item) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      if (!isNaN(searchTerm) && searchTerm.trim() !== "") {
        return String(item.sku) === searchTerm.trim();
      }
      return (
        item.name.toLowerCase().includes(lowerSearchTerm) ||
        item.supplier.toLowerCase().includes(lowerSearchTerm) ||
        item.marca.toLowerCase().includes(lowerSearchTerm) ||
        item.category?.toLowerCase().includes(lowerSearchTerm) ||
        item.tipo?.toLowerCase().includes(lowerSearchTerm)
      );
    });

    setFilteredProducts(filtered.length > 0 ? filtered : []);
  };

  const handleBack = () => {
    setSearchTerm("");
    setFilteredProducts(productsData); // Restaurando todos os produtos
    setIsSearched(false);
    setFiltroInicio(""); // Limpando o filtro de data
    setFiltroFim(""); // Limpando o filtro de data
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
    if (!expiryDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expirationDate = new Date(expiryDate);
    expirationDate.setHours(0, 0, 0, 0);
    return expirationDate < today;
  };

  const handleDateFilter = () => {
    const inicio = filtroInicio ? new Date(filtroInicio) : null;
    const fim = filtroFim ? new Date(filtroFim) : null;

    // Verifique se as datas são válidas
    if (inicio && isNaN(inicio)) {
      console.error("Data de início inválida");
      return;
    }
    if (fim && isNaN(fim)) {
      console.error("Data de fim inválida");
      return;
    }

    // Filtrando os produtos com base nas datas
    const filteredByDate = productsData.filter((item) => {
      const dataCadastro = new Date(item.dateAdded); // Convertendo para Date

      // Verifique se a data de cadastro do item é válida
      if (isNaN(dataCadastro)) {
        console.error(`Data inválida para o produto ${item.sku}`);
        return false;
      }

      // Comparando as datas corretamente
      const isAfterStartDate = !inicio || dataCadastro >= inicio;
      const isBeforeEndDate = !fim || dataCadastro <= fim;

      return isAfterStartDate && isBeforeEndDate;
    });

    setFilteredProducts(filteredByDate);
    calculateTotals(filteredByDate);
  };

  const clearDateFilter = () => {
    setFiltroInicio("");
    setFiltroFim("");
    setFilteredProducts(productsData); // Restaurando todos os produtos
    calculateTotals(productsData); // Recalcula os totais
  };

  const handleDoubleClick = (sku, value) => {
    setEditando(sku); // Identifica qual produto está sendo editado
    setValorEditado(value ? value.slice(0, 10) : ""); // Garantir que o valor tenha o formato 'YYYY-MM-DD'
  };

  // Função para tratar a mudança no campo de data
  const handleChange = (e) => {
    setValorEditado(e.target.value); // Atualiza o valor editado com o que foi digitado
  };

  const handleSave = (sku) => {
    if (!valorEditado) return; // Não salva se o valor estiver vazio

    const formattedDate = new Date(valorEditado).toISOString().split("T")[0]; // Formata a data para 'YYYY-MM-DD'

    const produtoRef = ref(db, `Estoque/${sku}`); // Referência do produto no banco de dados
    console.log(`Salvando data ${formattedDate} para o produto ${sku}`);

    update(produtoRef, { expiryDate: formattedDate }) // Atualiza a data no Firebase
      .then(() => {
        setProductsData((prevData) =>
          prevData.map((item) =>
            item.sku === sku ? { ...item, expiryDate: formattedDate } : item
          )
        );
        setFilteredProducts((prevData) =>
          prevData.map((item) =>
            item.sku === sku ? { ...item, expiryDate: formattedDate } : item
          )
        );
        setEditando(null); // Limpa o campo de edição
        console.log("Data salva com sucesso!");
      })
      .catch((error) => console.error("Erro ao atualizar no Firebase:", error));
  };

  const exportToExcel = (products) => {
    // Caso o filtro de data não tenha sido aplicado, use todos os produtos
    const productsToExport = filtroInicio || filtroFim ? filteredProducts : products;
  
    const orderedProducts = productsToExport.map((item) => ({
      Status:
        item.quantity < 5
          ? "Estoque baixo"
          : item.expiryDate && new Date(formatDate(item.expiryDate)) < new Date()
          ? "Produto vencido"
          : "Estoque Abastecido",
      SKU: item.sku,
      Nome: item.name,
      Marca: item.marca,
      Peso: item.peso,
      Quantidade: item.quantity,
      "Unidade de Medida": item.unitmeasure,
      "Valor Unitário": item.unitPrice,
      "Valor Total": item.totalPrice,
      "Data de Vencimento": item.expiryDate || "--",
      "Dias para Consumo": calculateConsumptionDays(item.dateAdded, item.expiryDate),
      "Data de Cadastro": formatDate(item.dateAdded),
      Fornecedor: item.supplier,
      Categoria: item.category || "N/A",
      Tipo: item.tipo || "N/A",
    }));
  
    // Gerando a planilha e o arquivo Excel com a nova ordem dos campos
    const ws = XLSX.utils.json_to_sheet(orderedProducts);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estoque");
  
    // Gerar o download do arquivo Excel
    XLSX.writeFile(wb, "Estoque.xlsx");
  };
  

  return (
    <div style={{ background: "linear-gradient(135deg, #6a11cb, #2575fc)" }}>
      <div className="container">
        <div className="header">
          <h1>Estoque de Alimentos </h1>
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
              Consultar Item
            </button>
            {isSearched && (
              <button onClick={handleBack} className="clear-button">
                Limpar Consulta
              </button>
            )}
          </div>
        </div>

        <div className="date-container">
          <p style={{ fontSize: "20px" }}>Período de:</p>
          <input
            type="date"
            value={filtroInicio}
            onChange={(e) => setFiltroInicio(e.target.value)}
            className="date-input"
            style={{ fontSize: "15px" }}
          />

          <p style={{ fontSize: "20px" }}>Até:</p>
          <input
            type="date"
            value={filtroFim}
            onChange={(e) => setFiltroFim(e.target.value)}
            className="date-input"
            style={{ fontSize: "15px" }}
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
            Consultar Data
          </button>
          <button
            onClick={clearDateFilter}
            className="date-input"
            style={{
              background:
                "linear-gradient(135deg,rgb(199, 81, 81),hsla(0, 100.00%, 58.40%, 0.91))",
              color: "white",
            }}
          >
            Limpar Consulta
          </button>
          <button
            onClick={() => exportToExcel(filteredProducts)}
            className="export-button"
            style={{
              background: "linear-gradient(135deg, #ff7e5f, #feb47b)",
              color: "white",
              padding: "10px",
              marginTop: "10px",
              border: "none",
              borderRadius: '10px',
              cursor: "pointer",
            }}
          >
            Exportar para Excel
          </button>
        </div>

        {filteredProducts.length > 0 && (
          <div className="totals-container" style={{marginTop: '5', marginBottom: '7px'}}>
            <table className="table">
              <thead>
                <tr
                  style={{
                    background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                    color: "white",
                  }}
                >
                  <th className="table-cell">Valor Total</th>
                  <th className="table-cell">Peso Total</th>
                  <th className="table-cell">Quantidade Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="table-cell">
                    R$ {totalPrice.toFixed(2).replace(".", ",")}
                  </td>
                  <td className="table-cell">
                    {totalPeso.toFixed(2).replace(".", ".")} KG
                  </td>
                  <td className="table-cell">{totalQuantity}</td>
                </tr>
              </tbody>
            </table>
            <div className="tópicos">
              <ul>
                <li>
                  <span
                    className="low-stock-badge"
                    style={{ backgroundColor: "#FFC000" }}
                  ></span>{" "}
                  Estoque baixo (menos de 5 unidades)
                </li>
                <li>
                  <span
                    className="low-stock-badge"
                    style={{ backgroundColor: "green" }}
                  ></span>{" "}
                  Estoque Abastecido
                </li>
                <li>
                  <span
                    className="expired-badge"
                    style={{ backgroundColor: "red" }}
                  ></span>{" "}
                  Produto vencido
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="table-container">
          <table className="table">
            <thead>
              <tr className="table-header">
                <th className="table-cell">Status</th>
                <th className="table-cell">SKU</th>
                <th className="table-cell">Nome</th>
                <th className="table-cell">Marca</th>
                <th className="table-cell">Peso</th>
                <th className="table-cell">Quantidade</th>
                <th className="table-cell">Unidade de Medida</th>
                <th className="table-cell">Valor Unitário</th>
                <th className="table-cell">Valor Total</th>
                <th className="table-cell">Data de Vencimento</th>
                <th className="table-cell">Dias para Consumo</th>
                <th className="table-cell">Data de Cadastro</th>
                <th className="table-cell">Fornecedor</th>
                <th className="table-cell">Categoria</th>
                <th className="table-cell">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item, index) => {
                const daysForConsumption = calculateConsumptionDays(
                  item.dateAdded,
                  item.expiryDate
                );

                // Verifica se o produto tem menos de 5 unidades no estoque
                const isLowStock = parseInt(item.quantity, 10) < 5;
                const isStocked = parseInt(item.quantity, 10) >= 5;
                const isExpiredProduct = isExpired(item.expiryDate);

                return (
                  <tr
                    key={`${item.sku}-${index}`}
                    className={`${isLowStock ? "low-stock" : ""} ${
                      isExpiredProduct ? "expired" : ""
                    }`}
                  >
                    <td className="table-cell">
                      {isLowStock && (
                        <span
                          className="low-stock-badge"
                          style={{ backgroundColor: "#FFC000" }}
                        ></span>
                      )}
                      {isStocked && !isExpiredProduct && (
                        <span
                          className="stocked-badge"
                          style={{ backgroundColor: "green" }}
                        ></span>
                      )}
                      {isExpiredProduct && (
                        <span
                          className="expired-badge"
                          style={{ backgroundColor: "red" }}
                        ></span>
                      )}
                    </td>

                    <td className="table-cell">{item.sku}</td>
                    <td className="table-cell">{item.name}</td>
                    <td className="table-cell">{item.marca}</td>
                    <td className="table-cell">{item.peso}</td>
                    <td className="table-cell">{item.quantity}</td>
                    <td className="table-cell">{item.unitmeasure}</td>
                    <td className="table-cell">{item.unitPrice}</td>
                    <td className="table-cell">{item.totalPrice}</td>
                    <td
                      className="table-cell"
                      onDoubleClick={() =>
                        handleDoubleClick(item.sku, item.expiryDate)
                      }
                    >
                      {editando === item.sku ? (
                        <input
                          type="date"
                          value={valorEditado}
                          onChange={handleChange}
                          onBlur={() => handleSave(item.sku)} // Salva ao sair do campo de edição
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSave(item.sku)
                          } // Salva ao pressionar Enter
                          autoFocus
                        />
                      ) : (
                        item.expiryDate || "--" // Formata a data
                      )}
                    </td>
                    <td className="table-cell">
                      {daysForConsumption >= 0 ? daysForConsumption : 0}
                    </td>
                    <td className="table-cell">{formatDate(item.dateAdded)}</td>
                    <td className="table-cell">{item.supplier}</td>
                    <td className="table-cell">{item.category || "N/A"}</td>
                    <td className="table-cell">{item.tipo || "N/A"}</td>
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
    </div>
  );
}
