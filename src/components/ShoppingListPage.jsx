import { useState } from 'react';
import { Link } from 'react-router-dom';
import BarcodeScannerComponent from 'react-qr-barcode-scanner'; // Importar o scanner de código de barras

const ShoppingListPage = () => {
  const [sku, setSku] = useState('');
  const [product, setProduct] = useState('');
  const [supplier, setSupplier] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [shoppingList, setShoppingList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [showScanner, setShowScanner] = useState(false); // Controla o scanner

  // Função para adicionar ou editar um produto
  const handleAddOrEditProduct = () => {
    const newItem = { sku, product, supplier, quantity, notes };

    if (isEditing) {
      const updatedList = shoppingList.map((item, index) =>
        index === currentIndex ? newItem : item
      );
      setShoppingList(updatedList);
      setIsEditing(false);
      setCurrentIndex(null);
    } else {
      setShoppingList([...shoppingList, newItem]);
    }

    // Limpar campos após adicionar/editar
    setSku('');
    setProduct('');
    setSupplier('');
    setQuantity(1);
    setNotes('');
  };

  // Função para remover um produto
  const handleRemoveProduct = (index) => {
    const updatedList = shoppingList.filter((_, i) => i !== index);
    setShoppingList(updatedList);
  };

  // Função para iniciar a edição de um produto
  const handleEditProduct = (index) => {
    const item = shoppingList[index];
    setSku(item.sku);
    setProduct(item.product);
    setSupplier(item.supplier);
    setQuantity(item.quantity);
    setNotes(item.notes);
    setIsEditing(true);
    setCurrentIndex(index);
  };

  return (
    <div style={{ background: "#00009c", padding: '20px', color: "white", minHeight: '100vh' }}>
      <h1 style={{ textAlign: "center", fontSize: "80px", fontStyle: "bold" , fontFamily: "chakra petch"}}>Lista de Compras</h1>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        color: "black",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
      }}>
        {/* Formulário para adicionar ou editar produtos */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <input
            type="text"
            placeholder="Sku"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            style={{
              width: "20%",
              padding: "10px",
              border: "1px solid rgb(115 113 113)",
              borderRadius: "12px",
              fontSize: "16px"
            }}
          />
          <button onClick={() => setShowScanner(true)} style={{ padding: "12px 20px", background: "#F20DE7", color: "#fff", borderRadius: "12px", cursor: "pointer", border: "none", transition: "background-color 0.3s ease" }}>
            Abrir Scanner
          </button>
          
          {/* Scanner de código de barras */}
          {showScanner && (
            <div>
              <BarcodeScannerComponent
                width={400}
                height={300}
                onUpdate={(err, result) => {
                  if (result) {
                    setSku(result.text); // Define a SKU automaticamente
                    setShowScanner(false); // Fechar scanner após captura
                  } else if (err) {
                    console.error(err); // Tratamento de erro (opcional)
                  }
                }}
                facingMode="environment" // Usar a câmera traseira
              />
            </div>
          )}
          
          <input
            type="text"
            placeholder="Produto"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            style={{
              width: "20%",
              padding: "10px",
              border: "1px solid rgb(115 113 113)",
              borderRadius: "12px",
              fontSize: "16px"
            }}
          />
          <input
            type="text"
            placeholder="Fornecedor"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            style={{
              width: "20%",
              padding: "10px",
              border: "1px solid rgb(115 113 113)",
              borderRadius: "12px",
              fontSize: "16px"
            }}
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            style={{ width: "15%", padding: "10px", border: "1px solid rgb(115 113 113)", borderRadius: "12px", fontSize: "16px" }}
          />
          <input
            type="text"
            placeholder="Observações"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ width: "25%", padding: "10px", border: "1px solid rgb(115 113 113)", borderRadius: "12px", fontSize: "16px" }}
          />
          <button onClick={handleAddOrEditProduct} style={{ padding: "12px 20px", background: "#F20DE7", color: "#fff", borderRadius: "12px", cursor: "pointer", border: "none", transition: "background-color 0.3s ease", whiteSpace: "nowrap" }}>
            {isEditing ? 'Salvar Alterações' : 'Adicionar Produto'}
          </button>
        </div>

        {/* Exibindo a lista de produtos */}
        <h2 className='text-center text-[20px]'>Produtos Adicionados</h2> <br />
        {shoppingList.length === 0 ? (
          <p className="text-center">Nenhum produto adicionado.</p>
        ) : (
          <table style={{ marginTop: "5vh", width: '100%', backgroundColor: "#00009C", color: "#fff", borderCollapse: "collapse", textAlign: "center" }}>
            <thead>
              <tr>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Sku</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Produto</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Fornecedor</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Quantidade</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Observações</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {shoppingList.map((item, index) => (
                <tr key={index} style={{ backgroundColor:"white", color:"black", border: "1 solid black" }}>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{item.sku}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{item.product}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{item.supplier}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{item.quantity}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{item.notes}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    <button onClick={() => handleEditProduct(index)} style={{padding: "8px 16px", marginRight: "10px", border: "none", background: "#F20DE7", color: "#fff", borderRadius: "4px", cursor: "pointer", transition: "background-color 0.3s ease"}}>
                      Editar
                    </button>
                    <button onClick={() => handleRemoveProduct(index)}>Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Link to={"/Mantimento"}>
          <button style={{ padding: "8px 16px", border: "none", background: "#F20DE7", color: "#fff", borderRadius: "4px", cursor: "pointer", transition: "background-color 0.3s ease" }}>
            Voltar
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ShoppingListPage;
