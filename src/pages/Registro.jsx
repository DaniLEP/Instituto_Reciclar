import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set, get, child } from 'firebase/database';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.firebasestorage.app",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export default function Registro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [funcao, setFuncao] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Função de validação de email
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Função de validação de senha
  const validatePassword = (senha) => senha.length >= 6;

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!validateEmail(email)) {
      setErrorMessage('E-mail inválido.');
      return;
    }
  
    if (!validatePassword(senha)) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
  
    if (senha !== confirmSenha) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Verificar se o e-mail já está registrado no Realtime Database
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'novousuario'));
      if (snapshot.exists()) {
        const usuarios = snapshot.val();
        const emailJaCadastrado = Object.values(usuarios).some(
          (usuario) => usuario.email === email
        );
  
        if (emailJaCadastrado) {
          setErrorMessage('Este e-mail já está registrado.');
          setIsLoading(false);
          return;
        }
      }
  
      // Criar o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
  
      // Salvar dados no Realtime Database
      await set(ref(database, 'novousuario/' + user.uid), {
        nome: nome,
        email: email,
        funcao: funcao,
        uid: user.uid,
      });
  
      setSuccessMessage('Usuário criado com sucesso!');
      setErrorMessage('');
      setNome('');
      setEmail('');
      setFuncao('');
      setSenha('');
      setConfirmSenha('');
      navigate('/Verificacao_Usuario');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
  
      if (errorCode === 'auth/email-already-in-use') {
        setErrorMessage('Este e-mail já está em uso. Por favor, tente outro.');
      } else {
        setErrorMessage(`Erro ao criar o usuário: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div style={{
      fontFamily: "'Roboto', sans-serif",
      backgroundColor: '#00009c',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      margin: 0,
      padding: '20px',
      boxSizing: 'border-box',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        width: '90%',
        maxWidth: '400px',
        boxSizing: 'border-box',
      }}>
        <img src="/Reciclar_LOGO.png" alt="Logo da Reciclar" style={{
          width: '150px',
          margin: '0 auto 20px',
        }} />
        <h2 style={{
          color: '#333333',
          marginBottom: '20px',
          fontSize: '22px',
          fontWeight: 'bold',
        }}>Registro de Novo Usuário</h2>
        <form id="registerForm" onSubmit={handleSubmit}>
          <label htmlFor="nome" style={{
            display: 'block',
            marginBottom: '10px',
            color: '#555555',
            textAlign: 'left',
            fontSize: '14px',
            fontWeight: 'bold',
          }}>Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #cccccc',
              borderRadius: '5px',
              fontSize: '14px',
              backgroundColor: '#f9f9f9',
              color: '#333333',
            }}
          /> 
        
          <label htmlFor="email" style={{
            display: 'block',
            marginTop: '20px',
            color: '#555555',
            textAlign: 'left',
            fontSize: '14px',
            fontWeight: 'bold',
          }}>E-mail:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #cccccc',
              borderRadius: '5px',
              fontSize: '14px',
              backgroundColor: '#f9f9f9',
              color: '#333333',
            }}
          />
          <label htmlFor="funcao" style={{
            display: 'block',
            marginTop: '20px',
            color: '#555555',
            textAlign: 'left',
            fontSize: '14px',
            fontWeight: 'bold',
          }}>Função:</label>
          <input
            type="text"
            id="funcao"
            name="funcao"
            value={funcao}
            onChange={(e) => setFuncao(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #cccccc',
              borderRadius: '5px',
              fontSize: '14px',
              backgroundColor: '#f9f9f9',
              color: '#333333',
            }}
          />
          <label htmlFor="senha" style={{
            display: 'block',
            marginTop: '20px',
            color: '#555555',
            textAlign: 'left',
            fontSize: '14px',
            fontWeight: 'bold',
          }}>Senha:</label>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              id="senha"
              name="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #cccccc',
                borderRadius: '5px',
                fontSize: '14px',
                backgroundColor: '#f9f9f9',
                color: '#333333',
              }}
            />
            <FontAwesomeIcon
              icon={isPasswordVisible ? faEyeSlash : faEye}
              onClick={togglePasswordVisibility}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#007BFF',
                fontSize: '16px',
              }}
            />
          </div>
          <label htmlFor="confirmSenha" style={{
            display: 'block',
            marginTop: '20px',
            color: '#555555',
            textAlign: 'left',
            fontSize: '14px',
            fontWeight: 'bold',
          }}>Confirmar Senha:</label>
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            id="confirmSenha"
            name="confirmSenha"
            value={confirmSenha}
            onChange={(e) => setConfirmSenha(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #cccccc',
              borderRadius: '5px',
              fontSize: '14px',
              backgroundColor: '#f9f9f9',
              color: '#333333',
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#F20DE7',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              marginTop: '10px'
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#C00BBE')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#F20DE7')}
            disabled={isLoading}
          >
            {isLoading ? 'Carregando...' : 'Criar Conta'}
          </button>
         <Link to={"/Verificacao_Usuario"}>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#00FF62',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              marginTop: '10px'
            }}
          >
          Voltar
          </button>
          </Link>
        </form>
        {errorMessage && <p style={{ color: 'red', marginTop: '20px' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green', marginTop: '20px' }}>{successMessage}</p>}
      </div>
    </div>
  );
}

