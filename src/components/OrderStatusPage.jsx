import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Para navegação entre páginas

const OrderStatusPage = () => {
  // Estado inicial com pedidos simulados
  const [orders, setOrders] = useState([
    { status: 'Pendente', id: 1, date: '2024-09-02', fornecedor: 'Calvo', valor: 1580 },
    { status: 'Processando', id: 2, date: '2024-11-28', fornecedor: 'Friboi', valor: 2000 },
    { status: 'Concluído', id: 3, date: '2024-02-05', fornecedor: 'Auroa', valor: 1490 },
    { status: 'Enviado', id: 4, date: '2024-10-11', fornecedor: 'Seara', valor: 10111 }
  ]);

  // Função para simular a atualização do status dos pedidos
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          const statuses = ['Pendente', 'Processando', 'Enviado', 'Concluído'];
          const nextStatus = statuses[(statuses.indexOf(order.status) + 1) % statuses.length];
          return { ...order, status: nextStatus };
        })
      );
    }, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', position: 'relative', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', fontSize: "50px", marginBottom: '20px' }}>Status dos Pedidos</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#00009c', color: '#fff' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID do Pedido</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Data</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Fornecedor</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Valor</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Ação</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} style={{ backgroundColor: '#f9f9f9', textAlign: 'center' }}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }} data-label="Status">
                <span style={{
                  padding: '5px 10px',
                  borderRadius: '12px',
                  backgroundColor: order.status === 'Concluído' ? 'green' : order.status === 'Enviado' ? 'orange' : order.status === 'Processando' ? 'blue' : 'red',
                  color: '#fff'
                }}>{order.status}</span>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }} data-label="ID do Pedido">{order.id}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }} data-label="Data">{order.date}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }} data-label="Fornecedor">{order.fornecedor}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }} data-label="Valor">R$ {order.valor}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }} data-label="Ação">
                <Link to={"/shopping-list"}>
                  <button style={{ padding: '10px', background: '#F20DE7', color: '#fff', borderRadius: '5px', cursor: 'pointer' }}>
                    Editar
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botão de retorno */}
      <Link to={'/orders-page'}>
        <button
          type="button"
          id="return"
          style={{
            position: "relative",
            top: "-2px",
            left: "1px",
            background: "none",
            border: "none",
            cursor: 'pointer'
          }}
        >
          <img src="/return.svg" alt="Voltar" style={{ width: "50px", height: "50px" }} />
        </button>
      </Link>

      {/* Estilos responsivos */}
      <style>
        {`
          @media (max-width: 768px) {
            h1 {
              font-size: 40px;
            }

            table {
              font-size: 14px;
            }

            thead {
              display: none;
            }

            tbody tr {
              display: block;
              margin-bottom: 20px;
              border-bottom: 2px solid #ddd;
            }

            tbody td {
              display: block;
              text-align: right;
              padding-left: 50%;
              position: relative;
            }

            tbody td:before {
              content: attr(data-label);
              position: absolute;
              left: 0;
              width: 45%;
              padding-left: 10px;
              font-weight: bold;
              text-align: left;
            }
    
          }

          @media (max-width: 480px) {
            h1 {
              font-size: 30px;
            }

            button {
              padding: 8px;
              position: relative;
              top: 20vh;
            }
          }
        `}
      </style>
    </div>
  );
};

export default OrderStatusPage;
