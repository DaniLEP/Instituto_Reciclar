import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Chart from 'chart.js/auto';

export default function RelatorioAnual() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [tipoProduto, setTipoProduto] = useState('');
  const [dadosTabela, setDadosTabela] = useState([]);
  const [chart, setChart] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulação de dados
    const dadosExemplo = [
      { sku: 'P001', tipoSelecionado: 'Proteína', fornecedor: 'Fornecedor A', quantidade: 100, unidadeMedida: 'Kg', tipo: 'Proteína', valorUnitario: 20, valorTotal: 2000, valorGasto: 2000, dataCadastro: "2024-09-19" },
      { sku: 'M002', tipoSelecionado: 'Mantimento', fornecedor: 'Fornecedor B', quantidade: 200, unidadeMedida: 'Kg', tipo: 'Mantimento', valorUnitario: 10, valorTotal: 2000, valorGasto: 2000, dataCadastro: "2024-09-19" },
    ];
    setDadosTabela(dadosExemplo);
    gerarGrafico(dadosExemplo);
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dadosTabela);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
    XLSX.writeFile(wb, 'relatorio_Periodico.xlsx');
  };

  const voltar = () => {
    navigate('/relatorio');
  };

  const gerarGrafico = (dados) => {
    const ctx = document.getElementById('chartProdutos').getContext('2d');
    
    if (chart) {
      chart.destroy(); // Destroi gráfico anterior ao gerar um novo
    }

    const tipoProdutos = [...new Set(dados.map(dado => dado.tipoSelecionado))];
    const valores = tipoProdutos.map(tipo => 
      dados
        .filter(dado => dado.tipoSelecionado === tipo)
        .reduce((acc, dado) => acc + dado.valorTotal, 0)
    );

    const novoGrafico = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: tipoProdutos,
        datasets: [{
          data: valores,
          backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
      }
    });
    
    setChart(novoGrafico);
  };

  return (
    <div style={{ background: "#00009C", display: "flex", flexDirection: "column", alignItems: "center", margin: "0", padding: "20px", minHeight: "100vh", overflow: "hidden" }}>
      <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", width: "94%", maxWidth: "1200px", margin: "5px 0" }}>
        <h1 className='text-center text-black text-[35px]'>Relatório Periódico</h1>
        
        <form id="consultaForm" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <label htmlFor="dataInicio" style={{ fontWeight: "bold", margin: "8px 18px" }}>Data Início:</label>
            <input
              type="date"
              id="dataInicio"
              name="dataInicio"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              required
              style={{ padding: "5px", marginRight: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
            <label htmlFor="dataFim" style={{ fontWeight: "bold", margin: "8px 18px" }}>Data Fim:</label>
            <input
              type="date"
              id="dataFim"
              name="dataFim"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              required
              style={{ padding: "5px", marginRight: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
          
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <label htmlFor="tipoProduto" style={{ fontWeight: "bold", margin: "8px 18px" }}>Tipo de Produto:</label>
            <select
              id="tipoProduto"
              name="tipoProduto"
              value={tipoProduto}
              onChange={(e) => setTipoProduto(e.target.value)}
              required
              style={{ padding: "5px", marginRight: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
            >
              <option value="">Selecione</option>
              <option value="Proteína">Proteína</option>
              <option value="Mantimento">Mantimento</option>
              <option value="Hortaliças">Hortaliças</option>
              <option value="Doações">Doações</option>
              <option value="Retiradas">Retiradas</option>
            </select>
          </div>
          
          <button type="submit" style={{ padding: "10px 20px", border: "none", backgroundColor: "#F20DE7", color: "#fffcfc", borderRadius: "4px", cursor: "pointer", transition: "background-color 0.3s ease" }}>Consultar</button>
        </form>

        <div className="chart-container" style={{ margin: "45px auto", textAlign: "center", width: "80%", maxWidth: "600px", height: "300px" }}>
          <canvas id="chartProdutos"></canvas>
        </div>

        <div className="button-container" style={{ margin: "20px 0" }}>
          <button id="downloadExcel" onClick={handleExportExcel} style={{ padding: "10px 20px", border: "none", backgroundColor: "#F20DE7", color: "#fffcfc", borderRadius: "4px", cursor: "pointer", transition: "background-color 0.3s ease" }}>
            Exportar em Excel
          </button>
        </div>

        {/* Tabela com estilo visual aprimorado */}
        <table id="tabelaResultados" style={{ width: "100%", borderCollapse: "collapse", margin: "20px 0", fontSize: "16px" }}>
          <thead>
            <tr style={{ backgroundColor: "#00009C", color: "#fff", textAlign: "center" }}>
              <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>SKU</th>
              <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Tipo Selecionado</th>
              <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Fornecedor</th>
              <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Quantidade</th>
              <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Uni. Medida</th>
              <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Tipo</th>
              <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Valor Unitário</th>
              <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Valor Total</th>
              <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Valor Gasto no Período</th>
              <th style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}>Data Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {dadosTabela.map((item, index) => (
              <tr key={index} style={{ textAlign: "center" }}>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{item.sku}</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{item.tipoSelecionado}</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{item.fornecedor}</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{item.quantidade}</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{item.unidadeMedida}</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{item.tipo}</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{item.valorUnitario}</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{item.valorTotal}</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{item.valorGasto}</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{item.dataCadastro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" id="return" onClick={voltar} style={{ position: "absolute", top: "5vh", background: "none", border: "none", right:"190vh" }}>
          <img src="/return.svg" alt="Voltar" style={{ width: "50px", height: "50px" }} />
        </button>
    </div>
  );
}
