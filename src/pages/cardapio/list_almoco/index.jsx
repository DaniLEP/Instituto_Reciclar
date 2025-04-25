import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../../../firebase";
import * as XLSX from "xlsx";

const ConsultaCardapio = () => {
  const [cardapios, setCardapios] = useState([]);
  const [filtroInicio, setFiltroInicio] = useState("");
  const [filtroFim, setFiltroFim] = useState("");
  const [filtrados, setFiltrados] = useState([]);

  useEffect(() => {
    const cardapioRef = ref(db, "cardapioAlmoco");
    onValue(cardapioRef, (snapshot) => {
      const data = snapshot.val();
      const lista = data
        ? Object.entries(data).map(([id, valor]) => ({
            id,
            ...valor,
          }))
        : [];
      setCardapios(lista);
      setFiltrados(lista);
    });
  }, []);

  const aplicarFiltro = () => {
    if (!filtroInicio || !filtroFim) {
      setFiltrados(cardapios);
      return;
    }

    const inicioFiltro = new Date(filtroInicio);
    const fimFiltro = new Date(filtroFim);

    const resultado = cardapios.filter((item) => {
      const dataInicio = item.periodo?.dataInicio;
      const dataFim = item.periodo?.dataFim;

      if (!dataInicio || !dataFim) return false;

      const inicioCardapio = new Date(dataInicio);
      const fimCardapio = new Date(dataFim);

      return fimCardapio >= inicioFiltro && inicioCardapio <= fimFiltro;
    });

    setFiltrados(resultado);
  };

  const exportarParaExcel = () => {
    const dados = [];

    filtrados.forEach((item) => {
      Object.entries(item.composicoes || {}).forEach(([semana, dias]) => {
        const linha = {
          'Data Início': item.semana?.dataInicio || "",
          'Data Fim': item.semana?.dataFim || "",
          Semana: semana,
        };
        for (let i = 0; i <= 8; i++) {
          linha[`Dia ${i}`] = dias?.[i] || "";
        }
        dados.push(linha);
      });
    });

    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cardápios");
    XLSX.writeFile(wb, "cardapios.xlsx");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Consulta de Cardápios</h2>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
            <input
              type="date"
              value={filtroInicio}
              onChange={(e) => setFiltroInicio(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
            <input
              type="date"
              value={filtroFim}
              onChange={(e) => setFiltroFim(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={aplicarFiltro}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
            >
              Aplicar Filtro
            </button>
            <button
              onClick={exportarParaExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full"
            >
              Exportar Excel
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 border">Data Início</th>
              <th className="px-4 py-3 border">Data Fim</th>
              <th className="px-4 py-3 border">Semana</th>
              {Array.from({ length: 9 }).map((_, i) => (
                <th key={i} className="px-4 py-3 border">Dia {i}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {filtrados.flatMap((item) =>
              Object.entries(item.composicoes || {}).map(([semana, dias], idx) => (
                <tr key={`${item.id}-${semana}-${idx}`} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{item.periodo?.dataInicio}</td>
                  <td className="px-4 py-2 border">{item.periodo?.dataFim}</td>
                  <td className="px-4 py-2 border capitalize">{semana}</td>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <td key={i} className="px-4 py-2 border">{dias?.[i] || ""}</td>
                  ))}
                </tr>
              ))
            )}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan="12" className="text-center py-4 text-gray-500">
                  Nenhum cardápio encontrado para o período selecionado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsultaCardapio;
