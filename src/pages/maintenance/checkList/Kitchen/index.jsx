import { useState } from "react";
import { db } from "../../../../../firebase";
import { ref, push } from "firebase/database";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const checklistStructure = {
  "Cozinha": [
    "Utensilios disponíveis para se servir",
    "Plaquinhas Indentificações",
    "Modo certo de servir",
    "Alimentos servidos no horário correto?",
    "Temperatura Alimentos",
    "Temperatura Equipamentos",
    "Amostra de alimentos",
    "EPI's necessarios",
    "Papel toalha no banheiro",
    "Acessorios não permitidos",
    "Etiqueta de validade nos produtos abertos",
    "Etiqueta de validade nos produtos abertos da geladeira",
    "Etiqueta de validade nos produtos congelados",
    "Cardapio do dia",
    "Alimentos do cardapio do dia seguinte já separado",
    "Bancada arrumada",
    "Celular na área de trabalho",
    "Luz acesa",
    "Organização do estoque",
    "Chão limpo",
    "Bancada limpa",
  ],
};

export default function Checklist() {
  const [selectedDate, setSelectedDate] = useState("");
  const [checklist, setChecklist] = useState({});
  const navigate = useNavigate();

  const handleOptionChange = (section, item, resposta) => {
    setChecklist((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [item]: { ...prev[section]?.[item], resposta },
      },
    }));
  };

  const handleObservationChange = (section, item, observacao) => {
    setChecklist((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [item]: { ...prev[section]?.[item], observacao },
      },
    }));
  };

  const handleSave = async () => {
    if (!selectedDate) {
      alert("Por favor, selecione uma data.");
      return;
    }
    const formattedDate = format(new Date(selectedDate), "yyyy-MM-dd");
    const dataToSave = {
      data: formattedDate,
      checklist,
      timestamp: Date.now(),
    };

    try {
      await push(ref(db, "checklists"), dataToSave);
      alert("Checklist salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar checklist:", error);
      alert("Erro ao salvar checklist.");
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
        
        {/* Botão Voltar */}
        <div className="mb-6">
          <Button
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md"
          >
            Voltar
          </Button>
        </div>

        {/* Título */}
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
          Checklist Cozinha
        </h1>

        {/* Data */}
        <div className="mb-8">
          <Label className="text-gray-700 text-lg mb-1 block">Selecione a Data:</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Checklist */}
        {Object.entries(checklistStructure).map(([section, items]) => (
          <div key={section} className="mb-10">
            <h2 className="text-2xl font-semibold text-green-600 mb-4 border-b border-gray-200 pb-1">
              {section}
            </h2>
            <div className="space-y-6">
              {items.map((item) => {
                const itemData = checklist[section]?.[item] || {};
                return (
                  <div
                    key={item}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-5"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <p className="text-gray-800 font-medium">{item}</p>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center gap-2 text-sm text-green-700">
                          <input
                            type="radio"
                            name={`${section}-${item}`}
                            value="Sim"
                            checked={itemData.resposta === "Sim"}
                            onChange={() => handleOptionChange(section, item, "Sim")}
                            className="accent-green-600"
                          />
                          Sim
                        </label>
                        <label className="inline-flex items-center gap-2 text-sm text-red-700">
                          <input
                            type="radio"
                            name={`${section}-${item}`}
                            value="Não"
                            checked={itemData.resposta === "Não"}
                            onChange={() => handleOptionChange(section, item, "Não")}
                            className="accent-red-600"
                          />
                          Não
                        </label>
                      </div>
                    </div>

                    {itemData.resposta === "Não" && (
                      <div className="mt-4">
                        <Label className="text-sm text-gray-600">Observação:</Label>
                        <Input
                          type="text"
                          placeholder="Descreva o motivo"
                          value={itemData.observacao || ""}
                          onChange={(e) =>
                            handleObservationChange(section, item, e.target.value)
                          }
                          className="mt-1 w-full p-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Botões Finais */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-10">
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg transition-all duration-300"
          >
            Salvar Checklist
          </Button>

        </div>
      </div>
    </div>
  );
}
