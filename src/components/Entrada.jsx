import { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, update, onValue } from "firebase/database";

// Estilos globais
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #00009C; /* Fundo azul */
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    color: black;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;

  @media (max-width: 768px) {
    margin: 20px;
    padding: 15px;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  color: #00009c;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    border-color: #00009c;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    border-color: #00009c;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #f20de7;
  color: #fff;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #d10ccf;
  }
`;

const ButtonReturn = styled(Link)`
  display: block;
  text-align: center;
  padding: 12px;
  background: #f20de7;
  color: #fff;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  text-decoration: none;
  transition: background-color 0.3s;
  margin-top: 10px;

  &:hover {
    background-color: #d10ccf;
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

    @media (max-width: 768px) {
      width: 30px;
      height: 30px;
    }
  }
`;

// Inicialização do Firebase
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

function EntradaProdutos() {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [marca, setMarca] = useState("");
  const [supplier, setSupplier] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");
  const [dateAdded, setDateAdded] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

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

  // Função para pesquisar produto pelo SKU ou nome
  const handleSearch = () => {
    const product = products.find(
      (product) => product.sku === sku || product.name === name
    );

    if (product) {
      setName(product.name);
      setMarca(product.marca);
      setSupplier(product.supplier);
      setUnit(product.unit);
      setCategory(product.category);
      setQuantity(product.quantity);
      setUnitPrice(product.unitPrice);
      setDateAdded(product.dateAdded);
      setExpiryDate(product.expiryDate);
      setIsEditing(true); // Habilita o modo de edição
    } else {
      alert("Produto não encontrado.");
    }
  };

  // Função para salvar o produto na tabela de Estoque
  const handleSave = () => {
    if (
      sku &&
      name &&
      supplier &&
      unit &&
      quantity &&
      unitPrice &&
      dateAdded &&
      expiryDate
    ) {
      const newProduct = {
        sku,
        name,
        marca,
        supplier,
        unit,
        quantity,
        category,
        dateAdded,
        unitPrice: parseFloat(unitPrice),
        expiryDate,
      };

      // Salvar na tabela de Estoque
      const newProductRef = ref(db, `Estoque/${new Date().getTime()}`);
      set(newProductRef, newProduct)
        .then(() => alert("Produto adicionado ao Estoque com sucesso!"))
        .catch((error) =>
          alert("Erro ao salvar o produto no Estoque: " + error.message)
        );

      // Limpar os campos
      setSku("");
      setName("");
      setMarca("");
      setSupplier("");
      setQuantity("");
      setUnitPrice("");
      setCategory("");
      setDateAdded("");
      setExpiryDate("");
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.");
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
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Digite o SKU do produto"
          />
        </FormGroup>
        <FormGroup>
          <Label>Nome do Produto:</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome do produto"
          />
        </FormGroup>

        <Button onClick={handleSearch}>Buscar Produto</Button>

        <FormGroup>
          <Label>Marca:</Label>
          <Input
            type="text"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            placeholder="Digite a marca do produto"
          />
        </FormGroup>

        <FormGroup>
          <Label>Fornecedor:</Label>
          <Input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="Digite o fornecedor"
          />
        </FormGroup>

        <FormGroup>
          <Label>Quantidade:</Label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Digite a quantidade"
          />
        </FormGroup>

        <FormGroup>
          <Label>Preço Unitário:</Label>
          <Input
            type="number"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            placeholder="Digite o preço unitário"
          />
        </FormGroup>

        <FormGroup>
          <Label>Data de Cadastro:</Label>
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

        <FormGroup>
          <Label>Categoria:</Label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Selecione a categoria</option>
            <option value="Proteína">Proteína</option>
            <option value="Mantimento">Mantimento</option>
            <option value="Hortaliça">Hortaliça</option>
          </Select>
        </FormGroup>

        <Button onClick={handleSave}>
          {isEditing ? "Adicionar ao Estoque" : "Adicionar ao Estoque"}
        </Button>
        <ButtonReturn to="/Cadastro">Voltar</ButtonReturn>
      </Container>
    </>
  );
}

export default EntradaProdutos;
