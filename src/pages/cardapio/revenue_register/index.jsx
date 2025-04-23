import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, push, update } from "firebase/database";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../../../components/ui/Button/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export default function CadastroRefeicoes() {
  // Definindo estado para o campo de data de refeição
  const [formData, setFormData] = useState({
    dataRefeicao: "", // Define a data atual
    cafeDescricao: "", cafeTotalQtd: "",cafeFuncionariosQtd: "",cafeJovensQtd: "",almocoDescricao: "",almocoTotalQtd: "", almocoFuncionariosQtd: "",almocoJovensQtd: "", lancheDescricao: "",lancheTotalQtd: "", lancheFuncionariosQtd: "", lancheJovensQtd: "", outrasDescricao: "",outrasTotalQtd: "", outrasFuncionariosQtd: "", outrasJovensQtd: "", sobrasDescricao: "", observacaoDescricao: "", desperdicioQtd: "",
  });

  const [refeicoes, setRefeicoes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {const refeicoesRef = ref(database, "refeicoesServidas");
    get(refeicoesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {const refeicoesData = [];
          snapshot.forEach((childSnapshot) => {refeicoesData.push({key: childSnapshot.key, ...childSnapshot.val()});}); 
          setRefeicoes(refeicoesData);
        } else {console.log("Nenhuma refeição encontrada");}
      }).catch((error) => {console.error("Erro ao ler dados do Firebase:", error);});
  }, []);
  const calcularTotal = (total, funcionarios, jovens = 0) => {
    return Math.max(0, total - funcionarios - jovens);
  };

  const handleChange = (e) => {
  const { id, value } = e.target;

    // Verifica se o campo é uma descrição e atualiza o valor
    if (id.includes("Descricao")) {
      setFormData((prev) => ({...prev, [id]: value,}));
    } else {const valorNumerico = parseInt(value) || 0;
      // Atualiza os campos numéricos com o valor calculado
      setFormData((prev) => {
        const novoEstado = { ...prev, [id]: valorNumerico };
  
        // Cálculo correto para jovens tarde
        if (id === "cafeTotalQtd" || id === "cafeFuncionariosQtd") 
          {novoEstado.cafeJovensQtd = calcularTotal(novoEstado.cafeTotalQtd || 0, novoEstado.cafeFuncionariosQtd || 0);
        } else if (id === "almocoTotalQtd" || id === "almocoFuncionariosQtd" || id === "almocoJovensQtd")
          {novoEstado.almocoJovensTardeQtd = calcularTotal(novoEstado.almocoTotalQtd || 0, novoEstado.almocoFuncionariosQtd || 0, novoEstado.almocoJovensQtd || 0);
        } else if (id === "lancheTotalQtd" || id === "lancheFuncionariosQtd" ) 
          {novoEstado.lancheJovensQtd = calcularTotal(novoEstado.lancheTotalQtd || 0, novoEstado.lancheFuncionariosQtd || 0,);
        } else if (id === "outrasTotalQtd" || id === "outrasFuncionariosQtd" || id === "outrasJovensQtd") 
          {novoEstado.outrasJovensTardeQtd = calcularTotal(novoEstado.outrasTotalQtd || 0, novoEstado.outrasFuncionariosQtd || 0, novoEstado.outrasJovensQtd || 0);}

        return novoEstado;
      });
    }
  };

  // Atualizando a função handleChange para capturar a data manualmente
  const handleDateChange = (e) => {setFormData((prev) => ({...prev, dataRefeicao: e.target.value }));};// Aqui a data é capturada diretamente do input
  const handleBack = () => {navigate(-1); }; // Navega para a página anterior

  const salvarNoBanco = () => {
    const refeicaoData = {dataRefeicao: formData.dataRefeicao, cafeDescricao: formData.cafeDescricao, cafeTotalQtd: formData.cafeTotalQtd, cafeFuncionariosQtd: formData.cafeFuncionariosQtd, cafeJovensQtd: formData.cafeJovensQtd, almocoDescricao: formData.almocoDescricao, almocoTotalQtd: formData.almocoTotalQtd, almocoFuncionariosQtd: formData.almocoFuncionariosQtd, almocoJovensQtd: formData.almocoJovensQtd, almocoJovensTardeQtd: formData.almocoJovensTardeQtd, lancheDescricao: formData.lancheDescricao, lancheTotalQtd: formData.lancheTotalQtd, lancheFuncionariosQtd: formData.lancheFuncionariosQtd,  lancheJovensQtd: formData.lancheJovensQtd,outrasDescricao: formData.outrasDescricao, outrasTotalQtd: formData.outrasTotalQtd, outrasFuncionariosQtd: formData.outrasFuncionariosQtd, outrasJovensQtd: formData.outrasJovensQtd, outrasJovensTardeQtd: formData.outrasJovensTardeQtd,  sobrasDescricao: formData.sobrasDescricao,observacaoDescricao: formData.observacaoDescricao, desperdicioQtd: formData.desperdicioQtd};

    const newRefeicaoKey = push(ref(database, "refeicoesServidas")).key;
    const updates = {}; updates[`/refeicoesServidas/${newRefeicaoKey}`] = refeicaoData;

    update(ref(database), updates)
      .then(() => {
        toast.success("Refeições salvas com sucesso!", {position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored"});
        setFormData({ dataRefeicao: "", cafeDescricao: "",cafeTotalQtd: "", cafeFuncionariosQtd: "", cafeJovensQtd: "", almocoDescricao: "", almocoTotalQtd: "", almocoFuncionariosQtd: "",  almocoJovensQtd: "",  almocoJovensTardeQtd: "", lancheDescricao: "", lancheTotalQtd: "", lancheFuncionariosQtd: "", lancheJovensQtd: "", outrasDescricao: "", outrasTotalQtd: "", outrasFuncionariosQtd: "",  outrasJovensQtd: "", outrasJovensTardeQtd: "", sobrasDescricao: "", observacaoDescricao: "", desperdicioQtd: ""});
      })
      .catch((error) => {console.error("Erro ao salvar refeição:", error);
        toast.error("Erro ao salvar refeição. Tente novamente.", {position: "top-right", autoClose: 3000, closeOnClick: true, hideProgressBar: false, pauseOnHover: true, draggable: true, transition: "fade"});
      });
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 to-gray-800 px-4 py-10 sm:px-8 md:px-16 lg:px-24 font-sans min-h-screen">
    <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6">Cadastro de Refeições</h2>
    <section className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg w-full max-w-7xl mx-auto">
      <div className="mb-6">
        <Button type="button" onClick={handleBack} className="w-full py-4 bg-[#F20DE7] text-white rounded-lg font-semibold text-base sm:text-lg transition duration-300 hover:bg-[#d10ba1]">Voltar</Button>
        <Label className="block text-base sm:text-lg font-semibold mt-4">Data da Refeição</Label>
        <Input type="date" id="dataRefeicao" value={formData.dataRefeicao} onChange={handleDateChange} className="w-full p-4 mt-2 border border-gray-300 rounded-lg text-base" />
      </div>
          {/* Café da Manhã */}
      <div className="mb-6">
        <h3 className="text-xl text-gray-800">Café da Manhã</h3>
        <textarea id="cafeDescricao" value={formData.cafeDescricao} onChange={handleChange} placeholder="Descrição..."
          className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-36 resize-y" />
          <div className="flex items-center mt-4 space-x-4">
            <Label className="font-semibold text-lg">Total:</Label>
            <Input type="number" id="cafeTotalQtd" value={formData.cafeTotalQtd} onChange={handleChange}
              className="p-4 text-lg w-1/2 border border-gray-300 rounded-lg" />
            <Label className="font-semibold text-lg">Funcionários:</Label>
            <Input type="number" id="cafeFuncionariosQtd" value={formData.cafeFuncionariosQtd} onChange={handleChange}
              className="p-4 text-lg w-1/2 border border-gray-300 rounded-lg" />
          </div>
          <div className="mt-4">
            <Label className="font-semibold text-lg">Jovens Manhã:</Label>
            <Input type="number" id="cafeJovensQtd" value={formData.cafeJovensQtd} onChange={handleChange}
              className="p-4 text-lg w-full border border-gray-300 rounded-lg" disabled />
          </div>
          </div>
          {/* Almoço */}
          <div className="mb-6">
            <h3 className="text-xl text-gray-800">Almoço</h3>
            <textarea id="almocoDescricao" value={formData.almocoDescricao} onChange={handleChange} placeholder="Descrição..."
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-36 resize-y" />
            <div className="flex items-center mt-4 space-x-4">
              <Label className="font-semibold text-lg">Total:</Label>
              <Input type="number" id="almocoTotalQtd" value={formData.almocoTotalQtd} onChange={handleChange}
                className="p-4 text-lg w-1/2 border border-gray-300 rounded-lg" />
              <Label className="font-semibold text-lg">Funcionários:</Label>
              <Input type="number" id="almocoFuncionariosQtd" value={formData.almocoFuncionariosQtd} onChange={handleChange}
                className="p-4 text-lg w-1/2 border border-gray-300 rounded-lg" />
            </div>
            <div className="mt-4">
              <Label className="font-semibold text-lg">Jovens Manhã:</Label>
              <Input type="number" id="almocoJovensQtd" value={formData.almocoJovensQtd} onChange={handleChange}
                className="p-4 text-lg w-full border border-gray-300 rounded-lg" />
            </div>
            <div className="mt-4">
              <Label className="font-semibold text-lg">Jovens Tarde:</Label>
              <Input type="number" id="almocoJovensTardeQtd" value={formData.almocoJovensTardeQtd} onChange={handleChange}
                className="p-4 text-lg w-full border border-gray-300 rounded-lg" disabled />
            </div>
          </div>
          {/* Lanche da Tarde */}
          <div className="mb-6">
            <h3 className="text-xl text-gray-800">Lanche da Tarde</h3>
            <textarea id="lancheDescricao" value={formData.lancheDescricao} onChange={handleChange} placeholder="Descrição..."
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-36 resize-y" />
            <div className="flex items-center mt-4 space-x-4">
              <Label className="font-semibold text-lg">Total:</Label>
              <Input type="number" id="lancheTotalQtd" value={formData.lancheTotalQtd} onChange={handleChange}
                className="p-4 text-lg w-1/2 border border-gray-300 rounded-lg" />
              <Label className="font-semibold text-lg">Funcionários:</Label>
              <Input type="number" id="lancheFuncionariosQtd" value={formData.lancheFuncionariosQtd} onChange={handleChange}
                className="p-4 text-lg w-1/2 border border-gray-300 rounded-lg" />
            </div>
            <div className="mt-4">
              <Label className="font-semibold text-lg">Jovens Tarde:</Label>
              <Input type="number" id="lancheJovensQtd" value={formData.lancheJovensQtd} onChange={handleChange}
                className="p-4 text-lg w-full border border-gray-300 rounded-lg" disabled />
            </div>
          </div>
          {/* Outras Refeições */}
          <div className="mb-6">
            <h3 className="text-xl text-gray-800">Outras Refeições</h3>
            <textarea id="outrasDescricao" value={formData.outrasDescricao} onChange={handleChange} placeholder="Descrição..."
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-36 resize-y" />
            <div className="flex items-center mt-4 space-x-4">
              <Label className="font-semibold text-lg">Total:</Label>
              <Input type="number" id="outrasTotalQtd" value={formData.outrasTotalQtd} onChange={handleChange}
                className="p-4 text-lg w-1/2 border border-gray-300 rounded-lg" />
              <Label className="font-semibold text-lg">Funcionários:</Label>
              <Input type="number" id="outrasFuncionariosQtd" value={formData.outrasFuncionariosQtd} onChange={handleChange}
                className="p-4 text-lg w-1/2 border border-gray-300 rounded-lg" />
            </div>
            <div className="mt-4">
              <Label className="font-semibold text-lg">Jovens Manhã:</Label>
              <Input type="number" id="outrasJovensQtd" value={formData.outrasJovensQtd} onChange={handleChange} 
                className="p-4 text-lg w-full border border-gray-300 rounded-lg" />
            </div>
            <div className="mt-4">
              <Label className="font-semibold text-lg">Jovens Tarde:</Label>
              <Input type="number" id="outrasJovensTardeQtd" value={formData.outrasJovensTardeQtd} onChange={handleChange}
                className="p-4 text-lg w-full border border-gray-300 rounded-lg" disabled />
            </div>
          </div>
          {/* Sobras */}
          <div className="mb-6">
            <h3 className="text-xl text-gray-800">Sobras</h3>
            <textarea id="sobrasDescricao" value={formData.sobrasDescricao} onChange={handleChange} placeholder="Descrição..."
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg" />
          </div>
          {/* Observações */}
          <div className="mb-6">
            <h3 className="text-xl text-gray-800">Observações</h3>
            <textarea id="observacaoDescricao" value={formData.observacaoDescricao} onChange={handleChange} placeholder="Descrição..."
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg" />
          </div>
          {/* Desperdícios */}
          <div className="mb-6">
            <h3 className="text-xl text-gray-800">Desperdícios</h3>
            <Input type="number" id="desperdicioQtd" value={formData.desperdicioQtd} placeholder="KG" onChange={handleChange}
              className="w-full p-4 mt-2 text-lg border border-gray-300 rounded-lg" />
          </div>
          <Button onClick={salvarNoBanco} className="bg-blue-600  w-full text-white py-6 px-8 rounded-lg shadow-md hover:bg-blue-700">Salvar Refeição</Button>
        </section>
        <ToastContainer />
      </div>
    );
}
