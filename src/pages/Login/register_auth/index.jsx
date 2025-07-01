import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Upload, User, Mail, Lock, Shield, Camera, ArrowLeft, UserPlus } from "lucide-react"
import { auth, createUserWithEmailAndPassword, dbRealtime } from "../../../../firebase"
import { ref, set } from "firebase/database"
import { Input } from "@/components/ui/input/index"
import { Button } from "@/components/ui/Button/button" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/index"
import { Label } from "@/components/ui/label/index"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Registro() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [funcao, setFuncao] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmSenha, setConfirmSenha] = useState("")
  const [fotoPerfilBase64, setFotoPerfilBase64] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePassword = (senha) => senha.length >= 6

  const handleImagemPerfil = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {setFotoPerfilBase64(reader.result);}
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if (!validateEmail(email)) return setErrorMessage("E-mail inválido.");
    if (!validatePassword(senha)) return setErrorMessage("A senha deve ter pelo menos 6 caracteres.");
    if (senha !== confirmSenha) return setErrorMessage("As senhas não coincidem.");
    if (!funcao) return setErrorMessage("Selecione uma função.");

    setIsLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha)
      const newUser = userCredential.user
      const tipoUsuario = funcao === "Admin" ? "Admin" : funcao === "Cozinha" ? "Cozinha" : "T.I"
      await set(ref(dbRealtime, "usuarios/" + newUser.uid), {nome, email, funcao: tipoUsuario, uid: newUser.uid, status: "offline", fotoPerfil: fotoPerfilBase64 || null,})
      setSuccessMessage("Usuário criado com sucesso!")
      setTimeout(() => navigate("/Verificacao_Usuario"), 2000)
    } catch (error) {
      console.error("Erro ao criar usuário:", error)
      if (error.code === "auth/email-already-in-use") {setErrorMessage("Este e-mail já está em uso.")} 
      else {setErrorMessage(`Erro: ${error.message}`)}
    } finally { setIsLoading(false)}
  }

  const getFuncaoIcon = (funcao) => {
    switch (funcao) {
      case "Admin": return <Shield className="w-4 h-4" />
      case "Cozinha": return <User className="w-4 h-4" />
      case "Nutri": return <User className="w-4 h-4" />
      case "T.I": return <User className="w-4 h-4" />
      default: return <User className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">Registro de Novo Usuário</CardTitle>
            <p className="text-gray-600 mt-2">Preencha os dados abaixo para criar uma nova conta</p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={fotoPerfilBase64 || "/placeholder.svg"} alt="Preview" />
                    <AvatarFallback className="bg-primary/10"><Camera className="w-8 h-8 text-primary" /></AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2">
                    <Label htmlFor="foto-perfil" className="cursor-pointer">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                        <Upload className="w-4 h-4 text-white" />
                      </div>
                    </Label>
                    <input id="foto-perfil" type="file" accept="image/*" onChange={handleImagemPerfil} className="hidden" />
                  </div>
                </div>
                <p className="text-sm text-gray-500">Clique no ícone para adicionar uma foto</p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="nome" className="flex items-center gap-2"><User className="w-4 h-4" />Nome Completo</Label>
                  <Input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Digite o nome completo" className="h-12" />
                </div>
                {/* E-mail */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4" /> E-mail </Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Digite o e-mail" className="h-12"  />
                </div>
                {/* Função */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">{getFuncaoIcon(funcao)}Função</Label>
                  <Select value={funcao} onValueChange={setFuncao} required>
                    <SelectTrigger className="h-12"><SelectValue placeholder="Selecione a função" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin"><div className="flex items-center gap-2"><Shield className="w-4 h-4" />Administrador</div></SelectItem>
                      <SelectItem value="Cozinha"><div className="flex items-center gap-2"><User className="w-4 h-4" />Cozinha</div></SelectItem>
                      <SelectItem value="Nutri"><div className="flex items-center gap-2"><User className="w-4 h-4" />Nutricionista</div></SelectItem>
                      <SelectItem value="T.I"><div className="flex items-center gap-2"><User className="w-4 h-4" />T.I</div></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Senha */}
                <div className="space-y-2">
                  <Label htmlFor="senha" className="flex items-center gap-2"><Lock className="w-4 h-4" />Senha</Label>
                  <div className="relative">
                    <Input id="senha" type={isPasswordVisible ? "text" : "password"} value={senha} onChange={(e) => setSenha(e.target.value)}
                      required placeholder="Digite uma senha" className="h-12 pr-12" />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                      {isPasswordVisible ? (<EyeOff className="w-4 h-4 text-gray-500" />) : (<Eye className="w-4 h-4 text-gray-500" />)}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Mínimo de 6 caracteres</p>
                </div>
                {/* Confirmar Senha */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-senha" className="flex items-center gap-2"><Lock className="w-4 h-4" />Confirmar Senha</Label>
                  <Input id="confirm-senha" type={isPasswordVisible ? "text" : "password"} value={confirmSenha} onChange={(e) => setConfirmSenha(e.target.value)} required placeholder="Confirme a senha" className="h-12" />
                </div>
              </div>

              {/* Messages */}
              {errorMessage && (<Alert variant="destructive"><AlertDescription>{errorMessage}</AlertDescription></Alert>)}
              {successMessage && (<Alert className="border-green-200 bg-green-50"><AlertDescription className="text-green-800">{successMessage}</AlertDescription></Alert>)}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button type="submit" disabled={isLoading} className="flex-1 h-12 text-base font-medium">
                  {isLoading ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Criando conta...</>) : (<><UserPlus className="w-4 h-4 mr-2" />Criar Conta</>)}
                </Button>

                <Link to="/Verificacao_Usuario" className="flex-1">
                <Button type="button" variant="outline" className="w-full h-12 text-base font-medium" disabled={isLoading}><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
