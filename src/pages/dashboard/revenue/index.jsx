import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Chart from 'chart.js/auto';

export default function RelatorioRef() {
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [dadosTabela, setDadosTabela] = useState([]);
  const [chart, setChart] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dados fictícios para ilustrar o gráfico e a tabela
    const dadosFicticios = [
      { tipo: 'Funcionario', turma_funcionario: '2024', qtdeCafe: 10, qtdeAlmoco: 100, qtdeLanche: 50, qtdeJantar: 10, dataCadastro: '2024-09-19' },
      { tipo: 'Funcionario', turma_funcionario: '2023', qtdeCafe: 15, qtdeAlmoco: 120, qtdeLanche: 60, qtdeJantar: 20, dataCadastro: '2024-09-20' },
      { tipo: 'Jovem', turma_funcionario: '2024', qtdeCafe: 5, qtdeAlmoco: 60, qtdeLanche: 30, qtdeJantar: 5, dataCadastro: '2024-09-21' },
      { tipo: 'Jovem', turma_funcionario: '2023', qtdeCafe: 8, qtdeAlmoco: 80, qtdeLanche: 40, qtdeJantar: 8, dataCadastro: '2024-09-22' },
    ];

    // Filtra os dados fictícios com base no período informado
    let dadosFiltrados = dadosFicticios;
    if (dataInicial && dataFinal) {
      dadosFiltrados = dadosFicticios.filter((dado) => {
        const dataCadastro = new Date(dado.dataCadastro);
        return dataCadastro >= new Date(dataInicial) && dataCadastro <= new Date(dataFinal);
      });
    }

    setDadosTabela(dadosFiltrados);
    gerarGrafico(dadosFiltrados);
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dadosTabela);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
    XLSX.writeFile(wb, 'relatorio_RefServidas.xlsx');
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
        labels: dados.map((dado) => dado.turma_funcionario),
        datasets: [
          {
            label: 'Quantidade de Café',
            data: dados.map((dado) => dado.qtdeCafe),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Quantidade de Almoço',
            data: dados.map((dado) => dado.qtdeAlmoco),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
          {
            label: 'Quantidade de Lanche',
            data: dados.map((dado) => dado.qtdeLanche),
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
          },
          {
            label: 'Quantidade de Jantar',
            data: dados.map((dado) => dado.qtdeJantar),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    setChart(novoGrafico);
  };

  return (
    <div style={{ background: '#00009C', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0', padding: '20px', minHeight: '100vh', overflow: 'hidden' }}>
      <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', width: '94%', maxWidth: '1200px', margin: '5px 0' }}>
        <h1 className="text-center text-black text-[35px]">Relatório de Refeições Servidas</h1>

        <form id="consultaForm" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <label htmlFor="dataInicial" style={{ fontWeight: 'bold', margin: '8px 18px' }}>Data Inicial:</label>
            <input
              type="date"
              id="dataInicial"
              value={dataInicial}
              onChange={(e) => setDataInicial(e.target.value)}
              style={{ padding: '5px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px', width: '100%', maxWidth: '300px' }}
            />

            <label htmlFor="dataFinal" style={{ fontWeight: 'bold', margin: '8px 18px' }}>Data Final:</label>
            <input
              type="date"
              id="dataFinal"
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value)}
              style={{ padding: '5px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px', width: '100%', maxWidth: '300px' }}
            />

            <button type="submit" style={{ padding: '10px 20px', margin: '10px 0', border: 'none', backgroundColor: '#F20DE7', color: '#fffcfc', borderRadius: '4px', cursor: 'pointer' }}>
              Consultar
            </button>
          </div>
        </form>

        <div className="chart-container" style={{ margin: '45px auto', textAlign: 'center', width: '100%', maxWidth: '90%' }}>
          <canvas id="chartProdutos" style={{ width: '100%', height: 'auto' }}></canvas>
        </div>

        <div className="tabela-container" style={{ margin: '20px 0', textAlign: 'center' }}>
          <table style={{ width: '100%', marginBottom: '20px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px', border: '1px solid #ccc' }}>Turma</th>
                <th style={{ padding: '8px', border: '1px solid #ccc' }}>Café</th>
                <th style={{ padding: '8px', border: '1px solid #ccc' }}>Almoço</th>
                <th style={{ padding: '8px', border: '1px solid #ccc' }}>Lanche</th>
                <th style={{ padding: '8px', border: '1px solid #ccc' }}>Jantar</th>
              </tr>
            </thead>
            <tbody>
              {dadosTabela.map((dado, index) => (
                <tr key={index}>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>{dado.turma_funcionario}</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>{dado.qtdeCafe}</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>{dado.qtdeAlmoco}</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>{dado.qtdeLanche}</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>{dado.qtdeJantar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={handleExportExcel} style={{ padding: '10px 20px', backgroundColor: '#8E44AD', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '5px', margin: '10px' }}>
            Exportar para Excel
          </button>
          <button onClick={voltar} style={{ padding: '10px 20px', backgroundColor: '#F20DE7', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '5px', margin: '10px' }}>
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
