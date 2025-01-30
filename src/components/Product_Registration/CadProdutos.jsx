import { useState, useEffect, useMemo } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, get } from "firebase/database";
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
  background: linear-gradient(135deg, #1a73e8, #4285f4);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease-in-out, transform 0.2s;

  &:hover {
    background: linear-gradient(135deg, #4285f4, #1a73e8);
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
  background-color: #ff4d4d;
  margin-top: 10px;

  &:hover {
    background-color: #ff1a1a;
  }
`;

function CadProdutos() {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [marca, setMarca] = useState("");
  const [supplier, setSupplier] = useState("");
  const [peso, setPeso] = useState("");
  const [category, setCategory] = useState("");
  const [tipo, setTipo] = useState("");
  const [unit, setUnit] = useState("");

  const [unitMeasure, setUnitMeasure] = useState("g"); // Adicionando estado para a unidade de medida
  const [showModal, setShowModal] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSave = () => {
    if (
      sku &&
      name &&
      marca &&
      supplier &&
      peso &&
      unitMeasure &&
      unit &&
      category &&
      tipo
    ) {
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
      const newProductRef = push(ref(db, "EntradaProdutos"));
      set(newProductRef, newProduct)
        .then(() => toast.success("Produto salvo com sucesso!"))
        .catch((error) =>
          toast.error("Erro ao salvar o produto: " + error.message)
        );
    } else {
      toast.warn("Preencha todos os campos obrigatórios!");
    }
  };

  const handlePesoChange = (e) => {
    const value = e.target.value.trim();
    setPeso(value);
  };

  const handleUnitMeasureChange = (e) => {
    setUnitMeasure(e.target.value); // Atualiza a unidade de medida
  };

  const handleUnitChange = (e) => {
    setUnit(e.target.value); // Atualiza a unidade de medida
  };
  const handleBack = () => navigate(-1);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>Cadastro de Produtos</Title>
        <div>
          <label style={{ display: "flex" }}>SKU:</label>
          <Input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Digite o SKU"
          />
        </div>
        <div>
          <label style={{ display: "flex" }}>Nome do Produto:</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome do produto"
          />
        </div>
        <div>
          <label style={{ display: "flex" }}>Marca:</label>
          <Input
            type="text"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            placeholder="Digite a marca"
          />
        </div>
        <div>
          <label style={{ display: "flex" }}>Fornecedor:</label>
          <Input
            type="text"
            value={supplier}
            onClick={() => setShowModal(true)}
            placeholder="Selecione o fornecedor"
            readOnly
          />
        </div>
        <div>
          <label style={{ display: "flex" }}>Peso:</label>
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
          <label style={{ display: "flex" }}>Escolha a unidade de peso:</label>
          <Select value={unit} onChange={handleUnitChange}>
            <option value="un">Unidade</option>
            <option value="fd">Fardo</option>
            <option value="cx">Caixa</option>
          </Select>
        </div>
        <div>
          <label style={{ display: "flex" }}>Categoria:</label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Selecione a categoria</option>
            <option value="Proteína">Proteína</option>
            <option value="Mantimento">Mantimento</option>
            <option value="Hortaliça">Hortaliça</option>
            <option value="Doações">Doações</option>
          </Select>
        </div>
        <div>
          <label style={{ display: "flex" }}>Tipo:</label>
          <Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Selecione o tipo</option>
            <option value="Alimento">Alimento</option>
            <option value="Bebida">Bebida</option>
            <option value="Higiene">Higiene</option>
          </Select>
        </div>

        <Button onClick={handleSave}>Salvar Produto</Button>
        <Button onClick={handleBack} style={{ marginTop: "10px" }}>
          Voltar
        </Button>

        {showModal && (
          <Modal>
            <ModalContent>
              <h2>Selecione o Fornecedor</h2>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar fornecedor..."
              />
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
                    {filteredSuppliers.map((sup, index) => (
                      <tr key={index}>
                        <td>{sup.razaoSocial}</td>
                        <td>{sup.contato}</td>
                        <td>{sup.cnpj}</td>
                        <td>
                          <Button
                            onClick={() =>
                              handleSupplierSelect(sup.razaoSocial)
                            }
                          >
                            Selecionar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrapper>
              <CloseButton onClick={() => setShowModal(false)}>
                Fechar
              </CloseButton>
            </ModalContent>
          </Modal>
        )}
      </Container>
      <ToastContainer />
    </>
  );
}

export default CadProdutos;
