import { Link } from "react-router-dom";

export default function Cadastro() {
    return (
        <div className="bg-[#00009c] min-h-screen flex items-center justify-center">
            <div className=" mx-auto p-6  rounded-lg shadow-lg" style={{ maxWidth: "700px" }}>
                <h1 className="text-[3rem] font-bold font-[ChakraPetch] text-white  text-center mb-10">Cadastro</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Cards */}
                    <Card 
                        link="/cadastro-geral" 
                        imgSrc="/cadastro.svg" 
                        title="Cadastro de Produtos" 
                    />
                    <Card 
                        link="/entrada-produtos" 
                        imgSrc="/entrada.svg" 
                        title="Entrada de Produtos" 
                    />
                    <Card 
                        link="/cad-refeicoes" a
                        imgSrc="/ref.servidas.svg" 
                        title="Ref. Servidas" 
                    />
                    <Card 
                        link="/Home" 
                        imgSrc="/return.svg" 
                        title="Voltar" 
                        isBackCard
                    />
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
                <h2 className={`text-[1.5rem] font-bold ${isBackCard ? 'text-black' : 'text-black'}`}>{title}</h2>
            </Link>
        </div>
    );
}
