import { useState, useEffect } from "react"
import { db } from "../../../../firebase"
import { ref, set, get } from "firebase/database"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input/index"
import { Button } from "@/components/ui/button/button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/index"
import { Label } from "@/components/ui/label/index"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog/dialog"
import { Package, Tag, Building2, Truck, Weight, Search, ArrowLeft, Save, Plus, X, Phone, Mail, FileText } from "lucide-react"

export default function CadProdutos() {
  const [sku, setSku] = useState("")
  const [name, setName] = useState("")
  const [marca, setMarca] = useState("")
  const [supplier, setSupplier] = useState("")
  const [peso, setPeso] = useState("")
  const [unitMeasure, setUnitMeasure] = useState("Selecionar")
  const [unit, setUnit] = useState("Selecionar")
  const [category, setCategory] = useState("Selecionar Categoria")
  const [tipo, setTipo] = useState("Selecionar Tipo")
  const [saveLoading, setSaveLoading] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const suppliersRef = ref(db, "CadastroFornecedores")
        const snapshot = await get(suppliersRef)
        if (snapshot.exists()) {setSuppliers(Object.values(snapshot.val()))} 
        else {toast.warn("Nenhum fornecedor encontrado!")}
    } 
      catch (error) {toast.error("Erro ao carregar fornecedores!")}
    }; fetchSuppliers();}, [])
  const formatCNPJ = (cnpj) => {return cnpj?.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}
  const formatPhone = (phone) => {return phone?.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")}
  const filteredSuppliers = suppliers.filter((sup) => (sup.razaoSocial?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || (sup.cnpj?.toLowerCase() || "").includes(searchTerm.toLowerCase()),)
  const handleSave = async () => {
    if (!sku || !name || !marca || !supplier || !peso || unitMeasure === "Selecionar" || unit === "Selecionar") {toast.error("Por favor, preencha todos os campos obrigatórios!"); return;}
    setSaveLoading(true);
    const newProduct = { sku, name, marca, supplier, peso, unitMeasure, unit, category, tipo }
    const newProductRef = ref(db, "EntradaProdutos/" + sku)

    try {await set(newProductRef, newProduct); toast.success("Produto salvo com sucesso!"); handleClearFields();} 
    catch (err) {toast.error("Erro ao salvar o produto: " + err.message)} 
    finally {setSaveLoading(false)}

  }

  const handleClearFields = () => {setSku(""); setName(""); setMarca(""); setSupplier(""); setPeso(""); setUnitMeasure("Selecionar"); 
    setUnit("Selecionar"); setCategory("Selecionar Categoria"); setTipo("Selecionar Tipo");};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg"><CardTitle className="text-2xl md:text-3xl font-bold text-center flex items-center justify-center gap-3"><Package className="w-8 h-8" />Cadastro de Produtos</CardTitle></CardHeader>

          <CardContent className="p-6 md:p-8 space-y-8">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2"><FileText className="w-5 h-5 text-blue-600" />Informações Básicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-sm font-medium text-gray-700 flex items-center gap-2"><Tag className="w-4 h-4" />SKU *</Label>
                  <Input id="sku" placeholder="Digite o código SKU" value={sku} onChange={(e) => setSku(e.target.value)}className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2"><Package className="w-4 h-4" />Nome do Produto *</Label>
                  <Input id="name" placeholder="Digite o nome do produto" value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marca" className="text-sm font-medium text-gray-700 flex items-center gap-2"><Building2 className="w-4 h-4" />Marca *</Label>
                  <Input id="marca" placeholder="Digite a marca" value={marca} onChange={(e) => setMarca(e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier" className="text-sm font-medium text-gray-700 flex items-center gap-2"><Truck className="w-4 h-4" />Fornecedor *</Label>
                  <div className="relative">
                    <Input id="supplier" placeholder="Clique para selecionar fornecedor" value={supplier} onClick={() => setModalOpen(true)} readOnly className="h-11 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"/>
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Especificações */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2"><Weight className="w-5 h-5 text-blue-600" />Especificações</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="peso" className="text-sm font-medium text-gray-700">Peso *</Label>
                  <Input id="peso" placeholder="Digite o peso" value={peso} onChange={(e) => setPeso(e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitMeasure" className="text-sm font-medium text-gray-700">Unidade de Peso *</Label>
                  <Select value={unitMeasure} onValueChange={setUnitMeasure}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="Selecione o peso" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="g">Gramas (g)</SelectItem>
                      <SelectItem value="kg">Quilos (kg)</SelectItem>
                      <SelectItem value="ml">Mililitros (ml)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit" className="text-sm font-medium text-gray-700">Unidade de Medida *</Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="Selecionar unidade" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="un">Unidade</SelectItem>
                      <SelectItem value="fd">Fardo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">Categoria</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="Selecionar categoria" /> </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Proteina">Proteína</SelectItem>
                      <SelectItem value="Mantimento">Mantimento</SelectItem>
                      <SelectItem value="Hortifrut">Hortifrut</SelectItem>
                      <SelectItem value="Doações">Doações</SelectItem>
                      <SelectItem value="Produtos de Limpeza">Produtos de Limpeza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-sm font-medium text-gray-700">Tipo</Label>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Selecionar tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aves">Aves</SelectItem>
                    <SelectItem value="Suínos">Suínos</SelectItem>
                    <SelectItem value="Bovinos">Bovinos</SelectItem>
                    <SelectItem value="Pescados">Pescados</SelectItem>
                    <SelectItem value="Frutas">Frutas</SelectItem>
                    <SelectItem value="Legumes">Legumes</SelectItem>
                    <SelectItem value="Verduras">Verduras</SelectItem>
                    <SelectItem value="ProdutosConsumo">Produtos de Consumo</SelectItem>
                    <SelectItem value="ProdutosLimpeza">Produtos de Limpeza</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Button onClick={handleSave} disabled={saveLoading} className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-medium">
                {saveLoading ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Salvando...</>) : (
                  <><Save className="w-4 h-4 mr-2" />Salvar Produto</>)}</Button>
              <Button onClick={() => navigate(-1)} variant="outline" className="flex-1 h-12 border-gray-300 hover:bg-gray-50"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
            </div>
          </CardContent>
        </Card>

        {/* Modal Fornecedores */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader><DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2"><Truck className="w-6 h-6 text-blue-600" />Selecionar Fornecedor</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Buscar por Razão Social ou CNPJ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-11" />
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-[50vh]">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="p-4 text-left font-medium text-gray-700">CNPJ</th>
                        <th className="p-4 text-left font-medium text-gray-700">Razão Social</th>
                        <th className="p-4 text-left font-medium text-gray-700">Contato</th>
                        <th className="p-4 text-left font-medium text-gray-700">Status</th>
                        <th className="p-4 text-center font-medium text-gray-700">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredSuppliers.map((sup) => (
                        <tr key={sup.cnpj} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-mono text-sm">{formatCNPJ(sup.cnpj)}</td>
                          <td className="p-4 font-medium">{sup.razaoSocial}</td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-gray-600"><Phone className="w-3 h-3" />{formatPhone(sup.telefone)}</div>
                              <div className="flex items-center gap-2 text-sm text-gray-600"><Mail className="w-3 h-3" />{sup.email}</div>
                            </div>
                          </td>
                          <td className="p-4"><Badge variant={sup.status === "Ativo" ? "default" : "destructive"} className={sup.status === "Ativo" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>{sup.status}</Badge></td>
                          <td className="p-4 text-center"><Button onClick={() => {setSupplier(sup.razaoSocial); setModalOpen(false);}}size="sm"className="bg-blue-600 hover:bg-blue-700">Selecionar</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button onClick={() => navigate("/Cadastro_Fornecedor")} className="flex-1 bg-green-600 hover:bg-green-700"><Plus className="w-4 h-4 mr-2" />Novo Fornecedor</Button>
                <Button onClick={() => setModalOpen(false)} variant="outline" className="flex-1"><X className="w-4 h-4 mr-2" />Fechar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <ToastContainer position="top-right"autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      </div>
    </div>
  )
}
