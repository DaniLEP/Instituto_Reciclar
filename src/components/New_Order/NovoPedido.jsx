import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase, ref, get, push, set } from "firebase/database";
import { useNavigate } from "react-router-dom"; // Importando o hook useNavigate

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.appspot.com",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
};

// Inicializando o Firebase (só se não houver app inicializado)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export default function NovoPedido() {
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [numeroPedido, setNumeroPedido] = useState("");
  const [periodoInicio, setPeriodoInicio] = useState("");
  const [periodoFim, setPeriodoFim] = useState("");
  const [category, setCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
  const [dadosFornecedor, setDadosFornecedor] = useState({
    razaoSocial: "",
    cnpj: "",
    grupo: "",
    contato: "",
    email: "",
    telefone: "",
  });

  const [products, setProducts] = useState([]);
  const [productSelecionado, setProductSelecionado] = useState(null);
  const [dadosProduct, setDadosProduct] = useState({
    sku: "",
    name: "",
    tipo: "",
    category: "",
    unidMedida: "",
    quantidade: 1, // Adicionando o campo quantidade
    observacao: "", // Adicionando o campo observação
  });
  const [showModalFornecedor, setShowModalFornecedor] = useState(false);
  const [showModalProduto, setShowModalProduto] = useState(false);
  const [itensPedido, setItensPedido] = useState([]);

  useEffect(() => {
    const numero = `PED${Math.floor(Math.random() * 1000000)}`;
    setNumeroPedido(numero);

    const fetchFornecedores = async () => {
      const fornecedoresRef = ref(db, "CadastroFornecedores");
      const fornecedorSnapshot = await get(fornecedoresRef);
      if (fornecedorSnapshot.exists()) {
        setFornecedores(Object.values(fornecedorSnapshot.val()));
      } else {
        toast.error("Nenhum fornecedor encontrado!");
      }
    };

    const fetchProdutos = async () => {
      const produtosRef = ref(db, "EntradaProdutos");
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
      telefone: fornecedor.telefone,
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
      peso: product.peso,
      unit: product.unit,
      category: product.category,
      quantidade: " ", // Inicializando quantidade
      observacao: "", // Inicializando observação
    });
    setShowModalProduto(false);
    toast.success("Produto selecionado com sucesso!");
  };

  const handleAddProductToOrder = () => {
    if (productSelecionado && dadosProduct.quantidade > 0) {
      const item = {
        ...dadosProduct,
        quantidade: dadosProduct.quantidade,
        observacao: dadosProduct.observacao,
      };
      setItensPedido([...itensPedido, item]);
      setProductSelecionado(null);
      setDadosProduct({
        sku: "",
        name: "",
        tipo: "",
        peso: "",
        unit: "",
        marca: "",
        category: "",
        quantidade: 1,
        observacao: "",
      });
      toast.info("Produto adicionado ao pedido.");
    } else {
      toast.error("Selecione um produto e insira a quantidade válida!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação dos campos obrigatórios
    if (
      !dataSelecionada ||
      !periodoInicio ||
      !periodoFim ||
      !category ||
      !fornecedorSelecionado ||
      itensPedido.length === 0
    ) {
      toast.error("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    // Criar um novo pedido
    const pedido = {
      numeroPedido,
      dataPedido: dataSelecionada,
      periodoInicio,
      periodoFim,
      category,
      fornecedor: dadosFornecedor,
      produtos: itensPedido,
      status: "Pendente", // Status inicial do pedido
      dataCriacao: new Date().toISOString(), // Timestamp de criação
    };

    try {
      // Referência para os pedidos no Firebase
      const pedidosRef = ref(db, "novosPedidos");

      // Adicionando o novo pedido
      const newPedidoRef = push(pedidosRef);
      await set(newPedidoRef, pedido);

      // Feedback de sucesso
      toast.success("Pedido salvo com sucesso!");

      // Limpar os campos após o envio
      setDataSelecionada("");
      setPeriodoInicio("");
      setPeriodoFim("");
      setCategory("");
      setFornecedorSelecionado(null);
      setItensPedido([]);
    } catch (error) {
      // Em caso de erro, mostrar uma mensagem de erro
      toast.error("Erro ao salvar o pedido: " + error.message);
    }
  };

  const styles = {
    container: {
      maxWidth: "95%",
      margin: "0 auto",
      padding: "5%",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f4f6f9",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    },
    header: {
      backgroundColor: "rgba(231, 223, 223, 0.4)",
      marginBottom: "2rem",
      textAlign: "center",
      padding: "1rem",
    },
    title: {
      fontSize: "2rem",
      color: "#333",
      marginBottom: "0.5rem",
    },
    input: {
      padding: "10px 15px",
      fontSize: "1rem",
      width: "100%",
      maxWidth: "100%",
      border: "1px solid #ccc",
      borderRadius: "5px",
      marginBottom: "1rem",
      backgroundColor: "#fff",
      boxSizing: "border-box",
    },
    button: {
      padding: "10px 10px",
      fontSize: "1rem",
      backgroundColor: "#4CAF50",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
      width: "100%",
      maxWidth: "200px",
      margin: "0.5rem auto",
    },
    buttonExcluir: {
      padding: "10px 10px",
      fontSize: "1rem",
      backgroundColor: "red",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
      width: "100%",
      maxWidth: "200px",
      margin: "0.5rem auto",
    },
    modal: {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "999",
      color: "black",
      padding: "1rem",
      boxSizing: "border-box",
    },
    modalContent: {
      backgroundColor: "#fff",
      padding: "2rem",
      borderRadius: "8px",
      width: "90%",
      maxWidth: "800px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "0.9rem",
      overflowX: "auto",
    },
    tableHeader: {
      backgroundColor: "#f2f2f2",
      textAlign: "left",
    },
    tableCell: {
      padding: "0.5rem",
      borderBottom: "1px solid #ddd",
      textAlign: "center",
      wordWrap: "break-word",
    },
    textArea: {
      width: "100%",
      height: "80px",
      padding: "12px 15px",
      fontSize: "1rem",
      border: "1px solid #ccc",
      borderRadius: "5px",
      marginBottom: "1rem",
      backgroundColor: "#fff",
      boxSizing: "border-box",
    },
  };

  // Responsividade com media queries
  const globalStyles = `
      @media (max-width: 768px) {
        h2 {
          font-size: 1.8rem;
        }
        .button {
          font-size: 0.9rem;
        }
        .input {
          font-size: 0.9rem;
        }
        .modalContent {
          padding: 1rem;
        }
        .tableCell {
          font-size: 0.8rem;
        }
      }
    
      @media (max-width: 480px) {
        h2 {
          font-size: 1.5rem;
        }
        .button {
          font-size: 0.8rem;
        }
        .input {
          font-size: 0.8rem;
        }
        .modalContent {
          padding: 0.5rem;
        }
        .tableCell {
          font-size: 0.7rem;
        }
      }
    `;
  const navigate = useNavigate(); // Criando uma função de navegação
  const handleVoltar = () => {
    navigate(-1); // Volta para a página anterior
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (index) => {
    const updatedItens = [...itensPedido];
    updatedItens.splice(index, 1); // Remove o item com o índice dado
    setItensPedido(updatedItens); // Atualiza o estado com a lista modificada
  };

  const filteredProducts = products.filter((product) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(lowerSearchTerm) ||
      product.tipo.toLowerCase().includes(lowerSearchTerm) ||
      product.category.toLowerCase().includes(lowerSearchTerm)
    );
  });
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "20px",
          background: "linear-gradient(135deg, #6a11cb, #2575fc)",
          minHeight: "100vh",
        }}
      >
        <div style={styles.container}>
          <ToastContainer />
          <div style={styles.header}>
            <h2 style={styles.title}>Cadastro de Pedido</h2>
            <div style={{ fontSize: "25px", fontWeight: "bold" }}>
              <strong style={{ fontWeight: "normal" }}>
                Número do Pedido:{" "}
              </strong>
              {numeroPedido}
            </div>
            <br />
            <p style={{ fontSize: "18px", color: "#555" }}>
              Preencha os detalhes do pedido abaixo
            </p>

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
              <div style={{ display: "flex", gap: "10px" }}>
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
            <div>
              <label>Selecione a categoria: </label>
              <div style={{ display: "flex", gap: "10px" }}>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={styles.input}
                >
                  <option value="Selecionar">
                    Selecione a Categoria do pedido
                  </option>
                  <option value="Proteina">Proteina</option>
                  <option value="Mantimento">Mantimento</option>
                  <option value="Hortaliças">Hortaliças</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <h3>Escolha um Fornecedor:</h3>
            <button
              onClick={() => setShowModalFornecedor(true)}
              style={styles.button}
            >
              Selecionar Fornecedor
            </button>
            {showModalFornecedor && (
              <div style={styles.modal}>
                <div style={styles.modalContent}>
                  <h4 style={{ textAlign: "center", marginBottom: "1rem" }}>
                    Selecione um Fornecedor
                  </h4>
                  <div
                    style={{
                      maxHeight: "60vh",
                      overflowY: "auto",
                      border: "1px solid #ddd",
                      padding: "1rem",
                      borderRadius: "8px",
                      boxSizing: "border-box",
                    }}
                  >
                    {fornecedores.length > 0 ? (
                      fornecedores.map((fornecedor) => (
                        <div
                          key={fornecedor.cnpj}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "0.5rem",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <div style={{ flex: 1, marginRight: "1rem" }}>
                            <p style={{ margin: 0, fontWeight: "bold" }}>
                              {fornecedor.razaoSocial}
                            </p>
                            <p
                              style={{
                                margin: "0.25rem 0",
                                fontSize: "0.9rem",
                                color: "#555",
                              }}
                            >
                              CNPJ: {fornecedor.cnpj}
                            </p>
                          </div>
                          <button
                            onClick={() => handleFornecedorSelect(fornecedor)}
                            style={{
                              ...styles.button,
                              backgroundColor: "#007BFF",
                              margin: "0",
                              padding: "0.5rem 1rem",
                            }}
                          >
                            Selecionar
                          </button>
                        </div>
                      ))
                    ) : (
                      <p style={{ textAlign: "center", color: "#777" }}>
                        Nenhum fornecedor encontrado.
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowModalFornecedor(false)}
                    style={{
                      ...styles.button,
                      marginTop: "1rem",
                      backgroundColor: "#DC3545",
                    }}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
            {fornecedorSelecionado && (
              <div style={{ marginTop: "20px" }}>
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
          <hr style={{ border: "10px black" }} />
          <br />
          <br />
          <div>
            <h3>Escolha o produto:</h3>
            <button
              onClick={() => setShowModalProduto(true)}
              style={styles.button}
            >
              Selecionar Produto
            </button>
            {showModalProduto && (
              <div style={styles.modal}>
                <div style={styles.modalContent}>
                  <h4>Selecione um Produto</h4>
                  <div style={styles.filterSection}>
                    <input
                      type="text"
                      placeholder="Filtrar por Produto, Tipo ou Grupo"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      style={styles.input}
                    />
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
                            <td style={styles.tableCell}>
                              {product.peso}
                              {product.unitMeasure}
                            </td>
                            <td style={styles.tableCell}>{product.unit}</td>
                            <td style={styles.tableCell}>
                              <button
                                onClick={() => handleProductSelect(product)}
                                style={styles.button}
                              >
                                Selecionar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    onClick={() => setShowModalProduto(false)}
                    style={styles.button}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}

            {dadosProduct.sku && (
              <div style={{ marginTop: "20px", overflow: "scroll" }}>
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
                  <label>Peso: </label>
                  <input
                    type="text"
                    value={`${dadosProduct.peso || ""} ${
                      dadosProduct.unitMeasure || ""
                    }`}
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
                    onChange={(e) =>
                      setDadosProduct({
                        ...dadosProduct,
                        quantidade: e.target.value,
                      })
                    }
                    min="1"
                    style={styles.input}
                  />
                </div>
                <div>
                  <label>Observação: </label>
                  <textarea
                    value={dadosProduct.observacao}
                    onChange={(e) =>
                      setDadosProduct({
                        ...dadosProduct,
                        observacao: e.target.value,
                      })
                    }
                    style={styles.textArea}
                  />
                </div>
              </div>
            )}
            <div>
              <button onClick={handleAddProductToOrder} style={styles.button}>
                Adicionar Produto ao Pedido
              </button>
            </div>
          </div>
          <br />
          <br />
          <br />
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
                    <td style={styles.tableCell}>
                      {item.peso} {item.unitMeasure}
                    </td>
                    <td style={styles.tableCell}>{item.unit}</td>
                    <td style={styles.tableCell}>{item.quantidade}</td>
                    <td style={styles.tableCell}>{item.observacao}</td>
                    <td style={styles.tableCell}>
                <button style={styles.buttonExcluir} onClick={() => handleDelete(index)}>Excluir</button> {/* Botão para excluir */}
              </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <button onClick={handleSubmit} style={styles.button}>
              Finalizar Pedido
            </button>
          </div>

          <button
            onClick={handleVoltar}
            style={{ marginBottom: "20px", width: "100%" }}
          >
            Voltar
          </button>
        </div>
      </div>
    </>
  );
}
