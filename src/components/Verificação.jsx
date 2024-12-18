import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove, update } from "firebase/database";
import { Link } from "react-router-dom";

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
    <div
      style={{
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: "#00009c",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "20px" }}>
        Administração de Usuários
      </h1>
      <table
        style={{
          width: "90%",
          borderCollapse: "collapse",
          marginTop: "20px",
          backgroundColor: "white",
          color: "black",
          textAlign: "center",
        }}
      >
        <thead>
          <tr>
            {[ "Id" ,"Nome", "E-mail", "Função", "Ações"].map(
              (header) => (
                <th
                  key={header}
                  style={{
                    backgroundColor: "#F20DE7",
                    color: "#fff",
                    padding: "10px",
                  }}
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr
              key={usuario.uid}
              style={{
                transition: "background-color 0.3s ease",
              }}
            >
               <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                {usuario.uid}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                {usuario.nome}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                {usuario.email}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                {usuario.funcao}
              </td>
            
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                <button
                  onClick={() => {
                    setEditingUser(usuario);
                    setNome(usuario.nome);
                    setFuncao(usuario.funcao);
                  }}
                  style={{
                    padding: "10px 15px",
                    fontSize: "1rem",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "#3B82F6",
                    color: "#fff",
                    marginRight: "5px",
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => excluirUsuario(usuario.uid)}
                  style={{
                    padding: "10px 15px",
                    fontSize: "1rem",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "#DC2626",
                    color: "#fff",
                  }}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <Link to="/Registro_Usuario">
          <button
            style={{
              padding: "10px 15px",
              fontSize: "20px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "white",
              color: "black",
            }}
          >
            <img
              src="/novo-usuario.png"
              alt="Novo Usuário"
              style={{
                width: "50px",
                height: "auto",
                marginBottom: "5px",
                margin: '0 auto'
              }}
            />
            Novo Usuário
          </button>
        </Link>
        <Link to="/Home">
          <button
            style={{
              padding: "10px 15px",
              fontSize: "20px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "white",
              color: "black",
            }}
          >
            <img
              src="/return.svg"
              alt="Voltar"
              style={{
                width: "60px",
                height: "auto",
                marginBottom: "5px",
              }}
            />
            Voltar
          </button>
        </Link>
      </div>
      {editingUser && (
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
              borderRadius: "10px",
              padding: "20px",
              color: "black",
              width: "90%",
              maxWidth: "400px",
            }}
          >
            <h2 style={{ marginBottom: "20px", fontSize: "1.5rem" }}>
              Editar Usuário
            </h2>
            <label style={{ display: "block", marginBottom: "10px" }}>
              Nome:
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                  marginTop: "5px",
                }}
              />
            </label>
            <label style={{ display: "block", marginBottom: "10px" }}>
              Função:
              <input
                type="text"
                value={funcao}
                onChange={(e) => setFuncao(e.target.value)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                  marginTop: "5px",
                }}
              />
            </label>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <button
                onClick={salvarAlteracoes}
                style={{
                  padding: "10px 15px",
                  fontSize: "1rem",
                  borderRadius: "5px",
                  backgroundColor: "#10B981",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Salvar
              </button>
              <button
                onClick={() => setEditingUser(null)}
                style={{
                  padding: "10px 15px",
                  fontSize: "1rem",
                  borderRadius: "5px",
                  backgroundColor: "#EF4444",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
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
