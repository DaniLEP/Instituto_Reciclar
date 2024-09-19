
import { Link } from "react-router-dom";
export default function Relatorio  ()  {
    return(
        <>
        <div className="bg-[#00009c]">
                <div /*container*/ className="container" style={{maxWidth: "1050px", height: "110vh", margin: "0px auto", textAlign: "center", top: "10vh"}}>
                    <span className="text-[5.1rem] font-bold font-[ChakraPetch] font-[italic] text-white text-left mr-10">Relatório</span>
        
                    <div /*menu*/ style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))",  gap:"20px", position: "relative", top: "5vh" }}> 
                            {/* CARDS */}
                            <div className="card" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", fontSize: "2rem", marginBottom: "10px", textDecoration: "bold", color: "black"}}>
                                <Link spy={true} smooth={true} to={"/relatorio-proteinas"} onclick="navigateTo('proteinas')">
                                    <img src="/proteinas.svg" className="h-[110px] ml-8 mt-2"/>
                                        <h2 className="text-[35px]">Proteínas</h2>
                                </Link>
                            </div>

                            <div className="card" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", fontSize: "2rem", marginBottom: "10px", textDecoration: "bold", color: "black"}}>
                                <Link spy={true} smooth={true}  to={"/relatorio-mantimento"} onclick="navigateTo('cadastro-mantimentos')">
                                    <img src="/mantimentos.svg" className=" h-[120px]"/>
                                        <h2 className="text-[35px]">Mantimentos</h2>
                                </Link>
                            </div>

                            <div className="card" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", fontSize: "2rem", marginBottom: "10px", textDecoration: "bold", color: "black"}}>
                                <Link spy={true} smooth={true} to={"/relatorio-hortalicas"} onclick="navigateTo('Hortalicas')">
                                    <img src="/hortalicas.svg" className="h-[120px]"/>
                                        <h2 className="text-[35px]">Hortaliças</h2>
                                </Link>
                            </div>
                            <div className="card" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", fontSize: "2rem", marginBottom: "10px", textDecoration: "bold", color: "black"}}>
                                <Link spy={true} smooth={true} to={"/relatorio-doacoes-recebidas"} onclick="navigateTo('DoacoesRecebidas')">
                                    <img src="/doacoes.svg" className="h-[120px] "/>
                                        <h2 className="text-[35px]">Doações Recebidas</h2>
                                </Link>
                            </div>
                            <div className="card" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", fontSize: "2rem", marginBottom: "10px", textDecoration: "bold", color: "black"}}>
                                <Link spy={true} smooth={true} to={"/relatorio-refeicoes"} onclick="navigateTo('Ref.Servidas')">
                                    <img src="/ref.servidas.svg" className="h-[120px] ml-6"/>
                                        <h2 className="text-[35px]">Ref.Servidas</h2>
                                </Link>
                            </div>
                            <div className="card" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", fontSize: "2rem", marginBottom: "10px", textDecoration: "bold", color: "black"}}>
                                <Link spy={true} smooth={true} to={"/relatorio-retiradas"} onclick="navigateTo('#')">
                                    <img src="/retiradas.svg" className="h-[120px] ml-8"/>
                                        <h2 className="text-[35px]">Retiradas</h2>
                                </Link>
                            </div>
                            <div className="card" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", fontSize: "2rem", marginBottom: "10px", textDecoration: "bold", color: "black"}}>
                                <Link spy={true} smooth={true} to={"/relatorio-anual-mensal"} onclick="navigateTo('Anual-Mensal')">
                                    <img src="/anual.svg" className="h-[110px] ml-8 mt-2"/>
                                        <h2 className="text-[35px]">Anual/Mensal</h2>
                                </Link>
                            </div>
                            <div className="card"  style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", fontSize: "1.5rem", marginBottom: "10px", textDecoration: "none", color: "black"}}>
                                <Link spy={true} smooth={true} to={"/"} onclick="navigateTo('Home')">
                                    <img src="/return.svg" className="h-[120px] ml-8 mt-8"/>
                                </Link>
                            </div>
                         
                    </div>
            </div>
        </div>
        </>
    )
}

