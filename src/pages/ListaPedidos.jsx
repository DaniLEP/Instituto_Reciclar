import  OrdersPage from '../components/OrdersPage'
export default function ListaPedidos() {
        return (
        <>
                <div className="bg-[#00009c] min-h-screen flex flex-col items-center justify-center">
                    <div className="container mx-auto px-4 text-center">
                        {/* Título Responsivo */}
                        <span className="text-white font-bold  font-[ChakraPetch] text-4xl md:text-6xl lg:text-7xl">
                            Lista de Pedidos
                        </span>

                        <OrdersPage />
                    </div>
                </div>
            </>
    );
}
