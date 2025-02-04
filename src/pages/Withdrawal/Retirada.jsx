import { Link } from "react-router-dom";

export default function Retirada() {
  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          padding: "20px 0",
          display: "flex", // Adicionado display flex
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        }}
      >
        {" "}
        <div className=" mx-auto px-4 text-center">
          {/* Título Responsivo */}
          <span className="text-white font-bold  font-[Novatica Bold] text-8xl md:text-6xl lg:text-8xl">
            Retiradas
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 mt-12">
            {/* Card 1 - Retirada */}
            <div className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
              <Link to={"/Retirada_Produtos"}>
                <img
                  src="/retirada_produto.svg"
                  className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]"
                  alt="Retirada"
                />
                <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">
                  Retirada
                </h2>
              </Link>
            </div>

            {/* Card 2 - Histórico de Retirada */}
            <div className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
              <Link to={"/Historico_Retirada"}>
                <img
                  src="/historico.svg"
                  className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]"
                  alt="Histórico de Retirada"
                />
                <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">
                  Histórico de Retirada
                </h2>
              </Link>
            </div>

            {/* Card 3 - Voltar */}
            <div className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
              <Link to={"/Home"}>
                <img
                  src="/return.svg"
                  className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]"
                  alt="Voltar"
                />
                <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">
                  Voltar
                </h2>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
