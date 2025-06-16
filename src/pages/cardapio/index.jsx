
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectItemIndicator,
} from "@radix-ui/react-select";

import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";

import CadastroCardapioAlmoco from "./almoco";
import CadastroCardapioCafe from "./breakfast";
import CadastroCardapioLanche from "./lanche";
import { Button } from "@/components/ui/Button/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const CadastroCardapio = () => {
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const navigate = useNavigate("/cardapios");

  const renderFormulario = () => {
    switch (tipoSelecionado) {
      case "cafe":
        return <CadastroCardapioCafe />;
      case "almoco":
        return <CadastroCardapioAlmoco />;
      case "lanche":
        return <CadastroCardapioLanche />;
      default:
        return (
          <p className="text-gray-500 italic mt-6 text-center">
            Por favor, selecione um tipo de cardápio para começar o cadastro.
          </p>
        );
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-[#6a11cb] to-[#2575fc]">
      {/* Conteúdo principal - ocupa o resto da tela, com scroll se necessário */}
      <section className="flex-grow overflow-auto p-6 flex justify-center">
        <div className="w-full max-w-8xl bg-white rounded-lg shadow-lg p-8">
          <label
            htmlFor="tipo-cardapio"
            className="block text-sm font-semibold text-gray-700 mb-4"
          >
            Tipo de Cardápio para cadastrar
          </label>
        <div className="flex justify-between items-center mb-6">
              <Button onClick={() => navigate(-1)} className="bg-white hover:bg-gray-500 text-gray-800 px-4 py-2 rounded-md shadow">
                <FontAwesomeIcon icon={faArrowLeft} className="h-5" />
              </Button>
      </div>
          <Select
            value={tipoSelecionado}
            onValueChange={setTipoSelecionado}
            name="tipo-cardapio"
          >
            <SelectTrigger
              aria-label="Tipo de cardápio"
              className="inline-flex items-center justify-between w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-left text-gray-700 shadow-sm hover:border-indigo-500 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <SelectValue placeholder="Selecione o tipo..." />
              <ChevronDownIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </SelectTrigger>

            <SelectContent
              className="overflow-hidden rounded-md bg-white shadow-lg animate-fadeIn w-full max-w-md"
              position="popper"
            >
              <SelectItem
                value="cafe"
                className="relative flex items-center px-4 py-3 text-gray-800 hover:bg-indigo-100 focus:bg-indigo-100 cursor-pointer select-none"
              >
                <SelectItemIndicator className="absolute left-2 inline-flex items-center">
                  <CheckIcon className="w-5 h-5 text-indigo-600" />
                </SelectItemIndicator>
                Café da Manhã
              </SelectItem>

              <SelectItem
                value="almoco"
                className="relative flex items-center px-4 py-3 text-gray-800 hover:bg-indigo-100 focus:bg-indigo-100 cursor-pointer select-none"
              >
                <SelectItemIndicator className="absolute left-2 inline-flex items-center">
                  <CheckIcon className="w-5 h-5 text-indigo-600" />
                </SelectItemIndicator>
                Almoço
              </SelectItem>

              <SelectItem
                value="lanche"
                className="relative flex items-center px-4 py-3 text-gray-800 hover:bg-indigo-100 focus:bg-indigo-100 cursor-pointer select-none"
              >
                <SelectItemIndicator className="absolute left-2 inline-flex items-center">
                  <CheckIcon className="w-5 h-5 text-indigo-600" />
                </SelectItemIndicator>
                Lanche da Tarde
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="mt-10">{renderFormulario()}</div>
        </div>
      </section>

    </main>
  );
};

export default CadastroCardapio;
