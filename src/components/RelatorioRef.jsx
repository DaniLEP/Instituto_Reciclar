import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Chart from 'chart.js/auto';

export default function RelatorioRef() {
  const [dataConsulta, setDataConsulta] = useState('');
  const [dadosTabela, setDadosTabela] = useState([]);
  const [chart, setChart] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulação de dados
    const dadosExemplo = [
      { turma_funcionario: '2024', qtdeCafe: 0, qtdeAlmoco: 140, qtdeLanche: 98, qtdeJantar: 0, dataCadastro: "2024-09-19" },
      { turma_funcionario: '2023', qtdeCafe: 1, qtdeAlmoco: 90, qtdeLanche: 98, qtdeJantar: 0, dataCadastro: "2024-09-19" },
    ];
    setDadosTabela(dadosExemplo);
    gerarGrafico(dadosExemplo);
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dadosTabela);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
    XLSX.writeFile(wb, 'relatorio_RefServidas.xlsx');
  };

  const voltar = () => {
    navigate('/relatorio');
  };

  const gerarGrafico = (dados) => {
    const ctx = document.getElementById('chartProdutos').getContext('2d');
    
    if (chart) {
      chart.destroy(); // Destroi gráfico anterior ao gerar um novo
    }
    
    const novoGrafico = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dados.map(dado => dado.turma_funcionario), // Define os rótulos com base nas turmas/funcionários
        datasets: [
          {
            label: 'Quantidade de Café',
            data: dados.map(dado => dado.qtdeCafe),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Quantidade de Almoço',
            data: dados.map(dado => dado.qtdeAlmoco),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          },
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    
    setChart(novoGrafico);
  };

  return (
    <>
    <div style={{ background: "#00009C", display: "flex", flexDirection: "column", alignItems: "center", margin: "0", padding: "20px", minHeight: "100vh", overflow: "hidden" }}>
      <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", width: "94%", maxWidth: "1200px", margin: "5px 0" }}>
        <h1 className='text-center text-black text-[35px]'>Relatório de Refeições Servidas</h1>
        
        <form id="consultaForm" onSubmit={handleSubmit} style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <label htmlFor="dataConsulta" style={{ fontWeight: "bold", margin: "8px 18px" }}>Selecione a Data:</label>
          <input
            type="date"
            id="dataConsulta"
            name="dataConsulta"
            value={dataConsulta}
            onChange={(e) => setDataConsulta(e.target.value)}
            required
            style={{ padding: "5px", marginRight: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <button type="submit" style={{ padding: "10px 20px", marginRight: "10px", border: "none", backgroundColor: "#F20DE7", color: "#fffcfc", borderRadius: "4px", cursor: "pointer", transition: "background-color 0.3s ease" }}>Consultar</button>
        </form>

        <div className="chart-container" style={{ margin: "45px 67vh", textAlign: "center", width: "57vh", height: "31vh" }}>
          <canvas id="chartProdutos"></canvas>
        </div>

        <div className="button-container">
          <button id="downloadExcel" onClick={handleExportExcel} style={{ padding: "10px 20px", marginRight: "10px", border: "none", backgroundColor: "#F20DE7", color: "#fffcfc", borderRadius: "4px", cursor: "pointer", transition: "background-color 0.3s ease" }}>
            Exportar em Excel
          </button>
        </div>

        {/* Tabela com estilo visual aprimorado */}
        <table id="tabelaResultados" style={{ width: "100%", borderCollapse: "collapse", margin: "20px 0", fontSize: "16px" }}>
          <thead>
            <tr style={{ backgroundColor: "#00009C", color: "#fff", textAlign: "center" }}>
              <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Turma/Funcionário</th>
              <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Quantidade de Café</th>
              <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Quantidade de Almoço</th>
              <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Quantidade de Lanche</th>
              <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Quantidade de Jantar</th>
              <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Data da Refeição</th>
            </tr>
          </thead>
          <tbody>
            {dadosTabela.map((dado, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff", textAlign: "center" }}>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{dado.turma_funcionario}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{dado.qtdeCafe}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{dado.qtdeAlmoco}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{dado.qtdeLanche}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{dado.qtdeJantar}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{dado.dataCadastro}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="button" id="return" onClick={voltar} style={{ position: "absolute", top: "5vh", background: "none", border: "none" }}>
          <img src="/return.svg" alt="Voltar" style={{ width: "50px", height: "50px" }} />
        </button>
      </div>
    </div>
    </>
  );
}
