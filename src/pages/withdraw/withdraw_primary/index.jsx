// import { useState, useEffect } from "react";
// import { ref, get, push, update, remove, db } from "../../../../firebase.js";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Input } from "@/components/ui/input";
// import { Table } from "@/components/ui/table/table";
// import { FaExclamationCircle } from 'react-icons/fa';
// import { useNavigate } from "react-router-dom";

// export default function Retirada() {
//   const navigate = useNavigate();
//   const [sku, setSku] = useState("");
//   const [name, setName] = useState("");
//   const [category, setCategory] = useState("");
//   const [tipo, setTipo] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [peso, setPeso] = useState("");
//   const [retirante, setRetirante] = useState("");
//   // const [data, setData] = useState(""); // Data de Retirada
//   const [produtos, setProdutos] = useState([]);
//   const [filteredProdutos, setFilteredProdutos] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split("T")[0]);


//   const calcularDiasParaValidade = (validade) => {
//     const now = new Date();
//     const validadeDate = new Date(validade);
//     const diffTime = validadeDate - now;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   useEffect(() => {
//     const fetchProdutos = async () => {
//       const produtosRef = ref(db, "Estoque");
//       const snapshot = await get(produtosRef);
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const produtosList = Object.entries(data).map(([id, produto]) => ({
//           id,
//           ...produto,
//           validadeStatus: calcularDiasParaValidade(produto.validade),
//         }));
//         setProdutos(produtosList);
//         setFilteredProdutos(produtosList);
//       }
//     };
//     fetchProdutos();
//   }, []);

//   useEffect(() => {
//     if (searchTerm.trim() === "") {
//       setFilteredProdutos(produtos);
//     } else {
//       const filtered = produtos.filter((produto) =>
//         String(produto.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//         String(produto.sku || "").toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredProdutos(filtered);
//     }
//   }, [searchTerm, produtos]);

// // const handleRetirada = async () => {
// //     if (!sku || !name || !category || !tipo || !quantity || !peso || !retirante) {
// //         toast.error("Por favor, preencha todos os campos.");
// //         return;
// //     }

// //     try {
// //         // const currentDate = new Date().toISOString(); 

// //         const retiradaRef = ref(db, "Retiradas");
// //         await push(retiradaRef, { 
// //             sku, 
// //             name, 
// //             category, 
// //             tipo, 
// //             quantity, 
// //             peso, 
// //             retirante, 
// //             // data: currentDate 
// //              dataPedido: dataSelecionada,
// //         });

// //         const produtoRef = ref(db, `Estoque/${sku}`);
// //         const produtoSnapshot = await get(produtoRef);
// //         const produto = produtoSnapshot.val();

// //         if (produto) {
// //             const novaQuantidade = produto.quantity - quantity;
// //             if (novaQuantidade <= 0) {
// //                 await remove(produtoRef);
// //                 toast.success("Produto removido do estoque devido à quantidade esgotada.");
// //             } else {
// //                 await update(produtoRef, { quantity: novaQuantidade });
// //                 toast.success("Retirada registrada e estoque atualizado.");
// //             }
// //         }
// //         setSku(""); setName(""); setCategory(""); setTipo(""); setQuantity(""); setPeso(""); setRetirante("");       setDataSelecionada("");

// //     } catch (error) {
// //         toast.error("Erro ao registrar retirada.");
// //         console.error(error);
// //     }
// // };

// const handleRetirada = async () => {
//   if (!sku || !name || !category || !tipo || !quantity || !peso || !retirante) {
//     toast.error("Por favor, preencha todos os campos.");
//     return;
//   }

//   try {
//     const retiradaRef = ref(db, "Retiradas");

//     // Opção 1: Enviar data automática com hora completa
//     // const dataAtual = new Date().toISOString();

//     // Opção 2: Enviar data automática apenas com a data (sem hora)
//     // const dataAtual = new Date().toISOString().split("T")[0];

//     await push(retiradaRef, {
//       sku,
//       name,
//       category,
//       tipo,
//       quantity,
//       peso,
//       retirante,
//       dataPedido: dataSelecionada, // Ou use "dataAtual" se quiser automática
//     });

//     // Atualiza estoque
//     const produtoRef = ref(db, `Estoque/${sku}`);
//     const produtoSnapshot = await get(produtoRef);
//     const produto = produtoSnapshot.val();

//     if (produto) {
//       const novaQuantidade = produto.quantity - quantity;
//       if (novaQuantidade <= 0) {
//         await remove(produtoRef);
//         toast.success("Produto removido do estoque devido à quantidade esgotada.");
//       } else {
//         await update(produtoRef, { quantity: novaQuantidade });
//         toast.success("Retirada registrada e estoque atualizado.");
//       }
//     }

//     // Limpa os campos
//     setSku("");
//     setName("");
//     setCategory("");
//     setTipo("");
//     setQuantity("");
//     setPeso("");
//     setRetirante("");
//     setDataSelecionada("");

//   } catch (error) {
//     toast.error("Erro ao registrar retirada.");
//     console.error(error);
//   }
// };

//   const handleProdutoSelecionado = (produto) => {
//     setSku(produto.sku);
//     setName(produto.name);
//     setCategory(produto.category);
//     setTipo(produto.tipo);
//     setPeso(produto.peso);
//     setIsModalOpen(false);
//   };

//   const formatDate = (date) => {
//     if (!date) return "--";
//     const [y, m, d] = date.slice(0, 10).split("-");
//     const dt = new Date(Date.UTC(+y, +m - 1, +d));
//     const dd = String(dt.getUTCDate()).padStart(2, "0");
//     const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
//     const yyyy = dt.getUTCFullYear();
//     return `${dd}/${mm}/${yyyy}`;
//   };


//   const getCurrentDate = () => {
//     return new Date().toISOString(); 
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center p-4">
//       <ToastContainer className={"mt-[20px]"} />
//       <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-8">
//         <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Retirada de Produtos</h1>
//         <div className="grid grid-cols-1 gap-4">
//           <Input className="p-3 border rounded-lg cursor-pointer transition-all" type="text" placeholder="SKU" value={sku} readOnly onClick={() => setIsModalOpen(true)} />
//           <Input className="p-3 border rounded-lg bg-gray-100" type="text" placeholder="Nome do Produto" value={name} readOnly />
//           <Input className="p-3 border rounded-lg bg-gray-100" type="text" placeholder="Categoria" value={category} readOnly />
//           <Input className="p-3 border rounded-lg bg-gray-100" type="text" placeholder="Tipo" value={tipo} readOnly />
//           <Input className="p-3 border rounded-lg" type="number" placeholder="Quantidade" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
//           <Input className="p-3 border rounded-lg bg-gray-100" type="number" placeholder="Peso (kg)" value={peso} readOnly />
//           <select className="p-3 border rounded-lg" value={retirante} onChange={(e) => setRetirante(e.target.value)}>
//             <option value="">Escolha o Responsável</option>
//             <option value="Camila">Camila</option>
//             <option value="Maria José">Maria José</option>
//             <option value="Mislene">Mislene</option>
//             <option value="Rose">Rose</option>
//           </select>
//             <div>
//               <label>Data do Pedido: </label>
//               <Input type="date" value={dataSelecionada} onChange={(e) => setDataSelecionada(e.target.value)}  />
//             </div>
//           <button onClick={handleRetirada} className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold">Registrar Retirada</button>
//           <button onClick={() => navigate(-1)} className="bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-all font-semibold">Voltar</button>
//         </div>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl w-full max-w-5xl p-6 md:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
//             <h2 className="text-2xl font-bold mb-4">Produtos Disponíveis</h2>
//             <Input type="text" placeholder="Buscar por nome ou SKU" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 mb-4 border rounded-lg" />
//             <div className="overflow-x-auto">
//               <button onClick={() => setIsModalOpen(false)} className="mt-4 mb-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold">Fechar</button>
//               <Table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-gray-100 text-sm md:text-base text-center">
//                     <th className="p-2">Nome</th>
//                     <th className="p-2">SKU</th>
//                     <th className="p-2">Categoria</th>
//                     <th className="p-2">Tipo</th>
//                     <th className="p-2">Quantidade</th>
//                     <th className="p-2">Peso(KG)</th>
//                     <th className="p-2">Validade</th>
//                     <th className="p-2">Selecionar</th>
//                   </tr>
//                 </thead>
//                 <tbody className="text-center text-sm md:text-base">
//                   {filteredProdutos.map((produto) => {
//                     const validadeStatus = calcularDiasParaValidade(produto.validade);
//                     const isValidNearExpiry = validadeStatus <= 7;
//                     return (
//                       <tr key={produto.id} className={`border-b hover:bg-gray-50 ${isValidNearExpiry ? 'bg-red-200' : ''}`}>
//                         <td className="p-2">{produto.name}</td>
//                         <td className="p-2">{produto.sku}</td>
//                         <td className="p-2">{produto.category}</td>
//                         <td className="p-2">{produto.tipo}</td>
//                         <td className="p-2">{produto.quantity}</td>
//                         <td className="p-2">{produto.peso}</td>
//                         <td className="p-5">
//                           {isValidNearExpiry &&(
//                             <div className="flex items-center text-red-600">
//                               <FaExclamationCircle className="mr-2" />Vencimento Próximo</div>)}{formatDate(produto.expiryDate)}
//                         </td>
//                         <td className="p-2">
//                           <button onClick={() => handleProdutoSelecionado(produto)} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all font-semibold">Selecionar</button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </Table>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { ref, get, push, update, remove, db } from "../../../../firebase.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table/table";
import { FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

export default function Retirada() {
  const navigate = useNavigate();
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [tipo, setTipo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [marca, setMarca] = useState("");
  const [peso, setPeso] = useState("");
  const [retirante, setRetirante] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split("T")[0]);

  const calcularDiasParaValidade = (expiryDate) => {
    if (!expiryDate) return Infinity; // Se não tiver validade, não marca como perto do vencimento
    const now = new Date();
    const validadeDate = new Date(expiryDate);
    const diffTime = validadeDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };


  useEffect(() => {
  const fetchProdutos = async () => {
    const produtosRef = ref(db, "Estoque");
    const snapshot = await get(produtosRef);
    if (snapshot.exists()) {const data = snapshot.val();
      const produtosList = Object.entries(data).map(([id, produto]) => ({id, ...produto, validadeStatus: calcularDiasParaValidade(produto.expiryDate)}));
      setProdutos(produtosList);
      setFilteredProdutos(produtosList);

      // Verifica se tem produto perto do vencimento (<=7 dias)
      const temProximoVencimento = produtosList.some((p) => p.validadeStatus <= 7);
      if (temProximoVencimento) {toast.warn("Atenção: Existem produtos próximos do vencimento!", 
        {position: "top-right", autoClose: 7000, pauseOnHover: true, closeOnClick: true, draggable: true});
      }
    } 
    else {setProdutos([]);  setFilteredProdutos([]); }}; fetchProdutos(); }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProdutos(produtos);
    } 
    else {const filtered = produtos.filter((produto) =>
        String(produto.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(produto.sku || "").toLowerCase().includes(searchTerm.toLowerCase())
      ); setFilteredProdutos(filtered); }}, [searchTerm, produtos]);

const handleRetirada = async () => {
  if (!sku || !name || !marca || !category || !tipo || !quantity || !peso || !retirante) {
    toast.error("Por favor, preencha todos os campos.");
    return;
  }

  const retiradaNum = Number(quantity);
  if (isNaN(retiradaNum) || retiradaNum <= 0) {
    toast.error("Quantidade inválida.");
    return;
  }

  try {
    const retiradaRef = ref(db, "Retiradas");
    await push(retiradaRef, {
      sku,
      name,
      marca,
      category,
      tipo,
      quantity: retiradaNum,
      peso,
      retirante,
      dataPedido: dataSelecionada,
    });

    const estoqueRef = ref(db, "Estoque");
    const snapshot = await get(estoqueRef);

    if (!snapshot.exists()) {
      toast.error("Estoque não encontrado.");
      return;
    }

    const estoqueData = snapshot.val();
    const produtoEncontrado = Object.entries(estoqueData).find(
      ([_, produto]) => produto.sku === sku
    );

    if (!produtoEncontrado) {
      toast.error("Produto não encontrado no estoque.");
      return;
    }

    const [produtoId, produto] = produtoEncontrado;
    const estoqueAtual = Number(produto.quantity);
    const novaQuantidade = estoqueAtual - retiradaNum;

    const produtoRef = ref(db, `Estoque/${produtoId}`);

    if (novaQuantidade <= 0) {
      await remove(produtoRef);
      toast.success("Produto removido do estoque devido à quantidade esgotada.");
      setProdutos((prev) => prev.filter((p) => p.sku !== sku));
    } else {
      await update(produtoRef, { quantity: novaQuantidade });
      toast.success("Retirada registrada e estoque atualizado.");
      setProdutos((prev) =>
        prev.map((p) => p.sku === sku ? { ...p, quantity: novaQuantidade } : p)
      );
    }

    // Resetar campos
    setSku("");
    setName("");
    setMarca("");
    setCategory("");
    setTipo("");
    setQuantity("");
    setPeso("");
    setRetirante("");
    setDataSelecionada(new Date().toISOString().split("T")[0]);

  } catch (error) {
    toast.error("Erro ao registrar retirada.");
    console.error(error);
  }
};


  const handleProdutoSelecionado = (produto) => {
    setSku(produto.sku);
    setName(produto.name);
    setMarca(produto.marca);
    setCategory(produto.category);
    setTipo(produto.tipo);
    setPeso(produto.peso);
    setQuantity("");
    setIsModalOpen(false);
  };

const formatDate = (date) => {
  if (!date || typeof date !== "string") return "--";

  try {
    const [y, m, d] = date.slice(0, 10).split("-");
    const dt = new Date(Date.UTC(+y, +m - 1, +d));
    const dd = String(dt.getUTCDate()).padStart(2, "0");
    const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
    const yyyy = dt.getUTCFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch (e) {
    return "--";
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center p-4">
      <ToastContainer className={"mt-[20px]"} />
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Retirada de Produtos</h1>
        <div className="grid grid-cols-1 gap-4">
          <Input className="p-3 border rounded-lg cursor-pointer transition-all" type="text" placeholder="SKU" value={sku} readOnly onClick={() => setIsModalOpen(true)} />
          <Input className="p-3 border rounded-lg bg-gray-100" type="text" placeholder="Nome do Produto" value={name} readOnly />          
          <Input className="p-3 border rounded-lg bg-gray-100" type="text" placeholder="Marca" value={marca} readOnly />
          <Input className="p-3 border rounded-lg bg-gray-100" type="text" placeholder="Categoria" value={category} readOnly/>
          <Input className="p-3 border rounded-lg bg-gray-100" type="text" placeholder="Tipo"  value={tipo} readOnly/>
          <Input className="p-3 border rounded-lg"  type="number" min={1} placeholder="Quantidade" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <Input className="p-3 border rounded-lg bg-gray-100" type="number" placeholder="Peso (kg)" value={peso} readOnly/>
          <select className="p-3 border rounded-lg" value={retirante}
            onChange={(e) => setRetirante(e.target.value)}>
            <option value="">Escolha o Responsável</option>
            <option value="Camila">Camila</option>
            <option value="Maria José">Maria José</option>
            <option value="Mislene">Mislene</option>
            <option value="Rose">Rose</option>
          </select>
          <div>
            <label>Data do Pedido: </label>
            <Input type="date" value={dataSelecionada} onChange={(e) => setDataSelecionada(e.target.value)} />
          </div>
          <button onClick={handleRetirada}
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold">Registrar Retirada</button>
          <button onClick={() => navigate(-1)}
            className="bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-all font-semibold">Voltar</button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-5xl p-6 md:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Produtos Disponíveis</h2>
            <Input type="text" placeholder="Buscar por nome ou SKU" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}className="w-full p-3 mb-4 border rounded-lg" />
            <div className="overflow-x-auto">
              <button onClick={() => setIsModalOpen(false)}
                className="mt-4 mb-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold">Fechar</button>
              <Table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-sm md:text-base text-center">
                    <th className="p-2">SKU</th>
                    <th className="p-2">Nome</th>
                    <th className="p-2">Marca</th>
                    <th className="p-2">Categoria</th>
                    <th className="p-2">Tipo</th>
                    <th className="p-2">Quantidade</th>
                    <th className="p-2">Peso(KG)</th>
                    <th className="p-2">Validade</th>
                    <th className="p-2">Selecionar</th>
                  </tr>
                </thead>
                <tbody className="text-center text-sm md:text-base">
                  {filteredProdutos.map((produto) => {
                    const validadeStatus = calcularDiasParaValidade(produto.validade);
                    const isValidNearExpiry = validadeStatus <= 7;
                    return (
                     <tr key={produto.id} className={`border-b hover:bg-gray-50 ${produto.validadeStatus <= 7 ? 'bg-red-100 border border-red-500' : ''}`}>
                        <td className="p-2">{produto.sku}</td>
                        <td className="p-2">{produto.name}</td>
                        <td className="p-2">{produto.marca}</td>
                        <td className="p-2">{produto.category}</td>
                        <td className="p-2">{produto.tipo}</td>
                        <td className="p-2">{produto.quantity}</td>
                        <td className="p-2">{produto.peso}</td>
                       <td className="p-5">{isValidNearExpiry && (<div className="flex items-center text-red-600">
                        <FaExclamationCircle className="mr-2" />Vencimento Próximo </div>)}{formatDate(produto.expiryDate)}</td>
                        <td className="p-2">
                          <button onClick={() => handleProdutoSelecionado(produto)}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all font-semibold">Selecionar</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

