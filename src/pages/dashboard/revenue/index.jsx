import { useEffect, useMemo, useRef, useState } from "react"
import { ref as fbRef, onValue } from "firebase/database"
import { db, isConfigured } from "../../../../firebase"
import { Box, Card, CardContent, Typography, Button, MenuItem, TextField, Grid, alpha } from "@mui/material"
import { Download, Users, Trash2, UtensilsCrossed } from "lucide-react"
import CountUp from "react-countup"
import { DataGrid } from "@mui/x-data-grid"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartTooltip,
  Legend,
  ComposedChart,
  Line,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts"
import * as htmlToImage from "html-to-image"
import * as XLSX from "xlsx"
import { debounce } from "lodash"
import { parseISO } from "date-fns"

/* ---------- Constantes ---------- */
const MONTHS_PT = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
]

const PIE_COLORS = ["#0F172A", "#1E40AF", "#0891B2", "#059669", "#7C3AED", "#DC2626", "#F59E0B"]

const THEME = {
  primary: { main: "#0F172A", light: "#1E293B", gradient: "linear-gradient(135deg, #0F172A 0%, #1E40AF 100%)" },
  secondary: { main: "#1E40AF", light: "#3B82F6", gradient: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)" },
  success: { main: "#059669", light: "#10B981", gradient: "linear-gradient(135deg, #059669 0%, #10B981 100%)" },
  warning: { main: "#F59E0B", light: "#FBBF24", gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)" },
  error: { main: "#DC2626", light: "#EF4444", gradient: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)" },
  neutral: { 50: "#F8FAFC", 100: "#F1F5F9", 200: "#E2E8F0", 300: "#CBD5E1", 700: "#334155", 900: "#0F172A" },
}

/* ---------- Funções Utilitárias ---------- */
const parseDateSafe = (v) => {
  if (!v) return null
  try { const d = typeof v === "string" ? parseISO(v) : new Date(v); return isNaN(d.getTime()) ? null : d } catch { return null }
}

const parseMealRecord = (id, raw) => {
  const date = parseDateSafe(raw.dataRefeicao ?? raw.data ?? raw.date)
  const ano = date ? date.getFullYear() : null
  const mes = date ? date.getMonth() + 1 : null
  const n = (k) => Number(raw[k] ?? 0)
  const cafeJovens = n("cafeJovensQtd") || n("cafeJovens")
  const cafeFunc = n("cafeFuncionariosQtd") || n("cafeFuncionarios")
  const almocoJovens = n("almocoJovensQtd") + n("almocoJovensTardeQtd") + n("almocoJovens")
  const almocoFunc = n("almocoFuncionariosQtd") || n("almocoFuncionarios")
  const lancheJovens = n("lancheJovensQtd") + n("lancheJovensManhaQtd") + n("lancheJovens")
  const lancheFunc = n("lancheFuncionariosQtd") || n("lancheFuncionarios")
  const outrasJovens = n("outrasJovensQtd") + n("outrasJovensTardeQtd") + n("outrasJovens")
  const outrasFunc = n("outrasFuncionariosQtd") || n("outrasFuncionarios")
  const cafeTotal = cafeJovens + cafeFunc
  const almocoTotal = almocoJovens + almocoFunc
  const lancheTotal = lancheJovens + lancheFunc
  const outrasTotal = outrasJovens + outrasFunc
  const totalGeral = cafeTotal + almocoTotal + lancheTotal + outrasTotal
  const desperdicioQtd = n("desperdicioQtd") || 0
  const sobrasQtd = n("sobrasQtd") || n("sobrasTotalQtd") || 0
  return { id, raw, date, ano, mes, desperdicioQtd, sobrasQtd,
    cafe:{jovens:cafeJovens, funcionarios:cafeFunc, total:cafeTotal},
    almoco:{jovens:almocoJovens, funcionarios:almocoFunc, total:almocoTotal},
    lanche:{jovens:lancheJovens, funcionarios:lancheFunc, total:lancheTotal},
    outras:{jovens:outrasJovens, funcionarios:outrasFunc, total:outrasTotal},
    totalGeral
  }
}

/* ---------- Componentes de UI ---------- */
const CardIndicator = ({ title, value, gradient, icon: Icon }) => (
  <Card sx={{ p:3,borderRadius:4, background:gradient, color:"#fff", boxShadow:"0 8px 32px rgba(0,0,0,0.12)", border:"1px solid rgba(255,255,255,0.1)", position:"relative", overflow:"hidden",
    "&:hover": { transform:"translateY(-4px)", boxShadow:"0 12px 48px rgba(0,0,0,0.18)" },
    "&::before": { content:'""', position:"absolute", top:0, right:0, width:"100px", height:"100px", background:"rgba(255,255,255,0.05)", borderRadius:"50%", transform:"translate(30%,-30%)" }}}>
    <Box display="flex" alignItems="center" justifyContent="space-between" position="relative" zIndex={1}>
      <Box flex={1}>
        <Typography sx={{ fontSize:13, fontWeight:500, letterSpacing:"0.5px", textTransform:"uppercase", opacity:0.9, mb:1 }}>{title}</Typography>
        <Typography variant="h4" sx={{ fontWeight:700, letterSpacing:"-0.5px", lineHeight:1.2 }}><CountUp end={value} duration={1.8} separator="." /></Typography>
      </Box>
      {Icon && <Box sx={{ width:56, height:56, borderRadius:3, background:"rgba(255,255,255,0.15)", backdropFilter:"blur(10px)", display:"flex", alignItems:"center", justifyContent:"center" }}><Icon size={28} style={{opacity:0.9}} /></Box>}
    </Box>
  </Card>
)

const CardChart = ({ title, children, refChart, namePNG, onDownload }) => (
  <Card ref={refChart} sx={{ mb:4, borderRadius:4, boxShadow:"0 4px 24px rgba(0,0,0,0.06)", border:`1px solid ${THEME.neutral[200]}`, transition:"all 0.3s ease", "&:hover":{ boxShadow:"0 8px 32px rgba(0,0,0,0.1)" }}}>
    <CardContent sx={{ height:400, p:4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" sx={{ fontWeight:700, color:THEME.neutral[900], letterSpacing:"-0.3px", fontSize:18 }}>{title}</Typography>
        {onDownload && <Button size="small" variant="outlined" startIcon={<Download size={16} />} onClick={() => onDownload(refChart,namePNG)} sx={{ textTransform:"none", borderRadius:2, borderColor:THEME.neutral[300], color:THEME.neutral[700], fontWeight:600, px:2, "&:hover": { borderColor:THEME.secondary.main, background:alpha(THEME.secondary.main,0.04), color:THEME.secondary.main } }}>Exportar PNG</Button>}
      </Box>
      <Box sx={{ width:"100%", height:"calc(100% - 56px)" }}>{children}</Box>
    </CardContent>
  </Card>
)

/* ---------- Componente Principal ---------- */
export default function RelatorioRefCompleto() {
  const [records,setRecords] = useState([]); const [loading,setLoading]=useState(true)
  const [selectedMonth,setSelectedMonth] = useState(""); const [selectedYear,setSelectedYear]=useState(new Date().getFullYear())
  const [activeCategoryTab,setActiveCategoryTab] = useState("Todas")
  const [qText,setQText] = useState(""); const [qTextDeb,setQTextDeb]=useState("")
  const debouncedQ = useMemo(()=>debounce(setQTextDeb,300),[]); useEffect(()=>debouncedQ(qText),[qText,debouncedQ])

  const refEvolucao = useRef(null), refCategoria = useRef(null), refMedia = useRef(null), refTable = useRef(null), refDesperdicio = useRef(null), refRanking = useRef(null)

  useEffect(()=>{
    if(!isConfigured){ setLoading(false); return }
    const r=fbRef(db,"refeicoesServidas")
    const unsub=onValue(r, snap=>{
      const val = snap.val()||{}
      const arr = Object.entries(val).map(([k,v])=>parseMealRecord(k,v))
      arr.sort((a,b)=>(b.date?.getTime()||0)-(a.date?.getTime()||0))
      setRecords(arr); setLoading(false)
    },()=>setLoading(false))
    return ()=>{ try{unsub()}catch{} }
  },[])

  const filteredRecords = useMemo(()=>records.filter(r=>{
    if(selectedMonth && r.mes!==Number(selectedMonth)) return false
    if(selectedYear && r.ano!==Number(selectedYear)) return false
    if(activeCategoryTab!=="Todas"){ const cat=activeCategoryTab.toLowerCase(); if((r[cat]?.total??0)<=0) return false }
    if(qTextDeb.trim()){ const q=qTextDeb.toLowerCase(); const matches=Object.values(r.raw||{}).some(v=>String(v).toLowerCase().includes(q)); if(!matches) return false }
    return true
  }),[records,selectedMonth,selectedYear,activeCategoryTab,qTextDeb])

  const { totalsAll, monthlySeries, pieJvF, tableAnnualRows, desperdicioSeries, rankingData } = useMemo(()=>{
    let totalJovens=0,totalFuncionarios=0,totalDesperdicio=0,totalSobras=0
    const months = Array.from({length:12},(_,i)=>({monthIndex:i,month:MONTHS_PT[i],cafe:0,almoco:0,lanche:0,outras:0,total:0,desperdicio:0,sobras:0}))
    const catTotal={cafe:0,almoco:0,lanche:0,outras:0}
    for(const r of filteredRecords){
      if(r.mes){ const m=months[r.mes-1]; m.cafe+=r.cafe.total; m.almoco+=r.almoco.total; m.lanche+=r.lanche.total; m.outras+=r.outras.total; m.total+=r.totalGeral; m.desperdicio+=r.desperdicioQtd; m.sobras+=r.sobrasQtd }
      totalJovens+=r.cafe.jovens+r.almoco.jovens+r.lanche.jovens+r.outras.jovens
      totalFuncionarios+=r.cafe.funcionarios+r.almoco.funcionarios+r.lanche.funcionarios+r.outras.funcionarios
      totalDesperdicio+=r.desperdicioQtd; totalSobras+=r.sobrasQtd
      catTotal.cafe+=r.cafe.total; catTotal.almoco+=r.almoco.total; catTotal.lanche+=r.lanche.total; catTotal.outras+=r.outras.total
    }
    const rowsAnnual=[
      {id:1,categoria:"Café da Manhã",...Object.fromEntries(months.map(m=>[m.month,m.cafe])),Total:months.reduce((s,m)=>s+m.cafe,0)},
      {id:2,categoria:"Almoço",...Object.fromEntries(months.map(m=>[m.month,m.almoco])),Total:months.reduce((s,m)=>s+m.almoco,0)},
      {id:3,categoria:"Lanche",...Object.fromEntries(months.map(m=>[m.month,m.lanche])),Total:months.reduce((s,m)=>s+m.lanche,0)},
      {id:4,categoria:"Outras",...Object.fromEntries(months.map(m=>[m.month,m.outras])),Total:months.reduce((s,m)=>s+m.outras,0)},
      {id:5,categoria:"Total",...Object.fromEntries(months.map(m=>[m.month,m.total])),Total:months.reduce((s,m)=>s+m.total,0)},
    ]
    const despSeries = months.map(m=>({month:m.month,desperdicio:m.desperdicio,sobras:m.sobras}))
    const ranking = Object.entries(catTotal).map(([k,v])=>({categoria:k,total:v})).sort((a,b)=>b.total-a.total)
    return { totalsAll:{totalJovens,totalFuncionarios,totalDesperdicio,totalSobras}, monthlySeries:months, pieJvF:[{name:"Jovens",value:totalJovens},{name:"Funcionários",value:totalFuncionarios}], tableAnnualRows:rowsAnnual, desperdicioSeries:despSeries, rankingData:ranking }
  },[filteredRecords])

  const columnsAnnual=[
    { field:"categoria", headerName:"Categoria", width:180, headerAlign:"center", align:"center", headerClassName:"table-header", cellClassName:"table-cell-bold" },
    ...MONTHS_PT.map(m=>({field:m, headerName:m, width:110, type:"number", headerAlign:"center", align:"center", headerClassName:"table-header"})),
    { field:"Total", headerName:"Total", width:120, type:"number", headerAlign:"center", align:"center", headerClassName:"table-header", cellClassName:"table-cell-total" }
  ]

  const exportToExcel=()=>{ const wb=XLSX.utils.book_new(); const ws=XLSX.utils.json_to_sheet(tableAnnualRows); XLSX.utils.book_append_sheet(wb,ws,"Totais"); XLSX.writeFile(wb,`relatorio_refeicoes_${selectedYear}.xlsx`) }
  const downloadChartPNG=async(refElem,name)=>{ if(!refElem?.current) return; try{ const dataUrl=await htmlToImage.toPng(refElem.current,{cacheBust:true}); const link=document.createElement("a"); link.href=dataUrl; link.download=`${name}.png`; link.click() }catch(err){console.error(err)} }

  if(loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ background: THEME.neutral[50] }}><Box textAlign="center"><Typography variant="h6" sx={{ color: THEME.neutral[700], fontWeight: 600, mb: 2 }}>Carregando dados...</Typography><Box sx={{ width:40,height:40,border:`3px solid ${THEME.neutral[200]}`, borderTopColor:THEME.secondary.main,borderRadius:"50%",animation:"spin 1s linear infinite", margin:"0 auto","@keyframes spin":{"0%":{transform:"rotate(0deg"},"100%":{transform:"rotate(360deg"}}}} /></Box></Box>

  return (
    <Box p={4} sx={{ background:THEME.neutral[50], minHeight:"100vh" }}>
      {/* Filtros */}
      <Card sx={{ mb:5, borderRadius:4, p:3, display:"flex", flexWrap:"wrap", gap:2, alignItems:"center", boxShadow:"0 4px 24px rgba(0,0,0,0.06)", border:`1px solid ${THEME.neutral[200]}` }}>
        <TextField select size="small" label="Mês" value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)} sx={{ minWidth:160, "& .MuiOutlinedInput-root":{borderRadius:2,fontWeight:500} }}>
          <MenuItem value="">Todos os meses</MenuItem>{MONTHS_PT.map((m,i)=><MenuItem key={i} value={i+1}>{m}</MenuItem>)}
        </TextField>
        <TextField select size="small" label="Ano" value={selectedYear} onChange={e=>setSelectedYear(Number(e.target.value))} sx={{ minWidth:130, "& .MuiOutlinedInput-root":{borderRadius:2,fontWeight:500} }}>
          {Array.from({length:6},(_,i)=>new Date().getFullYear()-i).map(y=><MenuItem key={y} value={y}>{y}</MenuItem>)}
        </TextField>
        <TextField size="small" label="Pesquisar" value={qText} onChange={e=>setQText(e.target.value)} sx={{ minWidth:220, flex:1,"& .MuiOutlinedInput-root":{borderRadius:2,fontWeight:500} }} />
        <TextField select size="small" label="Categoria" value={activeCategoryTab} onChange={e=>setActiveCategoryTab(e.target.value)} sx={{ minWidth:160, "& .MuiOutlinedInput-root":{borderRadius:2,fontWeight:500} }}>
          {["Todas","Café","Almoço","Lanche","Outras"].map(c=><MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>
      </Card>

      {/* Cards */}
      <Grid container spacing={4} mb={4}>
        <Grid item xs={12} sm={6} md={3}><CardIndicator title="Jovens" value={totalsAll.totalJovens} gradient={THEME.primary.gradient} icon={Users} /></Grid>
        <Grid item xs={12} sm={6} md={3}><CardIndicator title="Funcionários" value={totalsAll.totalFuncionarios} gradient={THEME.secondary.gradient} icon={Users} /></Grid>
        <Grid item xs={12} sm={6} md={3}><CardIndicator title="Desperdício" value={totalsAll.totalDesperdicio} gradient={THEME.error.gradient} icon={Trash2} /></Grid>
        <Grid item xs={12} sm={6} md={3}><CardIndicator title="Sobras" value={totalsAll.totalSobras} gradient={THEME.warning.gradient} icon={UtensilsCrossed} /></Grid>
      </Grid>

      {/* Gráfico Evolução Mensal */}
      <CardChart title="Evolução Mensal Total" refChart={refEvolucao} namePNG="evolucao_mensal" onDownload={downloadChartPNG}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={monthlySeries}>
            <CartesianGrid strokeDasharray="3 3" stroke={THEME.neutral[200]} />
            <XAxis dataKey="month" tick={{ fill:THEME.neutral[700], fontSize:12, fontWeight:500 }} axisLine={{ stroke:THEME.neutral[300] }} />
            <YAxis tick={{ fill:THEME.neutral[700], fontSize:12, fontWeight:500 }} axisLine={{ stroke:THEME.neutral[300] }} />
            <RechartTooltip contentStyle={{ borderRadius:12, border:`1px solid ${THEME.neutral[200]}`, boxShadow:"0 4px 12px rgba(0,0,0,0.1)", fontWeight:500 }} />
            <Legend wrapperStyle={{ paddingTop:20, fontWeight:600 }} />
            {["cafe","almoco","lanche","outras"].map((cat,i)=>
              <Bar key={cat} dataKey={cat} stackId="a" fill={["#1E40AF","#059669","#F59E0B","#7C3AED"][i]} radius={[4,4,0,0]}>
                <LabelList dataKey={cat} position="top" fill={THEME.neutral[900]} fontSize={12} fontWeight={600} />
              </Bar>
            )}
            <Line type="monotone" dataKey="total" stroke={THEME.primary.main} strokeWidth={3} dot={{ fill:THEME.primary.main, r:4 }} activeDot={{ r:6 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardChart>

      {/* Gráfico Desperdício x Sobras */}
      <CardChart title="Desperdício x Sobras Mensal" refChart={refDesperdicio} namePNG="desperdicio_sobras" onDownload={downloadChartPNG}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={desperdicioSeries}>
            <CartesianGrid strokeDasharray="3 3" stroke={THEME.neutral[200]} />
            <XAxis dataKey="month" tick={{ fill:THEME.neutral[700], fontSize:12, fontWeight:500 }} axisLine={{ stroke:THEME.neutral[300] }} />
            <YAxis tick={{ fill:THEME.neutral[700], fontSize:12, fontWeight:500 }} axisLine={{ stroke:THEME.neutral[300] }} />
            <RechartTooltip contentStyle={{ borderRadius:12, border:`1px solid ${THEME.neutral[200]}`, boxShadow:"0 4px 12px rgba(0,0,0,0.1)", fontWeight:500 }} />
            <Legend wrapperStyle={{ paddingTop:20, fontWeight:600 }} />
            <Bar dataKey="desperdicio" fill="#DC2626" radius={[8,8,0,0]}><LabelList dataKey="desperdicio" position="top" fill={THEME.neutral[900]} fontSize={12} fontWeight={600} /></Bar>
            <Bar dataKey="sobras" fill="#F59E0B" radius={[8,8,0,0]}><LabelList dataKey="sobras" position="top" fill={THEME.neutral[900]} fontSize={12} fontWeight={600} /></Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardChart>

      {/* Gráfico Ranking Anual */}
      <CardChart title="Ranking Anual de Categorias" refChart={refRanking} namePNG="ranking_anual" onDownload={downloadChartPNG}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={rankingData}>
            <CartesianGrid strokeDasharray="3 3" stroke={THEME.neutral[200]} />
            <XAxis type="number" tick={{ fill:THEME.neutral[700], fontSize:12, fontWeight:500 }} axisLine={{ stroke:THEME.neutral[300] }} />
            <YAxis dataKey="categoria" type="category" tick={{ fill:THEME.neutral[700], fontSize:12, fontWeight:500 }} axisLine={{ stroke:THEME.neutral[300] }} />
            <RechartTooltip contentStyle={{ borderRadius:12, border:`1px solid ${THEME.neutral[200]}`, boxShadow:"0 4px 12px rgba(0,0,0,0.1)", fontWeight:500 }} />
            <Bar dataKey="total" radius={[0,8,8,0]}>
              <LabelList dataKey="total" position="right" fill={THEME.neutral[900]} fontSize={12} fontWeight={600} />
              {rankingData.map((entry,index)=><Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardChart>

      {/* Pie Jovens x Funcionários */}
      <CardChart title="Distribuição Jovens x Funcionários" refChart={refCategoria} namePNG="pie_jovens_funcionarios" onDownload={downloadChartPNG}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieJvF} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
              {pieJvF.map((entry,index)=><Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
            </Pie>
            <Legend wrapperStyle={{ fontWeight:600, top:0 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardChart>

      {/* Tabela Anual */}
      <CardChart title={`Tabela Anual - ${selectedYear}`} refChart={refTable} namePNG="tabela_anual" onDownload={downloadChartPNG}>
        <Box sx={{ height:400, width:"100%" }}>
          <DataGrid rows={tableAnnualRows} columns={columnsAnnual} pageSize={5} rowsPerPageOptions={[5]} autoHeight disableSelectionOnClick />
        </Box>
        <Box mt={2}><Button variant="contained" onClick={exportToExcel} startIcon={<Download />}>Exportar Excel</Button></Box>
      </CardChart>
    </Box>
  )
}
