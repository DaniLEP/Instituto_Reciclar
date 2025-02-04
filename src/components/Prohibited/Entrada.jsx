import { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Estilos globais
const GlobalStyle = createGlobalStyle`
    body {
      background: linear-gradient(135deg, #6a11cb, #2575fc);
      font-family: 'Poppins', sans-serif;
      margin: 0;
      padding: 0;
      color: #333;
    }

    * {
      box-sizing: border-box;
    }
  `;

const Container = styled.div`
  max-width: 1200px;
  margin: 50px auto;
  padding: 40px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  width: 100%;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  @media (max-width: 1024px) {
    padding: 30px;
    margin: 20px;
  }

  @media (max-width: 768px) {
    padding: 20px;
    margin: 10px;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 3rem;
  color: #6c5ce7;
  margin-bottom: 40px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  border-radius: 10px;
  border: 2px solid #ddd;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  color: #333;

  &:focus {
    border-color: #6c5ce7;
    background-color: #fff;
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 15px;
  border-radius: 10px;
  border: 2px solid #ddd;
  font-size: 1.1rem;
  background-color: #f9f9f9;
  color: #333;
  transition: all 0.3s ease;

  &:focus {
    border-color: #6c5ce7;
    outline: none;
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #6c5ce7;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5a4bd5;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const ButtonReturn = styled(Link)`
  display: block;
  text-align: center;
  padding: 15px;
  background-color: #e74c3c;
  color: white;
  border-radius: 10px;
  font-size: 1.2rem;
  text-decoration: none;
  transition: background-color 0.3s ease;
  margin-top: 15px;

  &:hover {
    background-color: #c0392b;
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  cursor: pointer;
  img {
    width: 40px;
    height: 40px;
    transition: transform 0.2s ease;

    &:hover {
      transform: rotate(180deg);
    }
  }

  @media (max-width: 768px) {
    top: 15px;
    left: 15px;
  }
`;

// Modal estilizado
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.3s ease;
`;

const ModalContainer = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  max-width: 80%;
  overflow-y: auto;
  max-height: 70%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(-30px);
    }
    90% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  h2 {
    font-size: 2rem;
    color: #6c5ce7;
    margin-bottom: 20px;
    text-align: center;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    font-size: 1.1rem;
    color: #333;
  }

  th,
  td {
    padding: 12px;
    text-align: center;
  }

  th {
    background-color: #6c5ce7;
    color: white;
  }

  td {
    border-top: 1px solid #ddd;
    background-color: #fafafa;
  }

  td button {
    padding: 8px 15px;
    background-color: #6c5ce7;
    color: white;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  td button:hover {
    background-color: #5a4bd5;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const CloseButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 15px;
  font-size: 1.1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: block;
  margin: 20px auto;

  &:hover {
    background-color: #c0392b;
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.firebasestorage.app",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const Modal = ({ products, onSelectProduct, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (!products || products.length === 0) {
      console.log("Nenhum produto carregado");
      return;
    }
    setFilteredProducts(products);
  }, [products]);

  useEffect(() => {
    if (!products) return;
    const filtered = products.filter((product) =>
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  if (!products || products.length === 0) {
    return (
      <ModalBackdrop>
        <ModalContainer>
          <h2>Escolha um Produto</h2>
          <p>Carregando produtos...</p>
          <CloseButton onClick={onClose}>Fechar</CloseButton>
        </ModalContainer>
      </ModalBackdrop>
    );
  }

  return (
    <ModalBackdrop>
      <ModalContainer>
        <h2>Escolha um Produto</h2>
        <input
          type="text"
          placeholder="Buscar por SKU ou Nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Nome</th>
              <th>Marca</th>
              <th>Fornecedor</th>
              <th>Peso(KG)</th>
              <th>Unidade</th>
              <th>Categoria</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.sku}</td>
                <td>{product.name}</td>
                <td>{product.marca}</td>
                <td>{product.supplier}</td>
                <td>{product.peso}</td>
                <td>{product.unitMeasure}</td>
                <td>{product.category}</td>
                <td>
                  <button onClick={() => onSelectProduct(product)}>Selecionar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <CloseButton onClick={onClose}>Fechar</CloseButton>
      </ModalContainer>
    </ModalBackdrop>
  );
};


const EntradaProdutos = () => {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [marca, setMarca] = useState("");
  const [supplier, setSupplier] = useState("");
  const [quantity, setQuantity] = useState("");
  const [peso, setPeso] = useState("");
  const [pesoTotal, setPesoTotal] = useState("");
  const [unitMeasure, setUnitMeasure] = useState("");
  const [category, setCategory] = useState("");
  const [tipo, setTipo] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [dateAdded, setDateAdded] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Carregar os produtos do Firebase
  useEffect(() => {
    const dbProdutos = ref(db, "EntradaProdutos");
    onValue(dbProdutos, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedProducts = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
        setProducts(loadedProducts);
      }
    });
  }, []);

  // Função para preencher os campos automaticamente ao selecionar um produto
  const handleSelectProduct = (product) => {
    setSku(product.sku);
    setName(product.name);
    setMarca(product.marca);
    setSupplier(product.supplier);
    setPeso(product.peso);
    setUnitMeasure(product.unitMeasure);
    setCategory(product.category);
    setTipo(product.tipo);
    setUnitPrice(product.unitPrice);
    setTotalPrice(product.totalPrice);
    setQuantity(product.quantity);
    setDateAdded(product.dateAdded);
    setExpiryDate(product.expiryDate);
    setShowModal(false); // Fecha o modal após selecionar o produto
  };

  // Função para salvar o produto
  const handleSave = () => {
    if (
      sku &&
      name &&
      supplier &&
      peso &&
      unitMeasure &&
      quantity &&
      category &&
      tipo &&
      unitPrice &&
      totalPrice &&
      dateAdded &&
      expiryDate
    ) {
      const newProduct = {
        sku,
        name,
        marca,
        supplier,
        peso,
        unitMeasure,
        quantity,
        category,
        tipo,
        unitPrice,
        totalPrice,
        dateAdded,
        expiryDate,
      };

      const newProductRef = ref(db, `Estoque/${new Date().getTime()}`);
      set(newProductRef, newProduct)
        .then(() => {
          toast.success("Produto adicionado ao Estoque!");
        })
        .catch((error) => {
          toast.error("Erro ao salvar: " + error.message);
        });

      // Limpar campos
      setSku("");
      setName("");
      setMarca("");
      setSupplier("");
      setQuantity("");
      setPeso("");
      setUnitMeasure("");
      setCategory("");
      setTipo("");
      setUnitPrice("");
      setTotalPrice("");
      setDateAdded("");
      setExpiryDate("");
    } else {
      toast.warning("Preencha todos os campos!");
    }
  };

  const handleQuantityChange = (e) => {
    const quantity = e.target.value;
    setQuantity(quantity);

    if (peso && quantity) {
      const totalPeso = peso * quantity; // Calcula o peso total
      setPesoTotal(totalPeso);
    }
  };

  const handleUnitPriceChange = (e) => {
    let inputValue = e.target.value;

    // Remove tudo que não for número (para processar corretamente)
    inputValue = inputValue.replace(/\D/g, "");

    // Formata no estilo moeda brasileira
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(inputValue / 100); // Divide por 100 para ajuste dos centavos

    setUnitPrice(formattedValue);
    setTotalPrice(formattedValue);
  };

  const handledUnitPriceChange = (e) => {
    let inputValue = e.target.value;

    // Remove tudo que não for número (para processar corretamente)
    inputValue = inputValue.replace(/\D/g, "");

    // Formata no estilo moeda brasileira
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(inputValue / 100); // Divide por 100 para ajuste dos centavos

    setTotalPrice(formattedValue);
  };

  const handlePesoChange = (e) => {
    const pesoUnitario = e.target.value;
    setPeso(pesoUnitario);

    if (quantity && pesoUnitario) {
      const totalPeso = pesoUnitario * quantity; // Recalcula o peso total com a nova unidade de peso
      setPesoTotal(totalPeso);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <BackButton to="/Cadastro">
          <img src="/return.svg" alt="Voltar" />
        </BackButton>
        <Title>Entrada de Produtos</Title>

        <FormGroup>
          <Label>SKU:</Label>
          <Input
            type="text"
            value={sku || ""} // Fallback para string vazia caso seja undefined ou null
            onChange={(e) => setSku(e.target.value)}
            placeholder="Digite o SKU"
            onClick={() => setShowModal(true)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Nome:</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do produto"
          />
        </FormGroup>

        <FormGroup>
          <Label>Marca:</Label>
          <Input
            type="text"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            placeholder="Marca do produto"
          />
        </FormGroup>

        <FormGroup>
          <Label>Fornecedor:</Label>
          <Input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="Fornecedor"
          />
        </FormGroup>

        <FormGroup>
          <Label>Quantidade:</Label>
          <Input
            type="number"
            value={quantity}
            onChange={handleQuantityChange} // Usar a função para tratar a quantidade e calcular o peso total
            placeholder="Quantidade"
          />
        </FormGroup>

        <FormGroup>
          <Label>Peso Unitário(KG):</Label>
          <Input
            type="number"
            value={peso}
            onChange={handlePesoChange} // Atualiza o peso e recalcula o peso total
            placeholder="Peso unitário"
          />
        </FormGroup>
        <FormGroup>
          <Label>Peso Total (kg):</Label>
          <Input
            type="number"
            value={pesoTotal}
            placeholder="Peso Total"
            disabled // Desabilita para não edição manual
          />
        </FormGroup>

        <FormGroup>
          <Label>Categoria:</Label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Selecione a categoria:</option>
            <option value="Proteína">Proteína</option>
            <option value="Mantimento">Mantimento</option>
            <option value="Hortaliças">Hortaliças</option>
            <option value="Doações">Doações</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Tipo:</Label>
          <Input
            type="text"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            placeholder="Tipo"
          />
        </FormGroup>

        <FormGroup>
          <Label>Valor Unitário (R$):</Label>
          <Input
            type="text"
            value={unitPrice}
            onChange={handleUnitPriceChange}
            placeholder="R$ 0,00"
          />
        </FormGroup>
        <FormGroup>
          <Label>Valor Total (R$):</Label>
          <Input
            type="text"
            value={totalPrice}
            onChange={handledUnitPriceChange}
            placeholder="R$ 0,00"
          />
        </FormGroup>

        <FormGroup>
          <Label>Data de Adição:</Label>
          <Input
            type="date"
            value={dateAdded}
            onChange={(e) => setDateAdded(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Data de Validade:</Label>
          <Input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </FormGroup>

        <Button onClick={handleSave}>Salvar Produto</Button>
        <ButtonReturn to="/Cadastro">Voltar</ButtonReturn>
      </Container>

      {showModal && (
        <Modal
          products={products}
          onSelectProduct={handleSelectProduct}
          onClose={() => setShowModal(false)}
        />
      )}
      <ToastContainer />
    </>
  );
};

export default EntradaProdutos;
