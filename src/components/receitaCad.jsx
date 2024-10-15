import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ReceitaCadastro = () => {
  const [cafeManha, setCafeManha] = useState('');
  const [lancheTarde, setLancheTarde] = useState('');
  const [almoco, setAlmoco] = useState('');
  const [refeicoesAParte, setRefeicoesAParte] = useState('');
  const [usuariosCafeManha, setUsuariosCafeManha] = useState([]);
  const [usuariosLancheTarde, setUsuariosLancheTarde] = useState([]);
  const [usuariosAlmoco, setUsuariosAlmoco] = useState([]);
  const [usuariosRefeicoesAParte, setUsuariosRefeicoesAParte] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/quantidade-refeicoes');
  };

  const handleBack = () => {
    navigate(-1); // Volta para a página anterior
  };

  const handleCheckboxChange = (e, setUsuariosFunc, usuarios) => {
    const { value, checked } = e.target;
    if (checked) {
      setUsuariosFunc([...usuarios, value]);
    } else {
      setUsuariosFunc(usuarios.filter((usuario) => usuario !== value));
    }
  };

  const Title = styled.h1`
    color: black;
    font-size: 2.5rem;
    text-align: center;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  `;

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
    fontFamily: 'Arial, sans-serif',
    padding: '20px', // para espaçamento em telas menores
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '670px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const labelStyle = {
    marginBottom: '10px',
    fontWeight: 'normal',
  };

  const inputStyle = {
    padding: '8px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%', // Para responsividade
  };

  const checkboxContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '15px',
  };

  const checkboxLabelStyle = {
    marginRight: '10px',
  };

  const buttonStyle = {
    padding: '10px',
    backgroundColor: '#00009C',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '10px', // Espaçamento entre os botões
    width: '100%',
  };

  const backButtonStyle = {
    padding: '10px',
    backgroundColor: '#F20DE7',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
  };

  return (
    <div style={containerStyle}>
      <Title>Cadastro de Cardápio Diário</Title>
      <form onSubmit={handleSubmit} style={formStyle}>
        <label style={labelStyle}>
          Café da Manhã:
          <input
            type="text"
            value={cafeManha}
            onChange={(e) => setCafeManha(e.target.value)}
            required
            style={inputStyle}
          />
        </label>
        <div style={checkboxContainerStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              value="Jovens"
              onChange={(e) => handleCheckboxChange(e, setUsuariosCafeManha, usuariosCafeManha)}
            />
            Jovens
          </label>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              value="Funcionários"
              onChange={(e) => handleCheckboxChange(e, setUsuariosCafeManha, usuariosCafeManha)}
            />
            Funcionários
          </label>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              value="Todos"
              onChange={(e) => handleCheckboxChange(e, setUsuariosCafeManha, usuariosCafeManha)}
            />
            Todos
          </label>
        </div>

        <label style={labelStyle}>
          Lanche da Tarde:
          <input
            type="text"
            value={lancheTarde}
            onChange={(e) => setLancheTarde(e.target.value)}
            required
            style={inputStyle}
          />
        </label>
        <div style={checkboxContainerStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              value="Jovens"
              onChange={(e) => handleCheckboxChange(e, setUsuariosLancheTarde, usuariosLancheTarde)}
            />
            Jovens
          </label>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              value="Funcionários"
              onChange={(e) => handleCheckboxChange(e, setUsuariosLancheTarde, usuariosLancheTarde)}
            />
            Funcionários
          </label>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              value="Todos"
              onChange={(e) => handleCheckboxChange(e, setUsuariosLancheTarde, usuariosLancheTarde)}
            />
            Todos
          </label>
        </div>

        <label style={labelStyle}>
          Almoço:
          <input
            type="text"
            value={almoco}
            onChange={(e) => setAlmoco(e.target.value)}
            required
            style={inputStyle}
          />
        </label>
        <div style={checkboxContainerStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              value="Jovens"
              onChange={(e) => handleCheckboxChange(e, setUsuariosAlmoco, usuariosAlmoco)}
            />
            Jovens
          </label>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              value="Funcionários"
              onChange={(e) => handleCheckboxChange(e, setUsuariosAlmoco, usuariosAlmoco)}
            />
            Funcionários
          </label>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              value="Todos"
              onChange={(e) => handleCheckboxChange(e, setUsuariosAlmoco, usuariosAlmoco)}
            />
            Todos
          </label>
        </div>

        <label style={labelStyle}>
          Refeições à parte:
          <input
            type="text"
            value={refeicoesAParte}
            onChange={(e) => setRefeicoesAParte(e.target.value)}
            style={inputStyle}
          />
        </label>
        <div style={checkboxContainerStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              value="Jovens"
              onChange={(e) => handleCheckboxChange(e, setUsuariosRefeicoesAParte, usuariosRefeicoesAParte)}
            />
            Jovens
          </label>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              value="Funcionários"
              onChange={(e) => handleCheckboxChange(e, setUsuariosRefeicoesAParte, usuariosRefeicoesAParte)}
            />
            Funcionários
          </label>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              value="Todos"
              onChange={(e) => handleCheckboxChange(e, setUsuariosRefeicoesAParte, usuariosRefeicoesAParte)}
            />
            Todos
          </label>
        </div>

        <button type="submit" style={buttonStyle}>
          Cadastrar e Inserir Quantidade
        </button>
        <button onClick={handleBack} style={backButtonStyle}>
          Voltar
        </button>
      </form>
    </div>
  );
};

export default ReceitaCadastro;
