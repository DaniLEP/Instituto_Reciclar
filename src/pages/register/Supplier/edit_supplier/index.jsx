import { useEffect, useState } from "react";
import { getDatabase, ref, get, set } from "firebase/database";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import InputMask from "react-input-mask";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/Button/button";

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
    observacoes: "",
    formasPag: "",
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
    setFornecedor((prev) => ({ ...prev, [name]: value }));

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
            <Label className="text-gray-700">CNPJ:</Label>
            <InputMask
              mask="99.999.999/9999-99"
              value={fornecedor.cnpj}
              onChange={handleChange}
            >
              {(inputProps) => <Input {...inputProps} name="cnpj" />}
            </InputMask>
          </div>

          <div>
            <Label className="text-gray-700">Razão Social:</Label>
            <Input type="text" name="razaoSocial" value={fornecedor.razaoSocial} onChange={handleChange} />
          </div>

          <div>
            <Label className="text-gray-700">CEP:</Label>
            <InputMask
              mask="99999-999"
              value={fornecedor.cep}
              onChange={handleChange}
            >
              {(inputProps) => <Input {...inputProps} name="cep" />}
            </InputMask>
          </div>

          <div>
            <Label className="text-gray-700">Endereço:</Label>
            <Input type="text" name="endereco" value={fornecedor.endereco} onChange={handleChange} />
          </div>

          <div>
            <Label className="text-gray-700">Número:</Label>
            <Input type="text" name="numero" value={fornecedor.numero} onChange={handleChange} />
          </div>

          <div>
            <Label className="text-gray-700">Bairro:</Label>
            <Input type="text" name="bairro" value={fornecedor.bairro} onChange={handleChange} />
          </div>

          <div>
            <Label className="text-gray-700">Município:</Label>
            <Input type="text" name="municipio" value={fornecedor.municipio} onChange={handleChange} />
          </div>

          <div>
            <Label className="text-gray-700">UF:</Label>
            <Input type="text" name="uf" value={fornecedor.uf} onChange={handleChange} />
          </div>

          <div>
            <Label className="text-gray-700">Telefone:</Label>
            <InputMask
              mask="(99) 9999-9999"
              value={fornecedor.telefone}
              onChange={handleChange}
            >
              {(inputProps) => <Input {...inputProps} name="telefone" />}
            </InputMask>
          </div>

          <div>
            <Label className="text-gray-700">E-mail:</Label>
            <Input type="email" name="email" value={fornecedor.email} onChange={handleChange} />
          </div>

           <div>
            <Label className="text-gray-700">Formas de Pagamentos:</Label>
            <Input type="text" name="formasPag" value={fornecedor.formasPag} onChange={handleChange} />
          </div>

           <div>
            <Label className="text-gray-700">Observações:</Label>
            <Input type="text" name="observacoes" value={fornecedor.observacoes} onChange={handleChange} />
          </div>

          <div>
            <Label className="text-gray-700">Grupo:</Label>
            <select
              name="grupo"
              value={fornecedor.grupo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecionar Categoria</option>
              <option value="Proteina">Proteína</option>
              <option value="Mantimento">Mantimento</option>
              <option value="Hortifrut">Hortifrut</option>
              <option value="Doações">Doações</option>
              <option value="Produtos de Limpeza">Produtos de Limpeza</option>
            </select>
          </div>

          <div>
            <Label className="text-gray-700">Status:</Label>
            <select
              name="status"
              value={fornecedor.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2">
            Salvar
          </Button>
          <Button
            type="button"
            onClick={() => navigate("/Visualizar_Fornecedores")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Cancelar
          </Button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
