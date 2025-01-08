import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, push, update } from "firebase/database";
import { useEffect, useState } from "react";

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

const CadastroRefeicoes = () => {
  const [formData, setFormData] = useState({
    dataRefeicao: "",
    cafeDescricao: "",
    cafeTotalQtd: "",
    cafeFuncionariosQtd: "",
    cafeJovensQtd: "",
    almocoDescricao: "",
    almocoTotalQtd: "",
    almocoFuncionariosQtd: "",
    almocoJovensQtd: "",
    lancheDescricao: "",
    lancheTotalQtd: "",
    lancheFuncionariosQtd: "",
    lancheJovensQtd: "",
    outrasDescricao: "",
    outrasTotalQtd: "",
    outrasFuncionariosQtd: "",
    outrasJovensQtd: "",
    sobrasDescricao: "",
    observacaoDescricao: "",
    desperdicioQtd: "",
  });

  const [refeicoes, setRefeicoes] = useState([]);

  useEffect(() => {
    const refeicoesRef = ref(database, "refeicoesServidas");

    // Usando get() para pegar os dados uma vez
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

  const calcularTotal = (campo) => {
    const {
      cafeTotalQtd,
      cafeFuncionariosQtd,
      almocoTotalQtd,
      almocoFuncionariosQtd,
      lancheTotalQtd,
      lancheFuncionariosQtd,
      outrasTotalQtd,
      outrasFuncionariosQtd,
    } = formData;
  
    // Para cada refeição, calculamos a quantidade de jovens subtraindo a quantidade de funcionários
    if (campo === "cafe") {
      const cafeJovensQtd = cafeTotalQtd - cafeFuncionariosQtd;
      setFormData({
        ...formData,
        cafeJovensQtd: cafeJovensQtd >= 0 ? cafeJovensQtd : 0, // Garantir que a quantidade não seja negativa
      });
    }
    if (campo === "almoco") {
      const almocoJovensQtd = almocoTotalQtd - almocoFuncionariosQtd;
      setFormData({
        ...formData,
        almocoJovensQtd: almocoJovensQtd >= 0 ? almocoJovensQtd : 0, // Garantir que a quantidade não seja negativa
      });
    }
    if (campo === "lanche") {
      const lancheJovensQtd = lancheTotalQtd - lancheFuncionariosQtd;
      setFormData({
        ...formData,
        lancheJovensQtd: lancheJovensQtd >= 0 ? lancheJovensQtd : 0, // Garantir que a quantidade não seja negativa
      });
    }
    if (campo === "outras") {
      const outrasJovensQtd = outrasTotalQtd - outrasFuncionariosQtd;
      setFormData({
        ...formData,
        outrasJovensQtd: outrasJovensQtd >= 0 ? outrasJovensQtd : 0, // Garantir que a quantidade não seja negativa
      });
    }
  };
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  
    // Se o campo alterado for um campo de quantidade, chamamos a função de cálculo
    if (id.includes("Qtd") && id !== "desperdicioQtd") {
      const campo = id.split("Qtd")[0]; // Extrai o campo (cafe, almoco, etc.)
      calcularTotal(campo);
    }
  };
  
  const salvarRefeicao = () => {
    const refeicaoData = { ...formData };
    const newRefeicaoKey = push(ref(database, "refeicoesServidas")).key;

    const updates = {};
    updates[`/refeicoesServidas/${newRefeicaoKey}`] = refeicaoData;

    update(ref(database), updates)
      .then(() => {
        alert("Refeição salva com sucesso!");
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
          lancheDescricao: "",
          lancheTotalQtd: "",
          lancheFuncionariosQtd: "",
          lancheJovensQtd: "",
          outrasDescricao: "",
          outrasTotalQtd: "",
          outrasFuncionariosQtd: "",
          outrasJovensQtd: "",
          sobrasDescricao: "",
          observacaoDescricao: "",
          desperdicioQtd: "",
        });
      })
      .catch((error) => {
        console.error("Erro ao salvar refeição:", error);
      });
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #6a11cb, #2575fc)" }}>
      <section style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ color: "white", fontSize: "23px" }}>Data</h2>
        <input
          type="date"
          id="dataRefeicao"
          value={formData.dataRefeicao}
          onChange={handleChange}
          style={{ padding: "8px", marginBottom: "15px" }}
        />
        {/* CAFÉ DA MANHÃ */}

        <h2 style={{ color: "white", fontSize: "23px" }}>Café da Manhã</h2>
        <textarea
          id="cafeDescricao"
          placeholder="Descreva o que foi servido no café da manhã..."
          value={formData.cafeDescricao}
          onChange={handleChange}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ marginRight: "10px", color: "white", fontSize: "23px" }}
          >
            Total:
          </label>
          <input
            type="number"
            id="cafeTotalQtd"
            value={formData.cafeTotalQtd}
            onChange={handleChange}
            style={{ padding: "8px", marginRight: "10px" }}
          />
          <label
            style={{ marginRight: "10px", color: "white", fontSize: "23px" }}
          >
            Quantidade para Funcionários:
          </label>
          <input
            type="number"
            id="cafeFuncionariosQtd"
            value={formData.cafeFuncionariosQtd}
            onChange={handleChange}
            style={{ padding: "8px", marginRight: "10px" }}
          />
          <label style={{ color: "white", fontSize: "23px" }}>
            Quantidade para Jovens:
          </label>
          <input
            type="number"
            id="cafeJovensQtd"
            value={formData.cafeJovensQtd}
            readOnly
            style={{ padding: "8px" }}
          />
        </div>

        {/* ALMOÇO */}
        <h2 style={{ color: "white", fontSize: "23px" }}>Almoço</h2>
        <textarea
          id="almocoDescricao"
          placeholder="Descreva o que foi servido no almoço..."
          value={formData.almocoDescricao}
          onChange={handleChange}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ marginRight: "10px", color: "white", fontSize: "23px" }}
          >
            Total:
          </label>
          <input
            type="number"
            id="almocoTotalQtd"
            value={formData.almocoTotalQtd}
            onChange={handleChange}
            style={{ padding: "8px", marginRight: "10px" }}
          />
          <label
            style={{ marginRight: "10px", color: "white", fontSize: "23px" }}
          >
            Quantidade para Funcionários:
          </label>
          <input
            type="number"
            id="almocoFuncionariosQtd"
            value={formData.almocoFuncionariosQtd}
            onChange={handleChange}
            style={{ padding: "8px", marginRight: "10px" }}
          />
          <label style={{ color: "white", fontSize: "23px" }}>
            Quantidade para Jovens:
          </label>
          <input
            type="number"
            id="almocoJovensQtd"
            value={formData.almocoJovensQtd}
            readOnly
            style={{ padding: "8px" }}
          />
        </div>

        {/* LANCHE DA TARDE */}
        <h2 style={{ color: "white", fontSize: "23px" }}>Lanche da Tarde</h2>
        <textarea
          id="lancheDescricao"
          placeholder="Descreva o que foi servido de Lanche da Tarde..."
          value={formData.lancheDescricao}
          onChange={handleChange}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ marginRight: "10px", color: "white", fontSize: "23px" }}
          >
            Total:
          </label>
          <input
            type="number"
            id="lancheTotalQtd"
            value={formData.lancheTotalQtd}
            onChange={handleChange}
            style={{ padding: "8px", marginRight: "10px" }}
          />
          <label
            style={{ marginRight: "10px", color: "white", fontSize: "23px" }}
          >
            Quantidade para Funcionários:
          </label>
          <input
            type="number"
            id="lancheFuncionariosQtd"
            value={formData.lancheFuncionariosQtd}
            onChange={handleChange}
            style={{ padding: "8px", marginRight: "10px" }}
          />
          <label style={{ color: "white", fontSize: "23px" }}>
            Quantidade para Jovens:
          </label>
          <input
            type="number"
            id="lancheJovensQtd"
            value={formData.lancheJovensQtd}
            readOnly
            style={{ padding: "8px" }}
          />
        </div>

        {/* OUTRAS REFEIÇÕES */}
        <h2 style={{ color: "white", fontSize: "23px" }}>Outras Refeiçoes</h2>
        <textarea
          id="outrasDescricao"
          placeholder="Descreva o que foi servido de Lanche da Tarde..."
          value={formData.outrasDescricao}
          onChange={handleChange}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ marginRight: "10px", color: "white", fontSize: "23px" }}
          >
            Total:
          </label>
          <input
            type="number"
            id="outrasTotalQtd"
            value={formData.outrasTotalQtd}
            onChange={handleChange}
            style={{ padding: "8px", marginRight: "10px" }}
          />
          <label
            style={{ marginRight: "10px", color: "white", fontSize: "23px" }}
          >
            Quantidade para Funcionários:
          </label>
          <input
            type="number"
            id="outrasFuncionariosQtd"
            value={formData.outrasFuncionariosQtd}
            onChange={handleChange}
            style={{ padding: "8px", marginRight: "10px" }}
          />
          <label style={{ color: "white", fontSize: "23px" }}>
            Quantidade para Jovens:
          </label>
          <input
            type="number"
            id="outrasJovensQtd"
            value={formData.outrasJovensQtd}
            readOnly
            style={{ padding: "8px" }}
          />
        </div>

        {/*  SOBRAS */}

        <h2 style={{ color: "white", fontSize: "23px" }}>Sobras</h2>
        <textarea
          id="outrasDescricao"
          placeholder="Descreva as sobras..."
          value={formData.sobrasDescricao}
          onChange={handleChange}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        {/*  OBSERVAÇÕES */}

        <h2 style={{ color: "white", fontSize: "23px" }}>Observações</h2>
        <textarea
          id="observacaoDescricao"
          placeholder="Descreva as observações..."
          value={formData.observacaoDescricao}
          onChange={handleChange}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />
        {/*  DISPERDICIO */}

        <h2 style={{ color: "white", fontSize: "23px" }}>Disperdício</h2>
        <input
          type="number"
          id="desperdicioQtd"
          placeholder="KG"
          value={formData.desperdicioQtd}
          readOnly // Make it read-only if you don't want to change the value
          style={{ padding: "8px", width: "100%",  }}
        />
      <br />
        <button
          onClick={salvarRefeicao}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Salvar
        </button>

        <section style={{ marginTop: "30px" }}>
          <h2 style={{ color: "white", fontSize: "23px" }}>
            Refeições Servidas
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "white",
                  }}
                >
                  Data
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "white",
                  }}
                >
                  Café Descrição
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "white",
                  }}
                >
                  Café Funcionários
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "white",
                  }}
                >
                  Café Jovens
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "white",
                  }}
                >
                  Almoço Descrição
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "white",
                  }}
                >
                  Almoço Funcionários
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "white",
                  }}
                >
                  Almoço Jovens
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "white",
                  }}
                >
                  Lanche Descrição
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "white",
                  }}
                >
                  Lanche Funcionários
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "white",
                  }}
                >
                  Lanche Jovens
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "white",
                  }}
                >
                  Outras Ref. Descrição
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "white",
                  }}
                >
                  Outras Ref. Funcionários
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "white",
                  }}
                >
                  Outras Ref. Jovens
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "white",
                  }}
                >
                  Sobras
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "white",
                  }}
                >
                  Observações
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "white",
                  }}
                >
                  Desperdício
                </th>
              </tr>
            </thead>
            <tbody>
              {refeicoes.map((refeicao) => (
                <tr key={refeicao.key}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {refeicao.dataRefeicao}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {refeicao.cafe?.descricao || ""}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {refeicao.cafe?.funcionarios || ""}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {refeicao.cafe?.jovens || ""}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {refeicao.almoco?.descricao || ""}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {refeicao.almoco?.funcionarios || ""}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {refeicao.almoco?.jovens || ""}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {refeicao.lanche?.descricao || ""}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {refeicao.lanche?.funcionarios || ""}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {refeicao.lanche?.jovens || ""}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {refeicao.outrasRef?.descricao || ""}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {refeicao.outrasRef?.funcionarios || ""}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {refeicao.outrasRef?.jovens || ""}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {refeicao.sobras}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {refeicao.observacao}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {refeicao.desperdicio}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
    </div>
  );
};

export default CadastroRefeicoes;
