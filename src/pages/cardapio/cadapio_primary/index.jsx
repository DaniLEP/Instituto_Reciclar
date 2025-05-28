import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Cardapio() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6a11cb] to-[#2575fc] py-10 px-4">
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-6">
          Cardápio / Ficha Técnica / Refeições
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card link="/ficha-tecnica" imgSrc="/receitinha.png" title="Ficha Técnica" />
          <Card link="/cardapios" imgSrc="/cardapinho.png" title="Cardápios" />
          <Card link="/refeicoes" imgSrc="/reefe.png" title="Refeições" />
          <Card link="/home" title="Voltar" isBackCard />
        </div>
      </div>
    </div>
  );
}

const Card = ({ link, imgSrc, title, isBackCard }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300">
      <Link
        to={link}
        className="flex flex-col items-center justify-center p-6 text-center h-full"
      >
        {isBackCard ? (
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="text-4xl md:text-5xl text-gray-700 mb-4"
          />
        ) : (
          <img
            src={imgSrc}
            alt={title}
            className="h-[110px] mx-auto mb-4 object-contain"
          />
        )}
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </Link>
    </div>
  );
};
