import Header from "../components/header"
import { Link } from "react-router-dom";

export default function Home () {
    return(
        <>
           <div
             style={{
                background: "White",
                fontFamily: "Chakra Petch , sans serif",
                fontSize: "20px",
                textAlign: "center"
           }}
        >
    {/* HEADER */}
      <div className="bg-[#00009c]">
        <Header />
      </div>
        {/* ATALHOS */}
        <div className="bg-white">
              {/* Container Responsivo */}
              <div className="container max-w-[2000px] h-[70vh] mx-auto text-center relative top-[9vh]">
                {/* Menu com Grid Responsivo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative top-[5vh]">
                  
                  {/* Card Lista de Pedidos */}
                  <div className="card bg-white rounded-lg shadow-md p-6 gap-3 cursor-pointer transition-transform duration-300 hover:scale-105">
                    <Link to={"/lista-pedidos"}>
                      <img src="/listaPedidos.svg" className="h-[120px] mx-auto" alt="Lista de Pedidos"/>
                      <h2 className="text-[24px] sm:text-[30px] lg:text-[40px] font-bold mt-4">Lista de Pedidos</h2>
                    </Link>
                  </div>

                  {/* Card Cadastro */}
                  <div className="card bg-white rounded-lg shadow-md p-6 cursor-pointer transition-transform duration-300 hover:scale-105">
                    <Link to={"/cadastro"}>
                      <img src="/cadastro.svg" className="h-[120px] mx-auto" alt="Cadastro"/>
                      <h2 className="text-[24px] sm:text-[30px] lg:text-[40px] font-bold mt-4">Cadastro</h2>
                    </Link>
                  </div>

                  {/* Card Relatórios */}
                  <div className="card bg-white rounded-lg shadow-md p-6 cursor-pointer transition-transform duration-300 hover:scale-105">
                    <Link to={"/relatorio"}>
                      <img src="/relatorio.svg" className="h-[120px] mx-auto" alt="Relatórios"/>
                      <h2 className="text-[24px] sm:text-[30px] lg:text-[40px] font-bold mt-4">Relatórios</h2>
                    </Link>
                  </div>

                  {/* Card Retirada */}
                  <div className="card bg-white rounded-lg shadow-md p-6 cursor-pointer transition-transform duration-300 hover:scale-105">
                    <Link to={"/retirada"}>
                      <img src="/retirada.svg" className="h-[120px] mx-auto" alt="Retirada"/>
                      <h2 className="text-[24px] sm:text-[30px] lg:text-[40px] font-bold mt-4">Retirada</h2>
                    </Link>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </>
    )
}