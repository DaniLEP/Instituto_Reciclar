import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export default function Cadastro() {
  return (
    <div style={{
      minHeight: "100vh",
      padding: "20px 0",
      display: 'flex', // Adicionado display flex
      alignItems: 'center',
      justifyContent: 'center',
      background: "linear-gradient(135deg, #6a11cb, #2575fc)",
    }}
  >
      <div>
        <h1 className="text-[5rem] font-bold text-white space-x-6 text-center mb-4">
          Cadastro
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cards */}
          <Card
            link="/Cadastro_Geral"
            imgSrc="/cadastro.png"
            title="Cadastro de Produtos"
          />
          <Card
            link="/Gerenciador_Produtos"
            imgSrc="/caracteristicas.png"
            title="Produtos Cadastrados"
          />  
          <Card
            link="/Entrada_Produtos"
            imgSrc="/caixa-de-entrada.png"
            title="Entrada de Produtos"
          />
          <Card
            link="/Cadastro_Fornecedor"
            imgSrc="/forncedor.png"
            title="Fornecedor"
          />
            <Card
            link="/Visualizar_Fornecedores"
            imgSrc="/lista-de-contatos.png"            
            title="Lista de Fornecedores"
          />
          <Card
            link="/Cadastro_Refeicoes" ///Cadastro_Refeicoes link exato
            imgSrc="/ref.servidas.svg"
            title="Cadastro de Refeições"
          />
          <Card className="align-center"
            link="/Refeicoes_Servidas" 
            imgSrc="/prancheta.png"
            title="Lista de Refeições"
          />

          <Card
            link="/Home"
            title="Voltar"
            isBackCard
          />
        </div>
      </div>
    </div>
  );
}''
const Card = ({ link, imgSrc, title, isBackCard }) => {
  return (
    <div className="bg-gray-100 rounded-lg shadow-md transition-transform transform hover:scale-105">
      <Link to={link} className="flex flex-col items-center p-6 text-center">
        {isBackCard ? (
          <FontAwesomeIcon icon={faArrowLeft} className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]" />
        ) : (
          <img src={imgSrc} className="h-[110px] mx-auto mb-1 mt-1" alt={title} />
        )}
        <h2 className={`text-[1.5rem] font-bold text-black`}>
          {title}
        </h2>
      </Link>
    </div>
  );
};

