// import { useState, useEffect } from "react";
// import { initializeApp, getApps } from "firebase/app";
// import { getDatabase, ref, set, onValue } from "firebase/database";
// import { toast, ToastContainer } from "react-toastify";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/Button/button";
// import "react-toastify/dist/ReactToastify.css";
// import { Link } from "react-router-dom";
// // 🔥 Configuração do Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
//   authDomain: "bancoestoquecozinha.firebaseapp.com",
//   databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
//   projectId: "bancoestoquecozinha",
//   storageBucket: "bancoestoquecozinha.appspot.com",
//   messagingSenderId: "71775149511",
//   appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
// };

// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
// const db = getDatabase(app);

// // 🔍 Modal de seleção de produto
// const Modal = ({ products, onSelectProduct, onClose }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredProducts, setFilteredProducts] = useState([]);

//   useEffect(() => {
//     if (!products || products.length === 0) return;
//     setFilteredProducts(products);
//   }, [products]);
//   useEffect(() => {
//     if (!products) return;
//     const filtered = products
//       .filter((product) => product.sku.toLowerCase().includes(searchTerm.toLowerCase()) || product.name.toLowerCase().includes(searchTerm.toLowerCase()))
//       .sort((a, b) => a.name.localeCompare(b.name));  
//   setFilteredProducts(filtered)}, 
//   [searchTerm, products]);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg w-full max-w-6xl relative overflow-y-auto max-h-[90vh]">
//         <h2 className="text-xl font-bold mb-4">Escolha um Produto</h2>
//         <Input type="text" placeholder="Buscar por SKU ou Nome" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
//            className="w-full p-2 mb-4 border rounded" />
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-gray-200 text-sm">
//                 <th className="p-2 text-center">SKU</th>
//                 <th className="p-2 text-center">Nome</th>
//                 <th className="p-2 text-center">Marca</th>
//                 <th className="p-2 text-center">Fornecedor</th>
//                 <th className="p-2 text-center">Peso</th>
//                 <th className="p-2 text-center">Unidade</th>
//                 <th className="p-2 text-center">Categoria</th>
//                 <th className="p-2 text-center">Ação</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredProducts.map((product) => (
//                 <tr key={product.sku} className="border-t text-sm">
//                   <td className="p-2 text-center">{product.sku}</td>
//                   <td className="p-2 text-center">{product.name}</td>
//                   <td className="p-2 text-center">{product.marca}</td>
//                   <td className="p-2 text-center">{product.supplier}</td>
//                   <td className="p-2 text-center">{product.peso} </td>
//                   <td className="p-2 text-center">{product.unit} {product.unitMeasure}</td>
//                   <td className="p-2 text-center">{product.category}</td>
//                   <td className="p-2 text-center">
//                     <Button onClick={() => onSelectProduct(product)} className="px-3 py-1 bg-blue-600 text-white rounded text-xs">
//                       Selecionar
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <Button onClick={onClose} className="absolute top-2 right-2 text-white bg-red-600">Fechar</Button>
//       </div>
//     </div>
//   );
// };

// // 📦 Componente principal
// export default function CadastroProdutos() {
//   const [sku, setSku] = useState("");
//   const [name, setName] = useState("");
//   const [marca, setMarca] = useState("");
//   const [supplier, setSupplier] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [peso, setPeso] = useState("");
//   const [pesoTotal, setPesoTotal] = useState("");
//   const [unitmeasure, setUnitmeasure] = useState("");
//   const [category, setCategory] = useState("");
//   const [tipo, setTipo] = useState("");
//   const [unitPrice, setUnitPrice] = useState("");
//   const [totalPrice, setTotalPrice] = useState("");
//   const [dateAdded, setDateAdded] = useState("");
//   const [expiryDate, setExpiryDate] = useState("");
//   const [products, setProducts] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [unit, setUnit] = useState("");

//   useEffect(() => {
//     const dbProdutos = ref(db, "EntradaProdutos");
//     onValue(dbProdutos, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const loadedProducts = Object.keys(data).map((key) => ({ ...data[key], sku: key }));
//         setProducts(loadedProducts);
//       }
//     });
//   }, []);

//   const resetForm = () => {
//     setSku(""); setName(""); setMarca(""); setSupplier(""); setPeso(""); setUnitmeasure("");
//     setQuantity(""); setPesoTotal(""); setCategory(""); setTipo("");
//     setUnitPrice(""); setTotalPrice(""); setDateAdded(""); setExpiryDate("");
//   };

//   const handleSelectProduct = (product) => {
//     setSku(product.sku);
//     setName(product.name);
//     setMarca(product.marca);
//     setSupplier(product.supplier);
//     setPeso(product.peso);
//     setUnit(product.unit);
//     setCategory(product.category);
//     setTipo(product.tipo);
//     setUnitPrice(product.unitPrice);
//     setTotalPrice(product.totalPrice);
//     setQuantity(product.quantity);
//     setDateAdded(product.dateAdded);
//     setExpiryDate(product.expiryDate);
//     setShowModal(false);
//   };

//   const handleSave = () => {
//     if (!sku || !quantity) { toast.error("Preencha SKU e Quantidade."); return;}
//     const estoqueRef = ref(db, `Estoque/${sku}`);
//     onValue(estoqueRef, (snapshot) => {
//       const existingData = snapshot.val();
//       const quantidadeAtual = parseInt(quantity);
//       const pesoFloat = parseFloat(peso) || 0;
//       const precoUnit = parseFloat((unitPrice || "0").replace(/\D/g, "")) / 100;

//       if (existingData) {
//         const novaQuantidade = (parseInt(existingData.quantity) || 0) + quantidadeAtual;
//         const novoPesoTotal = pesoFloat * novaQuantidade;
//         const novoTotalPrice = precoUnit * novaQuantidade;

//         set(estoqueRef, {...existingData, quantity: novaQuantidade, pesoTotal: novoPesoTotal, totalPrice: novoTotalPrice.toFixed(2), 
//           dateAdded: dateAdded || new Date().toISOString().split("T")[0], expiryDate: expiryDate || existingData.expiryDate || ""})
//         .then(() => {toast.success("Produto atualizado com sucesso!"); resetForm();
//         }).catch((error) => toast.error("Erro ao atualizar: " + error.message));
//       } 
//       else {const novoProduto = {
//           sku, name, marca, supplier, peso, unitmeasure, unit, quantity: quantidadeAtual,
//           pesoTotal: pesoFloat * quantidadeAtual, category, tipo, unitPrice, totalPrice: precoUnit * quantidadeAtual,
//           dateAdded: dateAdded || new Date().toISOString().split("T")[0], expiryDate: expiryDate || ""};

//         set(estoqueRef, novoProduto)
//           .then(() => {toast.success("Produto adicionado ao estoque!"); resetForm(); })
//           .catch((error) => toast.error("Erro ao salvar: " + error.message)); }
//     }, { onlyOnce: true });
//   };

//   const handleQuantityChange = (e) => {
//     const q = e.target.value;
//     setQuantity(q);
//     if (peso && q) setPesoTotal(parseFloat(peso) * parseInt(q));
//     if (unitPrice && q) {const parsed = parseFloat(unitPrice.replace(/\D/g, "")) / 100; setTotalPrice(parsed * parseInt(q));}
//   };

//   const handleUnitPriceChange = (e) => {
//     let inputValue = e.target.value.replace(/\D/g, "");
//     const formattedValue = new Intl.NumberFormat("pt-BR", {
//       style: "currency", currency: "BRL",
//     }).format(inputValue / 100);
//     setUnitPrice(formattedValue);

//     if (quantity) {
//       const parsed = parseFloat(formattedValue.replace(/\D/g, "")) / 100;
//       setTotalPrice(parsed * parseInt(quantity));
//     }
//   };

//   const handlePesoChange = (e) => {
//     const p = e.target.value;
//     setPeso(p);
//     if (quantity && p) {
//       setPesoTotal(parseFloat(p) * parseInt(quantity));
//     }
//   };
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-gray-800 p-4 sm:p-6">
//       <div className="w-full max-w-screen-xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-10">
//         <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Entrada de Produtos</h1>
//         <Button onClick={() => setShowModal(true)} className="mb-4 bg-green-600 text-white px-4 py-2 rounded">Selecionar Produto</Button>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
//             <Input placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)}/>
//             <Input placeholder="Produto" value={name} onChange={(e) => setName(e.target.value)}/>
//             <Input placeholder="Marca" value={marca}onChange={(e) => setMarca(e.target.value)}/>
//             <Input placeholder="Fornecedor" value={supplier} onChange={(e) => setSupplier(e.target.value)}/>
//             <Input placeholder="Quantidade" value={quantity} onChange={handleQuantityChange}/>
//             <Input value={peso || ""} placeholder="Peso Unitário" onChange={(e) => setPeso(e.target.value)} />
//             <Input placeholder="Unidade de Medida" value={unit} readOnly onChange={(e) => setUnit(e.target.value)}/>
//             <Input placeholder="Peso Total" disabled value={pesoTotal} />
//               <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border rounded">
//                 <option value="">Categoria</option>
//                 <option value="Proteína">Proteína</option>
//                 <option value="Mantimento">Mantimento</option>
//                 <option value="Hortaliças">Hortaliças</option>
//                 <option value="Doações">Doações</option>
//               </select>
//             <Input placeholder="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}/>
//             <Input placeholder="R$ 0,00" value={unitPrice} onChange={handleUnitPriceChange}/>
//             <Input placeholder="R$ 0,00" value={totalPrice} disabled />
//             <Input type="date" value={dateAdded} onChange={(e) => setDateAdded(e.target.value)}/>
//             <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)}/>
//         </div>
//         <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
//           <Button onClick={handleSave} className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded ">Salvar</Button>
//           <Link to="/Cadastro" className="w-full sm:w-auto px-6 py-2 bg-gray-600 text-white rounded text-center">Voltar</Link>
//         </div>
//         <ToastContainer />
//       </div>
//       {showModal && (<Modal products={products} onSelectProduct={handleSelectProduct} onClose={() => setShowModal(false)}/>)}
//     </div>
//   );
// }


// CODIGO PARA SUBIR PLANILHAS AO FIREBASE 
import { useState } from "react";
import * as XLSX from "xlsx";
import { getDatabase, ref, set } from "firebase/database";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";

const db = getDatabase();

export default function ImportarPlanilhaEstoque() {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const binaryStr = evt.target?.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" }); // mantém campos vazios

        for (const item of jsonData) {
          const sku = item.sku?.toString().trim();
          if (!sku) continue;

          const estoqueRef = ref(db, `Estoque/${sku}`);

          const produto = {
            sku,
            name: item.name?.toString().trim() || "",
            marca: item.marca?.toString().trim() || "",
            supplier: item.supplier?.toString().trim() || "",
            quantity: item.quantity !== "" ? parseInt(item.quantity, 10) : 0,
            peso: item.peso !== "" ? parseFloat(item.peso) : 0,
            unit: item.unit?.toString().trim() || "",
            category: item.category?.toString().trim() || "",
            tipo: item.tipo?.toString().trim() || "",
            unitPrice: item.unitPrice !== "" ? parseFloat(item.unitPrice) : 0,
            totalPrice: item.totalPrice !== "" ? parseFloat(item.totalPrice) : 0,
            dateAdded: item.dateAdded?.toString().trim() || new Date().toISOString().split("T")[0],
            expiryDate: item.expiryDate?.toString().trim() || "",
          };

          await set(estoqueRef, produto);
        }

        toast.success("✅ Planilha importada com sucesso!");
      } catch (error) {
        console.error("Erro ao importar:", error);
        toast.error("❌ Erro ao importar planilha.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="my-6">
      <label className="font-medium mb-2 block">📥 Importar planilha Excel (.xlsx ou .xls)</label>
      <Input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        disabled={loading}
      />
      {loading && <p className="text-blue-700 mt-2">Importando dados...</p>}
    </div>
  );
}
