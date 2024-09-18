import { useNavigate } from 'react-router-dom';

export default function OrdersPage() {
  const navigate = useNavigate();

  // Função para redirecionar para a página de lista de compras
  const goToShoppingList = () => {
    navigate('/shopping-list');
  };

  // Função para redirecionar para a página de edição do pedido anterior
  const goToEditOrder = () => {
    navigate('/OrderPageDetail'); // Substitua '/edit-order' pela rota correta
  };

  return (
    <div style={{background: "#00009c", color:"white", textAlign: "center", height:"100vh"}}>
      <h1 style={{ textAlign: "center", fontSize: "80px", fontStyle: "bold" , fontFamily: "chakra petch"}}>Consulta de Pedido</h1>

      <div onClick={goToEditOrder} style={{maxWidth: "240px", height: "190px", margin: "0 auto", position:"relative", top:"23vh", right: "35vh", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", color: "black", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"}}>
        {/* Ao clicar, redireciona para a página de edição do pedido */}
        <img src="/public/mensal.svg" className='w-80 h-[130px] align-center'alt="" />
        <h2>Pedido do Mês Anterior</h2>
      </div>

      <div onClick={goToShoppingList} style={{maxWidth: "240px", height: "190px", margin: "0 auto", position:"relative", top: "-7vh", right:"-40vh", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", color: "black", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"}}>
        <img src='/public/plus.svg' className='w-60 h-20 align-center' alt='Novo Pedido' />
        <br />
        <h2>Fazer Novo Pedido</h2>
      </div>
    </div>
  );
};



