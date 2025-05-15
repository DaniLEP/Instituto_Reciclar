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
    <div className="bg-gradient-to-r from-blue-900 to-gray-800 px-4 py-10 sm:px-8 md:px-16 lg:px-24 font-sans min-h-screen">
      <ToastContainer />
      <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6">
        Cadastro de Refeições
      </h2>
      <section className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg w-full max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            type="button"
            onClick={handleBack}
            className="w-full py-4 bg-[#F20DE7] text-white rounded-lg font-semibold text-base sm:text-lg transition duration-300 hover:bg-[#d10ba1]"
          >
            Voltar
          </Button>
          <Label className="block text-base sm:text-lg font-semibold mt-4">Data da Refeição</Label>
          <Input
            type="date"
            id="dataRefeicao"
            value={formData.dataRefeicao}
            onChange={handleDateChange}
            className="w-full p-4 mt-2 border border-gray-300 rounded-lg text-base"
          />
        </div>

        {/* Café da Manhã */}
        <div className="mb-6">
          <h3 className="text-xl text-gray-800 font-semibold mb-2">Café da Manhã</h3>
          <textarea
            id="cafeDescricao"
            value={formData.cafeDescricao}
            onChange={handleChange}
            placeholder="Descrição..."
            className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-36 resize-y"
          />
          <div className="flex items-center mt-4 space-x-4">
            <Label className="font-semibold text-lg">Total:</Label>
            <Input
              type="number"
              id="cafeTotalQtd"
              value={formData.cafeTotalQtd}
              onChange={handleChange}
              min={0}
              className="w-20 p-2 border border-gray-300 rounded"
            />
            <Label className="font-semibold text-lg">Funcionários:</Label>
            <Input
              type="number"
              id="cafeFuncionariosQtd"
              value={formData.cafeFuncionariosQtd}
              onChange={handleChange}
              min={0}
              className="w-20 p-2 border border-gray-300 rounded"
            />
            <Label className="font-semibold text-lg">Jovens:</Label>
            <Input
              type="number"
              id="cafeJovensQtd"
              value={formData.cafeJovensQtd}
              disabled
              className="w-20 p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Almoço */}
        <div className="mb-6">
          <h3 className="text-xl text-gray-800 font-semibold mb-2">Almoço</h3>
          <textarea
            id="almocoDescricao"
            value={formData.almocoDescricao}
            onChange={handleChange}
            placeholder="Descrição..."
            className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-36 resize-y"
          />
          <div className="flex items-center mt-4 space-x-4 flex-wrap">
            <Label className="font-semibold text-lg">Total:</Label>
            <Input
              type="number"
              id="almocoTotalQtd"
              value={formData.almocoTotalQtd}
              onChange={handleChange}
              min={0}
              className="w-20 p-2 border border-gray-300 rounded"
            />
            <Label className="font-semibold text-lg">Funcionários:</Label>
            <Input
              type="number"
              id="almocoFuncionariosQtd"
              value={formData.almocoFuncionariosQtd}
              onChange={handleChange}
              min={0}
              className="w-20 p-2 border border-gray-300 rounded"
            />
            <Label className="font-semibold text-lg">Jovens Manhã:</Label>
            <Input
              type="number"
              id="almocoJovensQtd"
              value={formData.almocoJovensQtd}
              onChange={handleChange}
              min={0}
              className="w-20 p-2 border border-gray-300 rounded"
            />
            <Label className="font-semibold text-lg">Jovens Tarde:</Label>
            <Input
              type="number"
              id="almocoJovensTardeQtd"
              value={formData.almocoJovensTardeQtd}
              disabled
              className="w-20 p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Lanche */}
        <div className="mb-6">
          <h3 className="text-xl text-gray-800 font-semibold mb-2">Lanche</h3>
          <textarea
            id="lancheDescricao"
            value={formData.lancheDescricao}
            onChange={handleChange}
            placeholder="Descrição..."
            className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-36 resize-y"
          />
          <div className="flex items-center mt-4 space-x-4 flex-wrap">
            <Label className="font-semibold text-lg">Total:</Label>
            <Input
              type="number"
              id="lancheTotalQtd"
              value={formData.lancheTotalQtd}
              onChange={handleChange}
              min={0}
              className="w-20 p-2 border border-gray-300 rounded"
            />
            <Label className="font-semibold text-lg">Funcionários:</Label>
            <Input
              type="number"
              id="lancheFuncionariosQtd"
              value={formData.lancheFuncionariosQtd}
              onChange={handleChange}
              min={0}
              className="w-20 p-2 border border-gray-300 rounded"
            />
            <Label className="font-semibold text-lg">Jovens Manhã:</Label>
            <Input
              type="number"
              id="lancheJovensManhaQtd"
              value={formData.lancheJovensManhaQtd}
              onChange={handleChange}
              min={0}
              className="w-20 p-2 border border-gray-300 rounded"
            />
            <Label className="font-semibold text-lg">Jovens Tarde:</Label>
            <Input
              type="number"
              id="lancheJovensQtd"
              value={formData.lancheJovensQtd}
              disabled
              className="w-20 p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Outras Refeições */}
        <div className="mb-6">
          <h3 className="text-xl text-gray-800 font-semibold mb-2">Outras Refeições</h3>
          <textarea
            id="outrasDescricao"
            value={formData.outrasDescricao}
            onChange={handleChange}
            placeholder="Descrição..."
            className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-36 resize-y"
          />
          <div className="flex items-center mt-4 space-x-4 flex-wrap">
            <Label className="font-semibold text-lg">Total:</Label>
            <Input
              type="number"
              id="outrasTotalQtd"
              value={formData.outrasTotalQtd}
              onChange={handleChange}
              min={0}
              className="w-20 p-2 border border-gray-300 rounded"
            />
            <Label className="font-semibold text-lg">Funcionários:</Label>
            <Input
              type="number"
              id="outrasFuncionariosQtd"
              value={formData.outrasFuncionariosQtd}
              onChange={handleChange}
              min={0}
              className="w-20 p-2 border border-gray-300 rounded"
            />
            <Label className="font-semibold text-lg">Jovens Manhã:</Label>
            <Input
              type="number"
              id="outrasJovensQtd"
              value={formData.outrasJovensQtd}
              onChange={handleChange}
              min={0}
              className="w-20 p-2 border border-gray-300 rounded"
            />
            <Label className="font-semibold text-lg">Jovens Tarde:</Label>
            <Input
              type="number"
              id="outrasJovensTardeQtd"
              value={formData.outrasJovensTardeQtd}
              disabled
              className="w-20 p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Sobras e observações */}
        <div className="mb-6">
          <Label className="font-semibold text-lg">Sobras / Restos</Label>
          <textarea
            id="sobrasDescricao"
            value={formData.sobrasDescricao}
            onChange={handleChange}
            placeholder="Descreva as sobras ou restos..."
            className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-36 resize-y"
          />
        </div>

        <div className="mb-6">
          <Label className="font-semibold text-lg">Observações</Label>
          <textarea
            id="observacaoDescricao"
            value={formData.observacaoDescricao}
            onChange={handleChange}
            placeholder="Observações gerais..."
            className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-36 resize-y"
          />
        </div>

        {/* Desperdício */}
        <div className="mb-6 flex items-center space-x-4">
          <Label className="font-semibold text-lg">Desperdício (Qtd.):</Label>
          <Input
            type="number"
            id="desperdicioQtd"
            value={formData.desperdicioQtd}
            onChange={handleChange}
            min={0}
            className="w-24 p-2 border border-gray-300 rounded"
          />
        </div>

        <Button
          type="button"
          onClick={salvarNoBanco}
          className="w-full py-4 bg-[#F20DE7] text-white rounded-lg font-semibold text-base sm:text-lg transition duration-300 hover:bg-[#d10ba1]"
        >
          Salvar
        </Button>
      </section>
    </div>
  );
}
