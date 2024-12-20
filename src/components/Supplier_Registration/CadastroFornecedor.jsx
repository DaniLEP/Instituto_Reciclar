import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push, update, remove, get } from 'firebase/database';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.firebasestorage.app",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const CadastroFornecedor = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [novoFornecedor, setNovoFornecedor] = useState({
    produtos: '',
    empresa: '',
    cnpj: '',
    contato: '',
    telefone: '',
    email: ''
  });

  const [editando, setEditando] = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNovoFornecedor({ ...novoFornecedor, [name]: value });
  };

  const handleAddFornecedor = (event) => {
    event.preventDefault();
    const fornecedoresRef = ref(db, 'CadastroFornecedores');
    if (editando) {
      const fornecedorRef = ref(db, 'CadastroFornecedores/' + fornecedorSelecionado.id);
      update(fornecedorRef, novoFornecedor);
    } else {
      const newFornecedorRef = push(fornecedoresRef);
      set(newFornecedorRef, novoFornecedor);
    }

    // Resetando o estado
    setNovoFornecedor({ produtos: '', empresa: '', cnpj: '', contato: '', telefone: '', email: '' });
    setEditando(false);
    setFornecedorSelecionado(null);
  };

  const handleEditFornecedor = (fornecedor) => {
    setNovoFornecedor(fornecedor);
    setEditando(true);
    setFornecedorSelecionado(fornecedor);
  };

  const handleDeleteFornecedor = (fornecedor) => {
    const fornecedorRef = ref(db, 'CadastroFornecedores/' + fornecedor.id);
    remove(fornecedorRef);
  };

  const handleBack = () => {
    navigate('/Cadastro'); // Rota para a página de status dos pedidos
  };

  // Obtendo fornecedores do Firebase
  useEffect(() => {
    const fornecedoresRef = ref(db, 'CadastroFornecedores');
    get(fornecedoresRef).then((snapshot) => {
      if (snapshot.exists()) {
        const fornecedoresList = [];
        snapshot.forEach((childSnapshot) => {
          fornecedoresList.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        setFornecedores(fornecedoresList);
      }
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: '#00009C', minHeight: '100vh', justifyContent: 'center' }}>
      <div style={{ width: '100%', textAlign: 'left', marginBottom: '20px' }}>
        <button
          onClick={handleBack}
          style={{ backgroundColor: '#F20DE7', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }}
        >
          Voltar
        </button>
      </div>

      <h2 style={{ color: 'white', fontSize: '3em', marginBottom: '20px' }}>Cadastro de Fornecedores</h2>

      <form onSubmit={handleAddFornecedor} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '600px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <label style={{ fontWeight: 'bold', fontSize: '1em', color: '#555' }}>
          Produtos:
          <input
            type="text"
            name="produtos"
            value={novoFornecedor.produtos}
            onChange={handleInputChange}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1em', marginTop: '5px' }}
            required
          />
        </label>

        <label style={{ fontWeight: 'bold', fontSize: '1em', color: '#555' }}>
          Empresa:
          <input
            type="text"
            name="empresa"
            value={novoFornecedor.empresa}
            onChange={handleInputChange}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1em', marginTop: '5px' }}
            required
          />
        </label>

        <label style={{ fontWeight: 'bold', fontSize: '1em', color: '#555' }}>
          CNPJ:
          <input
            type="text"
            name="cnpj"
            value={novoFornecedor.cnpj}
            onChange={handleInputChange}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1em', marginTop: '5px' }}
            required
          />
        </label>

        <label style={{ fontWeight: 'bold', fontSize: '1em', color: '#555' }}>
          Contato:
          <input
            type="text"
            name="contato"
            value={novoFornecedor.contato}
            onChange={handleInputChange}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1em', marginTop: '5px' }}
            required
          />
        </label>

        <label style={{ fontWeight: 'bold', fontSize: '1em', color: '#555' }}>
          Telefone/WhatsApp:
          <input
            type="tel"
            name="telefone"
            value={novoFornecedor.telefone}
            onChange={handleInputChange}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1em', marginTop: '5px' }}
            required
          />
        </label>

        <label style={{ fontWeight: 'bold', fontSize: '1em', color: '#555', gap: '10px' }}>
          Email/Site:
          <input
            type="email"
            name="email"
            value={novoFornecedor.email}
            onChange={handleInputChange}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1em', marginTop: '5px' }}
            required
          />
        </label>

        <button
          type="submit"
          style={{ backgroundColor: '#F20DE7', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1em', textAlign: 'center', fontWeight: 'bold' }}
        >
          {editando ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
        </button>
      </form>

      <div style={{ width: '100%', maxWidth: '800px', marginTop: '30px' }}>
        <h3 style={{ textAlign: 'center', color: 'white', fontSize: '2em', marginBottom: '15px' }}>Lista de Fornecedores</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '200%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead>
              <tr>
                <th style={{ backgroundColor: '#2196F3', color: 'white', padding: '12px 20px', fontSize: '1em' }}>Produtos</th>
                <th style={{ backgroundColor: '#2196F3', color: 'white', padding: '12px 20px', fontSize: '1em' }}>Empresa</th>
                <th style={{ backgroundColor: '#2196F3', color: 'white', padding: '12px 20px', fontSize: '1em' }}>CNPJ</th>
                <th style={{ backgroundColor: '#2196F3', color: 'white', padding: '12px 20px', fontSize: '1em' }}>Contato</th>
                <th style={{ backgroundColor: '#2196F3', color: 'white', padding: '12px 20px', fontSize: '1em' }}>Telefone</th>
                <th style={{ backgroundColor: '#2196F3', color: 'white', padding: '12px 20px', fontSize: '1em' }}>Email</th>
                <th style={{ backgroundColor: '#2196F3', color: 'white', padding: '12px 20px', fontSize: '1em' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {fornecedores.map((fornecedor) => (
                <tr key={fornecedor.id}>
                  <td style={{ padding: '12px 20px' }}>{fornecedor.produtos}</td>
                  <td style={{ padding: '12px 20px' }}>{fornecedor.empresa}</td>
                  <td style={{ padding: '12px 20px' }}>{fornecedor.cnpj}</td>
                  <td style={{ padding: '12px 20px' }}>{fornecedor.contato}</td>
                  <td style={{ padding: '12px 20px' }}>{fornecedor.telefone}</td>
                  <td style={{ padding: '12px 20px' }}>{fornecedor.email}</td>
                  <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                    <button onClick={() => handleEditFornecedor(fornecedor)} style={{ backgroundColor: '#F20DE7', color: 'white', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }}>Editar</button>
                    <button onClick={() => handleDeleteFornecedor(fornecedor)} style={{ backgroundColor: '#F44336', color: 'white', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '1em', marginLeft: '10px' }}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CadastroFornecedor;
