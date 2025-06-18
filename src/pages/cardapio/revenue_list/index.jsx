import { useEffect, useState } from "react";
import { getDatabase, ref, get, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table/table";
import { getApps, initializeApp } from "firebase/app";
import { Button } from "@/components/ui/Button/button";
import { Label } from "@radix-ui/react-label";
import { ArrowLeft } from "lucide-react";

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
const database = getDatabase(app);

export default function ExibirRefeicoes() {
  const [refeicoes, setRefeicoes] = useState([]);
  const [filtroInicio, setFiltroInicio] = useState("");
  const [filtroFim, setFiltroFim] = useState("");
  const [valorEditado, setValorEditado] = useState("");
  const [editando, setEditando] = useState(null);
  const navigate = useNavigate();

  const formatDate = (timestamp) => {
    if (!timestamp) return "Data inválida";
    let date = typeof timestamp === "string" ? new Date(Date.parse(timestamp)) : new Date(timestamp);
    if (isNaN(date.getTime())) return "Data inválida";
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const day = String(localDate.getDate()).padStart(2, "0");
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const year = localDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const refeicoesRef = ref(database, "refeicoesServidas");
    get(refeicoesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = [];
        snapshot.forEach((child) => {
          const item = child.val();
          data.push({
            key: child.key,
            dataRefeicao: formatDate(item.dataRefeicao),
            dataRefeicaoObj: new Date(item.dataRefeicao),
            ...item,
          });
        });
        setRefeicoes(data);
      }
    });
  }, []);

  const handleDoubleClick = (id, field, value) => {
    setEditando({ id, field });
    setValorEditado(value);
  };

  const handleChange = (e) => setValorEditado(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const refeicaoRef = ref(database, `refeicoesServidas/${editando.id}`);
      update(refeicaoRef, { [editando.field]: valorEditado }).then(() => {
        setRefeicoes((prev) =>
          prev.map((item) =>
            item.key === editando.id ? { ...item, [editando.field]: valorEditado } : item
          )
        );
        setEditando(null);
      });
    }
  };

  const handleBlur = () => {
    const refeicaoRef = ref(database, `refeicoesServidas/${editando.id}`);
    update(refeicaoRef, { [editando.field]: valorEditado }).then(() => setEditando(null));
  };

  const resetTime = (date) => {
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const filtrarRefeicoes = () => {
    const inicio = filtroInicio ? resetTime(new Date(filtroInicio)) : null;
    const fim = filtroFim ? resetTime(new Date(filtroFim)) : null;
    setRefeicoes((prev) =>
      prev.filter(({ dataRefeicaoObj }) => {
        const data = resetTime(new Date(dataRefeicaoObj));
        return (!inicio || data >= inicio) && (!fim || data <= fim);
      })
    );
  };

  const limparFiltros = () => {
    setFiltroInicio("");
    setFiltroFim("");
    const refeicoesRef = ref(database, "refeicoesServidas");
    get(refeicoesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = [];
        snapshot.forEach((child) => {
          const item = child.val();
          data.push({
            key: child.key,
            dataRefeicao: formatDate(item.dataRefeicao),
            dataRefeicaoObj: new Date(item.dataRefeicao),
            ...item,
          });
        });
        setRefeicoes(data);
      }
    });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(refeicoes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Refeições");
    XLSX.writeFile(workbook, "Refeicoes.xlsx");
  };

  const headers = [
    "Data Refeição",
    "Café Descrição", "Café Total (kg)", "Café Funcionários", "Café Turma Manhã",
    "Almoço Descrição", "Almoço Total (kg)", "Almoço Funcionários", "Almoço Turma Manhã", "Almoço Turma Tarde",
    "Lanche Descrição", "Lanche Total (kg)", "Lanche Funcionários", "Lanche Turma Tarde",
    "Outras Descrição", "Outras Ref. Total (kg)", "Outras Ref. Funcionários", "Outras Ref. Turma Manhã", "Outras Ref. Turma Tarde",
    "Sobras", "Observação", "Desperdícios (kg)"
  ];

  const fields = [
    "dataRefeicao", "cafeDescricao", "cafeTotalQtd", "cafeFuncionariosQtd", "cafeJovensQtd",
    "almocoDescricao", "almocoTotalQtd", "almocoFuncionariosQtd", "almocoJovensQtd", "almocoJovensTardeQtd",
    "lancheDescricao", "lancheTotalQtd", "lancheFuncionariosQtd", "lancheJovensQtd",
    "outrasDescricao", "outrasTotalQtd", "outrasFuncionariosQtd", "outrasJovensQtd", "outrasJovensTardeQtd",
    "sobrasDescricao", "observacaoDescricao", "desperdicioQtd"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-sky-700 text-white p-4 sm:p-6 md:p-10">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-gray-800 overflow-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-indigo-900">🍽️ Refeições Cadastradas</h2>

        <div className="flex flex-wrap gap-4 justify-center mb-6">
          {[{ label: 'Data Início', value: filtroInicio, setValue: setFiltroInicio }, { label: 'Data Fim', value: filtroFim, setValue: setFiltroFim }].map(({ label, value, setValue }, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center gap-2">
              <Label className="text-sm font-semibold text-indigo-800">{label}:</Label>
              <Input
                type="date"
                className="rounded-xl border border-gray-300 px-4 py-2 text-gray-800 shadow-sm"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          ))}
          <Button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-white font-semibold shadow-md" onClick={filtrarRefeicoes}>🔍 Filtrar</Button>
          <Button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-white font-semibold shadow-md" onClick={limparFiltros}>❌ Limpar</Button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <Button className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl text-white font-semibold shadow-md" onClick={exportToExcel}>📁 Exportar Excel</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl text-white font-semibold shadow-md" onClick={() => navigate(-1)}>  <ArrowLeft className="mr-2" size={20} /> Voltar</Button>
        </div>

        <div className="overflow-auto rounded-xl border border-gray-300 shadow">
          <Table className="min-w-full text-sm text-center">
            <thead className="bg-indigo-800 text-white">
              <tr>
                {headers.map((header, i) => (
                  <th key={i} className="px-4 py-3 border border-indigo-200 font-semibold whitespace-nowrap">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {refeicoes.map((refeicao) => (
                <tr key={refeicao.key} className="odd:bg-gray-50 even:bg-gray-100 hover:bg-indigo-100 transition-colors">
                  {fields.map((field) => (
                    <td
                      key={field}
                      className="border border-gray-200 px-3 py-2 text-gray-800 cursor-pointer whitespace-nowrap"
                      onDoubleClick={() => handleDoubleClick(refeicao.key, field, refeicao[field])}
                    >
                      {editando?.id === refeicao.key && editando.field === field ? (
                        <Input
                          type="text"
                          value={valorEditado}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          onBlur={handleBlur}
                          autoFocus
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm shadow-sm"
                        />
                      ) : field === "dataRefeicao" ? (
                        formatDate(refeicao[field])
                      ) : (
                        refeicao[field]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}