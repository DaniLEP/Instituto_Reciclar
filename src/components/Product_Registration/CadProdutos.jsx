import { useState, useEffect, useMemo } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: linear-gradient(135deg, #6a11cb, #2575fc);
    font-family: 'Roboto', sans-serif;
    color: #333;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font-family: 'Roboto', sans-serif;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-top: 10px;

  table {
    min-width: 500px;
    border-collapse: collapse;
  }

  th,
  td {
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid #e5e7eb;
    font-size: 1rem;
    color: #555;
  }

  th {
    background-color: #f3f4f6;
    font-weight: 600;
    color: #333;
  }

  @media (max-width: 768px) {
    th,
    td {
      font-size: 0.9rem;
      padding: 10px;
    }
  }

  @media (max-width: 480px) {
    th,
    td {
      font-size: 0.85rem;
      padding: 8px;
    }
  }
`;

const ModalContent = styled.div`
  background: #ffffff;
  padding: 25px;
  border-radius: 12px;
  max-width: 700px;
  width: 90%;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  transform: translateY(0);

  @media (max-width: 768px) {
    padding: 20px;
    width: 95%;
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const Button = styled.button`
  width: 100%;
  max-width: 100%;
  padding: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg,rgb(179, 66, 244),rgb(132, 26, 232));
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background 0.3s ease-in-out, transform 0.2s;

  &:hover {
    background: linear-gradient(135deg,rgba(179, 66, 244, 0.68),rgba(132, 26, 232, 0.6));
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 10px;
  }
`;

const Input = styled.input`
  width: 100%;
  max-width: 750px;
  padding: 12px 16px;
  margin: 10px 0;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #1a73e8;
    box-shadow: 0 0 8px rgba(26, 115, 232, 0.4);
  }

  &::placeholder {
    color: #999;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 10px 14px;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 8px 12px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  margin: 10px 0;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #1a73e8;
    box-shadow: 0 0 8px rgba(26, 115, 232, 0.4);
  }

  &::placeholder {
    color: #999;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 10px 14px;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 8px 12px;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;

  @media (max-width: 768px) {
    margin: 30px 20px;
    padding: 30px;
  }

  @media (max-width: 480px) {
    margin: 20px 10px;
    padding: 20px;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 600;
  color: #1a73e8;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.3s ease-in-out;
`;

const CloseButton = styled(Button)`
  background: linear-gradient(135deg,rgb(78, 66, 244),rgb(57, 26, 232));

  margin-top: 40px;

  &:hover {
  background: linear-gradient(135deg,rgba(78, 66, 244, 0.64),rgba(57, 26, 232, 0.54));

  }
`;

export default function CadProdutos() {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [marca, setMarca] = useState("");
  const [supplier, setSupplier] = useState("");
  const [peso, setPeso] = useState("");
  const [category, setCategory] = useState("");
  const [tipo, setTipo] = useState("");
  const [unit, setUnit] = useState("");
  const [unitMeasure, setUnitMeasure] = useState("g");
  const [showModal, setShowModal] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const suppliersRef = ref(db, "CadastroFornecedores");
        const snapshot = await get(suppliersRef);
        if (snapshot.exists()) {
          setSuppliers(Object.values(snapshot.val()));
        } else {
          toast.warn("Nenhum fornecedor encontrado!");
        }
      } catch (error) {
        toast.error("Erro ao carregar fornecedores!");
      }
    };
    fetchSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      return (
        supplier.razaoSocial
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        supplier.contato?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.cnpj?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [suppliers, searchTerm]);

  const handleSupplierSelect = (razaoSocial) => {
    setSupplier(razaoSocial);
    setShowModal(false);
  };

  const checkExistingSku = async (sku) => {
    try {
      const productsRef = ref(db, "EntradaProdutos");
      const snapshot = await get(productsRef);
      if (snapshot.exists()) {
        const products = snapshot.val();
        const existingSku = Object.values(products).find((product) => product.sku === sku);
        return existingSku;
      }
      return null;
    } catch (error) {
      toast.error("Erro ao verificar SKU: " + error.message);
      return null;
    }
  };

  const handleSave = async () => {
    // Verificação se todos os campos obrigatórios estão preenchidos
    if (
      !sku ||
      !name ||
      !marca ||
      !supplier ||
      !peso ||
      !unitMeasure ||
      !unit ||
      !category ||
      !tipo
    ) {
      toast.error("Por favor, preencha todos os campos obrigatórios!");
      return;
    }
  
    const existingProduct = await checkExistingSku(sku);
    if (existingProduct) {
      toast.error("SKU já cadastrado. Por favor, insira um SKU diferente.");
      return;
    }
  
    const newProduct = {
      sku,
      name,
      marca,
      supplier,
      peso,
      unitMeasure,
      unit,
      category,
      tipo,
    };
  
    const newProductRef = ref(db, "EntradaProdutos/" + sku);
    
    // Desabilitar botão enquanto o produto está sendo salvo
    setSaveLoading(true);
  
    set(newProductRef, newProduct)
      .then(() => {
        toast.success("Produto salvo com sucesso!");
        handleClearFields();
      })
      .catch((err) => {
        toast.error("Erro ao salvar o produto: " + err.message);
      })
      .finally(() => {
        // Reabilitar o botão após a tentativa de salvar
        setSaveLoading(false);
      });
  };

  const handleClearFields = () => {
    setSku("");
    setName("");
    setMarca("");
    setSupplier("");
    setPeso("");
    setUnitMeasure("g");
    setUnit("");
    setCategory("");
    setTipo("");
  };

  const handlePesoChange = (e) => {
    setPeso(e.target.value.trim());
  };

  const handleUnitMeasureChange = (e) => {
    setUnitMeasure(e.target.value);
  };

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
  };

  const handleBack = () => navigate(-1);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>Cadastro de Produtos</Title>
        <div>
          <label>SKU:</label>
          <Input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Digite o SKU"
          />
        </div>
        <div>
          <label>Nome do Produto:</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome do produto"
          />
        </div>
        <div>
          <label>Marca:</label>
          <Input
            type="text"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            placeholder="Digite a marca"
          />
        </div>
        <div>
          <label>Fornecedor:</label>
          <Input
            type="text"
            value={supplier}
            onClick={() => setShowModal(true)}
            placeholder="Selecione o fornecedor"
            readOnly
          />
        </div>
        <div>
          <label>Peso:</label>
          <Input
            type="number"
            value={peso}
            onChange={handlePesoChange}
            placeholder="Digite o peso (ex: 100)"
          />
          <Select value={unitMeasure} onChange={handleUnitMeasureChange}>
            <option value="g">Gramas</option>
            <option value="kg">Quilos</option>
            <option value="L">Litros</option>
            <option value="ml">Mili-Litros</option>
          </Select>
        </div>
        <div>
          <label>Escolha a unidade de peso:</label>
          <Select value={unit} onChange={handleUnitChange}>
            <option value="selecione">Selecione uma unidade de medida</option>
            <option value="un">Unidade</option>
            <option value="fd">Fardo</option>
            <option value="pc">Peça</option>
            <option value="cx">Caixa</option>
          </Select>
        </div>
        <div>
          <label>Categoria:</label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="alimentos">Alimentos</option>
            <option value="bebidas">Bebidas</option>
            <option value="materiais">Materiais</option>
          </Select>
        </div>
        <div>
          <label>Tipo:</label>
          <Select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
              <option value="Frutas">Frutas</option>
              <option value="Legumes">Legumes</option>
              <option value="Verduras">Verduras</option>
              <option value="Bovina">Bovina</option>
              <option value="Ave">Ave</option>
              <option value="Suína">Suína</option>
              <option value="Pescado">Pescado</option>
              <option value="Mercado">Mercado</option>
          </Select>
        </div>
        <Button onClick={handleSave} disabled={saveLoading}>
  {saveLoading ? "Salvando..." : "Salvar"}
</Button>        <Button onClick={handleBack}>Voltar</Button>
      </Container>

      {showModal && (
        <Modal>
          <ModalContent>
            <h2>Escolha um Fornecedor</h2>
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar fornecedor"
            />
            {filteredSuppliers.length === 0 ? (
              <p>Nenhum fornecedor encontrado</p>
            ) : (
              <TableWrapper>
                <table>
                  <thead>
                    <tr>
                      <th>Razão Social</th>
                      <th>Contato</th>
                      <th>CNPJ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuppliers.map((supplier) => (
                      <tr key={supplier.cnpj}>
                        <td>{supplier.razaoSocial}</td>
                        <td>{supplier.contato}</td>
                        <td>{supplier.cnpj}</td>
                        <td>
                          <Button onClick={() => handleSupplierSelect(supplier.razaoSocial)}>
                            Selecionar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrapper>
            )}
            <CloseButton onClick={() => setShowModal(false)}>Fechar</CloseButton>
          </ModalContent>
        </Modal>
      )}

      <ToastContainer />
    </>
  );
}
