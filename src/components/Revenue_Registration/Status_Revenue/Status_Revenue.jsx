import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update } from "firebase/database";
import * as XLSX from "xlsx";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

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
const database = getDatabase(app);

export default function TabelaRefeicoes() {
  const [refeicoes, setRefeicoes] = useState([]);
  const [editMode, setEditMode] = useState(null); // Para controlar a célula editável
  const [editValue, setEditValue] = useState(""); // Para armazenar o valor editado
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // Carregar dados do Firebase
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
      .catch((error) => console.error("Erro ao carregar dados:", error));
  }, []);

  // Notificações estilizadas com Toastify
  const showNotification = (message, type) => {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top", // 'top' ou 'bottom'
      position: "right", // 'left', 'center' ou 'right'
      backgroundColor:
        type === "success"
          ? "#4caf50"
          : type === "error"
          ? "#f44336"
          : "#2196f3",
      stopOnFocus: true,
    }).showToast();
  };

  // Filtro de datas
  const handleFilter = () => {
    const filteredRefeicoes = refeicoes.filter((refeicao) => {
      const dataRefeicao = new Date(refeicao.dataRefeicao);
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      return dataRefeicao >= inicio && dataRefeicao <= fim;
    });
    setRefeicoes(filteredRefeicoes);
  };

  // Limpar filtro
  const handleClearFilter = () => {
    setDataInicio("");
    setDataFim("");
    window.location.reload(); // Recarrega os dados originais
  };

  // Salvar alterações no Firebase
  const handleSave = (key, field) => {
    if (editValue.trim() === "") {
      showNotification("O valor não pode estar vazio!", "error");
      return;
    }

    const fieldRef = ref(database, `refeicoesServidas/${key}`);
    update(fieldRef, { [field]: editValue })
      .then(() => {
        setRefeicoes((prevRefeicoes) =>
          prevRefeicoes.map((refeicao) =>
            refeicao.key === key
              ? { ...refeicao, [field]: editValue }
              : refeicao
          )
        );
        setEditMode(null);
        setEditValue("");
        showNotification("Atualizado com sucesso!", "success");
      })
      .catch((error) => {
        console.error("Erro ao atualizar dados:", error);
        showNotification("Erro ao atualizar dados!", "error");
      });
  };

  // Exportar para Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(refeicoes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Refeições");
    XLSX.writeFile(workbook, "Refeicoes.xlsx");
  };

  // Voltar para a tela anterior
  const handleBack = () => {
    window.history.back();
  };

  // Função para editar a célula
  const handleEdit = (key, field, value) => {
    setEditMode({ key, field });
    setEditValue(value);
  };

  // Função para lidar com a mudança do valor editado
  const handleChange = (e) => {
    setEditValue(e.target.value);
  };

  return (
    <>
      <div
        style={{
          background: "linear-gradient(135deg, #6a11cb, #2575fc)",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          height: "auto",
        }}
      >
        <div style={styles.container}>
          <button onClick={handleBack} style={styles.backButton}>
            Voltar
          </button>
          <h2 style={styles.title}>Refeições Cadastradas</h2>

          <div style={styles.filterContainer}>
            <label style={styles.filterLabel}>
              Data Início:
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                style={styles.input}
              />
            </label>
            <label style={styles.filterLabel}>
              Data Fim:
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                style={styles.input}
              />
            </label>
            <div style={styles.filterButtons}>
              <button onClick={handleFilter} style={styles.button}>
                Filtrar
              </button>
              <button onClick={handleClearFilter} style={styles.button}>
                Limpar Filtro
              </button>
            </div>
          </div>

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {[
                    "Data",
                    "Café",
                    "Café Total",
                    "Café Funcionários",
                    "Café Jovens",
                    "Almoço",
                    "Almoço Total",
                    "Almoço Funcionários",
                    "Almoço Jovens",
                    "Lanche",
                    "Lanche Total",
                    "Lanche Funcionários",
                    "Lanche Jovens",
                    "Outras",
                    "Outras Total",
                    "Outras Funcionários",
                    "Outras Jovens",
                    "Sobras",
                    "Observação",
                    "Desperdícios",
                  ].map((header) => (
                    <th key={header} style={styles.th}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {refeicoes.map((refeicao) => (
                  <tr key={refeicao.key}>
                    {[
                      "dataRefeicao",
                      "cafeDescricao",
                      "cafeTotalQtd",
                      "cafeFuncionariosQtd",
                      "cafeJovensQtd",
                      "almocoDescricao",
                      "almocoTotalQtd",
                      "almocoFuncionariosQtd",
                      "almocoJovensQtd",
                      "lancheDescricao",
                      "lancheTotalQtd",
                      "lancheFuncionariosQtd",
                      "lancheJovensQtd",
                      "outrasDescricao",
                      "outrasTotalQtd",
                      "outrasFuncionariosQtd",
                      "outrasJovensQtd",
                      "sobrasDescricao",
                      "observacaoDescricao",
                      "desperdicioQtd",
                    ].map((field) => (
                      <td key={field} style={styles.td}>
                        {field === "dataRefeicao"
                          ? new Date(refeicao[field]).toLocaleDateString(
                              "pt-BR"
                            )
                          : refeicao[field] || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={exportToExcel} style={styles.exportButton}>
            Exportar para Excel
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
    color: "#333",
  },
  title: {
    textAlign: "center",
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#2c3e50",
  },
  backButton: {
    padding: "12px 24px",
    backgroundColor: "#ff5733",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "20px",
    transition: "background-color 0.3s ease",
  },
  filterContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
    padding: "10px 0",
  },
  filterLabel: {
    marginBottom: "10px",
    fontSize: "14px",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginRight: "10px",
    marginBottom: "10px",
    width: "100%",
  },
  filterButtons: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100px",
    transition: "background-color 0.3s ease",
  },
  exportButton: {
    padding: "12px 20px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
    transition: "background-color 0.3s ease",
  },
  tableContainer: {
    maxWidth: "100%",
    overflowX: "auto",
    marginTop: "20px",
    borderRadius: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "22px",
    borderBottom: "1px solid #ddd",
    textAlign: "center",
    background: "linear-gradient(135deg,rgb(17, 113, 203), #2575fc)",
    color: "white",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    textAlign: "center",
  },
};
