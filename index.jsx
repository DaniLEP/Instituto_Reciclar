import { useState, useEffect } from "react"
import { initializeApp, getApps } from "firebase/app"
import { getDatabase, ref, update, onValue } from "firebase/database"
import { toast, ToastContainer } from "react-toastify"
import debounce from "lodash.debounce"
import "react-toastify/dist/ReactToastify.css"
import { Button } from "@/components/ui/Button/button"
import { Input } from "@/components/ui/input/index"
import { Label } from "@/components/ui/label/index"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/index"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table"
import { Package, Search, Edit, ArrowLeft, Building2, Tag, Truck, Weight, Save, X, Grid3X3, ChevronLeft, ChevronRight } from "lucide-react"

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

  // 🔹 Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // 🔹 Filtro por categoria
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    const dbRef = ref(db, "EntradaProdutos")
    onValue(dbRef, (snapshot) => {
      setLoading(false)
      const data = snapshot.val()
      if (data) {
        const loadedProducts = Object.keys(data).map((key) => ({ ...data[key], id: key }))
        setProducts(loadedProducts)
      }
    })
  }, [])

  const handleSearchChange = debounce((value) => {
    setSearchTerm(value)
    setCurrentPage(1) // reseta para página 1 ao buscar
  }, 500)

  // 🔹 Filtro + Busca
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.supplier && product.supplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.tipo && product.tipo.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory !== "all" ? product.category === selectedCategory : true

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (!a.name) return 1
      if (!b.name) return -1
      return a.name.localeCompare(b.name, "pt", { sensitivity: "base" })
    })

  // 🔹 Lógica da paginação
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  const openModal = (product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setEditingProduct(null)
    setIsModalOpen(false)
  }
  const handleUpdate = () => {
    if (editingProduct) {
      const productRef = ref(db, `EntradaProdutos/${editingProduct.id}`)
      update(productRef, editingProduct)
        .then(() => {
          toast.success("Produto atualizado com sucesso!")
          closeModal()
        })
        .catch((error) => {
          toast.error("Erro ao atualizar: " + error.message)
        })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditingProduct({ ...editingProduct, [name]: value })
  }

  const getCategoryColor = (category) => {
    const colors = {
      Proteína: "bg-red-100 text-red-800",
      Mantimento: "bg-yellow-100 text-yellow-800",
      Hortaliças: "bg-green-100 text-green-800",
      Doações: "bg-blue-100 text-blue-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const getTipoColor = (tipo) => {
    const colors = {
      Frutas: "bg-orange-100 text-orange-800",
      Legumes: "bg-green-100 text-green-800",
      Verduras: "bg-emerald-100 text-emerald-800",
      Bovina: "bg-red-100 text-red-800",
      Ave: "bg-yellow-100 text-yellow-800",
      Suína: "bg-pink-100 text-pink-800",
      Pescado: "bg-blue-100 text-blue-800",
      Mercado: "bg-purple-100 text-purple-800",
    }
    return colors[tipo] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Header */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl md:text-3xl font-bold text-center flex items-center justify-center gap-3">
              <Package className="w-8 h-8" />
              Gerenciador de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Filtrar por SKU, Nome, Fornecedor, Categoria ou Tipo..."
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Select value={selectedCategory} onValueChange={(value) => { setSelectedCategory(value); setCurrentPage(1) }}>
              <SelectTrigger className="w-48 h-11">
                <SelectValue placeholder="Filtrar Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Proteína">Proteína</SelectItem>
                <SelectItem value="Mantimento">Mantimento</SelectItem>
                <SelectItem value="Hortaliças">Hortaliças</SelectItem>
                <SelectItem value="Doações">Doações</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => window.history.back()} variant="outline" className="h-11">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
          </CardContent>
        </Card>

        {/* Tabela */}
        {!loading && (
          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-800">{filteredProducts.length} produto(s)</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>SKU</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Peso</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-gray-50">
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.marca}</TableCell>
                        <TableCell>{product.supplier}</TableCell>
                        <TableCell>
                          <Badge className={getTipoColor(product.tipo)}>{product.tipo}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(product.category)}>{product.category}</Badge>
                        </TableCell>
                        <TableCell>{product.peso} {product.unitMeasure}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.unitMeasure}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button onClick={() => openModal(product)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>

            {/* 🔹 Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 p-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                </Button>
                <span>Página {currentPage} de {totalPages}</span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Próxima <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Modal de Edição */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                <Edit className="w-6 h-6 text-blue-600" />Editar Produto
              </DialogTitle>
              {/* 🔹 Evita o warning de acessibilidade */}
              <DialogDescription>Atualize os campos do produto e clique em salvar</DialogDescription>
            </DialogHeader>
            {editingProduct && (
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <Package className="w-5 h-5 text-blue-600" />Informações Básicas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome do Produto</Label>
                      <Input id="name" name="name" value={editingProduct.name || ""} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="marca">Marca</Label>
                      <Input id="marca" name="marca" value={editingProduct.marca || ""} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Fornecedor</Label>
                      <Input id="supplier" name="supplier" value={editingProduct.supplier || ""} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="peso">Peso</Label>
                      <Input id="peso" name="peso" value={editingProduct.peso || ""} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>

                {/* Especificações */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <Weight className="w-5 h-5 text-blue-600" />Especificações
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="unitMeasure">Unidade de Medida</Label>
                      <Select
                        value={editingProduct.unitMeasure || ""}
                        onValueChange={(value) => setEditingProduct({ ...editingProduct, unitMeasure: value })}
                      >
                        <SelectTrigger><SelectValue placeholder="Selecione a unidade" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="g">Gramas</SelectItem>
                          <SelectItem value="kg">Quilos</SelectItem>
                          <SelectItem value="L">Litros</SelectItem>
                          <SelectItem value="ml">Mili-Litros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unidade</Label>
                      <Select
                        value={editingProduct.unit || ""}
                        onValueChange={(value) => setEditingProduct({ ...editingProduct, unit: value })}
                      >
                        <SelectTrigger><SelectValue placeholder="Selecione a unidade" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="un">Unidade</SelectItem>
                          <SelectItem value="fd">Fardo</SelectItem>
                          <SelectItem value="cx">Caixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Select
                        value={editingProduct.category || ""}
                        onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                      >
                        <SelectTrigger><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Proteína">Proteína</SelectItem>
                          <SelectItem value="Mantimento">Mantimento</SelectItem>
                          <SelectItem value="Hortaliças">Hortaliças</SelectItem>
                          <SelectItem value="Doações">Doações</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo</Label>
                      <Select
                        value={editingProduct.tipo || ""}
                        onValueChange={(value) => setEditingProduct({ ...editingProduct, tipo: value })}
                      >
                        <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
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
                  <Button onClick={handleUpdate} className="flex-1 bg-green-600 hover:bg-green-700 h-11">
                    <Save className="w-4 h-4 mr-2" />Atualizar Produto
                  </Button>
                  <Button onClick={closeModal} variant="outline" className="flex-1 h-11">
                    <X className="w-4 h-4 mr-2" /> Cancelar
                  </Button>
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
  