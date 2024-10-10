import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';


const ReceitaCadastro = () => {
  const [atendido, setAtendido] = useState('');
  const [cafeManha, setCafeManha] = useState('');
  const [lancheTarde, setLancheTarde] = useState('');
  const [almoco, setAlmoco] = useState('');
  const [refeicoesAParte, setRefeicoesAParte] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/quantidade-refeicoes');
  };

  const Title = styled.h1`
  color: Black;
  font-size: 2.5rem;
  text-align: center;
`;

  // CSS Inline
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
    fontFamily: 'Arial, sans-serif',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '670px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const labelStyle = {
    marginBottom: '10px',
    fontWeight: 'normal',
  };

  const labelsStyle = {
    marginBottom: '10px',
    fontWeight: 'normal',
  };

  const inputStyle = {
    padding: '8px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginLeft: "18px"
  };

  const buttonStyle = {
    padding: '10px',
    backgroundColor: '#00009C',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
     <Title><h1>Cadastro de Cardápio Diário</h1></Title>
      <form onSubmit={handleSubmit} style={formStyle}>
        <label style={labelsStyle}>
          Quem foi atendido:
          <input
            type="text"
            value={atendido}
            onChange={(e) => setAtendido(e.target.value)}
            required
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Café da Manhã (O que foi servido):
          <input
            type="text"
            value={cafeManha}
            onChange={(e) => setCafeManha(e.target.value)}
            required
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Lanche da Tarde (O que foi servido):
          <input
            type="text"
            value={lancheTarde}
            onChange={(e) => setLancheTarde(e.target.value)}
            required
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Almoço (O que foi servido):
          <input
            type="text"
            value={almoco}
            onChange={(e) => setAlmoco(e.target.value)}
            required
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Refeições à parte (O que foi servido):
          <input
            type="text"
            value={refeicoesAParte}
            onChange={(e) => setRefeicoesAParte(e.target.value)}
            required
            style={inputStyle}
          />
        </label>
    
        <button type="submit" style={buttonStyle}>
          Cadastrar e Inserir Quantidade
        </button>
      </form>
    </div>
  );
};

export default ReceitaCadastro;
