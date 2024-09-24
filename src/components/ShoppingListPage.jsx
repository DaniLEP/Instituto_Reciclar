import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const ShoppingListPage = () => {
  const [sku, setSku] = useState('');
  const [product, setProduct] = useState('');
  const [supplier, setSupplier] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [shoppingList, setShoppingList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const videoRef = useRef(null); // Referência para o vídeo da câmera
  const [isCameraActive, setIsCameraActive] = useState(false); // Estado para controlar se a câmera está ativa
  const [isBarcodeSupported, setIsBarcodeSupported] = useState(true); // Verificação de suporte ao BarcodeDetector

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

  // Função para iniciar o scanner
  const startCamera = () => {
    if (!('BarcodeDetector' in window)) {
      setIsBarcodeSupported(false); // Se o navegador não suportar, exibe uma mensagem
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } }) // Câmera traseira
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      })
      .catch((err) => console.error('Erro ao acessar a câmera: ', err));
  };

  // Função para escanear código de barras
  const scanBarcode = async () => {
    if (videoRef.current && 'BarcodeDetector' in window) {
      const barcodeDetector = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'code_128'] });

      try {
        const barcodes = await barcodeDetector.detect(videoRef.current);
        if (barcodes.length > 0) {
          setSku(barcodes[0].rawValue); // Captura o valor do código de barras
        }
      } catch (err) {
        console.error('Erro ao detectar código de barras: ', err);
      }
    }
  };

  // Usando o efeito para escanear a cada frame
  useEffect(() => {
    let scanInterval;
    if (isCameraActive) {
      scanInterval = setInterval(scanBarcode, 500); // Faz o scanner a cada 500ms
    }
    return () => clearInterval(scanInterval); // Limpa o intervalo ao desmontar
  }, [isCameraActive]);

  useEffect(() => {
    startCamera(); // Inicia a câmera ao carregar a página
  }, []);

  return (
    <div style={{ background: "#00009c", padding: '20px', color: "white", minHeight: '100vh' }}>
      <h1 style={{ textAlign: "center", fontSize: "80px", fontStyle: "bold", fontFamily: "chakra petch" }}>Lista de Compras</h1>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        color: "black",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
      }}>
        {/* Verifica se o navegador suporta a API */}
        {!isBarcodeSupported && (
          <p style={{ color: "red", textAlign: "center" }}>Seu navegador não suporta o BarcodeDetector.</p>
        )}
        
        {/* Scanner de código de barras */}
        <video
          id="video"
          style={{
            width: '200px', // Reduzido para 200px de largura
            height: 'auto', // Mantém a proporção da altura
            border: '2px solid #000', // Bordas opcionais para visualizar o vídeo
            borderRadius: '8px' // Bordas arredondadas opcionais
          }}
          autoPlay
          ref={videoRef} // Atribuindo a referência ao vídeo
        ></video>

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
                <tr key={index}>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{item.product}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{item.supplier}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{item.quantity}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{item.notes}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    <button onClick={() => handleEditProduct(index)} style={{ marginRight: '10px' }}>Editar</button>
                    <button onClick={() => handleRemoveProduct(index)}>Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Link to={'/orders-page'}>
      <button type="button" id="return"  style={{ position: "absolute", top: "22vh", background: "none", border: "none", right:"24vh" }}>
          <img src="/return.svg" alt="Voltar" style={{ width: "50px", height: "50px" }} />
        </button>
        </Link>
    </div>
  );
};

export default ShoppingListPage;
