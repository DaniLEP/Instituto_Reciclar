import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
export default function OrderDetailsPage() {
  const navigate = useNavigate();

  // Estado para armazenar os detalhes do pedido
  const [orderDetails, setOrderDetails] = useState(null);

  // Simulação de carregamento de pedido - substitua por sua chamada de API ou lógica real
  useEffect(() => {
    // Aqui você buscaria os detalhes do pedido da API ou de algum estado global
    const fetchedOrder = {
      id: 1,
      date: '2023-08-15',
      items: [
        { id: 1, name: 'Carne', supplier: 'Friboi', quantity: 2, notes: '5 Pacotes de 1kg' },
        { id: 2, name: 'Arroz', supplier: 'Extra', quantity: 1, notes: '14 Pacotes' },
      ],
      total: 250,
    };
    setOrderDetails(fetchedOrder);
  }, []);

  // Função para redirecionar para a página de edição do pedido
  const goToEditOrder = () => {
    // Chama a função para salvar o pedido como Excel
    saveOrderAsExcel();
    
    
  };

  // Função para redirecionar para a página de pedidos
  const goBackToOrders = () => {
    navigate('/orders-page');
  };

  // Função para salvar o pedido como um arquivo Excel
  const saveOrderAsExcel = () => {
    if (!orderDetails) return;

    const worksheetData = [
      ['ID', 'Nome do Item', 'Fornecedor', 'Quantidade', 'Observações'],
      ...orderDetails.items.map(item => [item.id, item.name, item.supplier, item.quantity, item.notes]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedido');

    // Cria um arquivo Excel
    XLSX.writeFile(workbook, `Pedido_${orderDetails.id}.xlsx`);
  };

  if (!orderDetails) {
    return <div>Carregando detalhes do pedido...</div>;
  }

  return (
    <div style={{ background: '#f0f0f0', padding: '20px', minHeight: '100vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>Detalhes do Pedido</h1>

      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h2>Pedido #{orderDetails.id}</h2>
        <p>Data: {orderDetails.date}</p>
        <hr />

        <h3>Itens do Pedido:</h3>
        <ul>
          {orderDetails.items.map(item => (
            <li key={item.id}>
              {item.name} - Fornecedor: {item.supplier} - Quantidade: {item.quantity} - Observações: {item.notes}
            </li>
          ))}
        </ul>
        <hr />
        <h3>Total: R$ {orderDetails.total.toFixed(2)}</h3>

        <div style={{ marginTop: '20px' }}>
          <button onClick={goToEditOrder} style={{ marginRight: '10px', backgroundColor: '#00009c', color: 'white', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
            Usar Pedido e Salvar Excel
          </button>
          <button onClick={goBackToOrders} style={{ backgroundColor: '#ccc', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
            Voltar aos Pedidos
          </button>
        </div>
      </div>
    </div>
  );
}
