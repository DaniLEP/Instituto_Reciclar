import { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

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

const ActionButton = styled(Button)`
  margin-left: 10px;
`;

function CadProdutos() {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [supplier, setSupplier] = useState('');
  const [unit, setUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [dateAdded, setDateAdded] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [type, setType] = useState('');
  const [products, setProducts] = useState([]);

  const videoRef = useRef(null);

  useEffect(() => {
    const initBarcodeScanner = async () => {
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new BarcodeDetector({ formats: ['ean_13', 'code_128', 'ean_8'] });
        
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          videoRef.current.srcObject = stream;
          videoRef.current.play();

          const scanBarcode = async () => {
            const barcodes = await barcodeDetector.detect(videoRef.current);
            if (barcodes.length > 0) {
              setSku(barcodes[0].rawValue);  // Preenche o SKU automaticamente
            }
          };

          const interval = setInterval(scanBarcode, 1000);  // Verifica o código a cada segundo
          return () => clearInterval(interval);
        } catch (error) {
          console.error('Erro ao acessar a câmera:', error);
        }
      } else {
        alert('API BarcodeDetector não é suportada no seu navegador.');
      }
    };

    initBarcodeScanner();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSave = () => {
    if (sku && name && supplier && unit && quantity && dateAdded && expiryDate && unitPrice && totalPrice && type) {
      const newProduct = { sku, name, supplier, unit, quantity, dateAdded, expiryDate, unitPrice, totalPrice, type };
      setProducts([...products, newProduct]);

      // Limpa os campos após adicionar o produto
      resetForm();
    }
  };

  const resetForm = () => {
    setSku('');
    setName('');
    setSupplier('');
    setUnit('');
    setQuantity('');
    setDateAdded('');
    setExpiryDate('');
    setUnitPrice('');
    setTotalPrice('');
    setType('');
  };

  const handleRemove = (index) => {
    const filteredProducts = products.filter((_, i) => i !== index);
    setProducts(filteredProducts);
  };

  return (
    <>
      <GlobalStyle />
      <h1 style={{ textAlign: "center", fontSize: "40px", fontWeight: "bold", color: "white" }}>
        Cadastro de Produtos
      </h1>
      <Container>
        <FormGroup>
          <Label>Scanner de Código de Barras:</Label>
          <video
            ref={videoRef}
            style={{
              width: '100%',
              display: 'block',
              marginBottom: '20px',
              borderRadius: '10px'
            }}
          ></video>
        </FormGroup>

        <FormGroup>
          <Label>SKU:</Label>
          <Input
            type="text"
            value={sku}
            readOnly // Campo somente leitura
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
          <Label>Fornecedor:</Label>
          <Input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="Digite o nome do fornecedor"
          />
        </FormGroup>

        <FormGroup>
          <Label>Unidade de Medida:</Label>
          <Input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Digite a unidade de medida"
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
          <Label>Data de Cadastro:</Label>
          <Input
            type="date"
            value={dateAdded}
            onChange={(e) => setDateAdded(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Data de Vencimento:</Label>
          <Input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Valor Unitário:</Label>
          <Input
            type="number"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            placeholder="Digite o valor unitário"
          />
        </FormGroup>

        <FormGroup>
          <Label>Valor Total:</Label>
          <Input
            type="number"
            value={totalPrice}
            onChange={(e) => setTotalPrice(e.target.value)}
            placeholder="Digite o valor total"
          />
        </FormGroup>

        <FormGroup>
          <Label>Tipo de Produto:</Label>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Selecione o tipo</option>
            <option value="proteina">Proteína</option>
            <option value="mantimento">Mantimento</option>
            <option value="hortalicas">Hortaliças</option>
            <option value="doacoes">Doações Recebidas</option>
          </Select>
        </FormGroup>

        <Button onClick={handleSave}>Adicionar Produto</Button>

        {products.length > 0 && (
          <Table>
            <thead>
              <tr>
                <TableHead>SKU</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead>Data de Vencimento</TableHead>
                <TableHead>Valor Unitário</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ações</TableHead>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <TableData>{product.sku}</TableData>
                  <TableData>{product.name}</TableData>
                  <TableData>{product.supplier}</TableData>
                  <TableData>{product.unit}</TableData>
                  <TableData>{product.quantity}</TableData>
                  <TableData>{product.dateAdded}</TableData>
                  <TableData>{product.expiryDate}</TableData>
                  <TableData>{product.unitPrice}</TableData>
                  <TableData>{product.totalPrice}</TableData>
                  <TableData>{product.type}</TableData>
                  <TableData>
                    <ActionButton onClick={() => handleRemove(index)}>Remover</ActionButton>
                  </TableData>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  );
}

export default CadProdutos;
