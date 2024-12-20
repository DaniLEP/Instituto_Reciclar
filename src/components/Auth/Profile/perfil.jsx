import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { initializeApp } from "firebase/app";

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


export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const dbRef = ref(database, "novousuario/" + user.uid);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          setUsuario(snapshot.val());
        }
      } else {
        navigate("/"); // Redireciona para login se não houver usuário autenticado
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redireciona para a página de login após o logout
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (!usuario) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontFamily: "'Roboto', sans-serif",
          fontSize: "18px",
          color: "#333",
        }}
      >
        Carregando...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #4c6ef5, #15aabf)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Roboto', sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
          width: "100%",
          maxWidth: "400px",
          padding: "30px",
          textAlign: "center",
          transition: "transform 0.3s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <img
          src="/Reciclar_LOGO.png"
          alt="Logo da Reciclar"
          style={{
            width: "200px",
            margin: "0 auto 20px",
          }}
        />
        <h1
          style={{
            fontSize: "24px",
            color: "#2c3e50",
            marginBottom: "10px",
            fontWeight: "600",
          }}
        >
          Olá, {usuario.nome}!
        </h1>
        <p style={{ color: "#666", fontSize: "16px", marginBottom: "20px" }}>
          Confira seus dados abaixo:
        </p>
        <div
          style={{
            textAlign: "left",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p>
            <strong>Email:</strong> {usuario.email}
          </p>
          <p>
            <strong>Função:</strong> {usuario.funcao}
          </p>
        </div>

        <Link to="/Home">
          <button
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              background:
                "linear-gradient(135deg, #4c6ef5 0%, #228be6 100%)",
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
                "linear-gradient(135deg, #3b5bdb 0%, #1971c2 100%)")
            }
            onMouseOut={(e) =>
              (e.target.style.background =
                "linear-gradient(135deg, #4c6ef5 0%, #228be6 100%)")
            }
          >
            Voltar
          </button>
        </Link>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #f03e3e, #e03131)",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.target.style.background =
              "linear-gradient(135deg, #c92a2a, #a51111)")
          }
          onMouseOut={(e) =>
            (e.target.style.background =
              "linear-gradient(135deg, #f03e3e, #e03131)")
          }
        >
          Sair
        </button>
      </div>
    </div>
  );
}
