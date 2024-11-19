import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, update, remove, onValue } from 'firebase/database';

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
  color: #00009C;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 2rem; /* Ajuste de tamanho de fonte para telas menores */
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
    border-color: #00009C;
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
    border-color: #00009C;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #F20DE7;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
`;

const TableHead = styled.th`
  padding: 12px;
  background-color: #f2f2f2;
  border: 2px solid #ddd;
`;

const TableData = styled.td`
  padding: 12px;
  border: 2px solid #ddd;
`;

const ActionButton = styled(Button)`
  background: #007bff;
  font-size: 10px;
  width: 100px;
  margin-right: 12px;
`;

const RemoveButton = styled(ActionButton)`
  background: #dc3545;
  font-size: 10px;
  width: 100px;
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
      width: 30px; /* Ajuste do tamanho da imagem para telas menores */
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
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbProdutos = ref(db, 'EntradaProdutos');

function EntradaProdutos() {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [marca, setMarca] = useState('');
  const [valor, setValor] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const navigate = useNavigate(); // Navegação após salvar

  // Função para formatar o valor em R$
  const formatCurrency = (value) => {
    return `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`;
  };

  // Carregar os produtos do Firebase
  useEffect(() => {
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

  const handleSave = () => {
    if (sku && name && marca && valor && type && date) {
      const newProduct = { sku, name, marca, valor, type, date };

      if (isEditing) {
        const updatedProducts = [...products];
        updatedProducts[editIndex] = newProduct;

        const productRef = ref(db, 'EntradaProdutos/' + updatedProducts[editIndex].id);
        update(productRef, newProduct).then(() => {
          setProducts(updatedProducts);
          setIsEditing(false);
          setEditIndex(null);
          navigate('/cadastro'); // Redireciona após salvar
        });
      } else {
        const newProductRef = ref(db, 'EntradaProdutos/' + new Date().getTime());
        set(newProductRef, newProduct).then(() => {
          navigate('/cadastro'); // Redireciona após salvar
        });
      }

      // Limpa os campos após adicionar ou editar o produto
      setSku('');
      setName('');
      setMarca('');
      setValor('');
      setType('');
      setDate('');
    }
  };

  const handleEdit = (index) => {
    const productToEdit = products[index];
    setSku(productToEdit.sku);
    setName(productToEdit.name);
    setMarca(productToEdit.marca);
    setValor(productToEdit.valor);
    setType(productToEdit.type);
    setDate(productToEdit.date);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleRemove = (index) => {
    const productToRemove = products[index];
    const productRef = ref(db, 'EntradaProdutos/' + productToRemove.id);
    remove(productRef).then(() => {
      setProducts(products.filter((_, i) => i !== index));
    });
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <BackButton to={'/cadastro'}>
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
        <FormGroup>
          <Label>Marca do Produto:</Label>
          <Input
            type="text"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            placeholder="Digite a marca do produto"
          />
        </FormGroup>
        <FormGroup>
          <Label>Valor:</Label>
          <Input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Digite o valor do produto"
          />
        </FormGroup>
        <FormGroup>
          <Label>Tipo:</Label>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Selecione um tipo</option>
            <option value="Proteína">Proteína</option>
            <option value="Mantimento">Mantimento</option>
            <option value="Hortaliças">Hortaliças</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Data de Cadastro:</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormGroup>

        <Button onClick={handleSave}>
          {isEditing ? 'Salvar Alterações' : 'Adicionar Produto'}
        </Button>

        <Table>
          <thead>
            <tr>
              <TableHead>SKU</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <TableData>{product.sku}</TableData>
                <TableData>{product.name}</TableData>
                <TableData>{product.marca}</TableData>
                <TableData>{formatCurrency(product.valor)}</TableData>
                <TableData>{product.type}</TableData>
                <TableData>{product.date}</TableData>
                <TableData>
                  <ActionButton onClick={() => handleEdit(index)}>
                    Editar
                  </ActionButton>
                  <RemoveButton onClick={() => handleRemove(index)}>
                    Remover
                  </RemoveButton>
                </TableData>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default EntradaProdutos;
