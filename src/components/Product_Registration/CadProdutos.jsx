// import { useState, useEffect } from "react";
// import styled, { createGlobalStyle } from "styled-components";
// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, set, push, get } from "firebase/database";
// import { useNavigate } from "react-router-dom"; // Importa o hook para navegação

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

// // Estilos globais
// const GlobalStyle = createGlobalStyle`
//   body {
//     background-color: #00009C;
//     font-family: Arial, sans-serif;
//     color: #333;
//     margin: 0;
//     padding: 0;
//   }
// `;

// const Container = styled.div`
//   max-width: 750px;
//   margin: 50px auto;
//   padding: 15px;
//   background-color: #fff;
//   box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//   border-radius: 10px;

//   @media (max-width: 768px) {
//     padding: 10px;
//     margin: 20px;
//   }
// `;

// const Title = styled.h1`
//   text-align: center;
//   font-size: 48px;
//   font-weight: bold;
//   color: #ffffff;
//   margin-bottom: 20px;
// `;

// const FormGroup = styled.div`
//   margin-bottom: 15px;
// `;

// const Label = styled.label`
//   display: block;
//   font-weight: bold;
//   margin-bottom: 5px;
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 8px;
//   margin-bottom: 10px;
//   border: 2px solid #ccc;
//   border-radius: 4px;
//   font-size: 14px;
//   transition: border-color 0.3s;

//   &:focus {
//     border-color: #00009c;
//     outline: none;
//   }
// `;

// const Select = styled.select`
//   width: 100%;
//   padding: 8px;
//   margin-bottom: 10px;
//   border: 2px solid #ccc;
//   border-radius: 4px;
//   font-size: 14px;
//   transition: border-color 0.3s;

//   &:focus {
//     border-color: #00009c;
//     outline: none;
//   }
// `;

// const Button = styled.button`
//   padding: 10px 18px;
//   background: #f20de7;
//   color: #fff;
//   border-radius: 12px;
//   cursor: pointer;
//   border: none;
//   transition: background-color 0.3s ease;
//   margin-top: 10px;
//   width: 100%;

//   &:hover {
//     background-color: #d10ccf;
//   }
// `;

// const BackButton = styled(Button)`
//   background: #ccc;
//   color: #000;
//   margin-top: 20px;

//   &:hover {
//     background-color: #aaa;
//   }
// `;

// function CadProdutos() {
//   const [sku, setSku] = useState("");
//   const [name, setName] = useState("");
//   const [marca, setMarca] = useState("");
//   const [supplier, setSupplier] = useState("");
//   const [unit, setUnit] = useState("");
//   const [dateAdded, setDateAdded] = useState("");
//   const [category, setCategory] = useState("");
//   const [tipo, setTipo] = useState("");
//   const [products, setProducts] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null);

//   const navigate = useNavigate(); // Hook de navegação

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const productsRef = ref(db, "EntradaProdutos");
//         const snapshot = await get(productsRef);
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           const loadedProducts = Object.values(data);
//           setProducts(loadedProducts);
//           console.log("Produtos carregados:", loadedProducts);
//         }
//       } catch (error) {
//         console.error("Erro ao carregar produtos:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const handleSave = () => {
//     if (
//       sku &&
//       name &&
//       supplier &&
//       unit &&
//       dateAdded &&
//       category &&
//       tipo
//     ) {
//       const newProduct = {
//         sku,
//         name,
//         marca,
//         supplier,
//         unit,
//         dateAdded,
//         category,
//         tipo,
//       };
//       console.log("Dados a serem salvos:", newProduct);

//       if (editingIndex !== null) {
//         const updatedProducts = [...products];
//         updatedProducts[editingIndex] = newProduct;
//         setProducts(updatedProducts);
//         setEditingIndex(null);
//       } else {
//         const newProductRef = push(ref(db, "EntradaProdutos"));
//         set(newProductRef, newProduct)
//           .then(() => {
//             alert("Produto salvo com sucesso!");
//             setProducts([...products, newProduct]);
//           })
//           .catch((error) =>
//             alert("Erro ao salvar o produto: " + error.message)
//           );
//       }

//       resetForm();
//     } else {
//       alert("Preencha todos os campos obrigatórios!");
//     }
//   };

//   const resetForm = () => {
//     setSku("");
//     setName("");
//     setMarca("");
//     setSupplier("");
//     setUnit("");
//     setDateAdded("");
//     setCategory("");
//     setTipo("");
//   };

//   const handleBack = () => {
//     navigate(-1); // Navega para a página anterior
//   };

//   return (
//     <>
//       <GlobalStyle />
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
//             onChange={(e) => setSupplier(e.target.value)}
//             placeholder="Digite o nome do fornecedor"
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
//           <Label>Data de Cadastro:</Label>
//           <Input
//             type="date"
//             value={dateAdded}
//             onChange={(e) => setDateAdded(e.target.value)}
//           />
//         </FormGroup>
  
//         <FormGroup>
//           <Label>Categoria:</Label>
//           <Select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           >
//             <option value="">Selecione a categoria</option>
//             <option value="Proteína">Proteína</option>
//             <option value="Mantimento">Mantimento</option>
//             <option value="Hortaliça">Hortaliça</option>
//             <option value="Doações">Doações</option>

//           </Select>
//           </FormGroup>

//           <FormGroup>
//           <Label>Tipo:</Label>
//           <Select
//             value={tipo}
//             onChange={(e) => setTipo(e.target.value)}
//           >
//             <option value="">Selecione o tipo</option>
//             <option value="Frutas">Frutas</option>
//               <option value="Legumes">Legumes</option>
//               <option value="Verduras">Verduras</option>
//               <option value="Bovina">Bovina</option>              
//               <option value="Ave">Ave</option>
//               <option value="Suína">Suína</option>
//               <option value="Pescado">Pescado</option>
//               <option value="Mercado">Mercado</option>
//           </Select>
//         </FormGroup>
//         <Button onClick={handleSave}>Salvar Produto</Button>
//         <BackButton onClick={handleBack}>Voltar</BackButton>
//       </Container>
//     </>
//   );
// }

// export default CadProdutos;


import { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

// Estilos globais
const GlobalStyle = createGlobalStyle`
body {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  font-family: "Roboto", sans-serif;
  margin: 0;
  padding: 0;
}
`;

// Componentes estilizados
const Container = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;

  @media (max-width: 768px) {
    padding: 15px;
    margin: 20px;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 50px;
  font-weight: bold;
  color: white;
  margin-bottom: 15px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px;
  background: linear-gradient(135deg, rgb(140, 78, 207), rgb(168, 55, 212));
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center; /* Centraliza verticalmente */
  justify-content: center; /* Centraliza horizontalmente */
  width: 100%;
  text-align: center;

  &:hover {
    background-color: rgb(61, 68, 77);
  }
`;


const BackButton = styled(Button)`
  background-color: #F20DE7;
  margin-top: 10px;

  &:hover {
    background-color: #5a6268;
  }
`;

// Componente principal
function CadProdutos() {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [marca, setMarca] = useState("");
  const [supplier, setSupplier] = useState("");
  const [unit, setUnit] = useState("");
  const [peso, setPeso] = useState("");
  const [dateAdded, setDateAdded] = useState("");
  const [category, setCategory] = useState("");
  const [tipo, setTipo] = useState("");
  const [products, setProducts] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = ref(db, "EntradaProdutos");
        const snapshot = await get(productsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setProducts(Object.values(data));
          toast.success("Produtos carregados com sucesso!");
        }
      } catch (error) {
        toast.error("Erro ao carregar produtos: " + error.message);
      }
    };
    fetchProducts();
  }, []);

  const handleSave = () => {
    if (sku && name && supplier && unit && peso && dateAdded && category && tipo) {
      const newProduct = { sku, name, marca, supplier, unit, peso, dateAdded, category, tipo };

      if (editingIndex !== null) {
        const updatedProducts = [...products];
        updatedProducts[editingIndex] = newProduct;
        setProducts(updatedProducts);
        setEditingIndex(null);
        toast.success("Produto atualizado com sucesso!");
      } else {
        const newProductRef = push(ref(db, "EntradaProdutos"));
        set(newProductRef, newProduct)
          .then(() => {
            setProducts([...products, newProduct]);
            toast.success("Produto salvo com sucesso!");
          })
          .catch((error) => toast.error("Erro ao salvar o produto: " + error.message));
      }

      resetForm();
    } else {
      toast.warn("Preencha todos os campos obrigatórios!");
    }
  };

  const resetForm = () => {
    setSku("");
    setName("");
    setMarca("");
    setSupplier("");
    setUnit("");
    setPeso("");
    setDateAdded("");
    setCategory("");
    setTipo("");
  };

  const handleBack = () => navigate(-1);

  return (
    <>
      <GlobalStyle />
      <ToastContainer />
      <Title>Cadastro de Produtos</Title>
      <Container>
        <FormGroup>
          <Label>SKU:</Label>
          <Input type="text" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Digite o SKU do produto" />
        </FormGroup>
        <FormGroup>
          <Label>Nome do Produto:</Label>
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Digite o nome do produto" />
        </FormGroup>

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
          <Label>Peso(KG):</Label>
          <Input
            type="text"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            placeholder="Digite o peso do alimento"
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
          <Label>Categoria:</Label>
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
          </FormGroup>

          <FormGroup>
          <Label>Tipo:</Label>
          <Select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
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
        </FormGroup>
         <Button onClick={handleSave}>Salvar Produto</Button>
        <BackButton onClick={handleBack}>Voltar</BackButton>
      </Container>
    </>
  );
}
export default CadProdutos;
