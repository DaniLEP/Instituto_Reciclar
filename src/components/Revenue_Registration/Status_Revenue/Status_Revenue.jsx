import { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";


export default function ExibirRefeicoes() {
  const [refeicoes, setRefeicoes] = useState([]);

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
              dataRefeicao: formatDate(data.dataRefeicao), // Formatação da data
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

  // Função para formatar a data
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("pt-BR", options); // Formato 'dd/mm/aaaa'
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
              {/* Ajuste de espaçamento das colunas */}
              {[
                "Data", "Café", "Café Total", "Café Funcionários", "Café Jovens",
                "Almoço", "Almoço Total", "Almoço Funcionários", "Almoço Jovens",
                "Lanche", "Lanche Total", "Lanche Funcionários", "Lanche Jovens",
                "Outras", "Outras Ref. Total", "Outras Ref. Funcionários",
                "Outras Ref. Jovens", "Sobras", "Observação", "Desperdícios"
              ].map((header, index) => (
                <th
                  key={index}
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                    textAlign: "left",
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
                  refeicao.dataRefeicao, refeicao.cafeDescricao, refeicao.cafeTotalQtd,
                  refeicao.cafeFuncionariosQtd, refeicao.cafeJovensQtd, refeicao.almocoDescricao,
                  refeicao.almocoTotalQtd, refeicao.almocoFuncionariosQtd, refeicao.almocoJovensQtd,
                  refeicao.lancheDescricao, refeicao.lancheTotalQtd, refeicao.lancheFuncionariosQtd,
                  refeicao.lancheJovensQtd, refeicao.outrasDescricao, refeicao.outrasTotalQtd,
                  refeicao.outrasJovensQtd, refeicao.sobrasDescricao, refeicao.observacaoDescricao,
                  refeicao.desperdicioQtd,
                ].map((value, index) => (
                  <td
                    key={index}
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      textAlign: "left",
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "transparent",
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
