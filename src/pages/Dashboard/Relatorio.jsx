import { Link } from "react-router-dom";

export default function Relatorio() {
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
        <div className="container mx-auto px-4 text-center">
          {/* Título Responsivo */}
          <span className="text-white font-bold  font-[Novatica Bold] text-8xl md:text-6xl lg:text-8xl mb-[10px]">
            Relatórios
          </span>

          <div className="grid grid-cols- sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Card  - Ref.Servidas */}
            <div className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
              <Link to={"#"}>
                {" "}
                {/*LINK EXATO "/Dashboard_Refeicoes" */}
                <img
                  src="/ref.servidas.svg"
                  className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]"
                  alt="Ref.Servidas"
                />
                <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">
                  {" "}
                  Ref.Servidas{" "}
                </h2>
              </Link>
            </div>

            {/* Card 2 - Retiradas */}
            <div className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
              <Link to={"#"}>
                {" "}
                {/*LINK EXATO "/Dashboard_Retiradas" */}
                <img
                  src="/retiradas.svg"
                  className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]"
                  alt="Histórico de Retirada"
                />
                <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">
                  Retiradas
                </h2>
              </Link>
            </div>

            {/* Relatorio anual */}
            <div className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
              <Link to={"#"}>
                {" "}
                {/*LINK EXATO "/Dashboard_Periodico" */}
                <img
                  src="/anual.svg"
                  className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]"
                  alt="Voltar"
                />
                <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">
                  Periódico
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
