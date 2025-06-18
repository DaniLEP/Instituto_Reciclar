import { useState } from "react";
import { ref, push } from "firebase/database";
import { db } from "../../../firebase";

export function CadastroProjeto() {
  const [nome, setNome] = useState("");
  const [saldoInicial, setSaldoInicial] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !saldoInicial) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    setMensagem("");

    try {
      const projetoRef = ref(db, "projetos");
      const novoProjeto = {
        nome,
        saldoInicial: parseFloat(saldoInicial),
        saldoAtual: parseFloat(saldoInicial),
        criadoEm: new Date().toISOString(),
      };

      await push(projetoRef, novoProjeto);
      setMensagem("Projeto cadastrado com sucesso!");
      setNome("");
      setSaldoInicial("");
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao salvar projeto.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-xl font-bold text-zinc-800 dark:text-white">Novo Projeto</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm text-zinc-700 dark:text-zinc-300">Nome</label>
          <input
            className="w-full mt-1 p-2 rounded border dark:bg-zinc-800 dark:border-zinc-700 text-sm"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Merenda Escolar"
          />
        </div>
        <div>
          <label className="text-sm text-zinc-700 dark:text-zinc-300">Saldo Inicial (R$)</label>
          <input
            type="number"
            className="w-full mt-1 p-2 rounded border dark:bg-zinc-800 dark:border-zinc-700 text-sm"
            value={saldoInicial}
            onChange={(e) => setSaldoInicial(e.target.value)}
            placeholder="Ex: 5000"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl w-full disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar Projeto"}
        </button>
      </form>
      {mensagem && <p className="text-sm text-center text-zinc-700 dark:text-zinc-300">{mensagem}</p>}
    </div>
  );
}
