import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { CiMenuFries } from "react-icons/ci";
import { Link } from "react-router-dom";

export default function Header() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  return (
    <nav className="text-white shadow-md">
      <div className="flex items-center justify-between h-[77px] px-6 lg:px-20">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/logo.svg" alt="Logo-Instituto-Reciclar" className="w-[230px] sm:w-[230px] " />
        </div>
        {/* Menu (Desktop) */}
        <div className="hidden lg:flex items-center space-x-3 text-[18px]">
          <Link to="/Pedidos" className="hover:text-[#00FF62] transition">Pedidos</Link>
          <Link to="/Cadastro" className="hover:text-[#00FF62] transition">Cadastros</Link>
          <Link to="/Dashboard" className="hover:text-[#00FF62] transition">Relatório  </Link>
          <Link to="/retirada" className="hover:text-[#00FF62] transition">Retirada</Link>
          <Link to="/Verificacao_Usuario" className="hover:text-[#00FF62] transition">Controle de Usuários</Link> 
          <Link to="/Estoque" className="hover:text-[#00FF62] transition">Estoque </Link>
          <Link to="/cardapio" className="hover:text-[#00FF62] transition">Cardápio </Link>
          <Link to="/manutencao-home" className="hover:text-[#00FF62] transition">Manutenção </Link>
          <Link to="https://drive.google.com/drive/folders/1QdXTwo0zggBmHP1MBih6IMVCQ-WaoBBa?usp=sharing"  target="_blank"  className="hover:text-[#00FF62] transition">Documentação </Link>
          <Link to="/Meu_Perfil"> <img src="/myUser.svg" alt="User" className="h-10 w-10 rounded-full border-2 border-white hover:border-[#00FF62] transition" /> </Link>
        </div>
        {/* Menu Hamburguer (Mobile) */}
        <button className="lg:hidden text-[30px] z-50 focus:outline-none"  onClick={handleClick} aria-label="Menu" > {click ? <FaTimes /> : <CiMenuFries />} </button>
      </div>
      {/* Menu (Mobile) */}
      <div className={`${click ? "translate-x-1" : "translate-x-full"} fixed top-0 right-0 w-[70%] h-screen bg-gradient-to-br from-[#6a11cb] to-[#2575fc] shadow-lg z-40 transition-transform duration-200 ease-in-out`}>
        <div className="flex flex-col items-center pt-10 space-y-6 text-lg">
          <Link to="#" className="hover:text-[#00FF62] transition" onClick={handleClick}>Pedidos </Link>
          <Link to="/Cadastro"className="hover:text-[#00FF62] transition"onClick={handleClick} > Cadastros </Link>
          <Link to="/Dashboard" className="hover:text-[#00FF62] transition"onClick={handleClick} >Relatório</Link>
          <Link to="/retirada"  className="hover:text-[#00FF62] transition"  onClick={handleClick}>Retirada</Link>
          <Link to="/Verificacao_Usuario"  className="hover:text-[#00FF62] transition"  onClick={handleClick}>Controle de Usuários </Link>
          <Link to="/Estoque" className="hover:text-[#00FF62] transition"  onClick={handleClick}>Estoque</Link>
         <Link to="/cardapio" className="hover:text-[#00FF62] transition">Cardápio </Link>
          <Link to="/manutencao-home" className="hover:text-[#00FF62] transition">Manutenção </Link>
          <Link to="https://drive.google.com/drive/folders/1QdXTwo0zggBmHP1MBih6IMVCQ-WaoBBa?usp=sharing"  target="_blank"className="hover:text-[#00FF62] transition">Documentação </Link>
          <Link to="/Meu_Perfil" onClick={handleClick}><img src="/myUser.svg" alt="User"  className="h-16 w-16 rounded-full border-2 border-white hover:border-[#00FF62] transition" /> </Link>
        </div>
      </div>
    </nav>
  );
}
