import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CadastroFornecedor = () => {
  const [fornecedores, setFornecedores] = useState([
    { produtos: 'Arroz', empresa: 'Fornecedor A', cnpj: '12.345.678/0001-90', contato: 'João Silva', telefone: '(11) 99999-9999', email: 'contato@fornecedora.com' },
    { produtos: 'Feijão', empresa: 'Fornecedor B', cnpj: '98.765.432/0001-10', contato: 'Maria Oliveira', telefone: '(21) 98888-8888', email: 'maria@fornecedora.com' },
    { produtos: 'Carne', empresa: 'Fornecedor C', cnpj: '23.456.789/0001-50', contato: 'Carlos Souza', telefone: '(31) 97777-7777', email: 'carlos@fornecedora.com' }
  ]);
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNovoFornecedor({ ...novoFornecedor, [name]: value });
  };

  const handleAddFornecedor = (event) => {
    event.preventDefault();
    if (editando) {
      const fornecedoresAtualizados = fornecedores.map((fornecedor) =>
        fornecedor === fornecedorSelecionado ? novoFornecedor : fornecedor
      );
      setFornecedores(fornecedoresAtualizados);
      setEditando(false);
      setFornecedorSelecionado(null);
    } else {
      setFornecedores([...fornecedores, novoFornecedor]);
    }
    setNovoFornecedor({ produtos: '', empresa: '', cnpj: '', contato: '', telefone: '', email: '' });
  };

  const handleEditFornecedor = (fornecedor) => {
    setNovoFornecedor(fornecedor);
    setEditando(true);
    setFornecedorSelecionado(fornecedor);
  };

  const handleDeleteFornecedor = (fornecedor) => {
    const fornecedoresAtualizados = fornecedores.filter((item) => item !== fornecedor);
    setFornecedores(fornecedoresAtualizados);
  };

  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/Cadastro'); // Rota para a página de status dos pedidos
  };

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
                <th style={{ backgroundColor: '#2196F3', color: 'white', padding: '12px 20px', fontSize: '1em' }}>Email/Site</th>
                <th style={{ backgroundColor: '#2196F3', color: 'white', padding: '12px 20px', fontSize: '1em' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {fornecedores.map((fornecedor, index) => (
                <tr key={index}>
                  <td style={{ padding: '12px 20px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>{fornecedor.produtos}</td>
                  <td style={{ padding: '12px 20px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>{fornecedor.empresa}</td>
                  <td style={{ padding: '12px 20px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>{fornecedor.cnpj}</td>
                  <td style={{ padding: '12px 20px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>{fornecedor.contato}</td>
                  <td style={{ padding: '12px 20px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>{fornecedor.telefone}</td>
                  <td style={{ padding: '12px 20px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>{fornecedor.email}</td>
                  <td style={{ padding: '12px 20px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                    <button
                      onClick={() => handleEditFornecedor(fornecedor)}
                      style={{ backgroundColor: '#F20de7', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9em', marginRight: '5px' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteFornecedor(fornecedor)}
                      style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9em' }}
                    >
                      Excluir
                    </button>
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
