import React, { useState } from "react";
import {FaTimes} from "react-icons/fa";
import { CiMenuFries } from "react-icons/ci";
import { Link } from "react-router-dom";


export default function Header  ()  {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const content = () => <>
    <div className="lg:hidden block absolute top-16 w-full left-0 right-0 background-[00009c] transition">
        <ul className="text-center text-white text-xl p-20">
            <Link spy={true} smooth={true}  to="/ListaPedidos">
                  <li className="my-4 py-4 border-b border-[#00FF62] hover:bg-white hover:rounded">Lista de Pedidos</li>
            </Link>
            <Link  spy={true} smooth={true} to="/RefServidas">
                  <li className="my-4 py-4 border-b border-[#00FF62]  border-white hover:bg-white hover:rounded">Ref.Servidas</li>
            </Link>
            <Link spy={true} smooth={true} to="/Relatorio">
                  <li className="my-4 py-4 border-b border-[#00FF62]  border-white hover:bg-white hover:rounded">Relatório</li>
            </Link>
            <Link  spy={true} smooth={true} to="/Retirada">
                  <li className="my-4 py-4 border-b border-[#00FF62]  border-white hover:bg-white hover:rounded">Retirada</li>
            </Link>
        </ul>
    </div>
    </>
    return(  
        <nav>
            <div className="h-1px flex-0 z-5 lg:py-4 px-20 py-3 flex">
            <div className="flex items-center flex-1">
            <span className="w-[20vh] h-[70px]">
                <img src="/public/Reciclar_Logo_Principal_Vertical_Negativo.png" alt="Logo-Instituto-Reciclar" />
            </span>
            </div>
            <div className="lg:flex md:flex  lg: flex-1 items center justify-end text-white !font-['Chakra Petch, sans serif'] hidden">
                <div className="flex-10 ">
                    <ul className="flex gap-8 mr-16 mt-[20px] text-[12px] ">
                        <Link spy={true} smooth={true} to="/ListaPedidos">
                            <li className="hover:text-[#00FF62] transition border-b-2   hover:border-[#00FF62] cursor-pointer">Lista de Pedidos</li>
                        </Link>
                        <Link spy={true} smooth={true} to="/RefServidas">
                            <li className="hover:text-[#00FF62] transition border-b-2   hover:border-[#00FF62] cursor-pointer">Ref.Servidas</li>
                        </Link>
                        <Link spy={true} smooth={true} to="/Relatorio">
                            <li className="hover:text-[#00FF62] transition border-b-2   hover:border-[#00FF62] cursor-pointer">Relatório</li>
                        </Link>
                        <Link spy={true} smooth={true} to="/Retirada">
                            <li className="hover:text-[#00FF62] transition border-b-2   hover:border-[#00FF62] cursor-pointer">Retirada</li>
                        </Link>
                    </ul>                        
                </div>
            </div>
                <div>
                    {click && content}
                </div>
                <button className="block sm:hidden trasition block color-white" onClick={handleClick}>
                    {click ? <FaTimes/> : <CiMenuFries/>}
                </button>
        </div>  
    </nav>
    )
}