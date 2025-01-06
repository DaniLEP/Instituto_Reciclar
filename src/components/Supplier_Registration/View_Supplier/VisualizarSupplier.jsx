import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove, update } from "firebase/database";
import { initializeApp, getApps } from "firebase/app";
import { useNavigate } from "react-router-dom"; // Alteração: useNavigate ao invés de useHistory
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
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate(); // Definindo o hook de navegação

  useEffect(() => {
    const fornecedoresRef = ref(db, "CadastroFornecedores");
    onValue(fornecedoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fornecedoresList = Object.keys(data).map((key) => ({
          ...data[key],
          id: key, // Adiciona o ID para facilitar a edição e exclusão
        }));
        setFornecedores(fornecedoresList);
      }
    });
  }, []);

  const handleEdit = (id) => {
    const fornecedor = fornecedores.find((f) => f.id === id);
    setEditData(fornecedor);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    const fornecedorRef = ref(db, `CadastroFornecedores/${id}`);
    remove(fornecedorRef)
      .then(() => {
        toast.success("Fornecedor excluído com sucesso!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      })
      .catch((error) => {
        toast.error("Erro ao excluir fornecedor: " + error.message, {
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

  const handleSaveEdit = () => {
    if (editData) {
      const fornecedorRef = ref(db, `CadastroFornecedores/${editData.id}`);
      update(fornecedorRef, editData)
        .then(() => {
          toast.success("Fornecedor atualizado com sucesso!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
          setIsEditing(false);
          setEditData(null);
        })
        .catch((error) => {
          toast.error("Erro ao atualizar fornecedor: " + error.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGoBack = () => {
    navigate('/Cadastro'); // Voltar para a página anterior
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        background: "linear-gradient(to bottom, #1E90FF, #00009C)",
        minHeight: "100vh",
        color: "white",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          fontSize: "2.5rem",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Fornecedores Cadastrados
      </h2>

      {/* Botão de Voltar */}
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

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          backgroundColor: "white",
          color: "#333",
          padding: "20px",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "1000px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          boxSizing: "border-box",
        }}
      >
        {fornecedores.length > 0 ? (
          fornecedores.map((fornecedor, index) => (
            <div
              key={index}
              style={{
                background: "#f9f9f9",
                borderRadius: "10px",
                padding: "15px",
                width: "250px", // Largura fixa para cada fornecedor
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                transition: "transform 0.3s",
              }}
            >
              <h4 style={{ margin: "10px 0", fontSize: "1.2rem", textAlign: "center" }}>
                {fornecedor.razaoSocial}
              </h4>
              <p><strong>CNPJ:</strong> {fornecedor.cnpj}</p>
              <p><strong>Contato:</strong> {fornecedor.contato}</p>
              <p><strong>Telefone:</strong> {fornecedor.telefone}</p>
              <p><strong>E-mail:</strong> {fornecedor.email}</p>
              <div>
                <button
                  onClick={() => handleEdit(fornecedor.id)}
                  style={{
                    padding: "8px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(fornecedor.id)}
                  style={{
                    padding: "8px",
                    backgroundColor: "#F44336",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>Nenhum fornecedor cadastrado.</p>
        )}
      </div>

      {/* Modal de Edição */}
      {isEditing && editData && (
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
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "90%",
              maxWidth: "600px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
            }}
          >
            <h3 style={{ textAlign: "center", marginBottom: "15px", color: "black" }}>
              Editar Fornecedor
            </h3>
            {[{ label: "CNPJ", name: "cnpj" }, { label: "Razão Social", name: "razaoSocial" }, { label: "Contato", name: "contato" }, { label: "Telefone", name: "telefone" }, { label: "E-mail", name: "email" }].map((field) => (
              <div key={field.name} style={{ marginBottom: "15px", display: "flex", flexDirection: "column", color: 'black' }}>
                <label htmlFor={field.name} style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                  {field.label}:
                </label>
                <input
                  type="text"
                  id={field.name}
                  name={field.name}
                  value={editData[field.name]}
                  onChange={handleInputChange}
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                  }}
                />
              </div>
            ))}
            <button
              onClick={handleSaveEdit}
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
                width: "100%",
              }}
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default TabelaFornecedores;
