// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const navigate = useNavigate();

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     if (
//       (email === 'cleyson@reciclar.org.br' && password === '@R3c1cl4r@') ||
//       (email === 'danilo.manzoli@reciclar.org.br' && password === '@R3c1cl4r@') ||
//       (email === 'jaqueline@reciclar.org.br' && password === 'Reciclar123') ||
//       (email === 'mislene.lages@reciclar.org.br ' && password === 'Reciclar123') 

//     ) {
//       alert('Login bem-sucedido!');
//       setErrorMessage('');
//       navigate("/Home");
//     } else {
//       setErrorMessage('E-mail ou senha incorretos.');
//     }
//   };

//   const styles = {
//     body: {
//       fontFamily: 'Arial, sans-serif',
//       backgroundColor: '#f5f5f5',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       minHeight: '100vh',
//       margin: 0,
//       boxSizing: 'border-box',
//       overflow: 'hidden',  // Remove a rolagem
//     },
//     loginContainer: {
//       backgroundColor: '#00009C',
//       padding: '30px',
//       borderRadius: '20px',
//       boxShadow: '1px 15px 20px rgba(0, 0, 0, 0.2)',
//       border: '2px solid #00b894',
//       textAlign: 'center',
//       width: '100%',
//       maxWidth: '350px',
//       boxSizing: 'border-box',
//     },
//     h2: {
//       color: '#ffffff',
//       marginBottom: '20px',
//       fontSize: '20px',
//     },
//     logo: {
//       width: 150,
//       marginRight: -32,
//       marginBottom: '10px',
//     },
//     label: {
//       display: 'block',
//       marginBottom: '8px',
//       color: '#ffffff',
//       textAlign: 'left',
//       fontSize: '14px',
//       fontWeight: 'bold',
//     },
//     input: {
//       width: '100%',
//       padding: '12px',
//       marginBottom: '15px',
//       border: 'none',
//       borderRadius: '5px',
//       fontSize: '14px',
//       backgroundColor: 'white',
//       color: 'black',
//       boxSizing: 'border-box',
//     },
//     button: {
//       width: '100%',
//       padding: '12px',
//       backgroundColor: '#F20DE7',
//       border: 'none',
//       borderRadius: '5px',
//       color: 'white',
//       fontSize: '16px',
//       cursor: 'pointer',
//       transition: 'background-color 0.3s ease',
//     },
//     buttonHover: {
//       backgroundColor: '#00FF62',
//     },
//     errorMessage: {
//       color: 'red',
//       marginTop: '15px',
//       fontSize: '14px',
//     },
//   };

//   return (
//     <div style={styles.body}>
//       <div style={styles.loginContainer}>
//         <img
//           src="/Reciclar.png"
//           alt="Logo da Reciclar"
//           style={styles.logo}
//         />
//         <h2 style={styles.h2}>Cozinha - Instituto Reciclar</h2>
//         <form id="loginForm" onSubmit={handleSubmit}>
//           <label htmlFor="email" style={styles.label}>
//             E-mail:
//           </label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             style={styles.input}
//           />
//           <label htmlFor="password" style={styles.label}>
//             Senha:
//           </label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             style={styles.input}
//           />
//           <button
//             type="submit"
//             style={styles.button}
//             onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
//             onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
//           >
//             Entrar
//           </button>
//         </form>
//         {errorMessage && (
//           <p id="errorMessage" style={styles.errorMessage}>
//             {errorMessage}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (
        (email === 'cleyson@reciclar.org.br' && password === '@R3c1cl4r@') ||
        (email === 'danilo.manzoli@reciclar.org.br' && password === '@R3c1cl4r@') ||
        (email === 'jaqueline@reciclar.org.br' && password === 'Reciclar123') ||
        (email === 'mislene.lages@reciclar.org.br ' && password === 'Reciclar123')
      ) {
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
      boxSizing: 'border-box',
    },
    loginContainer: {
      backgroundColor: '#ffffff',
      padding: '40px',
      borderRadius: '10px',
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      width: '100%',
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
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '20px',
      border: '1px solid #cccccc',
      borderRadius: '5px',
      fontSize: '14px',
      backgroundColor: '#f9f9f9',
      color: '#333333',
      boxSizing: 'border-box',
    },
    toggleButton: {
      marginBottom: '20px',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      color: '#007BFF',
      fontSize: '14px',
      textDecoration: 'underline',
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
      backgroundColor: '#F20DE7',
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
            Senha:
          </label>
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            style={styles.toggleButton}
          >
            {isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
          </button>
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            {isLoading ? 'carregando...' : 'Entrar'}
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
