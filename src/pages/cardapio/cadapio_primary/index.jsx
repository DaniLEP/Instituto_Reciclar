import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export default function  Cardapio() {
  return (
    <div style={{minHeight: "100vh", padding: "20px 0", display: 'flex', alignItems: 'center', justifyContent: 'center', background: "linear-gradient(135deg, #6a11cb, #2575fc)"}}>
      <div>
        <h1 className="text-[5rem] font-bold text-white space-x-6 text-center mb-4">Cardápios</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cards */}
          <Card link="/cadastro-de-almoço" imgSrc="/almoço.png" title="Cadastro de Cardápio de Almoço" />
          <Card link="/cadastro-cardápio-lanche" imgSrc="/cafe-da-manha.png" title="Cadastro de Cardápio de Lanche da Tarde" />  
          <Card link="/Cadastro_Refeicoes" imgSrc="/refeição.jpeg" title="Cadastro de Refeições" />
          <Card className="align-center" link="/Refeicoes_Servidas" imgSrc="/prancheta.png" title="Lista de Refeições" />
          <Card className="align-center" link="/cardápio-lanche" imgSrc="/lanchetarde.png" title="Lista de Cardápios de Lanche da Tarde " />
          <Card className="align-center" link="/cardápio-almoco" imgSrc="/list-almoço.png" title="Lista de Cardápios de Almoço" />
          <Card className="align-center" link="/" imgSrc="/Cadastro-receita.png" title="Cadatro de Ficha Técnica" />
          <Card className="align-center" link="/" imgSrc="/view-receita.png" title="Consulta Ficha Técnica" />
          <Card link="/Home" title="Voltar" isBackCard />
        </div>
      </div>
    </div>
  );
}
const Card = ({ link, imgSrc, title, isBackCard }) => {
  return (
    <div className="bg-gray-100 rounded-lg shadow-md transition-transform transform hover:scale-105">
      <Link to={link} className="flex flex-col items-center p-6 text-center">
        {isBackCard ? (<FontAwesomeIcon icon={faArrowLeft} className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]" />) 
        : (<img src={imgSrc} className="h-[110px] mx-auto mb-1 mt-1" alt={title} />)}
        <h2 className={`text-[1.5rem] font-bold text-black`}>{title}</h2>
      </Link>
    </div>
  );
};

