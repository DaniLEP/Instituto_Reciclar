import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import { signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { ref, get, update } from "firebase/database"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Input } from "@/components/ui/input/index"
import { Button } from "@/components/ui/Button/button" 
import { Label } from "@/components/ui/label/index"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/index"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog/dialog"
import { auth, db } from "../../../../firebase"

const UserType = { ADMIN: "Admin", COZINHA: "Cozinha", TI: "T.I" }

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [resetEmail, setResetEmail] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const navigate = useNavigate()

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validateEmail(email)) { toast.error("E-mail inválido."); return; }

    setIsLoading(true)
    setErrorMessage("")

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      const userRef = ref(db, "usuarios/" + user.uid)
      const snapshot = await get(userRef)

      if (snapshot.exists()) {
        const userData = snapshot.val()
        const funcao = userData.funcao

        // Atualiza o último acesso
        await update(userRef, {
          ultimoAcesso: new Date().toISOString(),
        })

        if (!funcao || !Object.values(UserType).includes(funcao)) {
          toast.error("Função de usuário inválida."); return;
        }

        navigate("/Home")
        toast.success("Login bem-sucedido, bem-vindo!")
      } else {
        setErrorMessage("Usuário não encontrado no sistema.")
        toast.error("Usuário não encontrado no sistema.")
      }
    } catch (error) {
      console.error("Erro ao logar:", error.code, error.message)
      if (error.code === "auth/user-not-found") toast.error("Usuário não encontrado.")
      else if (error.code === "auth/wrong-password") toast.error("Senha incorreta.")
      else if (error.code === "auth/invalid-credential") toast.error("Credenciais inválidas.")
      else toast.error("Erro ao fazer login.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!validateEmail(resetEmail)) {
      toast.error("Digite um e-mail válido!"); return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail)
      toast.success("Instruções enviadas para seu e-mail.")
      setShowResetModal(false)
    } catch (error) {
      toast.error("Erro ao enviar e-mail de redefinição.")
    }
  }

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible)

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const email = user.email

      if (!email.endsWith("@reciclar.org.br")) {
        toast.error("Apenas contas @reciclar.org.br são permitidas."); return;
      }

      const userRef = ref(db, "usuarios/" + user.uid)
      const snapshot = await get(userRef)

      if (snapshot.exists()) {
        const userData = snapshot.val()
        const funcao = userData.funcao

        // Atualiza o último acesso
        await update(userRef, {
          ultimoAcesso: new Date().toISOString(),
        })

        if (!funcao || !Object.values(UserType).includes(funcao)) {
          toast.error("Função de usuário inválida."); return;
        }

        navigate("/Home")
        toast.success("Login com Google bem-sucedido!")
      } else {
        toast.error("Usuário não encontrado no sistema.")
      }
    } catch (error) {
      console.error("Erro ao entrar com Google:", error)
      toast.error("Erro ao entrar com Google.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-white/95 shadow-2xl border-0">
        <CardHeader className="space-y-6 text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
            <img src="/Reciclar_30anos_Blocado_Positivo.png" alt="Logo" className="w-12 h-12 object-contain filter brightness-0 invert" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Instituto Reciclar</CardTitle>
            <CardDescription className="text-gray-600 mt-2">Acesse sua conta para continuar</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors" placeholder="seu@email.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input id="password" type={isPasswordVisible ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors" placeholder="Digite sua senha" />
                <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errorMessage}</p>
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-70">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Acessar Plataforma
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">ou continue com</span>
            </div>
          </div>

          <Button onClick={handleGoogleLogin} variant="outline" className="w-full h-12 border-gray-200 hover:bg-gray-50 transition-colors bg-white text-gray-700">
            <div className="flex items-center justify-center">
              <img src="../iconGoogle.png" alt="Google" className="w-5 h-5 mr-3" />
              Entrar com Google
            </div>
          </Button>

          <div className="text-center">
            <button onClick={() => setShowResetModal(true)} className="text-sm text-purple-600 hover:text-purple-700 underline transition-colors">
              Esqueceu a senha?
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Password Reset Modal */}
      <Dialog open={showResetModal} onOpenChange={setShowResetModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5 text-purple-600" />
              Recuperação de Senha
            </DialogTitle>
            <DialogDescription>
              Digite seu e-mail para receber as instruções de recuperação de senha.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">E-mail</Label>
              <Input id="reset-email" type="email" placeholder="Digite seu e-mail" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="h-10" />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
            <Button variant="outline" onClick={() => setShowResetModal(false)} className="bg-white text-gray-700">Cancelar</Button>
            <Button onClick={handlePasswordReset} className="bg-purple-600 hover:bg-purple-700 text-white">Enviar Instruções</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
