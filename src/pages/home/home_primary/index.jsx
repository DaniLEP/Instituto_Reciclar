import { Link, useNavigate } from "react-router-dom";
import Header from "../../../components/ui/header/index";
import { useEffect, useState } from "react";
import { auth, dbRealtime } from "../../../../firebase";  // Corrigido
import { ref, get } from "firebase/database"; // Realtime Database


const Card = ({ to, imgSrc, imgAlt, title, external }) => {
  const content = (
    <>
      <img src={imgSrc} className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]" alt={imgAlt} />
      <h2 className="text-black text-lg md:text-xl lg:text-2xl mt-4">{title}</h2>
    </>
  );

  return (
    <div className="bg-[#F6F6F6] rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
      {external ? (
        <a href={to} target="_blank" rel="noopener noreferrer" aria-label={title}>
          {content}
        </a>
      ) : (
        <Link to={to} aria-label={title}>
          {content}
        </Link>
      )}
    </div>
  );
};

export default function Home() {
  const [time, setTime] = useState(new Date());
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const dbRef = ref(dbRealtime, "usuarios/" + user.uid);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          setUsuario(snapshot.val());
        } else {
          console.log("Usuário não encontrado no banco de dados.");
        }
      } else {
        navigate("/");
      }
    };
    fetchUserData();
  }, [navigate]);

  if (!usuario) {
    return (
      <div className="flex justify-center items-center min-h-screen font-['Roboto'] text-[18px] text-[#333]">Carregando...</div>
    );
  }

  return (
    <>
      <div className="bg-white font-['Chakra_Petch'] text-[20px] text-center">
        <div className="bg-gradient-to-br from-[#6a11cb] to-[#2575fc]"><Header /></div>
        <hr className="h-[0.2rem]" />
        <div className="bg-gradient-to-br from-[#6a11cb] to-[#2575fc] min-h-screen py-5 mb-[50px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-[10px]">
            <Card to="/Pedidos" imgSrc="/pedidos.png" imgAlt="Pedidos" title="Pedidos" />
            <Card to="/Cadastro" imgSrc="/item.png" imgAlt="Cadastro" title="Cadastros" />
            <Card to="/Estoque" imgSrc="/estoque.png" imgAlt="Estoque" title="Estoque" />
            <Card to="/Dashboard" imgSrc="/dashboard.png" imgAlt="Relatórios" title="Relatórios" />
            <Card to="/home-retirada" imgSrc="/retirada.png" imgAlt="Retirada" title="Retirada" />
            <Card to="/Verificacao_Usuario" imgSrc="/controle.png" imgAlt="Controle de Usuários" title="Controle de Usuários" />
            <Card to="/cardapio" imgSrc="/cardapio.png" imgAlt="Cardápio" title="Cardápio" />
            <Card to="/manutencao-home" imgSrc="/manutencao.png" imgAlt="maintenance" title="Manutenção" />
            <Card to="https://drive.google.com/drive/folders/1QdXTwo0zggBmHP1MBih6IMVCQ-WaoBBa?usp=sharing" imgSrc="/documentacao.png" imgAlt="documentation" title="Documentação" external={true} />
          </div>
        </div>
        <footer className="flex justify-between items-center px-5 py-2 bg-gradient-to-br from-[#6a11cb] to-[#2575fc] border-t-4 border-[#ddd] text-white text-sm fixed bottom-0 w-full box-border">
          <div className="w-[30vh]"><img src="/Logo.png" alt="Logo" /></div>
          <div className="text-[15px]" aria-label={`Seja bem-vindo ${usuario.nome || "Usuário não encontrado"}`}>
            Seja bem-vindo <br />
            {usuario.nome || "Usuário não encontrado"}
          </div>
          <div className="font-mono text-[16px]">{time.toLocaleTimeString("pt-BR", { hour12: false })}</div>
        </footer>
      </div>
    </>
  );
}
