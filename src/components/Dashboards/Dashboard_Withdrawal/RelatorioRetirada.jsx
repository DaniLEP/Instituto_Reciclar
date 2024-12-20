import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Chart from 'chart.js/auto';

export default function RelatorioRetirada() {
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
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
    navigate('/Dashboard');
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
          backgroundColor: dados.map(() => 'rgba(54, 162, 235, 0.6)'),
          borderColor: dados.map(() => 'rgba(54, 162, 235, 1)'),
          borderWidth: 2,
          hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
          hoverBorderColor: 'rgba(54, 162, 235, 1)',
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true,
        animation: {
          duration: 1000,
          easing: 'easeInOutQuad',
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                size: 16,
              },
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleColor: '#fff',
            bodyColor: '#fff',
            callbacks: {
              label: function(tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw} unidades`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 14,
                weight: 'bold',
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.2)',
            },
            ticks: {
              font: {
                size: 14,
                weight: 'bold',
              },
            },
          },
        }
      }
    });
    
    setChart(novoGrafico);
  };

  return (
    <>
      <div style={{ backgroundColor: '#00009c', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', minHeight: '100vh' }}>
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '1200px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '36px', color: '#2C3E50', marginBottom: '20px' }}>Relatório de Produtos Retirados</h1>
          
          <form id="consultaForm" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <label htmlFor="dataInicial" style={{ fontWeight: 'bold', marginBottom: '8px', color: '#2C3E50', fontSize: '16px' }}>Data Inicial:</label>
              <input
                type="date"
                id="dataInicial"
                name="dataInicial"
                value={dataInicial}
                onChange={(e) => setDataInicial(e.target.value)}
                required
                style={{ padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px' }}
              />

              <label htmlFor="dataFinal" style={{ fontWeight: 'bold', marginBottom: '8px', color: '#2C3E50', fontSize: '16px' }}>Data Final:</label>
              <input
                type="date"
                id="dataFinal"
                name="dataFinal"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
                required
                style={{ padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px' }}
              />
              
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#8E44AD', color: '#fff', borderRadius: '8px', cursor: 'pointer', border: 'none', transition: 'background-color 0.3s ease' }}>Consultar</button>
            </div>
          </form>

          <div style={{ margin: '40px 0', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <canvas id="chartProdutos" style={{ width: '100%', maxWidth: '800px' }}></canvas>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
            <button onClick={handleExportExcel} style={{ padding: '10px 20px', backgroundColor: '#8E44AD', color: '#fff', borderRadius: '8px', cursor: 'pointer', border: 'none', transition: 'background-color 0.3s ease' }}>Exportar para Excel</button>
            <button onClick={voltar} style={{ padding: '10px 20px', backgroundColor: '#F20DE7', color: '#fff', borderRadius: '8px', cursor: 'pointer', border: 'none', transition: 'background-color 0.3s ease' }}>Voltar</button>
          </div>

          <div style={{ width: '100%', overflowX: 'auto'}}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px'}}>
              <thead style={{background: 'black'}}>
                <tr>
                  <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '1px solid #ddd', backgroundColor: '#f2f2f2' }}>SKU</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '1px solid #ddd', backgroundColor: '#f2f2f2' }}>Tipo de Produto</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '1px solid #ddd', backgroundColor: '#f2f2f2' }}>Produto</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '1px solid #ddd', backgroundColor: '#f2f2f2' }}>Fornecedor</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '1px solid #ddd', backgroundColor: '#f2f2f2' }}>Quantidade</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '1px solid #ddd', backgroundColor: '#f2f2f2' }}>Unidade de Medida</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '1px solid #ddd', backgroundColor: '#f2f2f2' }}>Quantidade Retirada</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '1px solid #ddd', backgroundColor: '#f2f2f2' }}>Data da Retirada</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '1px solid #ddd', backgroundColor: '#f2f2f2' }}>Nome do Retirante</th>
                </tr>
              </thead>
              <tbody>
                {dadosTabela.map((dado, index) => (
                  <tr key={index}>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>{dado.sku}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>{dado.tipoProduto}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>{dado.produto}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>{dado.fornecedor}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>{dado.quantidade}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>{dado.unidadeMedida}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>{dado.quantidadeRetirada}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>{dado.dataRetirada}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>{dado.nomeRetirante}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
