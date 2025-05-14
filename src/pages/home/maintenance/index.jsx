import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export default function HomeMaintenance() {
  const navigate = useNavigate();
  const goToChecklist = () => navigate('/checkList');
  const goToMaintences = () => navigate('/manutencao');

  return (
    <>
      <div className="min-h-screen py-5 flex items-center justify-center bg-gradient-to-br from-[#6a11cb] to-[#2575fc]">
        <div className=" mx-auto px-4 text-center">
          {/* Título Responsivo */}
          <h1 className="text-white font-bold font-[Novatica Bold] text-6xl lg:text-8xl ">Manutenções</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {/* Card 1 - Fazer Novo Pedido */}
            <div onClick={goToChecklist} className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
              <img src="/Check.png" className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]" alt="CheckList"/>
              <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">CheckList Diario</h2>
            </div>
              {/* Card 2 - Status do Pedido */}
              <div onClick={goToMaintences} className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
                <img src="/maintences.png" className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]" alt="Status do Pedido"/>
                <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">Manutenções</h2>
              </div>
                {/* Card 3 - Voltar */}
                <div className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
                  <Link to="/Home">
                 
                    <FontAwesomeIcon icon={faArrowLeft} className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]" />
                    <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">Voltar</h2>
                  </Link>
                </div>
          </div>
        </div>
      </div>
    </>
  );
}
