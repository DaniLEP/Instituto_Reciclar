import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeApp, getApps } from "firebase/app";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";  // Importando o ícone de seta
import "react-toastify/dist/ReactToastify.css";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.appspot.com",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getDatabase();

const formatCNPJ = (cnpj) => {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

const formatTelefone = (telefone) => {
  return telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

const formatCEP = (cep) => {
  return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
};

export default function ListaFornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fornecedoresRef = ref(db, "CadastroFornecedores");
    onValue(fornecedoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fornecedoresArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setFornecedores(fornecedoresArray);
      } else {
        setFornecedores([]);
      }
    });
  }, []);

  const fornecedoresFiltrados = fornecedores.filter(
    (fornecedor) =>
      fornecedor.razaoSocial.toLowerCase().includes(filtro.toLowerCase()) ||
      fornecedor.cnpj.includes(filtro) ||
      (fornecedor.grupo &&
        fornecedor.grupo.toLowerCase().includes(filtro.toLowerCase()))
  );

  const handleEdit = (fornecedor) => {
    if (!fornecedor.id) {
      toast.error("Erro ao editar: ID do fornecedor não encontrado.");
      console.error("Fornecedor sem ID:", fornecedor);
      return;
    }
    navigate(`/editar-fornecedor/${fornecedor.id}`);
  };

  // Função para voltar à página anterior
  const handleGoBack = () => {
    navigate(-1); // Navega para a página anterior
  };

  return (
    <div className="p-8 bg-gradient-to-br from-[#0a192f] to-[#1e3a8a] min-h-screen">
      <button
        onClick={handleGoBack}
        className="mb-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2"
      >
        <IoArrowBack className="text-xl" /> {/* Ícone de seta */}
        <span>Voltar</span>
      </button>
      <h2 className="text-3xl font-semibold text-center mb-6 text-white">
        Lista de Fornecedores
      </h2>
      <input
        type="text"
        placeholder="Buscar por Razão Social, CNPJ ou Categoria"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="mb-4 p-2 w-full max-w-full border rounded-lg"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-left">CNPJ</th>
              <th className="p-3 text-left">Razão Social</th>
              <th className="p-3 text-left">Telefone</th>
              <th className="p-3 text-left">E-mail</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {fornecedoresFiltrados.length > 0 ? (
              fornecedoresFiltrados.map((fornecedor) => (
                <tr key={fornecedor.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{formatCNPJ(fornecedor.cnpj)}</td>
                  <td className="p-3">{fornecedor.razaoSocial}</td>
                  <td className="p-3">{formatTelefone(fornecedor.telefone)}</td>
                  <td className="p-3">{fornecedor.email}</td>
                  <td
                    className={`p-3 font-semibold ${
                      fornecedor.status === "Ativo"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {fornecedor.status}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(fornecedor)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-3 text-gray-500">
                  Nenhum fornecedor encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
}
