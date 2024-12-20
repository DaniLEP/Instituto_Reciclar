import React, { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import emailjs from "emailjs-com";
import { get, ref, getDatabase } from "firebase/database";
import { useNavigate } from "react-router-dom";  // Importa o hook useNavigate

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.firebasestorage.app",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const NovoPedido = () => {
  const [usuario, setUsuario] = useState(null);
  const [pedido, setPedido] = useState({
    nomeProduto: "",
    quantidade: 0,
    emailCliente: "",
    itens: [],
    observacoes: "",
    sku: "",
    categoria: "",
    tipo: "",
    fornecedor: "",
    marca: "",
  });
  const [produtos, setProdutos] = useState([]);
  const formRef = useRef(null); // Referência para o formulário
  const navigate = useNavigate(); // Usando o useNavigate para navegação

  // Obter o usuário atual
  const getCurrentUser = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user);
      } else {
        setUsuario(null);
      }
    });
  };

  useEffect(() => {
    getCurrentUser();
    fetchProdutos(); // Carregar dados de produtos da tabela de EntradaProdutos
  }, []);

  // Função para consultar os produtos na tabela de EntradaProdutos
  const fetchProdutos = async () => {
    const produtosRef = ref(db, "EntradaProdutos");
    const snapshot = await get(produtosRef);
    if (snapshot.exists()) {
      const produtosData = snapshot.val();
      const produtosArray = Object.keys(produtosData).map((key) => ({
        id: key,
        ...produtosData[key],
      }));
      setProdutos(produtosArray);
    } else {
      console.log("Nenhum produto encontrado.");
    }
  };

  // Função para enviar e-mail usando EmailJS
  const sendEmail = (e) => {
    e.preventDefault(); // Prevenir comportamento padrão do formulário

    if (usuario) {
      emailjs
        .sendForm(
          "service_rp90jwa", // Substitua pelo seu Service ID
          "template_5r0j6rk", // Substitua pelo seu Template ID
          formRef.current, // Referência do formulário
          "dv6W3rFP0pSLY4ACq" // Substitua pelo seu User Token
        )
        .then(
          (result) => {
            console.log("E-mail enviado com sucesso:", result.text);
            alert("Pedido enviado com sucesso!");
            setPedido({
              nomeProduto: "",
              quantidade: 0,
              emailCliente: "",
              itens: [],
              observacoes: "",
              sku: "",
              categoria: "",
              tipo: "",
              fornecedor: "",
              marca: "",
            }); // Resetar o pedido
          },
          (error) => {
            console.error("Erro ao enviar o e-mail:", error.text);
            alert("Erro ao enviar o pedido. Tente novamente.");
          }
        );
    } else {
      alert("Você precisa estar logado para enviar o pedido.");
    }
  };

  // Função para lidar com alterações nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPedido((prevPedido) => ({
      ...prevPedido,
      [name]: value,
    }));

    // Quando o SKU for alterado, buscar o produto correspondente
    if (name === "sku" && value) {
      const produtoSelecionado = produtos.find(
        (produto) => produto.sku === value
      );
      if (produtoSelecionado) {
        setPedido((prevPedido) => ({
          ...prevPedido,
          nomeProduto: produtoSelecionado.name,
          fornecedor: produtoSelecionado.supplier,
          marca: produtoSelecionado.marca,
          categoria: produtoSelecionado.categoria,
          tipo: produtoSelecionado.tipoProduto,
        }));
      } else {
        setPedido((prevPedido) => ({
          ...prevPedido,
          nomeProduto: "",
          fornecedor: "",
          marca: "",
          categoria: "",
          tipo: "",
        }));
      }
    }
  };

  // Adicionar itens ao pedido
  const addItem = () => {
    if (pedido.sku && pedido.quantidade > 0) {
      const produtoSelecionado = produtos.find(
        (produto) => produto.sku === pedido.sku
      );
      if (produtoSelecionado) {
        setPedido((prevPedido) => ({
          ...prevPedido,
          itens: [
            ...prevPedido.itens,
            {
              sku: pedido.sku,
              nomeProduto: produtoSelecionado.name,
              fornecedor: produtoSelecionado.supplier,
              marca: produtoSelecionado.marca,
              quantidade: pedido.quantidade,
              tipoProduto: produtoSelecionado.tipoProduto,
              categoria: produtoSelecionado.categoria,
              observacoes: pedido.observacoes,
            },
          ],
          sku: "",
          quantidade: 0,
          observacoes: "",
        }));
      } else {
        alert("Produto não encontrado.");
      }
    } else {
      alert("Preencha o SKU e a quantidade.");
    }
  };

  // Função para excluir um item
  const deleteItem = (index) => {
    const updatedItems = pedido.itens.filter((_, i) => i !== index);
    setPedido((prevPedido) => ({
      ...prevPedido,
      itens: updatedItems,
    }));
  };

  // Função para editar um item
  const editItem = (index) => {
    const itemToEdit = pedido.itens[index];
    setPedido((prevPedido) => ({
      ...prevPedido,
      sku: itemToEdit.sku,
      quantidade: itemToEdit.quantidade,
      observacoes: itemToEdit.observacoes,
    }));
    deleteItem(index); // Remover o item da lista para edição
  };

  return (
    <div style={styles.container}>
      <h1 style={{textAlign: 'center', fontSize:'48px', fontWeight: 'bold'}}>Novo Pedido +</h1>
      {usuario ? (
        <div style={styles.formContainer}>
          <p style={styles.welcomeText}>Bem-vindo, {usuario.email}</p>
          <form ref={formRef} onSubmit={sendEmail}>
            <div style={styles.formGroup}>
              <label>SKU</label>
              <input
                type="text"
                name="sku"
                value={pedido.sku}
                onChange={handleChange}
                style={styles.input}
                placeholder="Digite o SKU do produto"
              />
            </div>
            <div style={styles.formGroup}>
              <label>Nome do Produto</label>
              <input
                type="text"
                name="nomeProduto"
                value={pedido.nomeProduto}
                onChange={handleChange}
                style={styles.input}
                placeholder="Nome do produto"
                disabled
              />
            </div>
            <div style={styles.formGroup}>
              <label>Fornecedor:</label>
              <input
                type="text"
                name="fornecedor"
                value={pedido.fornecedor}
                onChange={handleChange}
                style={styles.input}
                placeholder="Fornecedor"
                disabled
              />
            </div>
            <div style={styles.formGroup}>
              <label>Marca:</label>
              <input
                type="text"
                name="marca"
                value={pedido.marca}
                onChange={handleChange}
                style={styles.input}
                placeholder="Marca"
                disabled
              />
            </div>
            <div style={styles.formGroup}>
              <label>Quantidade</label>
              <input
                type="number"
                name="quantidade"
                value={pedido.quantidade}
                onChange={handleChange}
                style={styles.input}
                placeholder="Digite a quantidade"
              />
            </div>

            <div style={styles.formGroup}>
              <label>Categoria do produto:</label>
              <select
                name="categoria"
                value={pedido.categoria}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Selecione a categoria</option>
                <option value="Proteína">Proteína</option>
                <option value="Mantimento">Mantimento</option>
                <option value="Hortaliça">Hortaliça</option>
                <option value="Doações">Doações</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Tipo do produto:</label>
              <select
                name="tipo"
                value={pedido.tipo}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Selecione o tipo</option>
                <option value="Frutas">Frutas</option>
                <option value="Legumes">Legumes</option>
                <option value="Verduras">Verduras</option>
                <option value="Bovina">Bovina</option>
                <option value="Ave">Ave</option>
                <option value="Suína">Suína</option>
                <option value="Pescado">Pescado</option>
                <option value="Mercado">Mercado</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Observações</label>
              <textarea
                name="observacoes"
                value={pedido.observacoes}
                onChange={handleChange}
                style={styles.textarea}
                placeholder="Observações adicionais"
              />
            </div>
            <button type="button" onClick={addItem} style={styles.button}>
              Adicionar Item
            </button>
            <button type="submit" style={styles.button}>
              Enviar Pedido
            </button>
          </form>
          <div style={styles.itemsList}>
            <h3>Itens no Pedido:</h3>
            <ul>
              {pedido.itens.map((item, index) => (
                <li key={index}>
                  {item.nomeProduto} - {item.quantidade} - {item.supplier} unidades
                  <button onClick={() => editItem(index)} style={styles.editButton} onMouseOver={(e) =>
              (e.target.style.background =
               "linear-gradient(135deg, #6a11cb, #2575fc)")
            }
            onMouseOut={(e) =>
              (e.target.style.background =
                "linear-gradient(135deg, #6a11cb, #2575fc)")
            }>
                    Editar
                  </button>
                  <button onClick={() => deleteItem(index)} style={styles.deleteButton} onMouseOver={(e) =>
              (e.target.style.background =
               "linear-gradient(135deg, #6a11cb, #2575fc)")
            }
            onMouseOut={(e) =>
              (e.target.style.background =
             "linear-gradient(135deg, #6a11cb, #2575fc)")
            }>
                    Excluir
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Botão de Voltar */}
          <button onClick={() => navigate(-1)} style={styles.button} onMouseOver={(e) =>
              (e.target.style.background =
               "linear-gradient(135deg, #6a11cb, #2575fc)")
            }
            onMouseOut={(e) =>
              (e.target.style.background =
               "linear-gradient(135deg, #6a11cb, #2575fc)")
            }>
            Voltar
          </button>
        </div>
      ) : (
        <p style={styles.errorText}>Você precisa estar logado para fazer um pedido.</p>
      )}
    </div>
  );
};

// Estilos (para melhor aparência)
const styles = {
  container: {
    background: "linear-gradient(135deg, #6a11cb, #2575fc)",
    color: "#fff",
    padding: "20px",
    minHeight: "100vh",
  },
  formContainer: {
    maxWidth: "900px",
    margin: "0 auto",
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    color: "#333",
  },
  welcomeText: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
    minHeight: "100px",
  },
    button: {
      background: "linear-gradient(135deg, #6a11cb, #2575fc)",    color: "#fff",
      padding: "10px 20px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      marginRight: "10px",
      transition: "background-color 0.3s ease", // Transição de cor para efeitos visuais mais suaves
      "&:hover": {
        background: "linear-gradient(135deg, #2575fc, #6a11cb)",  // Efeito de gradiente ao passar o mouse
      }
    },
    editButton: {
      backgroundColor: "#f39c12",
      color: "#fff",
      padding: "5px 10px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginLeft: "5px",
      transition: "background-color 0.3s ease", // Transição de cor para efeitos visuais mais suaves
      "&:hover": {backgroundColor: "#e67e22",}, // Cor de fundo ao passar o mouse 
    },
    deleteButton: {
      backgroundColor: "#e74c3c",
      color: "#fff",
      padding: "5px 10px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginLeft: "5px",
      transition: "background-color 0.3s ease", // Transição de cor para efeitos visuais mais suaves
      "&:hover": {
        backgroundColor: "#c0392b", // Cor de fundo ao passar o mouse
      },
    },

  itemsList: {
    marginTop: "20px",
  },
  errorText: {
    color: "#e74c3c",
    textAlign: "center",
    fontSize: "18px",
  },
};

export default NovoPedido;
 