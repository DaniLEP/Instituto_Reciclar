import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Card = ({ link, imgSrc, title, isBackCard }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
    <Link to={link} className="flex flex-col items-center text-center">
      {isBackCard ? (
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="h-[100px] md:h-[120px] lg:h-[140px] mb-4"
        />
      ) : (
        <img
          src={imgSrc}
          alt={title}
          className="h-[100px] md:h-[120px] lg:h-[140px] mb-4"
        />
      )}
      <h2 className="text-black text-xl md:text-2xl lg:text-3xl">{title}</h2>
    </Link>
  </div>
);

export default function  FichaTecnicaHome() {
   return (
    <div className="min-h-screen p-5 bg-gradient-to-br from-[#6a11cb] to-[#2575fc] flex justify-center items-center">
      <div className="text-center px-4">
        <h1 className="text-white font-bold text-6xl md:text-8xl">Ficha Técnica</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 mt-12">
          {/* Card 1 – Nova Retirada */}
          <Card className="align-center" link="/cadatro-receita" imgSrc="/Cadastro-receita.png" title="Cadastrar" />
          <Card className="align-center" link="/consultar-receita" imgSrc="/view-receita.png" title="Consultar" />
          <Card link="/cardapio" title="Voltar" isBackCard />
        </div>
      </div>
    </div>
  );
}


