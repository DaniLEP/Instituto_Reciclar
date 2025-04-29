import { useState, useEffect } from "react";
import { ref, get, push, db } from '../../../../firebase.js'; // Não importa getDatabase aqui
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/ui/input";
import { Button } from "react-scroll";
import { Table } from "@/components/ui/table/table";



export default function Retirada() {
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
    .toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) .replace(",", "");
    setData(formattedDate);
  };

  useEffect(() => {
    const fetchProdutos = async () => {
      const produtosRef = ref(db, "Estoque");
      const snapshot = await get(produtosRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const produtosList = Object.entries(data).map(([id, produto]) => ({
          id, ...produto,}));
        setProdutos(produtosList);
        setFilteredProdutos(produtosList);
      }
    };
    fetchProdutos();}, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {setFilteredProdutos(produtos);} 
    else {const filtered = produtos.filter((produto) => String(produto.name || "")
      .toLowerCase() .includes(searchTerm.toLowerCase()) || String(produto.sku || "").toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredProdutos(filtered);
    }
  }, [searchTerm, produtos]);

  const handleRetirada = async () => {
    if ( !sku || !name || !category || !tipo || !quantity || !peso || !retirante) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
    try {
      const retiradaRef = ref(db, "Retiradas");
      await push(retiradaRef, {sku, name, category, tipo, quantity, peso, retirante, data,});
      toast.success("Retirada registrada com sucesso!");
      // Limpa os campos
      setSku(""); setName(""); setCategory(""); setTipo(""); setQuantity(""); setPeso(""); setRetirante(""); atualizarDataHora();
    } 
    catch (error) {toast.error("Erro ao registrar retirada."); console.error(error);}
  };

  const handleProdutoSelecionado = (produto) => { setSku(produto.sku); setName(produto.name); setCategory(produto.category); setTipo(produto.tipo); setPeso(produto.peso); setIsModalOpen(false);};

  return (
    <div className="container mx-auto p-6 max-w-lg bg-white shadow-lg rounded-lg">
      <ToastContainer className={"mt-[20px]"}/>
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">Retirada de Produtos</h1>
      <div className="space-y-4">
        <Input className="w-full p-2 border rounded cursor-pointer" 
        type="text" placeholder="SKU" value={sku} readOnly onClick={() => setIsModalOpen(true)} />
        <Input className="w-full p-2 border rounded bg-gray-100"
          type="text" placeholder="Nome do Produto" value={name} readOnly />
        <Input className="w-full p-2 border rounded bg-gray-100"
          type="text" placeholder="Categoria" value={category} readOnly/>
        <Input className="w-full p-2 border rounded bg-gray-100"
          type="text" placeholder="Tipo" value={tipo} readOnly />
        <Input className="w-full p-2 border rounded" type="number"
          placeholder="Quantidade" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        <Input className="w-full p-2 border rounded bg-gray-100"
          type="number" placeholder="Peso (kg)" value={peso} readOnly />

        <select className="w-full p-2 border rounded" value={retirante} onChange={(e) => setRetirante(e.target.value)}>
          <option value="">Escolha o Responsável</option>
          <option value="Camila">Camila</option>
          <option value="Maria José">Maria José</option>
          <option value="Mislene">Mislene</option>
          <option value="Rose">Rose</option>
        </select>

        <Input className="w-full p-2 border rounded bg-gray-100" type="text" placeholder="Data" value={data} readOnly />
        <Button onClick={handleRetirada}className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Registrar Retirada</Button>

        <Link to="/home-retirada">
          <Button className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mt-[10px]"> Voltar </Button>
        </Link>
      </div>
      
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center p-4">
          <div className="bg-white p-5 rounded-lg w-full max-w-[990px] shadow-lg max-h-[80vh] overflow-auto sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl mb-4 text-left font-[chakra petch]"> Produtos Disponíveis </h2>
              <Input type="text" placeholder="Buscar por nome ou SKU" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 mb-4 rounded-md text-base text-[#333] border border-black"/>
              <div className="overflow-x-auto">
                  <Table className="w-full border-collapse mb-4">
                    <thead>
                      <tr className="text-center bg-gray-200 text-sm sm:text-base">
                        <th className="p-2">Nome</th>
                        <th className="p-2">SKU</th>
                        <th className="p-2">Categoria</th>
                        <th className="p-2">Tipo</th>
                        <th className="p-2">Quantidade</th>
                        <th className="p-2">Peso(KG)</th>
                        <th className="p-2">Selecionar</th>
                      </tr>
                    </thead>
                    <tbody className="text-center text-sm sm:text-base">
                      {filteredProdutos.map((produto) => (
                        <tr key={produto.id} className="border-b">
                          <td className="p-2">{produto.name}</td>
                          <td className="p-2">{produto.sku}</td>
                          <td className="p-2">{produto.category}</td>
                          <td className="p-2">{produto.tipo}</td>
                          <td className="p-2">{produto.quantity}</td>
                          <td className="p-2">{produto.peso}</td>
                          <td className="p-2"><Button onClick={() => handleProdutoSelecionado(produto)} className="bg-[#007BFF] text-white px-4 py-2 rounded-md cursor-pointer border-none text-sm sm:text-base">Selecionar</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
              </div>
                <Button onClick={() => setIsModalOpen(false)} className="bg-[#00009c] text-white px-4 py-3 border-none rounded-md w-full cursor-pointer text-sm sm:text-base">Fechar</Button>
            </div>
        </div>
      )}
    </div>
  );
}