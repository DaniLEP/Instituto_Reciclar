export default function Relatorio() {
    // Função para lidar com a navegação
    const navigate = (url) => {
        window.location.href = url;
    };

    // Função para voltar uma página no histórico
    const goBack = () => {
        window.history.back();
    };

    return (
        <div className="bg-[#00009c] min-h-screen flex flex-col items-center justify-center">
            <div className="container mx-auto text-center p-4">
                <h1 className="text-[5rem] font-bold font-[ChakraPetch] italic text-white mb-10">
                    Relatório
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {/* CARD ESTOQUE */}
                    <div
                        className="card flex flex-col justify-center items-center bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 p-5 cursor-pointer"
                        onClick={() => navigate('/estoque')} // Redireciona para a página de estoque
                    >
                        <img src="/doacoes.svg" className="h-[120px] mb-4" alt="Estoque" />
                        <h2 className="text-[28px] md:text-[35px] font-semibold text-center">Estoque</h2>
                    </div>

                    {/* CARD REF. SERVIDAS */}
                    <div
                        className="card flex flex-col justify-center items-center bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 p-5 cursor-pointer"
                        onClick={() => navigate('/relatorio-refeicoes')} // Redireciona para relatório de refeições
                    >
                        <img src="/ref.servidas.svg" className="h-[120px] mb-4" alt="Ref. Servidas" />
                        <h2 className="text-[28px] md:text-[35px] font-semibold text-center">Ref. Servidas</h2>
                    </div>

                    {/* CARD RETIRADAS */}
                    <div
                        className="card flex flex-col justify-center items-center bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 p-5 cursor-pointer"
                        onClick={() => navigate('/relatorio-retiradas')} // Redireciona para relatório de retiradas
                    >
                        <img src="/retiradas.svg" className="h-[120px] mb-4" alt="Retiradas" />
                        <h2 className="text-[28px] md:text-[35px] font-semibold text-center">Retiradas</h2>
                    </div>

                    {/* CARD ANUAL/MENSAL */}
                    <div
                        className="card flex flex-col justify-center items-center bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 p-5 cursor-pointer"
                        onClick={() => navigate('/relatorio-anual-mensal')} // Redireciona para relatório anual/mensal
                    >
                        <img src="/anual.svg" className="h-[120px] mb-4" alt="Anual/Mensal" />
                        <h2 className="text-[28px] md:text-[35px] font-semibold text-center">Anual/Mensal</h2>
                    </div>

                    {/* CARD VOLTAR */}
                    <div
                        className="card flex flex-col justify-center items-center bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 p-5 cursor-pointer"
                        onClick={goBack} // Volta para a página anterior
                    >
                        <img src="/return.svg" className="h-[120px] mb-4" alt="Voltar" />
                        <h2 className="text-[28px] md:text-[35px] font-semibold text-center">Voltar</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}
