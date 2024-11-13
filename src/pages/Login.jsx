import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      (email === 'cleyson@reciclar.org.br' && password === '@R3c1cl4r@') ||
      (email === 'danilo.manzoli@reciclar.org.br' && password === '@R3c1cl4r@') ||
      (email === 'jaqueline@reciclar.org.br' && password === 'Reciclar123') ||
      (email === 'mislene.lages@reciclar.org.br ' && password === 'Reciclar123') 

    ) {
      alert('Login bem-sucedido!');
      setErrorMessage('');
      navigate("/Home");
    } else {
      setErrorMessage('E-mail ou senha incorretos.');
    }
  };

  const styles = {
    body: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      margin: 0,
      boxSizing: 'border-box',
      overflow: 'hidden',  // Remove a rolagem
    },
    loginContainer: {
      backgroundColor: '#00009C',
      padding: '30px',
      borderRadius: '20px',
      boxShadow: '1px 15px 20px rgba(0, 0, 0, 0.2)',
      border: '2px solid #00b894',
      textAlign: 'center',
      width: '100%',
      maxWidth: '350px',
      boxSizing: 'border-box',
    },
    h2: {
      color: '#ffffff',
      marginBottom: '20px',
      fontSize: '20px',
    },
    logo: {
      width: 150,
      marginRight: -32,
      marginBottom: '10px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#ffffff',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '15px',
      border: 'none',
      borderRadius: '5px',
      fontSize: '14px',
      backgroundColor: 'white',
      color: 'black',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#F20DE7',
      border: 'none',
      borderRadius: '5px',
      color: 'white',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#00FF62',
    },
    errorMessage: {
      color: 'red',
      marginTop: '15px',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.loginContainer}>
        <img
          src="/Reciclar.png"
          alt="Logo da Reciclar"
          style={styles.logo}
        />
        <h2 style={styles.h2}>Cozinha - Instituto Reciclar</h2>
        <form id="loginForm" onSubmit={handleSubmit}>
          <label htmlFor="email" style={styles.label}>
            E-mail:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <label htmlFor="password" style={styles.label}>
            Senha:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            Entrar
          </button>
        </form>
        {errorMessage && (
          <p id="errorMessage" style={styles.errorMessage}>
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
