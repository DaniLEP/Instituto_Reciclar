import { useState } from 'react';
import { Link } from 'react-router-dom';

const StatusRef = () => {
  // Estado inicial com pedidos simulados
  const [orders] = useState([
    { date: '2024-09-02', tipoRef: 'Café da Manhã', tipoAtendido: "Funcionario", qtde: 15 },
    { date: '2024-11-28', tipoRef: 'Almoço', tipoAtendido: "Jovens", qtde: 150 },
    { date: '2024-02-05', tipoRef: 'Almoço', tipoAtendido: "Funcionario", qtde: 25 },
    { date: '2024-10-11', tipoRef: 'Lanche da Tarde', tipoAtendido: "Jovens", qtde: 140 }
  ]);

  // Estados para os filtros
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [mealType, setMealType] = useState('');
  
  // Estado para armazenar os resultados filtrados e o controle de exibição
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Função para filtrar os pedidos por data e tipo de refeição
  const handleFilter = () => {
    const results = orders.filter(order => {
      const orderDate = new Date(order.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      // Verifica se o pedido está no intervalo de datas
      const isWithinDateRange = (!start || orderDate >= start) && (!end || orderDate <= end);

      // Verifica se o tipo de refeição é correspondente (ou se não foi selecionado nenhum tipo)
      const isMatchingMealType = !mealType || order.tipoRef === mealType;

      return isWithinDateRange && isMatchingMealType;
    });

    setFilteredOrders(results); // Atualiza os resultados filtrados
    setIsSubmitted(true); // Sinaliza que a consulta foi feita
  };

  // Verificação se todos os campos estão preenchidos
  const isFormValid = startDate && endDate && mealType;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', position: 'relative', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', fontSize: "50px", marginBottom: '20px' }}>Status de Refeições</h1>

      {/* Filtros */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginRight: '10px' }}>Data Inicial:</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginRight: '10px' }}>Data Final:</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginRight: '10px' }}>Tipo de Refeição:</label>
          <select 
            value={mealType} 
            onChange={(e) => setMealType(e.target.value)}
            style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
            <option value="">Selecione</option>
            <option value="Café da Manhã">Café da Manhã</option>
            <option value="Almoço">Almoço</option> 
            <option value="Lanche da Tarde">Lanche da Tarde</option>
            <option value="Refeições à parte">Refeições à parte</option>
          </select>
        </div>

        {/* Botão de consulta */}
        <button 
          onClick={handleFilter} 
          style={{ padding: '10px', background: isFormValid ? '#00009c' : '#ccc', color: '#fff', border: 'none', borderRadius: '5px', cursor: isFormValid ? 'pointer' : 'not-allowed' }}
          disabled={!isFormValid} // Desabilita o botão se o formulário não estiver completo
        >
          Consultar
        </button>
      </div>

      {/* Exibe a tabela somente se a consulta for feita */}
      {isSubmitted && (
        <>
          {filteredOrders.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#00009c', color: '#fff' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Data</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Tipo de Refeição</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Tipo Atendido</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Quantidade</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={index} style={{ backgroundColor: '#f9f9f9', textAlign: 'center' }}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }} data-label="Data">{order.date}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }} data-label="Tipo de Refeição">{order.tipoRef}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }} data-label="Tipo Atendido">{order.tipoAtendido}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }} data-label="Quantidade">{order.qtde}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }} data-label="Ação">
                      <Link to={"#"}>
                        <button style={{ padding: '10px', background: '#F20DE7', color: '#fff', borderRadius: '5px', cursor: 'pointer' }}>Editar</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', color: '#ff0000' }}>Nenhum pedido encontrado para os filtros selecionados.</p>
          )}
        </>
      )}

      {/* Botão de retorno */}
      <Link to={'/cad-refeicoes'}>
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
              top: 1vh;
            }
          }
        `}
      </style>
    </div>
  );
};

export default StatusRef;
