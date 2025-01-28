import { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function ExibirRefeicoes() {
  const [refeicoes, setRefeicoes] = useState([]);
  const [filtroInicio, setFiltroInicio] = useState("");
  const [filtroFim, setFiltroFim] = useState("");
  const navigate = useNavigate();

  const formatDate = (timestamp) => {
    if (!timestamp) return "Data inválida";
    let date;
    if (typeof timestamp === "number") {
      date = new Date(timestamp);
    } else if (typeof timestamp === "string") {
      date = new Date(Date.parse(timestamp));
    } else {
      return "Data inválida";
    }
    if (isNaN(date.getTime())) return "Data inválida";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  useEffect(() => {
    const database = getDatabase();
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

  const filtrarRefeicoes = () => {
    const inicio = filtroInicio ? parseDate(filtroInicio) : null;
    const fim = filtroFim ? parseDate(filtroFim) : null;

    const database = getDatabase();
    const refeicoesRef = ref(database, "refeicoesServidas");

    get(refeicoesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const refeicoesData = [];
          snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const dataRefeicao = parseDate(data.dataRefeicao);
            if (
              (!inicio || dataRefeicao >= inicio) &&
              (!fim || dataRefeicao <= fim)
            ) {
              refeicoesData.push({
                key: childSnapshot.key,
                dataRefeicao: parseDate(data.dataRefeicao),
                ...data,
              });
            }
          });
          setRefeicoes(refeicoesData);
        } else {
          console.log("Nenhuma refeição encontrada");
        }
      })
      .catch((error) => {
        console.error("Erro ao filtrar dados do Firebase:", error);
      });
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          color: "#fff",
          fontSize: "2.4rem",
          textAlign: "center",
          marginBottom: "2rem",
          fontWeight: "bold",
        }}
      >
        Resultados Cadastrados de Refeições
      </h2>

      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <label style={{ marginRight: "10px", color: "#fff" }}>
          Data Início:
          <input
            type="date"
            value={filtroInicio}
            onChange={(e) => setFiltroInicio(e.target.value)}
            style={{
              marginLeft: "10px",
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              color: 'black'
            }}
          />
        </label>
        <label style={{ marginRight: "10px", color:  "#fff" }}>
          Data Fim:
          <input
            type="date"
            value={filtroFim}
            onChange={(e) => setFiltroFim(e.target.value)}
            style={{
              marginLeft: "10px",
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              color: 'black'

            }}
          />
        </label>
        <button
          onClick={filtrarRefeicoes}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            backgroundColor: "#2575fc",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Filtrar
        </button>
      </div>

      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "10px 20px",
          borderRadius: "5px",
          backgroundColor: "#ff4d4d",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Voltar
      </button>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
            fontSize: "14px",
            color: "#333",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#2575fc",
                color: "white",
                fontSize: "16px",
              }}
            >
              {[
                "Data Refeição",
                "Café Descrição",
                "Café Total (kg)",
                "Café Funcionários",
                "Café Jovens",
                "Almoço Descrição",
                "Almoço Total (kg)",
                "Almoço Funcionários",
                "Almoço Jovens",
                "Lanche Descrição",
                "Lanche Total (kg)",
                "Lanche Funcionários",
                "Lanche Jovens",
                "Outras Descrição",
                "Outras Ref. Total (kg)",
                "Outras Ref. Funcionários",
                "Outras Ref. Jovens",
                "Sobras",
                "Observação",
                "Desperdícios (kg)",
              ].map((header, index) => (
                <th
                  key={index}
                  style={{
                    padding: "20px",
                    border: "1px solid #ddd",
                    textAlign: "center",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
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
                  refeicao.dataRefeicao,
                  refeicao.cafeDescricao,
                  refeicao.cafeTotalQtd,
                  refeicao.cafeFuncionariosQtd,
                  refeicao.cafeJovensQtd,
                  refeicao.almocoDescricao,
                  refeicao.almocoTotalQtd,
                  refeicao.almocoFuncionariosQtd,
                  refeicao.almocoJovensQtd,
                  refeicao.lancheDescricao,
                  refeicao.lancheTotalQtd,
                  refeicao.lancheFuncionariosQtd,
                  refeicao.lancheJovensQtd,
                  refeicao.outrasDescricao,
                  refeicao.outrasTotalQtd,
                  refeicao.outrasFuncionariosQtd,
                  refeicao.outrasJovensQtd,
                  refeicao.sobrasDescricao,
                  refeicao.observacaoDescricao,
                  refeicao.desperdicioQtd,
                ].map((value, index) => (
                  <td
                    key={index}
                    style={{
                      padding: "20px 10px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                      backgroundColor:
                        index % 2 === 0 ? "#f9f9f9" : "transparent",
                    }}
                  >
                    {value}
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
