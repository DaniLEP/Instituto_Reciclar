// NovoPedido.jsx
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase, ref, get, push, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.appspot.com",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export default function NovoPedido() {
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [numeroPedido, setNumeroPedido] = useState("");
  const [periodoInicio, setPeriodoInicio] = useState("");
  const [periodoFim, setPeriodoFim] = useState("");
  const [category, setCategory] = useState("");
  const [projeto, setProjeto] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
  const [dadosFornecedor, setDadosFornecedor] = useState({razaoSocial: "", cnpj: "", grupo: "", contato: "", email: "", telefone: ""});
  const [products, setProducts] = useState([]);
  const [productSelecionado, setProductSelecionado] = useState(null);
  const [dadosProduct, setDadosProduct] = useState({sku: "", name: "", tipo: "", peso: "", unit: "", marca: "", category: "", quantidade: 1, observacao: ""});
  const [showModalFornecedor, setShowModalFornecedor] = useState(false);
  const [showModalProduto, setShowModalProduto] = useState(false);
  const [itensPedido, setItensPedido] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const numero = `PED${Math.floor(Math.random() * 1000000)}`;
    setNumeroPedido(numero);
    const fetchFornecedores = async () => {
      const fornecedoresRef = ref(db, "CadastroFornecedores");
      const fornecedorSnapshot = await get(fornecedoresRef);
      if (fornecedorSnapshot.exists()) setFornecedores(Object.values(fornecedorSnapshot.val()));
      else toast.error("Nenhum fornecedor encontrado!");
    };
    const fetchProdutos = async () => {
      const produtosRef = ref(db, "EntradaProdutos");
      const produtoSnapshot = await get(produtosRef);
      if (produtoSnapshot.exists()) setProducts(Object.values(produtoSnapshot.val()));
      else toast.error("Nenhum produto encontrado!");
    };
    fetchFornecedores();
    fetchProdutos();
  }, []);

  const handleFornecedorSelect = (fornecedor) => {
    setFornecedorSelecionado(fornecedor);
    setDadosFornecedor(fornecedor);
    setShowModalFornecedor(false);
    toast.success("Fornecedor selecionado com sucesso!");
  };

  const handleProductSelect = (product) => {
    setProductSelecionado(product);
    setDadosProduct({ ...product, quantidade: 1, observacao: "" });
    setShowModalProduto(false);
    toast.success("Produto selecionado com sucesso!");
  };

  const handleAddProductToOrder = () => {
    if (productSelecionado && dadosProduct.quantidade > 0) {
      setItensPedido([...itensPedido, { ...dadosProduct }]);
      setProductSelecionado(null);
      setDadosProduct({sku: "", name: "", tipo: "", peso: "", unit: "", marca: "", category: "", quantidade: 1, observacao: ""});
      toast.info("Produto adicionado ao pedido.");
    } else {
      toast.error("Selecione um produto e insira a quantidade válida!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dataSelecionada || !periodoInicio || !periodoFim || !category || !projeto || !fornecedorSelecionado || itensPedido.length === 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios!");
      return;
    }
    const pedido = {
      numeroPedido,
      projeto,
      dataPedido: dataSelecionada,
      periodoInicio,
      periodoFim,
      category,
      fornecedor: dadosFornecedor,
      produtos: itensPedido,
      status: "Pendente",
      dataCriacao: new Date().toISOString(),
    };
    try {
      const pedidosRef = ref(db, "novosPedidos");
      const newPedidoRef = push(pedidosRef);
      await set(newPedidoRef, pedido);
      toast.success("Pedido salvo com sucesso!");
      setDataSelecionada("");
      setPeriodoInicio("");
      setPeriodoFim("");
      setCategory("");
      setProjeto("");
      setFornecedorSelecionado(null);
      setItensPedido([]);
    } catch (error) {
      toast.error("Erro ao salvar o pedido: " + error.message);
    }
  };

  const handleDelete = (index) => {
    const updatedItens = [...itensPedido];
    updatedItens.splice(index, 1);
    setItensPedido(updatedItens);
  };

  const filteredProducts = products.filter((product) => {
    if (!product) return false;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      (product.name?.toLowerCase() || "").includes(lowerSearchTerm) ||
      (product.tipo?.toLowerCase() || "").includes(lowerSearchTerm) ||
      (product.category?.toLowerCase() || "").includes(lowerSearchTerm)
    );
  });

  const handleVoltar = () => navigate(-1);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);


  const styles = {
    container: {maxWidth: "95%", margin: "0 auto", padding: "5%", fontFamily: "Arial, sans-serif", backgroundColor: "#f4f6f9", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", overflow: "hidden"},
    header: {backgroundColor: "rgba(231, 223, 223, 0.4)", marginBottom: "2rem", textAlign: "center", padding: "1rem",},
    title: {fontSize: "2rem", color: "#333", marginBottom: "0.5rem",},
    input: {padding: "10px 15px", fontSize: "1rem", width: "100%", maxWidth: "100%", border: "1px solid #ccc", borderRadius: "5px", marginBottom: "1rem", backgroundColor: "#fff", boxSizing: "border-box",},
    button: {padding: "10px 10px", fontSize: "1rem", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", transition: "background-color 0.3s", width: "100%", maxWidth: "200px",  margin: "0.5rem auto",},
    buttonCadastro: {padding: "10px 10px", fontSize: "1rem", backgroundColor: "#F20DE7", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", transition: "background-color 0.3s", width: "100%", maxWidth: "200px", margin: "0.5rem auto", marginLeft: "10px"},
    buttonExcluir:{padding: "10px 10px", fontSize: "1rem", backgroundColor: "red", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", transition: "background-color 0.3s", width: "100%", maxWidth: "200px", margin: "0.5rem auto"},
    modal: {position: "fixed", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: "999", color: "black", padding: "1rem",boxSizing: "border-box",},
    modalContent: {backgroundColor: "#fff", padding: "2rem", borderRadius: "8px", width: "90%", maxWidth: "800px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",},
    table: {width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", overflowX: "auto",},
    tableHeader: {backgroundColor: "#f2f2f2", textAlign: "left"},
    tableCell: {padding: "0.5rem", borderBottom: "1px solid #ddd", textAlign: "center", wordWrap: "break-word"},
    textArea: {width: "100%", height: "80px", padding: "12px 15px", fontSize: "1rem", border: "1px solid #ccc", borderRadius: "5px", marginBottom: "1rem", backgroundColor: "#fff", boxSizing: "border-box"},
  };

 return (
    <>
      <div style={{display: "flex", alignItems: "center", padding: "20px", background: "linear-gradient(135deg, #6a11cb, #2575fc)", minHeight: "100vh",}}>
        <div style={styles.container}>
          <ToastContainer />
          <div style={styles.header}>
            <h2 style={styles.title}>Cadastro de Pedido</h2>
            <div style={{ fontSize: "25px", fontWeight: "bold" }}>
              <strong style={{ fontWeight: "normal" }}>Número do Pedido:{" "}</strong>{numeroPedido}
            </div>
            <br />
            <p style={{ fontSize: "18px", color: "#555" }}>Preencha os detalhes do pedido abaixo </p>
            <div>
              <label>Data do Pedido: </label>
              <input type="date" value={dataSelecionada} onChange={(e) => setDataSelecionada(e.target.value)} style={styles.input} />
            </div>
            <div>
              <label>Período: </label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input type="date" value={periodoInicio} onChange={(e) => setPeriodoInicio(e.target.value)} style={styles.input} />
                <input type="date" value={periodoFim} onChange={(e) => setPeriodoFim(e.target.value)} style={styles.input} />
              </div>
            </div>
            <div>
              <label>Selecione a categoria: </label>
              <div style={{ display: "flex", gap: "10px" }}>
                <select value={category} onChange={(e) => setCategory(e.target.value)}style={styles.input}>
                  <option value="Selecionar">Selecione a Categoria do pedido</option>
                  <option value="Proteina">Proteína</option>
                  <option value="Mantimento">Mantimento</option>
                  <option value="Hortifrut">Hortifrut</option>
                  <option value="Doações">Doações</option>
                  <option value="Produtos de Limpeza">Produtos de Limpeza</option>
                </select>
              </div>
            </div>
            <div>
              <label>Selecione o Projeto: </label>
              <div style={{ display: "flex", gap: "10px" }}>
                <select value={projeto} onChange={(e) => setProjeto(e.target.value)}style={styles.input}>
                  <option value="Selecionar">Selecione o Projeto</option>
                  <option value="CONDECA">CONDECA</option>
                  <option value="FUMCAD">FUMCAD</option>
                  <option value="INSTITUTO RECICLAR">Instituto Reciclar</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <h3>Escolha um Fornecedor:</h3>
            <button onClick={() => setShowModalFornecedor(true)} style={styles.button}>Selecionar Fornecedor</button>
            {showModalFornecedor && (
              <div style={styles.modal}>
                <div style={styles.modalContent}>
                  <h4 style={{ textAlign: "center", marginBottom: "1rem" }}> Selecione um Fornecedor </h4>
                  <div style={{maxHeight: "60vh", overflowY: "auto", border: "1px solid #ddd", padding: "1rem", borderRadius: "8px", boxSizing: "border-box"}}>
                    {fornecedores.length > 0 ? (
                      fornecedores.map((fornecedor) => (
                        <div key={fornecedor.cnpj} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem", borderBottom: "1px solid #eee" }}>
                          <div style={{ flex: 1, marginRight: "1rem" }}>
                            <p style={{ margin: 0, fontWeight: "bold" }}>{fornecedor.razaoSocial}</p>
                            <p style={{margin: "0.25rem 0", fontSize: "0.9rem", color: "#555",}}>CNPJ: {fornecedor.cnpj}</p>
                          </div>
                          <button onClick={() => handleFornecedorSelect(fornecedor)} style={{ ...styles.button, backgroundColor: "#007BFF", margin: "0", padding: "0.5rem 1rem" }}> Selecionar </button>
                        </div>
                      ))) : (<p style={{ textAlign: "center", color: "#777" }}> Nenhum fornecedor encontrado.</p>)}
                  </div>
                <button onClick={() => navigate("/Cadastro_Fornecedor")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md w-full sm:w-auto transition">Novo Fornecedor +</button>
                <button onClick={() => setShowModalFornecedor(false)} style={{ ...styles.button, marginTop: "1rem", backgroundColor: "#DC3545" }}>Fechar </button>
                </div>
              </div>
            )}
            {fornecedorSelecionado && (
              <div style={{ marginTop: "20px" }}>
                <div>
                  <label>Razão Social: </label>
                  <input type="text" value={dadosFornecedor.razaoSocial} readOnly style={styles.input} />
                </div>
                <div>
                  <label>CNPJ do Fornecedor: </label>
                  <input type="text" value={dadosFornecedor.cnpj} readOnly style={styles.input} />
                </div>
                <div>
                  <label>Grupo: </label>
                  <input type="text" value={dadosFornecedor.grupo} readOnly style={styles.input} />
                </div>
                <div>
                  <label>Contato: </label>
                  <input type="text" value={dadosFornecedor.contato} readOnly style={styles.input} />
                </div>
                <div>
                  <label>E-mail: </label>
                  <input type="text" value={dadosFornecedor.email} readOnly style={styles.input} />
                </div>
                <div>
                  <label>Telefone: </label>
                  <input type="text" value={dadosFornecedor.telefone} readOnly style={styles.input} />
                </div>
              </div>)}
          </div>
          <hr style={{ border: "10px black" }} /> <br /> <br />
          <div>
            <h3>Escolha o produto:</h3>
            <button onClick={() => setShowModalProduto(true)} style={styles.button}>Selecionar Produto</button>
            {showModalProduto && (
              <div style={styles.modal}>
                <div style={styles.modalContent}>
                  <h4>Selecione um Produto</h4>
                  <div style={styles.filterSection}>
                    <input type="text" placeholder="Filtrar por Produto, Tipo ou Grupo" value={searchTerm} onChange={handleSearchChange} style={styles.input} />
                  </div>
                  <div style={{ overflowY: "auto", maxHeight: "400px" }}>
                    <table style={styles.table}>
                      <thead style={styles.tableHeader}>
                        <tr>
                          <th style={styles.tableCell}>Produto</th>
                          <th style={styles.tableCell}>Tipo</th>
                          <th style={styles.tableCell}>Marca</th>
                          <th style={styles.tableCell}>Grupo</th>
                          <th style={styles.tableCell}>Peso</th>
                          <th style={styles.tableCell}>Unidade</th>
                          <th style={styles.tableCell}>Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => (
                          <tr key={product.sku}>
                            <td style={styles.tableCell}>{product.name}</td>
                            <td style={styles.tableCell}>{product.tipo}</td>
                            <td style={styles.tableCell}>{product.marca}</td>
                            <td style={styles.tableCell}>{product.category}</td>
                            <td style={styles.tableCell}>{product.peso} {product.unitMeasure}</td>
                            <td style={styles.tableCell}>{product.unit}</td>
                            <td style={styles.tableCell}><button onClick={() => handleProductSelect(product)} style={styles.button}>Selecionar</button></td>
                          </tr>))}
                      </tbody>
                    </table>
                  </div>
                  <button onClick={() => setShowModalProduto(false)} style={styles.button}>Fechar</button>
                  <Link to={"/Cadastro_Geral"}>{" "}<button style={styles.buttonCadastro}>Cadastrar Novo Item</button></Link>
                </div>
              </div>
            )}
            {dadosProduct.sku && (
              <div style={{ marginTop: "20px", overflow: "scroll" }}>
                <div>
                  <label>SKU: </label>
                  <input type="text" value={dadosProduct.sku} readOnly style={styles.input} />
                </div>
                <div>
                  <label>Nome: </label>
                  <input type="text" value={dadosProduct.name} readOnly style={styles.input} />
                </div>
                <div>
                  <label>Tipo: </label>
                  <input type="text" value={dadosProduct.tipo} readOnly style={styles.input} />
                </div>
                <div>
                  <label>Marca: </label>
                  <input type="text" value={dadosProduct.marca} readOnly style={styles.input} />
                </div>
                <div>
                  <label>Grupo: </label>
                  <input type="text" value={dadosProduct.category} readOnly style={styles.input} />
                </div>
                <div>
                  <label>Peso: </label>
                  <input type="text" value={`${dadosProduct.peso || ""} ${dadosProduct.unitMeasure || "" }`} readOnly style={styles.input} />
                </div>
                <div>
                  <label>Unidade de Medida: </label>
                  <input type="text" value={dadosProduct.unit} readOnly style={styles.input} />
                </div>
                <div>
                  <label>Quantidade: </label>
                  <input type="number" value={dadosProduct.quantidade}
                    onChange={(e) =>setDadosProduct({...dadosProduct, quantidade: e.target.value,})} min="1" style={styles.input}/>
                </div>
                <div>
                  <label>Observação: </label>
                  <textarea value={dadosProduct.observacao} onChange={(e) => setDadosProduct({...dadosProduct, observacao: e.target.value,})} style={styles.textArea}/>
                </div>
              </div>
            )}
            <div>
              <button onClick={handleAddProductToOrder} style={styles.button}>Adicionar Produto ao Pedido</button>
            </div>
          </div><br /><br /> <br />
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
                  <th style={styles.tableCell}>Peso</th>
                  <th style={styles.tableCell}>Unidade de Medida</th>
                  <th style={styles.tableCell}>Quantidade</th>
                  <th style={styles.tableCell}>Observação</th>
                  <th style={styles.tableCell}>Ações</th>
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
                    <td style={styles.tableCell}>{" "} {item.peso} {item.unitMeasure}</td>
                    <td style={styles.tableCell}>{item.unit}</td>
                    <td style={styles.tableCell}>{item.quantidade}</td>
                    <td style={styles.tableCell}>{item.observacao}</td>
                    <td style={styles.tableCell}><button style={styles.buttonExcluir} onClick={() => handleDelete(index)}>Excluir</button>{" "}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div><button onClick={handleSubmit} style={styles.button}>Finalizar Pedido</button></div>
          <button onClick={handleVoltar} style={{ marginBottom: "20px", width: "100%" }}> Voltar</button>
        </div>
      </div>
    </>
  );
}


