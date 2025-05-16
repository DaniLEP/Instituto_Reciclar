import React, { useState } from "react";
import { push, ref as dbRef, serverTimestamp } from "firebase/database";
import { db } from "../../../../firebase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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

  const handleSubmit = async () => {
    if (
      !nome ||
      !classificacao ||
      !utensilios ||
      !espessuraCorte ||
      ingredientes.some((i) => !i.nome || !i.peso) ||
      !modoPreparo ||
      !modoServir ||
      !armazenamento ||
      !validadeRefrigerado ||
      !validadeCongelado ||
      !nomeNutri ||
      !crn3Nutri ||
      !imagemBase64
    ) {
      alert("Preencha todos os campos corretamente.");
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
      prazoValidade: {
        refrigerado: validadeRefrigerado,
        congelado: validadeCongelado,
      },
      nutricionista: {
        nome: nomeNutri,
        crn3: crn3Nutri,
      },
      imagemBase64,
      dataCadastro: serverTimestamp(),
    };

    try {
      await push(dbRef(db, "receitas"), novaReceita);
      alert("Receita cadastrada com sucesso!");
      limparCampos();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar receita.");
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="bg-gradient-to-r from-blue-900 to-gray-800 px-4 py-10 sm:px-8 md:px-16 lg:px-24 font-sans min-h-screen">
    <motion.div
      className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-6 border border-gray-200"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Cadastro de Receitas</h2>
        <button
          onClick={() => navigate('/cardapio')}
          className="text-sm text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded shadow transition"
        >
          ← Voltar
        </button>
      </div>

      {/* Campos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nome da Receita" value={nome} onChange={setNome} />
        <Input label="Classificação do Prato" value={classificacao} onChange={setClassificacao} />
        <Input label="Utensílios" value={utensilios} onChange={setUtensilios} />
        <Input label="Espessura do Corte" value={espessuraCorte} onChange={setEspessuraCorte} />
        <Input label="Prazo Refrigerado" value={validadeRefrigerado} onChange={setValidadeRefrigerado} />
        <Input label="Prazo Congelado" value={validadeCongelado} onChange={setValidadeCongelado} />
        <Input label="Nome do Nutricionista" value={nomeNutri} onChange={setNomeNutri} />
        <Input label="CRN3" value={crn3Nutri} onChange={setCrn3Nutri} />
      </div>

      {/* Ingredientes */}
      <div className="mt-6">
        <label className="font-semibold block mb-2">Ingredientes e Peso Per Cápita Cru (g/ml)</label>
        {ingredientes.map((ingrediente, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Ingrediente"
              value={ingrediente.nome}
              onChange={(e) => alterarIngrediente(index, "nome", e.target.value)}
              className="flex-1 px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Peso"
              value={ingrediente.peso}
              onChange={(e) => alterarIngrediente(index, "peso", e.target.value)}
              className="w-32 px-3 py-2 border rounded"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={adicionarIngrediente}
          className="mt-2 mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Adicionar Ingrediente
        </button>
      </div>

      {/* Textareas */}
      <Textarea label="Modo de Preparo" value={modoPreparo} onChange={setModoPreparo} />
      <Textarea label="Modo de Servir" value={modoServir} onChange={setModoServir} />
      <Textarea label="Armazenamento" value={armazenamento} onChange={setArmazenamento} />

      {/* Upload de Imagem */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">Foto da Receita</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImagemChange}
          className="block w-full text-sm text-gray-500"
        />
        {imagemBase64 && (
          <img
            src={imagemBase64}
            alt="Pré-visualização"
            className="mt-2 rounded shadow max-h-48 object-contain"
          />
        )}
      </div>

      {/* Botões */}
      <div className="flex gap-4 justify-end mt-6">
        <button
          onClick={limparCampos}
          className="px-5 py-2 rounded border text-gray-700 hover:bg-gray-100 transition"
        >
          Limpar
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar Receita"}
        </button>
      </div>
    </motion.div>
    </div>
  );
};

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="block font-semibold mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded px-3 py-2"
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block font-semibold mb-1">{label}</label>
    <textarea
      rows={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded px-3 py-2"
    />
  </div>
);

export default CadastroReceitas;
