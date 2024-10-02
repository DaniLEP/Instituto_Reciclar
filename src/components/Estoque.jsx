import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Função auxiliar para gerar datas aleatórias dentro de um intervalo
const generateRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Gerar produtos fictícios com data de cadastro e data de vencimento
const generateProducts = (count) => {
    const products = [];
    const today = new Date();
    
    for (let i = 1; i <= count; i++) {
        const registerDate = generateRandomDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30), today);
        const expiryDate = generateRandomDate(today, new Date(today.getFullYear(), today.getMonth() + 6, today.getDate())); // Vencimento até 6 meses no futuro

        products.push({
            sku: `SKU${i.toString().padStart(4, '0')}`, // SKU formatado como SKU0001, SKU0002, etc.
            name: `Produto ${i}`,
            type: i % 3 === 0 ? 'proteína' : i % 3 === 1 ? 'mantimento' : 'hortaliças',
            quantity: Math.floor(Math.random() * 100) + 1, // Quantidade entre 1 e 100
            price: (Math.random() * 100).toFixed(2), // Preço aleatório entre 0 e 100
            registerDate: registerDate,
            expiryDate: expiryDate,
        });
    }
    return products;
};

const productsData = generateProducts(50);

const Estoque = () => {
    const [sku, setSku] = useState('');
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        const foundProduct = productsData.find(item => item.sku === sku);
        if (foundProduct) {
            setProduct(foundProduct);
            setError('');
        } else {
            setProduct(null);
            setError('Produto não encontrado.');
        }
    };

    const voltar = () => {
        navigate('/relatorio');
    };

    const handleBack = () => {
        setSku('');
        setProduct(null);
        setError('');
    };

    // Função para calcular dias de consumo
    const calculateConsumptionDays = (registerDate, expiryDate) => {
        const diffTime = Math.abs(expiryDate - registerDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Converter de milissegundos para dias
        return diffDays;
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f5f5f5' }}>
            <div style={{ maxWidth: '90%', margin: 'auto', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
                <h1>Consulta de Estoque</h1>
                <div style={{ marginBottom: '20px', width: '100%' }}>
                    <input
                        type="text"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        placeholder="Digite o SKU"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <button
                            onClick={handleSearch}
                            style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
                        >
                            Consultar
                        </button>
                        {product && (
                            <button
                                onClick={handleBack}
                                style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Limpar
                            </button>
                        )}
                    </div>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {product && (
                    <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                        <p><strong>SKU:</strong> {product.sku}</p>
                        <p><strong>Nome:</strong> {product.name}</p>
                        <p><strong>Tipo:</strong> {product.type}</p>
                        <p><strong>Quantidade:</strong> {product.quantity}</p>
                        <p><strong>Preço:</strong> R$ {product.price}</p>
                        <p><strong>Data de Cadastro:</strong> {product.registerDate.toLocaleDateString()}</p>
                        <p><strong>Data de Vencimento:</strong> {product.expiryDate.toLocaleDateString()}</p>
                        <p><strong>Dias de Consumo:</strong> {calculateConsumptionDays(product.registerDate, product.expiryDate)} dias</p>
                    </div>
                )}
                
                <h2>Produtos no Estoque</h2>
                <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f2f2f2' }}>SKU</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f2f2f2' }}>Nome</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f2f2f2' }}>Tipo</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f2f2f2' }}>Quantidade</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f2f2f2' }}>Preço</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f2f2f2' }}>Data de Cadastro</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f2f2f2' }}>Data de Vencimento</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f2f2f2' }}>Dias de Consumo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productsData.map((item) => (
                                <tr key={item.sku}>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{item.sku}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{item.name}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{item.type}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{item.quantity}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>R$ {item.price}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{item.registerDate.toLocaleDateString()}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{item.expiryDate.toLocaleDateString()}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{calculateConsumptionDays(item.registerDate, item.expiryDate)} dias</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <button
                type="button"
                onClick={voltar}
                style={{
                    padding: '10px 20px',
                    border: 'none',
                    backgroundColor: '#F20DE7',
                    color: '#fff',
                    borderRadius: '4px',
                    marginTop: '10px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    display: 'block',
                    width: '100%',
                    maxWidth: '200px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
            >
                Voltar
            </button>
        </div>
    );
};

export default Estoque;
