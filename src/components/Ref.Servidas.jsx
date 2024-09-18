import { useState } from 'react';
import * as XLSX from 'xlsx';

const Refeicoes = () => {
  const [formData, setFormData] = useState({
    turma: '',
    almoco: 0,
    jantar: 0,
    cafeManha: 0,
    lancheTarde: 0,
    refeicoesAparte: '',
    quantidadeRefeicoesAparte: 0,
    dataRefeicao: ''
  });
  const [refeicoes, setRefeicoes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddRefeicao = () => {
    const novaRefeicao = { ...formData };

    if (editIndex !== null) {
      const updatedRefeicoes = [...refeicoes];
      updatedRefeicoes[editIndex] = novaRefeicao;
      setRefeicoes(updatedRefeicoes);
      setEditIndex(null);
    } else {
      setRefeicoes([...refeicoes, novaRefeicao]);
    }

    clearForm();
  };

  const clearForm = () => {
    setFormData({
      turma: '',
      almoco: 0,
      jantar: 0,
      cafeManha: 0,
      lancheTarde: 0,
      refeicoesAparte: '',
      quantidadeRefeicoesAparte: 0,
      dataRefeicao: ''
    });
  };

  const handleEdit = (index) => {
    setFormData(refeicoes[index]);
    setEditIndex(index);
  };

  const handleRemove = (index) => {
    setRefeicoes(refeicoes.filter((_, i) => i !== index));
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(refeicoes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Refeições Servidas');
    XLSX.writeFile(workbook, 'Refeicoes-Servidas.xlsx');
  };

  return (
    <div style={{ background: "#00009c", padding: '20px', minHeight: '100vh', overflow: "hidden" }}>
      <h1 className='text-white text-center text-[90px]'>Cadastrar Refeição</h1>
      <div style={{ background: "white", padding: '12px', fontSize: "13px", color: "black", borderRadius: "40px", margin: "0 auto" }}>
        <form style={{display: "flex", marginRight:"1px"}}>
          {[
            { label: 'Turma/Funcionários', name: 'turma', type: 'text' },
            { label: 'Qtde de Almoço', name: 'almoco', type: 'number' },
            { label: 'Qtde de Jantar', name: 'jantar', type: 'number' },
            { label: 'Qtde de Café', name: 'cafeManha', type: 'number' },
            { label: 'Qtde de Lanche', name: 'lancheTarde', type: 'number' },
            { label: 'Refeições Parte', name: 'refeicoesAparte', type: 'text' },
            { label: 'Qtde de Refeições', name: 'quantidadeRefeicoesAparte', type: 'number' },
            { label: 'Data da Refeição', name: 'dataRefeicao', type: 'date' }
          ].map((input, index) => (
            <div style={{ marginBottom: '10px', width: '50%', display: "flex-grid" }} key={index}>
              <label>{input.label}: </label>
              <input
                name={input.name}
                type={input.type}
                value={formData[input.name]}
                onChange={handleInputChange}
                style={{ width: '80%', padding: '10px', color: "black", border: "1px solid rgb(115 113 113)", borderRadius: "12px"}}
              />
            </div>
          ))}

          
        </form>

        <div style={{ position: "relative", right: "-65vh"}}>
        <button
            type="button"
            onClick={handleAddRefeicao}
            style={{ padding: "11px 12px", background: "#F20DE7", color: "#fff", borderRadius: "12px", cursor: "pointer", border: "none", transition: "background-color 0.3s ease", whiteSpace: "nowrap", marginRight: '10px'  }}
          >
            {editIndex !== null ? 'Atualizar Refeição' : 'Adicionar Refeição'}
          </button>
          <button
            onClick={exportToExcel}
            style={{ padding: "11px 12px", background: "#F20DE7", color: "#fff", borderRadius: "12px", cursor: "pointer", border: "none", marginRight: '10px' }}
          >
            Exportar para Excel
          </button>
          <button
            onClick={clearForm}
            style={{ padding: "11px 12px", background: "#F20DE7", color: "#fff", borderRadius: "12px", cursor: "pointer", border: "none" }}
          >
            Limpar Formulário
          </button>
        </div>
          <br />
        <h2 className='text-black text-center text-[30px]'>Refeições Cadastradas</h2>
        <table style={{ marginTop: "5vh", width: '100%', borderCollapse: "collapse", textAlign: "center" }}>
          <thead>
            <tr className="bg-[#00FF62] text-black font-normal">
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Turma</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Almoço</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Jantar</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Café da Manhã</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Lanche da Tarde</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Refeições à Parte</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Qtd. Refeições à Parte</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Data</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {refeicoes.map((refeicao, index) => (
              <tr key={index}>
                {Object.keys(refeicao).map((key, i) => (
                  <td key={i} style={{ border: '1px solid #ddd', padding: '8px' }}>{refeicao[key]}</td>
                ))}
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    onClick={() => handleEdit(index)}
                    style={{ padding: "6px 12px", background: "#F20DE7", color: "#fff", borderRadius: "8px", cursor: "pointer", border: "none", marginRight: '5px' }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleRemove(index)}
                    style={{ padding: "6px 12px", background: "#F20DE7", color: "#fff", borderRadius: "8px", cursor: "pointer", border: "none" }}
                  >Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Refeicoes;
