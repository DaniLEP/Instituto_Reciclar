import { ref, get, push, update, db } from "../../../../firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../../../components/ui/Button/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export default function CadastroRefeicoes() {
  const [formData, setFormData] = useState({
    dataRefeicao: "",
    cafeDescricao: "",
    cafeTotalQtd: 0,
    cafeFuncionariosQtd: 0,
    cafeJovensQtd: 0,
    almocoDescricao: "",
    almocoTotalQtd: 0,
    almocoFuncionariosQtd: 0,
    almocoJovensQtd: 0,
    almocoJovensTardeQtd: 0,
    lancheDescricao: "",
    lancheTotalQtd: 0,
    lancheFuncionariosQtd: 0,
    lancheJovensManhaQtd: 0,
    lancheJovensQtd: 0,
    outrasDescricao: "",
    outrasTotalQtd: 0,
    outrasFuncionariosQtd: 0,
    outrasJovensQtd: 0,
    outrasJovensTardeQtd: 0,
    sobrasDescricao: "",
    observacaoDescricao: "",
    desperdicioQtd: 0,
  });

  const [refeicoes, setRefeicoes] = useState([]);
  const navigate = useNavigate();

  // Carregar refeições do Firebase ao montar o componente
  useEffect(() => {
    const refeicoesRef = ref(db, "refeicoesServidas");
    get(refeicoesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const refeicoesData = [];
          snapshot.forEach((childSnapshot) => {
            refeicoesData.push({ key: childSnapshot.key, ...childSnapshot.val() });
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

  // Função para calcular jovens (total - funcionarios - jovensManha)
  const calcularTotal = (total, funcionarios, jovens = 0) => {
    return Math.max(0, total - funcionarios - jovens);
  };

  // Manipulador de mudanças dos inputs
  const handleChange = (e) => {
    const { id, value } = e.target;

    // Se for campo de descrição (texto), atualiza direto
    if (id.includes("Descricao")) {
      setFormData((prev) => ({ ...prev, [id]: value }));
      return;
    }

    // Campos numéricos
    const valorNumerico = parseInt(value) || 0;

    setFormData((prev) => {
      const novoEstado = { ...prev, [id]: valorNumerico };

      // Cálculos dependentes:
      if (id === "cafeTotalQtd" || id === "cafeFuncionariosQtd") {
        novoEstado.cafeJovensQtd = calcularTotal(novoEstado.cafeTotalQtd, novoEstado.cafeFuncionariosQtd);
      } else if (
        id === "almocoTotalQtd" ||
        id === "almocoFuncionariosQtd" ||
        id === "almocoJovensQtd"
      ) {
        novoEstado.almocoJovensTardeQtd = calcularTotal(
          novoEstado.almocoTotalQtd,
          novoEstado.almocoFuncionariosQtd,
          novoEstado.almocoJovensQtd
        );
      } else if (
        id === "lancheTotalQtd" ||
        id === "lancheFuncionariosQtd" ||
        id === "lancheJovensManhaQtd"
      ) {
        // Cálculo lancheJovensQtd = total - jovensManha - funcionarios
        novoEstado.lancheJovensQtd = calcularTotal(
          novoEstado.lancheTotalQtd,
          novoEstado.lancheFuncionariosQtd,
          novoEstado.lancheJovensManhaQtd
        );
      } else if (
        id === "outrasTotalQtd" ||
        id === "outrasFuncionariosQtd" ||
        id === "outrasJovensQtd"
      ) {
        novoEstado.outrasJovensTardeQtd = calcularTotal(
          novoEstado.outrasTotalQtd,
          novoEstado.outrasFuncionariosQtd,
          novoEstado.outrasJovensQtd
        );
      }

      return novoEstado;
    });
  };

  // Atualizar data
  const handleDateChange = (e) => {
    setFormData((prev) => ({ ...prev, dataRefeicao: e.target.value }));
  };

  // Navegar para página anterior
  const handleBack = () => {
    navigate("/cardapio");
  };

  // Salvar dados no Firebase Realtime Database
  const salvarNoBanco = () => {
    if (!formData.dataRefeicao) {
      toast.error("Por favor, selecione a data da refeição.");
      return;
    }

    const refeicaoData = { ...formData };

    const newRefeicaoKey = push(ref(db, "refeicoesServidas")).key;
    const updates = {};
    updates[`/refeicoesServidas/${newRefeicaoKey}`] = refeicaoData;

    update(ref(db), updates)
      .then(() => {
        toast.success("Refeições salvas com sucesso!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        setFormData({
          dataRefeicao: "",
          cafeDescricao: "",
          cafeTotalQtd: 0,
          cafeFuncionariosQtd: 0,
          cafeJovensQtd: 0,
          almocoDescricao: "",
          almocoTotalQtd: 0,
          almocoFuncionariosQtd: 0,
          almocoJovensQtd: 0,
          almocoJovensTardeQtd: 0,
          lancheDescricao: "",
          lancheTotalQtd: 0,
          lancheFuncionariosQtd: 0,
          lancheJovensManhaQtd: 0,
          lancheJovensQtd: 0,
          outrasDescricao: "",
          outrasTotalQtd: 0,
          outrasFuncionariosQtd: 0,
          outrasJovensQtd: 0,
          outrasJovensTardeQtd: 0,
          sobrasDescricao: "",
          observacaoDescricao: "",
          desperdicioQtd: 0,
        });
      })
      .catch((error) => {
        console.error("Erro ao salvar refeição:", error);
        toast.error("Erro ao salvar refeição. Tente novamente.", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      });
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-8 font-sans">
      <ToastContainer />
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-10">
          🍽️ Cadastro de Refeições
        </h2>

        <section className="bg-white p-8 rounded-2xl shadow-lg space-y-10">
          {/* Voltar + Data */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <Button
              type="button"
              onClick={handleBack}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg shadow"
            >
              ← Voltar
            </Button>
            <div className="w-full md:w-1/3">
              <Label className="block text-gray-700 font-medium mb-1">Data da Refeição</Label>
              <Input
                type="date"
                id="dataRefeicao"
                value={formData.dataRefeicao}
                onChange={handleDateChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Refeições */}
          {[
            { id: "cafe", label: "☕ Café da Manhã" },
            { id: "almoco", label: "🍛 Almoço" },
            { id: "lanche", label: "🍩 Lanche" },
            { id: "outras", label: "🍽️ Outras Refeições" },
          ].map(({ id, label }) => (
            <div key={id} className="bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{label}</h3>
              <textarea
                id={`${id}Descricao`}
                value={formData[`${id}Descricao`]}
                onChange={handleChange}
                placeholder="Descrição..."
                className="w-full p-4 border border-gray-300 rounded-lg h-32 mb-4 resize-y"
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-gray-700 font-medium">Total</Label>
                  <Input
                    type="number"
                    id={`${id}TotalQtd`}
                    value={formData[`${id}TotalQtd`]}
                    onChange={handleChange}
                    min={0}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Funcionários</Label>
                  <Input
                    type="number"
                    id={`${id}FuncionariosQtd`}
                    value={formData[`${id}FuncionariosQtd`]}
                    onChange={handleChange}
                    min={0}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Jovens Manhã</Label>
                  <Input
                    type="number"
                    id={`${id}JovensManhaQtd`}
                    value={formData[`${id}JovensManhaQtd`] || ""}
                    onChange={handleChange}
                    min={0}
                    disabled={formData[`${id}JovensManhaQtd`] === undefined}
                    className={`w-full p-3 border border-gray-300 rounded-lg ${
                      formData[`${id}JovensManhaQtd`] === undefined ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Jovens Tarde</Label>
                  <Input
                    type="number"
                    id={`${id}JovensTardeQtd`}
                    value={formData[`${id}JovensTardeQtd`] || ""}
                    onChange={handleChange}
                    min={0}
                    disabled={formData[`${id}JovensTardeQtd`] === undefined}
                    className={`w-full p-3 border border-gray-300 rounded-lg ${
                      formData[`${id}JovensTardeQtd`] === undefined ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Sobras e Observações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-700 font-medium">♻️ Sobras / Restos</Label>
              <textarea
                id="sobrasDescricao"
                value={formData.sobrasDescricao}
                onChange={handleChange}
                placeholder="Descreva as sobras ou restos..."
                className="w-full p-4 border border-gray-300 rounded-lg h-32 resize-y mt-2"
              />
            </div>
            <div>
              <Label className="text-gray-700 font-medium">📝 Observações</Label>
              <textarea
                id="observacaoDescricao"
                value={formData.observacaoDescricao}
                onChange={handleChange}
                placeholder="Observações gerais..."
                className="w-full p-4 border border-gray-300 rounded-lg h-32 resize-y mt-2"
              />
            </div>
          </div>

          {/* Desperdício */}
          <div className="flex items-center gap-4">
            <Label className="text-gray-700 font-medium">🗑️ Desperdício (Qtd.):</Label>
            <Input
              type="number"
              id="desperdicioQtd"
              value={formData.desperdicioQtd}
              onChange={handleChange}
              min={0}
              className="w-32 p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Salvar */}
          <Button
            type="button"
            onClick={salvarNoBanco}
            className="w-full py-4 bg-pink-600 text-white font-semibold text-lg rounded-xl hover:bg-pink-700 transition"
          >
            💾 Salvar Refeição
          </Button>
        </section>
      </div>
    </div>
  );
}
