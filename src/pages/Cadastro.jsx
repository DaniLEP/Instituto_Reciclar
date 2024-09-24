import { Link } from "react-router-dom";
export default function Cadastro  ()  {
    return(
        <>
        <div className="bg-[#00009c]">
                <div /*container*/ className="container" style={{maxWidth: "700px", height: "110vh", margin: "0px auto", textAlign: "center", top: "10vh"}}>
                    <span className="text-[5.1rem] font-bold font-[ChakraPetch] font-[italic] text-white text-left mr-10">Cadastro</span>
        
                    <div /*menu*/ style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",  gap:"20px", position: "relative", top: "5vh" }}> 
                            {/* CARDS */}
                           
                            <div className="card" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", fontSize: "2rem", marginBottom: "10px", textDecoration: "bold", color: "black"}}>
                                <Link spy={true} smooth={true} to={"/entrada-produtos"} onclick="navigateTo('Entrada')">
                                    <img src="/entrada.svg" className="h-[120px] ml-24"/>
                                        <h2 className="text-[40px]">Entrada de Produtos</h2>
                                </Link>
                            </div>
                            <div className="card" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", fontSize: "2rem", marginBottom: "10px", textDecoration: "bold", color: "black"}}>
                                <Link spy={true} smooth={true} to={"/cadastro-geral"} onclick="navigateTo('CadastroGeral')">
                                    <img src="/cadastro.svg" className="h-[120px] ml-24"/>
                                        <h2 className="text-[40px]">Cadastro de Produtos</h2>
                                </Link>
                            </div>
                            <div className="card" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", fontSize: "2rem", marginBottom: "10px", textDecoration: "bold", color: "black"}}>
                                <Link spy={true} smooth={true} to={"/cad-refeicoes"} onclick="navigateTo('Ref.Servidas')">
                                    <img src="/ref.servidas.svg" className="h-[120px] ml-16"/>
                                        <h2 className="text-[40px]">Ref.Servidas</h2>
                                </Link>
                            </div>
                            <div className="card"  style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", fontSize: "1.5rem", marginBottom: "10px", textDecoration: "none", color: "black"}}>
                                <Link spy={true} smooth={true} to={"/"} onclick="navigateTo('Home')">
                                    <img src="/return.svg" className="h-[120px] ml-20 mt-5"/>
                                </Link>
                            </div>
                         
                    </div>
            </div>
        </div>
        </>
    )
}

