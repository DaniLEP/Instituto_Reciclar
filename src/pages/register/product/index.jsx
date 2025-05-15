import { useState, useEffect } from "react";
import { db } from "../../../../firebase";
import { ref, set, get } from "firebase/database";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button/button";

export default function CadProdutos() {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [marca, setMarca] = useState("");
  const [supplier, setSupplier] = useState("");
  const [peso, setPeso] = useState("");
  const [unitMeasure, setUnitMeasure] = useState("Selecionar");
  const [unit, setUnit] = useState("Selecionar");
  const [category, setCategory] = useState("Selecionar Categoria");
  const [tipo, setTipo] = useState("Selecionar Tipo");
  const [saveLoading, setSaveLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const suppliersRef = ref(db, "CadastroFornecedores");
        const snapshot = await get(suppliersRef);
        if (snapshot.exists()) {
          setSuppliers(Object.values(snapshot.val()));
        } else {toast.warn("Nenhum fornecedor encontrado!");}
      } catch (error) {toast.error("Erro ao carregar fornecedores!"); }};
    fetchSuppliers();
  }, []);

  const formatCNPJ = (cnpj) => {
    return cnpj?.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  };

  const formatPhone = (phone) => {
    return phone?.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  };

  const filteredSuppliers = suppliers.filter((sup) =>
    (sup.razaoSocial?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (sup.cnpj?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const handleSave = async () => {
    if (!sku || !name || !marca || !supplier || !peso || unitMeasure === "Selecionar" || unit === "Selecionar") {
      toast.error("Por favor, preencha todos os campos obrigatórios!");
      return;
    } setSaveLoading(true);

    const newProduct = {sku, name, marca, supplier, peso, unitMeasure, unit, category, tipo,};

    const newProductRef = ref(db, "EntradaProdutos/" + sku);

    try {await set(newProductRef, newProduct);
      toast.success("Produto salvo com sucesso!");
      handleClearFields();
    } catch (err) {toast.error("Erro ao salvar o produto: " + err.message);
    } finally {setSaveLoading(false);}
  };

  const handleClearFields = () => {setSku(""); setName(""); setMarca(""); setSupplier(""); setPeso(""); setUnitMeasure("Selecionar"); setUnit("Selecionar"); setCategory("Selecionar Categoria"); setTipo("Selecionar Tipo");};

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
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded-lg">
            <option disabled>Selecionar Categoria</option>
            <option value="Proteina">Proteína</option>
            <option value="Mantimento">Mantimento</option>
            <option value="Hortifrut">Hortifrut</option>
            <option value="Doações">Doações</option>
            <option value="Produtos de Limpeza">Produtos de Limpeza</option>
          </select>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full p-2 border rounded-lg">
            <option disabled>Selecionar Tipo</option>
            <option value="Aves">Aves</option>
            <option value="Suínos">Suínos</option>
            <option value="Bovinos">Bovinos</option>
            <option value="Pescados">Pescados</option>
            <option value="Frutas">Frutas</option>
            <option value="Legumes">Legumes</option>
            <option value="Verduras">Verduras</option>
            <option value="ProdutosConsumo">Produtos de Consumo</option>
            <option value="ProdutosLimpeza">Produtos de Limpeza</option>
          </select>
          <select value={unitMeasure} onChange={(e) => setUnitMeasure(e.target.value)} className="w-full p-2 border rounded-lg">
            <option disabled value="Selecionar">Selecione a Unidade de Medida</option>
            <option value="g">Gramas</option>
            <option value="kg">Quilos</option>
            <option value="ml">Mililitros</option>
          </select>
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full p-2 border rounded-lg">
            <option disabled value="Selecionar">Selecionar Unidade</option>
            <option value="un">Unidade</option>
            <option value="fd">Fardo</option>
          </select>
        </div>
        <div className="flex justify-between mt-6">
          <Button onClick={handleSave} disabled={saveLoading}
            className="bg-blue-600 w-[200px] text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700">{saveLoading ? "Salvando..." : "Salvar"}</Button>
          <Button onClick={() => navigate(-1)} className="bg-gray-500 w-[200px] text-white py-2 px-6 rounded-lg shadow-md hover:bg-gray-600">Voltar</Button>
        </div>
      </div>

      {/* Modal Fornecedores */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-6 md:p-8 overflow-hidden">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Selecione um Fornecedor</h2>
            <div className="mb-4">
              <input type="text" placeholder="Buscar por Razão Social ou CNPJ..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="overflow-x-auto max-h-[50vh]">
              <table className="min-w-full text-sm text-gray-700 border rounded-lg">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="p-3 text-center">CNPJ</th>
                    <th className="p-3 text-center">Razão Social</th>
                    <th className="p-3 text-center">Telefone</th>
                    <th className="p-3 text-center">E-mail</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.map((sup) => (
                    <tr key={sup.cnpj} className="hover:bg-gray-50 transition">
                      <td className="p-3 text-center">{formatCNPJ(sup.cnpj)}</td>
                      <td className="p-3 text-center">{sup.razaoSocial}</td>
                      <td className="p-3 text-center">{formatPhone(sup.telefone)}</td>
                      <td className="p-3 text-center">{sup.email}</td>
                      <td className={`p-3 text-center font-medium ${sup.status === "Ativo" ? "text-green-600" : "text-red-600"}`}>{sup.status}</td>
                      <td className="p-3 text-center">
                        <Button onClick={() => {setSupplier(sup.razaoSocial); setModalOpen(false);}} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-xs transition">
                          Selecionar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button onClick={() => navigate("/Cadastro_Fornecedor")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md w-full sm:w-auto transition">Novo Fornecedor +</Button>
              <Button
                onClick={() => setModalOpen(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md w-full sm:w-auto transition" >Fechar</Button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

