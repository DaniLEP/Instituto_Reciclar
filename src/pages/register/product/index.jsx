import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table/table";
import { Button } from "@/components/ui/Button/button";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.firebasestorage.app",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function CadProdutos() {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [marca, setMarca] = useState("");
  const [supplier, setSupplier] = useState("");
  const [peso, setPeso] = useState("");
  const [category, setCategory] = useState("");
  const [tipo, setTipo] = useState("");
  const [unit, setUnit] = useState("");
  const [unitMeasure, setUnitMeasure] = useState("g");
  const [saveLoading, setSaveLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const suppliersRef = ref(db, "CadastroFornecedores");
        const snapshot = await get(suppliersRef);
        if (snapshot.exists()) {setSuppliers(Object.values(snapshot.val()));} 
        else {toast.warn("Nenhum fornecedor encontrado!");}
      } 
        catch (error) {toast.error("Erro ao carregar fornecedores!");}
    };
    fetchSuppliers();
  }, []);

  const handleSave = async () => {
    if (!sku || !name || !marca || !supplier || !peso || !unitMeasure || !unit || !category || !tipo) {
      toast.error("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    setSaveLoading(true);
    const newProduct = { sku, name, marca, supplier, peso, unitMeasure, unit, category, tipo };
    const newProductRef = ref(db, "EntradaProdutos/" + sku);

    set(newProductRef, newProduct)
      .then(() => {toast.success("Produto salvo com sucesso!"); handleClearFields();})
      .catch((err) => {toast.error("Erro ao salvar o produto: " + err.message);}) 
      .finally(() => setSaveLoading(false));
  };

  const handleClearFields = () => {setSku(""); setName(""); setMarca(""); setSupplier(""); setPeso(""); setUnitMeasure("g"); setUnit(""); setCategory(""); setTipo("");};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-gray-800 p-6">
      <div className="bg-white p-9 rounded-lg shadow-lg w-full max-w-6xl">
        <h1 className="text-center text-4xl font-bold text-gray-700 mb-6">Cadastro de Produtos</h1>
        <div className="grid grid-cols-2 gap-4">
          <Input className="p-5" placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
          <Input className="p-5" placeholder="Nome do Produto" value={name} onChange={(e) => setName(e.target.value)} />
          <Input className="p-5" placeholder="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} />
          <Input className="p-5" placeholder="Fornecedor" value={supplier} onClick={() => setModalOpen(true)} readOnly />
          <Input className="p-5" placeholder="Peso" value={peso} onChange={(e) => setPeso(e.target.value)} />
          <select value={unitMeasure} onChange={(e) => setUnitMeasure(e.target.value)} className="w-full max-w-full p-2 border rounded-lg">
            <option value="g">Gramas</option>
            <option value="kg">Quilos</option>
          </select>
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full max-w-full p-2 border rounded-lg">
            <option value="un">Unidade</option>
            <option value="fd">Fardo</option>
          </select>
        </div>
        <div className="flex justify-between mt-6">
          <Button onClick={handleSave} disabled={saveLoading} className="bg-blue-600  w-[200px] text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700">
            {saveLoading ? "Salvando..." : "Salvar"}
          </Button>
          <Button onClick={() => navigate(-1)} className="bg-gray-500 w-[200px] text-white py-2 px-6 rounded-lg shadow-md hover:bg-gray-600">
            Voltar
          </Button>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Selecione um Fornecedor</h2>
            <Table>
          <thead>
            <tr>
            <th className="p-3 text-center">CNPJ</th>
              <th className="p-3 text-center">Razão Social</th>
              <th className="p-3 text-center">Telefone</th>
              <th className="p-3 text-center">E-mail</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((sup, index) => (
              <tr key={sup.razaoSocial}>
                 <td className="p-3">{sup.cnpj}</td>
                  <td className="p-3">{sup.razaoSocial}</td>
                  <td className="p-3">{sup.telefone}</td>
                  <td className="p-3">{sup.email}</td>
                  <td className={`p-3 font-semibold ${sup.status === "Ativo" ? "text-green-600" : "text-red-600"}`}>{sup.status} </td>
              </tr>
            ))}
          </tbody>
        </Table>
            <Button onClick={() => setModalOpen(false)} className="mt-4 bg-red-500 text-white py-1 px-4 rounded w-full">Fechar</Button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
