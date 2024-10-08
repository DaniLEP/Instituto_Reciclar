import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Chart from 'chart.js/auto';

export default function RelatorioRetirada() {
  const [dataConsulta, setDataConsulta] = useState('');
  const [dadosTabela, setDadosTabela] = useState([]);
  const [chart, setChart] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const dadosExemplo = [
      { sku: 'P001', tipoProduto: 'Proteína', produto: 'Coxa de Frango', fornecedor: 'Calvo', quantidade: 100, unidadeMedida: 'Kg', estoqueAtual: 50, quantidadeRetirada: 50, dataRetirada: "2024-09-18", nomeRetirante: "Rose" },
      { sku: 'M002', tipoProduto: 'Mantimento', produto: 'Alface', fornecedor: 'Dia', quantidade: 200, unidadeMedida: 'Kg', estoqueAtual: 150, quantidadeRetirada: 50, dataRetirada: "2024-09-18", nomeRetirante: "Maria" },
    ];
    setDadosTabela(dadosExemplo);
    gerarGrafico(dadosExemplo);
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dadosTabela);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
    XLSX.writeFile(wb, 'relatorio_Produtos.xlsx');
  };

  const voltar = () => {
    navigate('/relatorio');
  };

  const gerarGrafico = (dados) => {
    const ctx = document.getElementById('chartProdutos').getContext('2d');
    
    if (chart) {
      chart.destroy();
    }
    
    const novoGrafico = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dados.map(dado => dado.sku),
        datasets: [{
          label: 'Quantidade Retirada',
          data: dados.map(dado => dado.quantidadeRetirada),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
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
          <h1 className='text-center text-black text-[35px]'>Relatório de Produtos Retirados</h1>
          
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

          <div style={{ overflowX: "auto" }}>
            <table id="tabelaResultados" style={{ width: "100%", borderCollapse: "collapse", margin: "20px 0", fontSize: "16px" }}>
              <thead>
                <tr style={{ backgroundColor: "#00009C", color: "#fff", textAlign: "center" }}>
                  <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>SKU</th>
                  <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Tipo de Produto</th>
                  <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Produto</th>
                  <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Fornecedor</th>
                  <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Quantidade Total</th>
                  <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Unidade de Medida</th>
                  <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Estoque Atual</th>
                  <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Quantidade Retirada</th>
                  <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Data de Retirada</th>
                  <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Nome do Retirante</th>
                </tr>
              </thead>
              <tbody>
                {dadosTabela.map((dado, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff", textAlign: "center" }}>
                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{dado.sku}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{dado.tipoProduto}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{dado.produto}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{dado.fornecedor}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{dado.quantidade}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{dado.unidadeMedida}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{dado.estoqueAtual}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{dado.quantidadeRetirada}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{dado.dataRetirada}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{dado.nomeRetirante}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="button" id="return" onClick={voltar} style={{ position: "absolute", top: "5vh", background: "none", border: "none" }}>
            <img src="/return.svg" alt="Voltar" style={{ width: "50px", height: "50px" }} />
          </button>
        </div>
      </div>
    </>
  );
}
