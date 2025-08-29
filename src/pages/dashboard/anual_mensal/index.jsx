"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { db } from "../../../../firebase";
import { ref, get } from "firebase/database";
import { Bar, Line, Pie, Doughnut, Radar } from "react-chartjs-2";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  Filler,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DownloadIcon,
  BarChart3Icon,
  LineChartIcon,
  PieChartIcon,
  RadarIcon,
  FilterIcon,
  RefreshCwIcon,
  DatabaseIcon,
  XIcon,
} from "lucide-react";

ChartJS.register(
  BarElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  Filler,
  ChartDataLabels
);

// Componente de cada gráfico
const ChartCard = React.memo(({ chartType, campo, dadosFiltrados }) => {
  const chartRef = useRef();

  const colors = useMemo(() => {
    const baseColors = [
      "#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6",
      "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1"
    ];
    return dadosFiltrados.map((_, i) => baseColors[i % baseColors.length]);
  }, [dadosFiltrados]);

  const chartData = useMemo(() => ({
    labels: dadosFiltrados.map((item, i) =>
      item.Mês && item.Ano ? `${item.Mês}/${item.Ano}` : `Item ${i + 1}`
    ),
    datasets: [
      {
        label: campo,
        data: dadosFiltrados.map(item => item[campo] ?? 0),
        backgroundColor: chartType === "pie" || chartType === "doughnut" ? colors : colors[0] + "20",
        borderColor: chartType === "pie" || chartType === "doughnut" ? colors : colors[0],
        borderWidth: 2,
        fill: chartType === "line" ? false : true,
        tension: 0.4,
        ...(chartType === "bar" && { borderSkipped: false, borderRadius: 6 }),
      },
    ],
  }), [dadosFiltrados, chartType, campo, colors]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    ...(chartType === "bar" && { indexAxis: "y" }),
    plugins: {
      legend: { display: chartType === "pie" || chartType === "doughnut", position: "bottom" },
      title: { display: true, text: campo },
      datalabels: {
        display: true,
        color: "#374151",
        align: chartType === "pie" || chartType === "doughnut" ? "end" : "top",
        anchor: chartType === "pie" || chartType === "doughnut" ? "end" : "end",
        formatter: (value, context) => {
          if (value == null) return "";
          if (chartType === "pie" || chartType === "doughnut") {
            const total = context.dataset.data.reduce((a, b) => (b != null ? a + b : a), 0);
            const percent = total ? ((value / total) * 100).toFixed(2) : 0;
            return `${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${percent}%)`;
          }
          return Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
        },
      },
    },
    ...(chartType === "bar" && {
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: (value) =>
              Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 }),
          },
        },
        y: { ticks: { maxRotation: 0, minRotation: 0 } },
      },
    }),
  }), [chartType, campo]);

  useEffect(() => {
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, []);

  const ChartComponent = { bar: Bar, line: Line, pie: Pie, doughnut: Doughnut, radar: Radar }[chartType];

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-3 text-gray-800">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
          {campo}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-96 relative bg-gradient-to-br from-gray-50/50 to-white rounded-xl p-4 border border-gray-100">
          <ChartComponent ref={chartRef} key={`${campo}-${chartType}`} data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
});

export default function AnualDashboard() {
  const [relatorios, setRelatorios] = useState({});
  const [selected, setSelected] = useState("");
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState("bar");
  const [filtros, setFiltros] = useState({ ano: "", mes: "", min: "", max: "", campo: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const snapshot = await get(ref(db, "RelatoriosPeriodico"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setRelatorios(data);
          const firstKey = Object.keys(data)[0];
          setSelected(firstKey);
          setDados(data[firstKey] || []);
        } else setError("Nenhum dado encontrado no banco de dados");
      } catch (err) {
        setError("Erro ao carregar dados: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelect = (key) => {
    setSelected(key);
    setDados(relatorios[key] || []);
    setFiltros({ ano: "", mes: "", min: "", max: "", campo: "" });
  };

  const anos = [...new Set(dados.map((d) => d.Ano))].filter(Boolean).sort();
  const meses = [...new Set(dados.map((d) => d.Mês))].filter(Boolean).sort();

  const dadosFiltrados = useMemo(
    () =>
      dados.filter((d) => {
        const dentroAno = filtros.ano && filtros.ano !== "all" ? d.Ano == filtros.ano : true;
        const dentroMes = filtros.mes && filtros.mes !== "all" ? d.Mês === filtros.mes : true;
        const dentroMin = filtros.min
          ? Object.values(d).some((v) => typeof v === "number" && v >= Number(filtros.min))
          : true;
        const dentroMax = filtros.max
          ? Object.values(d).some((v) => typeof v === "number" && v <= Number(filtros.max))
          : true;
        const dentroCampo = filtros.campo && filtros.campo !== "all" ? Object.keys(d).includes(filtros.campo) : true;
        return dentroAno && dentroMes && dentroMin && dentroMax && dentroCampo;
      }),
    [dados, filtros]
  );

  const chartKeys = dadosFiltrados.length
    ? Object.keys(dadosFiltrados[0]).filter((k) => typeof dadosFiltrados[0][k] === "number")
    : [];

  const exportarParaExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dadosFiltrados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, selected);
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    FileSaver.saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      `${selected}-${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const exportarParaJSON = () => {
    const dataBlob = new Blob([JSON.stringify(dadosFiltrados, null, 2)], { type: "application/json" });
    FileSaver.saveAs(dataBlob, `${selected}-${new Date().toISOString().split("T")[0]}.json`);
  };

  const limparFiltros = () => setFiltros({ ano: "", mes: "", min: "", max: "", campo: "" });
  const hasActiveFilters = Object.values(filtros).some((v) => v && v !== "all");

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-96 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-lg">
          <RefreshCwIcon className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-700">Carregando relatórios...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <Card className="max-w-2xl mx-auto mt-8 border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            <XIcon className="h-5 w-5" /> Erro ao carregar dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <DatabaseIcon className="h-8 w-8 text-white" />
              </div>
              Dashboard de Relatórios
            </h1>
            <p className="text-gray-600 text-lg">Análise completa dos dados com visualizações interativas</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-base px-4 py-2 bg-blue-100 text-blue-800 border-blue-200">
              {dadosFiltrados.length} registros
            </Badge>
            {hasActiveFilters && (
              <Badge variant="outline" className="text-sm px-3 py-1 border-orange-200 text-orange-700 bg-orange-50">
                Filtros ativos
              </Badge>
            )}
          </div>
        </div>

        {/* Seleção de Relatório */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Selecionar Relatório</CardTitle>
            <CardDescription className="text-gray-600">Escolha o conjunto de dados para análise</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.keys(relatorios).map((key) => (
                <Button
                  key={key}
                  variant={selected === key ? "default" : "outline"}
                  onClick={() => handleSelect(key)}
                  className={`transition-all duration-200 px-6 py-3 font-medium ${
                    selected === key
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
                      : "hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                  }`}
                >
                  {key.replace(/_/g, " ")}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filtros Avançados */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-800">
              <FilterIcon className="h-5 w-5 text-blue-600" />
              Filtros Avançados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {/* Ano */}
              <div className="space-y-3">
                <Label htmlFor="ano" className="text-sm font-medium text-gray-700">Ano</Label>
                <Select value={filtros.ano} onValueChange={(value) => setFiltros({ ...filtros, ano: value })}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Todos os anos" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {anos.map((ano) => <SelectItem key={ano} value={ano}>{ano}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Mês */}
              <div className="space-y-3">
                <Label htmlFor="mes" className="text-sm font-medium text-gray-700">Mês</Label>
                <Select value={filtros.mes} onValueChange={(value) => setFiltros({ ...filtros, mes: value })}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Todos os meses" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {meses.map((mes) => <SelectItem key={mes} value={mes}>{mes}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Campo */}
              <div className="space-y-3">
                <Label htmlFor="campo" className="text-sm font-medium text-gray-700">Campo</Label>
                <Select value={filtros.campo} onValueChange={(value) => setFiltros({ ...filtros, campo: value })}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Todos os campos" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {chartKeys.map((key) => <SelectItem key={key} value={key}>{key}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Min */}
              <div className="space-y-3">
                <Label htmlFor="min" className="text-sm font-medium text-gray-700">Valor Mínimo</Label>
                <Input
                  id="min"
                  type="number"
                  value={filtros.min}
                  onChange={(e) => setFiltros({ ...filtros, min: e.target.value })}
                  placeholder="Ex: 0"
                  className="h-11"
                />
              </div>

              {/* Max */}
              <div className="space-y-3">
                <Label htmlFor="max" className="text-sm font-medium text-gray-700">Valor Máximo</Label>
                <Input
                  id="max"
                  type="number"
                  value={filtros.max}
                  onChange={(e) => setFiltros({ ...filtros, max: e.target.value })}
                  placeholder="Ex: 1000"
                  className="h-11"
                />
              </div>

              {/* Limpar Filtros */}
              <div className="flex items-end">
                <Button variant="destructive" className="w-full h-11" onClick={limparFiltros}>
                  <XIcon className="h-5 w-5 mr-2" /> Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tipos de Gráfico */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
              <BarChart3Icon className="h-5 w-5 text-blue-600" />
              Tipo de Gráfico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={chartType} onValueChange={setChartType}>
              <TabsList className="grid grid-cols-5 gap-2">
                <TabsTrigger value="bar"><BarChart3Icon className="h-5 w-5 mr-2" />Barras</TabsTrigger>
                <TabsTrigger value="line"><LineChartIcon className="h-5 w-5 mr-2" />Linha</TabsTrigger>
                <TabsTrigger value="pie"><PieChartIcon className="h-5 w-5 mr-2" />Pizza</TabsTrigger>
                <TabsTrigger value="doughnut"><PieChartIcon className="h-5 w-5 mr-2" />Rosca</TabsTrigger>
                <TabsTrigger value="radar"><RadarIcon className="h-5 w-5 mr-2" />Radar</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Gráficos */}
        <div className="flex flex-col gap-6">
          {chartKeys.map((campo) => (
            <ChartCard key={campo} chartType={chartType} campo={campo} dadosFiltrados={dadosFiltrados} />
          ))}
        </div>

        {/* Exportação */}
        <div className="flex gap-3 mt-6">
          <Button onClick={exportarParaExcel} variant="outline">
            <DownloadIcon className="h-5 w-5 mr-2" /> Exportar Excel
          </Button>
          <Button onClick={exportarParaJSON} variant="outline">
            <DownloadIcon className="h-5 w-5 mr-2" /> Exportar JSON
          </Button>
        </div>
      </div>
    </div>
  );
}
