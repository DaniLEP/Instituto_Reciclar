import { useEffect, useState } from "react";
import { getDatabase, ref, get, update } from "firebase/database";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import './css/ExibirRefeicoes.css';

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

    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000); // Ajuste para o fuso horário local
    const day = String(localDate.getDate()).padStart(2, "0");
    const month = String(localDate.getMonth() + 1).padStart(2, "0"); // Meses começam de 0
    const year = localDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
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
      } else {
        console.log("Nenhuma refeição encontrada");
      }
    }).catch((error) => {
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
          refeicao.key === editando.id ? { ...refeicao, [editando.field]: valorEditado } : refeicao
        )
      );
      
      // Salva a atualização no Firebase
      const refeicaoRef = ref(database, `refeicoesServidas/${editando.id}`);
      update(refeicaoRef, {
        [editando.field]: valorEditado,
      }).then(() => {
        setEditando(null);
      }).catch((error) => {
        console.error("Erro ao atualizar no Firebase:", error);
      });
    }
  };

  const handleBlur = () => {
    // Salva a atualização no Firebase se perder o foco
    const refeicaoRef = ref(database, `refeicoesServidas/${editando.id}`);
    update(refeicaoRef, {
      [editando.field]: valorEditado,
    }).then(() => {
      setEditando(null);
    }).catch((error) => {
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
    setRefeicoes((prev) => prev.filter(({ dataRefeicaoObj }) => {
      const data = resetTime(new Date(dataRefeicaoObj));
      return (!inicio || data >= inicio) && (!fim || data <= fim);
    }));
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
    <div style={{ background: "linear-gradient(135deg, #6a11cb, #2575fc)", padding: "20px", color: "#fff", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center" }}>Resultados Cadastrados de Refeições</h2>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <label>Data Início: <input type="date" style={{borderRadius: '10px', padding: '10px', color:"black", marginRight:'10px'}} value={filtroInicio} onChange={(e) => setFiltroInicio(e.target.value)} /></label>
        <label>Data Fim: <input type="date" style={{borderRadius: '10px', padding: '10px', color:"black", marginRight:'10px'}} value={filtroFim} onChange={(e) => setFiltroFim(e.target.value)} /></label>
        <button style={{marginRight: '10px', background: 'green'}} onClick={filtrarRefeicoes}>Filtrar</button>
        <button onClick={limparFiltros}>Limpar Filtro</button>
      </div>
      <button onClick={() => navigate(-1)}>Voltar</button>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              {["Data Refeição",
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
                "Desperdícios (kg)"].map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {refeicoes.map((refeicao) => (
              <tr key={refeicao.key}>
                {['dataRefeicao',
                  'cafeDescricao',
                  'cafeTotalQtd',
                  'cafeFuncionariosQtd',
                  'cafeJovensQtd',
                  'almocoDescricao',
                  'almocoTotalQtd',
                  'almocoFuncionariosQtd',
                  'almocoJovensQtd',
                  'lancheDescricao',
                  'lancheTotalQtd',
                  'lancheFuncionariosQtd',
                  'lancheJovensQtd',
                  'outrasDescricao',
                  'outrasTotalQtd',
                  'outrasFuncionariosQtd',
                  'outrasJovensQtd',
                  'sobrasDescricao',
                  'observacaoDescricao',
                  'desperdicioQtd'].map((field) => (
                  <td key={field} onDoubleClick={() => handleDoubleClick(refeicao.key, field, refeicao[field])}>
                    {editando?.id === refeicao.key && editando.field === field ? (
                      <input type="text" value={valorEditado} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur} autoFocus />
                    ) : (
                      field === 'dataRefeicao' ? formatDate(refeicao[field]) : refeicao[field]
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
