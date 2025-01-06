import { Link } from "react-router-dom";

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
            imgSrc="/cadastro.svg"
            title="Cadastro de Produtos"
          />
          <Card
            link="/Gerenciador_Produtos"
            imgSrc="/Gerenciador.png"
            title="Produtos Cadastrados"
          />  
          <Card
            link="/Entrada_Produtos"
            imgSrc="/entrada.svg"
            title="Entrada de Produtos"
          />
          <Card
            link="/Cadastro_Fornecedor"
            imgSrc="/entregador.png"
            title="Fornecedor"
          />
          <Card
            link="/Cadastro_Refeicoes" ///Cadastro_Refeicoes link exato
            imgSrc="/ref.servidas.svg"
            title="Ref. Servidas"
          />

          <Card link="/Home" imgSrc="/return.svg" title="Voltar" isBackCard />
        </div>
      </div>
    </div>
  );
}

const Card = ({ link, imgSrc, title, isBackCard }) => {
  return (
    <div className="bg-gray-100 rounded-lg shadow-md transition-transform transform hover:scale-105">
      <Link to={link} className="flex flex-col items-center p-6 text-center">
        <img src={imgSrc} className="h-[120px] mx-auto mb-4" alt={title} />
        <h2
          className={`text-[1.5rem] font-bold ${
            isBackCard ? "text-black" : "text-black"
          }`}
        >
          {title}
        </h2>
      </Link>
    </div>
  );
};
