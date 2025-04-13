import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.firebasestorage.app",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();

  // Função para validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função de autenticação no Firebase
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      toast.error("E-mail inválido.");
      return;
    }

    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Usuário autenticado:", user);

        const userRef = ref(database, "novousuario/" + user.uid);
        get(userRef)
          .then((snapshot) => {
            console.log("Dados do usuário:", snapshot.val());
            if (snapshot.exists()) {
              toast.success("Login bem-sucedido, bem-vindo!");
              setErrorMessage("");
              navigate("/Home");
            } else {
              setErrorMessage("Usuário não encontrado no sistema, contate o suporte!");
              toast.error("Usuário não encontrado no sistema, contate o suporte!");
            }
          })
          .catch((error) => {
            console.error("Erro ao verificar seus dados de acesso:", error);
            toast.error("Erro ao verificar seus dados de acesso. Tente novamente!");
          });
      })
      .catch((error) => {
        console.error("Erro ao realizar login:", error);
        toast.error("E-mail ou senha incorretos. Tente novamente!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Função para alternar visibilidade da senha
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Função de recuperação de senha
  const handlePasswordReset = () => {
    if (!validateEmail(resetEmail)) {
      toast.error("Digite um e-mail válido!");
      return;
    }

    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        toast.success("Instruções de redefinição de senha enviadas para seu e-mail.");
        setShowResetModal(false);
      })
      .catch((error) => {
        console.error("Erro ao enviar e-mail de redefinição:", error);
        toast.error("Erro ao enviar e-mail de redefinição. Tente novamente!");
      });
  };

  return (
    <div
      style={{
        fontFamily: "'Roboto', sans-serif",
        background: "linear-gradient(135deg,rgb(117, 39, 144) 0%,rgb(24, 36, 104) 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        margin: 0,
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <ToastContainer />
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          width: "90%",
          maxWidth: "400px",
          boxSizing: "border-box",
        }}
      >
         <img
          src="/Reciclar_LOGO.png"
          alt="Logo da Reciclar"
          style={{
            width: "100px",
            margin: "0 auto 20px",
          }}
        />
        <h2
          style={{
            color: "#333333",
            marginBottom: "20px",
            fontSize: "22px",
            fontWeight: "bold",
          }}
        >
          Instituto Reciclar
        </h2>
        <form id="loginForm" onSubmit={handleSubmit}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: "10px",
              color: "#555555",
              textAlign: "left",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            E-mail:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              paddingRight: "40px",
              border: "1px solid #cccccc",
              borderRadius: "5px",
              fontSize: "14px",
              backgroundColor: "#f9f9f9",
              color: "#333333",
              boxSizing: "border-box",
            }}
          />
          <label
            htmlFor="password"
            style={{
              display: "block",
              marginTop: "20px",
              color: "#555555",
              textAlign: "left",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Senha:
          </label>
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                paddingRight: "40px",
                border: "1px solid #cccccc",
                borderRadius: "5px",
                fontSize: "14px",
                backgroundColor: "#f9f9f9",
                color: "#333333",
                boxSizing: "border-box",
              }}
            />
            <FontAwesomeIcon
              icon={isPasswordVisible ? faEyeSlash : faEye}
              onClick={togglePasswordVisibility}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#007BFF",
                fontSize: "16px",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              background:"linear-gradient(135deg,rgb(117, 39, 144) 0%,rgb(24, 36, 104) 100%)",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              marginBottom: "10px",
            }}
            onMouseOver={(e) =>
              (e.target.style.background =
                "linear-gradient(135deg,rgb(219, 59, 203) 0%,rgb(129, 23, 139) 100%)")
            }
            onMouseOut={(e) =>
              (e.target.style.background =
                "linear-gradient(135deg,rgb(155, 49, 191) 0%,rgb(230, 34, 227) 100%)")
            }
            disabled={isLoading}
          >
            {isLoading ? (
              <span
                style={{
                  border: "3px solid #f3f3f3",
                  borderTop: "3px solid #f20de7",
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
                  animation: "spin 0.6s linear infinite",
                  display: "inline-block",
                  marginRight: "5px",
                }}
              ></span>
            ) : (
              "Entrar"
            )}
          </button>
        </form>
        {errorMessage && (
          <p
            id="errorMessage"
            style={{ color: "red", marginTop: "15px", fontSize: "14px" }}
          >
            {errorMessage}
          </p>
        )}
        <button
          onClick={() => setShowResetModal(true)}
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "5px",
            color: "gray",
            textDecoration: "underline",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          Esqueceu a senha?
        </button>

        {/* Modal para recuperação de senha */}
        {showResetModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                textAlign: "center",
                maxWidth: "400px",
                width: "90%",
              }}
            >
              <h3>Recuperação de Senha</h3>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "10px",
                  border: "1px solid #cccccc",
                  borderRadius: "5px",
                }}
              />
              <button
                onClick={handlePasswordReset}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#F20DE7",
                  border: "none",
                  borderRadius: "5px",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Enviar
              </button>
              <button
                onClick={() => setShowResetModal(false)}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#ccc",
                  border: "none",
                  borderRadius: "5px",
                  color: "black",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


