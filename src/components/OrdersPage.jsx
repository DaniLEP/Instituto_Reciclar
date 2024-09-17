import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrdersPage  () {
  const navigate = useNavigate();

  // Função para redirecionar para a página de lista de compras
  const goToShoppingList = () => {
    navigate('/shopping-list');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Consulta de Pedido</h1>
      
      {/* Pedido do mês anterior */}
      <div>
        <h2>Pedido do Mês Anterior</h2>
        {/* ...conteúdo do pedido anterior */}
      </div>

      <hr />

      {/* Novo pedido */}
      <div>
        <h2>Novo Pedido</h2>
        <button onClick={goToShoppingList}>Criar Novo Pedido</button>
        {/* ...formulário para novo pedido */}
      </div>
    </div>
  );
};


