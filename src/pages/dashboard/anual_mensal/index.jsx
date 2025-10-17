"use client";

import { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { db } from "../../../../firebase";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import * as XLSX from "xlsx";
import FileSaver from "file-saver";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line,
  PieChart, Pie, Cell
} from "recharts";

export default function PremiumDashboardCorporativo() {
  const [tipoSelecionado, setTipoSelecionado] = useState("Refeicoes");
  const [chartType, setChartType] = useState("bar");
  const [dadosRefeicoes, setDadosRefeicoes] = useState([]);
  const [dadosCompras, setDadosCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [resumo, setResumo] = useState({ totalJovens: 0, totalFuncionarios: 0, totalPedidos: 0, registros: 0 });

  const COLORS = ["#36A2EB", "#FF6384", "#4BC0C0", "#FFCE56", "#F59E0B", "#8B5CF6"];
  const nomesMeses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

  const formatarValor = (valor) =>
    Number(valor).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const carregarDados = async () => {
    setLoading(true);
    try {
      const refeicoesSnap = await get(ref(db, "refeicoesServidas"));
      const pedidosSnap = await get(ref(db, "novosPedidos"));

      const refeicoes = refeicoesSnap.exists() ? Object.values(refeicoesSnap.val()) : [];
      const pedidos = pedidosSnap.exists() ? Object.values(pedidosSnap.val()) : [];

      const inicio = dataInicio ? new Date(dataInicio) : null;
      const fim = dataFim ? new Date(dataFim) : null;

      // ---------- Processar Refeições ----------
      const mesesAnosRefeicoes = {};
      let totalJovens = 0, totalFuncionarios = 0;

      refeicoes.forEach(r => {
        const data = new Date(r.dataRefeicao);
        if ((inicio && data < inicio) || (fim && data > fim)) return;

        const ano = data.getFullYear();
        const mes = data.getMonth();
        const key = `${ano}-${mes}`;

        if (!mesesAnosRefeicoes[key]) mesesAnosRefeicoes[key] = { Ano: ano, Mês: nomesMeses[mes], totalJovens:0, totalFuncionarios:0, totalRefeicoes:0, dias: new Set() };

        const jovens = (r.almocoJovensQtd||0)+(r.almocoJovensTardeQtd||0)+(r.cafeJovensQtd||0)+(r.lancheJovensQtd||0)+(r.lancheJovensManhaQtd||0);
        const funcionarios = (r.almocoFuncionariosQtd||0)+(r.cafeFuncionariosQtd||0)+(r.lancheFuncionariosQtd||0);
        const totalRefeicoesMes = jovens+funcionarios;

        mesesAnosRefeicoes[key].totalJovens += jovens;
        mesesAnosRefeicoes[key].totalFuncionarios += funcionarios;
        mesesAnosRefeicoes[key].totalRefeicoes += totalRefeicoesMes;
        mesesAnosRefeicoes[key].dias.add(r.dataRefeicao);

        totalJovens += jovens;
        totalFuncionarios += funcionarios;
      });

      const dadosRefeicoesArray = [];
      for (let i=0; i<12; i++){
        const key = Object.keys(mesesAnosRefeicoes).find(k => k.endsWith(`-${i}`));
        const registro = key ? mesesAnosRefeicoes[key] : { totalJovens:0, totalFuncionarios:0, totalRefeicoes:0, dias: new Set([1]) };
        const dias = registro.dias.size || 1;
        dadosRefeicoesArray.push({
          Mês: nomesMeses[i],
          totalJovens: registro.totalJovens,
          totalFuncionarios: registro.totalFuncionarios,
          mediaJovens: registro.totalJovens/dias,
          mediaFuncionarios: registro.totalFuncionarios/dias,
          totalRefeicoes: registro.totalRefeicoes,
          mediaRefeicoes: registro.totalRefeicoes/dias
        });
      }

      // ---------- Processar Compras ----------
      const mesesCompras = {};
      let totalPedidos = 0;

      pedidos.forEach(p=>{
        const data = new Date(p.dataPedido);
        if ((inicio && data < inicio) || (fim && data > fim)) return;
        const ano = data.getFullYear();
        const mes = data.getMonth();
        const key = `${ano}-${mes}`;

        if (!mesesCompras[key]) mesesCompras[key] = { Ano: ano, Mês: nomesMeses[mes], totalPedidos:0, dias: new Set() };
        mesesCompras[key].totalPedidos += p.totalPedido||0;
        mesesCompras[key].dias.add(p.dataPedido);
        totalPedidos += p.totalPedido||0;
      });

      const dadosComprasArray = [];
      for (let i=0; i<12; i++){
        const key = Object.keys(mesesCompras).find(k=>k.endsWith(`-${i}`));
        const registro = key ? mesesCompras[key] : { totalPedidos:0, dias:new Set([1]) };
        const dias = registro.dias.size || 1;
        dadosComprasArray.push({
          Mês: nomesMeses[i],
          totalPedidos: registro.totalPedidos,
          mediaPedidos: registro.totalPedidos/dias
        });
      }

      const registros = dadosRefeicoesArray.length + dadosComprasArray.length;
      setDadosRefeicoes(dadosRefeicoesArray);
      setDadosCompras(dadosComprasArray);
      setResumo({ totalJovens, totalFuncionarios, totalPedidos, registros });

    } catch(err){ console.error(err); }
    finally{ setLoading(false); }
  };

  useEffect(()=>{ carregarDados(); },[dataInicio,dataFim]);

  const exportarExcel = () => {
    const dados = tipoSelecionado==="Refeicoes"? dadosRefeicoes : dadosCompras;
    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tipoSelecionado);
    FileSaver.saveAs(new Blob([XLSX.write(wb, {bookType:"xlsx",type:"array"})]), `${tipoSelecionado}-${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const exportarJSON = () => {
    const dados = tipoSelecionado==="Refeicoes"? dadosRefeicoes : dadosCompras;
    const blob = new Blob([JSON.stringify(dados,null,2)],{type:"application/json"});
    FileSaver.saveAs(blob, `${tipoSelecionado}-${new Date().toISOString().split("T")[0]}.json`);
  };

  const renderChart = () => {
    const dados = tipoSelecionado==="Refeicoes"? dadosRefeicoes : dadosCompras;
    if (!dados.length) return <p>Sem dados para o período selecionado.</p>;

    const CustomTooltip = ({ active, payload })=>{
      if (active && payload && payload.length){
        return (
          <div className="bg-white p-2 border shadow rounded">
            {payload.map((p,i)=><div key={i}>{p.name}: {formatarValor(p.value)}</div>)}
          </div>
        );
      }
      return null;
    };

    if (chartType==="bar") return (
      <BarChart width={900} height={500} layout="vertical" data={dados} margin={{top:20,right:50,left:80,bottom:20}}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis type="number" tickFormatter={formatarValor}/>
        <YAxis type="category" dataKey="Mês"/>
        <Tooltip content={CustomTooltip}/>
        <Legend/>
        {tipoSelecionado==="Refeicoes" ? <>
          <Bar dataKey="totalJovens" fill={COLORS[0]} name="Jovens"/>
          <Bar dataKey="totalFuncionarios" fill={COLORS[1]} name="Funcionários"/>
        </> : <Bar dataKey="totalPedidos" fill={COLORS[2]} name="Total Pedidos"/>}
      </BarChart>
    );

    if (chartType==="line") return (
      <LineChart width={900} height={500} data={dados} margin={{top:20,right:50,left:50,bottom:20}}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="Mês" interval={0} tick={{fontSize:12}}/>
        <YAxis tickFormatter={formatarValor}/>
        <Tooltip content={CustomTooltip}/>
        <Legend/>
        {tipoSelecionado==="Refeicoes" ? <>
          <Line type="monotone" dataKey="mediaJovens" stroke={COLORS[0]} name="Média Jovens"/>
          <Line type="monotone" dataKey="mediaFuncionarios" stroke={COLORS[1]} name="Média Funcionários"/>
        </> : <Line type="monotone" dataKey="mediaPedidos" stroke={COLORS[2]} name="Média Pedidos"/>}
      </LineChart>
    );

    if (chartType==="pie"){
      const total = tipoSelecionado==="Refeicoes" ? [
        {name:"Jovens", value:resumo.totalJovens},
        {name:"Funcionários", value:resumo.totalFuncionarios}
      ] : [{name:"Total Pedidos", value:resumo.totalPedidos}];

      return (
        <PieChart width={500} height={500}>
          <Pie data={total} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150}
            label={({name,value,percent})=> `${name}: ${formatarValor(value)} (${(percent*100).toFixed(1)}%)`}>
            {total.map((entry,index)=><Cell key={index} fill={COLORS[index%COLORS.length]}/>)}
          </Pie>
          <Tooltip formatter={formatarValor}/>
          <Legend/>
        </PieChart>
      );
    }

    return null;
  };

  if (loading) return <p>Carregando dados...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">📊 Dashboard Corporativo Premium</h1>

      <div className="flex gap-4 flex-wrap">
        <Badge variant="secondary">Total Jovens: {formatarValor(resumo.totalJovens)}</Badge>
        <Badge variant="secondary">Total Funcionários: {formatarValor(resumo.totalFuncionarios)}</Badge>
        <Badge variant="secondary">Total Pedidos: {formatarValor(resumo.totalPedidos)}</Badge>
        <Badge variant="secondary">Registros: {resumo.registros}</Badge>
      </div>

      <div className="flex gap-4 flex-wrap items-center mt-4">
        <Input type="date" value={dataInicio} onChange={e=>setDataInicio(e.target.value)}/>
        <Input type="date" value={dataFim} onChange={e=>setDataFim(e.target.value)}/>

        <Select value={tipoSelecionado} onValueChange={setTipoSelecionado}>
          <SelectTrigger className="w -[180px]"><SelectValue/></SelectTrigger>
          <SelectContent>
            <SelectItem value="Refeicoes">Refeições</SelectItem>
            <SelectItem value="Compras">Compras</SelectItem>
          </SelectContent>
        </Select>

        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className="w-[150px]"><SelectValue/></SelectTrigger>
          <SelectContent>    
            <SelectItem value="bar">Barra</SelectItem>
            <SelectItem value="line">Linha</SelectItem>
            <SelectItem value="pie">Pizza</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={carregarDados}>Atualizar</Button>
        <Button onClick={exportarExcel} variant="outline">Exportar Excel</Button>
        <Button onClick={exportarJSON} variant="outline">Exportar JSON</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>{tipoSelecionado} - Gráfico {chartType}</CardTitle></CardHeader>
        <CardContent>{renderChart()}</CardContent>
      </Card>
    </div>
  );
}
