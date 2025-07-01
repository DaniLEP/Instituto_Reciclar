import { useState, useEffect } from "react"
import { initializeApp, getApps } from "firebase/app"
import { getDatabase, ref, update, onValue } from "firebase/database"
import { toast, ToastContainer } from "react-toastify"
import debounce from "lodash.debounce"
import "react-toastify/dist/ReactToastify.css"
import { Button } from "@/components/ui/button/button"
import { Input } from "@/components/ui/input/index"
import { Label } from "@/components/ui/label/index"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/index"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table"
import { Package, Search, Edit, ArrowLeft, Building2, Tag, Truck, Weight, Save, X, Filter, Grid3X3 } from "lucide-react"

// Configuração do Firebase
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
function Gerenciador() {
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const dbRef = ref(db, "EntradaProdutos")
    onValue(dbRef, (snapshot) => {
      setLoading(false)
      const data = snapshot.val();
      if (data) {const loadedProducts = Object.keys(data).map((key) => ({ ...data[key], id: key })); setProducts(loadedProducts)}
    })
  }, [])

  const handleSearchChange = debounce((value) => {setSearchTerm(value);}, 500)
  const filteredProducts = products
    .filter((product) => {
      return ((product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) || (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (product.supplier && product.supplier.toLowerCase().includes(searchTerm.toLowerCase())) || (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) || (product.tipo && product.tipo.toLowerCase().includes(searchTerm.toLowerCase())))
    })
    .sort((a, b) => {if (!a.name) return 1; if (!b.name) return -1; return a.name.localeCompare(b.name, "pt", { sensitivity: "base" })})

  const openModal = (product) => {setEditingProduct(product); setIsModalOpen(true);}
  const closeModal = () => {setEditingProduct(null); setIsModalOpen(false);}
  const handleUpdate = () => {
    if (editingProduct) {
      const productRef = ref(db, `EntradaProdutos/${editingProduct.id}`)
      update(productRef, editingProduct)
        .then(() => {toast.success("Produto atualizado com sucesso!"); closeModal();})
        .catch((error) => {toast.error("Erro ao atualizar: " + error.message)})
    }
  }

  const handleInputChange = (e) => {const { name, value } = e.target; setEditingProduct({ ...editingProduct, [name]: value })}
  const getCategoryColor = (category) => {const colors = {Proteína: "bg-red-100 text-red-800", Mantimento: "bg-yellow-100 text-yellow-800", Hortaliças: "bg-green-100 text-green-800", Doações: "bg-blue-100 text-blue-800",}
    return colors[category] || "bg-gray-100 text-gray-800";}

  const getTipoColor = (tipo) => {const colors = {Frutas: "bg-orange-100 text-orange-800", Legumes: "bg-green-100 text-green-800", Verduras: "bg-emerald-100 text-emerald-800", 
      Bovina: "bg-red-100 text-red-800", Ave: "bg-yellow-100 text-yellow-800", Suína: "bg-pink-100 text-pink-800", Pescado: "bg-blue-100 text-blue-800", Mercado: "bg-purple-100 text-purple-800",}
    return colors[tipo] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        {/* Header */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg"><CardTitle className="text-2xl md:text-3xl font-bold text-center flex items-center justify-center gap-3"><Package className="w-8 h-8" />Gerenciador de Produtos</CardTitle></CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input type="text" placeholder="Filtrar por SKU, Nome, Fornecedor, Categoria ou Tipo..." onChange={(e) => handleSearchChange(e.target.value)} className="pl-10 h-11" />
              </div>
              <Button onClick={() => window.history.back()} variant="outline" className="w-full md:w-auto h-11 border-gray-300 hover:bg-gray-50"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {loading ? (
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="w-5 h-5 text-gray-600" /><span className="font-semibold text-gray-800">{filteredProducts.length} produto(s) encontrado(s)</span>
                </div>
                <Badge variant="outline" className="flex items-center gap-1"><Filter className="w-3 h-3" />Filtros ativos</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700"><div className="flex items-center gap-2"><Tag className="w-4 h-4" />SKU</div></TableHead>
                      <TableHead className="font-semibold text-gray-700"><div className="flex items-center gap-2"><Package className="w-4 h-4" />Produto</div></TableHead>
                      <TableHead className="font-semibold text-gray-700"><div className="flex items-center gap-2"><Building2 className="w-4 h-4" />Marca</div></TableHead>
                      <TableHead className="font-semibold text-gray-700"><div className="flex items-center gap-2"><Truck className="w-4 h-4" />Fornecedor</div></TableHead>
                      <TableHead className="font-semibold text-gray-700">Tipo</TableHead>
                      <TableHead className="font-semibold text-gray-700">Categoria</TableHead>
                      <TableHead className="font-semibold text-gray-700"><div className="flex items-center gap-2"><Weight className="w-4 h-4" />Peso</div></TableHead>
                      <TableHead className="font-semibold text-gray-700">Unidade</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-mono text-sm font-medium">{product.sku}</TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.marca}</TableCell>
                        <TableCell>{product.supplier}</TableCell>
                        <TableCell><Badge className={getTipoColor(product.tipo)} variant="secondary">{product.tipo}</Badge></TableCell>
                        <TableCell><Badge className={getCategoryColor(product.category)} variant="secondary">{product.category}</Badge></TableCell>
                        <TableCell><span className="font-medium">{product.peso}</span><span className="text-gray-500 ml-1">{product.unitMeasure}</span></TableCell>
                        <TableCell><Badge variant="outline">{product.unitMeasure}</Badge></TableCell>
                        <TableCell className="text-center"><Button onClick={() => openModal(product)} size="sm" className="bg-blue-600 hover:bg-blue-700"><Edit className="w-4 h-4" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal de Edição */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2"><Edit className="w-6 h-6 text-blue-600" />Editar Produto</DialogTitle></DialogHeader>
            {editingProduct && (
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2"><Package className="w-5 h-5 text-blue-600" />Informações Básicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nome do Produto</Label>
                      <Input id="name" name="name" value={editingProduct.name || ""} onChange={handleInputChange} placeholder="Nome do produto" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="marca" className="text-sm font-medium text-gray-700">Marca</Label>
                      <Input id="marca" name="marca" value={editingProduct.marca || ""} onChange={handleInputChange} placeholder="Marca" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier" className="text-sm font-medium text-gray-700">Fornecedor</Label>
                      <Input id="supplier" name="supplier" value={editingProduct.supplier || ""} onChange={handleInputChange} placeholder="Fornecedor" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="peso" className="text-sm font-medium text-gray-700">Peso</Label>
                      <Input id="peso" name="peso" value={editingProduct.peso || ""} onChange={handleInputChange} placeholder="Peso" className="h-11" />
                    </div>
                  </div>
                </div>

                {/* Especificações */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2"><Weight className="w-5 h-5 text-blue-600" />Especificações</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="unitMeasure" className="text-sm font-medium text-gray-700">Unidade de Medida</Label>
                      <Select value={editingProduct.unitMeasure || ""} onValueChange={(value) => setEditingProduct({ ...editingProduct, unitMeasure: value })}>
                        <SelectTrigger className="h-11"><SelectValue placeholder="Selecione a unidade" /> </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="g">Gramas</SelectItem>
                          <SelectItem value="kg">Quilos</SelectItem>
                          <SelectItem value="L">Litros</SelectItem>
                          <SelectItem value="ml">Mili-Litros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit" className="text-sm font-medium text-gray-700">Unidade</Label>
                      <Select value={editingProduct.unit || ""} onValueChange={(value) => setEditingProduct({ ...editingProduct, unit: value })}>
                        <SelectTrigger className="h-11"><SelectValue placeholder="Selecione a unidade" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="un">Unidade</SelectItem>
                          <SelectItem value="fd">Fardo</SelectItem>
                          <SelectItem value="cx">Caixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium text-gray-700">Categoria</Label>
                      <Select value={editingProduct.category || ""} onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}>
                        <SelectTrigger className="h-11"><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
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
                      <Select value={editingProduct.tipo || ""} onValueChange={(value) => setEditingProduct({ ...editingProduct, tipo: value })}>
                        <SelectTrigger className="h-11"><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Frutas">Frutas</SelectItem>
                          <SelectItem value="Legumes">Legumes</SelectItem>
                          <SelectItem value="Verduras">Verduras</SelectItem>
                          <SelectItem value="Bovina">Bovina</SelectItem>
                          <SelectItem value="Ave">Ave</SelectItem>
                          <SelectItem value="Suína">Suína</SelectItem>
                          <SelectItem value="Pescado">Pescado</SelectItem>
                          <SelectItem value="Mercado">Mercado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                  <Button onClick={handleUpdate} className="flex-1 bg-green-600 hover:bg-green-700 h-11"><Save className="w-4 h-4 mr-2" />Atualizar Produto</Button>
                  <Button onClick={closeModal} variant="outline" className="flex-1 h-11"><X className="w-4 h-4 mr-2" /> Cancelar </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
export default Gerenciador