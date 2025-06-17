// import { useEffect, useState } from "react";
// import { getDatabase, ref, onValue, remove, update } from "firebase/database";
// import { Link } from "react-router-dom";
// import { Table } from "@/components/ui/table/table";
// import { Button } from "@/components/ui/Button/button";
// import { Input } from "@/components/ui/input";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPen } from "@fortawesome/free-solid-svg-icons";

// const Card = ({ to, imgSrc, imgAlt, title, children }) => (
//   <div className="bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform w-40 sm:w-52 md:w-60">
//     <Link to={to} aria-label={title} className="flex flex-col items-center">
//       {imgSrc && (
//         <img src={imgSrc} className="h-16 md:h-20 lg:h-24" alt={imgAlt || title} />
//       )}
//       {children || (
//         <h2 className="text-black text-center text-lg md:text-xl lg:text-2xl mt-4">{title}</h2>
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
//           alert("Usuário atualizado com sucesso!");
//           setEditingUser(null);
//           setNome("");
//           setFuncao("");
//         })
//         .catch((error) => alert("Erro ao atualizar usuário: " + error.message));
//     }
//   };

//   const excluirUsuario = (uid) => {
//     if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
//       remove(ref(database, `usuarios/${uid}`))
//         .then(() => alert("Usuário excluído com sucesso!"))
//         .catch((error) => alert("Erro ao excluir usuário: " + error.message));
//     }
//   };

//   const alternarStatus = (uid, statusAtual) => {
//     const novoStatus = statusAtual === "ativo" ? "inativo" : "ativo";
//     update(ref(database, `usuarios/${uid}`), { status: novoStatus })
//       .then(() => alert(`Status alterado para ${novoStatus}`))
//       .catch((error) => alert("Erro ao atualizar status: " + error.message));
//   };

//   return (
//     <div className="min-h-screen p-4 sm:p-6 md:p-10 bg-gradient-to-r from-[#6a11cb] to-[#2575fc] flex flex-col items-center">
//       <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl mb-6 text-center">
//         Gerenciador de Usuários
//       </h1>

//       {/* Tabela responsiva (visível em md+) */}
//       <div className="w-full overflow-x-auto hidden md:block">
//         <Table className="w-full text-center border-collapse mt-6">
//           <thead>
//             <tr className="bg-[#F20DE7] text-white text-[18px]">
//               <th className="p-2">Id</th>
//               <th className="p-2">Nome</th>
//               <th className="p-2">E-mail</th>
//               <th className="p-2">Função</th>
//               <th className="p-2">Status</th>
//               <th className="p-2">Ações</th>
//             </tr>
//           </thead>
//           <tbody>
//             {usuarios.map((usuario) => (
//               <tr key={usuario.uid} className="bg-white text-sm">
//                 <td className="p-2 border-b">{usuario.uid}</td>
//                 <td className="p-2 border-b">{usuario.nome}</td>
//                 <td className="p-2 border-b">{usuario.email}</td>
//                 <td className="p-2 border-b">{usuario.funcao}</td>
//                 <td className="p-2 border-b">
//                   <span className={`px-3 py-1 rounded-full ${usuario.status === "ativo" ? "bg-green-500" : "bg-gray-400"} text-white`}>
//                     {usuario.status}
//                   </span>
//                 </td>
//                 <td className="p-2 border-b flex items-center justify-center space-x-2">
//                   <Button
//                     onClick={() => {
//                       setEditingUser(usuario);
//                       setNome(usuario.nome);
//                       setFuncao(usuario.funcao);
//                     }}
//                     className="p-2 bg-blue-500 text-white rounded-lg"
//                   >
//                     <FontAwesomeIcon icon={faPen} />
//                   </Button>
//                   <Button
//                     onClick={() => excluirUsuario(usuario.uid)}
//                     className="p-2 bg-red-500 text-white rounded-lg"
//                   >
//                     <img src="/excluir.png" alt="Excluir" className="h-6 w-6" />
//                   </Button>
//                   <Button
//                     onClick={() => alternarStatus(usuario.uid, usuario.status)}
//                     className="p-2 bg-yellow-500 text-white rounded-lg"
//                   >
//                     {usuario.status === "ativo" ? "Inativar" : "Ativar"}
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>

//       {/* Lista estilo cartão em telas pequenas */}
//       <div className="w-full grid grid-cols-1 gap-4 md:hidden mt-4">
//         {usuarios.map((usuario) => (
//           <div key={usuario.uid} className="bg-white p-4 rounded-lg shadow text-sm">
//             <p><strong>ID:</strong> {usuario.uid}</p>
//             <p><strong>Nome:</strong> {usuario.nome}</p>
//             <p><strong>Email:</strong> {usuario.email}</p>
//             <p><strong>Função:</strong> {usuario.funcao}</p>
//             <p>
//               <strong>Status:</strong>{" "}
//               <span className={`px-2 py-1 rounded-full text-white ${usuario.status === "ativo" ? "bg-green-500" : "bg-gray-400"}`}>
//                 {usuario.status}
//               </span>
//             </p>
//             <div className="flex flex-wrap gap-2 mt-2">
//               <Button
//                 onClick={() => {
//                   setEditingUser(usuario);
//                   setNome(usuario.nome);
//                   setFuncao(usuario.funcao);
//                 }}
//                 className="bg-blue-500 text-white px-3 py-1 rounded"
//               >
//                 Editar
//               </Button>
//               <Button
//                 onClick={() => excluirUsuario(usuario.uid)}
//                 className="bg-red-500 text-white px-3 py-1 rounded"
//               >
//                 Excluir
//               </Button>
//               <Button
//                 onClick={() => alternarStatus(usuario.uid, usuario.status)}
//                 className="bg-yellow-500 text-white px-3 py-1 rounded"
//               >
//                 {usuario.status === "ativo" ? "Inativar" : "Ativar"}
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Navegação por cards */}
//       <div className="flex flex-wrap justify-center gap-5 mt-10">
//         <Card to="/Registro_Usuario" imgSrc="/novouser.png" imgAlt="Novo Usuário">
//           <h2 className="text-black text-xl text-center mt-4">Novo Usuário</h2>
//         </Card>
//         <Card to="/Home" imgSrc="/return.png" imgAlt="Voltar">
//           <h2 className="text-black text-xl text-center mt-4">Voltar</h2>
//         </Card>
//       </div>

//       {/* Modal de edição */}
//       {editingUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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




import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove, update } from "firebase/database";
import { Link } from "react-router-dom";
import { Table } from "@/components/ui/table/table";
import { Button } from "@/components/ui/Button/button";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Card = ({ to, imgSrc, imgAlt, title, children }) => (
  <div className="card bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
    <Link to={to} aria-label={title} className="flex flex-col items-center">
      {imgSrc && (
        <img src={imgSrc} className="h-16 md:h-20 lg:h-24" alt={imgAlt || title} />
      )}
      {children ? children : (
        <h2 className="text-black text-lg md:text-xl lg:text-2xl mt-4">{title}</h2>
      )}
    </Link>
  </div>
);

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [nome, setNome] = useState("");
  const [funcao, setFuncao] = useState("");
  const database = getDatabase();

  useEffect(() => {
    const usuariosRef = ref(database, "usuarios");
    onValue(usuariosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usuariosList = Object.keys(data).map((uid) => ({
          uid,
          status: "ativo",
          ...data[uid],
        }));
        setUsuarios(usuariosList);
      }
    });
  }, [database]);

  const salvarAlteracoes = () => {
    if (editingUser) {
      update(ref(database, `usuarios/${editingUser.uid}`), { nome, funcao })
        .then(() => {
          toast.success("Usuário atualizado com sucesso!");
          setEditingUser(null);
          setNome("");
          setFuncao("");
        })
        .catch((error) => toast.error("Erro ao atualizar usuário: " + error.message));
    }
  };

  const excluirUsuario = (uid) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      remove(ref(database, `usuarios/${uid}`))
        .then(() => toast.success("Usuário excluído com sucesso!"))
        .catch((error) => toast.error("Erro ao excluir usuário: " + error.message));
    }
  };

  const alternarStatus = (uid, statusAtual) => {
    const novoStatus = statusAtual === "ativo" ? "inativo" : "ativo";
    update(ref(database, `usuarios/${uid}`), { status: novoStatus })
      .then(() => toast.info(`Status alterado para ${novoStatus}`))
      .catch((error) => toast.error("Erro ao atualizar status: " + error.message));
  };

  return (
    <div className="min-h-screen p-5 flex flex-col items-center bg-gradient-to-r from-[#6a11cb] to-[#2575fc]">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />

      <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 text-center">
        Gerenciador de Usuários
      </h1>

      {/* Tabela Desktop */}
      <div className="hidden md:block w-full overflow-x-auto">
        <Table className="w-full border-collapse text-center">
          <thead>
            <tr className="bg-[#F20DE7] text-white text-[18px]">
              <th className="p-2">Id</th>
              <th className="p-2">Nome</th>
              <th className="p-2">E-mail</th>
              <th className="p-2">Função</th>
              <th className="p-2">Status</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.uid} className="bg-white">
                <td className="p-2 border-b">{usuario.uid}</td>
                <td className="p-2 border-b">{usuario.nome}</td>
                <td className="p-2 border-b">{usuario.email}</td>
                <td className="p-2 border-b">{usuario.funcao}</td>
                <td className="p-2 border-b">
                  <span
                    className={`px-3 py-1 rounded-full ${
                      usuario.status === "ativo" ? "bg-green-500" : "bg-gray-400"
                    } text-white`}
                  >
                    {usuario.status || "ativo"}
                  </span>
                </td>
                <td className="p-2 border-b flex flex-wrap gap-2 justify-center">
                  <Button onClick={() => {
                    setEditingUser(usuario);
                    setNome(usuario.nome);
                    setFuncao(usuario.funcao);
                  }} className="bg-blue-500 text-white px-3 py-1 rounded">
                    <FontAwesomeIcon icon={faPen} />
                  </Button>
                  <Button onClick={() => excluirUsuario(usuario.uid)} className="bg-red-500 text-white px-3 py-1 rounded">
                    <img src="/excluir.png" alt="Excluir" className="h-5 w-5" />
                  </Button>
                  <Button onClick={() => alternarStatus(usuario.uid, usuario.status || "ativo")} className="bg-yellow-500 text-white px-3 py-1 rounded">
                    {usuario.status === "ativo" ? "Inativar" : "Ativar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Tabela Mobile */}
      <div className="md:hidden w-full mt-4 space-y-4">
        {usuarios.map((usuario) => (
          <div key={usuario.uid} className="bg-white rounded-lg p-4 shadow-md">
            <p><strong>Nome:</strong> {usuario.nome}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Função:</strong> {usuario.funcao}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded ${
                  usuario.status === "ativo" ? "bg-green-500" : "bg-gray-400"
                } text-white`}
              >
                {usuario.status || "ativo"}
              </span>
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button onClick={() => {
                setEditingUser(usuario);
                setNome(usuario.nome);
                setFuncao(usuario.funcao);
              }} className="bg-blue-500 text-white px-3 py-1 rounded">
                <FontAwesomeIcon icon={faPen} />
              </Button>
              <Button onClick={() => excluirUsuario(usuario.uid)} className="bg-red-500 text-white px-3 py-1 rounded">
                <img src="/excluir.png" alt="Excluir" className="h-5 w-5" />
              </Button>
              <Button onClick={() => alternarStatus(usuario.uid, usuario.status || "ativo")} className="bg-yellow-500 text-white px-3 py-1 rounded">
                {usuario.status === "ativo" ? "Inativar" : "Ativar"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Cards para navegação */}
      <div className="flex flex-wrap justify-center gap-5 mt-10 w-full">
        <Card to="/Registro_Usuario" imgSrc="/novouser.png" imgAlt="Novo Usuário">
          <h2 className="text-black text-lg md:text-2xl">Novo Usuário</h2>
        </Card>
        <Card to="/Home" imgSrc="/return.png" imgAlt="Voltar">
          <h2 className="text-black text-lg md:text-2xl">Voltar</h2>
        </Card>
      </div>

      {/* Modal de edição */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Editar Usuário</h2>
            <label className="block mb-3">
              Nome:
              <Input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
              />
            </label>
            <label className="block mb-3">
              Função:
              <Input
                type="text"
                value={funcao}
                onChange={(e) => setFuncao(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
              />
            </label>
            <div className="flex justify-between mt-4">
              <Button onClick={salvarAlteracoes} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Salvar
              </Button>
              <Button onClick={() => setEditingUser(null)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}