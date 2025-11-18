import { useEffect, useMemo, useRef, useState } from "react"
import { ref as fbRef, onValue } from "firebase/database"
import { db, isConfigured } from "../../../../firebase"
import { Box, Card, CardContent, Typography, Button, MenuItem,TextField, Grid, Dialog, 
  DialogTitle, DialogContent, DialogActions, Divider, InputAdornment} from "@mui/material"
import { Download } from "lucide-react"
import { DataGrid } from "@mui/x-data-grid"
import {ResponsiveContainer, ComposedChart, BarChart, PieChart, Pie, Bar, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartTooltip, Legend, Cell, LabelList} from "recharts"
import * as htmlToImage from "html-to-image"
import * as XLSX from "xlsx"

const MONTHS_PT = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",]
const PIE_COLORS = ["#1e3a8a", "#0369a1", "#0d9488", "#6366f1", "#dc2626", "#f97316", "#64748b"]
const formatBR = (v) => `R$ ${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const formatWeight = (value) => {
  const num = Number.parseFloat(value)
  if (!isFinite(num)) return "-"
  if (num >= 1000) return `${(num / 1000).toFixed(2)} t`
  return `${num.toFixed(2)} Kg`
}

  const parseDate = (v) => {if (!v) return null; const d = typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? new Date(`${v}T00:00:00`) : new Date(v); return isNaN(d.getTime()) ? null : d}
  const safeNumber = (v) => {const n = Number(v); return Number.isFinite(n) ? n : 0}
  const parseProduct = (p) => p ? {nome: p.nome || p.name || p.produto || "Sem nome", name: p.nome || p.name || p.produto || "Sem nome", 
    quantidade: safeNumber(p.quantidade ?? p.peso ?? p.kg ?? 0), valor: safeNumber(p.totalPrice ?? p.valor ?? p.preco ?? 0),
      subCategoria: p.subCategoria || p.subcategory || p.tipo || "Outros", tipo: p.tipo || p.subCategoria || p.tipoProduto || "Outros",} : { nome: "Sem nome", name: "Sem nome", quantidade: 0, valor: 0, subCategoria: "Outros", tipo: "Outros" }

export default function DashboardComprasModernTabs() {
  // raw orders
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("")
  const [openDetail, setOpenDetail] = useState(false)
  const [detailContext, setDetailContext] = useState(null)
  const [pessoasAtendidas, setPessoasAtendidas] = useState(1)
  const refChartMain = useRef(null)
  const refChartKg = useRef(null)
  const refTopProducts = useRef(null)
  const refProteins = useRef(null)
  const refTopProductsValor = useRef(null) // ✅ adicione esta linha

  // load firebase
  useEffect(() => {
    if (!isConfigured) {setError("Firebase não configurado"); setLoading(false); return}
    const r = fbRef(db, "novosPedidos")
    const unsubscribe = onValue(r, (snapshot) => {
        const val = snapshot.val() || {}
        const arr = Object.entries(val)
          .map(([key, v]) => {
            const produtosRaw = v.produtos ?? v.items ?? []
            const produtosArr = Array.isArray(produtosRaw) ? produtosRaw.map((p) => parseProduct(p)) : Object.values(produtosRaw).map((p) => parseProduct(p))
            return {id: key, ...v, produtos: produtosArr, fornecedor:(typeof v.fornecedor === "string" && v.fornecedor) || v.fornecedor?.razaoSocial || v.razaoSocial || v.fornecedorName || "",
              dataPedido: v.dataPedido || v.periodoInicio || v.periodo || v.createdAt || "", category: (v.category || v.categoria || v.grupo || "").toString(),
              kilosTotais: safeNumber(v.kilosTotais ?? v.kilos ?? v.kilosTotal) || produtosArr.reduce((a, p) => a + (p.quantidade || 0), 0),
              valorPedido: safeNumber(v.valorTotal ?? v.totalPedido ?? v.pedidoValor ?? 0), status: (v.status || v.situacao || "").toString(),}})
          .filter((o) => (o.status || "").toLowerCase() === "aprovado" || (o.status || "").toLowerCase() === "aprovada")
        arr.sort((a, b) => new Date(b.dataPedido || 0) - new Date(a.dataPedido || 0)); setOrders(arr); setLoading(false)},
      (err) => {setError(err.message || "Erro ao carregar dados"); setLoading(false)},)
    return () => {try {unsubscribe()} catch (e) { }}
  }, [])

  // AGGREGATIONS
  const {categoryMonthlyRows, categoriesList, monthlyTotalsSeriesValor, monthlyTotalsSeriesKg, topProductsByCategoryMonth, totalsSummary, productsByTypeSummary,topProductsForCharts,} = useMemo(() => {
    const categoryMonthlyAgg = {}
    const monthlyTotalsValor = Array.from({ length: 12 }, () => 0)
    const monthlyTotalsKg = Array.from({ length: 12 }, () => 0)
    let globalValor = 0
    let globalKg = 0
    const detailMap = {}
    const typeMap = {}
    const prodAggGlobal = {}

    for (const o of orders) {
      const date = parseDate(o.dataPedido)
      if (!date) continue
      if (date.getFullYear() !== Number(selectedYear)) continue
      const mIdx = date.getMonth()
      const cat = (o.category || "Sem categoria").toString().trim() || "Sem categoria"
      const products = (o.produtos || []).map(parseProduct)
      const valorProdutos = products.reduce((a, p) => a + (p.valor || 0), 0)
      const valorTotalOrder = safeNumber(o.valorPedido) || valorProdutos || 0
      const kgOrder = safeNumber(o.kilosTotais) || products.reduce((a, p) => a + (p.quantidade || 0), 0)
      globalValor += valorTotalOrder
      globalKg += kgOrder
      if (!categoryMonthlyAgg[cat]) categoryMonthlyAgg[cat] = Array.from({ length: 12 }, () => 0)
      if (!detailMap[cat]) detailMap[cat] = Array.from({ length: 12 }, () => [])
      categoryMonthlyAgg[cat][mIdx] += valorTotalOrder
      monthlyTotalsValor[mIdx] += valorTotalOrder
      monthlyTotalsKg[mIdx] += kgOrder
      detailMap[cat][mIdx].push({orderId: o.id, numeroPedido: o.numeroPedido || o.chaveAcesso || "-", fornecedor: o.fornecedor || "-", dataPedido: o.dataPedido, produtos: products, kilosTotais: kgOrder, valorPedido: valorTotalOrder,})
      for (const p of products) {
        const tipo = (p.tipo || p.subCategoria || "Outros").toString()
        if (!typeMap[tipo]) typeMap[tipo] = { kg: 0, valor: 0, produtos: {} }
        typeMap[tipo].kg += p.quantidade || 0
        typeMap[tipo].valor += p.valor || 0
        if (!typeMap[tipo].produtos[p.name]) typeMap[tipo].produtos[p.name] = { kg: 0, valor: 0 }
        typeMap[tipo].produtos[p.name].kg += p.quantidade || 0
        typeMap[tipo].produtos[p.name].valor += p.valor || 0
        prodAggGlobal[p.name] = prodAggGlobal[p.name] || { kg: 0, valor: 0 }
        prodAggGlobal[p.name].kg += p.quantidade || 0
        prodAggGlobal[p.name].valor += p.valor || 0
      }
    }

    const categoryRows = Object.entries(categoryMonthlyAgg).map(([cat, months]) => {
      const total = months.reduce((a, b) => a + b, 0)
      const row = { id: cat, categoria: cat }
      MONTHS_PT.forEach((m, i) => {row[m] = Number(months[i].toFixed(2))})
      row.total = Number(total.toFixed(2))
      return row
    })

    const monthlySeriesValor = MONTHS_PT.map((m, i) => ({ month: m, valor: Number(monthlyTotalsValor[i].toFixed(2)) }))
    const monthlySeriesKg = MONTHS_PT.map((m, i) => ({ month: m, kg: Number(monthlyTotalsKg[i].toFixed(3)) }))

    const topProductsMap = {}
    for (const [cat, monthsArr] of Object.entries(detailMap)) {
      monthsArr.forEach((ordersList, mIdx) => {
        const key = `${cat}|${mIdx}`
        const prodAgg = {}
        for (const ord of ordersList) {
          for (const p of ord.produtos) {prodAgg[p.name] = prodAgg[p.name] || { kg: 0, valor: 0 }; prodAgg[p.name].kg += p.quantidade || 0; prodAgg[p.name].valor += p.valor || 0}
        }
        const arr = Object.entries(prodAgg)
          .map(([name, v]) => ({ name, kg: Number(v.kg.toFixed(3)), valor: Number(v.valor.toFixed(2)) }))
          .sort((a, b) => b.valor - a.valor)
        topProductsMap[key] = arr
      })
    }

    const monthsWithValue = monthlyTotalsValor.filter((v) => v > 0).length || 1
    const mediaMensal = globalValor / monthsWithValue
    const perCapita = globalValor / (globalKg || 1)
    const typeSummary = Object.entries(typeMap).map(([tipo, v]) => ({tipo,kg: Number(v.kg.toFixed(3)), valor: Number(v.valor.toFixed(2)),
      topProdutos: Object.entries(v.produtos).map(([n, vv]) => ({ nome: n, kg: Number(vv.kg.toFixed(3)), valor: Number(vv.valor.toFixed(2)) })).sort((a, b) => b.kg - a.kg),}))
    const prodArr = Object.entries(prodAggGlobal).map(([name, v]) => ({name,kg: Number(v.kg.toFixed(3)),valor: Number(v.valor.toFixed(2)),}))
    const topByKg = prodArr.slice().sort((a, b) => b.kg - a.kg).slice(0, 12)
    const topByValor = prodArr.slice().sort((a, b) => b.valor - a.valor).slice(0, 12)

    return {
      categoryMonthlyRows: categoryRows.sort((a, b) => b.total - a.total),
      categoriesList: Object.keys(categoryMonthlyAgg), monthlyTotalsSeriesValor: monthlySeriesValor, monthlyTotalsSeriesKg: monthlySeriesKg, topProductsByCategoryMonth: topProductsMap,
      totalsSummary: {totalValor: Number(globalValor.toFixed(2)), totalKg: Number(globalKg.toFixed(3)), mediaMensal: Number(mediaMensal.toFixed(2)), perCapita: Number(perCapita.toFixed(2)),
        mesesComMovimento: monthlyTotalsValor.filter((v) => v > 0).length, pedidosAprovados: orders.length,},
      productsByTypeSummary: typeSummary.sort((a, b) => b.valor - a.valor),
      topProductsForCharts: { byKg: topByKg, byValor: topByValor },
    }
  }, [orders, selectedYear])

    const handleOpenDetail = ({ categoria, monthIndex }) => {
      const ordersList = orders.filter((o) => {
        const d = parseDate(o.dataPedido);
        return (o.category === categoria && d && d.getFullYear() === selectedYear && d.getMonth() === monthIndex);});
      // Agregações por tipo/produto
      const tipos = {};
      const produtos = {};
      for (const o of ordersList) {for (const p of o.produtos) {tipos[p.tipo] = (tipos[p.tipo] || 0) + p.valor; produtos[p.name] = (produtos[p.name] || 0) + p.valor;}}
      setDetailContext({ categoria, monthIndex, totalValor: ordersList.reduce((a, o) => a + (o.valorPedido || 0), 0), totalKg: ordersList.reduce((a, o) => a + (o.kilosTotais || 0), 0),
        tipos: Object.entries(tipos).map(([tipo, valor]) => ({ tipo, valor })), products: Object.entries(produtos).map(([name, valor]) => ({ name, valor })), ordersList,
      }); setOpenDetail(true);};

  const exportCategoryTableToExcel = () => {
    const sheetData = categoryMonthlyRows.map((r) => {
      const row = { Categoria: r.categoria }
      MONTHS_PT.forEach((m) => {row[m] = r[m] ? Number(r[m].toFixed(2)) : 0})
      row.Total = r.total; return row})
    const ws = XLSX.utils.json_to_sheet(sheetData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, `Categorias_${selectedYear}`)
    XLSX.writeFile(wb, `categorias_${selectedYear}.xlsx`)
  }

  const exportRefToPNG = async (refElem, fileName = "chart.png") => {
    if (!refElem?.current) return
    try {
      const dataUrl = await htmlToImage.toPng(refElem.current, { cacheBust: true })
      const link = document.createElement("a"); link.href = dataUrl; link.download = fileName; link.click()
    } catch (err) {console.error("Erro export PNG:", err)}
  }

  const yearsAvailable = useMemo(() => {
    const ys = new Set()
    for (const o of orders) {const d = parseDate(o.dataPedido)
      if (d) ys.add(d.getFullYear())}
    const arr = Array.from(ys).sort((a, b) => b - a)
    if (!arr.includes(selectedYear)) arr.unshift(selectedYear); return arr}, [orders, selectedYear])

  const totals = totalsSummary || {}

  if (loading) return (<Box display="flex" alignItems="center" justifyContent="center" minHeight="50vh"><Typography sx={{ color: "#64748b", fontWeight: 500 }}>Carregando dados...</Typography></Box>)
  if (error) return (<Box display="flex" alignItems="center" justifyContent="center" minHeight="50vh"><Typography color="error" sx={{ fontWeight: 500 }}>Erro: {error}</Typography></Box>)

  return (
    <Box p={3} sx={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header Section */}
      <Box mb={4} sx={{ borderBottom: "1px solid #e2e8f0", pb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}>Gerenciamento de Compras</Typography>
        <Typography variant="body2" sx={{ color: "#64748b" }}> Análise detalhada de investimentos, categorias e tipos de produtos por período </Typography>
      </Box>

      {/* Controls Section */}
      <Card sx={{ mb: 4, p: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={6} md={3}>
            <TextField select label="Ano" size="small" fullWidth value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} variant="outlined">
              {yearsAvailable.map((y) => (<MenuItem key={y} value={y}>{y}</MenuItem>))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField size="small" label="Filtrar categoria" fullWidth value={activeCategoryFilter} onChange={(e) => setActiveCategoryFilter(e.target.value)} placeholder="Todas" variant="outlined" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField type="number" size="small" label="Pessoas atendidas" fullWidth value={pessoasAtendidas} onChange={(e) => setPessoasAtendidas(Math.max(1, safeNumber(e.target.value)))} variant="outlined"
               InputProps={{ startAdornment: <InputAdornment position="start">#</InputAdornment>,}} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button variant="contained" fullWidth startIcon={<Download size={16} />} onClick={exportCategoryTableToExcel} sx={{ textTransform: "none" }}> Exportar</Button>
          </Grid>
        </Grid>
      </Card>

      {/* KPI Cards - Enhanced Design */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)", color: "white",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.15)", border: "1px solid rgba(30, 58, 138, 0.3)", borderRadius: "12px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": { boxShadow: "0 16px 32px rgba(15, 23, 42, 0.25)", transform: "translateY(-2px)",}, }}>
            <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 600, letterSpacing: "0.5px" }}>Total Investido</Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, my: 1.5, fontSize: "1.75rem" }}>{formatBR(totals.totalValor ?? 0)}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.75, fontSize: "0.8rem" }}>Média: {formatBR(totals.mediaMensal ?? 0)}/mês</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, background: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)", color: "white", boxShadow: "0 8px 24px rgba(3, 105, 161, 0.15)", border: "1px solid rgba(3, 105, 161, 0.3)",
              borderRadius: "12px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", "&:hover": { boxShadow: "0 16px 32px rgba(3, 105, 161, 0.25)", transform: "translateY(-2px)", },}}>
            <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 600, letterSpacing: "0.5px" }}> Per Capita </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, my: 1.5, fontSize: "1.75rem" }}> {formatBR((totals.totalValor ?? 0) / (pessoasAtendidas || 1))} </Typography>
            <Typography variant="caption" sx={{ opacity: 0.75, fontSize: "0.8rem" }}> Por {pessoasAtendidas} pessoa{pessoasAtendidas !== 1 ? "s" : ""} </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, background: "linear-gradient(135deg, #134e4a 0%, #0d9488 100%)", color: "white", boxShadow: "0 8px 24px rgba(13, 148, 136, 0.15)", border: "1px solid rgba(13, 148, 136, 0.3)", borderRadius: "12px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", "&:hover": {boxShadow: "0 16px 32px rgba(13, 148, 136, 0.25)", transform: "translateY(-2px)",},}}>
            <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 600, letterSpacing: "0.5px" }}>Total Kg</Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, my: 1.5, fontSize: "1.75rem" }}>{formatWeight(totals.totalKg ?? 0)}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.75, fontSize: "0.8rem" }}>Produto aprovado</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, background: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 100%)", color: "white", boxShadow: "0 8px 24px rgba(109, 40, 217, 0.15)",
              border: "1px solid rgba(109, 40, 217, 0.3)", borderRadius: "12px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {boxShadow: "0 16px 32px rgba(109, 40, 217, 0.25)", transform: "translateY(-2px)",},}}>
            <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 600, letterSpacing: "0.5px" }}>Meses com movimento</Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, my: 1.5, fontSize: "1.75rem" }}>{totals.mesesComMovimento ?? 0}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.75, fontSize: "0.8rem" }}>{totals.pedidosAprovados ?? 0} pedidos</Typography>
          </Card>
        </Grid>
      </Grid>
        {/* Chart 1: Monthly Value */}
      <Box mb={4}>
        <Card ref={refChartMain} sx={{ mb: 3, p: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0", borderRadius: "12px", }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ color: "#0f172a", fontSize: "1.1rem" }}> Evolução Mensal — Investimento (R$) </Typography>
              <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.85rem" }}> {selectedYear} </Typography>
            </Box>
            <Button size="small" onClick={() => exportRefToPNG(refChartMain, `evolucao_valor_${selectedYear}.png`)} startIcon={<Download size={16} />} sx={{ textTransform: "none", fontWeight: 600 }}> PNG</Button>
          </Box>

          <Box sx={{ height: 400, backgroundColor: "#f8fafc", borderRadius: "10px", p: 1, border: "1px solid #e2e8f0", overflow: "hidden",}}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyTotalsSeriesValor}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: "0.85rem" }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: "0.85rem" }} />
                <RechartTooltip
                  formatter={(v) => formatBR(v)}
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", color: "#f1f5f9", boxShadow: "0 4px 12px rgba(0,0,0,0.2)",}} />
                <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "0.85rem" }} />
                <Bar dataKey="valor" name="Investimento" fill="#1e40af" radius={[8, 8, 0, 0]}>
                  <LabelList dataKey="valor" position="top" formatter={(v) => formatBR(v)} style={{ fill: "#0f172a", fontWeight: 700, fontSize: "0.75rem" }} />
                </Bar>
                <Line type="monotone" dataKey="valor" name="Tendência" stroke="#0d9488" strokeWidth={3} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        {/* Chart 2: Monthly Kg */}
        <Card ref={refChartKg} sx={{ mb: 3, p: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0", borderRadius: "12px", }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ color: "#0f172a", fontSize: "1.1rem" }}>Evolução Mensal — Volume (Kg)</Typography>
              <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.85rem" }}>{selectedYear}</Typography>
            </Box>
            <Button size="small" onClick={() => exportRefToPNG(refChartKg, `evolucao_kg_${selectedYear}.png`)} startIcon={<Download size={16} />} sx={{ textTransform: "none", fontWeight: 600 }}>PNG </Button>
          </Box>
          <Box sx={{height: 400, backgroundColor: "#f8fafc", borderRadius: "10px", p: 2, border: "1px solid #e2e8f0", overflow: "hidden", }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTotalsSeriesKg} margin={{ top: 20, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: "0.85rem" }} tick={{ fontSize: 12, fill: "#0f172a" }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: "0.85rem" }} tick={{ fontSize: 12, fill: "#0f172a" }} />
                <RechartTooltip formatter={(v) => formatWeight(v)} contentStyle={{backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", color: "#f1f5f9", boxShadow: "0 4px 12px rgba(0,0,0,0.2)",}} />
                <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "0.85rem" }} />
                <Bar dataKey="kg" name="Volume (Kg)" fill="#0891b2" radius={[8, 8, 0, 0]}>
                  <LabelList dataKey="kg" position="top" formatter={(v) => formatWeight(v)} style={{ fill: "#0f172a", fontWeight: 700, fontSize: "0.75rem" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>
        {/* Chart 3: Distribution by Type */}
        <Card ref={refProteins} sx={{mb: 3, p: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0", borderRadius: "12px", }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h6" fontWeight={500} sx={{ color: "#0f172a", fontSize: "1.1rem" }}>
                Distribuição por Tipo
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.85rem" }}>
                {selectedYear}
              </Typography>
            </Box>
            <Button size="small" onClick={() => exportRefToPNG(refProteins, `tipos_${selectedYear}.png`)} startIcon={<Download size={16} />} sx={{ textTransform: "none", fontWeight: 600 }}>PNG</Button>
          </Box>
          <Box sx={{ height: 400, backgroundColor: "#f8fafc", borderRadius: "10px", p: 2, display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid #e2e8f0", overflow: "hidden", }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={productsByTypeSummary.map((p) => ({ name: p.tipo, value: p.valor }))} dataKey="value" nameKey="name" outerRadius={150} 
                  label={({ name, value }) => `${name}: ${value ? value.toLocaleString("pt-BR", { minimumFractionDigits: 0 }) : 0}`} labelLine={false}>
                  {productsByTypeSummary.map((entry, i) => (<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />))}
                </Pie>
                <RechartTooltip formatter={(v) => formatBR(v)}
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", color: "#f1f5f9", boxShadow: "0 4px 12px rgba(0,0,0,0.2)",}}/>
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>
        {/* Chart 4: Top Products by Kg */}
        <Card ref={refTopProducts} sx={{mb: 3, p: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0", borderRadius: "12px",}}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ color: "#0f172a", fontSize: "1.1rem" }}>Top 12 Produtos — Volume (Kg)</Typography>
              <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.85rem" }}>{selectedYear}</Typography>
            </Box>
            <Button size="small" onClick={() => exportRefToPNG(refTopProducts, `top_produtos_kg_${selectedYear}.png`)} startIcon={<Download size={16} />} sx={{ textTransform: "none", fontWeight: 600 }}>PNG </Button>
          </Box>
          <Box sx={{ height: 400,  backgroundColor: "#f8fafc", borderRadius: "10px", p: 2, border: "1px solid #e2e8f0", overflow: "hidden", }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topProductsForCharts.byKg} margin={{ top: 10, left: 0, bottom: 10, right: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={true} />
                <XAxis type="number" stroke="#94a3b8" style={{ fontSize: "0.9rem" }} tickFormatter={(v) => `${v.toLocaleString("pt-BR")} Kg`} />
                <YAxis dataKey="name" type="category" width={150}  interval={0} stroke="#94a3b8" tick={({ x, y, payload }) => (
                    <text x={x} y={y} textAnchor="end" fill="#0f172a" fontSize={12} fontWeight={500} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{payload.value}</text>)} />
                <RechartTooltip formatter={(v) => `${v.toLocaleString("pt-BR")} Kg`} contentStyle={{backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", color: "#f1f5f9", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", }} />
                <Bar dataKey="kg" fill="#0891b2" radius={[0, 8, 8, 0]}><LabelList dataKey="kg" position="right" formatter={(v) => `${v.toLocaleString("pt-BR")} Kg`} style={{ fill: "#0f172a", fontWeight: 700, fontSize: "0.75rem" }} /></Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>
        {/* Chart 5: Top Products by Value */}
        <Card
          ref={refTopProductsValor}
          sx={{mb: 4, p: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0", borderRadius: "12px",}}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ color: "#0f172a", fontSize: "1.1rem" }}>Top 12 Produtos — Investimento (R$)</Typography>
              <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.85rem" }}>{selectedYear}</Typography>
            </Box>
            <Button size="small"onClick={() => exportRefToPNG(refTopProductsValor, `top_produtos_valor_${selectedYear}.png`)} startIcon={<Download size={16} />} sx={{ textTransform: "none", fontWeight: 600 }}>PNG</Button>
          </Box>
          <Box sx={{height: 400, backgroundColor: "#f8fafc", borderRadius: "10px", p: 2, border: "1px solid #e2e8f0", overflow: "hidden",}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topProductsForCharts.byValor} margin={{ top: 10, left: 0, bottom: 10, right: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={true} />
                <XAxis type="number" style={{ fontSize: "0.9rem" }} tickFormatter={(v) => (v ? `R$ ${(v / 1000).toFixed(0)}k` : "0")} stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" width={150} interval={0} stroke="#94a3b8" tick={({ x, y, payload }) => (
                    <text x={x} y={y} textAnchor="end" fill="#0f172a" fontSize={12} fontWeight={500}style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{payload.value}</text>)} />
                <RechartTooltip
                  formatter={(v) => formatBR(v)}
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", color: "#f1f5f9", boxShadow: "0 4px 12px rgba(0,0,0,0.2)",}} />
                <Bar dataKey="valor" fill="#6d28d9" radius={[0, 8, 8, 0]}>
                  <LabelList dataKey="valor" position="right" formatter={(v) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} style={{ fill: "#0f172a", fontWeight: 700, fontSize: "0.75rem" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>

      </Box>
      {/* Category Table */}
      <Card sx={{ mb: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: "#0f172a" }}>Resumo por Categoria</Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>{selectedYear}</Typography>
              </Box>
            <Button variant="outlined" onClick={exportCategoryTableToExcel} startIcon={<Download size={16} />}>Excel</Button>
          </Box>
          <Box sx={{ height: 520, width: "100%" }}>
            <DataGrid rows={activeCategoryFilter ? categoryMonthlyRows.filter((r) => r.categoria === activeCategoryFilter) : categoryMonthlyRows}
              columns={[
                {field: "categoria", headerName: "Categoria", minWidth: 200, flex: 1,
                  renderCell: (params) => <strong>{params.value}</strong>,
                },...MONTHS_PT.map((m, i) => ({field: m, headerName: m, minWidth: 120, flex: 0.8,
                  valueFormatter: ({ value }) => (value ? formatBR(value) : "-"),
                  renderCell: (params) => {
                    const val = params.value || 0
                    const monthIndex = MONTHS_PT.indexOf(params.field)
                    return (<Button size="small" onClick={() => handleOpenDetail({ categoria: params.row.categoria, monthIndex })}sx={{ textTransform: "none" }}>{val ? formatBR(val) : "-"}</Button>)},})),
                {field: "total", headerName: "Total Anual", minWidth: 160, flex: 1, valueFormatter: ({ value }) => formatBR(value),},
              ]} pageSize={10} disableSelectionOnClick
              sx={{border: 0, "& .MuiDataGrid-columnHeaders": {bgcolor: "#f1f5f9", color: "#0f172a", fontWeight: 700, borderBottom: "2px solid #e2e8f0",},}}
            />
          </Box>
        </CardContent>
      </Card>
      {/* Detail Dialog */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="lg" fullWidth aria-labelledby="detail-dialog-title" aria-describedby={detailContext ? "detail-dialog-desc" : undefined}>
        <DialogTitle id="detail-dialog-title" sx={{ fontWeight: 700, color: "#0f172a" }}>Detalhes — {detailContext ? `${detailContext.categoria} • ${MONTHS_PT[detailContext.monthIndex]}` : ""}</DialogTitle>
        <DialogContent id="detail-dialog-desc">
          {detailContext ? (
            <>
              <Grid container spacing={2} mb={2} sx={{ mt: 0.5 }}>
                  <Grid xs={12} sm={6} md={4}>
                  <Card sx={{ p: 2, background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)" }}>
                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>Total Investido</Typography>
                    <Typography variant="h6" fontWeight={800} sx={{ my: 1 }}>{formatBR(detailContext.totalValor)}</Typography>
                    <Typography variant="caption" sx={{ color: "#94a3b8" }}>Volume: {formatWeight(detailContext.totalKg)}</Typography>
                  </Card>
                </Grid>
                  <Grid xs={12} sm={6} md={4}>
                  <Card sx={{ p: 2, background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)" }}>
                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>Tipos Principais</Typography>
                    <Box mt={1}>
                      {detailContext.tipos && detailContext.tipos.length ? (
                        detailContext.tipos.slice(0, 4).map((t) => (
                          <Box key={t.tipo} display="flex" justifyContent="space-between" py={0.3}>
                            <Typography variant="caption">{t.tipo}</Typography>
                            <Typography variant="caption" fontWeight={600}>{formatBR(t.valor)}</Typography>
                          </Box>))) : (<Typography variant="caption">Sem dados</Typography>)}
                    </Box>
                  </Card>
                </Grid>
                  <Grid xs={12} sm={6} md={4}>
                  <Card sx={{ p: 2, background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)" }}>
                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>Top Produtos</Typography>
                    <Box mt={1}>
                      {detailContext.products && detailContext.products.length ? (
                        detailContext.products.slice(0, 4).map((p) => (
                          <Box key={p.name} display="flex" justifyContent="space-between" py={0.3}>
                            <Typography variant="caption">{p.name} </Typography> <br />
                            <Typography variant="caption" fontWeight={600}>{formatBR(p.valor)}</Typography>
                          </Box>))) : (<Typography variant="caption">Sem produtos</Typography>)}
                    </Box>
                  </Card>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" fontWeight={700} mb={1} sx={{ color: "#0f172a" }}>Pedidos no período ({detailContext.ordersList.length})</Typography>
              <Box sx={{ height: 320 }}>
                <DataGrid
                  rows={detailContext.ordersList.map((o, idx) => ({ id: idx, ...o }))}
                  columns={[
                    { field: "numeroPedido", headerName: "Número", flex: 0.8 },
                    { field: "fornecedor", headerName: "Fornecedor", flex: 1 },
                    { field: "totalKg", headerName: "Kg", flex: 0.6, valueFormatter: ({ value } = {}) => formatWeight(value || 0)},
                    { field: "totalValor", headerName: "Valor", flex: 0.8, valueFormatter: ({ value } = {}) => formatBR(value || 0)},
                  ]}
                  pageSize={6}
                  disableSelectionOnClick
                />
              </Box>
            </>
          ) : (<Typography>Selecione um valor na tabela para ver o detalhe.</Typography>)}
        </DialogContent>
        <DialogActions><Button onClick={() => setOpenDetail(false)}>Fechar</Button></DialogActions>
      </Dialog>
    </Box>
  )
}