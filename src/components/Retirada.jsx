import { useState } from 'react';
import { Link } from 'react-router-dom';

const produtosData = [
    { SKU: '1234', nome: 'Coxa de Frango', qtdeEstoque: 100, tipo: 'proteina', dataCadastro: '2023-06-01' },
    { SKU: '5678', nome: 'Alface', qtdeEstoque: 50, tipo: 'hortaliças', dataCadastro: '2023-07-01' },
    // Adicione mais produtos conforme necessário
];

const RetiradaProdutos = () => {
    const [nomeOuSKU, setNomeOuSKU] = useState('');
    const [data, setData] = useState('');
    const [tipoProduto, setTipoProduto] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [retirante, setRetirante] = useState('');
    const [quantidadeRetirada, setQuantidadeRetirada] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleConsulta = () => {
        const resultado = produtosData.filter((produto) => {
            const nomeOuSkuMatch = produto.SKU.includes(nomeOuSKU) || produto.nome.toLowerCase().includes(nomeOuSKU.toLowerCase());
            const tipoMatch = tipoProduto ? produto.tipo === tipoProduto : true;
            const dataMatch = data ? produto.dataCadastro === data : true;
            return nomeOuSkuMatch && tipoMatch && dataMatch;
        });
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

        const produtoAtualizado = {
            ...produtoSelecionado,
            qtdeEstoque: produtoSelecionado.qtdeEstoque - quantidade,
        };
        setProdutos(
            produtos.map((produto) =>
                produto.SKU === produtoSelecionado.SKU ? produtoAtualizado : produto
            )
        );

        setMensagem(
            `Produto ${produtoSelecionado.nome} retirado por ${retirante}. Quantidade retirada: ${quantidade}. Estoque restante: ${produtoAtualizado.qtdeEstoque}.`
        );

        // Limpar o formulário
        setProdutoSelecionado(null);
        setRetirante('');
        setQuantidadeRetirada('');
    };

    const isConsultaDisabled = !nomeOuSKU || !data || !tipoProduto;

    return (
        <div className="bg-[#00009c] min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-white text-4xl font-bold mb-6">Retirada de Produtos</h1>
            <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block mb-2">
                            Nome ou SKU:
                            <input
                                type="text"
                                value={nomeOuSKU}
                                onChange={(e) => setNomeOuSKU(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </label>
                    </div>

                    <div>
                        <label className="block mb-2">
                            Data:
                            <input
                                type="date"
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </label>
                    </div>

                    <div>
                        <label className="block mb-2">
                            Tipo de Produto:
                            <select
                                value={tipoProduto}
                                onChange={(e) => setTipoProduto(e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Selecione</option>
                                <option value="proteina">Proteína</option>
                                <option value="mantimento">Mantimento</option>
                                <option value="hortaliças">Hortaliças</option>
                                <option value="doações">Doações</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={handleConsulta}
                        disabled={isConsultaDisabled}
                        className={`px-4 py-2 rounded text-white ${isConsultaDisabled ? 'bg-[#d10ccf] cursor-not-allowed' : ' bg-[#d10ccf] hover:bg-[#d10ccf]'}`}
                    >
                        Consultar
                    </button>
                </div>

                {produtos.length > 0 && (
                    <table className="w-full border-collapse mt-4">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">SKU</th>
                                <th className="border p-2">Nome</th>
                                <th className="border p-2">Tipo</th>
                                <th className="border p-2">Estoque</th>
                                <th className="border p-2">Selecionar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtos.map((produto) => (
                                <tr key={produto.SKU}>
                                    <td className="border p-2">{produto.SKU}</td>
                                    <td className="border p-2">{produto.nome}</td>
                                    <td className="border p-2">{produto.tipo}</td>
                                    <td className="border p-2">{produto.qtdeEstoque}</td>
                                    <td className="border p-2">
                                        <button
                                            onClick={() => handleSelecionarProduto(produto)}
                                            className="px-4 py-2 bg-[#d10ccf] text-white rounded "
                                        >
                                            Selecionar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {produtoSelecionado && (
                    <div className="mt-6">
                        <h2 className="text-center text-xl mb-2">Retirar Produto</h2>
                        <div className="flex flex-wrap justify-between mb-4">
                            <div className="w-full sm:w-1/2 mb-2">
                                <label className="block mb-2">
                                    Nome do Retirante:
                                    <input
                                        type="text"
                                        value={retirante}
                                        onChange={(e) => setRetirante(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                </label>
                            </div>
                            <div className="w-full sm:w-1/2 mb-2">
                                <label className="block mb-2">
                                    Quantidade:
                                    <input
                                        type="number"
                                        value={quantidadeRetirada}
                                        onChange={(e) => setQuantidadeRetirada(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={handleRetirarProduto}
                            className="px-4 py-2 bg-[#d10ccf] text-white rounded hover:bg-[#d10ccf]"
                        >
                            Retirar
                        </button>
                    </div>
                )}

                {mensagem && (
                    <div className="mt-4 text-green-600 text-center">
                        <p>{mensagem}</p>
                    </div>
                )}

                {/* Botão para voltar à página inicial */}
                <div className="mt-6 text-center">
                    <Link to="/retirada" className="px-4 py-2 bg-[#d10ccf] text-white rounded hover:bg-[#d10ccf]">
                        Voltar
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RetiradaProdutos;
