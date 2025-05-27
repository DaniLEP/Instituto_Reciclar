// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { signOut, ref, get, auth, db } from "../../../firebase"; 
// import { Button } from "@/components/ui/Button/button";



// export default function Perfil() {
//   const [usuario, setUsuario] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//       const fetchUserData = async () => {
//         const user = auth.currentUser;
//         if (user) {
//           const dbRef = ref(db, "usuarios/" + user.uid);
//           const snapshot = await get(dbRef);
//           if (snapshot.exists())
//             {setUsuario(snapshot.val());}
//         }else {navigate("/");} // Redireciona para login se não houver usuário autenticado
//       }; fetchUserData();
//     }, 
//   [navigate]);

//   const handleLogout = async () => {
//     try {await signOut(auth); navigate("/");} // Redireciona para a página de login após o logout
//       catch (error) {console.error("Erro ao fazer logout:", error);}
//   };

//   if (!usuario) {
//     return (
//        <div className="flex justify-center items-center min-h-[100vh] font-['Roboto',sans-serif] text-[18px] text-[#333]">Carregando...</div>
//     );
//   }

//   return (
//       <div className="bg-gradient-to-r from-[#4c6ef5] to-[#15aabf] min-h-[100vh] flex justify-center items-center p-20 font-['Roboto',sans-serif]">
//       <div onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")} onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
//        className="bg-white rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.2)] w-full max-w-[400px] p-[30px] text-center transition-transform duration-300">
//         <img src="/Reciclar_LOGO.png" alt="Logo da Reciclar"  style={{width: "200px", margin: "0 auto 20px",}}/>
//           <h1 className="text-[24px] text-[#2c3e50] mb-5 font-[600]"> Olá, {usuario.nome}! </h1>
//             <p className="text-[#666] text-[16px] mb-[20px]">Confira seus dados abaixo:</p>

//       <div className="text-left bg-[#f8f9fa] rounded-[8px] p-5 mb-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
//         <p><strong>Email:</strong> {usuario.email}</p>
//           <p> <strong>Função:</strong> {usuario.funcao}</p>
//       </div>

//         <Link to="/Home">
//           <Button 
//             className="w-full p-6 rounded-[12px] mb-4 bg-gradient-to-r from-[#4c6ef5] to-[#228be6] text-white text-[20px] font-bold cursor-pointer transition-all duration-300 ease-in-out"
//               onMouseOver={(e) => (e.target.style.background = "linear-gradient(135deg, #3b5bdb 0%, #1971c2 100%)")}
//                 onMouseOut={(e) => (e.target.style.background = "linear-gradient(135deg, #4c6ef5 0%, #228be6 100%)")}>
//                   Voltar
//           </Button>
//         </Link>

//         <Button onClick={handleLogout} 
//           className="w-full p-6 rounded-[12px] bg-gradient-to-r from-[#f03e3e] to-[#e03131] text-white text-[20px] font-bold cursor-pointer transition-all duration-300 ease-in-out"
//             onMouseOver={(e) => (e.target.style.background = "linear-gradient(135deg, #c92a2a, #a51111)")}
//               onMouseOut={(e) => (e.target.style.background = "linear-gradient(135deg, #f03e3e, #e03131)")}> Sair
//         </Button>
//       </div>
//     </div>
//   );
// }

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
        navigate("/"); // Redireciona para login se não houver usuário autenticado
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
      <div className="flex justify-center items-center min-h-[100vh] font-['Roboto',sans-serif] text-[18px] text-[#333]">
        Carregando...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#4c6ef5] to-[#15aabf] min-h-[100vh] flex justify-center items-center p-20 font-['Roboto',sans-serif]">
      <div
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        className="bg-white rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.2)] w-full max-w-[400px] p-[30px] text-center transition-transform duration-300"
      >
        <img
          src="/Reciclar_LOGO.png"
          alt="Logo da Reciclar"
          style={{ width: "200px", margin: "0 auto 20px" }}
        />

        {/* Imagem de perfil */}
        {usuario.fotoPerfil && (
          <img
            src={usuario.fotoPerfil}
            alt={`Foto de perfil de ${usuario.nome}`}
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-md"
          />
        )}

        <h1 className="text-[24px] text-[#2c3e50] mb-5 font-[600]">
          Olá, {usuario.nome}!
        </h1>
        <p className="text-[#666] text-[16px] mb-[20px]">
          Confira seus dados abaixo:
        </p>

        <div className="text-left bg-[#f8f9fa] rounded-[8px] p-5 mb-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
          <p>
            <strong>Email:</strong> {usuario.email}
          </p>
          <p>
            <strong>Função:</strong> {usuario.funcao}
          </p>
        </div>

        <Link to="/Home">
          <Button
            className="w-full p-6 rounded-[12px] mb-4 bg-gradient-to-r from-[#4c6ef5] to-[#228be6] text-white text-[20px] font-bold cursor-pointer transition-all duration-300 ease-in-out"
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
          className="w-full p-6 rounded-[12px] bg-gradient-to-r from-[#f03e3e] to-[#e03131] text-white text-[20px] font-bold cursor-pointer transition-all duration-300 ease-in-out"
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
