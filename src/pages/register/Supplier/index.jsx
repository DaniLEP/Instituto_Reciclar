import { useState } from "react"
import { getDatabase, ref, push } from "firebase/database"
import { initializeApp, getApps } from "firebase/app"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input/index"
import { Button } from "@/components/ui/Button/button" 
import { Label } from "@/components/ui/label/index"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/index"
import { Building2, MapPin, Phone, Mail, User, CreditCard, Settings, ArrowLeft, Save, Search,Home, Hash, MessageSquare } from "lucide-react"

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

if (!getApps().length) { initializeApp(firebaseConfig)}
const db = getDatabase()
export default function CadastroFornecedores() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({cnpj: "", formasPag: "", observacoes: "", razaoSocial: "", endereco: "", numero: "", bairro: "", cep: "", municipio: "", uf: "", pais: "Brasil", complemento: "", contato: "", telefone: "", email: "", grupo: "Mantimentos", status: "Ativo",})
  const handleInputChange = (e) => {
    const { name, value } = e.target
    // Valida o CEP para garantir que é um número com 8 dígitos
    if (name === "cep" && /^[0-9]{0,8}$/.test(value)) {setFormData((prevData) => ({...prevData,[name]: value,}))
      // Se o CEP tiver 8 dígitos, tenta buscar o endereço
    if (value.length === 8) {fetchAddress(value)}} 
    else if (name !== "cep") {setFormData((prevData) => ({...prevData, [name]: value,}))}
  }


const fetchCNPJData = async (cnpj) => {
  const sanitizedCNPJ = cnpj.replace(/[^\d]/g, "")
  if (sanitizedCNPJ.length !== 14) return

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${sanitizedCNPJ}`)
    if (!response.ok) {
      toast.error("CNPJ não encontrado ou inválido.", { theme: "colored" }); return;}
    const data = await response.json()
    setFormData((prev) => ({...prev, razaoSocial: data.razao_social || "",
      endereco: data.descricao_tipo_de_logradouro + " " + data.logradouro || "", numero: data.numero || "", bairro: data.bairro || "", municipio: data.municipio || "", uf: data.uf || "", cep: data.cep?.replace(/\D/g, "") || "",}))
    toast.success("Dados preenchidos automaticamente!", { theme: "colored" })
  } 
  catch (error) {toast.error("Erro ao consultar CNPJ.", { theme: "colored" })}
}


  const fetchAddress = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()
      if (data.erro) {toast.error("CEP não encontrado.", {position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored", })
        return;
      }
      setFormData((prevData) => ({...prevData, endereco: data.logradouro || "", bairro: data.bairro || "", municipio: data.localidade || "", uf: data.uf || "",}))
      toast.success("Endereço preenchido automaticamente!", {position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored"})
    } catch (error) {toast.error("Erro ao buscar o CEP.", {position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored", })}
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Dados enviados:", formData)
    const fornecedoresRef = ref(db, "CadastroFornecedores")
    push(fornecedoresRef, formData)
      .then(() => {
        toast.success("Fornecedor cadastrado com sucesso!", {position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored",})
        // Limpa os campos
        setFormData({cnpj: "", razaoSocial: "", endereco: "", numero: "", bairro: "", cep: "", municipio: "", uf: "", pais: "Brasil", complemento: "", contato: "", telefone: "", email: "", observacoes: "", formasPag: "", grupo: "Mantimentos", status: "Ativo",})})
      .catch((error) => {toast.error("Erro ao cadastrar fornecedor: " + error.message, {position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored",})})
  }

  const handleBack = () => {navigate(-1)}
  const handleStatusChange = (value) => {setFormData({ ...formData, status: value })}
  const handleGrupoChange = (value) => {setFormData({ ...formData, grupo: value })}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <ToastContainer position="top-right"autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl md:text-3xl font-bold text-center flex items-center justify-center gap-3"><Building2 className="w-8 h-8" />Cadastro de Fornecedores</CardTitle>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informações da Empresa */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2"><Building2 className="w-5 h-5 text-blue-600" />Informações da Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cnpj" className="text-sm font-medium text-gray-700 flex items-center gap-2"><Hash className="w-4 h-4" />CNPJ *</Label>
                    <Input className="h-11" required type="text" id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleInputChange} onBlur={() => fetchCNPJData(formData.cnpj)} placeholder="00.000.000/0000-00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="razaoSocial" className="text-sm font-medium text-gray-700 flex items-center gap-2"><Building2 className="w-4 h-4" /> Razão Social * </Label>
                    <Input required type="text" id="razaoSocial" name="razaoSocial" value={formData.razaoSocial} onChange={handleInputChange} placeholder="Nome da empresa" className="h-11" />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2"><MapPin className="w-5 h-5 text-blue-600" />Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cep" className="text-sm font-medium text-gray-700 flex items-center gap-2"> <Search className="w-4 h-4" /> CEP </Label>
                    <div className="relative">
                      <Input type="text" id="cep" name="cep" value={formData.cep} onChange={handleInputChange} placeholder="00000-000" className="h-11" maxLength={8} />
                      {formData.cep.length === 8 && (<Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />)}
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="endereco" className="text-sm font-medium text-gray-700 flex items-center gap-2"><Home className="w-4 h-4" /> Endereço * </Label>
                    <Input required type="text" id="endereco" name="endereco" value={formData.endereco} onChange={handleInputChange} disabled placeholder="Endereço será preenchido automaticamente" className="h-11 bg-gray-50" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numero" className="text-sm font-medium text-gray-700"> Número * </Label>
                    <Input required type="text" id="numero" name="numero" value={formData.numero} onChange={handleInputChange}  placeholder="123" className="h-11" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bairro" className="text-sm font-medium text-gray-700"> Bairro * </Label>
                    <Input required type="text" id="bairro" name="bairro" value={formData.bairro} onChange={handleInputChange} disabled placeholder="Bairro" className="h-11 bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="municipio" className="text-sm font-medium text-gray-700">Município * </Label>
                    <Input required type="text" id="municipio" name="municipio" value={formData.municipio} onChange={handleInputChange} disabled placeholder="Cidade" className="h-11 bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uf" className="text-sm font-medium text-gray-700">UF * </Label>
                    <Input required type="text" id="uf" name="uf" value={formData.uf} onChange={handleInputChange} disabled placeholder="SP" className="h-11 bg-gray-50" maxLength={2} />
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2"> <User className="w-5 h-5 text-blue-600" />Informações de Contato </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contato" className="text-sm font-medium text-gray-700 flex items-center gap-2"><User className="w-4 h-4" /> Nome do Contato * </Label>
                    <Input required type="text" id="contato" name="contato" value={formData.contato} onChange={handleInputChange} placeholder="Nome do responsável" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-sm font-medium text-gray-700 flex items-center gap-2"><Phone className="w-4 h-4" />Telefone * </Label>
                    <Input required type="text" id="telefone" name="telefone" value={formData.telefone} onChange={handleInputChange} placeholder="(11) 99999-9999"className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2"><Mail className="w-4 h-4" />E-mail *</Label>
                    <Input required type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="contato@empresa.com" className="h-11" />
                  </div>
                </div>
              </div>

              {/* Informações Comerciais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2"><CreditCard className="w-5 h-5 text-blue-600" />Informações Comerciais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="formasPag" className="text-sm font-medium text-gray-700 flex items-center gap-2"><CreditCard className="w-4 h-4" />Formas de Pagamento</Label>
                    <Input type="text" id="formasPag" name="formasPag" value={formData.formasPag} onChange={handleInputChange} placeholder="Ex: À vista, 30/60 dias, cartão" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="observacoes" className="text-sm font-medium text-gray-700 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Observações </Label>
                    <Input type="text" id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleInputChange} placeholder="Observações gerais" className="h-11" />
                  </div>
                </div>
              </div>

              {/* Configurações */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2"><Settings className="w-5 h-5 text-blue-600" />Configurações</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="grupo" className="text-sm font-medium text-gray-700">Categoria do Fornecedor</Label>
                    <Select value={formData.grupo} onValueChange={handleGrupoChange}>
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
                    <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
                    <Select value={formData.status} onValueChange={handleStatusChange}>
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
                <Button type="submit" className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"><Save className="w-4 h-4 mr-2" />Cadastrar Fornecedor</Button>
                <Button type="button" onClick={handleBack} variant="outline" className="flex-1 h-12 border-gray-300 hover:bg-gray-50"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Código antigo para upload de planilha Excel
// import React from "react";
// import * as XLSX from "xlsx";
// import { getDatabase, ref, push } from "firebase/database";
// import { toast } from "react-toastify";

// function UploadPlanilha() {
//   const db = getDatabase();

//   // Função para normalizar cabeçalhos da planilha
//   const normalizeKey = (key) =>
//     key
//       .toLowerCase()
//       .normalize("NFD")
//       .replace(/[\u0300-\u036f]/g, "") // remove acentos
//       .replace(/\s+/g, ""); // remove espaços

//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();

//     reader.onload = async (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: "array" });

//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
//       const jsonData = XLSX.utils.sheet_to_json(sheet);

//       if (!jsonData.length) {
//         toast.error("A planilha está vazia ou mal formatada.");
//         return;
//       }

//       try {
//         const fornecedoresRef = ref(db, "CadastroFornecedores");

//         for (const rawItem of jsonData) {
//           // Normaliza as chaves da planilha (ex: "Razão Social" → "razaosocial")
//           const item = {};
//           for (const key in rawItem) {
//             item[normalizeKey(key)] = rawItem[key];
//           }

//           // Criação do objeto final para salvar
//           const fornecedor = {
//             cnpj: String(item.cnpj || "").padStart(14, "0"),
//             razaosocial: String(item.razaosocial || ""),
//             endereco: String(item.endereco || ""),
//             numero: String(item.numero || ""),
//             bairro: String(item.bairro || ""),
//             cep: String(item.cep || "").padStart(8, "0"),
//             municipio: String(item.municipio || ""),
//             uf: String(item.uf || ""),
//             pais: String(item.pais || "Brasil"),
//             complemento: String(item.complemento || ""),
//             contato: String(item.contato || ""),
//             telefone: String(item.telefone || ""),
//             email: String(item.email || ""),
//             observacoes: String(item.observacoes || ""),
//             formaspag: String(item.formaspag || ""),
//             grupo: String(item.grupo || "Mantimentos"),
//             status: String(item.status || "Ativo"),
//           };

//           await push(fornecedoresRef, fornecedor);
//         }

//         toast.success("Planilha importada com sucesso!");
//       } catch (error) {
//         console.error("Erro ao importar:", error);
//         toast.error("Erro ao importar a planilha.");
//       }
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   return (
//     <div className="mb-8 w-full max-w-4xl bg-white p-4 rounded-lg shadow-md">
//       <label className="block font-medium mb-2 text-gray-700">
//         Importar Fornecedores (Excel):
//       </label>
//       <input
//         type="file"
//         accept=".xlsx, .xls, .csv"
//         onChange={handleFileUpload}
//         className="block w-full text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
//       />
//       <p className="mt-2 text-xs text-gray-500">
//         A primeira aba da planilha será usada. Os nomes das colunas devem ser consistentes.
//       </p>
//     </div>
//   );
// }

// export default UploadPlanilha;
