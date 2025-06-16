// import { useState } from "react";
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@radix-ui/react-select";
// import CadastroCardapioAlmoco from "./almoco";
// import CadastroCardapioCafe from "./breakfast";
// import CadastroCardapioLanche from "./lanche";

// const CadastroCardapio = () => {
//   const [tipoSelecionado, setTipoSelecionado] = useState("");

//   const renderFormulario = () => {
//     switch (tipoSelecionado) {
//       case "cafe": return <CadastroCardapioCafe />;
//       case "almoco": return <CadastroCardapioAlmoco />;
//       case "lanche": return <CadastroCardapioLanche />;
//       default: return null;
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
//       <h1 className="text-2xl font-bold mb-4">Cadastro de Cardápio</h1>

//       <div className="mb-6">
//         <label className="block mb-1 font-medium">Tipo de Cardápio</label>
//         <Select value={tipoSelecionado} onValueChange={setTipoSelecionado}>
//           <SelectTrigger className="border p-2 rounded w-full bg-white">
//             <SelectValue placeholder="Selecione o tipo..." />
//           </SelectTrigger>
//           <SelectContent className="bg-white rounded shadow w-full">
//             <SelectItem value="cafe" className="p-2">Café da Manhã</SelectItem>
//             <SelectItem value="almoco" className="p-2">Almoço</SelectItem>
//             <SelectItem value="lanche" className="p-2">Lanche da Tarde</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {renderFormulario()}
//     </div>
//   );
// };

// export default CadastroCardapio;


import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@radix-ui/react-select";

import CadastroCardapioAlmoco from "./almoco";
import CadastroCardapioCafe from "./breakfast";
import CadastroCardapioLanche from "./lanche";

const CadastroCardapio = () => {
  const [tipoSelecionado, setTipoSelecionado] = useState("");

  const renderFormulario = () => {
    switch (tipoSelecionado) {
      case "cafe":
        return <CadastroCardapioCafe />;
      case "almoco":
        return <CadastroCardapioAlmoco />;
      case "lanche":
        return <CadastroCardapioLanche />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded shadow p-6">
        <h1 className="text-3xl font-bold mb-6">Cadastro de Cardápio</h1>

        <div className="mb-6 max-w-md">
          <label className="block mb-1 font-medium">Tipo de Cardápio</label>
          <Select value={tipoSelecionado} onValueChange={setTipoSelecionado}>
            <SelectTrigger className="border p-2 rounded w-full bg-white">
              <SelectValue placeholder="Selecione o tipo..." />
            </SelectTrigger>
            <SelectContent className="bg-white rounded shadow w-full">
              <SelectItem value="cafe" className="p-2">
                Café da Manhã
              </SelectItem>
              <SelectItem value="almoco" className="p-2">
                Almoço
              </SelectItem>
              <SelectItem value="lanche" className="p-2">
                Lanche da Tarde
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Formulário */}
        <div className="mt-6">{renderFormulario()}</div>
      </div>
    </div>
  );
};

export default CadastroCardapio;
