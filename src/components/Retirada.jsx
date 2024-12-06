import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, push, update, remove } from "firebase/database";
import { Link } from "react-router-dom";  // Importando o hook useNavigate



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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const RetiradaProdutos = () => {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [tipo, setTipo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [retirante, setRetirante] = useState("");
  const [data, setData] = useState("");
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      const produtosRef = ref(database, "Estoque");
      const snapshot = await get(produtosRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setProdutos(Object.entries(data).map(([id, produto]) => ({ id, ...produto })));
      }
    };
    fetchProdutos();
  }, []);

  const handleConsultar = () => {
    const produto = produtos.find((p) => p.sku === sku);
    if (produto) {
      setName(produto.name);
      setCategory(produto.category);
      setTipo(produto.tipo);
      setData(new Date().toLocaleString());
    } else {
      alert("Produto não encontrado!");
      setName("");
      setCategory("");
      setData("");
    }
  };



  const handleRetirada = async () => {
    if (!sku || !name || !category || !tipo || !quantity || !retirante || !data) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const produto = produtos.find((p) => p.sku === sku);
    if (!produto) {
      alert("Produto não encontrado!");
      return;
    }

    if (produto.quantity < quantity) {
      alert("Estoque insuficiente!");
      return;
    }

    const novaQuantidade = produto.quantity - quantity;
    const produtoRef = ref(database, `Estoque/${produto.id}`);

    if (novaQuantidade === 0) {
      await remove(produtoRef);
      setProdutos((prevProdutos) => prevProdutos.filter((p) => p.id !== produto.id));
    } else {
      await update(produtoRef, { quantity: novaQuantidade });
      setProdutos((prevProdutos) =>
        prevProdutos.map((p) =>
          p.id === produto.id ? { ...p, quantity: novaQuantidade } : p
        )
      );
    }

    const retiradaRef = ref(database, "Retiradas");
    const retiradaData = { sku, name, category, tipo, quantity, retirante, data };
    await push(retiradaRef, retiradaData);

    alert(`Retirada registrada com sucesso por ${retirante}. Estoque atualizado.`);
    setSku("");
    setName("");
    setCategory("");
    setTipo("");
    setQuantity("");
    setRetirante("");
    setData("");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Retirada de Produtos</h1>
      <div style={styles.form}>
        <input
          type="text"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleConsultar} style={styles.Consultabutton}>
          Consultar
        </button>
        <input
          type="text"
          placeholder="Nome do Produto"
          value={name}
          readOnly
          style={styles.inputReadOnly}
        />
        <input
          type="text"
          placeholder="Categoria"
          value={category}
          readOnly
          style={styles.inputReadOnly}
        />
          <input
          type="text"
          placeholder="Tipo"
          value={tipo}
          readOnly
          style={styles.inputReadOnly}
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Retirante"
          value={retirante}
          onChange={(e) => setRetirante(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Data"
          value={data}
          readOnly
          style={styles.inputReadOnly}
        />
        <button onClick={handleRetirada} style={styles.button}>
          Registrar Retirada
        </button>
        <Link to={'/Retirada'}>
        <button style={styles.voltarButton}>
          Voltar
        </button>
        </Link>
      </div>


    </div>
  );
};

const styles = {
  container: {
    background: "#f4f4f9",
    minHeight: "100vh",
    padding: "20px",
    color: "#333",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: "2rem",
    color: "#2b2d42",
    marginBottom: "20px",
  },
  form: {
    background: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    width: "90%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "1rem",
    color: "#333",
  },
  inputReadOnly: {
    width: "90%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "1rem",
    background: "#f0f0f0",
    color: "#888",
  },
  button: {
    width: "90%",
    padding: "10px",
    background: "#F20DE7",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  Consultabutton: {
    width: "90%",
    padding: "10px",
    background: "#00009c",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s",
    marginBottom: '10px'
  },
  Voltarbutton: {
    width: "90%",
    padding: "10px",
    color: "black",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s",
    marginTop: '10px',
  },
  buttonHover: {
    background: "#3b3d52",
  },
};

export default RetiradaProdutos;


