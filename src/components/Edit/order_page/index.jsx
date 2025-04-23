import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useParams para capturar o ID do pedido

const EditPagePedidos = () => {
  const { id } = useParams(); // Pega o ID da URL
  const navigate = useNavigate(); // Para redirecionar de volta após editar
  const [order, setOrder] = useState(null);
  const [product, setProduct] = useState('');
  const [status, setStatus] = useState('');

  // Carregar os dados do pedido (simulando um fetch de uma API)
  useEffect(() => {
    // Simulação de um pedido para editar
    const fetchedOrder = {id, product: 'Lista de Pedido ' + id, status: 'Pendente'}; // Definir status inicial
    setOrder(fetchedOrder);
    setProduct(fetchedOrder.product);
    setStatus(fetchedOrder.status);
  }, [id]);

  const handleSave = () => {
    // Simular salvar o pedido editado (aqui você pode fazer uma requisição à API)
    console.log('Pedido editado:', { id, product, status });
    // Após salvar, redirecionar de volta para a página de status de pedidos
    navigate('/Proteina');
  };

  if (!order) return <p>Carregando pedido...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '10000px', margin: '0 auto', background: "#00009C", color: "white" }}>
      <h1 className='text-center text-white'>Editando Pedido #{order.id}</h1><br />
      <div style={{ marginBottom: '20px', position: "relative", right:'-60vh' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>Lista de Pedido:</label>
        <input type="text" value={product} onChange={(e) => setProduct(e.target.value)}
          style={{ padding: '10px', width: '40%', borderRadius: '5px', border: '1px solid #ddd', color: "black"}} />
      </div>
      <div style={{ marginBottom: '20px', position: "relative", right:'-60vh'}}>
        <label style={{ display: 'block', marginBottom: '10px' }}>Status:</label>
        <select  value={status} onChange={(e) => setStatus(e.target.value)}
          style={{ padding: '10px', width: '20%', borderRadius: '5px', border: '1px solid #ddd',color: "black"  }}>
          <option value="Pendente">Pendente</option>
          <option value="Processando">Processando</option>
          <option value="Enviado">Enviado</option>
          <option value="Concluído">Concluído</option>
        </select>
      </div>
      <button onClick={handleSave}
        style={{padding: '10px 20px', background: '#F20DE7', color: '#fff', borderRadius: '5px', cursor: 'pointer', border: 'none', position: "relative", right:'-60vh'}}> Salvar Alterações</button>
    </div>
  );
};
export default EditPagePedidos;