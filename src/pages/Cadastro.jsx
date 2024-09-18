import { Link } from "react-router-dom";
export default function Cadastro  ()  {
    return(
        <>
        <div className="bg-[#00009c]">
                <div /*container*/ className="container" style={{maxWidth: "1000px", height: "100vh", margin: "0px auto", textAlign: "center", top: "10vh"}}>
                    <span className="text-[5.1rem] font-bold font-[ChakraPetch] font-[italic] text-white text-left mr-10">Cadastro</span>
        
                    <div /*menu*/ style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 2fr))",  gap:"20px", position: "relative", top: "5vh" }}> 
                            {/* CARDS */}
                            <div className="card" style={{ 
                                   backgroundColor: "#fff",
                                   borderRadius: "8px",
                                   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                   padding: "20px",
                                   cursor: "pointer",
                                   transition: "transform 0.3s ease", 
                                   fontSize: "1.5rem",
                                   marginBottom: "10px",
                                   textDecoration: "none",
                                   color: "black"
                                }}>
                                <Link  spy={true} smooth={true} to={"/Proteina"} onclick="navigateTo('cadastro-proteina')">
                                    <img src="/public/proteinas.svg" className="ml-11 h-[120px]"/>
                                        <h2 className="text-[40px]">Proteínas</h2>
                                </Link>
                            </div>

                            <div className="card" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", fontSize: "2rem", marginBottom: "10px", textDecoration: "bold", color: "black"}}>
                                <Link spy={true} smooth={true}  to={"/Mantimento"} onclick="navigateTo('cadastro-mantimentos')">
                                    <img src="/public/mantimentos.svg" className=" h-[120px]"/>
                                        <h2 className="text-[40px]">Mantimentos</h2>
                                </Link>
                            </div>

                            <div className="card" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", fontSize: "2rem", marginBottom: "10px", textDecoration: "bold", color: "black"}}>
                                <Link spy={true} smooth={true} to={"/Hortalicas"} onclick="navigateTo('Hortalicas')">
                                    <img src="/public/hortalicas.svg" className="h-[120px] ml-5"/>
                                        <h2 className="text-[40px]">Hortaliças</h2>
                                </Link>
                            </div>
                            <div className="card" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", fontSize: "2rem", marginBottom: "10px", textDecoration: "bold", color: "black"}}>
                                <Link spy={true} smooth={true} to={"/Cad.Refeicoes"} onclick="navigateTo('Ref.Servidas')">
                                    <img src="/public/ref.servidas.svg" className="h-[120px] ml-14"/>
                                        <h2 className="text-[40px]">Ref.Servidas</h2>
                                </Link>
                            </div>
                            <div className="card" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", fontSize: "2rem", marginBottom: "10px", textDecoration: "bold", color: "black"}}>
                                <Link spy={true} smooth={true} to={"/Hortalicas"} onclick="navigateTo('Hortalicas')">
                                    <img src="/public/retiradas.svg" className="h-[120px] ml-20"/>
                                        <h2 className="text-[40px]">Retiradas</h2>
                                </Link>
                            </div>
                            <div className="card"  style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", cursor: "pointer", transition: "transform 0.3s ease", fontSize: "1.5rem", marginBottom: "10px", textDecoration: "none", color: "black"}}>
                                <Link spy={true} smooth={true} to={"/"} onclick="navigateTo('Home')">
                                    <img src="/public/return.svg" className="h-[120px] ml-16 mt-5"/>
                                </Link>
                            </div>
                         
                    </div>
            </div>
        </div>
        </>
    )
}

