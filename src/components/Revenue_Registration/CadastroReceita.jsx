import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, push, update } from "firebase/database";
import { useEffect, useState } from "react";
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
const auth = getAuth(app);
const database = getDatabase(app);

export default function CadastroRefeicoes() {
  // Definindo estado para o campo de data de refeição
  const [formData, setFormData] = useState({
    dataRefeicao: "", // Define a data atual
    cafeDescricao: "", cafeTotalQtd: "",cafeFuncionariosQtd: "",cafeJovensQtd: "",almocoDescricao: "",almocoTotalQtd: "", almocoFuncionariosQtd: "",almocoJovensQtd: "", lancheDescricao: "",lancheTotalQtd: "", lancheFuncionariosQtd: "", lancheJovensQtd: "", outrasDescricao: "",outrasTotalQtd: "", outrasFuncionariosQtd: "", outrasJovensQtd: "", sobrasDescricao: "", observacaoDescricao: "", desperdicioQtd: "",
  });

  const [refeicoes, setRefeicoes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const refeicoesRef = ref(database, "refeicoesServidas");

    get(refeicoesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const refeicoesData = [];
          snapshot.forEach((childSnapshot) => {
            refeicoesData.push({
              key: childSnapshot.key,
              ...childSnapshot.val(),
            });
          });
          setRefeicoes(refeicoesData);
        } else {
          console.log("Nenhuma refeição encontrada");
        }
      })
      .catch((error) => {
        console.error("Erro ao ler dados do Firebase:", error);
      });
  }, []);

  const calcularTotal = (total, funcionarios, jovens = 0) => {
    return Math.max(0, total - funcionarios - jovens);
  };


  const handleChange = (e) => {
    const { id, value } = e.target;

    // Verifica se o campo é uma descrição e atualiza o valor
    if (id.includes("Descricao")) {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    } else {
      const valorNumerico = parseInt(value) || 0;

      // Atualiza os campos numéricos com o valor calculado
      setFormData((prev) => {
        const novoEstado = { ...prev, [id]: valorNumerico };
    
        // Cálculo correto para jovens tarde
        if (id === "cafeTotalQtd" || id === "cafeFuncionariosQtd") {
          novoEstado.cafeJovensQtd = calcularTotal(
            novoEstado.cafeTotalQtd || 0,
            novoEstado.cafeFuncionariosQtd || 0
          );
        
    
  
        } else if (
          id === "almocoTotalQtd" ||
          id === "almocoFuncionariosQtd" ||
          id === "almocoJovensQtd"
        ) {
          novoEstado.almocoJovensTardeQtd = calcularTotal(
            novoEstado.almocoTotalQtd || 0,
            novoEstado.almocoFuncionariosQtd || 0,
            novoEstado.almocoJovensQtd || 0
          );
        } else if (
          id === "lancheTotalQtd" ||
          id === "lancheFuncionariosQtd" 
        ) {
          novoEstado.lancheJovensQtd = calcularTotal(
            novoEstado.lancheTotalQtd || 0,
            novoEstado.lancheFuncionariosQtd || 0,
          );
        } else if (
          id === "outrasTotalQtd" ||
          id === "outrasFuncionariosQtd" ||
          id === "outrasJovensQtd"
        ) {
          novoEstado.outrasJovensTardeQtd = calcularTotal(
            novoEstado.outrasTotalQtd || 0,
            novoEstado.outrasFuncionariosQtd || 0,
            novoEstado.outrasJovensQtd || 0
          );
        }

        return novoEstado;
      });
    }
  };

  // Atualizando a função handleChange para capturar a data manualmente
  const handleDateChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      dataRefeicao: e.target.value, // Aqui a data é capturada diretamente do input
    }));
  };

  const handleBack = () => {
    navigate(-1); // Navega para a página anterior
  };

  const salvarNoBanco = () => {
    const refeicaoData = {
      dataRefeicao: formData.dataRefeicao,
      cafeDescricao: formData.cafeDescricao,
      cafeTotalQtd: formData.cafeTotalQtd,
      cafeFuncionariosQtd: formData.cafeFuncionariosQtd,
      cafeJovensQtd: formData.cafeJovensQtd,
      almocoDescricao: formData.almocoDescricao,
      almocoTotalQtd: formData.almocoTotalQtd,
      almocoFuncionariosQtd: formData.almocoFuncionariosQtd,
      almocoJovensQtd: formData.almocoJovensQtd,
      almocoJovensTardeQtd: formData.almocoJovensTardeQtd,
      lancheDescricao: formData.lancheDescricao,
      lancheTotalQtd: formData.lancheTotalQtd,
      lancheFuncionariosQtd: formData.lancheFuncionariosQtd,
      lancheJovensQtd: formData.lancheJovensQtd,
      outrasDescricao: formData.outrasDescricao,
      outrasTotalQtd: formData.outrasTotalQtd,
      outrasFuncionariosQtd: formData.outrasFuncionariosQtd,
      outrasJovensQtd: formData.outrasJovensQtd,
      outrasJovensTardeQtd: formData.outrasJovensTardeQtd,
      sobrasDescricao: formData.sobrasDescricao,
      observacaoDescricao: formData.observacaoDescricao,
      desperdicioQtd: formData.desperdicioQtd,
    };

    const newRefeicaoKey = push(ref(database, "refeicoesServidas")).key;

    const updates = {};
    updates[`/refeicoesServidas/${newRefeicaoKey}`] = refeicaoData;

    update(ref(database), updates)
      .then(() => {
        toast.success("Refeições salvas com sucesso!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        setFormData({
          dataRefeicao: "",
          cafeDescricao: "",
          cafeTotalQtd: "",
          cafeFuncionariosQtd: "",
          cafeJovensQtd: "",
          almocoDescricao: "",
          almocoTotalQtd: "",
          almocoFuncionariosQtd: "",
          almocoJovensQtd: "",
          almocoJovensTardeQtd: "",
          lancheDescricao: "",
          lancheTotalQtd: "",
          lancheFuncionariosQtd: "",
          lancheJovensQtd: "",
          outrasDescricao: "",
          outrasTotalQtd: "",
          outrasFuncionariosQtd: "",
          outrasJovensQtd: "",
          outrasJovensTardeQtd: "",
          sobrasDescricao: "",
          observacaoDescricao: "",
          desperdicioQtd: "",
        });
      })
      .catch((error) => {
        console.error("Erro ao salvar refeição:", error);
        toast.error("Erro ao salvar refeição. Tente novamente.", {
          position: "top-right",
          autoClose: 3000,
          closeOnClick: true,
          hideProgressBar: false,
          pauseOnHover: true,
          draggable: true,
          transition: "fade",
        });
      });
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        height: "auto",
      }}
    >
      <h2
        style={{
          color: "white",
          fontSize: "2.2rem",
          textAlign: "center",
          marginBottom: "1.5rem",
        }}
      >
        Cadastro de Refeições
      </h2>

      <section
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <button
            type="button"
            onClick={handleBack}
            style={{
              padding: "10px 20px",
              backgroundColor: "#F20DE7",
              color: "white",
              borderRadius: "5px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              marginBottom: "20px",
              width: "100%",
              transition: "background 0.3s ease",
            }}
          >
            Voltar
          </button>
          <label style={{ fontSize: "18px", fontWeight: "bold" }}>
            Data da Refeição
          </label>
          <input
            type="date"
            id="dataRefeicao"
            value={formData.dataRefeicao}
            onChange={handleDateChange} // Chamando a função de atualização de data
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
        </div>

        {/* Café da Manhã */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "#333", fontSize: "20px" }}>Café da Manhã</h3>
          <textarea
            id="cafeDescricao"
            value={formData.cafeDescricao}
            onChange={handleChange}
            placeholder="Descrição..."
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              height: "150px", // Altura inicial fixa
              resize: "vertical", // Permite redimensionar apenas na vertical
              overflowY: "auto", // Adiciona rolagem quando necessário
            }}
          />
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
          >
            <label
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              Total:
            </label>
            <input
              type="number"
              id="cafeTotalQtd"
              value={formData.cafeTotalQtd}
              onChange={handleChange}
              style={{
                padding: "12px",
                fontSize: "1rem",
                width: "40%",
                marginRight: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            />
            <label
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              Funcionários:
            </label>
            <input
              type="number"
              id="cafeFuncionariosQtd"
              value={formData.cafeFuncionariosQtd}
              onChange={handleChange}
              style={{
                padding: "12px",
                fontSize: "1rem",
                width: "40%",
                marginRight: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <label
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              Jovens Manhã:
            </label>
            <input
              type="number"
              id="cafeJovensQtd"
              value={formData.cafeJovensQtd}
              onChange={handleChange}
              style={{
                padding: "12px",
                fontSize: "1rem",
                width: "100%",
                marginRight: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              disabled
            />
          </div>
        </div>

        {/* Almoço */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "#333", fontSize: "20px" }}>Almoço</h3>
          <textarea
            id="almocoDescricao"
            value={formData.almocoDescricao}
            onChange={handleChange}
            placeholder="Descrição..."
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              height: "150px", // Altura inicial fixa
              resize: "vertical", // Permite redimensionar apenas na vertical
              overflowY: "auto", // Adiciona rolagem quando necessário
            }}
          />
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
          >
            <label
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              Total:
            </label>
            <input
              type="number"
              id="almocoTotalQtd"
              value={formData.almocoTotalQtd}
              onChange={handleChange}
              style={{
                padding: "12px",
                fontSize: "1rem",
                width: "40%",
                marginRight: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            />
            <label
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              Funcionários:
            </label>
            <input
              type="number"
              id="almocoFuncionariosQtd"
              value={formData.almocoFuncionariosQtd}
              onChange={handleChange}
              style={{
                padding: "12px",
                fontSize: "1rem",
                width: "40%",
                marginRight: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <label
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              Jovens Manhã:
            </label>
            <input
              type="number"
              id="almocoJovensQtd"
              value={formData.almocoJovensQtd}
              onChange={handleChange}
              style={{
                padding: "12px",
                fontSize: "1rem",
                width: "100%",
                marginRight: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <label
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              Jovens Tarde:
            </label>
            <input
              type="number"
              id="almocoJovensTardeQtd"
              value={formData.almocoJovensTardeQtd}
              onChange={handleChange}
              style={{
                padding: "12px",
                fontSize: "1rem",
                width: "100%",
                marginRight: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              disabled
            />
          </div>
        </div>

        {/* Lanche da Tarde */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "#333", fontSize: "20px" }}>Lanche da Tarde</h3>
          <textarea
            id="lancheDescricao"
            value={formData.lancheDescricao}
            onChange={handleChange}
            placeholder="Descrição..."
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
          >
            <label
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              Total:
            </label>
            <input
              type="number"
              id="lancheTotalQtd"
              value={formData.lancheTotalQtd}
              onChange={handleChange}
              style={{
                padding: "12px",
                fontSize: "1rem",
                width: "40%",
                marginRight: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            />
            <label
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              Funcionários:
            </label>
            <input
              type="number"
              id="lancheFuncionariosQtd"
              value={formData.lancheFuncionariosQtd}
              onChange={handleChange}
              style={{
                padding: "12px",
                fontSize: "1rem",
                width: "40%",
                marginRight: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <label
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              Jovens Tarde:
            </label>
            <input
              type="number"
              id="lancheJovensQtd"
              value={formData.lancheJovensQtd}
              onChange={handleChange}
              style={{
                padding: "12px",
                fontSize: "1rem",
                width: "100%",
                marginRight: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              disabled
            />
          </div>
        </div>
        {/* Outras Refeições */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "#333", fontSize: "20px" }}>Outras Refeições</h3>
          <textarea
            id="outrasDescricao"
            value={formData.outrasDescricao}
            onChange={handleChange}
            placeholder="Descrição..."
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
          >
            <label
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              Total:
            </label>
            <input
              type="number"
              id="outrasTotalQtd"
              value={formData.outrasTotalQtd}
              onChange={handleChange}
              style={{
                padding: "12px",
                fontSize: "1rem",
                width: "40%",
                marginRight: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            />
            <label
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              Funcionários:
            </label>
            <input
              type="number"
              id="outrasFuncionariosQtd"
              value={formData.outrasFuncionariosQtd}
              onChange={handleChange}
              style={{
                padding: "12px",
                fontSize: "1rem",
                width: "40%",
                marginRight: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <label
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              Jovens Manhã:
            </label>
            <input
              type="number"
              id="outrasJovensQtd"
              value={formData.outrasJovensQtd}
              onChange={handleChange}
              style={{
                padding: "12px",
                fontSize: "1rem",
                width: "100%",
                marginRight: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <label
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              Jovens Tarde:
            </label>
            <input
              type="number"
              id="outrasJovensTardeQtd"
              value={formData.outrasJovensTardeQtd}
              onChange={handleChange}
              style={{
                padding: "12px",
                fontSize: "1rem",
                width: "100%",
                marginRight: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              disabled
            />
          </div>
        </div>
        {/* Sobras */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "#333", fontSize: "20px" }}>Sobras</h3>
          <textarea
            id="sobrasDescricao"
            value={formData.sobrasDescricao}
            onChange={handleChange}
            placeholder="Descrição..."
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        {/* Observações */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "#333", fontSize: "20px" }}>Observações</h3>
          <textarea
            id="observacaoDescricao"
            value={formData.observacaoDescricao}
            onChange={handleChange}
            placeholder="Descrição..."
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        {/* Disperdícios */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "#333", fontSize: "20px" }}>Disperdícios</h3>
          <input
            type="number"
            id="desperdicioQtd"
            value={formData.desperdicioQtd}
            placeholder="KG"
            onChange={handleChange}
            style={{
              padding: "12px",
              fontSize: "1rem",
              width: "100%",
              marginRight: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        <button
          onClick={salvarNoBanco}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2575fc",
            color: "white",
            borderRadius: "5px",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "20px",
            width: "100%",
          }}
        >
          {" "}
          Salvar
        </button>
      </section>
      <ToastContainer />
    </div>
  );
}
