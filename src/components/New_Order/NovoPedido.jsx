import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getDatabase, ref, get, push, set } from 'firebase/database';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.appspot.com",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2"
};

// Inicializando o Firebase (só se não houver app inicializado)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export default function NovoPedido() {
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [numeroPedido, setNumeroPedido] = useState('');
  const [periodoInicio, setPeriodoInicio] = useState('');
  const [periodoFim, setPeriodoFim] = useState('');
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
  const [dadosFornecedor, setDadosFornecedor] = useState({
    razaoSocial: '',
    cnpj: '',
    grupo: '',
    contato: '',
    email: '',
    telefone: ''
  });

  const [products, setProducts] = useState([]);
  const [productSelecionado, setProductSelecionado] = useState(null);
  const [dadosProduct, setDadosProduct] = useState({
    sku: '',
    name: '',
    tipo: '',
    unidMedida: '',
    quantidade: 1, // Adicionando o campo quantidade
    observacao: '' // Adicionando o campo observação
  });
  const [showModalFornecedor, setShowModalFornecedor] = useState(false);
  const [showModalProduto, setShowModalProduto] = useState(false);
  const [itensPedido, setItensPedido] = useState([]); 

  useEffect(() => {
    const numero = `PED${Math.floor(Math.random() * 1000000)}`;
    setNumeroPedido(numero);

    const fetchFornecedores = async () => {
      const fornecedoresRef = ref(db, 'CadastroFornecedores');
      const fornecedorSnapshot = await get(fornecedoresRef);
      if (fornecedorSnapshot.exists()) {
        setFornecedores(Object.values(fornecedorSnapshot.val()));
      } else {
        toast.error("Nenhum fornecedor encontrado!");
      }
    };

    const fetchProdutos = async () => {
      const produtosRef = ref(db, 'EntradaProdutos');
      const produtoSnapshot = await get(produtosRef);
      if (produtoSnapshot.exists()) {
        setProducts(Object.values(produtoSnapshot.val()));
      } else {
        toast.error("Nenhum produto encontrado!");
      }
    };

    fetchFornecedores();
    fetchProdutos();
  }, []);

  const handleFornecedorSelect = (fornecedor) => {
    setFornecedorSelecionado(fornecedor);
    setDadosFornecedor({
      razaoSocial: fornecedor.razaoSocial,
      cnpj: fornecedor.cnpj,
      grupo: fornecedor.grupo,
      contato: fornecedor.contato,
      email: fornecedor.email,
      telefone: fornecedor.telefone
    });
    setShowModalFornecedor(false);
    toast.success("Fornecedor selecionado com sucesso!");
  };

  const handleProductSelect = (product) => {
    setProductSelecionado(product);
    setDadosProduct({
      sku: product.sku,
      name: product.name,
      tipo: product.tipo,
      marca: product.marca,
      category: product.category,
      unit: product.unit,
      quantidade: " ", // Inicializando quantidade
      observacao: '' // Inicializando observação
    });
    setShowModalProduto(false);
    toast.success("Produto selecionado com sucesso!");
  };

  const handleAddProductToOrder = () => {
    if (productSelecionado && dadosProduct.quantidade > 0) {
      const item = {
        ...dadosProduct,
        quantidade: dadosProduct.quantidade,
        observacao: dadosProduct.observacao
      };
      setItensPedido([...itensPedido, item]);
      setProductSelecionado(null);
      setDadosProduct({
        sku: '',
        name: '',
        tipo: '',
        unit: '',
        marca: '',
        category: '',
        quantidade: 1,
        observacao: ''
      });
      toast.info("Produto adicionado ao pedido.");
    } else {
      toast.error("Selecione um produto e insira a quantidade válida!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!dataSelecionada || !periodoInicio || !periodoFim || !fornecedorSelecionado || itensPedido.length === 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    const pedido = {
      numeroPedido,
      dataPedido: dataSelecionada,
      periodoInicio,
      periodoFim,
      fornecedor: dadosFornecedor,
      produtos: itensPedido,
      status: 'pendente',
      dataCriacao: new Date().toISOString(),
    };

    const pedidosRef = ref(db, 'novosPedidos');
    const newPedidoRef = push(pedidosRef);
    set(newPedidoRef, pedido)
      .then(() => {
        toast.success('Pedido salvo com sucesso!');
        setDataSelecionada('');
        setPeriodoInicio('');
        setPeriodoFim('');
        setFornecedorSelecionado(null);
        setItensPedido([]);
      })
      .catch((error) => {
        toast.error('Erro ao salvar o pedido: ' + error.message);
      });
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f4f6f9',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
    },
    header: {
      backgroundColor: 'rgba(231, 223, 223, 0.4)',
      marginBottom: '40px',
      textAlign: 'center',
    },
    title: {
      fontSize: '2.5rem',
      color: '#333',
      marginBottom: '10px',
    },
    input: {
      padding: '12px 18px',
      fontSize: '1rem',
      width: '100%',
      maxWidth: '350px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      marginBottom: '15px',
      backgroundColor: '#fff',
    },
    button: {
      padding: '12px 30px',
      fontSize: '1.2rem',
      backgroundColor: '#4CAF50',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      marginTop: '20px',
    },
    modal: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '999',
      color: 'black',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: '30px',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '800px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHeader: {
      backgroundColor: '#f2f2f2',
      textAlign: 'left',
    },
    tableCell: {
      padding: '8px',
      borderBottom: '1px solid #ddd',
      textAlign: 'center'
    },
    textArea: {
      width: '100%',
      height: '100px',
      padding: '12px 18px',
      fontSize: '1rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
      marginBottom: '15px',
      backgroundColor: '#fff',
    },
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      <div style={styles.header}>
        <h2 style={styles.title}>Cadastro de Pedido</h2>
        <div style={{ fontSize: '25px', fontWeight: 'bold' }}>
          <strong style={{ fontWeight: 'normal' }}>Número do Pedido: </strong>{numeroPedido}
        </div>
        <br />
        <p style={{ fontSize: '18px', color: '#555' }}>Preencha os detalhes do pedido abaixo</p>

        <div>
          <label>Data do Pedido: </label>
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            style={styles.input}
          />
        </div>
        <div>
          <label>Período: </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="date"
              value={periodoInicio}
              onChange={(e) => setPeriodoInicio(e.target.value)}
              style={styles.input}
            />
            <input
              type="date"
              value={periodoFim}
              onChange={(e) => setPeriodoFim(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>
      </div>

      <div>
        <h3>Fornecedor</h3>
        <button onClick={() => setShowModalFornecedor(true)} style={styles.button}>Selecionar Fornecedor</button>
        
        {showModalFornecedor && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h4>Selecione um Fornecedor</h4>
              <ul>
                {fornecedores.map(fornecedor => (
                  <li key={fornecedor.cnpj}>
                    {fornecedor.razaoSocial}
                    <button onClick={() => handleFornecedorSelect(fornecedor)} style={styles.button}>Selecionar</button>
                  </li>
                ))}
              </ul>
              <button onClick={() => setShowModalFornecedor(false)} style={styles.button}>Fechar</button>
            </div>
          </div>
        )}

        {fornecedorSelecionado && (
          <div style={{ marginTop: '20px' }}>
            <div>
              <label>Razão Social: </label>
              <input
                type="text"
                value={dadosFornecedor.razaoSocial}
                readOnly
                style={styles.input}
              />
            </div>
            <div>
              <label>CNPJ do Fornecedor: </label>
              <input
                type="text"
                value={dadosFornecedor.cnpj}
                readOnly
                style={styles.input}
              />
            </div>
            <div>
              <label>Grupo: </label>
              <input
                type="text"
                value={dadosFornecedor.grupo}
                readOnly
                style={styles.input}
              />
            </div>
            <div>
              <label>Contato: </label>
              <input
                type="text"
                value={dadosFornecedor.contato}
                readOnly
                style={styles.input}
              />
            </div>
            <div>
              <label>E-mail: </label>
              <input
                type="text"
                value={dadosFornecedor.email}
                readOnly
                style={styles.input}
              />
            </div>
            <div>
              <label>Telefone: </label>
              <input
                type="text"
                value={dadosFornecedor.telefone}
                readOnly
                style={styles.input}
              />
            </div>
          </div>
        )}
      </div>

      <hr style={{ border: '10px black'}}/>
      <br /><br />
      <div>
        <h3>Produto</h3>
        <button onClick={() => setShowModalProduto(true)} style={styles.button}>Selecionar Produto</button>
        
        {showModalProduto && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h4>Selecione um Produto</h4>
              <table style={styles.table}>
                <thead style={styles.tableHeader}>
                  <tr>
                    <th style={styles.tableCell}>Produto</th>
                    <th style={styles.tableCell}>Tipo</th>
                    <th style={styles.tableCell}>Marca</th>
                    <th style={styles.tableCell}>Grupo</th>
                    <th style={styles.tableCell}>Unidade</th>
                    <th style={styles.tableCell}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.sku}>
                      <td style={styles.tableCell}>{product.name}</td>
                      <td style={styles.tableCell}>{product.tipo}</td>
                      <td style={styles.tableCell}>{product.marca}</td>
                      <td style={styles.tableCell}>{product.category}</td>
                      <td style={styles.tableCell}>{product.unit}</td>
                      <td style={styles.tableCell}>
                        <button onClick={() => handleProductSelect(product)} style={styles.button}>Selecionar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={() => setShowModalProduto(false)} style={styles.button}>Fechar</button>
            </div>
          </div>
        )}

        {dadosProduct.sku && (
          <div style={{ marginTop: '20px' }}>
            <div>
              <label>SKU: </label>
              <input
                type="text"
                value={dadosProduct.sku}
                readOnly
                style={styles.input}
              />
            </div>
            <div>
              <label>Nome: </label>
              <input
                type="text"
                value={dadosProduct.name}
                readOnly
                style={styles.input}
              />
            </div>
            <div>
              <label>Tipo: </label>
              <input
                type="text"
                value={dadosProduct.tipo}
                readOnly
                style={styles.input}
              />
            </div>
            <div>
              <label>Marca: </label>
              <input
                type="text"
                value={dadosProduct.marca}
                readOnly
                style={styles.input}
              />
            </div>
            <div>
              <label>Grupo: </label>
              <input
                type="text"
                value={dadosProduct.category}
                readOnly
                style={styles.input}
              />
            </div>
            <div>
              <label>Unidade de Medida: </label>
              <input
                type="text"
                value={dadosProduct.unit}
                readOnly
                style={styles.input}
              />
            </div>
            <div>
              <label>Quantidade: </label>
              <input
                type="number"
                value={dadosProduct.quantidade}
                onChange={(e) => setDadosProduct({ ...dadosProduct, quantidade: e.target.value })}
                min="1"
                style={styles.input}
              />
            </div>
            <div>
              <label>Observação: </label>
              <textarea
                value={dadosProduct.observacao}
                onChange={(e) => setDadosProduct({ ...dadosProduct, observacao: e.target.value })}
                style={styles.textArea}
              />
            </div>
          </div>
        )}

        <div>
          <button onClick={handleAddProductToOrder} style={styles.button}>Adicionar Produto ao Pedido</button>
        </div>
      </div>
 <br /><br /><br />
      <div>
        <h3>Itens do Pedido</h3>
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.tableCell}>SKU</th>
              <th style={styles.tableCell}>Nome</th>
              <th style={styles.tableCell}>Tipo</th>
              <th style={styles.tableCell}>Marca</th>
              <th style={styles.tableCell}>Grupo</th>
              <th style={styles.tableCell}>Unidade de Medida</th>
              <th style={styles.tableCell}>Quantidade</th>
              <th style={styles.tableCell}>Observação</th>
            </tr>
          </thead>
          <tbody>
            {itensPedido.map((item, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>{item.sku}</td>
                <td style={styles.tableCell}>{item.name}</td>
                <td style={styles.tableCell}>{item.tipo}</td>
                <td style={styles.tableCell}>{item.marca}</td>
                <td style={styles.tableCell}>{item.category}</td>
                <td style={styles.tableCell}>{item.unit}</td>
                <td style={styles.tableCell}>{item.quantidade}</td>
                <td style={styles.tableCell}>{item.observacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <button onClick={handleSubmit} style={styles.button}>Finalizar Pedido</button>
      </div>
    </div>
  );
}