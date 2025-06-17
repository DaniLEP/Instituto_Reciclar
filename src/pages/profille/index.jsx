import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut, ref, get, auth, db } from "../../../firebase";
import { Button } from "@/components/ui/Button/button";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const dbRef = ref(db, "usuarios/" + user.uid);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          setUsuario(snapshot.val());
        }
      } else {
        navigate("/"); // Redireciona se não houver usuário autenticado
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (!usuario) {
    return (
      <div className="flex justify-center items-center min-h-screen font-['Roboto',sans-serif] text-[18px] text-[#333]">
        Carregando...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#4c6ef5] to-[#15aabf] min-h-screen flex justify-center items-center px-4 py-10 sm:px-8 md:px-16 lg:px-20 font-['Roboto',sans-serif]">
      <div
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        className="bg-white rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.2)] w-full max-w-md p-6 sm:p-8 text-center transition-transform duration-300"
      >
        <img
          src="/Reciclar_LOGO.png"
          alt="Logo da Reciclar"
          className="w-40 mx-auto mb-5"
        />

        {usuario.fotoPerfil && (
          <img
            src={usuario.fotoPerfil}
            alt={`Foto de perfil de ${usuario.nome}`}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto mb-4 object-cover shadow-md"
          />
        )}

        <h1 className="text-xl sm:text-2xl text-[#2c3e50] mb-3 font-semibold">
          Olá, {usuario.nome}!
        </h1>
        <p className="text-[#666] text-sm sm:text-base mb-4">
          Confira seus dados abaixo:
        </p>

        <div className="text-left bg-[#f8f9fa] rounded-[8px] p-4 mb-5 shadow-[0_2px_10px_rgba(0,0,0,0.1)] text-sm sm:text-base">
          <p>
            <strong>Email:</strong> {usuario.email}
          </p>
          <p>
            <strong>Função:</strong> {usuario.funcao}
          </p>
        </div>

        <Link to="/Home">
          <Button
            className="w-full py-4 sm:py-5 rounded-[12px] mb-4 bg-gradient-to-r from-[#4c6ef5] to-[#228be6] text-white text-lg font-bold cursor-pointer transition-all duration-300 ease-in-out"
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
          </Button>
        </Link>

        <Button
          onClick={handleLogout}
          className="w-full py-4 sm:py-5 rounded-[12px] bg-gradient-to-r from-[#f03e3e] to-[#e03131] text-white text-lg font-bold cursor-pointer transition-all duration-300 ease-in-out"
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
        </Button>
      </div>
    </div>
  );
}
