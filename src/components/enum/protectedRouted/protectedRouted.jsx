import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import PropTypes from "prop-types";

export  function ProtectedRoute({ children, allowedTypes }) {
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();
    const user = auth.currentUser;

    if (user) {
      const userRef = ref(db, `usuarios/${user.uid}`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const tipo = snapshot.val();
            setUserType(tipo?.funcao || tipo?.tipo);
          } else {
            console.warn("Usuário não encontrado no banco de dados.");
            setUserType("desconhecido");
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar dados do usuário:", error);
        })
        .finally(() => setIsLoading(false));
    } else {
      navigate("/");
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!isLoading && userType && !allowedTypes.includes(userType)) {
      console.log(userType)
      console.log(allowedTypes)
      navigate("/");
    }
  }, [isLoading, userType, allowedTypes, navigate]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { getDatabase, ref, get } from "firebase/database";
// import PropTypes from "prop-types";

// export function ProtectedRoute({ children, allowedTypes }) {
//   const [userType, setUserType] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const auth = getAuth();
//     const db = getDatabase();

//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const userRef = ref(db, `usuarios/${user.uid}`);
//         get(userRef)
//           .then((snapshot) => {
//             if (snapshot.exists()) {
//               const dados = snapshot.val();
//               const tipo = dados?.funcao || dados?.tipo || "desconhecido";
//               setUserType(tipo);
//             } else {
//               console.warn("Usuário não encontrado no banco de dados.");
//               setUserType("desconhecido");
//             }
//           })
//           .catch((error) => {
//             console.error("Erro ao buscar dados do usuário:", error);
//             setUserType("desconhecido");
//           })
//           .finally(() => setIsLoading(false));
//       } else {
//         navigate("/");
//         setIsLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, [navigate]);

//   useEffect(() => {
//     if (!isLoading && userType && !allowedTypes.includes(userType)) {
//       console.warn(`Acesso negado. Tipo de usuário "${userType}" não está autorizado.`);
//       navigate("/");
//     }
//   }, [isLoading, userType, allowedTypes, navigate]);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">Carregando...</div>
//     );
//   }

//   return children;
// }

// ProtectedRoute.propTypes = {
//   children: PropTypes.node.isRequired,
//   allowedTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
// };
