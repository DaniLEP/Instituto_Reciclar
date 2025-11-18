import { useState, useEffect } from "react"
import { initializeApp, getApps } from "firebase/app"
import { getDatabase, ref, set, onValue } from "firebase/database"
import { toast, ToastContainer } from "react-toastify"
import { Input } from "@/components/ui/input/index"
import { Button } from "@/components/ui/Button/button" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/index"
import { Label } from "@/components/ui/label/index"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table"
import "react-toastify/dist/ReactToastify.css"
import { Link } from "react-router-dom"
import { Package, Search, Plus, ArrowLeft, Building2, Tag, Truck, Weight, Calculator, Calendar, DollarSign, Save, X, ShoppingCart, FileText, Clock } from "lucide-react"

// 🔥 Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.appspot.com",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getDatabase(app)

// 🔍 Modal de seleção de produto
const Modal = ({ products, onSelectProduct, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState([])

  useEffect(() => {if (!products || products.length === 0) return; setFilteredProducts(products)}, [products])
  useEffect(() => {if (!products) return;
    const filtered = products.filter((product) => product.sku.toLowerCase().includes(searchTerm.toLowerCase()) || product.name.toLowerCase().includes(searchTerm.toLowerCase()),).sort((a, b) => a.name.localeCompare(b.name))
    setFilteredProducts(filtered);}, [searchTerm, products])

  const getCategoryColor = (category) => {
    const colors = {Proteína: "bg-red-100 text-red-800", Mantimento: "bg-yellow-100 text-yellow-800", Hortaliças: "bg-green-100 text-green-800", Doações: "bg-blue-100 text-blue-800"}
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader><DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2"><Package className="w-6 h-6 text-blue-600" />Selecionar Produto</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input type="text" placeholder="Buscar por SKU ou Nome do produto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-11" />
          </div>
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-[60vh]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700"><div className="flex items-center gap-2"><Tag className="w-4 h-4" />SKU</div></TableHead>
                    <TableHead className="font-semibold text-gray-700"><div className="flex items-center gap-2"><Package className="w-4 h-4" />Nome</div></TableHead>
                    <TableHead className="font-semibold text-gray-700"><div className="flex items-center gap-2"><Building2 className="w-4 h-4" />Marca</div></TableHead>
                    <TableHead className="font-semibold text-gray-700"><div className="flex items-center gap-2"><Truck className="w-4 h-4" />Fornecedor</div></TableHead>
                    <TableHead className="font-semibold text-gray-700"><div className="flex items-center gap-2"><Weight className="w-4 h-4" />Peso</div></TableHead>
                    <TableHead className="font-semibold text-gray-700">Unidade</TableHead>
                    <TableHead className="font-semibold text-gray-700">Categoria</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.sku} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-mono text-sm font-medium">{product.sku}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.marca}</TableCell>
                      <TableCell>{product.supplier}</TableCell>
                      <TableCell><span className="font-medium">{product.peso}</span></TableCell>
                      <TableCell><Badge variant="outline">{product.unitMeasure}</Badge></TableCell>
                      <TableCell><Badge className={getCategoryColor(product.category)} variant="secondary">{product.category}</Badge></TableCell>
                      <TableCell className="text-center"><Button onClick={() => onSelectProduct(product)} size="sm" className="bg-blue-600 hover:bg-blue-700">Selecionar</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t"><Button onClick={onClose} variant="outline" className="flex items-center gap-2"><X className="w-4 h-4" /> Fechar</Button></div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 📦 Componente principal
export default function CadastroProdutos() {
  const [sku, setSku] = useState("")
  const [name, setName] = useState("")
  const [marca, setMarca] = useState("")
  const [supplier, setSupplier] = useState("")
  const [quantity, setQuantity] = useState("")
  const [peso, setPeso] = useState("")
  const [pesoTotal, setPesoTotal] = useState("")
  const [unitMeasure, setUnitMeasure] = useState("")
  const [category, setCategory] = useState("")
  const [tipo, setTipo] = useState("")
  const [unitPrice, setUnitPrice] = useState("")
  const [totalPrice, setTotalPrice] = useState("")
  const [dateAdded, setDateAdded] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [unit, setUnit] = useState("")

  useEffect(() => {
    const dbProdutos = ref(db, "EntradaProdutos")
    onValue(dbProdutos, (snapshot) => {
      const data = snapshot.val()
      if (data) {const loadedProducts = Object.keys(data).map((key) => ({ ...data[key], sku: key }));setProducts(loadedProducts);}})}, [])

  const resetForm = () => {setSku(""); setName(""); setMarca(""); setSupplier(""); setPeso(""); setUnitMeasure(""); setQuantity(""); setPesoTotal("");
    setCategory(""); setTipo(""); setUnitPrice(""); setTotalPrice(""); setDateAdded(""); setExpiryDate("");}

  const handleSelectProduct = (product) => {setSku(product.sku); setName(product.name); setMarca(product.marca); setSupplier(product.supplier); setPeso(product.peso); setUnit(product.unit); setUnitMeasure(product.unitMeasure); setCategory(product.category); setTipo(product.tipo); setUnitPrice(product.unitPrice); setTotalPrice(product.totalPrice); setQuantity(product.quantity); 
    setDateAdded(product.dateAdded); setExpiryDate(product.expiryDate); setShowModal(false);}

const handleSave = () => {
  if (!sku || !quantity) {
    toast.error("Preencha SKU e Quantidade.");
    return;
  }

  const estoqueRef = ref(db, `Estoque/${sku}`);
  
  onValue(
    estoqueRef,
    (snapshot) => {
      const existingData = snapshot.val();
      const quantidadeAtual = Number.parseInt(quantity);
      const pesoFloat = Number.parseFloat(peso) || 0;
      const precoUnit = Number.parseFloat((unitPrice || "0").replace(/\D/g, "")) / 100;

      const safeValue = (val, fallback = "") => val !== undefined && val !== null ? val : fallback;

      if (existingData) {
        const novaQuantidade = (Number.parseInt(existingData.quantity) || 0) + quantidadeAtual;
        const novoPesoTotal = pesoFloat * novaQuantidade;
        const novoTotalPrice = precoUnit * novaQuantidade;

        set(estoqueRef, {
          ...existingData,
          quantity: novaQuantidade,
          pesoTotal: novoPesoTotal,
          totalPrice: novoTotalPrice.toFixed(2),
          dateAdded: safeValue(dateAdded, new Date().toISOString().split("T")[0]),
          expiryDate: safeValue(expiryDate, existingData.expiryDate || ""),
          unit: safeValue(unit),
          unitMeasure: safeValue(unitMeasure),
          peso: safeValue(peso, 0),
          unitPrice: safeValue(unitPrice, "0"),
        })
        .then(() => { toast.success("Produto atualizado com sucesso!"); resetForm(); })
        .catch((error) => toast.error("Erro ao atualizar: " + error.message));
      } else {
        const novoProduto = {
          sku,
          name: safeValue(name),
          marca: safeValue(marca),
          supplier: safeValue(supplier),
          peso: pesoFloat,
          unitMeasure: safeValue(unitMeasure),
          unit: safeValue(unit),
          quantity: quantidadeAtual,
          pesoTotal: pesoFloat * quantidadeAtual,
          category: safeValue(category),
          tipo: safeValue(tipo),
          unitPrice: safeValue(unitPrice, "0"),
          totalPrice: (precoUnit * quantidadeAtual).toFixed(2),
          dateAdded: safeValue(dateAdded, new Date().toISOString().split("T")[0]),
          expiryDate: safeValue(expiryDate, ""),
        };

        set(estoqueRef, novoProduto)
          .then(() => { toast.success("Produto adicionado ao estoque!"); resetForm(); })
          .catch((error) => toast.error("Erro ao salvar: " + error.message));
      }
    },
    { onlyOnce: true },
  );
}

  const handleQuantityChange = (e) => {
    const q = e.target.value
    setQuantity(q)
    if (peso && q) setPesoTotal(Number.parseFloat(peso) * Number.parseInt(q))
    if (unitPrice && q) {const parsed = Number.parseFloat(unitPrice.replace(/\D/g, "")) / 100; setTotalPrice(parsed * Number.parseInt(q))}
  }

  const handleUnitPriceChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, "")
    const formattedValue = new Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL",}).format(inputValue / 100);
    setUnitPrice(formattedValue);
    if (quantity) {const parsed = Number.parseFloat(formattedValue.replace(/\D/g, "")) / 100; setTotalPrice(parsed * Number.parseInt(quantity))}
  }

  const handlePesoChange = (e) => {const p = e.target.value; setPeso(p); if (quantity && p) {setPesoTotal(Number.parseFloat(p) * Number.parseInt(quantity))}}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl md:text-3xl font-bold text-center flex items-center justify-center gap-3"><ShoppingCart className="w-8 h-8" />Entrada de Produtos</CardTitle></CardHeader>
          <CardContent className="p-6 md:p-8 space-y-8">
            {/* Botão de Seleção */}
            <div className="flex justify-center">
              <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-lg font-medium"><Plus className="w-5 h-5 mr-2" /> Selecionar Produto</Button>
            </div>

            {/* Informações do Produto */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2"><FileText className="w-5 h-5 text-green-600" />Informações do Produto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-sm font-medium text-gray-700 flex items-center gap-2"><Tag className="w-4 h-4" />SKU</Label>
                  <Input id="sku" placeholder="Código SKU" value={sku} onChange={(e) => setSku(e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2"><Package className="w-4 h-4" />Produto</Label>
                  <Input id="name" placeholder="Nome do produto" value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marca" className="text-sm font-medium text-gray-700 flex items-center gap-2"><Building2 className="w-4 h-4" />Marca</Label>
                  <Input id="marca" placeholder="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier" className="text-sm font-medium text-gray-700 flex items-center gap-2"><Truck className="w-4 h-4" /> Fornecedor </Label>
                  <Input id="supplier" placeholder="Fornecedor" value={supplier} onChange={(e) => setSupplier(e.target.value)} className="h-11"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">Categoria</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="Selecionar categoria" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Proteína">Proteína</SelectItem>
                      <SelectItem value="Mantimento">Mantimento</SelectItem>
                      <SelectItem value="Hortaliças">Hortaliças</SelectItem>
                      <SelectItem value="Doações">Doações</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipo" className="text-sm font-medium text-gray-700">Tipo</Label>
                      <Select value={tipo} onValueChange={setTipo}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Frutas">Frutas</SelectItem>
                          <SelectItem value="Legumes">Legumes</SelectItem>
                          <SelectItem value="Verduras">Verduras</SelectItem>
                          <SelectItem value="Bovina">Bovina</SelectItem>
                          <SelectItem value="Ave">Ave</SelectItem>
                          <SelectItem value="Suína">Suína</SelectItem>
                          <SelectItem value="Pescado">Pescado</SelectItem>
                          <SelectItem value="Mercado">Mercado</SelectItem>
                          <SelectItem value="Diversos">Diversos</SelectItem>
                          <SelectItem value="Produtos em Consumo">Produtos em Consumo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

              </div>
            </div>

            {/* Especificações e Quantidades */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2"><Calculator className="w-5 h-5 text-green-600" />Especificações e Quantidades</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm font-medium text-gray-700 flex items-center gap-2"><Package className="w-4 h-4" />Quantidade *</Label>
                  <Input id="quantity" placeholder="Quantidade" value={quantity} onChange={handleQuantityChange} className="h-11" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="peso" className="text-sm font-medium text-gray-700 flex items-center gap-2"><Weight className="w-4 h-4" /> Peso Unitário </Label>
                  <Input id="peso" placeholder="Peso unitário" value={peso || ""} onChange={handlePesoChange} className="h-11" type="number" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitMeasure" className="text-sm font-medium text-gray-700"> Unidade de Medida</Label>
                  <Input id="unitMeasure" placeholder="Unidade de medida" value={unitMeasure} readOnly className="h-11 bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pesoTotal" className="text-sm font-medium text-gray-700 flex items-center gap-2"><Calculator className="w-4 h-4" />Peso Total</Label>
                  <Input id="pesoTotal" placeholder="Peso total" value={pesoTotal} disabled className="h-11 bg-gray-50" />
                </div>
              </div>
            </div>

            {/* Valores e Datas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2"><DollarSign className="w-5 h-5 text-green-600" />Valores e Datas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unitPrice" className="text-sm font-medium text-gray-700 flex items-center gap-2"><DollarSign className="w-4 h-4" />Preço Unitário</Label>
                  <Input id="unitPrice" placeholder="R$ 0,00" value={unitPrice} onChange={handleUnitPriceChange} className="h-11"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalPrice" className="text-sm font-medium text-gray-700 flex items-center gap-2"><Calculator className="w-4 h-4" />Preço Total</Label>
                  <Input id="totalPrice" placeholder="R$ 0,00" value={totalPrice} disabled className="h-11 bg-gray-50 font-medium" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateAdded" className="text-sm font-medium text-gray-700 flex items-center gap-2"><Calendar className="w-4 h-4" />Data de Entrada</Label>
                  <Input id="dateAdded" type="date" value={dateAdded} onChange={(e) => setDateAdded(e.target.value)}className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate" className="text-sm font-medium text-gray-700 flex items-center gap-2"><Clock className="w-4 h-4" />Data de Validade</Label>
                  <Input id="expiryDate" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="h-11" />
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Button onClick={handleSave} className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-medium"><Save className="w-4 h-4 mr-2" />Salvar no Estoque</Button>
              <Link to="/Cadastro" className="flex-1 h-12 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md flex items-center justify-center transition-colors"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Link>
            </div>
          </CardContent>
        </Card>

        {showModal && ( <Modal products={products} onSelectProduct={handleSelectProduct} onClose={() => setShowModal(false)} />)}
      </div>
    </div>
  )
}


// Código antigo para upload de planilha Excel
// import React from "react";
// import { useState } from "react";
// import * as XLSX from "xlsx";
// import { getDatabase, ref, set } from "firebase/database";
// import { toast } from "react-toastify";
// import { Input } from "@/components/ui/input";

// const db = getDatabase();

// export default function CadastroProdutos() {
//   const [loading, setLoading] = useState(false);

//   const safeParseFloat = (value) => {
//     if (typeof value === "string") {
//       value = value.replace(",", "."); // troca vírgula por ponto
//     }
//     const parsed = parseFloat(value);
//     return isNaN(parsed) ? 0 : parsed;
//   };

//   const handleFileUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setLoading(true);
//     const reader = new FileReader();

//     reader.onload = async (evt) => {
//       try {
//         const binaryStr = evt.target?.result;
//         const workbook = XLSX.read(binaryStr, { type: "binary" });
//         const firstSheet = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[firstSheet];
//         const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

//         for (const item of jsonData) {
//           const sku = item.sku?.toString().trim();
//           if (!sku) continue;

//           const produto = {
//             sku,
//             name: item.name?.toString().trim() || "",
//             marca: item.marca?.toString().trim() || "",
//             supplier: item.supplier?.toString().trim() || "",
//             peso: safeParseFloat(item.peso),
//             unitMeasure: item.unitMeasure?.toString().trim() || "",
//             category: item.category?.toString().trim() || "",
//             tipo: item.tipo?.toString().trim() || "",
//           };

//           // Ignora apenas se peso não for numérico
//           if (isNaN(produto.peso)) {
//             console.warn("⚠️ Produto ignorado por peso inválido:", produto);
//             continue;
//           }

//           const entradaProdutosRef = ref(db, `EntradaProdutos/${sku}`);
//           await set(entradaProdutosRef, produto);
//         }

//         toast.success("✅ Planilha importada com sucesso!");
//       } catch (error) {
//         console.error("Erro ao importar:", error);
//         toast.error("❌ Erro ao importar planilha.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     reader.readAsBinaryString(file);
//   };

//   return (
//     <div className="my-6">
//       <label className="font-medium mb-2 block">
//         📥 Importar planilha Excel (.xlsx ou .xls)
//       </label>
//       <Input
//         type="file"
//         accept=".xlsx,.xls"
//         onChange={handleFileUpload}
//         disabled={loading}
//       />
//       {loading && <p className="text-blue-700 mt-2">Importando dados...</p>}
//     </div>
//   );
// }
