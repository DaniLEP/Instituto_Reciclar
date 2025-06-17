import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import {  ref, get } from "firebase/database";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button/button";
import { Label } from "@/components/ui/label";
import { auth, db } from "../../../../firebase"; // Importando as instâncias
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const UserType = { ADMIN: "Admin", COZINHA: "Cozinha", TI: "T.I",};

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
    if (!validateEmail(email)) { toast.error("E-mail inválido."); return;}
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
        if (!funcao || !Object.values(UserType).includes(funcao)) { toast.error("Função de usuário inválida."); return;}
        // Redirecionamento conforme função
        if (funcao === UserType.ADMIN) { navigate("/Home");}
        else if (funcao === UserType.COZINHA) { navigate("/Home");}
        else if (funcao === UserType.TI) { navigate("/Home");}
        else { navigate("/Home");}

        toast.success("Login bem-sucedido, bem-vindo!");} 
      else {setErrorMessage("Usuário não encontrado no sistema."); toast.error("Usuário não encontrado no sistema.");}} 
    catch (error) {
      console.error("Erro ao logar:", error.code, error.message);
      if (error.code === "auth/user-not-found") { toast.error("Usuário não encontrado.");} 
      else if (error.code === "auth/wrong-password") { toast.error("Senha incorreta.");} 
      else if (error.code === "auth/invalid-credential") {toast.error("Credenciais inválidas. Verifique e-mail e senha."); }
      else { toast.error("Erro ao fazer login.");}
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const handlePasswordReset = async () => {
    if (!validateEmail(resetEmail)) { toast.error("Digite um e-mail válido!"); return; }
    try {await sendPasswordResetEmail(auth, resetEmail);
      toast.success("Instruções enviadas para seu e-mail.");setShowResetModal(false);
    } catch (error) {
      toast.error("Erro ao enviar e-mail de redefinição.");
    }


  };
const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Verifica se o domínio do e-mail é "@reciclar.org.br"
    const email = user.email;
    if (!email.endsWith("@reciclar.org.br")) {
      toast.error("Apenas contas @reciclar.org.br são permitidas.");
      return;
    }

    const userRef = ref(db, "usuarios/" + user.uid);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      const funcao = userData.funcao;
      if (!funcao || !Object.values(UserType).includes(funcao)) {
        toast.error("Função de usuário inválida.");
        return;
      }
      // Redirecionamento conforme função
      navigate("/Home");
      toast.success("Login com Google bem-sucedido!");
    } else {
      toast.error("Usuário não encontrado no sistema.");
    }
  } catch (error) {
    console.error("Erro ao entrar com Google:", error);
    toast.error("Erro ao entrar com Google.");
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
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}  
            className="w-full p-3 rounded border border-gray-300 mb-4 bg-gray-50" />
          <Label htmlFor="password">Senha:</Label>
          <div className="relative mb-6">
            <Input  id="password" type={isPasswordVisible ? "text" : "password"}  value={password}  onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-3 pr-10 rounded border border-gray-300 bg-gray-50" />
            <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye}  onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 cursor-pointer" />
          </div>
          <button type="submit" disabled={isLoading}
            className="w-full py-3 rounded-lg bg-gradient-to-br from-purple-700 to-blue-800 text-white font-semibold hover:from-pink-500 hover:to-purple-700 transition duration-300 mb-3">
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-purple-500 rounded-full animate-spin mr-2"></span> ) : ("Acessar Plataforma ")}</button>
           <button onClick={handleGoogleLogin} className="w-full mt-2 flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 py-2 rounded shadow hover:bg-gray-100"><img src="../iconGoogle.png" alt="Google" className="w-5 h-5" /><span>Entrar com Google</span></button>        
        </form>
        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
        <button onClick={() => setShowResetModal(true)} className="w-full mt-4 text-gray-500 underline text-sm" > Esqueceu a senha?</button>
        {showResetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center">
              <h3 className="text-lg font-bold mb-4">Recuperação de Senha</h3>
              <Input type="email" placeholder="Digite seu e-mail" value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}  className="w-full p-3 mb-3 rounded border border-gray-300" />
              <Button  onClick={handlePasswordReset}  className="w-full py-3 bg-pink-600 text-white font-bold rounded mb-3">Enviar</Button>
              <Button onClick={() => setShowResetModal(false)} className="w-full py-3 bg-gray-300 text-black font-bold rounded" >  Fechar </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



// import { useEffect, useState } from "react";
// import { getDatabase, ref, onValue, remove, update } from "firebase/database";
// import { Link } from "react-router-dom";
// import { Table } from "@/components/ui/table/table";
// import { Button } from "@/components/ui/Button/button";
// import { Input } from "@/components/ui/input";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPen } from "@fortawesome/free-solid-svg-icons";

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Card = ({ to, imgSrc, imgAlt, title, children }) => (
//   <div className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
//     <Link to={to} aria-label={title} className="flex flex-col items-center">
//       {imgSrc && (
//         <img src={imgSrc} className="h-16 md:h-20 lg:h-24" alt={imgAlt || title} />
//       )}
//       {children ? children : (
//         <h2 className="text-black text-lg md:text-xl lg:text-2xl mt-4">{title}</h2>
//       )}
//     </Link>
//   </div>
// );

// export default function AdminUsuarios() {
//   const [usuarios, setUsuarios] = useState([]);
//   const [editingUser, setEditingUser] = useState(null);
//   const [nome, setNome] = useState("");
//   const [funcao, setFuncao] = useState("");
//   const database = getDatabase();

//   useEffect(() => {
//     const usuariosRef = ref(database, "usuarios");
//     onValue(usuariosRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const usuariosList = Object.keys(data).map((uid) => ({
//           uid,
//           status: "ativo",
//           ...data[uid],
//         }));
//         setUsuarios(usuariosList);
//       }
//     });
//   }, [database]);

//   const salvarAlteracoes = () => {
//     if (editingUser) {
//       update(ref(database, `usuarios/${editingUser.uid}`), { nome, funcao })
//         .then(() => {
//           toast.success("Usuário atualizado com sucesso!");
//           setEditingUser(null);
//           setNome("");
//           setFuncao("");
//         })
//         .catch((error) => toast.error("Erro ao atualizar usuário: " + error.message));
//     }
//   };

//   const excluirUsuario = (uid) => {
//     if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
//       remove(ref(database, `usuarios/${uid}`))
//         .then(() => toast.success("Usuário excluído com sucesso!"))
//         .catch((error) => toast.error("Erro ao excluir usuário: " + error.message));
//     }
//   };

//   const alternarStatus = (uid, statusAtual) => {
//     const novoStatus = statusAtual === "ativo" ? "inativo" : "ativo";
//     update(ref(database, `usuarios/${uid}`), { status: novoStatus })
//       .then(() => toast.info(`Status alterado para ${novoStatus}`))
//       .catch((error) => toast.error("Erro ao atualizar status: " + error.message));
//   };

//   return (
//     <div className="min-h-screen p-5 flex flex-col items-center bg-gradient-to-r from-[#6a11cb] to-[#2575fc]">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />
      
//       <h1 className="text-white font-bold text-4xl md:text-6xl lg:text-8xl mb-8">
//         Gerenciador de Usuários
//       </h1>

//       <Table className="w-full border-collapse mt-6 hidden md:table text-center">
//         <thead>
//           <tr className="bg-[#F20DE7] text-white text-[20px]">
//             <th className="p-2">Id</th>
//             <th className="p-2">Nome</th>
//             <th className="p-2">E-mail</th>
//             <th className="p-2">Função</th>
//             <th className="p-2">Status</th>
//             <th className="p-2">Ações</th>
//           </tr>
//         </thead>
//         <tbody>
//           {usuarios.map((usuario) => (
//             <tr key={usuario.uid} className="bg-white">
//               <td className="p-2 border-b">{usuario.uid}</td>
//               <td className="p-2 border-b">{usuario.nome}</td>
//               <td className="p-2 border-b">{usuario.email}</td>
//               <td className="p-2 border-b">{usuario.funcao}</td>
//               <td className="p-2 border-b">
//                 <span
//                   className={`px-3 py-1 rounded-full ${
//                     usuario.status === "ativo" ? "bg-green-500 text-white" : "bg-gray-400 text-white"
//                   }`}
//                 >
//                   {usuario.status || "ativo"}
//                 </span>
//               </td>
//               <td className="p-2 border-b flex items-center justify-center space-x-2">
//                 <Button
//                   onClick={() => {
//                     setEditingUser(usuario);
//                     setNome(usuario.nome);
//                     setFuncao(usuario.funcao);
//                   }}
//                   className="p-2 bg-blue-500 text-white rounded-lg"
//                 >
//                   <FontAwesomeIcon icon={faPen} />
//                 </Button>
//                 <Button
//                   onClick={() => excluirUsuario(usuario.uid)}
//                   className="p-2 bg-red-500 text-white rounded-lg"
//                 >
//                   <img src="/excluir.png" alt="Excluir" className="h-6 w-6" />
//                 </Button>
//                 <Button
//                   onClick={() => alternarStatus(usuario.uid, usuario.status || "ativo")}
//                   className="p-2 bg-yellow-500 text-white rounded-lg"
//                 >
//                   {usuario.status === "ativo" ? "Inativar" : "Ativar"}
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       {/* Cards para navegação */}
//       <div className="flex flex-wrap justify-center gap-5 mt-9">
//         <Card
//           to="/Registro_Usuario"
//           imgSrc="/novouser.png"
//           imgAlt="Novo Usuário"
//         >
//           <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">
//             Novo Usuário
//           </h2>
//         </Card>

//         <Card to="/Home" imgSrc="/return.png" imgAlt="Voltar">
//           <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">
//             Voltar
//           </h2>
//         </Card>
//       </div>

//       {/* Modal de edição, só exibe se houver um usuário sendo editado */}
//       {editingUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white rounded-lg p-8 w-full max-w-md">
//             <h2 className="text-2xl font-bold mb-6">Editar Usuário</h2>
//             <label className="block mb-4">
//               Nome:
//               <Input
//                 type="text"
//                 value={nome}
//                 onChange={(e) => setNome(e.target.value)}
//                 className="w-full p-2 border rounded mt-2"
//               />
//             </label>
//             <label className="block mb-4">
//               Função:
//               <Input
//                 type="text"
//                 value={funcao}
//                 onChange={(e) => setFuncao(e.target.value)}
//                 className="w-full p-2 border rounded mt-2"
//               />
//             </label>
//             <div className="flex justify-between mt-6">
//               <Button
//                 onClick={salvarAlteracoes}
//                 className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
//               >
//                 Salvar
//               </Button>
//               <Button
//                 onClick={() => setEditingUser(null)}
//                 className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
//               >
//                 Cancelar
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
