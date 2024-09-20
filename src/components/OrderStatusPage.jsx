import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Para navegação entre páginas

const OrderStatusPage = () => {
  // Estado inicial com pedidos simulados
  const [orders, setOrders] = useState([
    { id: 1, product: 'Produto A', status: 'Pendente' },
    { id: 2, product: 'Produto B', status: 'Processando' },
    { id: 3, product: 'Produto C', status: 'Concluído' },
    { id: 4, product: 'Produto D', status: 'Enviado' }
  ]);

  // Função para simular a atualização do status dos pedidos
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          const statuses = ['Pendente', 'Processando', 'Enviado', 'Concluído'];
          const nextStatus =
            statuses[(statuses.indexOf(order.status) + 1) % statuses.length];
          return { ...order, status: nextStatus };
        })
      );
    }, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Status dos Pedidos</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#00009c', color: '#fff' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID do Pedido</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Produto</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Ação</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} style={{ backgroundColor: '#f9f9f9', textAlign: 'center' }}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.id}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.product}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <span
                  style={{
                    padding: '5px 10px',
                    borderRadius: '12px',
                    backgroundColor:
                      order.status === 'Concluído'
                        ? 'green'
                        : order.status === 'Enviado'
                        ? 'orange'
                        : order.status === 'Processando'
                        ? 'blue'
                        : 'red',
                    color: '#fff',
                  }}
                >
                  {order.status}
                </span>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {/* Link para a página de edição passando o ID do pedido */}
                <Link to={`/edit-order/${order.id}`}>
                  <button style={{ padding: '10px', background: '#F20DE7', color: '#fff', borderRadius: '5px', cursor: 'pointer' }}>
                    Editar
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderStatusPage;
