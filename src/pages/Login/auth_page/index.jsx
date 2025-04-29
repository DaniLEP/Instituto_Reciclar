import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button/button";
import { Label } from "@/components/ui/label";
import { auth, db } from "../../../../firebase"; // Importando as instâncias

const UserType = {
  ADMIN: "admin",
  COZINHA: "cozinha",
  TI: "ti",
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      toast.error("E-mail inválido.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = ref(db, "usuarios/" + user.uid); // Use db aqui, não database
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        const funcao = userData.funcao;

        if (!funcao || !Object.values(UserType).includes(funcao)) {
          toast.error("Função de usuário inválida.");
          return;
        }

        // Redirecionamento conforme função
        if (funcao === UserType.ADMIN) {
          navigate("/Home");
        } else if (funcao === UserType.COZINHA) {
          navigate("/Home");
        } else if (funcao === UserType.TI) {
          navigate("/Home");
        } else {
          navigate("/Home");
        }
        
        toast.success("Login bem-sucedido, bem-vindo!");
      } else {
        setErrorMessage("Usuário não encontrado no sistema.");
        toast.error("Usuário não encontrado no sistema.");
      }
    } catch (error) {
      console.error("Erro ao logar:", error.code, error.message);
      if (error.code === "auth/user-not-found") {
        toast.error("Usuário não encontrado.");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Senha incorreta.");
      } else if (error.code === "auth/invalid-credential") {
        toast.error("Credenciais inválidas. Verifique e-mail e senha.");
      } else {
        toast.error("Erro ao fazer login.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const handlePasswordReset = async () => {
    if (!validateEmail(resetEmail)) {
      toast.error("Digite um e-mail válido!");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success("Instruções enviadas para seu e-mail.");
      setShowResetModal(false);
    } catch (error) {
      toast.error("Erro ao enviar e-mail de redefinição.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 to-blue-900 p-5">
      <ToastContainer />
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-sm text-center">
        <img src="/Reciclar_LOGO.png" alt="Logo" className="w-24 mx-auto mb-6" />
        <h2 className="text-xl font-bold text-gray-800 mb-6">Instituto Reciclar</h2>
        <form onSubmit={handleSubmit} className="text-left">
          <Label htmlFor="email">E-mail:</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded border border-gray-300 mb-4 bg-gray-50"
          />

          <Label htmlFor="password">Senha:</Label>
          <div className="relative mb-6">
            <Input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 pr-10 rounded border border-gray-300 bg-gray-50"
            />
            <FontAwesomeIcon
              icon={isPasswordVisible ? faEyeSlash : faEye}
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 cursor-pointer"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-gradient-to-br from-purple-700 to-blue-800 text-white font-semibold hover:from-pink-500 hover:to-purple-700 transition duration-300 mb-3"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-purple-500 rounded-full animate-spin mr-2"></span>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

        <button
          onClick={() => setShowResetModal(true)}
          className="w-full mt-4 text-gray-500 underline text-sm"
        >
          Esqueceu a senha?
        </button>

        {showResetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center">
              <h3 className="text-lg font-bold mb-4">Recuperação de Senha</h3>
              <Input
                type="email"
                placeholder="Digite seu e-mail"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full p-3 mb-3 rounded border border-gray-300"
              />
              <Button
                onClick={handlePasswordReset}
                className="w-full py-3 bg-pink-600 text-white font-bold rounded mb-3"
              >
                Enviar
              </Button>
              <Button
                onClick={() => setShowResetModal(false)}
                className="w-full py-3 bg-gray-300 text-black font-bold rounded"
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
