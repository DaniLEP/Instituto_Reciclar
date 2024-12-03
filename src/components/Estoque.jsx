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

const Estoque = () => {
  const [sku, setSku] = useState("");
  const [productName, setProductName] = useState("");
  const [productsData, setProductsData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalUnitPrice, setTotalUnitPrice] = useState(0); // Total do valor unitário somado
  const [error, setError] = useState("");
  const [isSearched, setIsSearched] = useState(false); // Estado para saber se a pesquisa foi feita
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
        setFilteredProducts(products); // Exibe todos os produtos
      }
    });
  }, []);

  const calculateConsumptionDays = (dateAdded, expiryDate) => {
    // faz as datas sejam convertidas para objetos Date
    const registerDateObj = new Date(dateAdded);
    const expiryDateObj = new Date(expiryDate);

    const diffTime = Math.abs(expiryDateObj - registerDateObj);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Converter de milissegundos para dias
  };

  // Método para calcular a quantidade total e o valor total unitário
  const handleSearch = () => {
    const filtered = productsData.filter(
      (item) => item.name.toLowerCase().includes(productName.toLowerCase()) // Filtra pelo nome
    );

    if (filtered.length > 0) {
      setFilteredProducts(filtered);
      setError("");

      // // Calcular a soma da quantidade total
      // const totalQuantity = filtered.reduce((acc, item) => acc + item.quantity);
      // setTotalQuantity(totalQuantity);

      // Somar a quantidade total dos produtos
      const totalQuantity = filtered.reduce(
        (acc, item) => acc + parseInt(item.quantity, 10),
        0
      );
      setTotalQuantity(totalQuantity);
      // Calcular a soma do valor unitário total
      const totalUnitPrice = filtered.reduce(
        (acc, item) => acc + item.unitPrice,
        0
      );
      setTotalUnitPrice(totalUnitPrice);

      setIsSearched(true); // Marca que a pesquisa foi feita
    } else {
      setFilteredProducts([]);
      setError("Produto não encontrado.");
      setTotalQuantity(0);
      setTotalUnitPrice(0);
      setIsSearched(false); // Se não encontrar, reseta a pesquisa
    }
  };

  const handleBack = () => {
    setProductName("");
    setFilteredProducts(productsData); // Resetando o filtro para exibir todos os produtos
    setTotalQuantity(0);
    setTotalUnitPrice(0);
    setError("");
    setIsSearched(false); // Reseta o estado de pesquisa
  };

  const voltar = () => {
    navigate("/Dashboard");
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          maxWidth: "90%",
          margin: "auto",
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1>Consulta de Estoque</h1>
        <div style={{ marginBottom: "20px", width: "100%" }}>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Digite o nome do produto"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginBottom: "10px",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <button
              onClick={handleSearch}
              style={{
                padding: "10px 15px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "10px",
              }}
              disabled={productsData.length === 0 || !productName} // Desabilitar se não houver produtos para pesquisar
            >
              Consultar
            </button>
            {filteredProducts.length > 0 && (
              <button
                onClick={handleBack}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Limpar
              </button>
            )}
          </div>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Exibe os produtos, seja após a pesquisa ou não */}
        <div style={{ marginTop: "20px" }}>
          <h3>Quantidade de Produtos: {totalQuantity}</h3>
          <h3>Valor Total: R$ {totalUnitPrice}</h3>
        </div>

        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  SKU
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Nome
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Fornecedor
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Marca
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Categoria
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Quantidade
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Valor Unitário
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Data de Cadastro
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Data de Vencimento
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Dias para Consumo
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item) => (
                <tr key={item.sku}>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    {item.sku}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    {item.name}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    {item.supplier}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    {item.marca}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    {item.category || "N/A"}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    R$ {item.unitPrice}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    {item.dateAdded}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    {item.expiryDate}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    {calculateConsumptionDays(item.dateAdded, item.expiryDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={voltar}
          style={{
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default Estoque;
