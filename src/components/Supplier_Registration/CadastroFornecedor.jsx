import { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { initializeApp, getApps } from "firebase/app";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.appspot.com",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const db = getDatabase();

const CadastroFornecedores = () => {
  const navigate = useNavigate(); // Instância do navigate

  const [formData, setFormData] = useState({
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
    grupo: "Mantimentos",
    status: "Ativo", // Status inicial como "Ativo"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Valida o CEP para garantir que é um número com 8 dígitos
    if (name === "cep" && /^[0-9]{0,8}$/.test(value)) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
  
      // Se o CEP tiver 8 dígitos, tenta buscar o endereço
      if (value.length === 8) {
        fetchAddress(value);
      }
    } else if (name !== "cep") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const fetchAddress = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        endereco: data.logradouro || "",
        bairro: data.bairro || "",
        municipio: data.localidade || "",
        uf: data.uf || "",
      }));

      toast.success("Endereço preenchido automaticamente!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } catch (error) {
      toast.error("Erro ao buscar o CEP.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
          grupo: "Mantimentos",
          status: "Ativo", // Retorna o status para "Ativo" após o cadastro
        });
      })
      .catch((error) =>
        toast.error("Erro ao cadastrar fornecedor: " + error.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        })
      );
  };

  const handleBack = () => {
    navigate(-1); // Navega para a página anterior
  };

  const handleStatusChange = (e) => {
    setFormData({
      ...formData,
      status: e.target.value,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h2
        style={{
          fontSize: "2.5rem",
          marginBottom: "20px",
          textAlign: "center",
          animation: "fadeIn 1s ease-in-out",
        }}
      >
        Cadastro de Fornecedores
      </h2>
      <form
        id="supplier-form"
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "white",
          color: "#333",
          padding: "30px",
          borderRadius: "10px",
          width: "90%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          animation: "slideIn 1s ease-in-out",
        }}
      >
        {[ 
          { label: "CNPJ", name: "cnpj" },
          { label: "Razão Social", name: "razaoSocial" },
          { label: "CEP", name: "cep" },
          { label: "Endereço", name: "endereco" },
          { label: "Número", name: "numero" },
          { label: "Complemento", name: "complemento" },
          { label: "Bairro", name: "bairro" },
          { label: "Município", name: "municipio" },
          { label: "UF", name: "uf" },
          { label: "País", name: "pais" },
          { label: "Contato", name: "contato" },
          { label: "Telefone", name: "telefone" },
          { label: "E-mail", name: "email" },
          { label: "Grupo", name: "grupo" },
          { label: "Status", name: "status" },  // Campo de status
        ].map((field) => (
          <div key={field.name} style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor={field.name} style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
              {field.label}:
            </label>
            {field.name === "status" ? (
              <select
                id={field.name}
                name={field.name}
                value={formData.status}
                onChange={handleStatusChange}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                }}
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            ) : (
              <input
                type={field.name === "cep" ? "number" : "text"}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleInputChange}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                }}
                disabled={
                  ["endereco", "bairro", "municipio", "uf"].includes(field.name) &&
                  field.name !== "cep"
                }
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          style={{
            padding: "12px",
            background: "#2196F3",
            color: "white",
            fontWeight: "bold",
            fontSize: "1rem",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background 0.3s ease",
          }}
        >
          Cadastrar
        </button>
        <button
          type="button"
          onClick={handleBack}
          style={{
            padding: "12px",
            background: "#F20DE7",
            color: "white",
            fontWeight: "bold",
            fontSize: "1rem",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background 0.3s ease",
          }}
        >
          Voltar
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CadastroFornecedores;


