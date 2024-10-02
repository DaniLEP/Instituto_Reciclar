import { Link } from "react-router-dom";

export default function ListaPedidos() {
        return (
        <>
            <div className="bg-[#00009c] min-h-screen flex flex-col items-center justify-center">
                <div className="container mx-auto px-4 text-center">
                    {/* Título Responsivo */}
                    <span className="text-white font-bold  font-[ChakraPetch] text-4xl md:text-6xl lg:text-7xl">
                        Lista de Pedidos
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                        {/* Card 1 - Estoque */}
                        <div className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
                            <Link to={"/Proteina"}>
                                <img src="/proteinas.svg" className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]" alt="Proteinas"/>
                                <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">Proteínas</h2>
                            </Link>
                        </div>
                        {/* Card  - Ref.Servidas */}
                        <div className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
                            <Link to={"/Mantimentos"}>
                                <img src="/mantimentos.svg" className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]" alt="Mantimentos"/>
                                <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">Mantimentos</h2>
                            </Link>
                        </div>

                        {/* Card 2 - Retiradas */}
                        <div className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
                            <Link to={"/relatorio-retiradas"}>
                                <img src="/hortalicas.svg" className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]" alt="Hortaliças"/>
                                <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">Hortaliças</h2>
                            </Link>
                        </div>

                        {/* Card 3 - Voltar */}
                        <div className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
                            <Link to={"/"}>
                                <img src="/return.svg" className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]" alt="Voltar"/>
                                <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4"> Voltar </h2>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
