import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { CiMenuFries } from "react-icons/ci";
import { Link } from "react-router-dom";

export default function Header() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  return (
    <>
      <nav>
        <div className="flex h-[77px] w-full items-center justify-between py-[20px] p-[96px] border-b">
          {/* Logo */}
          <div className="flex items-center flex-1">
            <span className="w-[235px] ">
              <img src="/logo.svg" alt="Logo-Instituto-Reciclar" />
            </span>
          </div>

          {/* Menu (Desktop) */}
          <div className="hidden lg:flex flex-1 items-center justify-end text-white">
            <ul className="flex gap-2 mr-16 mt-[-7px] text-[20px]">
              <Link to="/lista-pedidos">
                <button className="inline-flex items-center text-white justify-center text-[16px] transition-colors focus-visible:outline-none hover:text-primary h-[48px] px-4 py-2">
                  Pedidos
                </button>
              </Link>
              <Link to="/cadastro">
                <button className="inline-flex items-center text-white justify-center text-[16px] transition-colors focus-visible:outline-none hover:text-primary h-[48px] px-1 py-2">
                  Cadastros
                </button>
              </Link>
              <Link to="/relatorio">
                <button className="inline-flex items-center text-white justify-center text-[16px] transition-colors focus-visible:outline-none hover:text-primary h-[48px] px-4 py-2">
                  Relatório
                </button>
              </Link>
              <Link to="/retirada">
                <button className="inline-flex items-center text-white justify-center text-[16px] transition-colors focus-visible:outline-none hover:text-primary h-[48px] px-4 py-2">
                  Retirada
                </button>
              </Link>
              <Link to="/meu-perfil">
                <button className="inline-flex items-center text-white justify-center text-[16px] transition-colors focus-visible:outline-none hover:text-primary h-[48px] px-4 py-2">
                  <img src="/myUser.svg" className="h-[32px] w-[32px] rounded-full" alt="User" />
                </button>
            </Link>
            </ul>
          </div>

          {/* Botão do Menu - (Mobile) */}
          <button
            className="block lg:hidden text-white text-[30px] z-50"
            onClick={handleClick}>
            {click ? <FaTimes /> : <CiMenuFries />}
          </button>

          {/* Menu - (Mobile) */}
          <div className={`${ click ? "block" : "hidden" } lg:hidden absolute top-0 left-0 w-full h-screen bg-[#00009c] flex flex-col items-center justify-center transition-all duration-300 ease-in-out z-40`} >
            <ul className="text-center text-white text-xl">
              <Link to="/lista-pedidos">
                <li className="my-4 py-4 border-b border-[#00FF62] hover:bg-white hover:text-black hover:rounded">
                  Lista de Pedidos
                </li>
              </Link>
              <Link to="/cadastro">
                <li className="my-4 py-4 border-b border-[#00FF62] hover:bg-white hover:text-black hover:rounded">
                  Cadastro
                </li>
              </Link>
              <Link to="/relatorio">
                <li className="my-4 py-4 border-b border-[#00FF62] hover:bg-white hover:text-black hover:rounded">
                  Relatório
                </li>
              </Link>
              <Link to="/retirada">
                <li className="my-4 py-4 border-b border-[#00FF62] hover:bg-white hover:text-black hover:rounded">
                  Retirada
                </li>
              </Link>
              <Link to="/meu-perfil">
                <li className="my-4 py-4 border-b border-[#00FF62] hover:bg-white hover:text-black hover:rounded">
                  Meu Perfil
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </nav>

      {/* Overlay cobrindo o conteúdo da home */}
      <div className={`${click ? "hidden" : "block"}`}>
        {/* Conteúdo da Home (Cards) */}
        <div className="bg-white">
          <div className="container" style={{
              maxWidth: "2000px", height: "70vh",  margin: "0px auto",  textAlign: "center",  position: "relative",  top: "20vh", }} >
            <div style={{  display: "grid",  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",  gap: "20px",  position: "relative",  top: "5vh",  }} >
              {/* CARDS */}             
                {/* Card 1 - Lista Pedidos */}
                <div className="card bg-[#F6F6F6] border border-black  rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
                  <Link to={"/lista-pedidos"}>
                      <img src="/listaPedidos.svg" className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]" alt="Proteinas"/>
                      <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">Lista de Pedidos</h2>
                  </Link>
                </div>
                {/* Card 2 - Cadastro */}
                <div className="card bg-[#F6F6F6] border border-black  rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
                  <Link to={"/cadastro"}>
                      <img src="/cadastro.svg" className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]" alt="Mantimentos"/>
                      <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">Cadastro</h2>
                  </Link>
                </div>
                {/* Card 3 - Relatorios */}
                <div className="card bg-[#F6F6F6] border border-black  rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
                  <Link to={"/relatorio"}>
                      <img src="/relatorio.svg" className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]" alt="Relatorios"/>
                      <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">Relatórios</h2>
                  </Link>
                </div>
                {/* Card 4 - Retirada */}
                <div className="card bg-[#F6F6F6] border border-black  rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
                    <Link to={"/retirada"}>
                      <img src="/retirada.svg"className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]" alt="Voltar"/>
                      <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">Retirada</h2>
                  </Link>
                </div>                    
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
