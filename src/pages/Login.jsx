import { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login data:', { email, password });
  };

  // Estilos inline
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  };

  const formStyle = {
    backgroundColor: '#00009C',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '400px',
  };

  const inputGroupStyle = {
    marginBottom: '1rem',
    color: 'white',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    marginTop: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    color: 'black'
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#F20DE7',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const buttonHoverStyle = {
    backgroundColor: '#00FF62',
  };
  
  const imgLogo = {
    width: '50vh',
    position: 'relative',
    left: '10px'
}



  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <img src="/logo.svg" style={imgLogo}/>
        <div style={inputGroupStyle}>
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
