import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove, update } from "firebase/database";
import { initializeApp, getApps } from "firebase/app";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

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

const TabelaFornecedores = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [filteredFornecedores, setFilteredFornecedores] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFornecedor, setSelectedFornecedor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [cep, setCep] = useState(""); // Estado para o CEP
  const navigate = useNavigate();

  useEffect(() => {
    const fornecedoresRef = ref(db, "CadastroFornecedores");
    onValue(fornecedoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fornecedoresList = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
        setFornecedores(fornecedoresList);
        setFilteredFornecedores(fornecedoresList); // Inicializa com todos os fornecedores
      }
    });
  }, []);

  const handleShowDetails = (fornecedor) => {
    setSelectedFornecedor(fornecedor);
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setSelectedFornecedor(null);
  };

  const handleDelete = (id) => {
    const fornecedorRef = ref(db, `CadastroFornecedores/${id}`);
    remove(fornecedorRef)
      .then(() => {
        toast.success("Fornecedor excluído com sucesso!");
        setSelectedFornecedor(null);
      })
      .catch((error) =>
        toast.error("Erro ao excluir fornecedor: " + error.message)
      );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedFornecedor((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveEdit = () => {
    if (selectedFornecedor) {
      const fornecedorRef = ref(db, `CadastroFornecedores/${selectedFornecedor.id}`);
      update(fornecedorRef, selectedFornecedor)
        .then(() => {
          toast.success("Fornecedor atualizado com sucesso!");
          setIsEditing(false);
        })
        .catch((error) =>
          toast.error("Erro ao atualizar fornecedor: " + error.message)
        );
    }
  };

  const handleGoBack = () => {
    navigate("/Cadastro");
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = fornecedores.filter((fornecedor) =>
      fornecedor.razaoSocial.toLowerCase().includes(query) ||
      fornecedor.cnpj.toLowerCase().includes(query) ||
      fornecedor.grupo.toLowerCase().includes(query)
    );
    setFilteredFornecedores(filtered);
  };

  const toggleStatus = (id, currentStatus) => {
    const fornecedorRef = ref(db, `CadastroFornecedores/${id}`);
    update(fornecedorRef, { ativo: !currentStatus })
      .then(() => {
        toast.success(`Status atualizado para ${!currentStatus ? 'Ativo' : 'Inativo'}`);
      })
      .catch((error) => toast.error("Erro ao atualizar status: " + error.message));
  };

  const handleCepChange = async (e) => {
    const cepValue = e.target.value;
    setCep(cepValue); // Atualiza o estado do CEP

    if (cepValue.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
        const data = await response.json();

        if (data.erro) {
          toast.error("CEP não encontrado.");
          return;
        }

        setSelectedFornecedor((prevData) => ({
          ...prevData,
          endereco: data.logradouro || "",
          bairro: data.bairro || "",
          municipio: data.localidade || "",
          uf: data.uf || "",
        }));

        toast.success("Endereço preenchido automaticamente!");
      } catch (error) {
        toast.error("Erro ao buscar o CEP.");
      }
    }
  };

  const formatCNPJ = (value) => {
    return value
      .replace(/\D/g, '') // Remove tudo o que não for número
      .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  const formatTelefone = (value) => {
    return value
      .replace(/\D/g, '') // Remove tudo o que não for número
      .replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  };

  const formatCEP = (value) => {
    return value
      .replace(/\D/g, '') // Remove tudo o que não for número
      .replace(/^(\d{5})(\d{3})$/, '$1-$2');
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
        color: "black",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "white" }}>
        Fornecedores Cadastrados
      </h2>

      <button
        onClick={handleGoBack}
        style={{
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#FF6347",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        Voltar
      </button>

      <input
        type="text"
        placeholder="Buscar por Razão Social, CNPJ ou Grupo"
        value={searchQuery}
        onChange={handleSearchChange}
        style={{
          width: "300px",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          marginBottom: "20px",
        }}
      />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        {filteredFornecedores.length > 0 ? (
          filteredFornecedores.map((fornecedor) => (
            <div
              key={fornecedor.id}
              style={{
                background: "#f9f9f9",
                borderRadius: "10px",
                padding: "15px",
                width: "100%",
                maxWidth: "350px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => handleShowDetails(fornecedor)}
            >
              <h4 style={{ margin: "10px 0", fontSize: "1.2rem" }}>
                {fornecedor.razaoSocial}
              </h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  onClick={() => handleShowDetails(fornecedor)}
                  style={{
                    marginRight: "10px",
                    color: "#00009C",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                  }}
                >
                  Detalhes
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Evita o fechamento do modal ao clicar no botão
                    toggleStatus(fornecedor.id, fornecedor.ativo);
                  }}
                  style={{
                    backgroundColor: fornecedor.ativo ? "#28a745" : "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "8px 15px",
                    cursor: "pointer",
                  }}
                >
                  {fornecedor.ativo ? "Ativo" : "Inativo"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>
            Nenhum fornecedor encontrado.
          </p>
        )}
      </div>{selectedFornecedor && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
    onClick={handleCloseModal}
  >
    <div
      style={{
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "10px",
        width: "500px",
        maxWidth: "100%",
        maxHeight: "80vh", // Limita a altura do modal para 80% da altura da tela
        overflowY: "auto", // Adiciona scroll vertical caso o conteúdo ultrapasse o tamanho do modal
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <h3>Editar Fornecedor</h3>
      <div>
              <label>Razão Social:</label>
              <input
                type="text"
                name="razaoSocial"
                value={selectedFornecedor.razaoSocial}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              />
            </div>
            <div>
              <label>CNPJ:</label>
              <input
                type="text"
                name="cnpj"
                value={formatCNPJ(selectedFornecedor.cnpj)}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              />
            </div>
            <div>
              <label>Categoria:</label>
              <input
                type="text"
                name="grupo"
                value={selectedFornecedor.grupo}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              />
            </div>
            <div>
              <label>CEP:</label>
              <input
                type="text"
                name="cep"
                value={formatCEP(cep)}
                onChange={handleCepChange}
                maxLength="9"
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              />
            </div>
            <div>
              <label>Endereço:</label>
              <input
                type="text"
                name="endereco"
                value={selectedFornecedor.endereco || ""}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              />
            </div>
            <div>
              <label>Número:</label>
              <input
                type="number"
                name="numero"
                value={selectedFornecedor.numero || ""}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              />
            </div>
            <div>
              <label>Completo:</label>
              <input
                type="text"
                name="complemento"
                value={selectedFornecedor.complemento || ""}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              />
            </div>
            <div>
              <label>Bairro:</label>
              <input
                type="text"
                name="bairro"
                value={selectedFornecedor.bairro || ""}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              />
            </div>
            <div>
              <label>Município:</label>
              <input
                type="text"
                name="municipio"
                value={selectedFornecedor.municipio || ""}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              />
            </div>
            <div>
              <label>UF:</label>
              <input
                type="text"
                name="uf"
                value={selectedFornecedor.uf || ""}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              />
            </div>
            <div>
              <label>País:</label>
              <input
                type="text"
                name="pais"
                value={selectedFornecedor.pais || ""}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              />
            </div>
            <div>
              <label>Contato:</label>
              <input
                type="text"
                name="contato"
                value={selectedFornecedor.contato || ""}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              />
            </div>
            <div>
              <label>Telefone:</label>
              <input
                type="number"
                name="telefone"
                value={selectedFornecedor.telefone || ""}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              />
            </div>
            <div>
              <label>E-mail:</label>
              <input
                type="email"
                name="email"
                value={selectedFornecedor.email || ""}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              />
            </div>
            <div>
              <label>Grupo:</label>
              <input
                type="text"
                name="grupo"
                value={selectedFornecedor.grupo || ""}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              />
            </div>
      <button
        onClick={handleSaveEdit}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Salvar Alterações
      </button>
      <button
        onClick={handleCloseModal}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Fechar
      </button>
    </div>
  </div>
)}
      <ToastContainer />
    </div>
  );
};

export default TabelaFornecedores;
