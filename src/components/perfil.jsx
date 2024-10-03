import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Link } from "react-router-dom";


export default function Profile() {
  const userData = {
    name: 'João da Silva',
    role: 'Cozinha',
    email: 'joao.silva@reciclar.org.br',
    profilePicture: '/user.svg', // Caminho para a imagem do perfil
  };

  const navigate = useNavigate();
  const edit = () => {
    navigate('/editar-perfil');
  };

  const BackButton = styled(Link)`
  position: absolute;
  top: 25vh;
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
      top: 3vh;
      left: -66vh;
    }
    }
  }
`;

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
      <div
        style={{
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          width: '400px',
          textAlign: 'center',
        }}
      >
        <BackButton to={'/'}>
          <img src="/return.svg" alt="Voltar" />
        </BackButton>

        {/* Foto de perfil */}
        <img
          src={userData.profilePicture}
          alt="Profile"
          style={{
            borderRadius: '55%',
            width: '60px',
            height: '60px',
            objectFit: 'cover',
            marginBottom: '20px',
            marginLeft: '24vh',
          }}
        />

        {/* Nome do usuário */}
        <h2 style={{ marginBottom: '10px', fontSize: '24px', color: '#333' }}>
          {userData.name}
        </h2>

        {/* Cargo do usuário */}
        <p style={{ marginBottom: '5px', fontSize: '18px', color: '#555' }}>
          Função: {userData.role}
        </p>

        {/* E-mail do usuário */}
        <p style={{ marginBottom: '5px', fontSize: '18px', color: '#555' }}>
          E-mail: {userData.email}
        </p>
        {/* Botão de Editar Perfil */}
        <button
          style={{
            backgroundColor: '#00009C',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '10px'
          }}
          onClick={edit}>
          Editar Perfil
        </button>
      </div>
    </div>
  );
}
