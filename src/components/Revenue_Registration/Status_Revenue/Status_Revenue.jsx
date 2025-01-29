import { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function ExibirRefeicoes() {
  const [refeicoes, setRefeicoes] = useState([]);
  const [filtroInicio, setFiltroInicio] = useState("");
  const [filtroFim, setFiltroFim] = useState("");
  const navigate = useNavigate();

  // Função para formatar a data levando em conta o fuso horário
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

    // Ajustando a data para o fuso horário local
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

    const day = String(localDate.getDate()).padStart(2, "0");
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const year = localDate.getFullYear();
    return `${day}/${month}/${year}`;
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
              dataRefeicaoObj: new Date(data.dataRefeicao), // Adicionando o objeto Date sem formatar
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
    // Ajustando o início e fim para comparar apenas as datas
    const inicio = filtroInicio ? resetTime(new Date(filtroInicio)) : null;
    const fim = filtroFim ? resetTime(new Date(filtroFim)) : null;

    // Filtrar refeições, comparando apenas as datas
    const refeicoesFiltradas = refeicoes.filter((refeicao) => {
      const dataRefeicao = resetTime(refeicao.dataRefeicaoObj);  // Reseta a hora da data

      if (
        (!inicio || dataRefeicao >= inicio) &&
        (!fim || dataRefeicao <= fim)
      ) {
        return true;
      }
      return false;
    });

    setRefeicoes(refeicoesFiltradas);
  };

  // Função para remover a parte de hora, minuto e segundo de uma data
  const resetTime = (date) => {
    date.setHours(0, 0, 0, 0); // Zera a hora para garantir a comparação apenas de data
    return date;
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
              color: "black",
            }}
          />
        </label>
        <label style={{ marginRight: "10px", color: "#fff" }}>
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
              color: "black",
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
                  formatDate(refeicao.dataRefeicao),
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
 
