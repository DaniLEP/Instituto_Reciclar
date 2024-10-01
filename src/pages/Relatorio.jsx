import { Link } from "react-router-dom";

export default function Relatorio() {
    return (
        <div className="bg-[#00009c] min-h-screen flex flex-col items-center justify-center">
            <div className="container mx-auto text-center p-4">
                <h1 className="text-[5rem] font-bold font-[ChakraPetch] italic text-white mb-10">
                    Relatório
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {/* CARDS */}
                    <Card link="/estoque" image="/doacoes.svg" title="Estoque" />
                    <Card link="/relatorio-refeicoes" image="/ref.servidas.svg" title="Ref. Servidas" />
                    <Card link="/relatorio-retiradas" image="/retiradas.svg" title="Retiradas" />
                    <Card link="/relatorio-anual-mensal" image="/anual.svg" title="Anual/Mensal" />
                    <Card link="/" image="/return.svg" title="Voltar" />


                    
                </div>
            </div>
        </div>
    );
}

const Card = ({ link, image, title }) => {
    return (
        <div className="card flex flex-col justify-center items-center bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 p-5">
            <Link to={link} onClick={() => navigateTo(title)}>
                <img src={image} className="h-[120px] mb-4" alt={title} />
                <h2 className="text-[28px] md:text-[35px] font-semibold text-center">{title}</h2>
            </Link>
        </div>
    );
};
