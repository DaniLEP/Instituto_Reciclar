import { useState, useEffect } from "react";
import {  ref, onValue, update, db } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/Button/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table } from "@/components/ui/table/table";
const dbProdutos = ref(db, "Estoque");

export default function Estoque() {
  const [searchTerm, setSearchTerm] = useState("");
  const [productsData, setProductsData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPeso, setTotalPeso] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [filtroInicio, setFiltroInicio] = useState("");
  const [filtroFim, setFiltroFim] = useState("");
  const [valorEditado, setValorEditado] = useState("");
  const [editando, setEditando] = useState(null);
  const [statusFiltro, setStatusFiltro] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onValue(dbProdutos, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const products = Object.keys(data).map((key) => ({sku: key, ...data[key],}));
         setProductsData(products); setFilteredProducts(products); calculateTotals(products);}
    }); return () => unsubscribe();
  }, []);

  useEffect(() => {calculateTotals(filteredProducts);}, [filteredProducts]);

  // Calcular totais
  const calculateTotals = (products) => {
    const qty = products.reduce((acc, i) => acc + parseInt(i.quantity, 10), 0);
    const peso = products.reduce((acc, i) => acc + parseFloat(i.peso || 0), 0);
    const price = products.reduce((acc, i) => acc + (parseFloat(i.totalPrice) || 0), 0);
    setTotalQuantity(qty);
    setTotalPeso(peso);
    setTotalPrice(price);
  };

  // Busca por termo
  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = productsData.filter((item) => {
      if (!term) return true;
      if (!isNaN(searchTerm)) return String(item.sku) === searchTerm.trim();
      return [item.name, item.supplier, item.marca, item.category, item.tipo, item.status].some((field) => field?.toLowerCase().includes(term));
      });setFilteredProducts(filtered);
  };

  // Filtro por data
  const handleDateFilter = () => {
    if (!filtroInicio && !filtroFim) {
      setFilteredProducts(productsData);
      return;
    }
    const inicio = filtroInicio ? new Date(filtroInicio) : null;
    const fim = filtroFim ? new Date(filtroFim) : null;
    const filtered = productsData.filter((item) => {
    const cad = item.dateAdded ? new Date(item.dateAdded.slice(0, 10)) : null; 
      if (!cad) return false; return (!inicio || cad >= inicio) && (!fim || cad <= fim);});
      setFilteredProducts(filtered);
  };
  const clearDateFilter = () => {setFiltroInicio(""); setFiltroFim(""); setFilteredProducts(productsData);};
  const voltar = () => navigate("/Home");

  // Dias para consumo
  const calculateConsumptionDays = (dateAdded, expiryDate) => {
    const today = new Date();
    const exp = new Date(expiryDate);
    const diff = exp - today;
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

const getStatus = (item) => {
  if (parseInt(item.quantity, 10) < 5) return "Estoque Baixo";
  if (isExpired(item.expiryDate)) return "Produto Vencido";
  return "Estoque Abastecido";
};


const handleStatusFilter = (status) => {
  setStatusFiltro(status);
  if (!status) {
    setFilteredProducts(productsData);
    return;
  }
  const filtered = productsData.filter((item) => getStatus(item) === status);
  setFilteredProducts(filtered);
};

  // Formatar data sem shift de fuso
const formatDate = (date) => {
  if (!date) return "--";
  try {
    const d = new Date(date);
    const day = String(d.getUTCDate()).padStart(2, "0");
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const year = d.getUTCFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "--";
  }
};


  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = new Date(expiryDate);
    exp.setHours(0, 0, 0, 0);
    return exp < today;
  };

  // Edição inline
  const handleDoubleClick = (sku, value) => {setEditando(sku); setValorEditado(value?.slice(0, 10) || "");};
  const handleChange = (e) => setValorEditado(e.target.value);
  const handleSave = (sku) => {
    if (!valorEditado) return;
    const formatted = new Date(valorEditado).toISOString().split("T")[0];
    const produtoRef = ref(db, `Estoque/${sku}`);
    update(produtoRef, { expiryDate: formatted })
      .then(() => {
        setProductsData((prev) => prev.map((i) => i.sku === sku ? { ...i, expiryDate: formatted } : i));
        setFilteredProducts((prev) => prev.map((i) => i.sku === sku ? { ...i, expiryDate: formatted } : i));
          setEditando(null);
      }).catch(console.error);
  };

  // Exportar Excel
  const exportToExcel = (products) => {
    const ws = XLSX.utils.json_to_sheet(
      products.map((item) => ({
      Status: parseInt(item.quantity, 10) < 5 ? "Estoque baixo" : isExpired(item.expiryDate) ? "Produto vencido" : "Estoque Abastecido",
      SKU: item.sku, Nome: item.name, Marca: item.marca, Peso: item.peso, Quantidade: item.quantity, "Unidade de Medida": item.unitmeasure,
      "Valor Unitário": item.unitPrice, "Valor Total": item.totalPrice, "Data de Vencimento": item.expiryDate || "--", "Dias para Consumo": calculateConsumptionDays( item.dateAdded,item.expiryDate), "Data de Cadastro": formatDate(item.dateAdded), Fornecedor: item.supplier, Categoria: item.category || "N/A", Tipo: item.tipo || "N/A",})));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Estoque");
      XLSX.writeFile(wb, "Estoque.xlsx");
  };

  return (
    <div className="bg-gradient-to-br from-[#0a192f] to-[#1e3a8a] min-h-screen py-9">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl sm:text-3xl text-black font-semibold text-blackc mb-4 sm:mb-0">Controle de Estoque</h1>
          <Button onClick={voltar} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">Voltar</Button>
        </div>
        {/* Busca */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input type="text" placeholder="Buscar SKU, nome, fornecedor, categorias..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="col-span-2 w-full"/>
          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white w-full">Pesquisar</Button>
        </div>
        {/* Busca por status */}
        <div className="mb-6">
        <Label className="block text-gray-700 mb-1">Filtrar por Status</Label>
        <select value={statusFiltro} onChange={(e) => handleStatusFilter(e.target.value)} className="w-full p-2 border rounded bg-white text-gray-700">
          <option value="">Todos</option>
          <option value="Estoque Abastecido">Estoque Abastecido</option>
          <option value="Estoque Baixo">Estoque Baixo</option>
          <option value="Produto Vencido">Produto Vencido</option>
        </select>
      </div>

        {/* Filtro de Datas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          <div>
            <Label className="block text-gray-700 mb-1">Início</Label>
            <Input type="date" value={filtroInicio} onChange={(e) => setFiltroInicio(e.target.value)} className="w-full"/>
          </div>
          <div>
            <Label className="block text-gray-700 mb-1">Fim</Label>
            <Input type="date" value={filtroFim} onChange={(e) => setFiltroFim(e.target.value)} className="w-full"/>
          </div>
          <Button onClick={handleDateFilter} className="bg-green-600 hover:bg-green-700 text-white w-full">Filtrar</Button>
          <Button onClick={clearDateFilter} className="bg-red-600 hover:bg-red-700 text-white w-full">Limpar</Button>
        </div>
        {/* Totais */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-6">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-gray-500">Valor Total</p>
            <p className="text-xl font-semibold">R$ {totalPrice.toFixed(2).replace(".", ",")}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-gray-500">Peso Total</p>
            <p className="text-xl font-semibold">{totalPeso.toFixed(2)} KG</p>
          </div>
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-gray-500">Qtd. Total</p>
            <p className="text-xl font-semibold">{totalQuantity}</p>
          </div>
        </div>
        {/* Legenda dos Status */}
      <div className="grid grid-line-1 sm:grid-cols-3 gap-3 text-center mb-4">
        <div className="flex items-center  gap-2">
          <span className="text-green-600 text-xl">✅</span>
          <span>Estoque normal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-500 text-xl">⚠️</span>
          <span>Estoque baixo (menos de 5 unidades)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-600 text-xl">❌</span>
          <span>Próximos do vencimento / vencidos</span>
        </div>
      </div>
        {/* Tabela */}
        <div className="w-full max-h-[70vh] overflow-x-auto overflow-y-auto border rounded-lg shadow-sm bg-white">
          <Table className="min-w-[1200px] table-auto border-collapse">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">SKU</th>
                <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Nome</th>
                <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Marca</th>
                <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Peso</th>
                <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Unid. Medida</th>
                <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Qtd.</th>
                <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Valor Unit.</th>
                <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Valor Total</th>
                <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Vencimento</th>
                <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Dias Rest.</th>
                <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Cadastro</th>
                <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Fornecedor</th>
                <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Categoria</th>
                <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item, idx) => {
                const days = calculateConsumptionDays(item.dateAdded, item.expiryDate);
                const low = parseInt(item.quantity, 10) < 5;
                const expired = isExpired(item.expiryDate);
                return (
                  <tr key={idx} className="hover:bg-gray-50 even:bg-white odd:bg-gray-100">
                    <td className="p-2 text-center">{low ? "⚠️" : expired ? "❌" : "✅"}</td>
                    <td className="px-3 text-center py-2 whitespace-nowrap text-sm">{item.sku}</td>
                    <td className="px-3 text-center py-2 whitespace-nowrap text-sm">{item.name}</td>
                    <td className="px-3 text-center py-2 whitespace-nowrap text-sm">{item.marca}</td>
                    <td className="px-3 text-center py-2 whitespace-nowrap text-sm text-center">{item.peso}</td>
                    <td className="px-3 text-center py-2 whitespace-nowrap text-sm">{item.unit}</td>
                    <td className="px-3 text-center py-2 whitespace-nowrap text-sm text-center">{item.quantity}</td>
                    <td className="px-3 text-center py-2 whitespace-nowrap text-sm text-center">{item.unitPrice}</td>
                    <td className="px-3 text-center py-2 whitespace-nowrap text-sm text-center">{item.totalPrice}</td>
                    <td className="px-3 text-center py-2 whitespace-nowrap text-sm text-center cursor-pointer" onDoubleClick={() => handleDoubleClick(item.sku, item.expiryDate)}>
                      {editando === item.sku ? (<Input type="date" value={valorEditado} onChange={handleChange} onBlur={() => handleSave(item.sku)} className="border rounded w-full text-sm" autoFocus/>) : (formatDate(item.expiryDate))}</td>
                    <td className="px-3 text-center py-2 whitespace-nowrap text-sm text-center">{days}</td>
                    <td className="px-3 text-center py-2 whitespace-nowrap text-sm text-center">{formatDate(item.dateAdded)}</td>
                    <td className="px-3 text-center py-2 whitespace-nowrap text-sm">{item.supplier}</td>
                    <td className="px-3 text-center py-2 whitespace-nowrap text-sm">{item.category || "N/A"}</td>
                    <td className="px-3 text-center py-2 whitespace-nowrap text-sm">{item.tipo || "N/A"}</td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (<tr><td colSpan="15" className="p-4 text-center text-gray-500 italic">Nenhum registro encontrado.</td></tr>)}
            </tbody>
          </Table>
        </div>
        {/* Exportar */}
        <div className="text-right">
          <Button onClick={() => exportToExcel(filteredProducts)} className="bg-indigo-600 mt-4 hover:bg-indigo-700 text-white px-4 py-2 rounded">Exportar Excel</Button>
        </div>
      </div>
    </div>
  );
}
