import { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';

// Estilos globais
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #00009C;
    font-family: Arial, sans-serif;
    color: #333;
    margin: 0;
    padding: 0;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 12px 20px;
  background: #F20DE7;
  color: #fff;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease;
  margin-top: 10px;

  &:hover {
    background-color: #d10ccf;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHead = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: #f2f2f2;
`;

const TableData = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const ActionButton = styled.button`
  padding: 12px 20px;
  background: #F20DE7;
  color: #fff;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  margin-top: 10px;

  &:hover {
    background-color: #d10ccf;
  }
`;

const RemoveButton = styled(ActionButton)`
  margin-left: 10px;
`;

function ProductEntry() {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const videoRef = useRef(null);

  useEffect(() => {
    if ('BarcodeDetector' in window) {
      const barcodeDetector = new BarcodeDetector({ formats: ['ean_13', 'code_128', 'ean_8'] });

      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch(console.error);

      const scanBarcode = () => {
        if (videoRef.current) {
          barcodeDetector.detect(videoRef.current)
            .then(barcodes => {
              if (barcodes.length > 0) {
                setSku(barcodes[0].rawValue);  // Preenche o SKU automaticamente
              }
            })
            .catch(console.error);
        }
      };

      const interval = setInterval(scanBarcode, 1000);  // Verifica o código a cada segundo

      return () => {
        clearInterval(interval);
        if (videoRef.current && videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
      };
    } else {
      alert('API BarcodeDetector não é suportada no seu navegador.');
    }
  }, []);

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
      <h1 style={{ textAlign: "center", fontSize: "80px", fontStyle: "bold", fontFamily: "chakra petch", color: "white" }}>
        Entrada de Produtos
      </h1>
      <Container>
        <FormGroup>
          <Label>Scanner de Código de Barras:</Label>
          <video
            ref={videoRef}
            style={{
              width: '50%',       // Reduz a largura para 50%
              display: 'block',    // Garante que seja um bloco
              margin: '0 auto 20px auto', // Adiciona margem inferior
              borderRadius: '10px'
            }}
          ></video>
        </FormGroup>

        <FormGroup>
          <Label>SKU:</Label>
          <Input
            type="text"
            value={sku}
            readOnly // Torna o campo somente leitura
            placeholder="SKU será preenchido automaticamente"
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
        <Link to={'/cadastro'}>
          <button type="button" id="return"  style={{ position: "absolute", top: "27vh", background: "none", border:"none", right:"44vh" }}>
            <img src="/return.svg" alt="Voltar" style={{ width: "50px", height: "50px" }} />
          </button>
        </Link>
      </Container>
    </>
  );
}

export default ProductEntry;
