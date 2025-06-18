import React, { useEffect, useState, useMemo } from "react";
import { ref as dbRef, onValue } from "firebase/database";
import { db } from "../../../../../firebase";
import { motion, AnimatePresence } from "framer-motion";

const RECEITAS_POR_PAGINA = 5;

const ConsultaReceitas = () => {
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);

  // Filtros
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroClassificacao, setFiltroClassificacao] = useState("");

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);

  // Quantidade de pessoas para o modal
  const [qtdPessoas, setQtdPessoas] = useState(1);

  // Ingredientes editáveis no modal
  const [ingredientesEditaveis, setIngredientesEditaveis] = useState([]);

  useEffect(() => {
    const receitasRef = dbRef(db, "receitas");

    onValue(receitasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const listaReceitas = Object.entries(data).map(([id, receita]) => ({
          id,
          ...receita,
        }));
        setReceitas(listaReceitas);
      } else {
        setReceitas([]);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (receitaSelecionada) {
      const ingredientesArray = receitaSelecionada.ingredientes
        ? Array.isArray(receitaSelecionada.ingredientes)
          ? receitaSelecionada.ingredientes
          : Object.values(receitaSelecionada.ingredientes)
        : [];

      const ingredientesComQuantidade = ingredientesArray.map((ing) => ({
        nome: ing.nome,
        peso: Number((ing.peso * qtdPessoas).toFixed(2)),
      }));
      setIngredientesEditaveis(ingredientesComQuantidade);
    } else {
      setIngredientesEditaveis([]);
      setQtdPessoas(1);
    }
  }, [receitaSelecionada, qtdPessoas]);

  const alterarPesoIngrediente = (index, novoPeso) => {
    setIngredientesEditaveis((ingredientes) => {
      const novaLista = [...ingredientes];
      novaLista[index].peso = novoPeso === "" ? "" : Number(novoPeso);
      return novaLista;
    });
  };

  const receitasFiltradas = useMemo(() => {
    return receitas.filter((r) => {
      const nomeMatch = (r.nome || "")
        .toLowerCase()
        .includes(filtroNome.toLowerCase());
      const classificacaoMatch = filtroClassificacao
        ? (r.classificacao || "").toLowerCase() === filtroClassificacao.toLowerCase()
        : true;
      return nomeMatch && classificacaoMatch;
    });
  }, [receitas, filtroNome, filtroClassificacao]);

  const totalPaginas = Math.ceil(receitasFiltradas.length / RECEITAS_POR_PAGINA);
  const receitasPaginaAtual = receitasFiltradas.slice(
    (paginaAtual - 1) * RECEITAS_POR_PAGINA,
    paginaAtual * RECEITAS_POR_PAGINA
  );

  const irParaPagina = (num) => {
    if (num < 1 || num > totalPaginas) return;
    setPaginaAtual(num);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-green-700 font-semibold text-xl">
        Carregando receitas...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-green-800 tracking-wide">
        Consulta de Receitas
      </h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-6 justify-center mb-8">
        <input
          type="text"
          placeholder="Filtrar por nome"
          aria-label="Filtrar por nome"
          className="border border-green-400 rounded-lg px-5 py-3 w-72 shadow-sm transition focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={filtroNome}
          onChange={(e) => {
            setFiltroNome(e.target.value);
            setPaginaAtual(1);
          }}
        />

        <select
          className="border border-green-400 rounded-lg px-5 py-3 w-72 shadow-sm transition focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={filtroClassificacao}
          aria-label="Filtrar por classificação"
          onChange={(e) => {
            setFiltroClassificacao(e.target.value);
            setPaginaAtual(1);
          }}
        >
          <option value="">Todas as Classificações</option>
          {[...new Set(receitas.map((r) => r.classificacao))].map((classif) => (
            <option key={classif} value={classif}>
              {classif}
            </option>
          ))}
        </select>
      </div>

      {/* Tabela */}
      {receitasFiltradas.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Nenhuma receita encontrada.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg border border-green-300">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-green-200 text-green-900 font-semibold select-none">
              <tr>
                <th className="border border-green-300 px-6 py-3">Foto</th>
                <th className="border border-green-300 px-6 py-3 text-left">Nome</th>
                <th className="border border-green-300 px-6 py-3 text-left">Classificação</th>
                <th className="border border-green-300 px-6 py-3 text-center">Prazo Refrigerado</th>
                <th className="border border-green-300 px-6 py-3 text-center">Prazo Congelado</th>
                <th className="border border-green-300 px-6 py-3 text-left">Nutricionista</th>
                <th className="border border-green-300 px-6 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {receitasPaginaAtual.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-green-50 cursor-pointer transition-colors"
                  onClick={() => setReceitaSelecionada(r)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setReceitaSelecionada(r);
                  }}
                  aria-label={`Visualizar detalhes da receita ${r.nome}`}
                >
                  <td className="border border-green-300 p-2 text-center">
                    {r.imagemBase64 ? (
                      <img
                        src={r.imagemBase64}
                        alt={`Foto de ${r.nome}`}
                        className="w-16 h-16 object-cover rounded-lg mx-auto"
                      />
                    ) : (
                      <span className="text-gray-400 italic">Sem foto</span>
                    )}
                  </td>
                  <td className="border border-green-300 px-6 py-3">{r.nome}</td>
                  <td className="border border-green-300 px-6 py-3">{r.classificacao}</td>
                  <td className="border border-green-300 px-6 py-3 text-center">
                    {r.prazoValidade?.refrigerado || "-"}
                  </td>
                  <td className="border border-green-300 px-6 py-3 text-center">
                    {r.prazoValidade?.congelado || "-"}
                  </td>
                  <td className="border border-green-300 px-6 py-3">
                    {`Nutri: ${r.nutricionista?.nome || "-"}, CRN: ${r.nutricionista?.crn3 || "-"}`}
                  </td>
                  <td className="border border-green-300 px-6 py-3 text-center">
                    <button
                      className="text-green-700 hover:underline font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReceitaSelecionada(r);
                      }}
                      aria-label={`Ver detalhes da receita ${r.nome}`}
                    >
                      Ver detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginação */}
      {totalPaginas > 1 && (
        <nav
          className="mt-6 flex justify-center items-center gap-3 select-none"
          aria-label="Navegação de páginas"
        >
          <button
            className="px-4 py-2 rounded-lg bg-green-200 text-green-700 hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            onClick={() => irParaPagina(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            aria-label="Página anterior"
          >
            &lt;
          </button>

          {[...Array(totalPaginas)].map((_, i) => {
            const numero = i + 1;
            return (
              <button
                key={numero}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  numero === paginaAtual
                    ? "bg-green-700 text-white shadow-lg"
                    : "bg-green-200 text-green-700 hover:bg-green-300"
                }`}
                onClick={() => irParaPagina(numero)}
                aria-current={numero === paginaAtual ? "page" : undefined}
              >
                {numero}
              </button>
            );
          })}

          <button
            className="px-4 py-2 rounded-lg bg-green-200 text-green-700 hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            onClick={() => irParaPagina(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            aria-label="Próxima página"
          >
            &gt;
          </button>
        </nav>
      )}

      {/* Modal Detalhes */}
      <AnimatePresence>
        {receitaSelecionada && (
          <motion.div
            key="modal"
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-6 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReceitaSelecionada(null)}
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-title"
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              tabIndex={-1}
            >
              <button
                className="absolute top-5 right-5 text-gray-600 hover:text-gray-900 text-4xl font-extrabold focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                onClick={() => setReceitaSelecionada(null)}
                aria-label="Fechar modal de detalhes da receita"
              >
                &times;
              </button>

              <h2
                id="modal-title"
                className="text-4xl font-extrabold mb-6 text-green-800 tracking-tight"
              >
                {receitaSelecionada.nome}
              </h2>

              {receitaSelecionada.imagemBase64 && (
                <img
                  src={receitaSelecionada.imagemBase64}
                  alt={`Foto de ${receitaSelecionada.nome}`}
                  className="w-full max-h-72 object-cover rounded-lg mb-8 shadow-md"
                />
              )}

              {/* Quantidade de Pessoas */}
              <div className="mb-8 max-w-xs">
                <label
                  htmlFor="qtdPessoas"
                  className="block mb-2 font-semibold text-green-700 text-lg"
                >
                  Quantidade de Pessoas:
                </label>
                <input
                  type="number"
                  id="qtdPessoas"
                  min={1}
                  className="border border-green-400 rounded-lg px-4 py-3 w-full shadow-sm focus:outline-green-600 focus:ring-2 focus:ring-green-500 transition"
                  value={qtdPessoas}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val > 0) setQtdPessoas(val);
                  }}
                  aria-describedby="qtdPessoasHelp"
                />
                <small
                  id="qtdPessoasHelp"
                  className="text-gray-500 text-sm mt-1 block"
                >
                  Ajuste para recalcular as quantidades dos ingredientes.
                </small>
              </div>

              {/* Ingredientes */}
              <section className="mb-10">
                <h3 className="text-3xl font-semibold mb-4 text-green-700 border-b border-green-300 pb-2">
                  Ingredientes
                </h3>

                {ingredientesEditaveis.length === 0 ? (
                  <p className="text-gray-500 italic text-lg">
                    Nenhum ingrediente listado.
                  </p>
                ) : (
                  <table className="w-full border-collapse border border-green-300 rounded-lg overflow-hidden shadow-sm">
                    <thead className="bg-green-100 text-green-900 font-semibold select-none">
                      <tr>
                        <th className="border border-green-300 px-4 py-3 text-left">
                          Nome
                        </th>
                        <th className="border border-green-300 px-4 py-3 text-left">
                          Peso (g/ml)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ingredientesEditaveis.map((ing, idx) => (
                        <tr
                          key={idx}
                          className="border border-green-300 hover:bg-green-50 transition-colors"
                        >
                          <td className="border border-green-300 px-4 py-3">
                            {ing.nome}
                          </td>
                          <td className="border border-green-300 px-4 py-3">
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              className="w-28 border border-green-400 rounded px-3 py-2 focus:outline-green-600 focus:ring-2 focus:ring-green-500 transition"
                              value={ing.peso}
                              onChange={(e) =>
                                alterarPesoIngrediente(idx, e.target.value)
                              }
                              aria-label={`Editar peso do ingrediente ${ing.nome}`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>

              {/* Modos e informações adicionais */}
              <section className="mb-8">
                <h3 className="text-3xl font-semibold mb-3 text-green-700 border-b border-green-300 pb-1">
                  Modo de Preparo
                </h3>
                <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {receitaSelecionada.modoPreparo || "Não informado."}
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-3xl font-semibold mb-3 text-green-700 border-b border-green-300 pb-1">
                  Modo de Servir
                </h3>
                <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {receitaSelecionada.modoServir || "Não informado."}
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-3xl font-semibold mb-3 text-green-700 border-b border-green-300 pb-1">
                  Armazenamento
                </h3>
                <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {receitaSelecionada.armazenamento || "Não informado."}
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-3xl font-semibold mb-3 text-green-700 border-b border-green-300 pb-1">
                  Prazo de Validade
                </h3>
                <p>
                  <strong>Refrigerado:</strong>{" "}
                  {receitaSelecionada.prazoValidade?.refrigerado || "-"}
                </p>
                <p>
                  <strong>Congelado:</strong>{" "}
                  {receitaSelecionada.prazoValidade?.congelado || "-"}
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-3xl font-semibold mb-3 text-green-700 border-b border-green-300 pb-1">
                  Dados do Nutricionista
                </h3>
                <p>
                  <strong>Nome:</strong>{" "}
                  {receitaSelecionada.nutricionista?.nome || "-"}
                </p>
                <p>
                  <strong>CRN3:</strong>{" "}
                  {receitaSelecionada.nutricionista?.crn3 || "-"}
                </p>
              </section>

              {/* Botão Imprimir */}
              <div className="flex justify-center mt-4 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition focus:outline-none focus:ring-4 focus:ring-green-400"
                >
                  Imprimir Receita
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConsultaReceitas;
