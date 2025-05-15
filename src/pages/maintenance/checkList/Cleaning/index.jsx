import { useState } from "react";
import { db } from "../../../../../firebase";
import { ref, push } from "firebase/database";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button/button";
import { Label } from "@/components/ui/label";

const checklistStructure = {
  "Limpeza": [

  ]
};

export default function ChecklistLimpeza() {
  const [selectedDate, setSelectedDate] = useState("");
  const [checklist, setChecklist] = useState({});

  const handleOptionChange = (section, item, resposta) => {
    setChecklist((prev) => ({
      ...prev, [section]: {...prev[section], [item]: { ...prev[section]?.[item], resposta},}}));
  };

  const handleObservationChange = (section, item, observacao) => {
    setChecklist((prev) => ({...prev, [section]: {...prev[section], [item]: {...prev[section]?.[item], observacao}}}));
  };

  const handleSave = async () => {
    if (!selectedDate) {alert("Por favor, selecione uma data."); return;}
    const formattedDate = format(new Date(selectedDate), "yyyy-MM-dd");
    const dataToSave = {data: formattedDate, checklist, timestamp: Date.now()};
    try {await push(ref(db, "checklistsLimpeza"), dataToSave);
      alert("Checklist salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar checklist:", error); 
      alert("Erro ao salvar checklist.");}
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Checklist Limpeza - Reciclar</h1>
      <Label className="block mb-6">
        <span className="font-medium">Data:</span>
        <Input type="date" value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)} className="mt-1 p-2 border rounded w-full" />
      </Label>

      {Object.entries(checklistStructure).map(([section, items]) => (
        <div key={section} className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-green-700 border-b border-gray-300">{section}</h2>
          <div className="space-y-4">
            {items.map((item) => {
              const itemData = checklist[section]?.[item] || {};
              return (
                <div key={item} className="bg-gray-100 p-4 rounded">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <span className="font-medium">{item}</span>
                    <div className="mt-2 md:mt-0 flex gap-4">
                      <Label className="flex items-center gap-1">
                        <Input type="radio" name={`${section}-${item}`} value="Sim" checked={itemData.resposta === "Sim"}
                          onChange={() => handleOptionChange(section, item, "Sim")} /> Sim </Label>
                      <Label className="flex items-center gap-1">
                        <Input type="radio" name={`${section}-${item}`} value="Não" checked={itemData.resposta === "Não"}
                          onChange={() => handleOptionChange(section, item, "Não")}  /> Não </Label>
                    </div>
                  </div>

                  {itemData.resposta === "Não" && (
                    <div className="mt-3">
                      <Label className="block text-sm text-gray-600">Observação:</Label>
                      <Input type="text" value={itemData.observacao || ""} onChange={(e) =>
                          handleObservationChange(section, item, e.target.value)}
                        placeholder="Descreva o motivo"  className="mt-1 p-2 border rounded w-full" />
                    </div> )}
                </div>);})}
          </div>
        </div>
      ))}
      <Button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-6">Salvar Checklist</Button>
    </div>
  );
}
