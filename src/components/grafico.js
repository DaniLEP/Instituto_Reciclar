const dadosRelatorio = {
    proteina: [
        { proteina: 'Whey Protein', tipo: 'Pó', dataCadastro: '2024-06-01', dataVencimento: '2024-06-30', fornecedor: 'Fornecedor A', valorUnitario: 60.00, valorTotal: 150.00 },
        { proteina: 'Caseína', tipo: 'Pó', dataCadastro: '2024-06-10', dataVencimento: '2024-07-10', fornecedor: 'Fornecedor B', valorUnitario: 80.00, valorTotal: 80.00 },
        { proteina: 'Albumina', tipo: 'Pó', dataCadastro: '2024-06-15', dataVencimento: '2024-07-15', fornecedor: 'Fornecedor C', valorUnitario: 60.00, valorTotal: 30.00 }
    ],
    mantimento: [
        { mantimento: 'Arroz', Fornecedor: 'Fornecedor 1', QuantKG: 50, UnidadeMedida: 'kg', ValorUnitario: 1, ValorTotal: 50, DataCadastro: '2024-01-01', DataVencimento: '2024-06-01' },
        { mantimento: 'Feijão', Fornecedor: 'Fornecedor 2', QuantKG: 30, UnidadeMedida: 'kg', ValorUnitario: 1, ValorTotal: 30, DataCadastro: '2024-01-10', DataVencimento: '2024-07-10' },
        { mantimento: 'Macarrão', Fornecedor: 'Fornecedor 3', QuantKG: 20, UnidadeMedida: 'kg', ValorUnitario: 0.5, ValorTotal: 10, DataCadastro: '2024-02-01', DataVencimento: '2024-08-01' },
        { mantimento: 'Farinha', Fornecedor: 'Fornecedor 4', QuantKG: 25, UnidadeMedida: 'kg', ValorUnitario: 1, ValorTotal: 25, DataCadastro: '2024-03-01', DataVencimento: '2024-09-01' }
    ],
    hortalica: [
        { hortalica: 'Alface Amaricano', Fornecedor: 'Fornecedor 1', QuantKG: 50,  Tipo: "Verdura", UnidadeMedida: 'kg', ValorUnitario: 1, ValorTotal: 50, DataCadastro: '2024-01-01', DataVencimento: '2024-06-01' },
        { hortalica: 'Maçã', Fornecedor: 'Fornecedor 2', QuantKG: 30,  Tipo: "Fruta", UnidadeMedida: 'kg', ValorUnitario: 1, ValorTotal: 30, DataCadastro: '2024-01-10', DataVencimento: '2024-07-10' },
        { hortalica: 'Beringela', Fornecedor: 'Fornecedor 3', QuantKG: 20, Tipo: "Legumes" , UnidadeMedida: 'kg', ValorUnitario: 0.5, ValorTotal: 10, DataCadastro: '2024-02-01', DataVencimento: '2024-08-01' },
],
    doacoes: [  
        { produto: 'Arroz', Fornecedor: 'Fornecedor 1', QuantKG: 50, UnidadeMedida: 'kg', PesoUnitario: 1, PesoTotal: 50, DataCadastro: '2024-01-01', DataVencimento: '2024-06-01' },
        { produto: 'Feijão', Fornecedor: 'Fornecedor 2', QuantKG: 30, UnidadeMedida: 'kg', PesoUnitario: 1, PesoTotal: 30, DataCadastro: '2024-01-10', DataVencimento: '2024-07-10' },
        { produto: 'Macarrão', Fornecedor: 'Fornecedor 3', QuantKG: 20, UnidadeMedida: 'kg', PesoUnitario: 0.5, PesoTotal: 10, DataCadastro: '2024-02-01', DataVencimento: '2024-08-01' },
        { produto: 'Farinha', Fornecedor: 'Fornecedor 4', QuantKG: 25, UnidadeMedida: 'kg', PesoUnitario: 1, PesoTotal: 25, DataCadastro: '2024-03-01', DataVencimento: '2024-09-01' }
],
    refeicoes: [
        { TurmaFuncionario: 'Turma 2021', quantidadeCafedamanha: 30, quantidadeAlmoco: 25, quantidadeLanchedatarde: 20, quantidadeJantar: 15, dataConsumo: '2024-06-01' },
        { TurmaFuncionario: 'Funcionarios', quantidadeCafedamanha: 40, quantidadeAlmoco: 35, quantidadeLanchedatarde: 30, quantidadeJantar: 25, dataConsumo: '2024-06-02' },
        { TurmaFuncionario: 'Turma 2023', quantidadeCafedamanha: 50, quantidadeAlmoco: 45, quantidadeLanchedatarde: 40, quantidadeJantar: 35, dataConsumo: '2024-06-03' },
        { TurmaFuncionario: 'Funcionarios', quantidadeCafedamanha: 60, quantidadeAlmoco: 55, quantidadeLanchedatarde: 50, quantidadeJantar: 45, dataConsumo: '2024-06-04' }
    ]
};
function gerarGrafico(tipo, canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const dados = dadosRelatorio[tipo];

    // Transformar dados em formato de gráfico
    const labels = dados.map(item => item.proteina || item.mantimento || item.hortalica || item.produto || item.TurmaFuncionario);
    const valores = dados.map(item => item.ValorTotal || item.pesoTotal || item.quantidadeCafedamanha || item.quantidadeAlmoco || item.quantidadeLanchedatarde || item.quantidadeJantar);


    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: `Total ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`,
                data: valores,
                backgroundColor: '#00FF62',
                borderColor: 'black',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function exibirRelatorios() {
    gerarGrafico( 'proteina', 'graficoProteina');
    gerarGrafico( 'mantimento', 'graficoMantimento');
    gerarGrafico( 'hortalica', 'graficoHortalica');
    gerarGrafico( 'doacoes','graficoDoacoes');
    gerarGrafico( 'refeicoes','graficoRefeicoes');
}

document.addEventListener('DOMContentLoaded', exibirRelatorios);