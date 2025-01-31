import { Link, useNavigate } from "react-router-dom";

export default function ListaPedidos() {
  const navigate = useNavigate();

  // Funções de navegação
  const goToShoppingList = () => navigate('/Cadastro_Produtos');
  const goToOrderStatus = () => navigate('/Gestão_Pedido');

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          padding: "20px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6a11cb, #2575fc)",

        }}
      >

        <div className=" mx-auto px-4 text-center">
          {/* Título Responsivo */}
          <h1 className="text-white font-bold font-[Novatica Bold] text-6xl lg:text-8xl ">
            Lista de Pedidos
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {/* Card 1 - Fazer Novo Pedido */}
            <div
              onClick={goToShoppingList}
              className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform"
            >
              <img
                src="/plus.svg"
                className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]"
                alt="Novo Pedido"
              />
              <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">
                Fazer Novo Pedido
              </h2>
            </div>

            {/* Card 2 - Status do Pedido */}
            <div
              onClick={goToOrderStatus}
              className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform"
            >
              <img
                src="/status.svg"
                className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]"
                alt="Status do Pedido"
              />
              <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">
                Status do Pedido
              </h2>
            </div>
            {/* Card 4 - Voltar */}
            <div className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
              <Link to="/Home">
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
