import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove, update } from "firebase/database";
import { Link } from "react-router-dom";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
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
    <div style={styles.container}>
      <h1 style={styles.title}>Administração de Usuários</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            {["Nome",  "E-mail", "Função", "Tempo Logado", "Ações"].map(
              (header) => (
                <th key={header} style={styles.tableHeader}>
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.uid} style={styles.tableRow}>
              <td style={styles.tableCell}>{usuario.nome}</td>
              <td style={styles.tableCell}>{usuario.email}</td>
              <td style={styles.tableCell}>{usuario.funcao}</td>
              <td style={styles.tableCell}>{usuario.uid}</td>
              <td style={styles.tableCell}>
                <button
                  onClick={() => {
                    setEditingUser(usuario);
                    setNome(usuario.nome);
                    setFuncao(usuario.funcao);
                  }}
                  style={{ ...styles.button, ...styles.editButton }}
                >
                  Editar
                </button>
                <button
                  onClick={() => excluirUsuario(usuario.uid)}
                  style={{ ...styles.button, ...styles.deleteButton }}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.actions}>
        <Link to={"/Registro_Usuario"}>
          <button style={{ ...styles.Newbutton }}>
            <img
              src="/novo-usuario.png"
              style={{
                width: "50px",
                height: "auto",
                marginBottom: "5px",
                margin: "0 auto",
              }}
            />
            Novo Usuário
          </button>
        </Link>
        <Link to={"/Home"}>
          <button style={{ ...styles.Returnbutton }}>
            <img src="/return.svg" alt=""  style={{
                width: "68px",
                height: "auto",
                marginBottom: "5px",
                margin: "0 auto",
              }}/>Voltar</button>
        </Link>
      </div>
      {editingUser && (
        <div style={styles.editModal}>
          <h2 style={styles.editTitle}>Editar Usuário</h2>
          <label style={styles.label}>
            Nome:
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={styles.input}
            />
          </label>
       
          <label style={styles.label}>
            Função:
            <input
              type="text"
              value={funcao}
              onChange={(e) => setFuncao(e.target.value)}
              style={styles.input}
            />
          </label>
          <div style={styles.modalActions}>
            <button
              onClick={salvarAlteracoes}
              style={{ ...styles.button, ...styles.saveButton }}
            >
              Salvar
            </button>
            <button
              onClick={() => setEditingUser(null)}
              style={{ ...styles.button, ...styles.cancelButton }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
const styles = {
  container: {
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#00009c",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "20px",
  },
  table: {
    width: "90%",
    borderCollapse: "collapse",
    marginTop: "20px",
    backgroundColor: "white",
    color: "black",
    textAlign: "center",
  },
  tableHeader: {
    backgroundColor: "#F20DE7",
    color: "#fff",
    padding: "10px",
  },
  tableRow: {
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#f1f1f1",
    },
  },
  tableCell: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  actions: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "10px 15px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
  Newbutton: {
    padding: "10px 15px",
    fontSize: "20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    transition: "transform 0.2s ease",
    backgroundColor: 'white',
    marginTop: '10px',
    color: 'black'
  },
  Returnbutton: {
    padding: "10px 15px",
        fontSize: "20px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
        transition: "transform 0.2s ease",
        backgroundColor: 'white',
        marginTop: '10px',
        color: 'black'
  },
  editButton: {
    backgroundColor: "#3B82F6",
    color: "#fff",
    marginRight: "5px",
  },
  deleteButton: {
    backgroundColor: "#DC2626",
    color: "#fff",
  },
  editModal: {
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "10px",
    color: "black",
    width: "90%",
    maxWidth: "400px",
  },
  editTitle: {
    marginBottom: "20px",
    fontSize: "1.5rem",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#10B981",
    color: "#fff",
  },
  cancelButton: {
    backgroundColor: "#EF4444",
    color: "#fff",
  },
};
