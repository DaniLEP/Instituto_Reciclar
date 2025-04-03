import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, push } from "firebase/database";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

export default function RetiradaProdutos() {
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

  useEffect(() => {
    atualizarDataHora();
    const interval = setInterval(atualizarDataHora, 60000); // Atualiza a cada minuto
    return () => clearInterval(interval);
  }, []);

  const atualizarDataHora = () => {
    const now = new Date();
    const formattedDate = now
      .toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
      .replace(",", "");
    setData(formattedDate);
  };

  useEffect(() => {
    const fetchProdutos = async () => {
      const produtosRef = ref(database, "Estoque");
      const snapshot = await get(produtosRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const produtosList = Object.entries(data).map(([id, produto]) => ({
          id,
          ...produto,
        }));
        setProdutos(produtosList);
        setFilteredProdutos(produtosList);
      }
    };
    fetchProdutos();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProdutos(produtos);
    } else {
      const filtered = produtos.filter(
        (produto) =>
          String(produto.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          String(produto.sku || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredProdutos(filtered);
    }
  }, [searchTerm, produtos]);

  const handleRetirada = async () => {
    if ( !sku || !name || !category || !tipo || !quantity || !peso || !retirante) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const retiradaRef = ref(database, "Retiradas");
      await push(retiradaRef, {sku, name, category, tipo, quantity, peso, retirante, data,});
      toast.success("Retirada registrada com sucesso!");

      // Limpa os campos
      setSku("");
      setName("");
      setCategory("");
      setTipo("");
      setQuantity("");
      setPeso("");
      setRetirante("");
      atualizarDataHora();
    } catch (error) {toast.error("Erro ao registrar retirada.");
      console.error(error);
    }
  };

  const handleProdutoSelecionado = (produto) => {
    setSku(produto.sku);
    setName(produto.name);
    setCategory(produto.category);
    setTipo(produto.tipo);
    setPeso(produto.peso);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-lg bg-white shadow-lg rounded-lg">
      <ToastContainer className={"mt-[20px]"}/>
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">Retirada de Produtos</h1>
      <div className="space-y-4">
        <input className="w-full p-2 border rounded cursor-pointer" 
        type="text" placeholder="SKU" value={sku} readOnly onClick={() => setIsModalOpen(true)} />
        <input className="w-full p-2 border rounded bg-gray-100"
          type="text" placeholder="Nome do Produto" value={name} readOnly />
        <input className="w-full p-2 border rounded bg-gray-100"
          type="text" placeholder="Categoria" value={category} readOnly/>
        <input className="w-full p-2 border rounded bg-gray-100"
          type="text" placeholder="Tipo" value={tipo} readOnly />
        <input className="w-full p-2 border rounded" type="number"
          placeholder="Quantidade" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        <input className="w-full p-2 border rounded bg-gray-100"
          type="number" placeholder="Peso (kg)" value={peso} readOnly />

        <select className="w-full p-2 border rounded" value={retirante} onChange={(e) => setRetirante(e.target.value)}>
          <option value="">Escolha o Responsável</option>
          <option value="Camila">Camila</option>
          <option value="Maria José">Maria José</option>
          <option value="Mislene">Mislene</option>
          <option value="Rose">Rose</option>
        </select>

        <input className="w-full p-2 border rounded bg-gray-100" 
          type="text" placeholder="Data" value={data} readOnly />
        <button onClick={handleRetirada} 
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Registrar Retirada
        </button>

        <Link to="/Retirada">
          <button className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mt-[10px]"> Voltar </button>
        </Link>
      </div>
      
    {isModalOpen && ( //Modal para selecionar o produto para retirar
          <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
            <div className="bg-white p-[20px] rounded-[10px] w-full max-w-[990px] shadow-[0_2px_10px_rgba(0,0,0,0.3)] max-h-[80vh] overflow-y-auto">
              <h2 className="text-[1.5rem] mb-[20px] text-left font-[chakra pecth] ">Produtos Disponíveis</h2>
              <input type="text" placeholder="Buscar por nome ou SKU" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-[10px] mb-[10px] rouded-[5px] text-[1rem] text-[#333] border-[1px] border-black" />
              <table className="w-full bc-collapse mb-[20px]">
                <thead>
                  <tr className="text-center">
                    <th>Nome</th>
                    <th>SKU</th>
                    <th>Categoria</th>
                    <th>Tipo</th>
                    <th>Quantidade</th>
                    <th>Peso(KG)</th>
                    <th>Selecionar</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {filteredProdutos.map((produto) => (
                    <tr key={produto.id}>
                      <td>{produto.name}</td>
                      <td>{produto.sku}</td>
                      <td>{produto.category}</td>
                      <td>{produto.tipo}</td>
                      <td>{produto.quantity}</td>
                      <td>{produto.peso}</td>
                      <td>
                        <button onClick={() => handleProdutoSelecionado(produto)}
                        className="bg-[#007BFF] text-white p-[5px_10px] rounded-[5px] cursor-pointer border-none">
                          Selecionar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={() => setIsModalOpen(false)}
                className="bg-[#00009c] text-[#fff] p-[10px_20px] border-none rounded-[5px] w-full cursor-pointer">
                  Fechar
              </button>
            </div>
          </div>
        )}
    </div>
  );
}