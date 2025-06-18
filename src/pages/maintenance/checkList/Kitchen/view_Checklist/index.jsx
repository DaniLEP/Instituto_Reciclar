import { useEffect, useState } from "react";
import { db } from "../../../../../../firebase";
import { ref, onValue } from "firebase/database";
import {  isWithinInterval, parseISO } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button/button";
import { Input } from "@/components/ui/input";

export default function ChecklistConsulta() {
  const [checklists, setChecklists] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checklistRef = ref(db, "checklists");
    onValue(checklistRef, (snapshot) => {
      const data = snapshot.val();
      const lista = data
        ? Object.values(data).map((item) => ({ ...item, data: item.data }))
        : [];
      setChecklists(lista);
      setFiltered(lista);
      setLoading(false);
    });
  }, []);


    const formatDate = (timestamp) => {
    if (!timestamp) return "Data inválida";
    let date = typeof timestamp === "string" ? new Date(Date.parse(timestamp)) : new Date(timestamp);
    if (isNaN(date.getTime())) return "Data inválida";
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const day = String(localDate.getDate()).padStart(2, "0");
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const year = localDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleFilter = () => {
    if (!startDate || !endDate) return;

    const filteredData = checklists.filter((item) =>
      isWithinInterval(parseISO(item.data), {
        start: parseISO(startDate),
        end: parseISO(endDate),
      })
    );
    setFiltered(filteredData);
  };

  const exportToExcel = () => {
    const rows = [];
    filtered.forEach((entry) => {
      Object.entries(entry.checklist).forEach(([secao, itens]) => {
        Object.entries(itens).forEach(([item, info]) => {
          rows.push({
            Data: entry.data,
            Seção: secao,
            Item: item,
            Resposta: info.resposta,
            Observação: info.observacao || "",
          });
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Checklists");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `checklists_${formatDate(new Date(), "yyyyMMdd")}.xlsx`);
  };

  return (
    <main className="max-w-7xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Consulta de Checklists</h1>
        <p className="text-gray-600 mt-1 max-w-xl">
          Filtre e exporte seus checklists para análise detalhada.
        </p>
      </header>

      <section
        aria-label="Filtro de datas"
        className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6 items-end mb-10"
      >
        <div className="flex flex-col flex-1 max-w-xs">
          <Label htmlFor="startDate" className="font-semibold text-gray-700 mb-1">
            Data Início
          </Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col flex-1 max-w-xs">
          <Label htmlFor="endDate" className="font-semibold text-gray-700 mb-1">
            Data Fim
          </Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleFilter}
            className="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-semibold px-6 py-2 rounded transition"
            aria-label="Filtrar checklist por data"
          >
            Filtrar
          </Button>
          <Button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-white font-semibold px-6 py-2 rounded transition"
            aria-label="Exportar checklists filtrados para Excel"
          >
            Exportar Excel
          </Button>
        </div>
      </section>

      <section
        aria-live="polite"
        aria-relevant="additions removals"
        className="space-y-8 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {loading ? (
          <p className="text-gray-500">Carregando checklists...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-600 italic">Nenhum checklist encontrado para o intervalo selecionado.</p>
        ) : (
          filtered.map((entry, index) => (
            <article
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <header className="mb-4 flex justify-between items-center border-b border-gray-200 pb-2">
                <h2 className="text-xl font-bold text-gray-800">
                  Checklist Cozinha Reiclar
                </h2>
                <time
                  dateTime={entry.data}
                  className="text-sm text-gray-500 font-mono"
                  title={formatDate(parseISO(entry.data), "PPPP")}
                >
                  {formatDate(parseISO(entry.data), "dd/MM/yyyy")}
                </time>
              </header>

              <div className="space-y-6">
                {Object.entries(entry.checklist).map(([section, items]) => (
                  <section key={section} aria-labelledby={`section-${index}-${section}`}>
                    <h3
                      id={`section-${index}-${section}`}
                      className="text-lg font-semibold text-green-700 mb-3 border-l-4 border-green-500 pl-3"
                    >
                      {section}
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {Object.entries(items).map(([item, info]) => (
                        <li
                          key={item}
                          className="flex flex-col md:flex-row md:items-center justify-between gap-2"
                        >
                          <span className="font-semibold">{item}:</span>
                          <span
                            className={`font-medium ${
                              info.resposta === "Sim"
                                ? "text-green-600"
                                : info.resposta === "Não"
                                ? "text-red-600"
                                : "text-gray-700"
                            }`}
                          >
                            {info.resposta}
                          </span>

                          {info.resposta === "Não" && info.observacao && (
                            <span
                              className="text-red-600 text-sm italic flex items-center gap-1"
                              title="Observação"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M12 9v2m0 4v.01"
                                />
                              </svg>
                              Obs: {info.observacao}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
