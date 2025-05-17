import  { useEffect, useState, useMemo, useRef } from "react";
import { ref as dbRef, onValue } from "firebase/database";
import { db } from "../../../../../firebase";
import { motion, AnimatePresence } from "framer-motion";

const RECEITAS_POR_PAGINA = 5;
const ConsultaReceitas = () => {
  const [receitas, setReceitas] = useState([]);
  const printRef = useRef();
  const [modoEdicao, setModoEdicao] = useState(false);
  const [loading, setLoading] = useState(true);
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroClassificacao, setFiltroClassificacao] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [qtdPessoas, setQtdPessoas] = useState(1);
  const [ingredientesEditaveis, setIngredientesEditaveis] = useState([]);

  useEffect(() => {const receitasRef = dbRef(db, "receitas");
    onValue(receitasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
      const listaReceitas = Object.entries(data).map(([id, receita]) => ({id,...receita, })); setReceitas(listaReceitas);} 
      else {setReceitas([]);} 
      setLoading(false);});
    }, []);

  // Quando muda receitaSelecionada ou qtdPessoas, atualiza ingredientesEditaveis
  useEffect(() => {
    if (receitaSelecionada) {
    const ingredientesArray = receitaSelecionada.ingredientes ? Array.isArray(receitaSelecionada.ingredientes) ? receitaSelecionada.ingredientes : Object.values(receitaSelecionada.ingredientes) : [];
    const ingredientesComQuantidade = ingredientesArray.map((ing) => ({nome: ing.nome, peso: ing.peso * qtdPessoas, })); setIngredientesEditaveis(ingredientesComQuantidade);} 
    else {setIngredientesEditaveis([]); setQtdPessoas(1);}
  }, [receitaSelecionada, qtdPessoas]);

  // Função para editar peso manualmente
  const alterarPesoIngrediente = (index, novoPeso) => {
    setIngredientesEditaveis((ingredientes) => {
      const novaLista = [...ingredientes]; novaLista[index].peso = novoPeso === "" ? "" : Number(novoPeso); return novaLista;
    });
  };

  // ** Função para remover ingrediente **
  const removerIngrediente = (index) => {
    setIngredientesEditaveis((ingredientes) => {
      const novaLista = [...ingredientes]; novaLista.splice(index, 1); return novaLista;});
  };

  const receitasFiltradas = useMemo(() => {
    return receitas.filter((r) => {
      const nomeMatch = (r.nome || "").toLowerCase() .includes(filtroNome.toLowerCase());
      const classificacaoMatch = filtroClassificacao ? (r.classificacao || "").toLowerCase() === filtroClassificacao.toLowerCase() : true; return nomeMatch && classificacaoMatch;
    });}, [receitas, filtroNome, filtroClassificacao]);

  // Calcular paginação
  const totalPaginas = Math.ceil(receitasFiltradas.length / RECEITAS_POR_PAGINA);
  const receitasPaginaAtual = receitasFiltradas.slice((paginaAtual - 1) * RECEITAS_POR_PAGINA, paginaAtual * RECEITAS_POR_PAGINA);

  // Funções paginação
  const irParaPagina = (num) => {if (num < 1 || num > totalPaginas) return; setPaginaAtual(num);};
  if (loading) {return <div className="p-6 text-center">Carregando receitas...</div>;}

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold mb-10 text-center text-green-700">Consulta de Receitas</h1>

      {/* Filtros */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <input type="text" placeholder="Filtrar por nome"
          className="w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none" value={filtroNome}
          onChange={(e) => {setFiltroNome(e.target.value); setPaginaAtual(1);}}/>

        <select className="w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          value={filtroClassificacao} onChange={(e) => {setFiltroClassificacao(e.target.value); setPaginaAtual(1);}}>
          <option value="">Todas as Classificações</option>
          {[...new Set(receitas.map((r) => r.classificacao))].map((classif) => (
            <option key={classif} value={classif}>{classif}</option>
          ))}
        </select>
      </div>

      {/* Tabela */}
      {receitasFiltradas.length === 0 ? ( <p className="text-center text-gray-500 italic">Nenhuma receita encontrada.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
          <table className="w-full table-auto text-sm text-left border-collapse">
            <thead className="bg-green-100 text-green-800 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 border border-gray-200">Foto</th>
                <th className="px-4 py-3 border border-gray-200">Nome</th>
                <th className="px-4 py-3 border border-gray-200">Classificação</th>
                <th className="px-4 py-3 border border-gray-200">Prazo Refrigerado</th>
                <th className="px-4 py-3 border border-gray-200">Prazo Congelado</th>
                <th className="px-4 py-3 border border-gray-200">Elaborado por</th>
                <th className="px-4 py-3 border border-gray-200 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {receitasPaginaAtual.map((r) => (
                <tr key={r.id}
                  className="hover:bg-green-50 transition cursor-pointer" onClick={() => setReceitaSelecionada(r)}>
                  <td className="px-4 py-3 border border-gray-200 text-center">{r.imagemBase64 ? (
                      <img src={r.imagemBase64} alt={`Foto de ${r.nome}`} className="w-14 h-14 object-cover rounded"/>) :
                         (<span className="text-gray-400 italic">Sem foto</span>)} </td>
                  <td className="px-4 py-3 border border-gray-200">{r.nome}</td>
                  <td className="px-4 py-3 border border-gray-200">{r.classificacao}</td>
                  <td className="px-4 py-3 border border-gray-200">{r.prazoValidade?.refrigerado || "-"}</td>
                  <td className="px-4 py-3 border border-gray-200">{r.prazoValidade?.congelado || "-"}</td>
                  <td className="px-4 py-3 border border-gray-200">Nutri: {r.nutricionista?.nome || "-"}, CRN - {r.nutricionista?.crn3 || "-"}</td>
                  <td className="px-4 py-3 border border-gray-200 text-center">
                    <button className="text-green-600 hover:underline"
                      onClick={(e) => {e.stopPropagation(); setReceitaSelecionada(r);}}>Ver detalhes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="mt-4 flex justify-center gap-2 text-green-700">
          <button className="px-3 py-1 rounded border border-green-600 hover:bg-green-600 hover:text-white transition"
            onClick={() => irParaPagina(paginaAtual - 1)} disabled={paginaAtual === 1}>Anterior</button>
          {[...Array(totalPaginas)].map((_, i) => (
            <button key={i} className={`px-3 py-1 rounded border ${
              paginaAtual === i + 1 ? "bg-green-600 text-white" : "border-green-600 text-green-700 hover:bg-green-600 hover:text-white"}`}
              onClick={() => irParaPagina(i + 1)}>{i + 1}</button>
          ))}
          <button className="px-3 py-1 rounded border border-green-600 hover:bg-green-600 hover:text-white transition"
            onClick={() => irParaPagina(paginaAtual + 1)} disabled={paginaAtual === totalPaginas}>Próximo</button>
        </div>
       )}

      {/* Modal de Detalhes */}
      <AnimatePresence>
        {receitaSelecionada && (
          <motion.div key="modal" className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => {setModoEdicao(false); setReceitaSelecionada(null); setQtdPessoas(1); setIngredientesEditaveis([]);}}>
            <motion.div className="bg-white max-w-5xl max-h-[90vh] w-full p-6 rounded-lg overflow-y-auto relative"
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} onClick={(e) => e.stopPropagation()}>
              {/* Botão fechar */}
              <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold"
                onClick={() => {setModoEdicao(false); setReceitaSelecionada(null); setQtdPessoas(1); setIngredientesEditaveis([]);}}>&times;</button>

              <div className="mb-6 flex flex-col md:flex-row md:gap-8">
                <div className="md:w-1/3">
                  {receitaSelecionada.imagemBase64 ? (
                    <img src={receitaSelecionada.imagemBase64} alt={`Foto de ${receitaSelecionada.nome}`} className="w-full h-auto rounded-lg object-cover" />
                  ) : (<div className="w-full h-48 bg-gray-100 flex justify-center items-center rounded-lg text-gray-400 italic">Sem imagem</div>)}
                </div>

                <div className="md:w-2/3">
                  <h2 className="text-3xl font-semibold mb-2 text-green-700">{receitaSelecionada.nome}</h2>
                  <p className="mb-2 font-semibold"> Classificação: {receitaSelecionada.classificacao}</p>
                  <div className="mb-4">
                    <label className="font-semibold mr-2">Quantidade de pessoas:</label>
                    <input type="number" min="1"
                      className="border border-gray-300 rounded px-2 py-1 w-20" value={qtdPessoas} onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val > 0) setQtdPessoas(val);}}/>
                  </div>

                  {/* Ingredientes */}
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Ingredientes</h3>
                    {ingredientesEditaveis.length === 0 && (<p className="italic text-gray-500">Nenhum ingrediente listado.</p>)}

                    <table className="w-full text-left border-collapse border border-gray-300 mb-4">
                      <thead>
                        <tr className="bg-green-100 text-green-800">
                          <th className="border border-gray-300 px-3 py-2">Nome</th>
                          <th className="border border-gray-300 px-3 py-2">Peso (g/ml)</th>
                          {modoEdicao && (<th className="border border-gray-300 px-3 py-2 text-center">Ações</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {ingredientesEditaveis.map((ing, i) => (
                          <tr key={i} className="border border-gray-300">
                            <td className="border border-gray-300 px-3 py-2">{ing.nome}</td>
                            <td className="border border-gray-300 px-3 py-2">
                              {modoEdicao ? (
                                <input type="number" value={ing.peso}
                                  onChange={(e) => alterarPesoIngrediente(i, e.target.value)}
                                  className="border border-gray-300 rounded px-2 py-1 w-24" min="0"/>) : (ing.peso)}</td>
                              {modoEdicao && (
                                <td className="border border-gray-300 px-3 py-2 text-center">
                                  <button className="text-red-600 hover:text-red-900 font-semibold" onClick={() => removerIngrediente(i)}>Remover</button>
                                </td>
                              )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Modo de Preparo */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">Modo de Preparo</h3>
                    {modoEdicao ? (
                      <textarea className="w-full border border-gray-300 rounded p-2" rows={4} value={receitaSelecionada.modoPreparo || ""}
                        onChange={(e) => setReceitaSelecionada((prev) => ({...prev, modoPreparo: e.target.value}))} />) : (<p className="whitespace-pre-line">{receitaSelecionada.modoPreparo}</p>)}
                  </div>

                  {/* Modo de Servir */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">Modo de Servir</h3>
                    {modoEdicao ? (
                      <textarea className="w-full border border-gray-300 rounded p-2" rows={3} value={receitaSelecionada.modoServir || ""}
                        onChange={(e) => setReceitaSelecionada((prev) => ({...prev, modoServir: e.target.value, }))} />) : (<p className="whitespace-pre-line">{receitaSelecionada.modoServir}</p>)}
                  </div>

                  {/* Armazenamento */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">Armazenamento</h3>
                    {modoEdicao ? (
                      <textarea className="w-full border border-gray-300 rounded p-2"
                        rows={3} value={receitaSelecionada.armazenamento || ""}
                        onChange={(e) => setReceitaSelecionada((prev) => ({...prev, armazenamento: e.target.value,}))} />) : (<p className="whitespace-pre-line">{receitaSelecionada.armazenamento}</p>)}
                  </div>

                  {/* Prazo de Validade */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">Prazo de Validade</h3>
                    <p>Refrigerado:{" "}{receitaSelecionada.prazoValidade?.refrigerado || "Não informado"}</p>
                    <p>Congelado:{" "} {receitaSelecionada.prazoValidade?.congelado || "Não informado"}</p>
                  </div>

                  {/* Nutricionista */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">Nutricionista</h3>
                    <p>Nome: {receitaSelecionada.nutricionista?.nome || "-"}</p>
                    <p>CRN: {receitaSelecionada.nutricionista?.crn3 || "-"}</p>
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    {!modoEdicao && (<button onClick={() => setModoEdicao(true)}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition">Editar Ingredientes </button>
                    )}
                    {modoEdicao && (
                      <button onClick={() => setModoEdicao(false)}
                        className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition">Cancelar </button>
                    )} <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg" >Imprimir</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConsultaReceitas;