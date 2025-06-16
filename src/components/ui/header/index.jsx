
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { CiMenuFries } from "react-icons/ci";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";

export default function Header() {
  const [click, setClick] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleClick = () => setClick(!click);

  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = ref(db, `usuarios/${user.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            setUserRole(data.funcao);
          } else {
            setUserRole(null);
          }
        } catch {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });
  }, []);

  const menuLinks = [
    { path: "/Pedidos", label: "Pedidos/Compras", funcao: ["Admin", ""] },
    { path: "/Cadastro", label: "Cadastros", funcao: ["Admin", "editor"] },
    { path: "/Dashboard", label: "Relatório", funcao: ["", "editor", "analista"] },
    { path: "/retirada", label: "Retirada", funcao: ["Admin", "Cozinha"] },
    { path: "/Verificacao_Usuario", label: "Gerenciador de Usuários", funcao: ["Admin"] },
    { path: "/Estoque", label: "Estoque", funcao: ["Admin", "Cozinha"] },
    { path: "/cardapio", label: "Cardápio / Ficha Técnica / Refeições", funcao: ["Admin", "Cozinha", "Nutricionista"] },
    { path: "/manutencao-home", label: "Manutenção", funcao: ["Admin", "tecnico"] },
    {
      path: "https://drive.google.com/drive/folders/1QdXTwo0zggBmHP1MBih6IMVCQ-WaoBBa?usp=sharing",
      label: "Documentação",
      funcao: ["Admin"],
      external: true,
    },
  ];

  const renderLinks = (isMobile = false) => {
    if (loading) {
      return <span>Carregando...</span>;
    }

    if (!userRole) {
      return <span>Usuário não autenticado</span>;
    }

    return menuLinks
      .filter((link) => link.funcao.includes(userRole))
      .map((link, index) =>
        link.external ? (
          <a
            key={index}
            href={link.path}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#00FF62] transition"
            onClick={isMobile ? handleClick : undefined}
          >
            {link.label}
          </a>
        ) : (
          <Link
            key={index}
            to={link.path}
            className="hover:text-[#00FF62] transition"
            onClick={isMobile ? handleClick : undefined}
          >
            {link.label}
          </Link>
        )
      );
  };

  return (
    <nav className="text-white shadow-md">
      <div className="flex items-center justify-between h-[77px] px-6 lg:px-20">
        <div className="flex items-center">
          <img src="/logo.svg" alt="Logo-Instituto-Reciclar" className="w-[230px] sm:w-[230px]" />
        </div>

        <div className="hidden lg:flex items-center space-x-3 text-[14px]">
          {renderLinks()}
          <Link to="/Meu_Perfil">
            <img
              src="/myUser.svg"
              alt="User"
              className="h-10 w-10 rounded-full border-2 border-white hover:border-[#00FF62] transition"
            />
          </Link>
        </div>

        <button
          className="lg:hidden text-[30px] z-50 focus:outline-none"
          onClick={handleClick}
          aria-label="Menu"
        >
          {click ? <FaTimes /> : <CiMenuFries />}
        </button>
      </div>

      <div
        className={`${
          click ? "translate-x-1" : "translate-x-full"
        } fixed top-0 right-0 w-[70%] h-screen bg-gradient-to-br from-[#6a11cb] to-[#2575fc] shadow-lg z-40 transition-transform duration-200 ease-in-out`}
      >
        <div className="flex flex-col items-center pt-10 space-y-6 text-lg">
          {renderLinks(true)}
          <Link to="/Meu_Perfil" onClick={handleClick}>
            <img
              src="/myUser.svg"
              alt="User"
              className="h-16 w-16 rounded-full border-2 border-white hover:border-[#00FF62] transition"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}
