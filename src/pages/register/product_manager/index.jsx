import { useState, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app"; // ✅ Aqui
import { getDatabase, ref, update, onValue } from "firebase/database";
import { toast, ToastContainer } from "react-toastify";
import debounce from "lodash.debounce";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "../../../components/ui/Button/return/return";
import { Table } from "../../../components/ui/table/table";
import SearchInput from "../../../components/ui/input/searchInput";
import SearchWrapper from "../../../components/ui/input/searchW";
import { Button } from "../../../components/ui/Button/button";
import Overlay from "../../../components/ui/overlay";
import Title from "../../../components/ui/title";
import { Input } from "../../../components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

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

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

function Gerenciador() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const dbRef = ref(db, "EntradaProdutos");
    onValue(dbRef, (snapshot) => {
      setLoading(false);
      const data = snapshot.val();
      if (data) {const loadedProducts = Object.keys(data).map((key) => ({ ...data[key], id: key }));setProducts(loadedProducts);}
    });
  }, []);

  const handleSearchChange = debounce((value) => {setSearchTerm(value);}, 500);
  const filteredProducts = products.filter((product) => {
    return (
      (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.supplier && product.supplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.tipo && product.tipo.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const openModal = (product) => {setEditingProduct(product);setIsModalOpen(true);};
  const closeModal = () => {setEditingProduct(null); setIsModalOpen(false);};
  const handleUpdate = () => {
    if (editingProduct) {
      const productRef = ref(db, `EntradaProdutos/${editingProduct.id}`);
      update(productRef, editingProduct)
        .then(() => {toast.success("Produto atualizado com sucesso!"); closeModal();})
        .catch((error) => {toast.error("Erro ao atualizar: " + error.message);});
    }
  };

  const handleInputChange = (e) => {
  const { name, value } = e.target; setEditingProduct({ ...editingProduct, [name]: value });};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-pink-500 p-6 text-white font-roboto">
      <ToastContainer />
      <Title className="text-3xl font-bold text-center mb-6">Cadastro de Produtos</Title>
      <SearchWrapper>
        <SearchInput type="text" placeholder="Filtrar por SKU, Nome, Fornecedor, Categoria ou Tipo..." onChange={(e) => handleSearchChange(e.target.value)}/>
      </SearchWrapper>
      <BackButton className="w-full max-w-sm mx-auto mt-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold transition-colors shadow-md">Voltar</BackButton>
      {loading ? (<div className="text-center text-lg mt-8">Carregando produtos...</div>) : (
        <div className="overflow-x-auto mt-6">
          <Table className="w-full text-center text-sm text-white">
            <thead className="bg-purple-800 text-white text-sm uppercase">
              <tr>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Fornecedor</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Grupo</th>
                <th className="px-4 py-3">Peso (KG)</th>
                <th className="px-4 py-3">Unidade</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-800">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{product.sku}</td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.supplier}</td>
                  <td className="px-4 py-2">{product.tipo}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">{product.peso}</td>
                  <td className="px-4 py-2">{product.unitMeasure}</td>
                  <td className="px-4 py-2">
                    <Button onClick={() => openModal(product)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">
                    <FontAwesomeIcon icon={faPen} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}{isModalOpen && (
        <>
          <Overlay onClick={closeModal} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto">
            <div className="bg-white text-black p-6 rounded-xl max-w-3xl w-full shadow-2xl">
              <h2 className="text-center text-2xl font-bold mb-6 text-purple-700">Atualizar Produto</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input name="name" value={editingProduct.name || ""} onChange={handleInputChange} placeholder="Nome" className="p-3 border border-gray-300 rounded-lg"/>
                <Input name="marca" value={editingProduct.marca || ""} onChange={handleInputChange} placeholder="Marca" className="p-3 border border-gray-300 rounded-lg"/>
                <Input name="supplier"value={editingProduct.supplier || ""} onChange={handleInputChange} placeholder="Fornecedor" className="p-3 border border-gray-300 rounded-lg"/>
                <Input name="peso" value={editingProduct.peso || ""} onChange={handleInputChange} placeholder="Peso" className="p-3 border border-gray-300 rounded-lg"/>
                <select name="unitMeasure" value={editingProduct.unitMeasure || ""} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-lg">
                  <option value="g">Gramas</option>
                  <option value="kg">Quilos</option>
                  <option value="L">Litros</option>
                  <option value="ml">Mili-Litros</option>
                </select>
                <select name="unit" value={editingProduct.unit || ""} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-lg">
                  <option value="un">Unidade</option>
                  <option value="fd">Fardo</option>
                  <option value="cx">Caixa</option>
                </select>
                <select name="category" value={editingProduct.category || ""} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-lg">
                  <option value="Proteína">Proteína</option>
                  <option value="Mantimento">Mantimento</option>
                  <option value="Hortaliças">Hortaliças</option>
                  <option value="Doações">Doações</option>
                </select>
                <select name="tipo" value={editingProduct.tipo || ""} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-lg">
                  <option value="Frutas">Frutas</option>
                  <option value="Legumes">Legumes</option>
                  <option value="Verduras">Verduras</option>
                  <option value="Bovina">Bovina</option>
                  <option value="Ave">Ave</option>
                  <option value="Suína">Suína</option>
                  <option value="Pescado">Pescado</option>
                  <option value="Mercado">Mercado</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button onClick={handleUpdate} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md">Atualizar</Button>
                <Button onClick={closeModal} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md">Fechar</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default Gerenciador;
