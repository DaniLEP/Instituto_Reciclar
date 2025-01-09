import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update } from "firebase/database";

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
  const [editMode, setEditMode] = useState(null); // Campo em edição
  const [editValue, setEditValue] = useState(""); // Valor do campo editado

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
        console.error("Erro ao carregar dados:", error);
      });
  }, []);

  // Ativar o modo de edição
  const handleDoubleClick = (key, field, value) => {
    setEditMode({ key, field });
    setEditValue(value);
  };

  // Salvar alterações
  const handleSave = (key, field) => {
    if (editValue.trim() === "") return; // Não salvar valores vazios

    const fieldRef = ref(database, `refeicoesServidas/${key}`);
    update(fieldRef, { [field]: editValue })
      .then(() => {
        setRefeicoes((prevRefeicoes) =>
          prevRefeicoes.map((refeicao) =>
            refeicao.key === key ? { ...refeicao, [field]: editValue } : refeicao
          )
        );
        setEditMode(null);
        setEditValue("");
      })
      .catch((error) => {
        console.error("Erro ao atualizar dados:", error);
      });
  };

  // Gerenciar tecla pressionada
  const handleKeyDown = (event, key, field) => {
    if (event.key === "Enter") {
      handleSave(key, field);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Refeições Cadastradas
      </h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
              <th style={styles.th}>Data</th>
               <th style={styles.th}>Café</th>
               <th style={styles.th}>Café Total</th>
               <th style={styles.th}>Café Funcionários</th>
               <th style={styles.th}>Café Jovens</th>
               <th style={styles.th}>Almoço</th>
               <th style={styles.th}>Almoço Total</th>
               <th style={styles.th}>Almoço Funcionários</th>
               <th style={styles.th}>Almoço Jovens</th>
               <th style={styles.th}>Lanche</th>
               <th style={styles.th}>Lanche Total</th>
               <th style={styles.th}>Lanche Funcionários</th>
               <th style={styles.th}>Lanche Jovens</th>
               <th style={styles.th}>Outras</th>
               <th style={styles.th}>Outras Total</th>
               <th style={styles.th}>Outras Funcionários</th>
               <th style={styles.th}>Outras Jovens</th>
               <th style={styles.th}>Sobras</th>
               <th style={styles.th}>Observação</th>
               <th style={styles.th}>Desperdícios</th>

               
          </tr>
        </thead>
        <tbody>
          {refeicoes.map((refeicao) => (
            <tr key={refeicao.key}>
              {["dataRefeicao", 'cafeDescricao', "cafeTotalQtd", "cafeFuncionariosQtd", "cafeJovensQtd", "almocoDescricao", "almocoTotalQtd", "almocoFuncionariosQtd", "almocoJovensQtd", "lancheDescricao", "lancheTotalQtd", "lancheFuncionariosQtd", "lancheJovensQtd","outrasDescricao", "outrasTotalQtd", "outrasFuncionariosQtd", "outrasJovensQtd", "sobrasDescricao", "observacaoDescricao", "desperdicioQtd"  ].map(
                (field) => (
                  <td
                    key={field}
                    style={styles.td}
                    onDoubleClick={() =>
                      handleDoubleClick(
                        refeicao.key,
                        field,
                        refeicao[field] || ""
                      )
                    }
                  >
                    {editMode?.key === refeicao.key &&
                    editMode?.field === field ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, refeicao.key, field)}
                        style={styles.input}
                      />
                    ) : (
                      refeicao[field] || "—"
                    )}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    backgroundColor: "#f4f4f4",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
    cursor: "pointer",
  },
  input: {
    width: "100%",
    padding: "5px",
    fontSize: "14px",
  },
};
