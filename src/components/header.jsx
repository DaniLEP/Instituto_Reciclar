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
                  Lista de Pedidos
                </button>
              </Link>
              <Link to="/cadastro">
                <button className="inline-flex items-center text-white justify-center text-[16px] transition-colors focus-visible:outline-none hover:text-primary h-[48px] px-1 py-2">
                  Cadastro
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

          {/* Botão do Menu (Mobile) */}
          <button
            className="block lg:hidden text-white text-[30px] z-50"
            onClick={handleClick}
          >
            {click ? <FaTimes /> : <CiMenuFries />}
          </button>

          {/* Menu (Mobile) */}
          <div
            className={`${
              click ? "block" : "hidden"
            } lg:hidden absolute top-0 left-0 w-full h-screen bg-[#00009c] flex flex-col items-center justify-center transition-all duration-300 ease-in-out z-40`}
          >
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
          <div
            className="container"
            style={{
              maxWidth: "2000px",
              height: "70vh",
              margin: "0px auto",
              textAlign: "center",
              position: "relative",
              top: "20vh",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
                position: "relative",
                top: "5vh",
              }}
            >
              {/* CARDS */}
              <div
                className="card"
                style={{
                  background: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  padding: "20px",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                  marginBottom: "10px",
                  color: "black",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center", // Garantindo que o conteúdo fique centralizado
                }}
              >
                <Link to="/lista-pedidos">
                  <img src="/listaPedidos.svg" className="h-[120px] ml-[65px]" />
                  <h2 className="text-[40px]">Lista de Pedidos</h2>
                </Link>
              </div>
              <div
                className="card"
                style={{
                  background: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  padding: "20px",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                  marginBottom: "10px",
                  color: "black",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Link to="/cadastro">
                  <img src="/cadastro.svg" className="h-[120px] ml-[10px]" />
                  <h2 className="text-[40px]">Cadastro</h2>
                </Link>
              </div>
              <div
                className="card"
                style={{
                  background: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  padding: "20px",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                  marginBottom: "10px",
                  color: "black",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Link to="/relatorio">
                  <img src="/relatorio.svg" className="h-[120px] ml-[20px]" />
                  <h2 className="text-[40px]">Relatórios</h2>
                </Link>
              </div>
              <div
                className="card"
                style={{
                  background: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  padding: "20px",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                  marginBottom: "10px",
                  color: "black",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Link to="/retirada">
                  <img src="/retirada.svg" className="h-[120px] ml-[10px]" />
                  <h2 className="text-[40px]">Retirada</h2>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
