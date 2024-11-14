import { useState } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const HistoricoRetiradas = () => {
  const navigate = useNavigate();

  const [retiradas, setRetiradas] = useState([
    { id: 1, sku: '123456', nome: 'Arroz Branco', tipo: 'Mantimento', data: '2024-11-05', quantidade: 20 },
    { id: 2, sku: '654321', nome: 'Peito de Frango', tipo: 'Proteína', data: '2024-11-06', quantidade: 10 },
    { id: 3, sku: '789012', nome: 'Cenoura', tipo: 'Hortaliça', data: '2024-11-07', quantidade: 15 },
    { id: 4, sku: '345678', nome: 'Feijão Preto', tipo: 'Mantimento', data: '2024-11-08', quantidade: 30 },
    { id: 5, sku: '234567', nome: 'Alface', tipo: 'Hortaliça', data: '2024-11-09', quantidade: 50 },
  ]);

  const [produtoAtual, setProdutoAtual] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [retiradasFiltradas, setRetiradasFiltradas] = useState(retiradas);

  const abrirFormularioEdicao = (produto) => {
    setProdutoAtual({ ...produto });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProdutoAtual((prevProduto) => ({
      ...prevProduto,
      [name]: value,
    }));
  };

  const salvarEdicao = () => {
    setRetiradas(retiradas.map((retirada) => 
      retirada.id === produtoAtual.id ? produtoAtual : retirada
    ));
    setModalOpen(false);
  };

  const fecharModal = () => {
    setModalOpen(false);
  };

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(retiradasFiltradas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Histórico de Retiradas');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'historico-retiradas.xlsx');
  };

  const filtrarRetiradas = () => {
    const filtradas = retiradas.filter((retirada) => {
      const dataRetirada = new Date(retirada.data);
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      return dataRetirada >= inicio && dataRetirada <= fim && retirada.tipo === tipoFiltro;
    });
    setRetiradasFiltradas(filtradas.length > 0 ? filtradas : retiradas);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px' }}>
      <button onClick={() => navigate(-1)} style={{ backgroundColor: '#F20DE7', color: 'white', padding: '10px 20px', fontSize: '1.1rem', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}>
         Voltar
      </button>

      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', color: '#2c3e50', marginBottom: '30px' }}>Histórico de Retiradas</h1>

      <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', marginBottom: '20px' }}>
        <label>Data Início:</label>
        <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} style={{ backgroundColor: '#f0f8ff', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <label>Data Final:</label>
        <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} style={{ backgroundColor: '#f0f8ff', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <label>Tipo:</label>
        <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)} style={{ backgroundColor: '#f0f8ff', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
          <option value="">Selecione um tipo</option>
          <option value="Proteína">Proteína</option>
          <option value="Mantimento">Mantimento</option>
          <option value="Hortaliças">Hortaliças</option>
        </select>
        <button onClick={filtrarRetiradas} style={{ backgroundColor: '#28a745', color: 'white', padding: '10px', fontSize: '1rem', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Consultar
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '30px' }}>
  <thead style={{ background: '#8E44AD', fontSize: '20px', color: 'white', borderRadius: 3, textAlign: 'center' }}>
    <tr>
      <th>SKU</th>
      <th>Nome</th>
      <th>Tipo</th>
      <th>Data</th>
      <th>Quantidade</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    {retiradasFiltradas.map((retirada) => (
      <tr key={retirada.id}>
        <td style={{ textAlign: 'center' }}>{retirada.sku}</td>
        <td style={{ textAlign: 'center' }}>{retirada.nome}</td>
        <td style={{ textAlign: 'center' }}>{retirada.tipo}</td>
        <td style={{ textAlign: 'center' }}>{retirada.data}</td>
        <td style={{ textAlign: 'center' }}>{retirada.quantidade}</td>
        <td style={{ textAlign: 'center' }}>
          <button onClick={() => abrirFormularioEdicao(retirada)} style={{ backgroundColor: '#F20DE7', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Editar
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      {isModalOpen && (
        <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#d3d3d3', padding: '20px', borderRadius: '5px', maxWidth: '400px', width: '100%' }}>
            <h2 style={{color: 'black', fontSize: '30px', textAlign: 'center'}}>Editar Produto</h2>
            <label>SKU:</label>
            <input type="text" name="sku" value={produtoAtual.sku} onChange={handleChange} style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '25px', backgroundColor: '#f0f8ff', borderRadius: '5px', border: '1px solid #ccc' }} />
            <label style={{fontSize: '20px'}}>Nome:</label>
            <input type="text" name="nome" value={produtoAtual.nome} onChange={handleChange} style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '25px', backgroundColor: '#f0f8ff', borderRadius: '5px', border: '1px solid #ccc' }} />
            <label style={{fontSize: '20px'}}>Tipo:</label>
            <input type="text" name="tipo" value={produtoAtual.tipo} onChange={handleChange} style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '25px', backgroundColor: '#f0f8ff', borderRadius: '5px', border: '1px solid #ccc' }} />
            <label style={{fontSize: '20px'}}>Data:</label>
            <input type="date" name="data" value={produtoAtual.data} onChange={handleChange} style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '25px', backgroundColor: '#f0f8ff', borderRadius: '5px', border: '1px solid #ccc' }} />
            <label style={{fontSize: '20px'}}>Quantidade:</label>
            <input type="number" name="quantidade" value={produtoAtual.quantidade} onChange={handleChange} style={{ width: '100%', padding: '10px', marginBottom: '20px', fontSize: '25px', backgroundColor: '#f0f8ff', borderRadius: '5px', border: '1px solid #ccc' }} />
            <button onClick={salvarEdicao} style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', fontSize: '1rem', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Salvar
            </button>
            <button onClick={fecharModal} style={{ backgroundColor: 'grey', color: 'white', padding: '10px 20px', fontSize: '1rem', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }}>
              Fechar
            </button>
          </div>
        </div>
      )}
      <button onClick={exportarExcel} style={{ backgroundColor: '#8E44AD', color: 'white', padding: '10px', fontSize: '1rem', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}>
        Exportar para Excel
      </button>
    </div>
  );
};

export default HistoricoRetiradas;
