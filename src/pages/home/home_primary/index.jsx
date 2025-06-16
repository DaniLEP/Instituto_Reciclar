import { Link, useNavigate } from "react-router-dom";
import Header from "../../../components/ui/header/index";
import { useEffect, useState } from "react";
import { auth, dbRealtime } from "../../../../firebase";
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

const Card = ({ to, imgSrc, imgAlt, title, external = false }) => {
  const content = (
    <>
      <img
        src={imgSrc}
        onError={(e) => (e.target.src = "/fallback.png")}
        className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]"
        alt={imgAlt}
      />
      <h2 className="text-black text-lg md:text-xl lg:text-2xl mt-4 text-center">{title}</h2>
    </>
  );

  if (external) {
    return (
      <div className="bg-[#F6F6F6] rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
        <a href={to} target="_blank" rel="noopener noreferrer" aria-label={title}>
          {content}
        </a>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F6F6] rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
      <Link to={to} aria-label={title}>
        {content}
      </Link>
    </div>
  );
};

export default function Home() {
  const [usuario, setUsuario] = useState(null);
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  // Atualiza o relógio a cada segundo
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Monitora autenticação e carrega dados do usuário
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/");
        return;
      }
      try {
        const dbRef = ref(dbRealtime, `usuarios/${user.uid}`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const dados = snapshot.val();
          if (!dados.funcao) {
            console.warn("Tipo de usuário não definido.");
          }
          setUsuario(dados);
        } else {
          console.warn("Usuário não encontrado no banco de dados.");
          setUsuario(null);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        setUsuario(null);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (!usuario || !usuario.funcao) {
    return (
      <div className="flex justify-center items-center min-h-screen font-['Roboto'] text-[18px] text-[#333]">
        Carregando...
      </div>
    );
  }

  const cards = [
    { to: "/Pedidos", img: "/pedidos.png", title: "Pedidos/Compras", funcao: ["Admin"] },
    { to: "/Cadastro", img: "/item.png", title: "Cadastros", funcao: ["Admin"] },
    { to: "/Estoque", img: "/estoque.png", title: "Estoque", funcao: ["Admin", "Cozinha"] },
    { to: "/Dashboard", img: "/dashborad.png", title: "Relatórios", funcao: ["Admin"] },
    { to: "/home-retirada", img: "/retirada.png", title: "Retirada", funcao: ["Admin", "Cozinha"] },
    { to: "/Verificacao_Usuario", img: "/controle.png", title: "Gerenciador de Usuários", funcao: ["Admin"] },
    { to: "/cardapio", img: "/cardapio.png", title: "Cardápio / Ficha Técnica / Refeições", funcao: ["Admin", "Nutricionista", "Cozinha"] },
    { to: "/manutencao-home", img: "/manuntenção.png", title: "Manutenção", funcao: ["Admin"] },
    { to: "https://drive.google.com/drive/folders/1QdXTwo0zggBmHP1MBih6IMVCQ-WaoBBa?usp=sharing", img: "/documentacao.png", title: "Documentação", funcao: ["Admin"], external: true },
  ];

  const cardsPermitidos = cards.filter((card) => card.funcao.includes(usuario.funcao));

  return (
<div className="min-h-screen bg-gradient-to-br from-[#6a11cb] to-[#2575fc] text-white font-['Chakra_Petch'] text-[20px] pb-28">
  
  {/* Header com linha abaixo */}
  <div className="border-b border-white">
    <Header />
  </div>

  {/* Conteúdo principal */}
  <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
    {cardsPermitidos.length > 0 ? (
      cardsPermitidos.map((card, i) => (
        <Card
          key={i}
          to={card.to}
          imgSrc={card.img}
          imgAlt={card.title}
          title={card.title}
          external={card.external}
        />
      ))
    ) : (
      <div className="col-span-full text-center text-lg opacity-80">
        Nenhuma opção disponível.
      </div>
    )}
  </main>

  {/* Footer com linha acima */}
  <footer className="fixed bottom-0 w-full flex justify-between items-center px-5 py-3 bg-gradient-to-br from-[#6a11cb] to-[#2575fc] border-t border-white text-white text-sm shadow-md z-10">
    <img src="/Logo.png" alt="Logo" className="w-[120px]" />
    <div className="text-[15px] leading-tight">
      Seja bem-vindo
      <br />
      <p className="text-white">{usuario.nome || "Usuário"}</p>
    </div>
    <div className="font-mono text-[16px]">
      {time.toLocaleTimeString("pt-BR", { hour12: false })}
    </div>
  </footer>
</div>

  );
}
