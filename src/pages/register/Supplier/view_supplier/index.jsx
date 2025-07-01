import { useEffect, useState } from "react"
import { getDatabase, ref, onValue, off } from "firebase/database"
import { initializeApp, getApps } from "firebase/app"
import { toast, ToastContainer } from "react-toastify"
import { useNavigate } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"
import { Input } from "@/components/ui/input/index"
import { Button } from "@/components/ui/Button/button" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, Search, ArrowLeft, Edit, Phone, Mail, Hash, Users, Filter, FileText } from "lucide-react"

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

if (!getApps().length) {initializeApp(firebaseConfig)}
const app = getApps()[0]
const db = getDatabase(app)
const formatCNPJ = (cnpj) => { if (!cnpj) return "Não informado"; return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}
const formatTelefone = (telefone) => {if (!telefone) return "Não informado"; return telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")}
const formatCEP = (cep) => {if (!cep) return "Não informado"; return cep.replace(/(\d{5})(\d{3})/, "$1-$2")}

export default function ListaFornecedores() {
  const [fornecedores, setFornecedores] = useState([])
  const [filtro, setFiltro] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fornecedoresRef = ref(db, "CadastroFornecedores")
    const listener = onValue(fornecedoresRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {const fornecedoresArray = Object.entries(data).map(([key, val]) => ({id: key, ...val,})); setFornecedores(fornecedoresArray)} 
      else {setFornecedores([])}; setLoading(false)})
    // Cleanup para remover listener quando componente desmontar
    return () => off(fornecedoresRef, "value", listener);}, [])

  const fornecedoresFiltrados = fornecedores.filter((fornecedor) => {
    const razaoSocial = fornecedor?.razaoSocial?.toLowerCase() || ""
    const cnpj = fornecedor?.cnpj || ""
    const grupo = fornecedor?.grupo?.toLowerCase() || ""
    const filtroLower = filtro.toLowerCase()
    return razaoSocial.includes(filtroLower) || cnpj.includes(filtro) || grupo.includes(filtroLower); })

  const handleEdit = (fornecedor) => {
    if (!fornecedor.id) {toast.error("Erro ao editar: ID do fornecedor não encontrado."); console.error("Fornecedor sem ID:", fornecedor); return;}
    navigate(`/editar-fornecedor/${fornecedor.id}`)
  }

  const handleGoBack = () => {navigate("/Cadastro")};
  const getStatusColor = (status) => {return status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}

  const getCategoriaColor = (categoria) => {
    const colors = {
      Proteina: "bg-red-100 text-red-800",
      Mantimento: "bg-yellow-100 text-yellow-800",
      Hortifrut: "bg-green-100 text-green-800",
      Doações: "bg-blue-100 text-blue-800",
      "Produtos de Limpeza": "bg-purple-100 text-purple-800",
    }
    return colors[categoria] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        {/* Header */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg"><CardTitle className="text-2xl md:text-3xl font-bold text-center flex items-center justify-center gap-3"><Building2 className="w-8 h-8" />Lista de Fornecedores</CardTitle></CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Button onClick={handleGoBack} variant="outline" className="w-full md:w-auto h-11 border-gray-300 hover:bg-gray-50"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input type="text" placeholder="Buscar por Razão Social, CNPJ ou Categoria..." value={filtro} onChange={(e) => setFiltro(e.target.value)} className="pl-10 h-11"/>
              </div>
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
                <div className="flex items-center gap-2"><Users className="w-5 h-5 text-gray-600" /><span className="font-semibold text-gray-800">{fornecedoresFiltrados.length} fornecedor(es) encontrado(s)</span></div>
                {filtro && (<Badge variant="outline" className="flex items-center gap-1"><Filter className="w-3 h-3" />Filtro ativo</Badge>)}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700"><div className="flex items-center gap-2"><Hash className="w-4 h-4" />CNPJ</div></TableHead>
                      <TableHead className="font-semibold text-gray-700"><div className="flex items-center gap-2"><Building2 className="w-4 h-4" />Razão Social</div></TableHead>
                      <TableHead className="font-semibold text-gray-700"><div className="flex items-center gap-2"><Phone className="w-4 h-4" />Telefone</div></TableHead>
                      <TableHead className="font-semibold text-gray-700"><div className="flex items-center gap-2"><Mail className="w-4 h-4" />E-mail</div></TableHead>
                      <TableHead className="font-semibold text-gray-700">Categoria</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fornecedoresFiltrados.length > 0 ? (
                      fornecedoresFiltrados.map((fornecedor) => (
                        <TableRow key={fornecedor.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-mono text-sm font-medium">{formatCNPJ(fornecedor.cnpj)}</TableCell>
                          <TableCell className="font-medium">{fornecedor.razaoSocial || "Não informado"}</TableCell>
                          <TableCell><div className="flex items-center gap-2"><Phone className="w-3 h-3 text-gray-400" />{formatTelefone(fornecedor.telefone)}</div></TableCell>
                          <TableCell><div className="flex items-center gap-2"><Mail className="w-3 h-3 text-gray-400" /><span className="truncate max-w-[200px]">{fornecedor.email || "Não informado"}</span></div></TableCell>
                          <TableCell><Badge className={getCategoriaColor(fornecedor.grupo)} variant="secondary">{fornecedor.grupo || "Não informado"}</Badge></TableCell>
                          <TableCell><Badge className={getStatusColor(fornecedor.status)} variant="secondary">{fornecedor.status || "Indefinido"}</Badge></TableCell>
                          <TableCell className="text-center"><Button onClick={() => handleEdit(fornecedor)} size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white"><Edit className="w-4 h-4 mr-1" />Editar</Button></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center gap-3 text-gray-500">
                            <FileText className="w-12 h-12 text-gray-300" />
                            <div>
                              <p className="text-lg font-medium">Nenhum fornecedor encontrado</p>
                              <p className="text-sm">{filtro ? "Tente ajustar os filtros de busca" : "Cadastre o primeiro fornecedor para começar"}</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}