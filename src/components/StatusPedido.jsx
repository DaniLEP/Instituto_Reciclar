import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { useNavigate } from "react-router-dom"; // Importando useNavigate

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.firebasestorage.app",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2"
};

// Inicializar o Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Referência ao banco de dados
const dbPedidos = firebase.database().ref("Pedidos");

const TabelaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate(); // Usando o hook para navegação

  // Função para buscar os pedidos no Firebase
  const fetchPedidos = () => {
    dbPedidos.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setPedidos(lista);
      } else {
        setPedidos([]);
      }
    });
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  // Função para editar um pedido e redirecionar para a página de edição
  const handleEdit = (id) => {
    navigate(`/Editar_Produto/${id}`); // Redireciona para a página de edição com o ID do pedido
  };

  return (
    <div style={{ maxWidth: "2200px", margin: "0 auto", padding: "20px", backgroundColor: "#00009c", height: "100vh", color: "white" }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem" }}>Tabela de Pedidos</h2> <br />
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", background: 'white', color: 'black' }}>
        <thead>
          <tr>
            <th style={{ padding: "8px", textAlign: "center", backgroundColor: "#4CAF50", color: "white" }}>Status</th>
            <th style={{ padding: "8px", textAlign: "center", backgroundColor: "#4CAF50", color: "white" }}>ID do Pedido</th>
            <th style={{ padding: "8px", textAlign: "center", backgroundColor: "#4CAF50", color: "white" }}>Data</th>
            <th style={{ padding: "8px", textAlign: "center", backgroundColor: "#4CAF50", color: "white" }}>Fornecedor</th>
            <th style={{ padding: "8px", textAlign: "center", backgroundColor: "#4CAF50", color: "white" }}>Categoria</th>
            <th style={{ padding: "8px", textAlign: "center", backgroundColor: "#4CAF50", color: "white" }}>Valor do Pedido</th>
            <th style={{ padding: "8px", textAlign: "center", backgroundColor: "#4CAF50", color: "white" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td style={{ padding: "8px", textAlign: "center" }}>{pedido.status || "Pendente"}</td>
              <td style={{ padding: "8px", textAlign: "center" }}>{pedido.id}</td>
              <td style={{ padding: "8px", textAlign: "center" }}>{new Date(pedido.data).toLocaleDateString()}</td>
              <td style={{ padding: "8px", textAlign: "center" }}>{pedido.fornecedor}</td>
              <td style={{ padding: "8px", textAlign: "center" }}>{pedido.categoria}</td>
              <td style={{ padding: "8px", textAlign: "center" }}>R$ {pedido.valor || "0.00"}</td>
              <td style={{ textAlign: "center" }}>
                <button style={{ padding: "5px 10px", backgroundColor: "#FFC107", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", margin: "0 5px" }} onClick={() => handleEdit(pedido.id)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelaPedidos;
