import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header.jsx";
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";

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

const Card = ({ to, imgSrc, imgAlt, title }) => (
  <div className="card bg-[#F6F6F6] rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
    <Link to={to} aria-label={title}>
      <img
        src={imgSrc}
        className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]"
        alt={imgAlt}
      />
      <h2 className="text-black text-lg md:text-xl lg:text-2xl mt-4">{title}</h2>
    </Link>
  </div>
);

export default function Home() {
  const [time, setTime] = useState(new Date());
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Atualiza o relógio a cada segundo
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Função para buscar os dados do usuário
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        // Obtém os dados do usuário no banco de dados Firebase
        const dbRef = ref(database, "novousuario/" + user.uid);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          setUsuario(snapshot.val());  // Armazena os dados do usuário
        } else {
          console.log("Usuário não encontrado no banco de dados.");
        }
      } else {
        navigate("/"); // Redireciona para a página de login se o usuário não estiver autenticado
      }
    };

    fetchUserData();
  }, [navigate]);

  // Exibe "Carregando..." enquanto os dados do usuário não são carregados
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
    <>
      <div
        style={{
          background: "white",
          fontFamily: "Chakra Petch, sans-serif",
          fontSize: "20px",
          textAlign: "center",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgb(23, 77, 142) 0%, rgb(18, 53, 122) 100%)",
          }}
        >
          <Header />
        </div>
        <hr style={{ height: "0.2rem" }} />

        {/* Conteúdo da Home (Cards) */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgb(23, 77, 142) 0%, rgb(18, 53, 122) 100%)",
            minHeight: "100vh",
            padding: "20px 0",
            marginBottom: "50px"
          }}
        >
          <div
            className="container mx-auto px-4"
            style={{
              maxWidth: "1460px",
              textAlign: "center",
            }}
          >
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4"
              style={{
                marginTop: "80px",
              }}
            >
              {/* Cards */}
              <Card
                to="/Pedidos"
                imgSrc="/listaPedidos.svg"
                imgAlt="Pedidos"
                title="Pedidos"
              />
              <Card
                to="/Cadastro"
                imgSrc="/cadastro.svg"
                imgAlt="Cadastro"
                title="Cadastros"
              />
              <Card
                to="/Dashboard"
                imgSrc="/relatorio.svg"
                imgAlt="Relatórios"
                title="Relatórios"
              />
              <Card
                to="/Retirada"
                imgSrc="/retirada.svg"
                imgAlt="Retirada"
                title="Retirada"
              />
              <Card
                to="/Verificacao_Usuario"
                imgSrc="/users-control.png"
                imgAlt="Controle de Usuários"
                title="Controle de Usuários"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            background: "linear-gradient(135deg, rgb(23, 77, 142) 0%, rgb(18, 53, 122) 100%)",
            borderTop: "3px solid #ddd",
            fontSize: "14px",
            color: "white",
            position: "fixed",
            bottom: 0,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontWeight: "bold" }}>Instituto Reciclar</div>
          <div>Seja bem-vindo <br />{usuario.nome || "Usuário não encontrado"}</div> {/* Exibe o nome do usuário */}
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "16px",
            }}
          >
            {time.toLocaleTimeString()}
          </div>
        </footer>
      </div>
    </>
  );
}
