import { useEffect, useState } from "react";
import { getDatabase, ref, get, set } from "firebase/database";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import InputMask from "react-input-mask";
import "react-toastify/dist/ReactToastify.css";

export default function EditarFornecedor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [fornecedor, setFornecedor] = useState({
    cnpj: "",
    razaoSocial: "",
    cep: "",
    endereco: "",
    numero: "",
    bairro: "",
    municipio: "",
    uf: "",
    contato: "",
    telefone: "",
    email: "",
    grupo: "",
    status: "Ativo",
  });

  useEffect(() => {
    if (location.state && location.state.fornecedor) {
      setFornecedor(location.state.fornecedor);
    } else {
      const db = getDatabase();
      const fornecedorRef = ref(db, `CadastroFornecedores/${id}`);
      get(fornecedorRef).then((snapshot) => {
        if (snapshot.exists()) {
          setFornecedor(snapshot.val());
        } else {
          toast.error("Fornecedor não encontrado");
          navigate("/Visualizar_Fornecedores");
        }
      });
    }
  }, [id, location.state, navigate]);

  const buscarEndereco = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setFornecedor((prev) => ({
            ...prev,
            endereco: data.logradouro || "",
            bairro: data.bairro || "",
            municipio: data.localidade || "",
            uf: data.uf || "",
          }));
        } else {
          toast.error("CEP não encontrado.");
        }
      } catch (error) {
        toast.error("Erro ao buscar CEP.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFornecedor({ ...fornecedor, [name]: value });

    if (name === "cep") {
      buscarEndereco(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const db = getDatabase();
    set(ref(db, `CadastroFornecedores/${id}`), fornecedor)
      .then(() => {
        toast.success("Fornecedor atualizado com sucesso!");
        navigate("/Visualizar_Fornecedores");
      })
      .catch((error) => {
        toast.error("Erro ao atualizar fornecedor: " + error.message);
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0a192f] to-[#1e3a8a]">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-xl rounded-lg w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-500">Editar Fornecedor</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-700">CNPJ:</label>
            <InputMask 
              mask="99.999.999/9999-99" 
              type="text" 
              name="cnpj" 
              value={fornecedor.cnpj} 
              onChange={handleChange} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-gray-700">Razão Social:</label>
            <input type="text" name="razaoSocial" value={fornecedor.razaoSocial} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="text-gray-700">CEP:</label>
            <InputMask 
              mask="99999-999" 
              type="text" 
              name="cep" 
              value={fornecedor.cep} 
              onChange={handleChange} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-gray-700">Endereço:</label>
            <input type="text" name="endereco" value={fornecedor.endereco} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="text-gray-700">Número:</label>
            <input type="text" name="numero" value={fornecedor.numero} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="text-gray-700">Bairro:</label>
            <input type="text" name="bairro" value={fornecedor.bairro} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="text-gray-700">Município:</label>
            <input type="text" name="municipio" value={fornecedor.municipio} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="text-gray-700">UF:</label>
            <input type="text" name="uf" value={fornecedor.uf} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="text-gray-700">Telefone:</label>
            <InputMask 
              mask="(99) 99999-9999" 
              type="text" 
              name="telefone" 
              value={fornecedor.telefone} 
              onChange={handleChange} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-gray-700">E-mail:</label>
            <input type="email" name="email" value={fornecedor.email} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400" />
          </div>

          <div>
            <label>Status:</label>
            <select name="status" value={fornecedor.status} onChange={handleChange} className="w-full max-w-full p-2 border rounded">
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
        
        </div>
        <div className="flex justify-end mt-6">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2">Salvar</button>
          <button type="button" onClick={() => navigate("/Visualizar_Fornecedores")} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">Cancelar</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
