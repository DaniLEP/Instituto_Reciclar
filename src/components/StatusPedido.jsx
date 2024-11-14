import { useState, } from 'react';
import { Link } from 'react-router-dom'; // Para navegação entre páginas

const StatusPedido = () => {
  // Estado inicial com pedidos simulados
  const [orders] = useState([
    { status: 'Pendente pagamento', id: 1, date: '2024-09-02', fornecedor: 'Calvo', categoria: 'Proteina', valor: 1580 },
    { status: 'Processando', id: 2, date: '2024-11-28', fornecedor: 'Friboi', categoria: 'Mantimento', valor: 2000 },
    { status: 'Concluído', id: 3, date: '2024-02-05', fornecedor: 'Auroa', categoria: 'Hortaliça', valor: 1490 },
    { status: 'Cancelado', id: 4, date: '2024-10-11', fornecedor: 'Seara', categoria: 'Seara', valor: 10.111 }
  ]);

  // Função para simular a atualização do status dos pedidos

  return (
    <div style={{ padding: '30px', maxWidth: '2000px', margin: '0 auto', position: 'relative', minHeight: '100vh', background: "#00009c" }}>
      <h1 style={{ textAlign: 'center', fontSize: "50px", marginBottom: '20px', color: 'white' }}>Status dos Pedidos</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '30px' }}>
        <thead>
          <tr style={{ backgroundColor: '#00009c', color: '#fff' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID do Pedido</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Data</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Fornecedor</th>            
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Categoria</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Valor Total do Pedido</th>
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
                  backgroundColor: order.status === 'Concluído' ? 'green' : order.status === 'Cancelado' ? 'red' : order.status === 'Processando' ?  'yellow' : order.status === 'Pendente pagamento' ? 'blue' : 'blue',
                  color: '#fff'
                }}>{order.status}</span>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }} data-label="ID do Pedido">{order.id}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }} data-label="Data">{order.date}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }} data-label="Fornecedor">{order.fornecedor}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }} data-label="Categoria">{order.categoria}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }} data-label="Valor">R$ {order.valor}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }} data-label="Ação">
                <Link to={"/Editar_Produto"}>
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
      <Link to={'/Pedidos'}>
        <button
          type="button"
          id="return"
          style={{
            position: "relative",
            top: "-10px",
            left: "1px",
            background: "none",
            border: "none",
            cursor: 'pointer'
          }}
        >
          <h1 style={{ color: 'white', background: '#f20de7', padding: 8, borderRadius: '10px', position: 'absolute'}}>Voltar</h1>
        </button>
      </Link>

      {/* Estilos responsivos */}
      <style>
        {`
          @media (max-width: 768px) {
            h1 {
              font-size: 20px;
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

export default StatusPedido;
