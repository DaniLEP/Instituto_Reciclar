import { useNavigate } from 'react-router-dom';

export default function OrdersPage() {
  const navigate = useNavigate();

  // Função para redirecionar para a página de lista de compras
  const goToShoppingList = () => {
    navigate('/shopping-list');
  };

  // Função para visualizar o status dos pedidos
  const goToOrderStatus = () => {
    navigate('/order-status'); // Rota para a página de status dos pedidos
  };

  return (
    <div style={{ background: "#00009c", color: "white", textAlign: "center", height: "100vh" }}>
      <h1 style={{ textAlign: "center", fontSize: "80px", fontStyle: "bold", fontFamily: "chakra petch" }}>
        Consulta de Pedido
      </h1>
      <div
        onClick={goToShoppingList}
        style={{
          maxWidth: "240px",
          height: "190px",
          margin: "0 auto",
          position: "relative",
          top: "20vh",
          right: "-29vh",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          color: "black",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
        }}
      >
        <img src='/plus.svg' className='w-60 h-20 align-center' alt='Novo Pedido' />
        <br />
        <h2>Fazer Novo Pedido</h2>
      </div>

      <div
        onClick={goToOrderStatus}
        style={{
          maxWidth: "240px",
          height: "190px",
          margin: "0px auto",
          position: "relative",
          top: "-10vh",
          right: "29vh",
          background: "rgb(255, 255, 255)",
          padding: "20px",
          borderRadius: "8px",
          color: "black",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 8px"
        }}
      >
        <img src='/status.svg' className='w-60 h-20 align-center' alt='Status do Pedido' />
        <br />
        <h2>Status do Pedido</h2>
      </div>
    </div>
  );
};
