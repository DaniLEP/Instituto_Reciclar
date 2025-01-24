// import { useState, useEffect } from "react";
// import styled, { createGlobalStyle } from "styled-components";
// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, set, push, get } from "firebase/database";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";

// // Configuração do Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
//   authDomain: "bancoestoquecozinha.firebaseapp.com",
//   databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
//   projectId: "bancoestoquecozinha",
//   storageBucket: "bancoestoquecozinha.firebasestorage.app",
//   messagingSenderId: "71775149511",
//   appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
// };

// // Inicializa o Firebase
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// const GlobalStyle = createGlobalStyle`
//   * {
//     margin: 0;
//     padding: 0;
//     box-sizing: border-box;
//   }

//   body {
//     background: #f7f9fc;
//     font-family: 'Roboto', sans-serif;
//     color: #333;
//     -webkit-font-smoothing: antialiased;
//     overflow-x: hidden;
//   }

//   h1, h2, h3, h4, h5, h6 {
//     margin: 0;
//   }

//   a {
//     text-decoration: none;
//     color: inherit;
//   }

//   button {
//     font-family: 'Roboto', sans-serif;
//   }
// `;

// const Container = styled.div`
//   max-width: 900px;
//   margin: 20px auto;
//   padding: 25px;
//   background-color: #ffffff;
//   border-radius: 12px;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//   transition: all 0.3s ease-in-out;

//   @media (max-width: 768px) {
//     margin: 15px;
//     padding: 20px;
//   }

//   @media (max-width: 480px) {
//     margin: 10px;
//     padding: 15px;
//   }
// `;

// const Title = styled.h1`
//   text-align: center;
//   font-size: 2.5rem;
//   font-weight: 600;
//   color: #1a73e8;
//   margin-bottom: 20px;

//   @media (max-width: 768px) {
//     font-size: 2rem;
//   }

//   @media (max-width: 480px) {
//     font-size: 1.8rem;
//   }
// `;

// const FormGroup = styled.div`
//   margin-bottom: 20px;

//   @media (max-width: 480px) {
//     margin-bottom: 15px;
//   }
// `;

// const Label = styled.label`
//   display: block;
//   font-size: 1rem;
//   font-weight: 500;
//   color: #555;
//   margin-bottom: 8px;

//   @media (max-width: 480px) {
//     font-size: 0.9rem;
//   }
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 12px;
//   border: 1px solid #d1d5db;
//   border-radius: 6px;
//   font-size: 1rem;
//   color: #333;
//   transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

//   &:focus {
//     border-color: #1a73e8;
//     box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.2);
//     outline: none;
//   }

//   @media (max-width: 480px) {
//     padding: 10px;
//     font-size: 0.9rem;
//   }
// `;

// const Button = styled.button`
//   width: 100%;
//   padding: 12px;
//   font-size: 1.1rem;
//   font-weight: 600;
//   color: #fff;
//   background: linear-gradient(135deg, #1a73e8, #4285f4);
//   border: none;
//   border-radius: 8px;
//   cursor: pointer;
//   transition: background 0.3s ease-in-out, transform 0.2s;

//   &:hover {
//     background: linear-gradient(135deg, #4285f4, #1a73e8);
//     transform: translateY(-2px);
//   }

//   &:active {
//     transform: translateY(0);
//   }

//   @media (max-width: 480px) {
//     font-size: 1rem;
//     padding: 10px;
//   }
// `;

// const Modal = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background: rgba(0, 0, 0, 0.5);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index: 1000;
// `;

// const ModalContent = styled.div`
//   background: #ffffff;
//   padding: 25px;
//   border-radius: 12px;
//   max-width: 700px;
//   width: 90%;
//   box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);

//   @media (max-width: 768px) {
//     padding: 20px;
//   }

//   @media (max-width: 480px) {
//     padding: 15px;
//   }
// `;

// const Table = styled.table`
//   width: 100%;
//   border-collapse: collapse;
//   margin-top: 20px;

//   th, td {
//     text-align: left;
//     padding: 12px;
//     border-bottom: 1px solid #e5e7eb;
//     font-size: 1rem;
//     color: #555;
//   }

//   th {
//     background-color: #f3f4f6;
//     font-weight: 600;
//     color: #333;
//   }

//   @media (max-width: 768px) {
//     th, td {
//       font-size: 0.9rem;
//       padding: 10px;
//     }
//   }

//   @media (max-width: 480px) {
//     th, td {
//       font-size: 0.85rem;
//       padding: 8px;
//     }
//   }
// `;

// const CloseButton = styled(Button)`
//   background-color: #ff4d4d;

//   &:hover {
//     background-color: #ff1a1a;
//   }
// `;

// const BackButton = styled(Button)`
//   margin-top: 10px;
//   background: linear-gradient(135deg, #34a853, #4caf50);

//   &:hover {
//     background: linear-gradient(135deg, #4caf50, #34a853);
//   }
// `;

// function CadProdutos() {
//   const [sku, setSku] = useState("");
//   const [name, setName] = useState("");
//   const [marca, setMarca] = useState("");
//   const [supplier, setSupplier] = useState("");
//   const [unit, setUnit] = useState("");
//   const [peso, setPeso] = useState("");
//   const [category, setCategory] = useState("");
//   const [tipo, setTipo] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [suppliers, setSuppliers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState(""); // Adicionado corretamente

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSuppliers = async () => {
//       try {
//         const suppliersRef = ref(db, "CadastroFornecedores");
//         const snapshot = await get(suppliersRef);
//         if (snapshot.exists()) {
//           setSuppliers(Object.values(snapshot.val()));
//         } else {
//           toast.warn("Nenhum fornecedor encontrado!");
//         }
//       } catch (error) {
//         toast.error("Erro ao carregar fornecedores!");
//       }
//     };
//     fetchSuppliers();
//   }, []);

//   const handleSave = () => {
//     if (sku && name && marca && supplier && unit && peso && category && tipo) {
//       const newProduct = {
//         sku,
//         name,
//         marca,
//         supplier,
//         unit,
//         peso,
//         category,
//         tipo,
//       };
//       const newProductRef = push(ref(db, "EntradaProdutos"));
//       set(newProductRef, newProduct)
//         .then(() => toast.success("Produto salvo com sucesso!"))
//         .catch((error) =>
//           toast.error("Erro ao salvar o produto: " + error.message)
//         );
//     } else {
//       toast.warn("Preencha todos os campos obrigatórios!");
//     }
//   };
//   const filteredSuppliers = suppliers.filter((supplier) => {
//     return (
//       supplier.razaoSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       supplier.contato?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       supplier.cnpj?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   });

//   const handleSupplierSelect = (razaoSocial) => {
//     setSupplier(razaoSocial);
//     setShowModal(false);
//   };

//   const handleBack = () => navigate(-1);

//   return (
//     <>
//       <GlobalStyle />
//       <ToastContainer />
//       <Title>Cadastro de Produtos</Title>
//       <Container>
//         <FormGroup>
//           <Label>SKU:</Label>
//           <Input
//             type="text"
//             value={sku}
//             onChange={(e) => setSku(e.target.value)}
//             placeholder="Digite o SKU do produto"
//           />
//         </FormGroup>
//         <FormGroup>
//           <Label>Nome do Produto:</Label>
//           <Input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Digite o nome do produto"
//           />
//         </FormGroup>
//         <FormGroup>
//           <Label>Marca:</Label>
//           <Input
//             type="text"
//             value={marca}
//             onChange={(e) => setMarca(e.target.value)}
//             placeholder="Digite a marca do produto"
//           />
//         </FormGroup>
//         <FormGroup>
//           <Label>Fornecedor:</Label>
//           <Input
//             type="text"
//             value={supplier}
//             onClick={() => setShowModal(true)}
//             placeholder="Clique para selecionar um fornecedor"
//             readOnly
//           />
//         </FormGroup>
//         <FormGroup>
//           <Label>Unidade de Medida:</Label>
//           <Input
//             type="text"
//             value={unit}
//             onChange={(e) => setUnit(e.target.value)}
//             placeholder="Digite a unidade de medida"
//           />
//         </FormGroup>
//         <FormGroup>
//           <Label>Peso (KG):</Label>
//           <Input
//             type="text"
//             value={peso}
//             onChange={(e) => setPeso(e.target.value)}
//             placeholder="Digite o peso do alimento"
//           />
//         </FormGroup>
//         <FormGroup>
//           <Label>Categoria:</Label>
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             style={{
//               width: "100%",
//               padding: "12px",
//               border: "1px solid #ccc",
//               borderRadius: "4px",
//               fontSize: "14px",
//               backgroundColor: "#fff",
//               transition: "border-color 0.3s",
//             }}
//           >
//             <option value="">Selecione a categoria</option>
//             <option value="Proteína">Proteína</option>
//             <option value="Mantimento">Mantimento</option>
//             <option value="Hortaliça">Hortaliça</option>
//             <option value="Doações">Doações</option>
//           </select>
//         </FormGroup>

//         <FormGroup>
//           <Label>Tipo:</Label>
//           <select
//             value={tipo}
//             onChange={(e) => setTipo(e.target.value)}
//             style={{
//               width: "100%",
//               padding: "12px",
//               border: "1px solid #ccc",
//               borderRadius: "4px",
//               fontSize: "14px",
//               backgroundColor: "#fff",
//               transition: "border-color 0.3s",
//             }}
//           >
//             <option value="">Selecione o tipo</option>
//             <option value="Frutas">Frutas</option>
//             <option value="Legumes">Legumes</option>
//             <option value="Verduras">Verduras</option>
//             <option value="Bovina">Bovina</option>
//             <option value="Ave">Ave</option>
//             <option value="Suína">Suína</option>
//             <option value="Pescado">Pescado</option>
//             <option value="Mercado">Mercado</option>
//           </select>
//         </FormGroup>
//         <Button onClick={handleSave}>Salvar Produto</Button>
//         <BackButton onClick={handleBack}>Voltar</BackButton>
//       </Container>
//       {showModal && (
//           <ModalContent>
//             <h2>Lista de Fornecedores</h2>
//             <Input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado de busca
//               placeholder="Pesquise por Razão Social, Contato ou CNPJ"
//             />
//             <Table>
//               <thead>
//                 <tr>
//                   <th>Razão Social</th>
//                   <th>Contato</th>
//                   <th>CNPJ</th>
//                   <th>Selecionar</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredSuppliers.length > 0 ? (
//                   filteredSuppliers.map((item, index) => (
//                     <tr key={index}>
//                       <td>{item.razaoSocial}</td>
//                       <td>{item.contato}</td>
//                       <td>{item.cnpj}</td>
//                       <td>
//                         <Button
//                           onClick={() => handleSupplierSelect(item.razaoSocial)}
//                         >
//                           Selecionar
//                         </Button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr style={{ textAlign: "center " }}>
//                     <td colSpan="4">Nenhum fornecedor encontrado.</td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//             <CloseButton onClick={() => setShowModal(false)}>
//               Fechar
//             </CloseButton>
//           </ModalContent>
//       )}
//     </>
//   );
// }

// export default CadProdutos;

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

const Input = styled.input`
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

const ModalContent = styled.div`
  background: #ffffff;
  padding: 25px;
  border-radius: 12px;
  max-width: 700px;
  width: 90%;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-in-out;
  transform: translateY(0);

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

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

const Button = styled.button`
  width: 100%;
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
  const [unit, setUnit] = useState("");
  const [peso, setPeso] = useState("");
  const [category, setCategory] = useState("");
  const [tipo, setTipo] = useState("");
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
    if (sku && name && marca && supplier && unit && peso && category && tipo) {
      const newProduct = {
        sku,
        name,
        marca,
        supplier,
        unit,
        peso,
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
          <label>Unidade:</label>
          <Input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Digite a unidade"
          />
        </div>
        <div>
          <label>Peso:</label>
          <Input
            type="text"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            placeholder="Digite o peso"
          />
        </div>
        <div>
          <label>Categoria:</label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
              backgroundColor: "#fff",
              transition: "border-color 0.3s",
            }}
          >
            <option value="">Selecione a categoria</option>
            <option value="Proteína">Proteína</option>
            <option value="Mantimento">Mantimento</option>
            <option value="Hortaliça">Hortaliça</option>
            <option value="Doações">Doações</option>
          </Select>
        </div>
        <div>
          <label>Tipo:</label>
          <Select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
              backgroundColor: "#fff",
              transition: "border-color 0.3s",
            }}
          >
            <option value="">Selecione o tipo</option>
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
        <Button onClick={handleSave}>Salvar Produto</Button>
        <CloseButton onClick={handleBack}>Voltar</CloseButton>
      </Container>

      {showModal && (
        <Modal>
          <ModalContent>
            <h2>Selecione um Fornecedor</h2>
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar fornecedor"
            />
            <Table>
              <thead>
                <tr>
                  <th>Razão Social</th>
                  <th>Contato</th>
                  <th>CNPJ</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.cnpj}
                    onClick={() => handleSupplierSelect(supplier.razaoSocial)}
                  >
                    <td style={{ cursor: "pointer" }}>
                      {supplier.razaoSocial}
                    </td>
                    <td style={{ cursor: "pointer" }}>{supplier.contato}</td>
                    <td style={{ cursor: "pointer" }}>{supplier.cnpj}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <CloseButton onClick={() => setShowModal(false)}>
              Fechar
            </CloseButton>
          </ModalContent>
        </Modal>
      )}

      <ToastContainer />
    </>
  );
}

export default CadProdutos;
