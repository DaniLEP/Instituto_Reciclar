import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { Link } from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.firebasestorage.app",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
};

// Inicializar o Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Referência ao banco de dados
const dbPedidos = firebase.database().ref("Pedidos");

const Pedido = () => {
  const [formData, setFormData] = useState({
    sku: "",
    fornecedor: "",
    marca: "",
    produto: "",
    quantidade: "",
    valorUnitario: "",
    data: "",
    categoria: "proteina",
    observacoes: "",
  });
  const [itens, setItens] = useState([]);

  const formatCurrency = (value) => {
    if (!value) return "";
    return parseFloat(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddItem = () => {
    if (
      formData.sku &&
      formData.produto &&
      formData.quantidade &&
      formData.fornecedor &&
      formData.marca &&
      formData.valorUnitario &&
      formData.data
    ) {
      const valorTotal = (
        parseFloat(formData.quantidade) * parseFloat(formData.valorUnitario)
      ).toFixed(2);

      setItens((prevItens) => [...prevItens, { ...formData, valorTotal }]);

      setFormData({
        sku: "",
        fornecedor: "",
        marca: "",
        produto: "",
        quantidade: "",
        valorUnitario: "",
        data: "",
        categoria: "proteina",
        observacoes: "",
      });
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.");
    }
  };

  const handleRemoveItem = (index) => {
    setItens((prevItens) => prevItens.filter((_, i) => i !== index));
  };

  const handleSendPedido = () => {
    if (itens.length === 0) {
      alert("Adicione itens ao pedido antes de enviar.");
      return;
    }

    dbPedidos
      .push({ itens })
      .then(() => {
        alert("Pedido enviado com sucesso!");
        setItens([]);
      })
      .catch((error) => {
        console.error("Erro ao enviar pedido:", error);
        alert("Erro ao enviar pedido. Tente novamente.");
      });
  };

  return (
    <div
      style={{
        maxWidth: "2100px",
        margin: "0 auto",
        padding: "20px",
        background: "#CFCFCF",
        height: "100vh",
      }}
    >
      <h2
        style={{ textAlign: "center", fontFamily: "italic", fontSize: "50px" }}
      >
        Novo Pedido
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          position: "relative",
          top: "10vh",
        }}
      >
        <input
          type="text"
          name="sku"
          placeholder="SKU"
          value={formData.sku}
          onChange={handleChange}
          style={{ flex: "1", minWidth: "200px", padding: "10px" }}
        />
        <input
          type="text"
          name="fornecedor"
          placeholder="Fornecedor"
          value={formData.fornecedor}
          onChange={handleChange}
          style={{ flex: "1", minWidth: "200px", padding: "10px" }}
        />
        <input
          type="text"
          name="marca"
          placeholder="Marca"
          value={formData.marca}
          onChange={handleChange}
          style={{ flex: "1", minWidth: "200px", padding: "10px" }}
        />
        <input
          type="text"
          name="produto"
          placeholder="Produto"
          value={formData.produto}
          onChange={handleChange}
          style={{ flex: "1", minWidth: "200px", padding: "10px" }}
        />
        <input
          type="number"
          name="quantidade"
          placeholder="Quantidade"
          value={formData.quantidade}
          onChange={handleChange}
          style={{ flex: "1", minWidth: "200px", padding: "10px" }}
        />
        <input
          type="number"
          step="0.01"
          name="valorUnitario"
          placeholder="Valor Unitário (R$)"
          value={formData.valorUnitario}
          onChange={handleChange}
          style={{ flex: "1", minWidth: "200px", padding: "10px" }}
        />
        <input
          type="date"
          name="data"
          value={formData.data}
          onChange={handleChange}
          style={{ flex: "1", minWidth: "200px", padding: "10px" }}
        />
        <select
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          style={{ flex: "1", minWidth: "200px", padding: "10px" }}
        >
          <option value="proteina">Proteína</option>
          <option value="mantimento">Mantimento</option>
          <option value="hortalicas">Hortaliças</option>
        </select>
        <textarea
          name="observacoes"
          placeholder="Observações"
          value={formData.observacoes}
          onChange={handleChange}
          style={{
            flex: "1",
            minWidth: "200px",
            padding: "10px",
            height: "80px",
          }}
        ></textarea>
        <button
          onClick={handleAddItem}
          style={{
            flex: "1",
            minWidth: "200px",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Adicionar Item
        </button>
      </div>
      <div
        style={{
          overflowX: "auto",
          maxWidth: "130%",
          position: "relative",
          top: "10vh",
        }}
      >
        <table
          style={{
            width: "120%",
            borderCollapse: "collapse",
            marginTop: "20px",
            background: "#F20DE7",
            color: "white",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>SKU</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Fornecedor
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Marca
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Produto
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Quantidade
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Valor Unitário
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Valor Total
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Data do Pedido
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Categoria
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Ações
              </th>
            </tr>
          </thead>
          <tbody
            style={{ background: "white", color: "black", textAlign: "center" }}
          >
            {itens.map((item, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.sku}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.fornecedor}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.marca}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.produto}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.quantidade}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {formatCurrency(item.valorUnitario)}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {formatCurrency(item.valorTotal)}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.data}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.categoria}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <button
                    onClick={() => handleEditItem(index)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#ffc107",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      marginRight: "5px",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleSendPedido}
        style={{
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginTop: "80px",
          display: "block",
          marginLeft: "auto",
        }}
      >
        Enviar Pedido
      </button>
      <Link to={"/Pedidos"}>
        <button
          style={{
            padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginTop: "-40px",
          display: "block",

          }}
        >
          Voltar
        </button>
      </Link>
    </div>
  );
};

export default Pedido;
