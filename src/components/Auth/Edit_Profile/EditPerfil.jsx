import{ useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Link } from "react-router-dom";

export default function EditPerfil() {
  // Estado para armazenar os dados do formulário
  const [userData, setUserData] = useState({
    name: 'João da Silva',
    role: 'Cozinha',
    email: 'joao.silva@reciclar.org.br',
    profilePicture: '/profile.jpg', // Caminho para a imagem do perfil
  });

  const navigate = useNavigate();
  const voltar = () => {
    navigate('/meu-perfil');
  };



  const BackButton = styled(Link)`
  position: absolute;
  top: 15vh;
  left: 75vh;
  background: none;
  border: none;
  cursor: pointer;

  img {
    width: 40px;
    height: 40px;

    @media (max-width: 768px) {
      width: 30px; /* Ajuste do tamanho da imagem para telas menores */
      height: 30px;
      position: absolute;
      top: 15vh;
      left: 11vh;
    }
    }
  }
`;

  // Função para lidar com a alteração dos campos do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // Função de envio do formulário (simulação)
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Perfil atualizado com sucesso!');
    // Aqui você pode adicionar a lógica para enviar os dados para a API ou banco de dados
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4',
        padding: '20px',
      }}
    >
        <BackButton to={'/meu-perfil'}>
          <img src="/return.svg" alt="Voltar" />
        </BackButton>
      <div
        style={{
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          width: '400px',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px' }}>
          Editar Perfil
        </h2>

        {/* Formulário de edição de perfil */}
        <form onSubmit={handleSubmit}>
          {/* Campo Nome */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
              Nome:
            </label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </div>

          {/* Campo Função */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
              Função:
            </label>
            <input
              type="text"
              name="role"
              value={userData.role}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </div>

          {/* Campo E-mail */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
              E-mail:
            </label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </div>


          {/* Botão de salvar */}
          <button
            type="submit"
            style={{
              backgroundColor: '#00009C',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '16px',
            }}
            onClick={voltar}
          >
            Salvar Alterações

          </button>
        </form>
      </div>
    </div>
  );
}
