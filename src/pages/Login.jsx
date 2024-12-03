import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const authenticateUser = (email, password) => {
    const validUsers = [
      { email: 'cleyson@reciclar.org.br', password: '@R3c1cl4r@' },
      { email: 'danilo.manzoli@reciclar.org.br', password: '@R3c1cl4r@' },
      { email: 'jaqueline@reciclar.org.br', password: 'Reciclar123' },
      { email: 'mislene.lages@reciclar.org.br', password: 'Reciclar123' },
    ];

    return validUsers.some(user => user.email === email && user.password === password);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      setErrorMessage('E-mail inválido.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (authenticateUser(email, password)) {
        alert('Login bem-sucedido!');
        setErrorMessage('');
        navigate('/Home');
      } else {
        setErrorMessage('E-mail ou senha incorretos.');
      }
      setIsLoading(false);
    }, 1000); // Simula um tempo de carregamento
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const styles = {
    body: {
      fontFamily: "'Roboto', sans-serif",
      backgroundColor: '#00009c',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      margin: 0,
      padding: '20px',
      boxSizing: 'border-box',
    },
    loginContainer: {
      backgroundColor: '#ffffff',
      padding: '40px',
      borderRadius: '10px',
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      width: '90%',
      maxWidth: '400px',
      boxSizing: 'border-box',
    },
    logo: {
      width: '150px',
      margin: '0 auto 20px',
    },
    h2: {
      color: '#333333',
      marginBottom: '20px',
      fontSize: '22px',
      fontWeight: 'bold',
    },
    label: {
      display: 'block',
      marginBottom: '10px',
      color: '#555555',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    inputContainer: {
      position: 'relative',
      marginBottom: '20px',
    },
    input: {
      width: '100%',
      padding: '12px',
      paddingRight: '40px', // Espaço para o ícone
      border: '1px solid #cccccc',
      borderRadius: '5px',
      fontSize: '14px',
      backgroundColor: '#f9f9f9',
      color: '#333333',
      boxSizing: 'border-box',
    },
    eyeIcon: {
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      color: '#007BFF',
      fontSize: '16px',
    },
    button: {
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
    },
    buttonHover: {
      backgroundColor: '#C00BBE',
    },
    errorMessage: {
      color: 'red',
      marginTop: '15px',
      fontSize: '14px',
    },
    loader: {
      border: '3px solid #f3f3f3',
      borderTop: '3px solid #f20de7',
      borderRadius: '50%',
      width: '16px',
      height: '16px',
      animation: 'spin 0.6s linear infinite',
      display: 'inline-block',
      marginRight: '5px',
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.loginContainer}>
        <img
          src="/Reciclar_LOGO.png"
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
            <br />
            Senha:
          </label>
          <div style={styles.inputContainer}>
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            <FontAwesomeIcon
              icon={isPasswordVisible ? faEyeSlash : faEye}
              onClick={togglePasswordVisibility}
              style={styles.eyeIcon}
            />
          </div>
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
            disabled={isLoading}
          >
            {isLoading ? <span style={styles.loader}></span> : 'Entrar'}
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
