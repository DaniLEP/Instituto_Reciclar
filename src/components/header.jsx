// import  { useState } from "react";
// import {FaTimes} from "react-icons/fa";
// import { CiMenuFries } from "react-icons/ci";
// import { Link } from "react-router-dom";


// export default function Header  ()  {
//     const [click, setClick] = useState(false);
//     const handleClick = () => setClick(!click);
//     const content = () => <>
//     <div className="lg:hidden block relative top-16 w-full left-0 right-0 background-[00009c] transition">
//         <ul className="text-center text-white text-xl p-20">
//             <Link spy={true} smooth={true}  to="/ListaPedidos">
//                   <li className="my-4 py-4 border-b border-[#00FF62] hover:bg-white hover:rounded">Lista de Pedidos</li>
//             </Link>
//             <Link  spy={true} smooth={true} to="/Cadastro">
//                   <li className="my-4 py-4 border-b border-[#00FF62]  border-white hover:bg-white hover:rounded">Cadastr0</li>
//             </Link>
//             <Link spy={true} smooth={true} to="/Relatorio">
//                   <li className="my-4 py-4 border-b border-[#00FF62]  border-white hover:bg-white hover:rounded">Relatório</li>
//             </Link>
//             <Link  spy={true} smooth={true} to="/Retirada">
//                   <li className="my-4 py-4 border-b border-[#00FF62]  border-white hover:bg-white hover:rounded">Retirada</li>
//             </Link>
//         </ul>
//     </div>
//     </>
//     return(  
//         <nav>
//             <div className="flex h-[80px] w-full items-center justify-between py-[20px] px-[96px] border-b">
//             <div className="flex items-center flex-1">
//             <span style={{width: "150px", height: "105px", position: "relative", top: "2vh", right: "1vh"}}>
//                 <img src="/logo.svg" alt="Logo-Instituto-Reciclar" />
//             </span>
//             </div>
//             <div className="lg:flex md:flex  lg: flex-1 items center justify-end text-white !font-['Chakra Petch, sans serif'] hidden">
//                 <div className="flex-10 ">
//                     <ul className="flex gap-2 mr-16 mt-[-7px] text-[20px] ">
//                         <Link spy={true} smooth={true} to="/lista-pedidos">
//                             <button className="inline-flex items-center !text-[#09090B] justify-center whitespace-nowrap !rounded-none text-[16px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 !text-white underline-offset-4 hover:!text-primary !font-normal  border !border-none h-[48px] px-4 py-2">Lista de Pedidos</button>
//                         </Link>
//                         <Link spy={true} smooth={true} to="/cadastro">
//                         <button className="inline-flex items-center !text-[#09090B] justify-center whitespace-nowrap !rounded-none text-[16px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 !text-white underline-offset-4 hover:!text-primary !font-normal  border !border-none h-[48px] px-4 py-2">Cadastro</button>
//                         </Link>
//                         <Link spy={true} smooth={true} to="/relatorio">
//                              <button className="inline-flex items-center !text-[#09090B] justify-center whitespace-nowrap !rounded-none text-[16px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 !text-white underline-offset-4 hover:!text-primary !font-normal  border !border-none h-[48px] px-4 py-2">Relatório</button>
//                         </Link>
//                         <Link spy={true} smooth={true} to="/retirada">
//                              <button className="inline-flex items-center !text-[#09090B] justify-center whitespace-nowrap !rounded-none text-[16px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 !text-white underline-offset-4 hover:!text-primary !font-normal  border !border-none h-[48px] px-4 py-2">Retirada</button>
//                         </Link>
//                     </ul>                        
//                 </div>
//             </div>
//                 <div>
//                     {click && content}
//                 </div>
//                 <button className="block sm:hidden trasition block color-white text-white text-[30px]" onClick={handleClick}>
//                     {click ? <FaTimes/> : <CiMenuFries/>}
//                 </button>
//         </div>  
//     </nav>
//     )
// }

import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { CiMenuFries } from "react-icons/ci";
import { Link } from "react-router-dom";

export default function Header() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  return (
    <nav>
      <div className="flex h-[80px] w-full items-center justify-between py-[20px] px-[16px] lg:px-[96px] border-b">
        {/* Logo */}
        <div className="flex items-center flex-1">
          <span className="w-[150px] h-[105px] mt-5">
            <img src="/logo.svg" alt="Logo-Instituto-Reciclar" />
          </span>
        </div>

        {/* Menu (Desktop) */}
        <div className="hidden lg:flex md:flex lg:flex-1 items-center justify-end text-white !font-['Chakra Petch, sans serif']">
          <ul className="flex gap-2 mr-16 mt-[-7px] text-[20px] ">
            <Link spy={true} smooth={true} to="/lista-pedidos">
              <button className="inline-flex items-center !text-[#09090B] justify-center whitespace-nowrap !rounded-none text-[16px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 !text-white underline-offset-4 hover:!text-primary !font-normal border !border-none h-[48px] px-4 py-2">
                Lista de Pedidos
              </button>
            </Link>
            <Link spy={true} smooth={true} to="/cadastro">
              <button className="inline-flex items-center !text-[#09090B] justify-center whitespace-nowrap !rounded-none text-[16px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 !text-white underline-offset-4 hover:!text-primary !font-normal border !border-none h-[48px] px-4 py-2">
                Cadastro
              </button>
            </Link>
            <Link spy={true} smooth={true} to="/relatorio">
              <button className="inline-flex items-center !text-[#09090B] justify-center whitespace-nowrap !rounded-none text-[16px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 !text-white underline-offset-4 hover:!text-primary !font-normal border !border-none h-[48px] px-4 py-2">
                Relatório
              </button>
            </Link>
            <Link spy={true} smooth={true} to="/retirada">
              <button className="inline-flex items-center !text-[#09090B] justify-center whitespace-nowrap !rounded-none text-[16px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 !text-white underline-offset-4 hover:!text-primary !font-normal border !border-none h-[48px] px-4 py-2">
                Retirada
              </button>
            </Link>
          </ul>
        </div>

        {/* Menu (Mobile) */}
        <div className="lg:hidden block relative">
          {click && (
            <div className="absolute top-16 left-0 w-full bg-[#00009c] transition-all duration-300 ease-in-out">
              <ul className="text-center text-white text-xl p-20">
                <Link to="/lista-pedidos">
                  <li className="my-4 py-4 border-b border-[#00FF62] hover:bg-white hover:rounded">
                    Lista de Pedidos
                  </li>
                </Link>
                <Link to="/cadastro">
                  <li className="my-4 py-4 border-b border-[#00FF62] hover:bg-white hover:rounded">
                    Cadastro
                  </li>
                </Link>
                <Link to="/relatorio">
                  <li className="my-4 py-4 border-b border-[#00FF62] hover:bg-white hover:rounded">
                    Relatório
                  </li>
                </Link>
                <Link to="/retirada">
                  <li className="my-4 py-4 border-b border-[#00FF62] hover:bg-white hover:rounded">
                    Retirada
                  </li>
                </Link>
              </ul>
            </div>
          )}
        </div>

        {/* Botão do Menu (Mobile) */}
        <button
          className="block sm:hidden transition text-white text-[30px]"
          onClick={handleClick}
        >
          {click ? <FaTimes /> : <CiMenuFries />}
        </button>
      </div>
    </nav>
  );
}
