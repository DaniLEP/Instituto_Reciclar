import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/card";

export default function RetiradaProdutos() {
  return (
    <>
      <div className="min-h-[100vh] p-[20px_0] bg-gradient-to-br from-[#6a11cb] to-[#2575fc] flex justify-center items-center">
        <div className=" mx-auto px-4 text-center">
          {/* Título Responsivo */}
          <span className="text-white font-bold  font-[Novatica Bold] text-8xl md:text-6xl lg:text-8xl"> Retiradas </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 mt-12">
            {/* Card 1 - Retirada */}
            <Card className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
              <Link to={"/Retirada"}>
                <img src="/retirada_produto.svg" className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]" alt="Retirada" />
                <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4"> Retirada </h2>
              </Link>
            </Card>
            {/* Card 2 - Histórico de Retirada */}
            <Card className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
                <Link to={"/Historico_Retirada"}>
                  <img src="/historico.svg"  alt="Histórico de Retirada" className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]" />
                  <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4"> Histórico de Retirada</h2>
                </Link>
            </Card>
            {/* Card 3 - Voltar */}
            <Card className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
                <Link to={"/Home"}>
                    <img src="/return.svg" alt="Voltar" className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]" />
                    <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">Voltar</h2>
                </Link>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
