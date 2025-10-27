/*
DashboardReports.jsx
Versão completa adaptada para Firebase Realtime Database
*/

import React, { useEffect, useMemo, useState } from "react";
import { db } from "../../../../firebase"; // seu firebase.js com Realtime Database
import { ref, get } from "firebase/database";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const MONTHS_PT = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

function parsePossibleDate(value) {
  if (!value) return null;
  try { return new Date(value); } catch { return null; }
}

export default function DashboardReports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ordersRef = ref(db, "novosPedidos");
        const snapshot = await get(ordersRef);
        const data = snapshot.exists() ? Object.values(snapshot.val()) : [];
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { currentYearData, previousYearData, totalsByCategory, overallStats } = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const previousYear = currentYear - 1;

    const curTotals = Array(12).fill(0);
    const curCounts = Array(12).fill(0);
    const prevTotals = Array(12).fill(0);
    const prevCounts = Array(12).fill(0);

    const categoryTotals = {};
    let overallSum = 0;
    let overallCount = 0;

    for (const o of orders) {
      const date = parsePossibleDate(o.dataPedido) || parsePossibleDate(o.periodoInicio) || parsePossibleDate(o.dataCadastro);
      if (!date) continue;
      const year = date.getFullYear();
      const month = date.getMonth();

      const value = Number(o.totalPedido || 0);
      overallSum += value;
      overallCount += 1;

      const cat = o.category || "Sem Categoria";
      categoryTotals[cat] = (categoryTotals[cat] || 0) + value;

      if (year === currentYear) {
        curTotals[month] += value;
        curCounts[month] += 1;
      } else if (year === previousYear) {
        prevTotals[month] += value;
        prevCounts[month] += 1;
      }
    }

    const currentYearData = MONTHS_PT.map((name, idx) => ({
      month: name,
      monthIndex: idx,
      total: Number(curTotals[idx].toFixed(2)),
      count: curCounts[idx],
      average: curCounts[idx] ? Number((curTotals[idx] / curCounts[idx]).toFixed(2)) : 0,
    }));

    const previousYearData = MONTHS_PT.map((name, idx) => ({
      month: name,
      monthIndex: idx,
      total: Number(prevTotals[idx].toFixed(2)),
      count: prevCounts[idx],
      average: prevCounts[idx] ? Number((prevTotals[idx] / prevCounts[idx]).toFixed(2)) : 0,
    }));

    const totalsByCategory = Object.entries(categoryTotals).map(([key, val]) => ({ name: key, value: Number(val.toFixed(2)) }));

    const overallStats = {
      totalSum: Number(overallSum.toFixed(2)),
      totalCount: overallCount,
      grandAverage: overallCount ? Number((overallSum / overallCount).toFixed(2)) : 0,
    };

    return { currentYearData, previousYearData, totalsByCategory, overallStats };
  }, [orders]);

  const lineChartData = useMemo(() => {
    return MONTHS_PT.map((name, idx) => {
      const cur = currentYearData[idx];
      const prev = previousYearData[idx];
      const diff = Number((cur.total - prev.total).toFixed(2));
      const pctChange = prev.total ? Number(((cur.total - prev.total) / prev.total * 100).toFixed(2)) : null;
      return { month: name, atual: cur.total, anoAnterior: prev.total, diff, pctChange };
    });
  }, [currentYearData, previousYearData]);

  const PIE_COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#f97316"];

  if (loading) return <div className="p-6 text-gray-700">Carregando relatórios...</div>;
  if (error) return <div className="p-6 text-red-600">Erro: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard de Relatórios</h1>
          <p className="text-sm text-gray-500">Visão mensal — nomes dos meses mostrados para facilitar leitura</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total (todos pedidos):</div>
          <div className="text-lg font-medium">R$ {overallStats.totalSum.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Qtd pedidos: {overallStats.totalCount} • Média pedido: R$ {overallStats.grandAverage}</div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Totais por mês (ano atual)</h2>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentYearData} layout="vertical" margin={{ top: 20, right: 20, left: 40, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(v) => `R$ ${v}`} />
                <YAxis type="category" dataKey="month" />
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Legend />
                <Bar dataKey="total" name="Total (R$)" barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Distribuição por Categoria</h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={totalsByCategory} dataKey="value" nameKey="name" outerRadius={80} label>
                  {totalsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Comparativo: Ano Atual x Ano Anterior</h2>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineChartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `R$ ${v}`} />
              <Tooltip formatter={(value, name) => [`R$ ${value}`, name]} />
              <Legend />
              <Line type="monotone" dataKey="atual" name={`Atual (${new Date().getFullYear()})`} stroke="#4f46e5" strokeWidth={2} />
              <Line type="monotone" dataKey="anoAnterior" name={`Ano Anterior (${new Date().getFullYear() - 1})`} stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Métricas Mensais</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Mês</th>
                <th className="px-4 py-2 text-right">Total (R$)</th>
                <th className="px-4 py-2 text-right">Pedidos</th>
                <th className="px-4 py-2 text-right">Média (R$)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentYearData.map((m) => (
                <tr key={m.month}>
                  <td className="px-4 py-2">{m.month}</td>
                  <td className="px-4 py-2 text-right">R$ {m.total.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">{m.count}</td>
                  <td className="px-4 py-2 text-right">R$ {m.average.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="text-xs text-gray-400">Dica: filtre a coleção `novosPedidos` por fornecedor, status ou período para relatórios mais específicos.</footer>
    </div>
  );
}