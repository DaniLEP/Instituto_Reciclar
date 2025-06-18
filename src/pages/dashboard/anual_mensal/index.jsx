// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, set } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
//   authDomain: "bancoestoquecozinha.firebaseapp.com",
//   databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
//   projectId: "bancoestoquecozinha",
//   storageBucket: "bancoestoquecozinha.appspot.com",
//   messagingSenderId: "71775149511",
//   appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
// };

// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);
//  export default function AutoExcelUploader() {
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [status, setStatus] = useState("");
//   const handleFile = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setStatus("Lendo planilha...");
//     const data = await file.arrayBuffer();
//     const workbook = XLSX.read(data);
//     const sheetNames = workbook.SheetNames;
//     const totalSheets = sheetNames.length;
//     let uploaded = 0;
// for (const sheetName of sheetNames) {
//   const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
//   const sanitizedSheetName = sanitizePath(sheetName); // <- aqui
//   if (jsonData.length === 0) {
//     uploaded++;
//     setUploadProgress(Math.round((uploaded / totalSheets) * 100));
//     continue;
//   }
//   try {
//     const sheetRef = ref(database, `RelatoriosPeriodico/${sanitizedSheetName}`);
//     await set(sheetRef, jsonData);
//     uploaded++;
//     setUploadProgress(Math.round((uploaded / totalSheets) * 100));
//   } catch (error) {
//     console.error(`Erro ao subir ${sheetName}`, error);
//   }
// }
//     setStatus("Upload finalizado!");
//   };
// // Função para limpar o nome da aba e gerar um path válido
// const sanitizePath = (sheetName) => {
//   return sheetName
//     .replace(/[.#$[\]]/g, "")   // remove caracteres proibidos
//     .replace(/\s+/g, "_")       // troca espaços por underscore
//     .trim();                    // remove espaços no final/início
// };
//   return (
//     <div className="p-6 space-y-4 max-w-xl mx-auto">
//       <h2 className="text-xl font-bold">Upload Automático de Excel</h2>
//       <input
//         type="file"
//         accept=".xlsx, .xls"
//         onChange={handleFile}
//         className="p-2 border rounded w-full"
//       />
//       <div className="w-full h-4 bg-gray-200 rounded overflow-hidden">
//         <div
//           className="h-full bg-blue-600 transition-all duration-300"
//           style={{ width: `${uploadProgress}%` }}
//         />
//       </div>
//       <p className="text-sm text-gray-700">
//         {status} {uploadProgress > 0 && `${uploadProgress}%`}
//       </p>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase";
import { ref, get } from "firebase/database";
import { Bar } from "react-chartjs-2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

export default function Anual() {
  const [relatorios, setRelatorios] = useState({});
  const [selected, setSelected] = useState("");
  const [dados, setDados] = useState([]);
  const [filtros, setFiltros] = useState({ ano: "", mes: "", min: "", max: "" });

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await get(ref(db, "RelatoriosPeriodico"));
      if (snapshot.exists()) {
        const data = snapshot.val();
        setRelatorios(data);
        const firstKey = Object.keys(data)[0];
        setSelected(firstKey);
        setDados(data[firstKey]);
      }
    };
    fetchData();
  }, []);

  const handleSelect = (key) => {
    setSelected(key);
    setDados(relatorios[key]);
  };

  const anos = [...new Set(dados.map(d => d.Ano))].filter(Boolean);
  const meses = [...new Set(dados.map(d => d.Mês))].filter(Boolean);

  const dadosFiltrados = dados.filter((d) => {
    const dentroAno = filtros.ano ? d.Ano == filtros.ano : true;
    const dentroMes = filtros.mes ? d.Mês === filtros.mes : true;
    const dentroMin = filtros.min ? Object.values(d).some(v => typeof v === "number" && v >= filtros.min) : true;
    const dentroMax = filtros.max ? Object.values(d).some(v => typeof v === "number" && v <= filtros.max) : true;
    return dentroAno && dentroMes && dentroMin && dentroMax;
  });

  const chartKeys = dadosFiltrados.length
    ? Object.keys(dadosFiltrados[0]).filter(k => typeof dadosFiltrados[0][k] === "number")
    : [];

  const exportarParaExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dadosFiltrados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, selected);
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `${selected}-filtrado.xlsx`);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold">📊 Relatórios com Filtros</h1>

      <div className="flex flex-wrap gap-2">
        {Object.keys(relatorios).map((key) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            className={`px-4 py-2 rounded ${selected === key ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {key.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <select onChange={(e) => setFiltros({ ...filtros, ano: e.target.value })} value={filtros.ano} className="border rounded p-2">
          <option value="">Ano</option>
          {anos.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>

        <select onChange={(e) => setFiltros({ ...filtros, mes: e.target.value })} value={filtros.mes} className="border rounded p-2">
          <option value="">Mês</option>
          {meses.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        <input type="number" placeholder="Mínimo" className="border rounded p-2" value={filtros.min} onChange={(e) => setFiltros({ ...filtros, min: e.target.value })} />
        <input type="number" placeholder="Máximo" className="border rounded p-2" value={filtros.max} onChange={(e) => setFiltros({ ...filtros, max: e.target.value })} />
      </div>

      <button
        onClick={exportarParaExcel}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        ⬇️ Exportar dados visíveis
      </button>

      <div className="space-y-10">
        {chartKeys.map((campo, index) => {
          const chartData = {
            labels: dadosFiltrados.map((_, i) => `Item ${i + 1}`),
            datasets: [
              {
                label: campo,
                data: dadosFiltrados.map((item) => item[campo]),
                backgroundColor: `rgba(${100 + index * 40}, 99, 255, 0.6)`
              }
            ]
          };

          const options = {
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: campo }
            },
            animation: {
              duration: 800,
              easing: "easeOutQuart"
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          };

          return (
            <div key={campo}>
              <Bar data={chartData} options={options} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
