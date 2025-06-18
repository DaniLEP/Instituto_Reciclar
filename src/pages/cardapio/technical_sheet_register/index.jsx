import React, { useState } from "react";
import { push, ref as dbRef, serverTimestamp } from "firebase/database";
import { db } from "../../../../firebase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CadastroReceitas = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [classificacao, setClassificacao] = useState("");
  const [utensilios, setUtensilios] = useState("");
  const [espessuraCorte, setEspessuraCorte] = useState("");
  const [ingredientes, setIngredientes] = useState([{ nome: "", peso: "" }]);
  const [modoPreparo, setModoPreparo] = useState("");
  const [modoServir, setModoServir] = useState("");
  const [armazenamento, setArmazenamento] = useState("");
  const [validadeRefrigerado, setValidadeRefrigerado] = useState("");
  const [validadeCongelado, setValidadeCongelado] = useState("");
  const [nomeNutri, setNomeNutri] = useState("");
  const [crn3Nutri, setCrn3Nutri] = useState("");
  const [imagemBase64, setImagemBase64] = useState("");
  const [loading, setLoading] = useState(false);

  // Lê e converte imagem para base64
  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor, selecione um arquivo de imagem válido.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const adicionarIngrediente = () => {
    setIngredientes((prev) => [...prev, { nome: "", peso: "" }]);
  };

  const alterarIngrediente = (index, field, value) => {
    const novosIngredientes = [...ingredientes];
    novosIngredientes[index][field] = value;
    setIngredientes(novosIngredientes);
  };

  const validarCampos = () => {
    if (
      !nome.trim() ||
      !classificacao.trim() ||
      !utensilios.trim() ||
      !espessuraCorte.trim() ||
      ingredientes.some((i) => !i.nome.trim() || !i.peso.trim()) ||
      !modoPreparo.trim() ||
      !modoServir.trim() ||
      !armazenamento.trim() ||
      !validadeRefrigerado.trim() ||
      !validadeCongelado.trim() ||
      !nomeNutri.trim() ||
      !crn3Nutri.trim() ||
      !imagemBase64
    ) {
      return false;
    }
    return true;
  };

  const limparCampos = () => {
    setNome("");
    setClassificacao("");
    setUtensilios("");
    setEspessuraCorte("");
    setIngredientes([{ nome: "", peso: "" }]);
    setModoPreparo("");
    setModoServir("");
    setArmazenamento("");
    setValidadeRefrigerado("");
    setValidadeCongelado("");
    setNomeNutri("");
    setCrn3Nutri("");
    setImagemBase64("");
  };

  const handleSubmit = async () => {
    if (!validarCampos()) {
      toast.warn("Por favor, preencha todos os campos corretamente.");
      return;
    }

    setLoading(true);
    const novaReceita = {
      nome,
      classificacao,
      utensilios,
      espessuraCorte,
      ingredientes,
      modoPreparo,
      modoServir,
      armazenamento,
      prazoValidade: { refrigerado: validadeRefrigerado, congelado: validadeCongelado },
      nutricionista: { nome: nomeNutri, crn3: crn3Nutri },
      imagemBase64,
      dataCadastro: serverTimestamp(),
    };

    try {
      await push(dbRef(db, "receitas"), novaReceita);
      toast.success("Receita cadastrada com sucesso!");
      limparCampos();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar receita. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 to-gray-800 min-h-screen py-12 px-4 sm:px-8 md:px-16 lg:px-24 font-sans">
      {/* ToastContainer para mostrar toasts */}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-200 p-10"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Cadastro de Receitas
          </h1>
          <button
            onClick={() => navigate("/cardapio")}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-5 py-2 shadow-md transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            ← Voltar
          </button>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Input label="Nome da Receita" value={nome} onChange={setNome} />
          <Input label="Classificação do Prato" value={classificacao} onChange={setClassificacao} />
          <Input label="Utensílios" value={utensilios} onChange={setUtensilios} />
          <Input label="Espessura do Corte" value={espessuraCorte} onChange={setEspessuraCorte} />
          <Input label="Prazo Refrigerado" value={validadeRefrigerado} onChange={setValidadeRefrigerado} />
          <Input label="Prazo Congelado" value={validadeCongelado} onChange={setValidadeCongelado} />
          <Input label="Nome do Nutricionista" value={nomeNutri} onChange={setNomeNutri} />
          <Input label="CRN3" value={crn3Nutri} onChange={setCrn3Nutri} />
        </section>

        <section className="mb-10">
          <label className="block text-gray-700 font-semibold mb-3 text-lg">
            Ingredientes e Peso Per Cápita Cru (g/ml)
          </label>

          {ingredientes.map((ingrediente, index) => (
            <div key={index} className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Ingrediente"
                value={ingrediente.nome}
                onChange={(e) => alterarIngrediente(index, "nome", e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
              <input
                type="text"
                placeholder="Peso"
                value={ingrediente.peso}
                onChange={(e) => alterarIngrediente(index, "peso", e.target.value)}
                className="w-32 rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={adicionarIngrediente}
            className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-md transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            + Adicionar Ingrediente
          </button>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Textarea label="Modo de Preparo" value={modoPreparo} onChange={setModoPreparo} />
          <Textarea label="Modo de Servir" value={modoServir} onChange={setModoServir} />
          <Textarea label="Armazenamento" value={armazenamento} onChange={setArmazenamento} />
        </section>

        <section className="mb-8">
          <label className="block font-semibold mb-2 text-lg text-gray-700">Foto da Receita</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImagemChange}
            className="block w-full text-sm text-gray-600 file:rounded-lg file:border-0 file:px-4 file:py-2 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition cursor-pointer"
          />
          {imagemBase64 && (
            <img
              src={imagemBase64}
              alt="Pré-visualização"
              className="mt-4 rounded-xl shadow-lg max-h-64 object-contain border border-gray-300"
            />
          )}
        </section>

        <div className="flex justify-end gap-4">
          <button
            onClick={limparCampos}
            disabled={loading}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
          >
            Limpar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar Receita"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Componentes reutilizáveis
const Input = ({ label, value, onChange }) => (
  <div>
    <label className="block text-gray-800 font-medium mb-2">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div>
    <label className="block text-gray-800 font-medium mb-2">{label}</label>
    <textarea
      rows={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
    />
  </div>
);

export default CadastroReceitas;
