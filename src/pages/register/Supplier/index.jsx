import { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { initializeApp, getApps } from "firebase/app";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Label } from "@radix-ui/react-label";
import { Input } from "../../../components/ui/input/index";

// Configuração do Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
    authDomain: "bancoestoquecozinha.firebaseapp.com",
    databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
    projectId: "bancoestoquecozinha",
    storageBucket: "bancoestoquecozinha.appspot.com",
    messagingSenderId: "71775149511",
    appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
  };

  if (!getApps().length) {initializeApp(firebaseConfig);}

    const db = getDatabase();
    
    export default function CadastroFornecedores () {
    const navigate = useNavigate(); // Instância do navigate

    const [formData, setFormData] = useState({cnpj: "", formasPag: "", observacoes: "", razaoSocial: "", endereco: "", numero: "", bairro: "", cep: "", municipio: "", uf: "", pais: "Brasil", complemento: "", contato: "", telefone: "", email: "", grupo: "Mantimentos", status: "Ativo",  });// Status inicial como "Ativo"
  

    const handleInputChange = (e) => {
    const { name, value } = e.target;

      // Valida o CEP para garantir que é um número com 8 dígitos
    if (name === "cep" && /^[0-9]{0,8}$/.test(value)) {
        setFormData((prevData) => ({...prevData,
          [name]: value,
    }));

        // Se o CEP tiver 8 dígitos, tenta buscar o endereço
    if (value.length === 8) {
          fetchAddress(value);
    }
    } else if (name !== "cep") {
        setFormData((prevData) => ({...prevData,
          [name]: value,
        }));
      }
    };

    const fetchAddress = async (cep) => {
    try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) { toast.error("CEP não encontrado.", {
          position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored",
    });
    return;
    }
    setFormData((prevData) => ({
      ...prevData, endereco: data.logradouro || "", bairro: data.bairro || "", municipio: data.localidade || "", uf: data.uf || "",
    })); toast.success("Endereço preenchido automaticamente!", {
          position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored",
        });
      } catch (error) {toast.error("Erro ao buscar o CEP.", {
          position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored",
        });
      }
        };
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Dados enviados:", formData);

      const fornecedoresRef = ref(db, "CadastroFornecedores");

      push(fornecedoresRef, formData)
        .then(() => {
          toast.success("Fornecedor cadastrado com sucesso!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });

          // Limpa os campos
          setFormData({
            cnpj: "",
            razaoSocial: "",
            endereco: "",
            numero: "",
            bairro: "",
            cep: "",
            municipio: "",
            uf: "",
            pais: "Brasil",
            complemento: "",
            contato: "",
            telefone: "",
            email: "",
            observacoes: "",
            formasPag: "",
            grupo: "Mantimentos",
            status: "Ativo",
          });
        })
        .catch((error) => {
          toast.error("Erro ao cadastrar fornecedor: " + error.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
        });
    };


    const handleBack = () => {navigate(-1);}; // Navega para a página anterior
    
    const handleStatusChange = (e) => {setFormData({ ...formData, status: e.target.value,});};

  return (
      <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#0a192f] to-[#1e3a8a] min-h-screen text-white">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-6 text-center animate-fadeIn">Cadastro de Fornecedores</h2>
          <form id="supplier-form" onSubmit={handleSubmit} className="bg-white text-gray-800 p-8 rounded-xl w-full max-w-4xl flex flex-col gap-6 shadow-xl animate-slideIn">
          
            {/* Grupo 1: CNPJ, Razão Social */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Label htmlFor="cnpj" className="text-sm font-semibold text-gray-700">CNPJ:</Label>
                <Input required type="text" id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleInputChange} className="p-5 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"/>
              </div>
              <div className="flex flex-col">
                <Label htmlFor="razaoSocial" className="text-sm font-semibold text-gray-700">Razão Social:</Label>
                <Input required type="text" id="razaoSocial" name="razaoSocial" value={formData.razaoSocial} onChange={handleInputChange} className="p-5 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"/>
              </div>
            </div>

            {/* Grupo 2: CEP, Endereço, Número */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <Label htmlFor="cep" className="text-sm font-semibold text-gray-700">CEP:</Label>
<Input
  type="text"
  id="cep"
  name="cep"
  value={formData.cep}
  onChange={handleInputChange}
  className="p-5 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
/>
              </div>
              <div className="flex flex-col">
                <Label htmlFor="endereco" className="text-sm font-semibold text-gray-700">Endereço:</Label>
                <Input required type="text" id="endereco" name="endereco" value={formData.endereco} onChange={handleInputChange} disabled className="p-5 bg-gray-200 rounded-lg border border-gray-300"/>
              </div>
              <div className="flex flex-col">
                <Label htmlFor="numero" className="text-sm font-semibold text-gray-700">Número:</Label>
                <Input required type="text" id="numero" name="numero" value={formData.numero} onChange={handleInputChange} className="p-5 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"/>
              </div>
            </div>

            {/* Grupo 3: Bairro, Município, UF */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <Label htmlFor="bairro" className="text-sm font-semibold text-gray-700">Bairro:</Label>
                <Input required type="text" id="bairro" name="bairro" value={formData.bairro} onChange={handleInputChange} disabled className="p-5 bg-gray-200 rounded-lg border border-gray-300"/>
              </div>
              <div className="flex flex-col">
                <Label htmlFor="municipio" className="text-sm font-semibold text-gray-700">Município:</Label>
                <Input required type="text" id="municipio" name="municipio" value={formData.municipio} onChange={handleInputChange} disabled className="p-5 bg-gray-200 rounded-lg border border-gray-300"/>
              </div>
              <div className="flex flex-col">
                <Label htmlFor="uf" className="text-sm font-semibold text-gray-700">UF:</Label>
                <Input required type="text" id="uf" name="uf" value={formData.uf} onChange={handleInputChange} disabled className="p-5 bg-gray-200 rounded-lg border border-gray-300"/>
              </div>
            </div>

            {/* Grupo 4: Contato, Telefone, E-mail */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <Label htmlFor="contato" className="text-sm font-semibold text-gray-700">Contato:</Label>
                <Input required type="text" id="contato" name="contato" value={formData.contato} onChange={handleInputChange} className="p-5 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"/>
              </div>
              <div className="flex flex-col">
                <Label htmlFor="telefone" className="text-sm font-semibold text-gray-700">Telefone:</Label>
                <Input required type="text" id="telefone" name="telefone" value={formData.telefone} onChange={handleInputChange} className="p-5 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"/>
              </div>
              <div className="flex flex-col">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">E-mail:</Label>
                <Input required type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="p-5 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"/>
              </div>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Label htmlFor="formasPag" className="text-sm font-semibold text-gray-700">Formas de Pagamentos:</Label>
                <Input  type="text" id="formasPag" name="formasPag" value={formData.formasPag} onChange={handleInputChange} className="p-5 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"/>
              </div>
              <div className="flex flex-col">
                <Label htmlFor="observacoes" className="text-sm font-semibold text-gray-700">Observações:</Label>
                <Input  type="text" id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleInputChange} className="p-5 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"/>
              </div>
            </div>

            {/* Grupo 5: Grupo, Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Label htmlFor="grupo" className="text-sm font-semibold text-gray-700">Categoria:</Label>
                <select id="grupo" name="grupo" value={formData.grupo} onChange={handleInputChange} className="p-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                  <option value="Selecionar Catergoria">Selecionar Catergoria do Fornecedor</option>
                  <option value="Proteina">Proteina</option>
                  <option value="Mantimento">Mantimento</option>
                  <option value="Hortifrut">Hortifrut</option>
                  <option value="Doações">Doações</option>
                  <option value="Produtos de Limpeza">Produtos de Limpeza</option>
                </select>
              </div>
              <div className="flex flex-col">
                <Label htmlFor="status" className="text-sm font-semibold text-gray-700">Status:</Label>
                <select id="status" name="status" value={formData.status} onChange={handleStatusChange} className="p-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-4 mt-6">
              <button type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md">
                Cadastrar</button>

              <button type="button" onClick={handleBack} className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md">
                Voltar
              </button>
            </div>
          </form>

    <ToastContainer />
  </div>
  );
};

// import * as XLSX from "xlsx";
// import { getDatabase, ref, push } from "firebase/database";
// import { toast } from "react-toastify";

// function UploadPlanilha() {
//   const db = getDatabase();

//   // Função para normalizar cabeçalhos da planilha
//   const normalizeKey = (key) =>
//     key
//       .toLowerCase()
//       .normalize("NFD")
//       .replace(/[\u0300-\u036f]/g, "") // remove acentos
//       .replace(/\s+/g, ""); // remove espaços

//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();

//     reader.onload = async (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: "array" });

//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
//       const jsonData = XLSX.utils.sheet_to_json(sheet);

//       if (!jsonData.length) {
//         toast.error("A planilha está vazia ou mal formatada.");
//         return;
//       }

//       try {
//         const fornecedoresRef = ref(db, "CadastroFornecedores");

//         for (const rawItem of jsonData) {
//           // Normaliza as chaves da planilha (ex: "Razão Social" → "razaosocial")
//           const item = {};
//           for (const key in rawItem) {
//             item[normalizeKey(key)] = rawItem[key];
//           }

//           // Criação do objeto final para salvar
//           const fornecedor = {
//             cnpj: String(item.cnpj || "").padStart(14, "0"),
//             razaosocial: String(item.razaosocial || ""),
//             endereco: String(item.endereco || ""),
//             numero: String(item.numero || ""),
//             bairro: String(item.bairro || ""),
//             cep: String(item.cep || "").padStart(8, "0"),
//             municipio: String(item.municipio || ""),
//             uf: String(item.uf || ""),
//             pais: String(item.pais || "Brasil"),
//             complemento: String(item.complemento || ""),
//             contato: String(item.contato || ""),
//             telefone: String(item.telefone || ""),
//             email: String(item.email || ""),
//             observacoes: String(item.observacoes || ""),
//             formaspag: String(item.formaspag || ""),
//             grupo: String(item.grupo || "Mantimentos"),
//             status: String(item.status || "Ativo"),
//           };

//           await push(fornecedoresRef, fornecedor);
//         }

//         toast.success("Planilha importada com sucesso!");
//       } catch (error) {
//         console.error("Erro ao importar:", error);
//         toast.error("Erro ao importar a planilha.");
//       }
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   return (
//     <div className="mb-8 w-full max-w-4xl bg-white p-4 rounded-lg shadow-md">
//       <label className="block font-medium mb-2 text-gray-700">
//         Importar Fornecedores (Excel):
//       </label>
//       <input
//         type="file"
//         accept=".xlsx, .xls, .csv"
//         onChange={handleFileUpload}
//         className="block w-full text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
//       />
//       <p className="mt-2 text-xs text-gray-500">
//         A primeira aba da planilha será usada. Os nomes das colunas devem ser consistentes.
//       </p>
//     </div>
//   );
// }

// export default UploadPlanilha;
