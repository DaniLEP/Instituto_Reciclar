import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, push, update, remove } from "firebase/database";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [peso, setPeso] = useState("");
  const [retirante, setRetirante] = useState("");
  const [data, setData] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Atualiza a data automaticamente
  useEffect(() => {
    const dataAtual = formatarDataHora(new Date());
    setData(dataAtual);
  }, []);

  useEffect(() => {
    const fetchProdutos = async () => {
      const produtosRef = ref(database, "Estoque");
      const snapshot = await get(produtosRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const produtosList = Object.entries(data).map(([id, produto]) => ({ id, ...produto }));
        setProdutos(produtosList);
        setFilteredProdutos(produtosList); // Inicializa os produtos filtrados com todos os produtos
      }
    };
    fetchProdutos();
  }, []);

  // Filtro de produtos baseado no nome ou SKU
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProdutos(produtos);
    } else {
      const filtered = produtos.filter((produto) =>
        produto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProdutos(filtered);
    }
  }, [searchTerm, produtos]);

  const handleRetirada = async () => {
    if (!sku || !name || !category || !tipo || !quantity || !peso || !retirante || !data) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    const produto = produtos.find((p) => p.sku === sku);
    if (!produto) {
      toast.error("Produto não encontrado!");
      return;
    }

    if (produto.quantity < quantity) {
      toast.error("Estoque insuficiente para a quantidade!");
      return;
    }

    if (produto.peso < peso) {
      toast.error("Estoque insuficiente para o peso!");
      return;
    }

    const novaQuantidade = produto.quantity - quantity;
    const novoPeso = produto.peso - peso;

    const produtoRef = ref(database, `Estoque/${produto.id}`);
    const atualizacao = {
      quantity: novaQuantidade,
      peso: novoPeso,
    };

    if (novaQuantidade === 0 && novoPeso === 0) {
      await remove(produtoRef);
      setProdutos((prevProdutos) => prevProdutos.filter((p) => p.id !== produto.id));
    } else {
      await update(produtoRef, atualizacao);
      setProdutos((prevProdutos) =>
        prevProdutos.map((p) =>
          p.id === produto.id ? { ...p, ...atualizacao } : p
        )
      );
    }

    const retiradaRef = ref(database, "Retiradas");
    const retiradaData = { sku, name, category, tipo, quantity, peso, retirante, data };
    await push(retiradaRef, retiradaData);

    toast.success(`Retirada registrada com sucesso por ${retirante}. Estoque atualizado.`);
    setSku("");
    setName("");
    setCategory("");
    setTipo("");
    setQuantity("");
    setPeso("");
    setRetirante("");
    setData(formatarDataHora(new Date())); // Atualiza a data ao registrar a retirada
  };

  const handleProdutoSelecionado = (produto) => {
    setSku(produto.sku);
    setName(produto.name);
    setCategory(produto.category);
    setTipo(produto.tipo);
    setPeso(produto.peso);

    setIsModalOpen(false);
  };

  const formatarDataHora = (timestamp) => {
    const date = new Date(timestamp);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();
    const horas = String(date.getHours()).padStart(2, "0");
    const minutos = String(date.getMinutes()).padStart(2, "0");
    const segundos = String(date.getSeconds()).padStart(2, "0");

    return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
  };

  return (
    <div style={{ background: "#f4f4f9", minHeight: "100vh", padding: "20px", color: "#333", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <ToastContainer />
      <h1 style={{ fontSize: "2rem", color: "#2b2d42", marginBottom: "20px" }}>Retirada de Produtos</h1>
      <div style={{ background: "#ffffff", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", padding: "20px", width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <input
          type="text"
          placeholder="SKU"
          value={sku}
          onClick={() => setIsModalOpen(true)}
          readOnly
          style={{ width: "90%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "1rem", color: "#333" }}
        />
        <input
          type="text"
          placeholder="Nome do Produto"
          value={name}
          readOnly
          style={{ width: "90%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "1rem", background: "#f0f0f0", color: "#888" }}
        />
        <input
          type="text"
          placeholder="Categoria"
          value={category}
          readOnly
          style={{ width: "90%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "1rem", background: "#f0f0f0", color: "#888" }}
        />
        <input
          type="text"
          placeholder="Tipo"
          value={tipo}
          readOnly
          style={{ width: "90%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "1rem", background: "#f0f0f0", color: "#888" }}
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ width: "90%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "1rem", color: "#333" }}
        />
        <input
          type="number"
          placeholder="Peso (kg)"
          value={peso}
          readOnly
          onChange={(e) => setPeso(Number(e.target.value))}
          style={{ width: "90%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "1rem", color: "#333" }}
        />
        <select
          type="text"
          placeholder="Responsável"
          value={retirante}
          onChange={(e) => setRetirante(e.target.value)}
          style={{ width: "90%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "1rem", color: "#333" }}
        >
          <option value="Selecionar">Escolha o Responsável</option>
          <option value="Maria José">Maria José</option>
          <option value="Maria Miselene">Maria Mislene</option>
          <option value="Rose">Rose</option>

        </select>
        <input
          type="text"
          placeholder="Data"
          value={data}
          readOnly
          style={{ width: "90%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "1rem", background: "#f0f0f0", color: "#888" }}
        />
        <button onClick={handleRetirada} style={{ width: "90%", padding: "10px", background: "#F20DE7", color: "#ffffff", border: "none", borderRadius: "5px", fontSize: "1rem", cursor: "pointer", transition: "background 0.3s" }}>
          Registrar Retirada
        </button>
        <Link to={"/Retirada"}>
          <button style={{ width: "90%", padding: "10px", color: "black", border: "none", borderRadius: "5px", fontSize: "1rem", cursor: "pointer", transition: "background 0.3s", marginTop: "10px" }}>
            Voltar
          </button>
        </Link>
      </div>

      {isModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", width: "90%", maxWidth: "800px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "20px", textAlign: "center" }}>Produtos Disponíveis</h2>
            <input
              type="text"
              placeholder="Buscar por nome ou SKU"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "1rem",
                color: "#333"
              }}
            />
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
              <thead>
                <tr style={{ textAlign: "center" }}>
                  <th>Nome</th>
                  <th>SKU</th>
                  <th>Categoria</th>
                  <th>Tipo</th>
                  <th>Quantidade</th>
                  <th>Peso(KG)</th>
                  <th>Selecionar</th>
                </tr>
              </thead>
              <tbody style={{ textAlign: "center" }}>
                {filteredProdutos.map((produto) => (
                  <tr key={produto.id}>
                    <td>{produto.name}</td>
                    <td>{produto.sku}</td>
                    <td>{produto.category}</td>
                    <td>{produto.tipo}</td>
                    <td>{produto.quantity}</td>
                    <td>{produto.peso}</td>
                    <td>
                      <button
                        onClick={() => handleProdutoSelecionado(produto)}
                        style={{
                          background: "#007BFF",
                          color: "#fff",
                          padding: "5px 10px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer"
                        }}
                      >
                        Selecionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setIsModalOpen(false)} style={{ backgroundColor: "#00009c", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetiradaProdutos;
