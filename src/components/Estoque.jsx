import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Gerar produtos fictícios
const generateProducts = (count) => {
    const products = [];
    for (let i = 1; i <= count; i++) {
        products.push({
            sku: `SKU${i.toString().padStart(4, '0')}`, // SKU formatado como SKU0001, SKU0002, etc.
            name: `Produto ${i}`,
            type: i % 3 === 0 ? 'proteína' : i % 3 === 1 ? 'mantimento' : 'hortaliças',
            quantity: Math.floor(Math.random() * 100) + 1, // Quantidade entre 1 e 100
            price: (Math.random() * 100).toFixed(2), // Preço aleatório entre 0 e 100
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

    // Estilos
    const appStyle = {
        fontFamily: 'Arial, sans-serif',
        margin: 0,
        padding: '20px',
        backgroundColor: '#f5f5f5',
    };

    const stockPageStyle = {
        maxWidth: '90%',
        margin: 'auto',
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    };

    const searchContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '20px',
        width: '100%',
    };

    const inputStyle = {
        flex: 1,
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        marginBottom: '10px',
    };

    const buttonStyle = {
        padding: '10px 15px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '10px',
    };

    const buttonHoverStyle = {
        backgroundColor: '#0056b3',
    };

    const errorStyle = {
        color: 'red',
    };

    const tableContainerStyle = {
        overflowX: 'auto', // Permite rolagem horizontal
        marginTop: '20px',
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
    };

    const thStyle = {
        border: '1px solid #ccc',
        padding: '10px',
        backgroundColor: '#f2f2f2',
    };

    const tdStyle = {
        border: '1px solid #ccc',
        padding: '10px',
        textAlign: 'center',
    };

    const productDetailsStyle = {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9',
    };

    return (
        <div style={appStyle}>
            <div style={stockPageStyle}>
                <h1>Consulta de Estoque</h1>
                <div style={searchContainerStyle}>
                    <input
                        type="text"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        placeholder="Digite o SKU"
                        style={inputStyle}
                    />
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <button
                            onClick={handleSearch}
                            style={buttonStyle}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
                        >
                            Consultar
                        </button>
                        {product && (
                            <button
                                onClick={handleBack}
                                style={buttonStyle}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
                            >
                                Limpar
                            </button>
                        )}
                    </div>
                </div>
                {error && <p style={errorStyle}>{error}</p>}
                {product && (
                    <div style={productDetailsStyle}>
                        <p><strong>SKU:</strong> {product.sku}</p>
                        <p><strong>Nome:</strong> {product.name}</p>
                        <p><strong>Tipo:</strong> {product.type}</p>
                        <p><strong>Quantidade:</strong> {product.quantity}</p>
                        <p><strong>Preço:</strong> R$ {product.price}</p>
                    </div>
                )}
                
                <h2>Produtos no Estoque</h2>
                <div style={tableContainerStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>SKU</th>
                                <th style={thStyle}>Nome</th>
                                <th style={thStyle}>Tipo</th>
                                <th style={thStyle}>Quantidade</th>
                                <th style={thStyle}>Preço</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productsData.map((item) => (
                                <tr key={item.sku}>
                                    <td style={tdStyle}>{item.sku}</td>
                                    <td style={tdStyle}>{item.name}</td>
                                    <td style={tdStyle}>{item.type}</td>
                                    <td style={tdStyle}>{item.quantity}</td>
                                    <td style={tdStyle}>R$ {item.price}</td>
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
