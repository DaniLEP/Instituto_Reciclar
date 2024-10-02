import { useState } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom'; // Import para navegar
import React from 'react';

const HistoricoRetiradas = () => {
  const navigate = useNavigate(); // Hook de navegação
  
  const [retiradas, setRetiradas] = useState([
    { id: 1, sku: '123456', nome: 'Produto A', tipo: 'Mantimento', data: '2024-09-20', quantidade: 5 },
    { id: 2, sku: '654321', nome: 'Produto B', tipo: 'Proteína', data: '2024-09-21', quantidade: 10 },
  ]);
  
  const [produtoAtual, setProdutoAtual] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [retiradasFiltradas, setRetiradasFiltradas] = useState([]);

  // Abrir o modal com os dados do produto atual
  const abrirFormularioEdicao = (produto) => {
    setProdutoAtual(produto);
    setModalOpen(true);
  };

  // Atualizar os detalhes do produto
  const salvarEdicao = () => {
    setRetiradas(retiradas.map((retirada) => 
      retirada.id === produtoAtual.id ? produtoAtual : retirada
    ));
    setModalOpen(false);
  };

  // Atualizar os campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProdutoAtual((prevProduto) => ({
      ...prevProduto,
      [name]: value,
    }));
  };

  // Função para restaurar o produto ao estoque e removê-lo da tabela
  const restaurarProduto = (id) => {
    setRetiradas(retiradas.filter((retirada) => retirada.id !== id));
    alert(`Produto restaurado ao estoque.`);
  };

  // Função para exportar para Excel
  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(retiradas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Histórico de Retiradas');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'historico-retiradas.xlsx');
  };

  // Função para filtrar as retiradas
  const filtrarRetiradas = () => {
    const filtradas = retiradas.filter((retirada) => {
      const dataRetirada = new Date(retirada.data);
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      return dataRetirada >= inicio && dataRetirada <= fim && retirada.tipo === tipoFiltro;
    });
    setRetiradasFiltradas(filtradas);
  };

  // Verifica se todos os campos estão preenchidos
  const todosCamposPreenchidos = dataInicio && dataFim && tipoFiltro;

  return (
    <div style={styles.container}>
      {/* Botão de Voltar */}
      <button style={styles.backButton} onClick={() => navigate(-1)}>
        Voltar
      </button>

      <h1 style={styles.title}>Histórico de Retiradas</h1>

      {/* Formulário de Consulta */}
      <div>
        <label style={styles.label}>Data Início:</label>
        <input 
          type="date" 
          value={dataInicio} 
          onChange={(e) => setDataInicio(e.target.value)} 
          style={styles.input}
        />

        <label style={styles.label}>Data Final:</label>
        <input 
          type="date" 
          value={dataFim} 
          onChange={(e) => setDataFim(e.target.value)} 
          style={styles.input}
        />

        <label style={styles.label}>Tipo:</label>
        <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)} style={styles.input}>
          <option value="">Selecione um tipo</option>
          <option value="Proteína">Proteína</option>
          <option value="Mantimento">Mantimento</option>
          <option value="Hortaliças">Hortaliças</option>
        </select>

        <button 
          style={styles.filterButton} 
          onClick={filtrarRetiradas} 
          disabled={!todosCamposPreenchidos}
        >
          Consultar
        </button>
      </div>

      {/* Tabela de Resultados */}
      {retiradasFiltradas.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.headerCell}>SKU</th>
              <th style={styles.headerCell}>Nome</th>
              <th style={styles.headerCell}>Tipo</th>
              <th style={styles.headerCell}>Data</th>
              <th style={styles.headerCell}>Quantidade</th>
              <th style={styles.headerCell}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {retiradasFiltradas.map((retirada) => (
              <tr key={retirada.id} style={styles.row}>
                <td style={styles.cell}>{retirada.sku}</td>
                <td style={styles.cell}>{retirada.nome}</td>
                <td style={styles.cell}>{retirada.tipo}</td>
                <td style={styles.cell}>{retirada.data}</td>
                <td style={styles.cell}>{retirada.quantidade}</td>
                <td style={styles.cell}>
                  <button style={styles.editButton} onClick={() => abrirFormularioEdicao(retirada)}>Editar</button>
                  <button style={styles.restoreButton} onClick={() => restaurarProduto(retirada.id)}>Restaurar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button style={styles.exportButton} onClick={exportarExcel}>Exportar para Excel</button>

      {/* Modal de edição */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Editar Produto</h2>
            <form>
              <label style={styles.label}>Nome:</label>
              <input 
                type="text" 
                name="nome" 
                value={produtoAtual.nome} 
                onChange={handleChange} 
                style={styles.input}
              />

              <label style={styles.label}>Quantidade:</label>
              <input 
                type="number" 
                name="quantidade" 
                value={produtoAtual.quantidade} 
                onChange={handleChange} 
                style={styles.input}
              />

              <label style={styles.label}>Tipo:</label>
              <input 
                type="text" 
                name="tipo" 
                value={produtoAtual.tipo} 
                onChange={handleChange} 
                style={styles.input}
              />

              <div style={styles.modalActions}>
                <button type="button" style={styles.saveButton} onClick={salvarEdicao}>Salvar</button>
                <button type="button" style={styles.cancelButton} onClick={() => setModalOpen(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos CSS in-line
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  backButton: {
    backgroundColor: '#F20DE7',
    border: 'none',
    color: 'white',
    padding: '12px 20px',
    fontSize: '1em',
    cursor: 'pointer',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
    fontSize: '2em',
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  },
  headerCell: {
    backgroundColor: '#00009C',
    color: 'white',
    padding: '10px',
    fontSize: '1em',
    textAlign: 'center',
    borderBottom: '2px solid #ddd',
  },
  row: {
    backgroundColor: '#f9f9f9',
    transition: 'background-color 0.2s ease',
  },
  cell: {
    padding: '10px',
    textAlign: 'center',
    borderBottom: '1px solid #ddd',
  },
  editButton: {
    backgroundColor: '#F20DE7',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '3px',
    marginRight: '12px'
  },
  restoreButton: {
    backgroundColor: '#F20DE7',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '3px',
  },
  exportButton: {
    backgroundColor: '#F20DE7',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  filterButton: {
    backgroundColor: '#F20DE7',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '400px',
  },
  modalTitle: {
    marginBottom: '20px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
};

export default HistoricoRetiradas;
