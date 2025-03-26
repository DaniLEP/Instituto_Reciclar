import { useEffect, useState } from "react";
import { getDatabase, ref, get, update } from "firebase/database";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "./css/ExibirRefeicoes.css";

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

export default function ExibirRefeicoes() {
  const [refeicoes, setRefeicoes] = useState([]);
  const [filtroInicio, setFiltroInicio] = useState("");
  const [filtroFim, setFiltroFim] = useState("");
  const navigate = useNavigate();
  const [valorEditado, setValorEditado] = useState("");
  const [editando, setEditando] = useState(null);

  // Função para formatar a data
  const formatDate = (timestamp) => {
    if (!timestamp) return "Data inválida";
    let date = new Date(timestamp);

    if (isNaN(date.getTime())) return "Data inválida";

    const localDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    ); // Ajuste para o fuso horário local
    const day = String(localDate.getDate()).padStart(2, "0");
    const month = String(localDate.getMonth() + 1).padStart(2, "0"); // Meses começam de 0
    const year = localDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const refeicoesRef = ref(database, "refeicoesServidas");

    get(refeicoesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const refeicoesData = [];
          snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            refeicoesData.push({
              key: childSnapshot.key,
              dataRefeicao: formatDate(data.dataRefeicao),
              dataRefeicaoObj: new Date(data.dataRefeicao),
              ...data,
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

  const handleDoubleClick = (id, field, value) => {
    setEditando({ id, field });
    setValorEditado(value);
  };

  const handleChange = (e) => setValorEditado(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Atualiza no estado local primeiro
      setRefeicoes((prev) =>
        prev.map((refeicao) =>
          refeicao.key === editando.id
            ? { ...refeicao, [editando.field]: valorEditado }
            : refeicao
        )
      );

      // Salva a atualização no Firebase
      const refeicaoRef = ref(database, `refeicoesServidas/${editando.id}`);
      update(refeicaoRef, {
        [editando.field]: valorEditado,
      })
        .then(() => {
          setEditando(null);
        })
        .catch((error) => {
          console.error("Erro ao atualizar no Firebase:", error);
        });
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(refeicoes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Refeições");
    XLSX.writeFile(workbook, "Refeicoes.xlsx");
  };

  const handleBlur = () => {
    // Salva a atualização no Firebase se perder o foco
    const refeicaoRef = ref(database, `refeicoesServidas/${editando.id}`);
    update(refeicaoRef, {
      [editando.field]: valorEditado,
    })
      .then(() => {
        setEditando(null);
      })
      .catch((error) => {
        console.error("Erro ao atualizar no Firebase:", error);
      });
  };

  const resetTime = (date) => {
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const filtrarRefeicoes = () => {
    const inicio = filtroInicio ? resetTime(new Date(filtroInicio)) : null;
    const fim = filtroFim ? resetTime(new Date(filtroFim)) : null;
    setRefeicoes((prev) =>
      prev.filter(({ dataRefeicaoObj }) => {
        const data = resetTime(new Date(dataRefeicaoObj));
        return (!inicio || data >= inicio) && (!fim || data <= fim);
      })
    );
  };

  const limparFiltros = () => {
    setFiltroInicio("");
    setFiltroFim("");
    // Recarrega todas as refeições sem filtro
    const refeicoesRef = ref(database, "refeicoesServidas");
    get(refeicoesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const refeicoesData = [];
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          refeicoesData.push({
            key: childSnapshot.key,
            dataRefeicao: formatDate(data.dataRefeicao),
            dataRefeicaoObj: new Date(data.dataRefeicao),
            ...data,
          });
        });
        setRefeicoes(refeicoesData);
      }
    });
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        padding: "20px",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{ textAlign: "center", fontSize: "2rem", marginBottom: "20px" }}
      >
        Resultados Cadastrados de Refeições
      </h2>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <label>
          Data Início:{" "}
          <input
            type="date"
            style={{
              borderRadius: "10px",
              padding: "10px",
              color: "black",
              marginRight: "10px",
            }}
            value={filtroInicio}
            onChange={(e) => setFiltroInicio(e.target.value)}
          />
        </label>
        <label>
          Data Fim:{" "}
          <input
            type="date"
            style={{
              borderRadius: "10px",
              padding: "10px",
              color: "black",
              marginRight: "10px",
            }}
            value={filtroFim}
            onChange={(e) => setFiltroFim(e.target.value)}
          />
        </label>
        <button
          style={{
            padding: "8px 15px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
            fontSize: "1rem",
            marginRight: "10px",
          }}
          onClick={filtrarRefeicoes}
        >
          Filtrar
        </button>
        <button
          style={{
            padding: "8px 15px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
            fontSize: "1rem",
          }}
          onClick={limparFiltros}
        >
          Limpar Filtro
        </button>
      </div>
      <button
        onClick={exportToExcel}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          marginRight: "10px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Exportar para Excel
      </button>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#ff5733",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "4px",
          fontSize: "1rem",
        }}
      >
        Voltar
      </button>
      <div className="table-container">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
            textAlign: "center",
            overflowX: "auto",
          }}
        >
          <thead>
            <tr>
              {[
                "Data Refeição",
                "Café Descrição",
                "Café Total (kg)",
                "Café Funcionários",
                "Café Turma 1",
                "Café Turma 2",

                "Almoço Descrição",
                "Almoço Total (kg)",
                "Almoço Funcionários",
                "Almoço Turma 1",               
                "Almoço Turma 2",

                "Lanche Descrição",
                "Lanche Total (kg)",
                "Lanche Funcionários",
                "Lanche Turma 1",
                "Lanche Turma 2",

                "Outras Descrição",
                "Outras Ref. Total (kg)",
                "Outras Ref. Funcionários",
                "Outras Ref. Turma 1",
                "Outras Ref. Turma 2",

                "Sobras",
                "Observação",
                "Desperdícios (kg)",
              ].map((header, index) => (
                <th
                  key={index}
                  style={{
                    backgroundColor: "#2575fc",
                    color: "white",
                    textAlign: "center",
                    padding: "12px",
                    border: "1px solid #ddd",
                  }}
                >
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
                  "cafeJovensTardeQtd",
                  "almocoDescricao",
                  "almocoTotalQtd",
                  "almocoFuncionariosQtd",
                  "almocoJovensQtd",
                  "almocoJovensTardeQtd",
                  "lancheDescricao",
                  "lancheTotalQtd",
                  "lancheFuncionariosQtd",
                  "lancheJovensQtd",
                  "lancheJovensTardeQtd",
                  "outrasDescricao",
                  "outrasTotalQtd",
                  "outrasFuncionariosQtd",
                  "outrasJovensQtd",
                  "outrasJovensTardeQtd",
                  "sobrasDescricao",
                  "observacaoDescricao",
                  "desperdicioQtd",
                ].map((field) => (
                  <td
                    key={field}
                    onDoubleClick={() =>
                      handleDoubleClick(refeicao.key, field, refeicao[field])
                    }
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      backgroundColor: "#f9f9f9",
                      color: "black",
                    }}
                  >
                    {editando?.id === refeicao.key &&
                    editando.field === field ? (
                      <input
                        type="text"
                        value={valorEditado}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        autoFocus
                        style={{
                          padding: "10px",
                          fontSize: "1rem",
                          width: "100%",
                          borderRadius: "4px",
                          border: "1px solid #ddd",
                          backgroundColor: "#fff",
                        }}
                      />
                    ) : field === "dataRefeicao" ? (
                      formatDate(refeicao[field])
                    ) : (
                      refeicao[field]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
