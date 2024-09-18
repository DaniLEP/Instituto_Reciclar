import { useState } from 'react';

// Dados fictícios para exemplificação
const produtosData = [
  { SKU: '1234', nome: 'Coxa de Frango', fornecedor: 'Mais Brasil', qtdeEstoque: 100, tipo: 'AVE', dataCadastro: '2024-02-01', dataVencimento: '2024-06-03' },
  { SKU: '1234', nome: 'Coxa de Frango', fornecedor: 'Mais Brasil', qtdeEstoque: 100, tipo: 'AVE', dataCadastro: '2024-02-01', dataVencimento: '2024-06-03' },
  { SKU: '4567', nome: 'Coxão Mole', fornecedor: 'Friboi', qtdeEstoque: 50, tipo: 'BOVINO', dataCadastro: '2023-06-01', dataVencimento: '2024-06-01' },
  // Adicione mais produtos conforme necessário
];

const RetiradaProdutos = () => {
  const [nomeOuSKU, setNomeOuSKU] = useState('');
  const [data, setData] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [retirante, setRetirante] = useState('');
  const [quantidadeRetirada, setQuantidadeRetirada] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleConsulta = () => {
    const resultado = produtosData.filter(produto =>
      (produto.nome.toLowerCase().includes(nomeOuSKU.toLowerCase()) || produto.SKU.includes(nomeOuSKU)) &&
      (!data || produto.dataCadastro === data)
    );
    setProdutos(resultado);
  };

  const handleSelecionarProduto = (produto) => {
    setProdutoSelecionado(produto);
  };

  const handleRetirarProduto = () => {
    if (!produtoSelecionado || !retirante || !quantidadeRetirada) {
      setMensagem('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const quantidade = parseInt(quantidadeRetirada, 10);
    if (quantidade <= 0 || quantidade > produtoSelecionado.qtdeEstoque) {
      setMensagem('Quantidade inválida ou maior que o estoque disponível.');
      return;
    }

    const produtoAtualizado = { ...produtoSelecionado, qtdeEstoque: produtoSelecionado.qtdeEstoque - quantidade };
    setProdutos(produtos.map(produto =>
      produto.SKU === produtoSelecionado.SKU ? produtoAtualizado : produto
    ));

    setMensagem(`Produto ${produtoSelecionado.nome} retirado por ${retirante}. Quantidade retirada: ${quantidade}. Estoque restante: ${produtoAtualizado.qtdeEstoque}.`);

    // Limpar o formulário
    setProdutoSelecionado(null);
    setRetirante('');
    setQuantidadeRetirada('');
  };

  // Função para salvar a retirada e permitir uma nova consulta
  const handleSalvar = () => {
    setMensagem('');
    setNomeOuSKU('');
    setData('');
    setProdutos([]);
    setProdutoSelecionado(null);
    setRetirante('');
    setQuantidadeRetirada('');
  };

  return (
    <div style={{ background: '#00009c', height: "100vh", overflow: "auto", color: "black", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: "bold", margin: "20px 0", color:"white"}}>Retirada de Produtos</h1>

      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "20px", background: "white", borderRadius: "12px" }}>
        <div style={{ marginBottom: '20px', textAlign: "center" }}>
          <label style={{ marginRight: '20px' }}>
            Nome ou SKU:
            <input
              type="text"
              value={nomeOuSKU}
              onChange={(e) => setNomeOuSKU(e.target.value)}
              style={{ marginLeft: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </label>
          <label style={{ marginRight: '20px' }}>
            Data:
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              style={{ marginLeft: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </label>
          <button
            onClick={handleConsulta}
            style={{ padding: "10px 20px", border: "none", background: "#F20DE7", color: "#fff", borderRadius: "4px", cursor: "pointer", transition: "background-color 0.3s ease" }}
          >
            Consultar
          </button>
        </div>

        {produtos.length > 0 && (
          <div>
            <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold", marginBottom: "20px" }}>Produtos Encontrados</h2>
            <table border="3 black"  style={{ marginTop: "5vh", width: '100%', color: "black", borderCollapse: "collapse", textAlign: "center"}}>    
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Nome</th>
                  <th>Fornecedor</th>
                  <th>Qtde no Estoque</th>
                  <th>Qtde Cadastrada</th>
                  <th>Qtde Utilizada</th>
                  <th>Tipo</th>
                  <th>Data Cadastro</th>
                  <th>Data Vencimento</th>
                  <th>Selecionar</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto) => (
                  <tr key={produto.SKU}>
                    <td>{produto.SKU}</td>
                    <td>{produto.nome}</td>
                    <td>{produto.fornecedor}</td>
                    <td>{produto.qtdeEstoque}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>{produto.tipo}</td>
                    <td>{produto.dataCadastro}</td>
                    <td>{produto.dataVencimento}</td>
                    <td>
                      <button
                        onClick={() => handleSelecionarProduto(produto)}
                        style={{ padding: "5px 10px", border: "none", background: "#28a745", color: "#fff", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Selecionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {produtoSelecionado && (
              <div style={{ marginTop: '20px', textAlign: "center" }}>
                <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold", marginBottom: "20px" }}>Retirar Produto</h2>
                <label>
                  Nome do Retirante:
                  <input
                    type="text"
                    value={retirante}
                    onChange={(e) => setRetirante(e.target.value)}
                    style={{ marginLeft: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </label>
                <label style={{ marginLeft: '20px' }}>
                  Quantidade:
                  <input
                    type="number"
                    value={quantidadeRetirada}
                    onChange={(e) => setQuantidadeRetirada(e.target.value)}
                    style={{ marginLeft: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </label>
                <button
                  onClick={handleRetirarProduto}
                  style={{ marginLeft: '20px', padding: "10px 20px", border: "none", background: "#dc3545", color: "#fff", borderRadius: "4px", cursor: "pointer" }}
                >
                  Retirar
                </button>
                <button
                  onClick={handleSalvar}
                  style={{ marginLeft: '20px', padding: "10px 20px", border: "none", background: "#007bff", color: "#fff", borderRadius: "4px", cursor: "pointer" }}
                >
                  Salvar
                </button>
              </div>
            )}
          </div>
        )}

        {mensagem && (
          <div style={{ marginTop: '20px', color: 'red', textAlign: 'center' }}>
            <p>{mensagem}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RetiradaProdutos;
