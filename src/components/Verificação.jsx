// import { useEffect, useState } from "react";
// import { getDatabase, ref, onValue, remove, update } from "firebase/database";
// import { Link } from "react-router-dom";

// const Card = ({ to, imgSrc, imgAlt, title }) => (
//   <div className="card bg-[#F6F6F6] rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
//     <Link to={to} aria-label={title}>
//       <img
//         src={imgSrc}
//         className="mx-auto h-[50px] md:h-[50px] lg:h-[50px]"
//         alt={imgAlt}
//       />
//       <h2 className="text-black text-lg md:text-xl lg:text-2xl mt-4">
//         {title}
//       </h2>
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
//     const usuariosRef = ref(database, "novousuario");
//     onValue(usuariosRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const usuariosList = Object.keys(data).map((uid) => ({
//           uid,
//           ...data[uid],
//         }));
//         setUsuarios(usuariosList);
//       }
//     });
//   }, [database]);

//   const salvarAlteracoes = () => {
//     if (editingUser) {
//       update(ref(database, `novousuario/${editingUser.uid}`), {
//         nome,
//         funcao,
//       })
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
//       remove(ref(database, `novousuario/${uid}`))
//         .then(() => alert("Usuário excluído com sucesso!"))
//         .catch((error) => alert("Erro ao excluir usuário: " + error.message));
//     }
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         padding: "20px ",
//         display: "flex", // Adicionado display flex
//         alignItems: "center",
//         flexDirection: "column",
//         background:
//           "linear-gradient(135deg, rgb(20, 111, 223) 0%, rgb(13, 46, 110) 100%)",
//       }}
//     >
//       <h1 className="text-white font-bold  font-[Novatica Bold] text-8xl md:text-6xl lg:text-8xl mb-[10px]">
//         Administração de Usuários
//       </h1>
//       <table
//         style={{
//           width: "90%",
//           borderCollapse: "collapse",
//           marginTop: "20px",
//           backgroundColor: "white",
//           color: "black",
//           textAlign: "center",
//         }}
//       >
//         <thead>
//           <tr style={{fontSize: '20px'}}>
//             {["Id", "Nome", "E-mail", "Função", "Ações"].map((header) => (
//               <th
//                 key={header}
//                 style={{
//                   backgroundColor: "#F20DE7",
//                   color: "#fff",
//                   padding: "10px",
//                 }}
//               >
//                 {header}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {usuarios.map((usuario) => (
//             <tr
//               key={usuario.uid}
//               style={{
//                 transition: "background-color 0.3s ease",
//               }}
//             >
//               <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
//                 {usuario.uid}
//               </td>
//               <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
//                 {usuario.nome}
//               </td>
//               <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
//                 {usuario.email}
//               </td>
//               <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
//                 {usuario.funcao}
//               </td>

//               <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
//                 <button
//                   onClick={() => {
//                     setEditingUser(usuario);
//                     setNome(usuario.nome);
//                     setFuncao(usuario.funcao);
//                   }}
//                   style={{
//                     padding: "10px 15px",
//                     fontSize: "1rem",
//                     borderRadius: "5px",
//                     border: "none",
//                     cursor: "pointer",
//                     backgroundColor: "#3B82F6",
//                     color: "#fff",
//                     marginRight: "5px",
//                   }}
//                 >
//                   Editar
//                 </button>
//                 <button
//                   onClick={() => excluirUsuario(usuario.uid)}
//                   style={{
//                     padding: "10px 15px",
//                     fontSize: "1rem",
//                     borderRadius: "5px",
//                     border: "none",
//                     cursor: "pointer",
//                     backgroundColor: "#DC2626",
//                     color: "#fff",
//                   }}
//                 >
//                   Excluir
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
//         <Card
//           to="/Registro_Usuario"
//           imgSrc="/novo-usuario.png"
//           imgAlt="New User"
//           title="Novo Usuário"
//         />
//         <Card to="/Home" imgSrc="/return.svg" imgAlt="Voltar" title="Voltar" />
//       </div>
//       {editingUser && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "white",
//               borderRadius: "10px",
//               padding: "20px",
//               color: "black",
//               width: "90%",
//               maxWidth: "400px",
//             }}
//           >
//             <h2 style={{ marginBottom: "20px", fontSize: "1.5rem" }}>
//               Editar Usuário
//             </h2>
//             <label style={{ display: "block", marginBottom: "10px" }}>
//               Nome:
//               <input
//                 type="text"
//                 value={nome}
//                 onChange={(e) => setNome(e.target.value)}
//                 style={{
//                   display: "block",
//                   width: "100%",
//                   padding: "8px",
//                   borderRadius: "5px",
//                   border: "1px solid #ddd",
//                   marginTop: "5px",
//                 }}
//               />
//             </label>
//             <label style={{ display: "block", marginBottom: "10px" }}>
//               Função:
//               <input
//                 type="text"
//                 value={funcao}
//                 onChange={(e) => setFuncao(e.target.value)}
//                 style={{
//                   display: "block",
//                   width: "100%",
//                   padding: "8px",
//                   borderRadius: "5px",
//                   border: "1px solid #ddd",
//                   marginTop: "5px",
//                 }}
//               />
//             </label>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 marginTop: "20px",
//               }}
//             >
//               <button
//                 onClick={salvarAlteracoes}
//                 style={{
//                   padding: "10px 15px",
//                   fontSize: "1rem",
//                   borderRadius: "5px",
//                   backgroundColor: "#10B981",
//                   color: "#fff",
//                   border: "none",
//                   cursor: "pointer",
//                 }}
//               >
//                 Salvar
//               </button>
//               <button
//                 onClick={() => setEditingUser(null)}
//                 style={{
//                   padding: "10px 15px",
//                   fontSize: "1rem",
//                   borderRadius: "5px",
//                   backgroundColor: "#EF4444",
//                   color: "#fff",
//                   border: "none",
//                   cursor: "pointer",
//                 }}
//               >
//                 Cancelar
//               </button>
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

const Card = ({ to, imgSrc, imgAlt, title }) => (
  <div className="card bg-gray-100 rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
    <Link to={to} aria-label={title} className="flex flex-col items-center">
      <img
        src={imgSrc}
        className="h-16 md:h-20 lg:h-24"
        alt={imgAlt}
      />
      <h2 className="text-black text-lg md:text-xl lg:text-2xl mt-4">
        {title}
      </h2>
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
    const usuariosRef = ref(database, "novousuario");
    onValue(usuariosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usuariosList = Object.keys(data).map((uid) => ({
          uid,
          ...data[uid],
        }));
        setUsuarios(usuariosList);
      }
    });
  }, [database]);

  const salvarAlteracoes = () => {
    if (editingUser) {
      update(ref(database, `novousuario/${editingUser.uid}`), {
        nome,
        funcao,
      })
        .then(() => {
          alert("Usuário atualizado com sucesso!");
          setEditingUser(null);
          setNome("");
          setFuncao("");
        })
        .catch((error) => alert("Erro ao atualizar usuário: " + error.message));
    }
  };

  const excluirUsuario = (uid) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      remove(ref(database, `novousuario/${uid}`))
        .then(() => alert("Usuário excluído com sucesso!"))
        .catch((error) => alert("Erro ao excluir usuário: " + error.message));
    }
  };

  return (
    <div className="min-h-screen p-5 flex flex-col items-center bg-gradient-to-br from-blue-500 to-blue-900">
      <h1 className="text-white font-bold text-4xl md:text-6xl lg:text-8xl mb-8">
        Administração de Usuários
      </h1>
      {/* <div className="overflow-x-auto w-full max-w-7xl">
        <table className="w-full table-auto bg-white text-black text-center rounded-lg shadow-lg">
          <thead>
            <tr className="bg-pink-600 text-white">
              {[
                "Id",
                "Nome",
                "E-mail",
                "Função",
                "Ações",
              ].map((header) => (
                <th key={header} className="py-3 px-4 text-lg">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr
                key={usuario.uid}
                className="hover:bg-gray-100 transition-colors"
              >
                <td className="py-3 px-4 border-b">{usuario.uid}</td>
                <td className="py-3 px-4 border-b">{usuario.nome}</td>
                <td className="py-3 px-4 border-b">{usuario.email}</td>
                <td className="py-3 px-4 border-b">{usuario.funcao}</td>
                <td className="py-3 px-4 border-b flex flex-col sm:flex-row justify-center items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingUser(usuario);
                      setNome(usuario.nome);
                      setFuncao(usuario.funcao);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => excluirUsuario(usuario.uid)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    <table className="w-full border-collapse mt-6 hidden md:table text-center">
  <thead>
    <tr className="bg-[#F20DE7] text-white text-[20px]">
      <th className="p-2">Id</th>
      <th className="p-2">Nome</th>
      <th className="p-2">E-mail</th>
      <th className="p-2">Função</th>
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
          <button
            onClick={() => {
              setEditingUser(usuario);
              setNome(usuario.nome);
              setFuncao(usuario.funcao);
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg mr-2"
          >
            Editar
          </button>
          <button
            onClick={() => excluirUsuario(usuario.uid)}
            className="px-3 py-1 bg-red-500 text-white rounded-lg"
          >
            Excluir
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

{/* Layout Responsivo - Cards */}
<div className="block md:hidden">
  {usuarios.map((usuario) => (
    <div
      key={usuario.uid}
      className="border rounded-lg p-4 mb-4 bg-white "
    >
      <p className="text-gray-800 font-semibold">ID: {usuario.uid}</p>
      <p className="text-gray-800">Nome: {usuario.nome}</p>
      <p className="text-gray-800">E-mail: {usuario.email}</p>
      <p className="text-gray-800">Função: {usuario.funcao}</p>
      <div className="mt-2 flex justify-between">
        <button
          onClick={() => {
            setEditingUser(usuario);
            setNome(usuario.nome);
            setFuncao(usuario.funcao);
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded-lg"
        >
          Editar
        </button>
        <button
          onClick={() => excluirUsuario(usuario.uid)}
          className="px-3 py-1 bg-red-500 text-white rounded-lg"
        >
          Excluir
        </button>
      </div>
    </div>
  ))}
</div>

      <div className="flex flex-wrap justify-center gap-5 mt-8">
        <Card
          to="/Registro_Usuario"
          imgSrc="/novo-usuario.png"
          imgAlt="Novo Usuário"
          title="Novo Usuário"
        />
        <Card to="/Home" imgSrc="/return.svg" imgAlt="Voltar" title="Voltar" />
      </div>
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Editar Usuário</h2>
            <label className="block mb-4">
              Nome:
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-2 border rounded mt-2"
              />
            </label>
            <label className="block mb-4">
              Função:
              <input
                type="text"
                value={funcao}
                onChange={(e) => setFuncao(e.target.value)}
                className="w-full p-2 border rounded mt-2"
              />
            </label>
            <div className="flex justify-between mt-6">
              <button
                onClick={salvarAlteracoes}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Salvar
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
