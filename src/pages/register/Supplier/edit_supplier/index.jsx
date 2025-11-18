import { useEffect, useState } from "react"
import { getDatabase, ref, get, set } from "firebase/database"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import InputMask from "react-input-mask"
import "react-toastify/dist/ReactToastify.css"
import { Input } from "@/components/ui/input/index"
import { Label } from "@/components/ui/label/index"
import { Button } from "@/components/ui/Button/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/index"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Building2, MapPin, Phone, Mail, User, CreditCard, Settings, Save, Search, Home, Hash, MessageSquare, Edit, X 
} from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"

export default function EditarFornecedor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [fornecedor, setFornecedor] = useState({
    cnpj: "", razaoSocial: "", cep: "", endereco: "", numero: "", bairro: "", municipio: "", uf: "", 
    contato: "", telefone: "", email: "", grupo: "", observacoes: "", formasPag: "", status: "Ativo",
  })

  useEffect(() => {
    if (location.state && location.state.fornecedor) {
      setFornecedor(location.state.fornecedor)
      setLoading(false)
    } else {
      const db = getDatabase()
      const fornecedorRef = ref(db, `CadastroFornecedores/${id}`)
      get(fornecedorRef).then(snapshot => {
        if (snapshot.exists()) {
          setFornecedor(snapshot.val())
        } else {
          toast.error("Fornecedor não encontrado")
          navigate("/Visualizar_Fornecedores")
        }
        setLoading(false)
      })
    }
  }, [id, location.state, navigate])

  const buscarEndereco = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "")
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        const data = await response.json()
        if (!data.erro) {
          setFornecedor(prev => ({
            ...prev,
            endereco: data.logradouro || "",
            bairro: data.bairro || "",
            municipio: data.localidade || "",
            uf: data.uf || "",
          }))
          toast.success("Endereço atualizado automaticamente!")
        } else {
          toast.error("CEP não encontrado.")
        }
      } catch {
        toast.error("Erro ao buscar CEP.")
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFornecedor(prev => ({ ...prev, [name]: value }))
    if (name === "cep") buscarEndereco(value)
  }

  const handleSelectChange = (name, value) => {
    setFornecedor(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const db = getDatabase()
    set(ref(db, `CadastroFornecedores/${id}`), fornecedor)
      .then(() => {
        toast.success("Fornecedor atualizado com sucesso!")
        navigate("/Visualizar_Fornecedores")
      })
      .catch((error) => toast.error("Erro ao atualizar fornecedor: " + error.message))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="text-2xl md:text-3xl font-bold text-center flex items-center justify-center gap-3">
                <Edit className="w-8 h-8" /> Carregando...
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Skeleton className="h-11 w-full" />
                      <Skeleton className="h-11 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="light" />
      <Dialog.Root open>
        <Dialog.Trigger asChild>
          <Button className="hidden">Abrir Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content className="max-w-5xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="text-2xl md:text-3xl font-bold text-center flex items-center justify-center gap-3">
                <Edit className="w-8 h-8" /> Editar Fornecedor
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <Dialog.Description className="sr-only">
                Atualize as informações do fornecedor corretamente.
              </Dialog.Description>
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Informações da Empresa */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <Building2 className="w-5 h-5 text-blue-600" /> Informações da Empresa
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cnpj" className="flex items-center gap-2">
                        <Hash className="w-4 h-4" /> CNPJ
                      </Label>
                      <InputMask mask="99.999.999/9999-99" value={fornecedor.cnpj} onChange={handleChange}>
                        {(inputProps) => <Input {...inputProps} name="cnpj" className="h-11" />}
                      </InputMask>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="razaoSocial" className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" /> Razão Social
                      </Label>
                      <Input type="text" name="razaoSocial" value={fornecedor.razaoSocial} onChange={handleChange} className="h-11" />
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <MapPin className="w-5 h-5 text-blue-600" /> Endereço
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cep" className="flex items-center gap-2">
                        <Search className="w-4 h-4" /> CEP
                      </Label>
                      <InputMask mask="99999-999" value={fornecedor.cep} onChange={handleChange}>
                        {(inputProps) => <Input {...inputProps} name="cep" className="h-11" />}
                      </InputMask>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="endereco" className="flex items-center gap-2">
                        <Home className="w-4 h-4" /> Endereço
                      </Label>
                      <Input type="text" name="endereco" value={fornecedor.endereco} onChange={handleChange} className="h-11" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numero">Número</Label>
                      <Input type="text" name="numero" value={fornecedor.numero} onChange={handleChange} className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bairro">Bairro</Label>
                      <Input type="text" name="bairro" value={fornecedor.bairro} onChange={handleChange} className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="municipio">Município</Label>
                      <Input type="text" name="municipio" value={fornecedor.municipio} onChange={handleChange} className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="uf">UF</Label>
                      <Input type="text" name="uf" value={fornecedor.uf} onChange={handleChange} className="h-11" />
                    </div>
                  </div>
                </div>

                {/* Contato */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <User className="w-5 h-5 text-blue-600" /> Informações de Contato
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contato" className="flex items-center gap-2"><User className="w-4 h-4" /> Nome do Contato</Label>
                      <Input type="text" name="contato" value={fornecedor.contato} onChange={handleChange} className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone" className="flex items-center gap-2"><Phone className="w-4 h-4" /> Telefone</Label>
                      <InputMask mask="(99) 99999-9999" value={fornecedor.telefone} onChange={handleChange}>
                        {(inputProps) => <Input {...inputProps} name="telefone" className="h-11" />}
                      </InputMask>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4" /> E-mail</Label>
                      <Input type="email" name="email" value={fornecedor.email} onChange={handleChange} className="h-11" />
                    </div>
                  </div>
                </div>

                {/* Informações Comerciais */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <CreditCard className="w-5 h-5 text-blue-600" /> Informações Comerciais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="formasPag" className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> Formas de Pagamento</Label>
                      <Input type="text" name="formasPag" value={fornecedor.formasPag} onChange={handleChange} className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="observacoes" className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Observações</Label>
                      <Input type="text" name="observacoes" value={fornecedor.observacoes} onChange={handleChange} className="h-11" />
                    </div>
                  </div>
                </div>

                {/* Configurações */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <Settings className="w-5 h-5 text-blue-600" /> Configurações
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="grupo">Categoria do Fornecedor</Label>
                      <Select value={fornecedor.grupo} onValueChange={(value) => handleSelectChange("grupo", value)}>
                        <SelectTrigger className="h-11"><SelectValue placeholder="Selecionar categoria" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Proteina">Proteína</SelectItem>
                          <SelectItem value="Mantimento">Mantimento</SelectItem>
                          <SelectItem value="Hortifrut">Hortifrut</SelectItem>
                          <SelectItem value="Doações">Doações</SelectItem>
                          <SelectItem value="Produtos de Limpeza">Produtos de Limpeza</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={fornecedor.status} onValueChange={(value) => handleSelectChange("status", value)}>
                        <SelectTrigger className="h-11"><SelectValue placeholder="Selecionar status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ativo">Ativo</SelectItem>
                          <SelectItem value="Inativo">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                  <Button type="submit" className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium">
                    <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                  </Button>
                  <Button type="button" onClick={() => navigate("/Visualizar_Fornecedores")} variant="outline" className="flex-1 h-12 border-gray-300 hover:bg-gray-50">
                    <X className="w-4 h-4 mr-2" /> Cancelar
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}