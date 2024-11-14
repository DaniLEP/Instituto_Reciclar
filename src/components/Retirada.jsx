import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RetiradaProdutos = () => {

  // Dados fictícios para os produtos
  const produtosData = [
    { SKU: '1234', nome: 'Coxa de Frango', qtdeEstoque: 100, tipo: 'proteina', dataCadastro: '2023-06-01' },
    { SKU: '5678', nome: 'Alface', qtdeEstoque: 50, tipo: 'hortaliças', dataCadastro: '2023-07-01' },
    { SKU: '9101', nome: 'Arroz', qtdeEstoque: 200, tipo: 'mantimento', dataCadastro: '2023-08-01' },
    // Adicione mais produtos conforme necessário
  ];

  // Estados do componente
  const [nomeOuSKU, setNomeOuSKU] = useState('');
  const [data, setData] = useState('');
  const [tipoProduto, setTipoProduto] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidadeRetirada, setQuantidadeRetirada] = useState('');
  const [retirante, setRetirante] = useState('');
  const [mensagem, setMensagem] = useState('');

  // Função para consultar produtos com base nos filtros
  const handleConsulta = () => {
    const resultado = produtosData.filter((produto) => {
      const nomeOuSkuMatch = produto.SKU.includes(nomeOuSKU) || produto.nome.toLowerCase().includes(nomeOuSKU.toLowerCase());
      const tipoMatch = tipoProduto ? produto.tipo === tipoProduto : true;
      const dataMatch = data ? produto.dataCadastro === data : true;
      return nomeOuSkuMatch && tipoMatch && dataMatch;
    });
    setProdutos(resultado);
  };

  // Função para selecionar o produto para retirada
  const handleSelecionarProduto = (produto) => {
    setProdutoSelecionado(produto);
  };

  // Função para retirar o produto
  const handleRetirarProduto = () => {
    if (!produtoSelecionado || !quantidadeRetirada || !retirante) {
      setMensagem('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const quantidade = parseInt(quantidadeRetirada, 10);
    if (quantidade <= 0 || quantidade > produtoSelecionado.qtdeEstoque) {
      setMensagem('Quantidade inválida ou maior que o estoque disponível.');
      return;
    }

    const produtoAtualizado = {
      ...produtoSelecionado,
      qtdeEstoque: produtoSelecionado.qtdeEstoque - quantidade,
    };

    // Atualiza a lista de produtos com o novo estoque
    setProdutos(produtos.map((produto) => (produto.SKU === produtoSelecionado.SKU ? produtoAtualizado : produto)));
    
    setMensagem(
      `Produto ${produtoSelecionado.nome} retirado por ${retirante}. Quantidade retirada: ${quantidade}. Estoque restante: ${produtoAtualizado.qtdeEstoque}.`
    );

    // Limpar o formulário de retirada
    setProdutoSelecionado(null);
    setRetirante('');
    setQuantidadeRetirada('');
  };

  // Função de navegação para voltar
  const navigate = useNavigate()

  const handleVoltar = () => navigate ("/Retirada")

  return (
    <div className="bg-blue-800 min-h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-6">Retirada de Produtos</h1>

      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-xl">
        {/* Botão de Voltar */}
        <button
          onClick={handleVoltar}
          className="mb-4 px-6 py-2 bg-[#F20DE7] text-white rounded-lg hover:bg-['#8E44AD']"
        >
          Voltar
        </button>

        {/* Filtros de consulta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-2 text-black">Nome ou SKU:</label>
            <input
              type="text"
              value={nomeOuSKU}
              onChange={(e) => setNomeOuSKU(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-black">Data:</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-black">Tipo de Produto:</label>
            <select
              value={tipoProduto}
              onChange={(e) => setTipoProduto(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="">Selecione</option>
              <option value="proteina">Proteína</option>
              <option value="mantimento">Mantimento</option>
              <option value="hortaliças">Hortaliças</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleConsulta}
          disabled={!nomeOuSKU && !data && !tipoProduto}
          className="w-full py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700"
        >
          Consultar
        </button>

        {/* Exibição dos produtos filtrados */}
        {produtos.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full table-auto border-separate border-spacing-0">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">SKU</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Nome</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Tipo</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Estoque</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Ação</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto) => (
                  <tr key={produto.SKU} className="hover:bg-gray-100">
                    <td className="p-4 text-sm text-gray-800">{produto.SKU}</td>
                    <td className="p-4 text-sm text-gray-800">{produto.nome}</td>
                    <td className="p-4 text-sm text-gray-800">{produto.tipo}</td>
                    <td className="p-4 text-sm text-gray-800">{produto.qtdeEstoque}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleSelecionarProduto(produto)}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Selecionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Formulário de retirada */}
        {produtoSelecionado && (
          <div className="mt-8">
            <h2 className="text-xl text-black font-semibold text-center mb-4">Retirar Produto</h2>
            <div className="flex flex-col sm:flex-row sm:space-x-6 mb-6">
              <div className="flex-1 mb-4 sm:mb-0">
                <label className="block  font-semibold mb-2 text-black">Nome do Retirante:</label>
                <input
                  type="text"
                  value={retirante}
                  onChange={(e) => setRetirante(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              <div className="flex-1">
                <label className="block  font-semibold mb-2 text-black">Quantidade:</label>
                <input
                  type="number"
                  value={quantidadeRetirada}
                  onChange={(e) => setQuantidadeRetirada(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
            </div>

            <button
              onClick={handleRetirarProduto}
              className="w-full py-3 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700"
            >
              Retirar
            </button>
          </div>
        )}

        {/* Mensagem de confirmação ou erro */}
        {mensagem && (
          <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg text-center">
            {mensagem}
          </div>
        )}
      </div>
    </div>
  );
};

export default RetiradaProdutos;
