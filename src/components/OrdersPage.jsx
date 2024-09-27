import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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
    <div className="orders-page">
      <h1 className="title">Consulta de Pedido</h1>

      <div className="card-container">
        {/* Cartão 1 - Novo Pedido */}
        <div onClick={goToShoppingList} className="card">
          <img src="/plus.svg" alt="Novo Pedido" className="card-icon" />
          <h2 className="card-title">Fazer Novo Pedido</h2>
        </div>

        {/* Cartão 2 - Status do Pedido */}
        <div onClick={goToOrderStatus} className="card">
          <img src="/status.svg" alt="Status do Pedido" className="card-icon" />
          <h2 className="card-title">Status do Pedido</h2>
        </div>

        {/* Cartão 3 - Voltar */}
        <div className="card">
          <Link to="/lista-pedidos">
            <img src="/return.svg" alt="Voltar" className="card-icon" />
          </Link>
          <h2 className="card-title">Voltar</h2>
        </div>
      </div>

      {/* Estilos CSS */}
      <style>{`
        /* Estilos Globais */
        body {
          margin: 0;
          font-family: 'Chakra Petch', sans-serif;
          background-color: #00009c;
          color: white;
        }

        .orders-page {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          padding: 20px;
          text-align: center;
        }

        /* Título */
        .title {
          font-size: 60px;
          font-weight: bold;
          margin-bottom: 50px;
        }

        /* Container dos Cards */
        .card-container {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }

        /* Estilos dos Cards */
        .card {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #fff;
          color: #000;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          padding: 30px;
          max-width: 260px;
          width: 100%;
          height: 220px;
          text-align: center;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
          transform: translateY(-10px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
        }

        /* Centralização das Imagens e Títulos nos Cards */
        .card-icon {
          width: 80px;
          height: auto;
          margin-bottom: 20px;
        }

        .card-title {
          font-size: 20px;
          font-weight: 600;
        }

        /* Estilos Responsivos */
        @media (max-width: 1200px) {
          .title {
            font-size: 48px;
          }

          .card-container {
            gap: 30px;
          }

          .card {
            padding: 25px;
            height: 200px;
          }
        }

        @media (max-width: 768px) {
          .title {
            font-size: 40px;
          }

          .card {
            max-width: 220px;
            padding: 20px;
            height: 180px;
          }

          .card-icon {
            width: 60px;
          }

          .card-title {
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .title {
            font-size: 32px;
            margin-bottom: 40px;
          }

          .card-container {
            gap: 20px;
          }

          .card {
            max-width: 180px;
            padding: 15px;
            height: 160px;
          }

          .card-icon {
            width: 50px;
          }

          .card-title {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
