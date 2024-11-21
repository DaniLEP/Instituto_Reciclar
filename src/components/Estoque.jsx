
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { useNavigate } from 'react-router-dom';

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.firebasestorage.app",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbProdutos = ref(db, 'Estoque');

const Estoque = () => {
  const [sku, setSku] = useState('');
  const [productName, setProductName] = useState('');
  const [productsData, setProductsData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Buscar produtos do Firebase
  useEffect(() => {
    onValue(dbProdutos, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const products = Object.keys(data).map(key => ({
          sku: key,
          ...data[key]
        }));
        setProductsData(products);
        setFilteredProducts(products); // Inicialmente, exibe todos os produtos
      }
    });
  }, []);

  const handleSearch = () => {
    const filtered = productsData.filter(
      (item) =>
        item.sku.includes(sku) ||
        item.name.toLowerCase().includes(productName.toLowerCase())
    );
    if (filtered.length > 0) {
      setFilteredProducts(filtered);
      setError('');
    } else {
      setFilteredProducts([]);
      setError('Produto não encontrado.');
    }
  };

  const handleBack = () => {
    setSku('');
    setProductName('');
    setFilteredProducts(productsData); // Resetando o filtro para exibir todos os produtos
    setError('');
  };

  const calculateConsumptionDays = (registerDate, expiryDate) => {
    // Garantir que as datas sejam convertidas para objetos Date
    const registerDateObj = new Date(registerDate);
    const expiryDateObj = new Date(expiryDate);

    const diffTime = Math.abs(expiryDateObj - registerDateObj);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Converter de milissegundos para dias
  };

  const voltar = () => {
    navigate('/Dashboard');
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
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Digite Produto"
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <button
              onClick={handleSearch}
              style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
            >
              Consultar
            </button>
            {filteredProducts.length > 0 && (
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
        {filteredProducts.length > 0 && (
          <div style={{ overflowX: 'auto', marginTop: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f2f2f2' }}>SKU</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f2f2f2' }}>Nome</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f2f2f2' }}>Tipo</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f2f2f2' }}>Quantidade</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f2f2f2' }}>Valor Unitário</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f2f2f2' }}>Data de Cadastro</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f2f2f2' }}>Data de Vencimento</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f2f2f2' }}>Dias de Consumo</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((item) => (
                  <tr key={item.sku}>
                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{item.sku}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{item.name}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{item.category || 'N/A'}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>R$ {item.unitPrice}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{new Date(item.dateAdded).toLocaleDateString()}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{new Date(item.expiryDate).toLocaleDateString()}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{calculateConsumptionDays(item.dateAdded, item.expiryDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ marginTop: '20px' }}>
          <button onClick={voltar} style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Estoque;
