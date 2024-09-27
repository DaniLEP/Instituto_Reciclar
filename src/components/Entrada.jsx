import { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';

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

function ProductEntry() {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleSave = () => {
    if (sku && name && type && date) {
      const newProduct = { sku, name, type, date };

      if (isEditing) {
        const updatedProducts = [...products];
        updatedProducts[editIndex] = newProduct;
        setProducts(updatedProducts);
        setIsEditing(false);
        setEditIndex(null);
      } else {
        setProducts([...products, newProduct]);
      }

      // Limpa os campos após adicionar ou editar o produto
      setSku('');
      setName('');
      setType('');
      setDate('');
    }
  };

  const handleEdit = (index) => {
    const productToEdit = products[index];
    setSku(productToEdit.sku);
    setName(productToEdit.name);
    setType(productToEdit.type);
    setDate(productToEdit.date);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleRemove = (index) => {
    const filteredProducts = products.filter((_, i) => i !== index);
    setProducts(filteredProducts);
  };

  const handleStoreProducts = () => {
    console.log('Produtos guardados:', products);
    // Lógica para armazenar os produtos (API ou localStorage)
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
          <Label>Tipo de Produto:</Label>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Selecione o tipo</option>
            <option value="proteina">Proteína</option>
            <option value="mantimento">Mantimento</option>
            <option value="hortalicas">Hortaliças</option>
            <option value="diversos">Diversos</option>
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

        <Button onClick={handleSave}>{isEditing ? 'Atualizar Produto' : 'Salvar Produto'}</Button>

        {products.length > 0 && (
          <>
            <Table>
              <thead>
                <tr>
                  <TableHead>SKU</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead>Ações</TableHead>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <TableData>{product.sku}</TableData>
                    <TableData>{product.name}</TableData>
                    <TableData>{product.type}</TableData>
                    <TableData>{product.date}</TableData>
                    <TableData>
                      <ActionButton onClick={() => handleEdit(index)}>Editar</ActionButton>
                      <RemoveButton onClick={() => handleRemove(index)}>Remover</RemoveButton>
                    </TableData>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button onClick={handleStoreProducts}>Guardar Produtos</Button>
          </>
        )}
      </Container>
    </>
  );
}

export default ProductEntry;
