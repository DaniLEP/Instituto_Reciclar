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

  // Função para fazer o logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redireciona para a página de login após o logout
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (!usuario) {
    return <div>Carregando...</div>;
  }

  return (
    <div
      style={{
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: "#00009c",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        margin: 0,
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
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
            width: "150px",
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
          Perfil de {usuario.nome} 
        </h2>

        <div style={{ marginBottom: "20px" }}>
          <p>
            <strong>E-mail:</strong> {usuario.email}
          </p>
          <p>
            <strong>Função:</strong> {usuario.funcao}
          </p>
        </div>

      
        <Link to={"/Home"}>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#00009c",
              border: "none",
              borderRadius: "5px",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              marginTop: "10px",
            }}
          >
            Voltar
          </button>
        </Link>
        <button
          onClick={handleLogout}
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
            transition: "background-color 0.3s ease",
            marginTop: '10px'
          }}
        >
          Sair
        </button>
      </div>
    </div>
  );
}
