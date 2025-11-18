"use client"

import { useState, useEffect } from "react"
import { db } from "../../../../firebase"
import { ref, set, get } from "firebase/database"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from "react-router-dom"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

import { Package, ArrowLeft, Save } from "lucide-react"

export default function CadProdutos() {
  const [sku, setSku] = useState("")
  const [name, setName] = useState("")
  const [peso, setPeso] = useState("")
  const [unitMeasure, setUnitMeasure] = useState("Selecionar")
  const [unit, setUnit] = useState("Selecionar")
  const [category, setCategory] = useState("")
  const [tipo, setTipo] = useState("Selecionar Tipo")
  const [saveLoading, setSaveLoading] = useState(false)
  const [allProducts, setAllProducts] = useState({})
  const navigate = useNavigate()

  const categoryPrefix = {
    Mantimento: "C",
    Proteina: "P",
    Hortifrut: "H",
    Doacoes: "D",
    ProdutosLimpeza: "L",
  }

  const fetchAllProducts = async () => {
    try {
      const produtosRef = ref(db, "EntradaProdutos")
      const snapshot = await get(produtosRef)
      if (snapshot.exists()) {
        setAllProducts(snapshot.val())
      } else {
        setAllProducts({})
      }
    } catch (err) {
      toast.error("Erro ao buscar produtos do Firebase")
      console.error(err)
    }
  }

  useEffect(() => { fetchAllProducts() }, [])

  const getNextSku = (cat) => {
    if (!cat || !allProducts) return ""
    const prefix = categoryPrefix[cat] || "X"
    const produtosArray = Object.values(allProducts).filter(p => p.sku?.startsWith(prefix))
    if (produtosArray.length === 0) return prefix + "00001"
    const lastNumber = produtosArray.map(p => parseInt(p.sku.substring(1), 10)).sort((a,b)=>b-a)[0]
    const nextNumber = lastNumber + 1
    return prefix + nextNumber.toString().padStart(5, "0")
  }

  useEffect(() => {
    if (category && allProducts) {
      setSku(getNextSku(category))
    }
  }, [category, allProducts])

  const isSkuDuplicate = (skuToCheck) => Object.values(allProducts).some(p => p.sku === skuToCheck)

  const handleSave = async () => {
    if (!sku || !name || !peso || unitMeasure === "Selecionar" || unit === "Selecionar" || !category) {
      toast.error("Preencha todos os campos obrigatórios!")
      return
    }
    if (isSkuDuplicate(sku)) {
      toast.error(`O SKU ${sku} já existe!`)
      return
    }
    setSaveLoading(true)
    const newProduct = { sku, name, peso, unitMeasure, unit, category, tipo }
    const newProductRef = ref(db, "EntradaProdutos/" + sku)
    try {
      await set(newProductRef, newProduct)
      toast.success("Produto salvo com sucesso!")
      handleClearFields()
      await fetchAllProducts()
    } catch (err) {
      toast.error("Erro ao salvar o produto: " + err.message)
    } finally {
      setSaveLoading(false)
    }
  }

  const handleClearFields = () => {
    setName(""); setPeso(""); setUnitMeasure("Selecionar")
    setUnit("Selecionar"); setCategory(""); setTipo("Selecionar Tipo"); setSku("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl md:text-3xl font-bold text-center flex items-center justify-center gap-3">
              <Package className="w-8 h-8"/> Cadastro de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecionar categoria"/>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(categoryPrefix).map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>SKU *</Label>
                <Input value={sku} onChange={e=>setSku(e.target.value)} className="h-11"/>
              </div>
              <div className="space-y-2">
                <Label>Nome do Produto *</Label>
                <Input value={name} onChange={e=>setName(e.target.value)} className="h-11"/>
              </div>
              <div className="space-y-2">
                <Label>Peso *</Label>
                <Input value={peso} onChange={e=>setPeso(e.target.value)} required className="h-11"/>
              </div>
              <div className="space-y-2">
                <Label>Unidade de Peso *</Label>
                <Select value={unitMeasure} onValueChange={setUnitMeasure}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Selecione o peso"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="und">und</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Unidade de Medida *</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Selecionar unidade"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="und">Unidade</SelectItem>
                    <SelectItem value="fd">Fardo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Selecione o tipo"/></SelectTrigger>
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
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Button onClick={handleSave} disabled={saveLoading} className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white">
                {saveLoading ? "Salvando..." : <><Save className="w-4 h-4 mr-2"/> Salvar Produto</>}
              </Button>
              <Button onClick={()=>navigate(-1)} variant="outline" className="flex-1 h-12 border-gray-300 hover:bg-gray-50">
                <ArrowLeft className="w-4 h-4 mr-2"/> Voltar
              </Button>
            </div>
          </CardContent>
        </Card>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false}/>
      </div>
    </div>
  )
}