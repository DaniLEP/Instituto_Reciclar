import { useEffect, useState } from "react";
import { db } from "../../../../../../firebase";
import { ref, onValue } from "firebase/database";
import { format, isWithinInterval, parseISO } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button/button";
import { Input } from "@/components/ui/input";

export default function ChecklistConsultaLimpeza() {
  const [checklists, setChecklists] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const checklistRef = ref(db, "checklistsLimpeza");
    onValue(checklistRef, (snapshot) => {
      const data = snapshot.val();
      const lista = data
        ? Object.values(data).map((item) => ({...item, data: item.data})) : [];
      setChecklists(lista);
      setFiltered(lista); }); }, []);

  const handleFilter = () => {
    if (!startDate || !endDate) return;

    const filteredData = checklists.filter((item) =>
      isWithinInterval(parseISO(item.data), {start: parseISO(startDate), end: parseISO(endDate)}));
    setFiltered(filteredData);
  };

  const exportToExcel = () => {
    const rows = [];
    filtered.forEach((entry) => {
      Object.entries(entry.checklist).forEach(([secao, itens]) => {
        Object.entries(itens).forEach(([item, info]) => {
          rows.push({Data: entry.data, Seção: secao, Item: item, Resposta: info.resposta, Observação: info.observacao || "",});
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Checklists_Limpeza");

    const excelBuffer = XLSX.write(workbook, {bookType: "xlsx", type: "array"});
    const blob = new Blob([excelBuffer], {type: "application/octet-stream",});
    saveAs(blob, `checklists_${format(new Date(), "yyyyMMdd")}.xlsx`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Consulta de Checklists - Limpeza</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex flex-col">
          <Label className="font-medium">Data Início:</Label>
          <Input type="date" className="border p-2 rounded" value={startDate}
            onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="flex flex-col">
          <Label className="font-medium">Data Fim:</Label>
          <Input type="date" className="border p-2 rounded" value={endDate}
            onChange={(e) => setEndDate(e.target.value)} /> </div>
          <Button onClick={handleFilter}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-auto hover:bg-blue-700"> Filtrar</Button>
          <Button onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded mt-auto hover:bg-green-700">Exportar Excel</Button>
        </div>

      {filtered.map((entry, index) => (
        <div key={index} className="bg-gray-100 p-4 mb-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-2"> Checklist Cozinha Reiclar - {format(parseISO(entry.data), "dd/MM/yyyy")}</h2>
          {Object.entries(entry.checklist).map(([section, items]) => (
            <div key={section} className="mb-4">
              <h3 className="text-md font-medium text-green-700">{section}</h3>
              <ul className="list-disc pl-5">
                {Object.entries(items).map(([item, info]) => (
                  <li key={item}>
                    <span className="font-semibold">{item}:</span>{" "}
                    {info.resposta} {info.resposta === "Não" && info.observacao && (<span className="text-red-600"> - Obs: {info.observacao}</span> )}
                  </li> ))}
              </ul>
            </div> ))}
        </div>))}
    </div>
  );
}