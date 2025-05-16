import React, { useEffect, useState, useMemo } from "react";
import { ref as dbRef, onValue } from "firebase/database";
import { db } from "../../../../../firebase";
import { motion, AnimatePresence } from "framer-motion";

const RECEITAS_POR_PAGINA = 5;

const ConsultaReceitas = () => {
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);

  // Estados para filtros
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroClassificacao, setFiltroClassificacao] = useState("");

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);

  // Novo estado para quantidade de pessoas no modal
  const [qtdPessoas, setQtdPessoas] = useState(1);

  // Novo estado para edição manual dos ingredientes
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

  // Quando muda receitaSelecionada ou qtdPessoas, atualiza ingredientesEditaveis
useEffect(() => {
  if (receitaSelecionada) {
    const ingredientesArray = receitaSelecionada.ingredientes
      ? Array.isArray(receitaSelecionada.ingredientes)
        ? receitaSelecionada.ingredientes
        : Object.values(receitaSelecionada.ingredientes)
      : [];

    const ingredientesComQuantidade = ingredientesArray.map((ing) => ({
      nome: ing.nome,
      peso: ing.peso * qtdPessoas,
    }));
    setIngredientesEditaveis(ingredientesComQuantidade);
  } else {
    setIngredientesEditaveis([]);
    setQtdPessoas(1);
  }
}, [receitaSelecionada, qtdPessoas]);


  // Função para editar peso manualmente
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

  // Calcular paginação
  const totalPaginas = Math.ceil(receitasFiltradas.length / RECEITAS_POR_PAGINA);
  const receitasPaginaAtual = receitasFiltradas.slice(
    (paginaAtual - 1) * RECEITAS_POR_PAGINA,
    paginaAtual * RECEITAS_POR_PAGINA
  );

  // Funções paginação
  const irParaPagina = (num) => {
    if (num < 1 || num > totalPaginas) return;
    setPaginaAtual(num);
  };

  if (loading) {
    return <div className="p-6 text-center">Carregando receitas...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-green-700">
        Consulta de Receitas
      </h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <input
          type="text"
          placeholder="Filtrar por nome"
          className="border rounded px-4 py-2 w-60 focus:outline-green-500"
          value={filtroNome}
          onChange={(e) => {
            setFiltroNome(e.target.value);
            setPaginaAtual(1);
          }}
        />

        <select
          className="border rounded px-4 py-2 w-60 focus:outline-green-500"
          value={filtroClassificacao}
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
        <p className="text-center text-gray-600">Nenhuma receita encontrada.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-300 rounded shadow">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-green-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Foto</th>
                <th className="border border-gray-300 px-4 py-2">Nome</th>
                <th className="border border-gray-300 px-4 py-2">Classificação</th>
                <th className="border border-gray-300 px-4 py-2">Prazo Refrigerado</th>
                <th className="border border-gray-300 px-4 py-2">Prazo Congelado</th>
                <th className="border border-gray-300 px-4 py-2">Elaborado por:</th>
                <th className="border border-gray-300 px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {receitasPaginaAtual.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-green-50 cursor-pointer"
                  onClick={() => setReceitaSelecionada(r)}
                >
                  <td className="border border-gray-300 p-2 text-center">
                    {r.imagemBase64 ? (
                      <img
                        src={r.imagemBase64}
                        alt={`Foto de ${r.nome}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400 italic">Sem foto</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{r.nome}</td>
                  <td className="border border-gray-300 px-4 py-2">{r.classificacao}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {r.prazoValidade?.refrigerado || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {r.prazoValidade?.congelado || "-"}
                  </td>
                   <td className="border border-gray-300 px-4 py-2">Nutri: {r.nutricionista?.nome || "-"}, CRN - {r.nutricionista?.crn3 || "-"}</td>

                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      className="text-green-600 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReceitaSelecionada(r);
                      }}
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
        <div className="mt-4 flex justify-center gap-2 items-center">
          <button
            className="px-3 py-1 rounded bg-green-200 hover:bg-green-300 disabled:opacity-50"
            onClick={() => irParaPagina(paginaAtual - 1)}
            disabled={paginaAtual === 1}
          >
            {"<"}
          </button>

          {[...Array(totalPaginas)].map((_, i) => {
            const numero = i + 1;
            return (
              <button
                key={numero}
                className={`px-3 py-1 rounded ${
                  numero === paginaAtual
                    ? "bg-green-600 text-white"
                    : "bg-green-200 hover:bg-green-300"
                }`}
                onClick={() => irParaPagina(numero)}
              >
                {numero}
              </button>
            );
          })}

          <button
            className="px-3 py-1 rounded bg-green-200 hover:bg-green-300 disabled:opacity-50"
            onClick={() => irParaPagina(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
          >
            {">"}
          </button>
        </div>
      )}

      {/* Modal Detalhes */}
      <AnimatePresence>
        {receitaSelecionada && (
          <motion.div
            key="modal"
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReceitaSelecionada(null)}
          >
            <motion.div
              className="bg-white rounded shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold"
                onClick={() => setReceitaSelecionada(null)}
                aria-label="Fechar"
              >
                &times;
              </button>

              <h2 className="text-3xl font-bold mb-4 text-green-700">{receitaSelecionada.nome}</h2>

              {receitaSelecionada.imagemBase64 && (
                <img
                  src={receitaSelecionada.imagemBase64}
                  alt={`Foto de ${receitaSelecionada.nome}`}
                  className="w-full max-h-64 object-cover rounded mb-6"
                />
              )}

              {/* Campo para quantidade de pessoas */}
              <div className="mb-6">
                <label className="block mb-1 font-semibold" htmlFor="qtdPessoas">
                  Quantidade de Pessoas:
                </label>
                <input
                  type="number"
                  id="qtdPessoas"
                  min={1}
                  className="border rounded px-3 py-2 w-32 focus:outline-green-500"
                  value={qtdPessoas}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val > 0) setQtdPessoas(val);
                  }}
                />
              </div>

              <section className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">Ingredientes</h3>

                {ingredientesEditaveis.length === 0 ? (
                  <p className="text-gray-600">Nenhum ingrediente listado.</p>
                ) : (
                  <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="border border-gray-300 px-3 py-1 text-left">Nome</th>
                        <th className="border border-gray-300 px-3 py-1 text-left">Peso (g/ml)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ingredientesEditaveis.map((ing, idx) => (
                        <tr key={idx} className="border border-gray-300">
                          <td className="border border-gray-300 px-3 py-1">{ing.nome}</td>
                          <td className="border border-gray-300 px-3 py-1">
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              className="w-24 border rounded px-2 py-1 focus:outline-green-500"
                              value={ing.peso}
                              onChange={(e) =>
                                alterarPesoIngrediente(idx, e.target.value)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>

              <section className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">Modo de Preparo</h3>
                <p className="whitespace-pre-line">{receitaSelecionada.modoPreparo}</p>
              </section>

              <section className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">Modo de Servir</h3>
                <p className="whitespace-pre-line">{receitaSelecionada.modoServir}</p>
              </section>

              <section className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">Armazenamento</h3>
                <p className="whitespace-pre-line">{receitaSelecionada.armazenamento}</p>
              </section>

              <section className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">Prazo de Validade</h3>
                <p>Refrigerado: {receitaSelecionada.prazoValidade?.refrigerado || "-"}</p>
                <p>Congelado: {receitaSelecionada.prazoValidade?.congelado || "-"}</p>
              </section>

              <section>
                <h3 className="text-2xl font-semibold mb-2">Dados do Nutricionista</h3>
                <p>Nome: {receitaSelecionada.nutricionista?.nome || "-"}</p>
                <p>CRN3: {receitaSelecionada.nutricionista?.crn3 || "-"}</p>
              </section>

                <div className="flex justify-center mb-4 print:hidden">
                <button
                    onClick={() => window.print()}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
                >
                    Imprimir Receitas
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
