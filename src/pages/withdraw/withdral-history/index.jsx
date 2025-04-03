import { useState, useEffect } from "react";
import { getDatabase, ref, child, get } from "firebase/database";
import { initializeApp } from "firebase/app";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";

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

export default function HistoricoRetiradas () {
  const navigate = useNavigate();
  const [retiradas, setRetiradas] = useState([]);
  const [category, setCategory] = useState("");
  const [retirante, setRetirante] = useState("");

  const [retiradasFiltradas, setRetiradasFiltradas] = useState([]);

  // Função para buscar os dados no Firebase
  const fetchRetiradas = async () => {
    const dbRef = ref(database);
    try {
      const snapshot = await get(child(dbRef, "Retiradas"));
      if (snapshot.exists()) {
        setRetiradas(Object.values(snapshot.val())); // Converte o objeto em array
        setRetiradasFiltradas(Object.values(snapshot.val())); // Inicializa com todos os dados
      } else {
        console.log("Não há dados disponíveis");
      }
    } catch (error) {
      console.error("Erro ao ler dados:", error);
    }
  };


  useEffect(() => {fetchRetiradas(); }, []); {/*Chama a função ao carregar o componente*/}

  // Função de filtragem
  const filtrarRetiradas = () => {
    const filtradas = retiradas.filter(
      (retirada) => retirada.category === category
    ); setRetiradasFiltradas(filtradas.length > 0 ? filtradas : retiradas); };

  const filtrarRetirados = () => {
    const filtrados = retiradas.filter(
      (retirada) => retirada.retirante === retirante
    ); setRetiradasFiltradas(filtrados.length > 0 ? filtrados : retiradas); };

  // Função para formatar a data e hora
  const formatarDataHora = (timestamp) => {
    if (!timestamp) return "Data inválida"; // Verifica se o timestamp é válido

    // Verifica se o valor de data é uma string ISO ou timestamp numérico
    const data =
      typeof timestamp === "string" ? new Date(timestamp) : new Date(Number(timestamp));

    // Verifica se a data é inválida
    if (isNaN(data.getTime())) return "Data inválida";

    // Formata a data
    return data.toLocaleString("pt-BR", {year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",second: "2-digit",});
  };

  return (
    <div className="max-w-[1200px] m-[0_auto] p-10" >
      <Link to={"/home-retirada"}>
        <Button onClick={() => navigate(-1)} 
          className="bg-[#F20DE7] border border-none rounded-[5px] cursor-pointer p-[10px_20px]">
          Voltar
        </Button>
      </Link>

      <h1 className="text-center text-[2rem] text-[#2c3e50] mb-[30px]">Histórico de Retiradas</h1>

      <div className="grid gap-[10px] grid-cols-[repeat(auto-fill,minmax(210px, 4fr))] mb-[20px]">
        <label className="text-[18px] text-[#2c3e50] mb-[5px]">Consulte por Categoria ou Responsável:</label>

        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="bg-[#f0f8ff] p-3 rounded-[5px] border border-[1px_solid_#ccc]">
          <option value="">Selecione a categoria:</option>
          <option value="Proteína">Proteína</option>
          <option value="Mantimento">Mantimento</option>
          <option value="Hortaliças">Hortaliças</option>
          <option value="Doações">Doações</option>
        </select>

        <select value={retirante} onChange={(e) => setRetirante(e.target.value)}
          className="bg-[#f0f8ff] p-2 rounded-[5px] border border-[1px_solid_#ccc]">
          <option value="">Selecione o Responsável:</option>
          <option value="Camila">Camila</option>
          <option value="Mislene">Mislene</option>
          <option value="Maria Jose">Maria Jose</option>
          <option value="Rose">Rose</option>
        </select>

        <Button className="bg-[#28a745] text-white p-5 text-[1rem] border-border-none cursor-pointer rounded-[5px]"
          onClick={filtrarRetiradas && filtrarRetirados}>
          Consultar
        </Button>
      </div>

      <Table className="w-full border border-collapse mt-[30px] shadow-[0_2px_8px_rgba(0, 0, 0, 0.1)]">
        <thead className="bg-[#8E44AD] text-[18px] text-white rounded-3 text-center">
          <tr>
            <th className="p-[12px]">SKU</th>
            <th className="p-[12px]">Produto</th>
            <th className="p-[12px]">Categoria</th>
            <th className="p-[12px]">Quantidade</th>
            <th className="p-[12px]">Peso(KG)</th>
            <th className="p-[12px]">Data de Retirada</th>
            <th className="p-[12px]">Responsável</th>
          </tr>
        </thead>
        <tbody>
          {retiradasFiltradas.map((retirada, index) => (
            <tr key={index} className="text-center border-bottom-[1px solid #ddd]">
              <td className="p-[12px]">{retirada.sku}</td>
              <td className="p-[12px]">{retirada.name}</td>
              <td className="p-[12px]">{retirada.category}</td>
              <td className="p-[12px]">{retirada.quantity}</td>
              <td className="p-[12px]">{retirada.peso}</td>
              <td className="p-[12px]">{formatarDataHora(retirada.data)}</td>
              <td className="p-[12px]">{retirada.retirante}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};