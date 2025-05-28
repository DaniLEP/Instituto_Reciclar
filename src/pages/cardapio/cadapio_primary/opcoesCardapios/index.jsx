import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function OpcoesCardapios() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6a11cb] to-[#2575fc] py-10 px-4">
      <div className="w-full max-w-7xl">
        <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-2">
          Cardápio
        </h1>
        <p className="text-lg font-semibold text-white text-center mb-8">
          Cadastro / Consulta
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Card
            link="/cadastro-cardapio-cafe"
            imgSrc="/coffe.png"
            title="Cadastrar Café da Manhã"
          />
          <Card
            link="/consultar-cardapio-cafe"
            imgSrc="/cafe.png"
            title="Consultar Café da Manhã"
          />
          <Card
            link="/cadastro-de-almoco"
            imgSrc="/almoço.png"
            title="Cadastrar Almoço"
          />
          <Card
            link="/cardapio-almoco"
            imgSrc="/list-almoço.png"
            title="Consultar Almoço"
          />
          <Card
            link="/cadastro-cardapio-lanche"
            imgSrc="/cafe-da-manha.png"
            title="Cadastrar Lanche da Tarde"
          />
          <Card
            link="/cardapio-lanche"
            imgSrc="/lanchinho.png"
            title="Consultar Lanche da Tarde"
          />
          <Card link="/cardapio" title="Voltar" isBackCard />
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
