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
                textAlign: "center",
                overflow: "hidden"
           }}
        >
    {/* HEADER */}
      <div className="bg-[#00009c]">
        <Header />
      </div>
        {/* ATALHOS */}
          <div className="bg-white">
                  <div /*container*/ className="container" style={{maxWidth: "2000px", height:"70vh", margin: "0px auto", textAlign: "center", position: "relative",top: "20vh"}}>          
                    <div /*menu*/ style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",  gap:"20px", position: "relative", top: "5vh" }}>
                          {/* CARDS */}        
                    <div className="card" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", marginBottom: "10px", textDecoration: "bold", color: "black"}}>
                      <Link spy={true} smooth={true} to={"/lista-pedidos"} onclick="navigateTo('ListaPedidos')">
                        <img src="/listaPedidos.svg" className="h-[120px] ml-24"/>
                        <h2 className="text-[40px]">Lista de Pedidos</h2>
                      </Link>
                    </div>
                    <div className="card" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", marginBottom: "10px", textDecoration: "bold", color: "black"}}>
                      <Link spy={true} smooth={true} to={"/cadastro"} onclick="navigateTo('CadastroGeral')">
                        <img src="/cadastro.svg" className="h-[120px] ml-24"/>
                        <h2 className="text-[40px]">Cadastro</h2>
                      </Link>
                    </div>
                    <div className="card" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", marginBottom: "10px", textDecoration: "bold", color: "black"}}>
                        <Link spy={true} smooth={true} to={"/relatorio"} onclick="navigateTo('Ref.Servidas')">
                         <img src="/relatorio.svg" className="h-[120px] ml-20"/>
                        <h2 className="text-[40px]">Relatórios</h2>
                      </Link>
                    </div>
                    <div className="card" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", marginBottom: "10px", textDecoration: "bold", color: "black"}}>
                      <Link spy={true} smooth={true} to={"/retirada"} onclick="navigateTo('Ref.Servidas')">
                        <img src="/retirada.svg" className="h-[120px] ml-20"/>
                        <h2 className="text-[40px]">Retirada</h2>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
    )
}