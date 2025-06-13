// import { useState, useEffect } from "react";
// import { ref, child, get, db } from "../../../../firebase";
// import { Link, useNavigate } from "react-router-dom";
// import { Table } from "../../../components/ui/table/table";
// import { Button } from "../../../components/ui/Button/button";

// export default function HistoricoRetiradas() {
//   const navigate = useNavigate();
//   const [retiradas, setRetiradas] = useState([]);
//   const [category, setCategory] = useState("");
//   const [retirante, setRetirante] = useState("");
//   const [produto, setProduto] = useState(""); // Novo estado para o filtro de produto
//   const [retiradasFiltradas, setRetiradasFiltradas] = useState([]);

//   // Função para buscar os dados no Firebase
//   const fetchRetiradas = async () => {
//     const dbRef = ref(db);
//     try {
//       const snapshot = await get(child(dbRef, "Retiradas"));
//       if (snapshot.exists()) {
//         setRetiradas(Object.values(snapshot.val())); 
//         setRetiradasFiltradas(Object.values(snapshot.val()))
//       } else {
//         console.log("Não há dados disponíveis");
//       }
//     } catch (error) {
//       console.error("Erro ao ler dados:", error);
//     }
//   };

//   useEffect(() => {
//     fetchRetiradas();
//   }, []); {/*Chama a função ao carregar o componente*/}

//   const filtrarRetiradas = () => {
//     let filtradas = retiradas;
    
//     // Filtro por categoria
//     if (category) {
//       filtradas = filtradas.filter(
//         (retirada) => retirada.category === category
//       );
//     }

//     // Filtro por retirante
//     if (retirante) {
//       filtradas = filtradas.filter(
//         (retirada) => retirada.retirante === retirante
//       );
//     }

//     // Filtro por produto
//     if (produto) {
//       filtradas = filtradas.filter(
//         (retirada) => retirada.name.toLowerCase().includes(produto.toLowerCase())
//       );
//     }

//     setRetiradasFiltradas(filtradas);
//   };

//   const limparFiltros = () => {
//     setCategory("");
//     setRetirante("");
//     setProduto(""); // Limpar filtro de produto
//     setRetiradasFiltradas(retiradas); 
//   };

//   // Função para formatar a data e hora
//   const formatarDataHora = (timestamp) => {
//     if (!timestamp) return "Data inválida"; 
//     const data =
//       typeof timestamp === "string" ? new Date(timestamp) : new Date(Number(timestamp));
//     if (isNaN(data.getTime())) return "Data inválida";
//     return data.toLocaleString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
//   };

//   return (
//     <div className="max-w-full mx-auto p-8 bg-gradient-to-r from-teal-400 to-indigo-500  shadow-lg">
//       <Link to={"/home-retirada"}>
//         <Button onClick={() => navigate(-1)} className="bg-pink-500 text-white rounded-md p-7 mb-6 transition-all hover:bg-pink-600" > Voltar</Button>
//       </Link>
//       <h1 className="text-center text-4xl text-white font-semibold mb-8">Histórico de Retiradas</h1>
//       <div className="flex flex-wrap justify-center gap-6 mb-8">
//       <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
//         <label className="block text-white mb-2 font-medium">Categoria</label>
//         <select value={category} onChange={(e) => setCategory(e.target.value)}
//           className="w-full p-3 rounded-lg border bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500" >
//           <option value="">Selecione a categoria</option>
//           <option value="Proteína">Proteína</option>
//           <option value="Mantimento">Mantimento</option>
//           <option value="Hortaliças">Hortaliças</option>
//           <option value="Doações">Doações</option>
//         </select>
//       </div>

//       <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
//         <label className="block text-white mb-2 font-medium">Responsável</label>
//         <select value={retirante} onChange={(e) => setRetirante(e.target.value)}
//           className="w-full p-3 rounded-lg border bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
//           <option value="">Selecione o responsável</option>
//           <option value="Camila">Camila</option>
//           <option value="Mislene">Mislene</option>
//           <option value="Maria Jose">Maria Jose</option>
//           <option value="Rose">Rose</option>
//         </select>
//       </div>

//       {/* Filtro por Produto */}
//       <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
//         <label className="block text-white mb-2 font-medium">Produto</label>
//         <input
//           type="text"
//           value={produto}
//           onChange={(e) => setProduto(e.target.value)}
//           className="w-full p-3 rounded-lg border bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           placeholder="Filtrar por produto"
//         />
//       </div>

//         <div className="flex items-end space-x-4">
//           <Button className="bg-green-500 text-white rounded-md py-2 p-6 w-full sm:w-auto hover:bg-green-600 transition-all"
//             onClick={filtrarRetiradas}> Consultar </Button>
//           <Button className="bg-gray-500 text-white rounded-md py-2 p-6 w-full sm:w-auto hover:bg-gray-600 transition-all" onClick={limparFiltros} >Limpar Consulta</Button>
//         </div>
//       </div>
//       <Table className="w-full border-collapse mt-8 bg-white rounded-lg shadow-md">
//         <thead className="bg-indigo-600 text-white text-lg">
//           <tr>
//             <th className="p-4">SKU</th>
//             <th className="p-4">Produto</th>
//             <th className="p-4">Categoria</th>
//             <th className="p-4">Quantidade</th>
//             <th className="p-4">Peso(KG)</th>
//             <th className="p-4">Data de Retirada</th>
//             <th className="p-4">Responsável</th>
//           </tr>
//         </thead>
//         <tbody>
//           {retiradasFiltradas.length === 0 ? (
//             <tr>
//               <td colSpan="7" className="text-center py-4 text-gray-500">Nenhuma retirada encontrada para os filtros aplicados.</td>
//             </tr> ) : (
//             retiradasFiltradas.map((retirada, index) => (
//               <tr key={index} className="text-center border-t hover:bg-gray-100 transition-colors">
//                 <td className="p-4">{retirada.sku}</td>
//                 <td className="p-4">{retirada.name}</td>
//                 <td className="p-4">{retirada.category}</td>
//                 <td className="p-4">{retirada.quantity}</td>
//                 <td className="p-4">{retirada.peso}</td>
//                 <td className="p-4">{formatarDataHora(retirada.data)}</td>
//                 <td className="p-4">{retirada.retirante}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </Table>
//     </div>
//   );
// }



// importações
import { useState, useEffect } from "react";
import { ref, child, get, db } from "../../../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "../../../components/ui/table/table";
import { Button } from "../../../components/ui/Button/button";

export default function HistoricoRetiradas() {
  const navigate = useNavigate();
  const [retiradas, setRetiradas] = useState([]);
  const [category, setCategory] = useState("");
  const [retirante, setRetirante] = useState("");
  const [produto, setProduto] = useState(""); // Novo estado para o filtro de produto
  const [retiradasFiltradas, setRetiradasFiltradas] = useState([]);

  // Função para buscar os dados no Firebase
  const fetchRetiradas = async () => {
    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, "Retiradas"));
      if (snapshot.exists()) {
        setRetiradas(Object.values(snapshot.val())); 
        setRetiradasFiltradas(Object.values(snapshot.val()))
      } else {
        console.log("Não há dados disponíveis");
      }
    } catch (error) {
      console.error("Erro ao ler dados:", error);
    }
  };

  useEffect(() => {
    fetchRetiradas();
  }, []); {/*Chama a função ao carregar o componente*/}

  const filtrarRetiradas = () => {
    let filtradas = retiradas;

    // Filtro por categoria
    if (category) {
      filtradas = filtradas.filter(
        (retirada) => retirada.category === category
      );
    }

    // Filtro por retirante
    if (retirante) {
      filtradas = filtradas.filter(
        (retirada) => retirada.retirante === retirante
      );
    }

    // Filtro por produto
    if (produto) {
      filtradas = filtradas.filter(
        (retirada) => retirada.name.toLowerCase().includes(produto.toLowerCase())
      );
    }

    setRetiradasFiltradas(filtradas);
  };

  const limparFiltros = () => {
    setCategory("");
    setRetirante("");
    setProduto(""); // Limpar filtro de produto
    setRetiradasFiltradas(retiradas); 
  };

  // // Função para formatar a data e hora
  // const formatarDataHora = (timestamp) => {
  //   if (!timestamp) return "Data inválida"; 
  //   const data =
  //     typeof timestamp === "string" ? new Date(timestamp) : new Date(Number(timestamp));
  //   if (isNaN(data.getTime())) return "Data inválida";
  //   return data.toLocaleString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  // };

  // ✅ Função corrigida para exibir apenas a data (sem hora)
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

  return (
    <div className="max-w-full mx-auto p-8 bg-gradient-to-r from-teal-400 to-indigo-500  shadow-lg">
      <Link to={"/home-retirada"}>
        <Button onClick={() => navigate(-1)} className="bg-pink-500 text-white rounded-md p-7 mb-6 transition-all hover:bg-pink-600" > Voltar</Button>
      </Link>
      <h1 className="text-center text-4xl text-white font-semibold mb-8">Histórico de Retiradas</h1>
      <div className="flex flex-wrap justify-center gap-6 mb-8">
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <label className="block text-white mb-2 font-medium">Categoria</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 rounded-lg border bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500" >
            <option value="">Selecione a categoria</option>
            <option value="Proteína">Proteína</option>
            <option value="Mantimento">Mantimento</option>
            <option value="Hortaliças">Hortaliças</option>
            <option value="Doações">Doações</option>
          </select>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <label className="block text-white mb-2 font-medium">Responsável</label>
          <select value={retirante} onChange={(e) => setRetirante(e.target.value)}
            className="w-full p-3 rounded-lg border bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Selecione o responsável</option>
            <option value="Camila">Camila</option>
            <option value="Mislene">Mislene</option>
            <option value="Maria Jose">Maria Jose</option>
            <option value="Rose">Rose</option>
          </select>
        </div>

        {/* Filtro por Produto */}
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <label className="block text-white mb-2 font-medium">Produto</label>
          <input
            type="text"
            value={produto}
            onChange={(e) => setProduto(e.target.value)}
            className="w-full p-3 rounded-lg border bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Filtrar por produto"
          />
        </div>

        <div className="flex items-end space-x-4">
          <Button className="bg-green-500 text-white rounded-md py-2 p-6 w-full sm:w-auto hover:bg-green-600 transition-all"
            onClick={filtrarRetiradas}> Consultar </Button>
          <Button className="bg-gray-500 text-white rounded-md py-2 p-6 w-full sm:w-auto hover:bg-gray-600 transition-all" onClick={limparFiltros} >Limpar Consulta</Button>
        </div>
      </div>

      <Table className="w-full border-collapse mt-8 bg-white rounded-lg shadow-md">
        <thead className="bg-indigo-600 text-white text-lg">
          <tr>
            <th className="p-4">SKU</th>
            <th className="p-4">Produto</th>
            <th className="p-4">Categoria</th>
            <th className="p-4">Quantidade</th>
            <th className="p-4">Peso(KG)</th>
            <th className="p-4">Data de Retirada</th>
            <th className="p-4">Responsável</th>
          </tr>
        </thead>
        <tbody>
          {retiradasFiltradas.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-gray-500">Nenhuma retirada encontrada para os filtros aplicados.</td>
            </tr> ) : (
            retiradasFiltradas.map((retirada, index) => (
              <tr key={index} className="text-center border-t hover:bg-gray-100 transition-colors">
                <td className="p-4">{retirada.sku}</td>
                <td className="p-4">{retirada.name}</td>
                <td className="p-4">{retirada.category}</td>
                <td className="p-4">{retirada.quantity}</td>
                <td className="p-4">{retirada.peso}</td>
                {/* <td className="p-4">{formatarDataHora(retirada.data)}</td> DATA AUTOMATICA */}
                <td className="p-4">{formatDate(retirada.dataPedido)}</td> {/* ✅ Apenas data */}
                <td className="p-4">{retirada.retirante}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
