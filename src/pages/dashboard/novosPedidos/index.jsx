// // import { useEffect, useMemo, useRef, useState } from "react"
// // import { ref as fbRef, onValue } from "firebase/database"
// // import { db, isConfigured } from "../../../../firebase"
// // import {
// //   Box,
// //   Card,
// //   CardContent,
// //   Typography,
// //   Button,
// //   MenuItem,
// //   TextField,
// //   Grid,
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   IconButton,
// //   Tooltip as MuiTooltip,
// //   Chip,
// // } from "@mui/material"
// // import DownloadIcon from "@mui/icons-material/Download"
// // import InfoIcon from "@mui/icons-material/Info"
// // import TrendingUpIcon from "@mui/icons-material/TrendingUp"
// // import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
// // import InventoryIcon from "@mui/icons-material/Inventory"
// // import BarChartIcon from "@mui/icons-material/BarChart"
// // import { DataGrid } from "@mui/x-data-grid"
// // import {
// //   ResponsiveContainer,
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip as RechartTooltip,
// //   Legend,
// //   Line,
// //   ComposedChart,
// //   PieChart,
// //   Pie,
// //   Cell,
// // } from "recharts"
// // import * as htmlToImage from "html-to-image"
// // import * as XLSX from "xlsx"
// // import { debounce } from "lodash"
// // import CountUp from "react-countup"

// // const MONTHS_PT = [
// //   "Janeiro",
// //   "Fevereiro",
// //   "Março",
// //   "Abril",
// //   "Maio",
// //   "Junho",
// //   "Julho",
// //   "Agosto",
// //   "Setembro",
// //   "Outubro",
// //   "Novembro",
// //   "Dezembro",
// // ]
// // const TAB_LIST = ["Todas", "Proteína", "Hortaliça", "Mantimento"]
// // const PIE_COLORS = ["#1e40af", "#0891b2", "#059669", "#7c3aed", "#dc2626", "#f59e0b", "#64748b"]

// // const formatWeight = (value) => {
// //   const num = Number.parseFloat(value)
// //   if (isNaN(num)) return "-"
// //   if (num >= 1000) return `${(num / 1000).toFixed(2)} t`
// //   return `${num.toFixed(2)} Kg`
// // }

// // const parseDate = (v) => {
// //   const d = new Date(v)
// //   return isNaN(d.getTime()) ? null : d
// // }

// // const parseProduct = (p) => ({
// //   nome: p.nome || p.name || "Sem nome",
// //   quantidade: Number.parseFloat(p.quantidade ?? p.peso ?? 0) || 0,
// //   valor: Number.parseFloat(p.totalPrice ?? 0) || 0,
// //   subCategoria: p.subCategoria || p.subcategory || p.tipo || "Outros",
// // })

// // const CardChart = ({ title, children, height = 300, refChart, namePNG, onDownload }) => (
// //   <Card
// //     ref={refChart}
// //     sx={{
// //       mb: 3,
// //       boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
// //       borderRadius: 2,
// //       border: "1px solid #e2e8f0",
// //       transition: "all 0.3s ease",
// //       ":hover": {
// //         boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
// //         transform: "translateY(-2px)",
// //       },
// //     }}
// //   >
// //     <CardContent sx={{ height: height, p: 3 }}>
// //       <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
// //         <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b", fontSize: "1.125rem" }}>
// //           {title}
// //         </Typography>
// //         {onDownload && (
// //           <Button
// //             size="small"
// //             variant="outlined"
// //             startIcon={<DownloadIcon />}
// //             onClick={() => onDownload(refChart, namePNG)}
// //             sx={{
// //               textTransform: "none",
// //               borderColor: "#cbd5e1",
// //               color: "#475569",
// //               ":hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" },
// //             }}
// //           >
// //             Exportar
// //           </Button>
// //         )}
// //       </Box>
// //       <Box sx={{ width: "100%", height: "calc(100% - 48px)" }}>{children}</Box>
// //     </CardContent>
// //   </Card>
// // )

// // export default function DashboardComprasModernTabs() {
// //   const [orders, setOrders] = useState([])
// //   const [loading, setLoading] = useState(true)
// //   const [error, setError] = useState(null)
// //   const [activeTab, setActiveTab] = useState("Todas")
// //   const [selectedMonth, setSelectedMonth] = useState("")
// //   const [qProduct, setQProduct] = useState("")
// //   const [qSupplier, setQSupplier] = useState("")
// //   const [qSubcat, setQSubcat] = useState("")
// //   const [openDetail, setOpenDetail] = useState(false)
// //   const [detailRow, setDetailRow] = useState(null)

// //   const refMonthly = useRef(null)
// //   const refTopProducts = useRef(null)
// //   const refSupplierComp = useRef(null)
// //   const refSubcat = useRef(null)
// //   const refSubcatSupplier = useRef(null)

// //   const exportToExcel = (dataSheets) => {
// //     const wb = XLSX.utils.book_new()
// //     dataSheets.forEach(({ sheet, name }) => {
// //       XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sheet), name)
// //     })
// //     XLSX.writeFile(wb, "dashboard_compras_modern_tabs.xlsx")
// //   }

// //   const downloadChartPNG = async (refElem, name) => {
// //     if (!refElem?.current) return
// //     try {
// //       const dataUrl = await htmlToImage.toPng(refElem.current, { cacheBust: true })
// //       const link = document.createElement("a")
// //       link.href = dataUrl
// //       link.download = `${name}.png`
// //       link.click()
// //     } catch (err) {
// //       console.error(err)
// //     }
// //   }

// //   useEffect(() => {
// //     if (!isConfigured) {
// //       setError("Firebase não configurado")
// //       setLoading(false)
// //       return
// //     }
// //     const r = fbRef(db, "novosPedidos")
// //     const unsubscribe = onValue(
// //       r,
// //       (snapshot) => {
// //         const val = snapshot.val() || {}
// //         const arr = Object.entries(val)
// //           .map(([key, v]) => ({
// //             id: key,
// //             ...v,
// //             produtos: v.produtos ?? v.items ?? [],
// //             fornecedor: v.fornecedor ?? {
// //               razaoSocial: v.razaoSocial || "",
// //               contato: v.contato || "",
// //               telefone: v.telefone || "",
// //               email: v.email || "",
// //             },
// //             dataPedido: v.dataPedido || v.periodoInicio || "",
// //             chaveAcesso: v.chaveAcesso || v.key || "",
// //             status: v.status || "",
// //           }))
// //           .filter((o) => (o.status || "").toLowerCase() === "aprovado")
// //         arr.sort((a, b) => new Date(b.dataPedido || 0) - new Date(a.dataPedido || 0))
// //         setOrders(arr)
// //         setLoading(false)
// //       },
// //       (err) => {
// //         setError(err.message || "Erro ao carregar dados")
// //         setLoading(false)
// //       },
// //     )
// //     return () => {
// //       try {
// //         unsubscribe()
// //       } catch (e) {}
// //     }
// //   }, [])

// //   // debounce filtros
// //   const [qProductDeb, setQProductDeb] = useState("")
// //   const [qSupplierDeb, setQSupplierDeb] = useState("")
// //   const [qSubcatDeb, setQSubcatDeb] = useState("")

// //   const debouncedProduct = useMemo(() => debounce(setQProductDeb, 300), [])
// //   const debouncedSupplier = useMemo(() => debounce(setQSupplierDeb, 300), [])
// //   const debouncedSubcat = useMemo(() => debounce(setQSubcatDeb, 300), [])

// //   useEffect(() => {
// //     debouncedProduct(qProduct)
// //   }, [qProduct])
// //   useEffect(() => {
// //     debouncedSupplier(qSupplier)
// //   }, [qSupplier])
// //   useEffect(() => {
// //     debouncedSubcat(qSubcat)
// //   }, [qSubcat])

// //   const filteredOrders = useMemo(() => {
// //     return orders.filter((o) => {
// //       const date = parseDate(o.dataPedido)
// //       if (!date) return false
// //       if (selectedMonth !== "" && Number(selectedMonth) !== date.getMonth()) return false
// //       if (activeTab !== "Todas") {
// //         const cat = (o.category || o.categoria || "").toLowerCase()
// //         if (activeTab === "Proteína" && cat !== "proteina") return false
// //         if (activeTab === "Hortaliça" && !["hortifrut", "hortaliça", "hortalica"].includes(cat)) return false
// //         if (activeTab === "Mantimento" && cat !== "mantimento") return false
// //       }
// //       if (qProductDeb.trim()) {
// //         if (!o.produtos.some((p) => parseProduct(p).nome.toLowerCase().includes(qProductDeb.toLowerCase())))
// //           return false
// //       }
// //       if (qSupplierDeb.trim()) {
// //         if (!(o.fornecedor?.razaoSocial || "").toLowerCase().includes(qSupplierDeb.toLowerCase())) return false
// //       }
// //       if (qSubcatDeb.trim()) {
// //         if (!o.produtos.some((p) => parseProduct(p).subCategoria.toLowerCase().includes(qSubcatDeb.toLowerCase())))
// //           return false
// //       }
// //       return true
// //     })
// //   }, [orders, selectedMonth, activeTab, qProductDeb, qSupplierDeb, qSubcatDeb])

// //   // AGREGADOS
// //   const {
// //     totalsAll,
// //     monthlySeries,
// //     rankedByProduct,
// //     supplierRanking,
// //     pieDataSubcat,
// //     subcatSupplierData,
// //     subcategoriesList,
// //     tableRows,
// //     topProduct,
// //   } = useMemo(() => {
// //     let totalKg = 0,
// //       totalValor = 0,
// //       productAgg = {},
// //       supplierAgg = {},
// //       subcatAgg = {}
// //     const months = Array.from({ length: 12 }, (_, i) => ({ monthIndex: i, month: MONTHS_PT[i], kg: 0, valor: 0 }))
// //     const rows = []
// //     for (const o of filteredOrders) {
// //       const produtos = o.produtos.map(parseProduct)
// //       const date = parseDate(o.dataPedido)
// //       const mIdx = date?.getMonth() ?? null
// //       const supplierName = o.fornecedor?.razaoSocial || "Sem fornecedor"

// //       // Somar valor total investido: totalPrice + totalPedido
// //       const pedidoValor = Number.parseFloat(o.totalPedido ?? 0)
// //       totalValor += pedidoValor

// //       for (const p of produtos) {
// //         const { nome, quantidade: kg, valor: prodValor, subCategoria: sub } = p
// //         totalKg += kg
// //         totalValor += prodValor
// //         productAgg[nome] = productAgg[nome] || { kg: 0, valor: 0 }
// //         productAgg[nome].kg += kg
// //         productAgg[nome].valor += prodValor
// //         supplierAgg[supplierName] = supplierAgg[supplierName] || { kg: 0, valor: 0 }
// //         supplierAgg[supplierName].kg += kg
// //         supplierAgg[supplierName].valor += prodValor + pedidoValor
// //         subcatAgg[sub] = (subcatAgg[sub] || 0) + kg
// //         if (mIdx !== null) {
// //           months[mIdx].kg += kg
// //           months[mIdx].valor += prodValor + pedidoValor
// //         }
// //         rows.push({
// //           id: rows.length + 1,
// //           chaveAcesso: o.chaveAcesso || "-",
// //           dataPedido: o.dataPedido,
// //           fornecedor: supplierName,
// //           produto: nome,
// //           subCategoria: sub,
// //           kg: Number(kg.toFixed(3)),
// //           valor: Number((prodValor + pedidoValor).toFixed(3)),
// //           contato: o.fornecedor?.contato || "-",
// //           telefone: o.fornecedor?.telefone || "-",
// //           email: o.fornecedor?.email || "-",
// //         })
// //       }
// //     }

// //     const rankedByProduct = Object.entries(productAgg)
// //       .map(([name, v]) => ({ name, kg: Number(v.kg.toFixed(3)), valor: Number(v.valor.toFixed(3)) }))
// //       .sort((a, b) => b.kg - a.kg)

// //     const supplierRanking = Object.entries(supplierAgg)
// //       .map(([name, v]) => ({ name, kg: Number(v.kg.toFixed(3)), valor: Number(v.valor.toFixed(3)) }))
// //       .sort((a, b) => b.valor - a.valor)

// //     const pieDataSubcat = Object.entries(subcatAgg).map(([name, value]) => ({ name, value: Number(value.toFixed(3)) }))

// //     const subcategoriesList = Object.keys(subcatAgg)
// //     const subcatSupplierData = Object.entries(supplierAgg).map(([supplier, v]) => {
// //       const obj = { fornecedor: supplier, investimento: Number(v.valor.toFixed(3)) }
// //       subcategoriesList.forEach((sub) => {
// //         const sum = rows
// //           .filter((r) => r.fornecedor === supplier && r.subCategoria === sub)
// //           .reduce((a, c) => a + (c.kg || 0), 0)
// //         obj[sub] = Number(sum.toFixed(3))
// //       })
// //       return obj
// //     })

// //     months.forEach((m) => {
// //       m.kg = Number(m.kg.toFixed(3))
// //       m.valor = Number(m.valor.toFixed(3))
// //     })
// //     const mesesComValor = months.filter((m) => m.valor > 0).length || 1
// //     const mediaMensal = totalValor / mesesComValor
// //     const perCapita = totalValor / (totalKg || 1)
// //     const topProduct = rankedByProduct[0] || null

// //     return {
// //       totalsAll: {
// //         kg: Number(totalKg.toFixed(3)),
// //         valor: Number(totalValor.toFixed(3)),
// //         mediaMensal: Number(mediaMensal.toFixed(2)),
// //         perCapita: Number(perCapita.toFixed(2)),
// //       },
// //       monthlySeries: months,
// //       rankedByProduct,
// //       supplierRanking,
// //       pieDataSubcat,
// //       subcatSupplierData,
// //       subcategoriesList,
// //       tableRows: rows,
// //       topProduct,
// //     }
// //   }, [filteredOrders])

// //   const columns = [
// //     { field: "chaveAcesso", headerName: "Pedido", width: 150 },
// //     { field: "dataPedido", headerName: "Data", width: 110 },
// //     { field: "fornecedor", headerName: "Fornecedor", flex: 1 },
// //     { field: "produto", headerName: "Produto", flex: 1 },
// //     { field: "kg", headerName: "Kg", type: "number", width: 110, valueFormatter: ({ value }) => formatWeight(value) },
// //     {
// //       field: "valor",
// //       headerName: "R$",
// //       type: "number",
// //       width: 130,
// //       valueFormatter: ({ value }) =>
// //         Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 3 }),
// //     },
// //     {
// //       field: "acoes",
// //       headerName: "Ações",
// //       width: 100,
// //       sortable: false,
// //       renderCell: (params) => (
// //         <MuiTooltip title="Ver detalhes">
// //           <IconButton
// //             size="small"
// //             onClick={() => {
// //               setDetailRow(params.row)
// //               setOpenDetail(true)
// //             }}
// //           >
// //             <InfoIcon />
// //           </IconButton>
// //         </MuiTooltip>
// //       ),
// //     },
// //   ]

// //   if (loading)
// //     return (
// //       <Box display="flex" alignItems="center" justifyContent="center" minHeight="50vh">
// //         <Typography>Carregando dados...</Typography>
// //       </Box>
// //     )
// //   if (error)
// //     return (
// //       <Box display="flex" alignItems="center" justifyContent="center" minHeight="50vh">
// //         <Typography color="error">Erro: {error}</Typography>
// //       </Box>
// //     )

// //   return (
// //     <Box p={4} sx={{ background: "linear-gradient(180deg,#f8fafc 0%,#ffffff 100%)", minHeight: "100vh" }}>
// //       <Box mb={4}>
// //         <Typography variant="h4" sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}>
// //           Dashboard de Compras
// //         </Typography>
// //         <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 400 }}>
// //           Análise executiva de investimentos e performance de fornecedores
// //         </Typography>
// //       </Box>

// //       <Card sx={{ mb: 4, boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)", borderRadius: 2, border: "1px solid #e2e8f0" }}>
// //         <CardContent sx={{ p: 3 }}>
// //           <Grid container spacing={2} alignItems="center">
// //             <Grid item xs={12} md={9}>
// //               <Box display="flex" gap={2} flexWrap="wrap">
// //                 <TextField
// //                   select
// //                   size="small"
// //                   label="Mês"
// //                   value={selectedMonth}
// //                   onChange={(e) => setSelectedMonth(e.target.value)}
// //                   sx={{ minWidth: 150 }}
// //                 >
// //                   <MenuItem value="">Todos os meses</MenuItem>
// //                   {MONTHS_PT.map((m, i) => (
// //                     <MenuItem key={m} value={i}>
// //                       {m}
// //                     </MenuItem>
// //                   ))}
// //                 </TextField>
// //                 <TextField
// //                   select
// //                   size="small"
// //                   label="Categoria"
// //                   value={activeTab}
// //                   onChange={(e) => setActiveTab(e.target.value)}
// //                   sx={{ minWidth: 150 }}
// //                 >
// //                   {TAB_LIST.map((t) => (
// //                     <MenuItem key={t} value={t}>
// //                       {t}
// //                     </MenuItem>
// //                   ))}
// //                 </TextField>
// //                 <TextField
// //                   size="small"
// //                   label="Produto"
// //                   value={qProduct}
// //                   onChange={(e) => setQProduct(e.target.value)}
// //                   sx={{ minWidth: 150 }}
// //                 />
// //                 <TextField
// //                   size="small"
// //                   label="Fornecedor"
// //                   value={qSupplier}
// //                   onChange={(e) => setQSupplier(e.target.value)}
// //                   sx={{ minWidth: 150 }}
// //                 />
// //                 <TextField
// //                   size="small"
// //                   label="Subcategoria"
// //                   value={qSubcat}
// //                   onChange={(e) => setQSubcat(e.target.value)}
// //                   sx={{ minWidth: 150 }}
// //                 />
// //               </Box>
// //             </Grid>
// //             <Grid item xs={12} md={3} textAlign="right">
// //               <Button
// //                 variant="contained"
// //                 startIcon={<DownloadIcon />}
// //                 onClick={() =>
// //                   exportToExcel([
// //                     { sheet: tableRows, name: "Pedidos_Reduzidos" },
// //                     { sheet: rankedByProduct, name: "Ranking_Produtos" },
// //                     { sheet: supplierRanking, name: "Ranking_Fornecedores" },
// //                     { sheet: monthlySeries, name: "Evolucao_Mensal" },
// //                   ])
// //                 }
// //                 sx={{
// //                   bgcolor: "#1e40af",
// //                   textTransform: "none",
// //                   fontWeight: 600,
// //                   px: 3,
// //                   ":hover": { bgcolor: "#1e3a8a" },
// //                 }}
// //               >
// //                 Exportar Excel
// //               </Button>
// //             </Grid>
// //           </Grid>
// //         </CardContent>
// //       </Card>

// //       <Grid container spacing={3} mb={4}>
// //         {[
// //           {
// //             title: "Total Investido",
// //             value: totalsAll.valor,
// //             format: (v) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
// //             icon: <AttachMoneyIcon sx={{ fontSize: 40, color: "#1e40af" }} />,
// //             color: "#eff6ff",
// //             borderColor: "#bfdbfe",
// //           },
// //           {
// //             title: "Média Mensal",
// //             value: totalsAll.mediaMensal,
// //             format: (v) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
// //             icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#059669" }} />,
// //             color: "#f0fdf4",
// //             borderColor: "#bbf7d0",
// //           },
// //           {
// //             title: "Per Capita (R$/Kg)",
// //             value: totalsAll.perCapita,
// //             format: (v) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
// //             icon: <BarChartIcon sx={{ fontSize: 40, color: "#7c3aed" }} />,
// //             color: "#faf5ff",
// //             borderColor: "#e9d5ff",
// //           },
// //           {
// //             title: "Volume Total",
// //             value: totalsAll.kg,
// //             format: (v) => formatWeight(v),
// //             icon: <InventoryIcon sx={{ fontSize: 40, color: "#0891b2" }} />,
// //             color: "#ecfeff",
// //             borderColor: "#a5f3fc",
// //           },
// //         ].map((c, i) => (
// //           <Grid item xs={12} sm={6} md={3} key={i}>
// //             <Card
// //               sx={{
// //                 boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
// //                 borderRadius: 2,
// //                 border: `1px solid ${c.borderColor}`,
// //                 bgcolor: c.color,
// //                 transition: "all 0.3s ease",
// //                 ":hover": {
// //                   boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
// //                   transform: "translateY(-4px)",
// //                 },
// //               }}
// //             >
// //               <CardContent sx={{ p: 3 }}>
// //                 <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
// //                   <Typography
// //                     variant="body2"
// //                     sx={{
// //                       color: "#64748b",
// //                       fontWeight: 600,
// //                       textTransform: "uppercase",
// //                       fontSize: "0.75rem",
// //                       letterSpacing: "0.05em",
// //                     }}
// //                   >
// //                     {c.title}
// //                   </Typography>
// //                   {c.icon}
// //                 </Box>
// //                 <Typography variant="h4" sx={{ fontWeight: 700, color: "#0f172a" }}>
// //                   <CountUp
// //                     end={c.value}
// //                     duration={2}
// //                     decimals={2}
// //                     separator="."
// //                     decimal=","
// //                     prefix={c.title.includes("R$") ? "" : ""}
// //                   />
// //                 </Typography>
// //                 <Typography variant="caption" sx={{ color: "#64748b", mt: 1, display: "block" }}>
// //                   {c.format(c.value)}
// //                 </Typography>
// //               </CardContent>
// //             </Card>
// //           </Grid>
// //         ))}
// //       </Grid>

// //       <CardChart
// //         title="Evolução Mensal (Kg & R$)"
// //         refChart={refMonthly}
// //         height={400}
// //         namePNG="EvolucaoMensal"
// //         onDownload={downloadChartPNG}
// //       >
// //         <ResponsiveContainer width="100%" height="100%">
// //           <ComposedChart data={monthlySeries}>
// //             <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
// //             <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} />
// //             <YAxis yAxisId="left" tickFormatter={(v) => formatWeight(v)} tick={{ fill: "#64748b", fontSize: 12 }} />
// //             <YAxis
// //               yAxisId="right"
// //               orientation="right"
// //               tickFormatter={(v) => `R$ ${v}`}
// //               tick={{ fill: "#64748b", fontSize: 12 }}
// //             />
// //             <RechartTooltip
// //               formatter={(v, name) => (name === "valor" ? [`R$ ${v}`, "Investimento"] : [formatWeight(v), "Kg"])}
// //               contentStyle={{
// //                 borderRadius: 8,
// //                 border: "1px solid #e2e8f0",
// //                 boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
// //               }}
// //             />
// //             <Legend wrapperStyle={{ paddingTop: 20 }} />
// //             <Bar yAxisId="left" dataKey="kg" name="Kg" fill="#1e40af" radius={[8, 8, 0, 0]} />
// //             <Line yAxisId="right" dataKey="valor" name="R$" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
// //           </ComposedChart>
// //         </ResponsiveContainer>
// //       </CardChart>

// //       <CardChart
// //         title="Top Produtos (Kg)"
// //         refChart={refTopProducts}
// //         height={400}
// //         namePNG="TopProdutos"
// //         onDownload={downloadChartPNG}
// //       >
// //         <ResponsiveContainer width="100%" height="100%">
// //           <BarChart layout="vertical" data={rankedByProduct.slice(0, 12)}>
// //             <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
// //             <XAxis type="number" tickFormatter={(v) => formatWeight(v)} tick={{ fill: "#64748b", fontSize: 12 }} />
// //             <YAxis dataKey="name" type="category" width={150} tick={{ fill: "#64748b", fontSize: 12 }} />
// //             <RechartTooltip
// //               formatter={(v) => formatWeight(v)}
// //               contentStyle={{
// //                 borderRadius: 8,
// //                 border: "1px solid #e2e8f0",
// //                 boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
// //               }}
// //             />
// //             <Bar dataKey="kg" fill="#0891b2" radius={[0, 8, 8, 0]} />
// //           </BarChart>
// //         </ResponsiveContainer>
// //       </CardChart>

// //       <CardChart
// //         title="Ranking de Fornecedores (Kg & R$)"
// //         refChart={refSupplierComp}
// //         height={400}
// //         namePNG="RankingFornecedores"
// //         onDownload={downloadChartPNG}
// //       >
// //         <ResponsiveContainer width="100%" height="100%">
// //           <ComposedChart layout="vertical" data={supplierRanking}>
// //             <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
// //             <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }} />
// //             <YAxis dataKey="name" type="category" width={150} tick={{ fill: "#64748b", fontSize: 12 }} />
// //             <RechartTooltip
// //               formatter={(v, name) => (name === "valor" ? [`R$ ${v}`, "Investimento"] : [formatWeight(v), "Kg"])}
// //               contentStyle={{
// //                 borderRadius: 8,
// //                 border: "1px solid #e2e8f0",
// //                 boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
// //               }}
// //             />
// //             <Legend wrapperStyle={{ paddingTop: 20 }} />
// //             <Bar dataKey="kg" fill="#7c3aed" name="Kg" radius={[0, 8, 8, 0]} />
// //             <Line dataKey="valor" stroke="#059669" strokeWidth={3} name="R$" dot={{ r: 4 }} />
// //           </ComposedChart>
// //         </ResponsiveContainer>
// //       </CardChart>

// //       <CardChart
// //         title="Distribuição por Subcategoria (Kg)"
// //         refChart={refSubcat}
// //         height={400}
// //         namePNG="DistribuicaoSubcat"
// //         onDownload={downloadChartPNG}
// //       >
// //         <ResponsiveContainer width="100%" height="100%">
// //           <PieChart>
// //             <Pie
// //               data={pieDataSubcat}
// //               dataKey="value"
// //               nameKey="name"
// //               outerRadius={120}
// //               label={(entry) => `${entry.name}: ${formatWeight(entry.value)}`}
// //               labelLine={{ stroke: "#64748b" }}
// //             >
// //               {pieDataSubcat.map((entry, i) => (
// //                 <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
// //               ))}
// //             </Pie>
// //             <Legend wrapperStyle={{ paddingTop: 20 }} />
// //             <RechartTooltip
// //               formatter={(v) => formatWeight(v)}
// //               contentStyle={{
// //                 borderRadius: 8,
// //                 border: "1px solid #e2e8f0",
// //                 boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
// //               }}
// //             />
// //           </PieChart>
// //         </ResponsiveContainer>
// //       </CardChart>

// //       <CardChart
// //         title="Subcategoria × Fornecedor (Kg)"
// //         refChart={refSubcatSupplier}
// //         height={400}
// //         namePNG="SubcatFornecedor"
// //         onDownload={downloadChartPNG}
// //       >
// //         <ResponsiveContainer width="100%" height="100%">
// //           <BarChart data={subcatSupplierData} layout="vertical">
// //             <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
// //             <XAxis type="number" tickFormatter={(v) => formatWeight(v)} tick={{ fill: "#64748b", fontSize: 12 }} />
// //             <YAxis dataKey="fornecedor" type="category" width={150} tick={{ fill: "#64748b", fontSize: 12 }} />
// //             <RechartTooltip
// //               formatter={(v) => formatWeight(v)}
// //               contentStyle={{
// //                 borderRadius: 8,
// //                 border: "1px solid #e2e8f0",
// //                 boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
// //               }}
// //             />
// //             <Legend wrapperStyle={{ paddingTop: 20 }} />
// //             {subcategoriesList.map((s, i) => (
// //               <Bar key={s} dataKey={s} stackId="a" fill={PIE_COLORS[i % PIE_COLORS.length]} />
// //             ))}
// //           </BarChart>
// //         </ResponsiveContainer>
// //       </CardChart>

// //       <Card sx={{ boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)", borderRadius: 2, border: "1px solid #e2e8f0" }}>
// //         <CardContent sx={{ height: "600px", width: "100%", p: 3 }}>
// //           <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#1e293b", mb: 3 }}>
// //             Tabela de Pedidos
// //           </Typography>
// //           <Box sx={{ height: "calc(100% - 48px)", width: "100%" }}>
// //             <DataGrid
// //               rows={tableRows}
// //               columns={columns}
// //               pageSize={10}
// //               disableRowSelectionOnClick
// //               sx={{
// //                 border: 0,
// //                 background: "white",
// //                 "& .MuiDataGrid-columnHeaders": {
// //                   bgcolor: "#f8fafc",
// //                   color: "#475569",
// //                   fontWeight: 600,
// //                   fontSize: "0.875rem",
// //                 },
// //                 "& .MuiDataGrid-cell": {
// //                   borderColor: "#e2e8f0",
// //                 },
// //               }}
// //             />
// //           </Box>
// //         </CardContent>
// //       </Card>

// //       <Dialog
// //         open={openDetail}
// //         onClose={() => setOpenDetail(false)}
// //         PaperProps={{
// //           sx: {
// //             borderRadius: 2,
// //             minWidth: 400,
// //             boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
// //           },
// //         }}
// //       >
// //         <DialogTitle sx={{ fontWeight: 600, color: "#1e293b", borderBottom: "1px solid #e2e8f0" }}>
// //           Detalhes do Pedido
// //         </DialogTitle>
// //         <DialogContent sx={{ pt: 3 }}>
// //           {detailRow && (
// //             <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
// //               <Box>
// //                 <Typography
// //                   variant="caption"
// //                   sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem" }}
// //                 >
// //                   Pedido
// //                 </Typography>
// //                 <Typography variant="body1" sx={{ color: "#0f172a", fontWeight: 500 }}>
// //                   {detailRow.chaveAcesso}
// //                 </Typography>
// //               </Box>
// //               <Box>
// //                 <Typography
// //                   variant="caption"
// //                   sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem" }}
// //                 >
// //                   Fornecedor
// //                 </Typography>
// //                 <Typography variant="body1" sx={{ color: "#0f172a", fontWeight: 500 }}>
// //                   {detailRow.fornecedor}
// //                 </Typography>
// //               </Box>
// //               <Box>
// //                 <Typography
// //                   variant="caption"
// //                   sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem" }}
// //                 >
// //                   Produto
// //                 </Typography>
// //                 <Typography variant="body1" sx={{ color: "#0f172a", fontWeight: 500 }}>
// //                   {detailRow.produto}
// //                 </Typography>
// //               </Box>
// //               <Box>
// //                 <Typography
// //                   variant="caption"
// //                   sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem" }}
// //                 >
// //                   Subcategoria
// //                 </Typography>
// //                 <Chip
// //                   label={detailRow.subCategoria}
// //                   size="small"
// //                   sx={{ mt: 0.5, bgcolor: "#eff6ff", color: "#1e40af", fontWeight: 600 }}
// //                 />
// //               </Box>
// //               <Box display="flex" gap={3}>
// //                 <Box flex={1}>
// //                   <Typography
// //                     variant="caption"
// //                     sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem" }}
// //                   >
// //                     Peso
// //                   </Typography>
// //                   <Typography variant="body1" sx={{ color: "#0f172a", fontWeight: 600 }}>
// //                     {formatWeight(detailRow.kg)}
// //                   </Typography>
// //                 </Box>
// //                 <Box flex={1}>
// //                   <Typography
// //                     variant="caption"
// //                     sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem" }}
// //                   >
// //                     Valor
// //                   </Typography>
// //                   <Typography variant="body1" sx={{ color: "#059669", fontWeight: 600 }}>
// //                     R$ {detailRow.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
// //                   </Typography>
// //                 </Box>
// //               </Box>
// //             </Box>
// //           )}
// //         </DialogContent>
// //         <DialogActions sx={{ p: 3, borderTop: "1px solid #e2e8f0" }}>
// //           <Button
// //             onClick={() => setOpenDetail(false)}
// //             variant="contained"
// //             sx={{
// //               bgcolor: "#1e40af",
// //               textTransform: "none",
// //               fontWeight: 600,
// //               ":hover": { bgcolor: "#1e3a8a" },
// //             }}
// //           >
// //             Fechar
// //           </Button>
// //         </DialogActions>
// //       </Dialog>
// //     </Box>
// //   )
// // }



// "use client"

// import { useEffect, useMemo, useRef, useState } from "react"
// import { ref as fbRef, onValue } from "firebase/database"
// import { db, isConfigured } from "../../../../firebase"
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   MenuItem,
//   TextField,
//   Grid,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   IconButton,
//   Tooltip as MuiTooltip,
//   Chip,
// } from "@mui/material"
// import { Download, Info, TrendingUp, DollarSign, Package, BarChart3 } from "lucide-react"
// import { DataGrid } from "@mui/x-data-grid"
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip as RechartTooltip,
//   Legend,
//   Line,
//   ComposedChart,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts"
// import * as htmlToImage from "html-to-image"
// import * as XLSX from "xlsx"
// import { debounce } from "lodash"
// import CountUp from "react-countup"

// const MONTHS_PT = [
//   "Janeiro",
//   "Fevereiro",
//   "Março",
//   "Abril",
//   "Maio",
//   "Junho",
//   "Julho",
//   "Agosto",
//   "Setembro",
//   "Outubro",
//   "Novembro",
//   "Dezembro",
// ]
// const TAB_LIST = ["Todas", "Proteína", "Hortaliça", "Mantimento"]
// const PIE_COLORS = ["#1e40af", "#0891b2", "#059669", "#7c3aed", "#dc2626", "#f59e0b", "#64748b"]

// const formatWeight = (value) => {
//   const num = Number.parseFloat(value)
//   if (isNaN(num)) return "-"
//   if (num >= 1000) return `${(num / 1000).toFixed(2)} t`
//   return `${num.toFixed(2)} Kg`
// }

// const parseDate = (v) => {
//   const d = new Date(v)
//   return isNaN(d.getTime()) ? null : d
// }

// const parseProduct = (p) => ({
//   nome: p.nome || p.name || "Sem nome",
//   quantidade: Number.parseFloat(p.quantidade ?? p.peso ?? 0) || 0,
//   valor: Number.parseFloat(p.totalPrice ?? 0) || 0,
//   subCategoria: p.subCategoria || p.subcategory || p.tipo || "Outros",
// })

// const CardChart = ({ title, children, height = 300, refChart, namePNG, onDownload }) => (
//   <Card
//     ref={refChart}
//     sx={{
//       mb: 3,
//       boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
//       borderRadius: 3,
//       border: "1px solid #e2e8f0",
//       background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
//       transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//       position: "relative",
//       overflow: "hidden",
//       "&::before": {
//         content: '""',
//         position: "absolute",
//         top: 0,
//         left: 0,
//         right: 0,
//         height: "4px",
//         background: "linear-gradient(90deg, #1e40af 0%, #0891b2 50%, #059669 100%)",
//         opacity: 0,
//         transition: "opacity 0.3s ease",
//       },
//       ":hover": {
//         boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
//         transform: "translateY(-4px)",
//         "&::before": {
//           opacity: 1,
//         },
//       },
//     }}
//   >
//     <CardContent sx={{ height: height, p: 4 }}>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Typography
//           variant="h6"
//           sx={{
//             fontWeight: 700,
//             color: "#0f172a",
//             fontSize: "1.25rem",
//             letterSpacing: "-0.025em",
//           }}
//         >
//           {title}
//         </Typography>
//         {onDownload && (
//           <Button
//             size="small"
//             variant="outlined"
//             startIcon={<Download size={16} />}
//             onClick={() => onDownload(refChart, namePNG)}
//             sx={{
//               textTransform: "none",
//               borderColor: "#cbd5e1",
//               color: "#475569",
//               fontWeight: 600,
//               borderRadius: 2,
//               px: 2,
//               transition: "all 0.2s ease",
//               ":hover": {
//                 borderColor: "#1e40af",
//                 bgcolor: "#eff6ff",
//                 color: "#1e40af",
//                 transform: "translateY(-1px)",
//               },
//             }}
//           >
//             Exportar
//           </Button>
//         )}
//       </Box>
//       <Box sx={{ width: "100%", height: "calc(100% - 60px)" }}>{children}</Box>
//     </CardContent>
//   </Card>
// )

// export default function DashboardComprasModernTabs() {
//   const [orders, setOrders] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [activeTab, setActiveTab] = useState("Todas")
//   const [selectedMonth, setSelectedMonth] = useState("")
//   const [qProduct, setQProduct] = useState("")
//   const [qSupplier, setQSupplier] = useState("")
//   const [qSubcat, setQSubcat] = useState("")
//   const [openDetail, setOpenDetail] = useState(false)
//   const [detailRow, setDetailRow] = useState(null)

//   const refMonthly = useRef(null)
//   const refTopProducts = useRef(null)
//   const refSupplierComp = useRef(null)
//   const refSubcat = useRef(null)
//   const refSubcatSupplier = useRef(null)

//   const exportToExcel = (dataSheets) => {
//     const wb = XLSX.utils.book_new()
//     dataSheets.forEach(({ sheet, name }) => {
//       XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sheet), name)
//     })
//     XLSX.writeFile(wb, "dashboard_compras_modern_tabs.xlsx")
//   }

//   const downloadChartPNG = async (refElem, name) => {
//     if (!refElem?.current) return
//     try {
//       const dataUrl = await htmlToImage.toPng(refElem.current, { cacheBust: true })
//       const link = document.createElement("a")
//       link.href = dataUrl
//       link.download = `${name}.png`
//       link.click()
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   useEffect(() => {
//     if (!isConfigured) {
//       setError("Firebase não configurado")
//       setLoading(false)
//       return
//     }
//     const r = fbRef(db, "novosPedidos")
//     const unsubscribe = onValue(
//       r,
//       (snapshot) => {
//         const val = snapshot.val() || {}
//         const arr = Object.entries(val)
//           .map(([key, v]) => ({
//             id: key,
//             ...v,
//             produtos: v.produtos ?? v.items ?? [],
//             fornecedor: v.fornecedor ?? {
//               razaoSocial: v.razaoSocial || "",
//               contato: v.contato || "",
//               telefone: v.telefone || "",
//               email: v.email || "",
//             },
//             dataPedido: v.dataPedido || v.periodoInicio || "",
//             chaveAcesso: v.chaveAcesso || v.key || "",
//             status: v.status || "",
//           }))
//           .filter((o) => (o.status || "").toLowerCase() === "aprovado")
//         arr.sort((a, b) => new Date(b.dataPedido || 0) - new Date(a.dataPedido || 0))
//         setOrders(arr)
//         setLoading(false)
//       },
//       (err) => {
//         setError(err.message || "Erro ao carregar dados")
//         setLoading(false)
//       },
//     )
//     return () => {
//       try {
//         unsubscribe()
//       } catch (e) {}
//     }
//   }, [])

//   // debounce filtros
//   const [qProductDeb, setQProductDeb] = useState("")
//   const [qSupplierDeb, setQSupplierDeb] = useState("")
//   const [qSubcatDeb, setQSubcatDeb] = useState("")

//   const debouncedProduct = useMemo(() => debounce(setQProductDeb, 300), [])
//   const debouncedSupplier = useMemo(() => debounce(setQSupplierDeb, 300), [])
//   const debouncedSubcat = useMemo(() => debounce(setQSubcatDeb, 300), [])

//   useEffect(() => {
//     debouncedProduct(qProduct)
//   }, [qProduct])
//   useEffect(() => {
//     debouncedSupplier(qSupplier)
//   }, [qSupplier])
//   useEffect(() => {
//     debouncedSubcat(qSubcat)
//   }, [qSubcat])

//   const filteredOrders = useMemo(() => {
//     return orders.filter((o) => {
//       const date = parseDate(o.dataPedido)
//       if (!date) return false
//       if (selectedMonth !== "" && Number(selectedMonth) !== date.getMonth()) return false
//       if (activeTab !== "Todas") {
//         const cat = (o.category || o.categoria || "").toLowerCase()
//         if (activeTab === "Proteína" && cat !== "proteina") return false
//         if (activeTab === "Hortaliça" && !["hortifrut", "hortaliça", "hortalica"].includes(cat)) return false
//         if (activeTab === "Mantimento" && cat !== "mantimento") return false
//       }
//       if (qProductDeb.trim()) {
//         if (!o.produtos.some((p) => parseProduct(p).nome.toLowerCase().includes(qProductDeb.toLowerCase())))
//           return false
//       }
//       if (qSupplierDeb.trim()) {
//         if (!(o.fornecedor?.razaoSocial || "").toLowerCase().includes(qSupplierDeb.toLowerCase())) return false
//       }
//       if (qSubcatDeb.trim()) {
//         if (!o.produtos.some((p) => parseProduct(p).subCategoria.toLowerCase().includes(qSubcatDeb.toLowerCase())))
//           return false
//       }
//       return true
//     })
//   }, [orders, selectedMonth, activeTab, qProductDeb, qSupplierDeb, qSubcatDeb])

//   // AGREGADOS
//   const {
//     totalsAll,
//     monthlySeries,
//     rankedByProduct,
//     supplierRanking,
//     pieDataSubcat,
//     subcatSupplierData,
//     subcategoriesList,
//     tableRows,
//     topProduct,
//   } = useMemo(() => {
//     let totalKg = 0,
//       totalValor = 0,
//       productAgg = {},
//       supplierAgg = {},
//       subcatAgg = {}
//     const months = Array.from({ length: 12 }, (_, i) => ({ monthIndex: i, month: MONTHS_PT[i], kg: 0, valor: 0 }))
//     const rows = []
//     for (const o of filteredOrders) {
//       const produtos = o.produtos.map(parseProduct)
//       const date = parseDate(o.dataPedido)
//       const mIdx = date?.getMonth() ?? null
//       const supplierName = o.fornecedor?.razaoSocial || "Sem fornecedor"

//       // Somar valor total investido: totalPrice + totalPedido
//       const pedidoValor = Number.parseFloat(o.totalPedido ?? 0)
//       totalValor += pedidoValor

//       for (const p of produtos) {
//         const { nome, quantidade: kg, valor: prodValor, subCategoria: sub } = p
//         totalKg += kg
//         totalValor += prodValor
//         productAgg[nome] = productAgg[nome] || { kg: 0, valor: 0 }
//         productAgg[nome].kg += kg
//         productAgg[nome].valor += prodValor
//         supplierAgg[supplierName] = supplierAgg[supplierName] || { kg: 0, valor: 0 }
//         supplierAgg[supplierName].kg += kg
//         supplierAgg[supplierName].valor += prodValor + pedidoValor
//         subcatAgg[sub] = (subcatAgg[sub] || 0) + kg
//         if (mIdx !== null) {
//           months[mIdx].kg += kg
//           months[mIdx].valor += prodValor + pedidoValor
//         }
//         rows.push({
//           id: rows.length + 1,
//           chaveAcesso: o.chaveAcesso || "-",
//           dataPedido: o.dataPedido,
//           fornecedor: supplierName,
//           produto: nome,
//           subCategoria: sub,
//           kg: Number(kg.toFixed(3)),
//           valor: Number((prodValor + pedidoValor).toFixed(3)),
//           contato: o.fornecedor?.contato || "-",
//           telefone: o.fornecedor?.telefone || "-",
//           email: o.fornecedor?.email || "-",
//         })
//       }
//     }

//     const rankedByProduct = Object.entries(productAgg)
//       .map(([name, v]) => ({ name, kg: Number(v.kg.toFixed(3)), valor: Number(v.valor.toFixed(3)) }))
//       .sort((a, b) => b.kg - a.kg)

//     const supplierRanking = Object.entries(supplierAgg)
//       .map(([name, v]) => ({ name, kg: Number(v.kg.toFixed(3)), valor: Number(v.valor.toFixed(3)) }))
//       .sort((a, b) => b.valor - a.valor)

//     const pieDataSubcat = Object.entries(subcatAgg).map(([name, value]) => ({ name, value: Number(value.toFixed(3)) }))

//     const subcategoriesList = Object.keys(subcatAgg)
//     const subcatSupplierData = Object.entries(supplierAgg).map(([supplier, v]) => {
//       const obj = { fornecedor: supplier, investimento: Number(v.valor.toFixed(3)) }
//       subcategoriesList.forEach((sub) => {
//         const sum = rows
//           .filter((r) => r.fornecedor === supplier && r.subCategoria === sub)
//           .reduce((a, c) => a + (c.kg || 0), 0)
//         obj[sub] = Number(sum.toFixed(3))
//       })
//       return obj
//     })

//     months.forEach((m) => {
//       m.kg = Number(m.kg.toFixed(3))
//       m.valor = Number(m.valor.toFixed(3))
//     })
//     const mesesComValor = months.filter((m) => m.valor > 0).length || 1
//     const mediaMensal = totalValor / mesesComValor
//     const perCapita = totalValor / (totalKg || 1)
//     const topProduct = rankedByProduct[0] || null

//     return {
//       totalsAll: {
//         kg: Number(totalKg.toFixed(3)),
//         valor: Number(totalValor.toFixed(3)),
//         mediaMensal: Number(mediaMensal.toFixed(2)),
//         perCapita: Number(perCapita.toFixed(2)),
//       },
//       monthlySeries: months,
//       rankedByProduct,
//       supplierRanking,
//       pieDataSubcat,
//       subcatSupplierData,
//       subcategoriesList,
//       tableRows: rows,
//       topProduct,
//     }
//   }, [filteredOrders])

//   const columns = [
//     { field: "chaveAcesso", headerName: "Pedido", width: 150 },
//     { field: "dataPedido", headerName: "Data", width: 110 },
//     { field: "fornecedor", headerName: "Fornecedor", flex: 1 },
//     { field: "produto", headerName: "Produto", flex: 1 },
//     { field: "kg", headerName: "Kg", type: "number", width: 110, valueFormatter: ({ value }) => formatWeight(value) },
//     {
//       field: "valor",
//       headerName: "R$",
//       type: "number",
//       width: 130,
//       valueFormatter: ({ value }) =>
//         Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 3 }),
//     },
//     {
//       field: "acoes",
//       headerName: "Ações",
//       width: 100,
//       sortable: false,
//       renderCell: (params) => (
//         <MuiTooltip title="Ver detalhes">
//           <IconButton
//             size="small"
//             onClick={() => {
//               setDetailRow(params.row)
//               setOpenDetail(true)
//             }}
//             sx={{
//               transition: "all 0.2s ease",
//               ":hover": {
//                 bgcolor: "#eff6ff",
//                 color: "#1e40af",
//                 transform: "scale(1.1)",
//               },
//             }}
//           >
//             <Info size={18} />
//           </IconButton>
//         </MuiTooltip>
//       ),
//     },
//   ]

//   if (loading)
//     return (
//       <Box display="flex" alignItems="center" justifyContent="center" minHeight="50vh">
//         <Typography sx={{ color: "#64748b", fontWeight: 500 }}>Carregando dados...</Typography>
//       </Box>
//     )
//   if (error)
//     return (
//       <Box display="flex" alignItems="center" justifyContent="center" minHeight="50vh">
//         <Typography color="error" sx={{ fontWeight: 500 }}>
//           Erro: {error}
//         </Typography>
//       </Box>
//     )

//   return (
//     <Box
//       p={4}
//       sx={{
//         background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)",
//         minHeight: "100vh",
//       }}
//     >
//       <Box mb={5}>
//         <Typography
//           variant="h3"
//           sx={{
//             fontWeight: 800,
//             color: "#0f172a",
//             mb: 1.5,
//             letterSpacing: "-0.05em",
//             background: "linear-gradient(135deg, #1e40af 0%, #0891b2 100%)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//             backgroundClip: "text",
//           }}
//         >
//           Dashboard de Compras
//         </Typography>
//         <Typography
//           variant="body1"
//           sx={{
//             color: "#64748b",
//             fontWeight: 500,
//             fontSize: "1.125rem",
//             letterSpacing: "-0.01em",
//           }}
//         >
//           Análise executiva de investimentos e performance de fornecedores
//         </Typography>
//       </Box>

//       <Card
//         sx={{
//           mb: 4,
//           boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
//           borderRadius: 3,
//           border: "1px solid #e2e8f0",
//           background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
//         }}
//       >
//         <CardContent sx={{ p: 4 }}>
//           <Grid container spacing={3} alignItems="center">
//             <Grid item xs={12} md={9}>
//               <Box display="flex" gap={2} flexWrap="wrap">
//                 <TextField
//                   select
//                   size="small"
//                   label="Mês"
//                   value={selectedMonth}
//                   onChange={(e) => setSelectedMonth(e.target.value)}
//                   sx={{
//                     minWidth: 150,
//                     "& .MuiOutlinedInput-root": {
//                       borderRadius: 2,
//                       transition: "all 0.2s ease",
//                       "&:hover": {
//                         boxShadow: "0 0 0 3px rgba(30, 64, 175, 0.1)",
//                       },
//                       "&.Mui-focused": {
//                         boxShadow: "0 0 0 3px rgba(30, 64, 175, 0.15)",
//                       },
//                     },
//                   }}
//                 >
//                   <MenuItem value="">Todos os meses</MenuItem>
//                   {MONTHS_PT.map((m, i) => (
//                     <MenuItem key={m} value={i}>
//                       {m}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//                 <TextField
//                   select
//                   size="small"
//                   label="Categoria"
//                   value={activeTab}
//                   onChange={(e) => setActiveTab(e.target.value)}
//                   sx={{
//                     minWidth: 150,
//                     "& .MuiOutlinedInput-root": {
//                       borderRadius: 2,
//                       transition: "all 0.2s ease",
//                       "&:hover": {
//                         boxShadow: "0 0 0 3px rgba(30, 64, 175, 0.1)",
//                       },
//                       "&.Mui-focused": {
//                         boxShadow: "0 0 0 3px rgba(30, 64, 175, 0.15)",
//                       },
//                     },
//                   }}
//                 >
//                   {TAB_LIST.map((t) => (
//                     <MenuItem key={t} value={t}>
//                       {t}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//                 <TextField
//                   size="small"
//                   label="Produto"
//                   value={qProduct}
//                   onChange={(e) => setQProduct(e.target.value)}
//                   sx={{
//                     minWidth: 150,
//                     "& .MuiOutlinedInput-root": {
//                       borderRadius: 2,
//                       transition: "all 0.2s ease",
//                       "&:hover": {
//                         boxShadow: "0 0 0 3px rgba(30, 64, 175, 0.1)",
//                       },
//                       "&.Mui-focused": {
//                         boxShadow: "0 0 0 3px rgba(30, 64, 175, 0.15)",
//                       },
//                     },
//                   }}
//                 />
//                 <TextField
//                   size="small"
//                   label="Fornecedor"
//                   value={qSupplier}
//                   onChange={(e) => setQSupplier(e.target.value)}
//                   sx={{
//                     minWidth: 150,
//                     "& .MuiOutlinedInput-root": {
//                       borderRadius: 2,
//                       transition: "all 0.2s ease",
//                       "&:hover": {
//                         boxShadow: "0 0 0 3px rgba(30, 64, 175, 0.1)",
//                       },
//                       "&.Mui-focused": {
//                         boxShadow: "0 0 0 3px rgba(30, 64, 175, 0.15)",
//                       },
//                     },
//                   }}
//                 />
//                 <TextField
//                   size="small"
//                   label="Subcategoria"
//                   value={qSubcat}
//                   onChange={(e) => setQSubcat(e.target.value)}
//                   sx={{
//                     minWidth: 150,
//                     "& .MuiOutlinedInput-root": {
//                       borderRadius: 2,
//                       transition: "all 0.2s ease",
//                       "&:hover": {
//                         boxShadow: "0 0 0 3px rgba(30, 64, 175, 0.1)",
//                       },
//                       "&.Mui-focused": {
//                         boxShadow: "0 0 0 3px rgba(30, 64, 175, 0.15)",
//                       },
//                     },
//                   }}
//                 />
//               </Box>
//             </Grid>
//             <Grid item xs={12} md={3} textAlign="right">
//               <Button
//                 variant="contained"
//                 startIcon={<Download size={18} />}
//                 onClick={() =>
//                   exportToExcel([
//                     { sheet: tableRows, name: "Pedidos_Reduzidos" },
//                     { sheet: rankedByProduct, name: "Ranking_Produtos" },
//                     { sheet: supplierRanking, name: "Ranking_Fornecedores" },
//                     { sheet: monthlySeries, name: "Evolucao_Mensal" },
//                   ])
//                 }
//                 sx={{
//                   background: "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)",
//                   textTransform: "none",
//                   fontWeight: 700,
//                   px: 4,
//                   py: 1.5,
//                   borderRadius: 2,
//                   boxShadow: "0 4px 6px -1px rgba(30, 64, 175, 0.3)",
//                   transition: "all 0.3s ease",
//                   ":hover": {
//                     background: "linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)",
//                     boxShadow: "0 10px 15px -3px rgba(30, 64, 175, 0.4)",
//                     transform: "translateY(-2px)",
//                   },
//                 }}
//               >
//                 Exportar Excel
//               </Button>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>

//       <Grid container spacing={3} mb={4}>
//         {[
//           {
//             title: "Total Investido",
//             value: totalsAll.valor,
//             format: (v) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
//             icon: <DollarSign size={40} strokeWidth={2.5} />,
//             gradient: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
//             shadowColor: "rgba(30, 64, 175, 0.3)",
//           },
//           {
//             title: "Média Mensal",
//             value: totalsAll.mediaMensal,
//             format: (v) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
//             icon: <TrendingUp size={40} strokeWidth={2.5} />,
//             gradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
//             shadowColor: "rgba(5, 150, 105, 0.3)",
//           },
//           {
//             title: "Per Capita (R$/Kg)",
//             value: totalsAll.perCapita,
//             format: (v) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
//             icon: <BarChart3 size={40} strokeWidth={2.5} />,
//             gradient: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
//             shadowColor: "rgba(124, 58, 237, 0.3)",
//           },
//           {
//             title: "Volume Total",
//             value: totalsAll.kg,
//             format: (v) => formatWeight(v),
//             icon: <Package size={40} strokeWidth={2.5} />,
//             gradient: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
//             shadowColor: "rgba(8, 145, 178, 0.3)",
//           },
//         ].map((c, i) => (
//           <Grid item xs={12} sm={6} md={3} key={i}>
//             <Card
//               sx={{
//                 boxShadow: `0 4px 6px -1px ${c.shadowColor}`,
//                 borderRadius: 3,
//                 border: "1px solid rgba(255, 255, 255, 0.8)",
//                 background: c.gradient,
//                 position: "relative",
//                 overflow: "hidden",
//                 transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//                 "&::before": {
//                   content: '""',
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   bottom: 0,
//                   background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
//                   pointerEvents: "none",
//                 },
//                 ":hover": {
//                   boxShadow: `0 20px 25px -5px ${c.shadowColor}`,
//                   transform: "translateY(-8px) scale(1.02)",
//                 },
//               }}
//             >
//               <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
//                 <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       color: "rgba(255, 255, 255, 0.9)",
//                       fontWeight: 700,
//                       textTransform: "uppercase",
//                       fontSize: "0.75rem",
//                       letterSpacing: "0.1em",
//                     }}
//                   >
//                     {c.title}
//                   </Typography>
//                   <Box sx={{ color: "rgba(255, 255, 255, 0.9)" }}>{c.icon}</Box>
//                 </Box>
//                 <Typography
//                   variant="h3"
//                   sx={{
//                     fontWeight: 800,
//                     color: "#ffffff",
//                     mb: 1,
//                     letterSpacing: "-0.02em",
//                   }}
//                 >
//                   <CountUp
//                     end={c.value}
//                     duration={2.5}
//                     decimals={2}
//                     separator="."
//                     decimal=","
//                     prefix={c.title.includes("R$") ? "" : ""}
//                   />
//                 </Typography>
//                 <Typography
//                   variant="body2"
//                   sx={{
//                     color: "rgba(255, 255, 255, 0.8)",
//                     fontWeight: 600,
//                     fontSize: "0.875rem",
//                   }}
//                 >
//                   {c.format(c.value)}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       <CardChart
//         title="Evolução Mensal (Kg & R$)"
//         refChart={refMonthly}
//         height={400}
//         namePNG="EvolucaoMensal"
//         onDownload={downloadChartPNG}
//       >
//         <ResponsiveContainer width="100%" height="100%">
//           <ComposedChart data={monthlySeries}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//             <XAxis
//               dataKey="month"
//               tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
//               axisLine={{ stroke: "#cbd5e1" }}
//             />
//             <YAxis
//               yAxisId="left"
//               tickFormatter={(v) => formatWeight(v)}
//               tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
//               axisLine={{ stroke: "#cbd5e1" }}
//             />
//             <YAxis
//               yAxisId="right"
//               orientation="right"
//               tickFormatter={(v) => `R$ ${v}`}
//               tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
//               axisLine={{ stroke: "#cbd5e1" }}
//             />
//             <RechartTooltip
//               formatter={(v, name) => (name === "valor" ? [`R$ ${v}`, "Investimento"] : [formatWeight(v), "Kg"])}
//               contentStyle={{
//                 borderRadius: 12,
//                 border: "1px solid #e2e8f0",
//                 boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
//                 fontWeight: 600,
//               }}
//             />
//             <Legend wrapperStyle={{ paddingTop: 20, fontWeight: 600 }} />
//             <Bar yAxisId="left" dataKey="kg" name="Kg" fill="#1e40af" radius={[8, 8, 0, 0]} />
//             <Line
//               yAxisId="right"
//               dataKey="valor"
//               name="R$"
//               stroke="#059669"
//               strokeWidth={3}
//               dot={{ r: 5, fill: "#059669", strokeWidth: 2, stroke: "#fff" }}
//             />
//           </ComposedChart>
//         </ResponsiveContainer>
//       </CardChart>

//       <CardChart
//         title="Top Produtos (Kg)"
//         refChart={refTopProducts}
//         height={400}
//         namePNG="TopProdutos"
//         onDownload={downloadChartPNG}
//       >
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart layout="vertical" data={rankedByProduct.slice(0, 12)}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//             <XAxis
//               type="number"
//               tickFormatter={(v) => formatWeight(v)}
//               tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
//               axisLine={{ stroke: "#cbd5e1" }}
//             />
//             <YAxis
//               dataKey="name"
//               type="category"
//               width={150}
//               tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
//               axisLine={{ stroke: "#cbd5e1" }}
//             />
//             <RechartTooltip
//               formatter={(v) => formatWeight(v)}
//               contentStyle={{
//                 borderRadius: 12,
//                 border: "1px solid #e2e8f0",
//                 boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
//                 fontWeight: 600,
//               }}
//             />
//             <Bar dataKey="kg" fill="#0891b2" radius={[0, 8, 8, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </CardChart>

//       <CardChart
//         title="Ranking de Fornecedores (Kg & R$)"
//         refChart={refSupplierComp}
//         height={400}
//         namePNG="RankingFornecedores"
//         onDownload={downloadChartPNG}
//       >
//         <ResponsiveContainer width="100%" height="100%">
//           <ComposedChart layout="vertical" data={supplierRanking}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//             <XAxis
//               type="number"
//               tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
//               axisLine={{ stroke: "#cbd5e1" }}
//             />
//             <YAxis
//               dataKey="name"
//               type="category"
//               width={150}
//               tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
//               axisLine={{ stroke: "#cbd5e1" }}
//             />
//             <RechartTooltip
//               formatter={(v, name) => (name === "valor" ? [`R$ ${v}`, "Investimento"] : [formatWeight(v), "Kg"])}
//               contentStyle={{
//                 borderRadius: 12,
//                 border: "1px solid #e2e8f0",
//                 boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
//                 fontWeight: 600,
//               }}
//             />
//             <Legend wrapperStyle={{ paddingTop: 20, fontWeight: 600 }} />
//             <Bar dataKey="kg" fill="#7c3aed" name="Kg" radius={[0, 8, 8, 0]} />
//             <Line
//               dataKey="valor"
//               stroke="#059669"
//               strokeWidth={3}
//               name="R$"
//               dot={{ r: 5, fill: "#059669", strokeWidth: 2, stroke: "#fff" }}
//             />
//           </ComposedChart>
//         </ResponsiveContainer>
//       </CardChart>

//       <CardChart
//         title="Distribuição por Subcategoria (Kg)"
//         refChart={refSubcat}
//         height={590}
//         namePNG="DistribuicaoSubcat"
//         onDownload={downloadChartPNG}
//       >
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={pieDataSubcat}
//               dataKey="value"
//               nameKey="name"
//               outerRadius={120}
//               label={(entry) => `${entry.name}: ${formatWeight(entry.value)}`}
//               labelLine={{ stroke: "#64748b", strokeWidth: 2 }}
//             >
//               {pieDataSubcat.map((entry, i) => (
//                 <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
//               ))}
//             </Pie>
//             <Legend wrapperStyle={{ paddingTop: 20, fontWeight: 600 }} />
//             <RechartTooltip
//               formatter={(v) => formatWeight(v)}
//               contentStyle={{
//                 borderRadius: 12,
//                 border: "1px solid #e2e8f0",
//                 boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
//                 fontWeight: 600,
//               }}
//             />
//           </PieChart>
//         </ResponsiveContainer>
//       </CardChart>

//       <CardChart
//         title="Subcategoria × Fornecedor (Kg)"
//         refChart={refSubcatSupplier}
//         height={400}
//         namePNG="SubcatFornecedor"
//         onDownload={downloadChartPNG}
//       >
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={subcatSupplierData} layout="vertical">
//             <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//             <XAxis
//               type="number"
//               tickFormatter={(v) => formatWeight(v)}
//               tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
//               axisLine={{ stroke: "#cbd5e1" }}
//             />
//             <YAxis
//               dataKey="fornecedor"
//               type="category"
//               width={150}
//               tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
//               axisLine={{ stroke: "#cbd5e1" }}
//             />
//             <RechartTooltip
//               formatter={(v) => formatWeight(v)}
//               contentStyle={{
//                 borderRadius: 12,
//                 border: "1px solid #e2e8f0",
//                 boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
//                 fontWeight: 600,
//               }}
//             />
//             <Legend wrapperStyle={{ paddingTop: 20, fontWeight: 600 }} />
//             {subcategoriesList.map((s, i) => (
//               <Bar key={s} dataKey={s} stackId="a" fill={PIE_COLORS[i % PIE_COLORS.length]} />
//             ))}
//           </BarChart>
//         </ResponsiveContainer>
//       </CardChart>

//       <Card
//         sx={{
//           boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
//           borderRadius: 3,
//           border: "1px solid #e2e8f0",
//           background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
//         }}
//       >
//         <CardContent sx={{ height: "600px", width: "100%", p: 4 }}>
//           <Typography
//             variant="h6"
//             gutterBottom
//             sx={{
//               fontWeight: 700,
//               color: "#0f172a",
//               mb: 3,
//               letterSpacing: "-0.025em",
//             }}
//           >
//             Tabela de Pedidos
//           </Typography>
//           <Box sx={{ height: "calc(100% - 48px)", width: "100%" }}>
//             <DataGrid
//               rows={tableRows}
//               columns={columns}
//               pageSize={10}
//               disableRowSelectionOnClick
//               sx={{
//                 border: 0,
//                 background: "white",
//                 borderRadius: 2,
//                 "& .MuiDataGrid-columnHeaders": {
//                   bgcolor: "#f8fafc",
//                   color: "#475569",
//                   fontWeight: 700,
//                   fontSize: "0.875rem",
//                   borderRadius: "8px 8px 0 0",
//                 },
//                 "& .MuiDataGrid-cell": {
//                   borderColor: "#e2e8f0",
//                   fontWeight: 500,
//                 },
//                 "& .MuiDataGrid-row": {
//                   transition: "all 0.2s ease",
//                   "&:hover": {
//                     bgcolor: "#f8fafc",
//                     transform: "scale(1.001)",
//                   },
//                 },
//               }}
//             />
//           </Box>
//         </CardContent>
//       </Card>

//       <Dialog
//         open={openDetail}
//         onClose={() => setOpenDetail(false)}
//         PaperProps={{
//           sx: {
//             borderRadius: 3,
//             minWidth: 450,
//             boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
//             background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
//           },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             fontWeight: 700,
//             color: "#0f172a",
//             borderBottom: "2px solid #e2e8f0",
//             fontSize: "1.25rem",
//             letterSpacing: "-0.025em",
//             background: "linear-gradient(135deg, #1e40af 0%, #0891b2 100%)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//             backgroundClip: "text",
//           }}
//         >
//           Detalhes do Pedido
//         </DialogTitle>
//         <DialogContent sx={{ pt: 4, pb: 3 }}>
//           {detailRow && (
//             <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//               <Box>
//                 <Typography
//                   variant="caption"
//                   sx={{
//                     color: "#64748b",
//                     fontWeight: 700,
//                     textTransform: "uppercase",
//                     fontSize: "0.75rem",
//                     letterSpacing: "0.1em",
//                   }}
//                 >
//                   Pedido
//                 </Typography>
//                 <Typography
//                   variant="body1"
//                   sx={{
//                     color: "#0f172a",
//                     fontWeight: 600,
//                     mt: 0.5,
//                   }}
//                 >
//                   {detailRow.chaveAcesso}
//                 </Typography>
//               </Box>
//               <Box>
//                 <Typography
//                   variant="caption"
//                   sx={{
//                     color: "#64748b",
//                     fontWeight: 700,
//                     textTransform: "uppercase",
//                     fontSize: "0.75rem",
//                     letterSpacing: "0.1em",
//                   }}
//                 >
//                   Fornecedor
//                 </Typography>
//                 <Typography
//                   variant="body1"
//                   sx={{
//                     color: "#0f172a",
//                     fontWeight: 600,
//                     mt: 0.5,
//                   }}
//                 >
//                   {detailRow.fornecedor}
//                 </Typography>
//               </Box>
//               <Box>
//                 <Typography
//                   variant="caption"
//                   sx={{
//                     color: "#64748b",
//                     fontWeight: 700,
//                     textTransform: "uppercase",
//                     fontSize: "0.75rem",
//                     letterSpacing: "0.1em",
//                   }}
//                 >
//                   Produto
//                 </Typography>
//                 <Typography
//                   variant="body1"
//                   sx={{
//                     color: "#0f172a",
//                     fontWeight: 600,
//                     mt: 0.5,
//                   }}
//                 >
//                   {detailRow.produto}
//                 </Typography>
//               </Box>
//               <Box>
//                 <Typography
//                   variant="caption"
//                   sx={{
//                     color: "#64748b",
//                     fontWeight: 700,
//                     textTransform: "uppercase",
//                     fontSize: "0.75rem",
//                     letterSpacing: "0.1em",
//                   }}
//                 >
//                   Subcategoria
//                 </Typography>
//                 <Chip
//                   label={detailRow.subCategoria}
//                   size="small"
//                   sx={{
//                     mt: 1,
//                     background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
//                     color: "#1e40af",
//                     fontWeight: 700,
//                     borderRadius: 2,
//                     px: 1,
//                   }}
//                 />
//               </Box>
//               <Box display="flex" gap={3}>
//                 <Box
//                   flex={1}
//                   sx={{
//                     p: 2,
//                     borderRadius: 2,
//                     background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
//                     border: "1px solid #bbf7d0",
//                   }}
//                 >
//                   <Typography
//                     variant="caption"
//                     sx={{
//                       color: "#059669",
//                       fontWeight: 700,
//                       textTransform: "uppercase",
//                       fontSize: "0.75rem",
//                       letterSpacing: "0.1em",
//                     }}
//                   >
//                     Peso
//                   </Typography>
//                   <Typography
//                     variant="h6"
//                     sx={{
//                       color: "#059669",
//                       fontWeight: 800,
//                       mt: 0.5,
//                     }}
//                   >
//                     {formatWeight(detailRow.kg)}
//                   </Typography>
//                 </Box>
//                 <Box
//                   flex={1}
//                   sx={{
//                     p: 2,
//                     borderRadius: 2,
//                     background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
//                     border: "1px solid #bfdbfe",
//                   }}
//                 >
//                   <Typography
//                     variant="caption"
//                     sx={{
//                       color: "#1e40af",
//                       fontWeight: 700,
//                       textTransform: "uppercase",
//                       fontSize: "0.75rem",
//                       letterSpacing: "0.1em",
//                     }}
//                   >
//                     Valor
//                   </Typography>
//                   <Typography
//                     variant="h6"
//                     sx={{
//                       color: "#1e40af",
//                       fontWeight: 800,
//                       mt: 0.5,
//                     }}
//                   >
//                     R$ {detailRow.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions sx={{ p: 3, borderTop: "2px solid #e2e8f0" }}>
//           <Button
//             onClick={() => setOpenDetail(false)}
//             variant="contained"
//             sx={{
//               background: "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)",
//               textTransform: "none",
//               fontWeight: 700,
//               px: 4,
//               py: 1.5,
//               borderRadius: 2,
//               boxShadow: "0 4px 6px -1px rgba(30, 64, 175, 0.3)",
//               transition: "all 0.3s ease",
//               ":hover": {
//                 background: "linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)",
//                 boxShadow: "0 10px 15px -3px rgba(30, 64, 175, 0.4)",
//                 transform: "translateY(-2px)",
//               },
//             }}
//           >
//             Fechar
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   )
// }


"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ref as fbRef, onValue } from "firebase/database"
import { db, isConfigured } from "../../../../firebase"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  MenuItem,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  InputAdornment,
} from "@mui/material"
import { Download } from "lucide-react"
import { DataGrid } from "@mui/x-data-grid"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartTooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import * as htmlToImage from "html-to-image"
import * as XLSX from "xlsx"

const MONTHS_PT = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]
const PIE_COLORS = ["#1e3a8a", "#0369a1", "#0d9488", "#6366f1", "#dc2626", "#f97316", "#64748b"]

const formatBR = (v) =>
  `R$ ${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const formatWeight = (value) => {
  const num = Number.parseFloat(value)
  if (!isFinite(num)) return "-"
  if (num >= 1000) return `${(num / 1000).toFixed(2)} t`
  return `${num.toFixed(2)} Kg`
}

const parseDate = (v) => {
  if (!v) return null
  const d = typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? new Date(`${v}T00:00:00`) : new Date(v)
  return isNaN(d.getTime()) ? null : d
}

const safeNumber = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

const parseProduct = (p) =>
  p
    ? {
        nome: p.nome || p.name || p.produto || "Sem nome",
        name: p.nome || p.name || p.produto || "Sem nome",
        quantidade: safeNumber(p.quantidade ?? p.peso ?? p.kg ?? 0),
        valor: safeNumber(p.totalPrice ?? p.valor ?? p.preco ?? 0),
        subCategoria: p.subCategoria || p.subcategory || p.tipo || "Outros",
        tipo: p.tipo || p.subCategoria || p.tipoProduto || "Outros",
      }
    : { nome: "Sem nome", name: "Sem nome", quantidade: 0, valor: 0, subCategoria: "Outros", tipo: "Outros" }

export default function DashboardComprasModernTabs() {
  // raw orders
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // UI
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("")
  const [openDetail, setOpenDetail] = useState(false)
  const [detailContext, setDetailContext] = useState(null)
  const [pessoasAtendidas, setPessoasAtendidas] = useState(1)

  // refs for png export
  const refChartMain = useRef(null)
  const refChartKg = useRef(null)
  const refTopProducts = useRef(null)
  const refProteins = useRef(null)

  // load firebase
  useEffect(() => {
    if (!isConfigured) {
      setError("Firebase não configurado")
      setLoading(false)
      return
    }
    const r = fbRef(db, "novosPedidos")
    const unsubscribe = onValue(
      r,
      (snapshot) => {
        const val = snapshot.val() || {}
        const arr = Object.entries(val)
          .map(([key, v]) => {
            const produtosRaw = v.produtos ?? v.items ?? []
            const produtosArr = Array.isArray(produtosRaw)
              ? produtosRaw.map((p) => parseProduct(p))
              : Object.values(produtosRaw).map((p) => parseProduct(p))
            return {
              id: key,
              ...v,
              produtos: produtosArr,
              fornecedor:
                (typeof v.fornecedor === "string" && v.fornecedor) ||
                v.fornecedor?.razaoSocial ||
                v.razaoSocial ||
                v.fornecedorName ||
                "",
              dataPedido: v.dataPedido || v.periodoInicio || v.periodo || v.createdAt || "",
              category: (v.category || v.categoria || v.grupo || "").toString(),
              kilosTotais:
                safeNumber(v.kilosTotais ?? v.kilos ?? v.kilosTotal) ||
                produtosArr.reduce((a, p) => a + (p.quantidade || 0), 0),
              valorPedido: safeNumber(v.valorTotal ?? v.totalPedido ?? v.pedidoValor ?? 0),
              status: (v.status || v.situacao || "").toString(),
            }
          })
          .filter((o) => (o.status || "").toLowerCase() === "aprovado" || (o.status || "").toLowerCase() === "aprovada")
        arr.sort((a, b) => new Date(b.dataPedido || 0) - new Date(a.dataPedido || 0))
        setOrders(arr)
        setLoading(false)
      },
      (err) => {
        setError(err.message || "Erro ao carregar dados")
        setLoading(false)
      },
    )
    return () => {
      try {
        unsubscribe()
      } catch (e) {}
    }
  }, [])

  // AGGREGATIONS
  const {
    categoryMonthlyRows,
    categoriesList,
    monthlyTotalsSeriesValor,
    monthlyTotalsSeriesKg,
    topProductsByCategoryMonth,
    totalsSummary,
    productsByTypeSummary,
    topProductsForCharts,
  } = useMemo(() => {
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

      detailMap[cat][mIdx].push({
        orderId: o.id,
        numeroPedido: o.numeroPedido || o.chaveAcesso || "-",
        fornecedor: o.fornecedor || "-",
        dataPedido: o.dataPedido,
        produtos: products,
        kilosTotais: kgOrder,
        valorPedido: valorTotalOrder,
      })

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
      MONTHS_PT.forEach((m, i) => {
        row[m] = Number(months[i].toFixed(2))
      })
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
          for (const p of ord.produtos) {
            prodAgg[p.name] = prodAgg[p.name] || { kg: 0, valor: 0 }
            prodAgg[p.name].kg += p.quantidade || 0
            prodAgg[p.name].valor += p.valor || 0
          }
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

    const typeSummary = Object.entries(typeMap).map(([tipo, v]) => ({
      tipo,
      kg: Number(v.kg.toFixed(3)),
      valor: Number(v.valor.toFixed(2)),
      topProdutos: Object.entries(v.produtos)
        .map(([n, vv]) => ({ nome: n, kg: Number(vv.kg.toFixed(3)), valor: Number(vv.valor.toFixed(2)) }))
        .sort((a, b) => b.kg - a.kg),
    }))

    const prodArr = Object.entries(prodAggGlobal).map(([name, v]) => ({
      name,
      kg: Number(v.kg.toFixed(3)),
      valor: Number(v.valor.toFixed(2)),
    }))
    const topByKg = prodArr
      .slice()
      .sort((a, b) => b.kg - a.kg)
      .slice(0, 12)
    const topByValor = prodArr
      .slice()
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 12)

    return {
      categoryMonthlyRows: categoryRows.sort((a, b) => b.total - a.total),
      categoriesList: Object.keys(categoryMonthlyAgg),
      monthlyTotalsSeriesValor: monthlySeriesValor,
      monthlyTotalsSeriesKg: monthlySeriesKg,
      topProductsByCategoryMonth: topProductsMap,
      totalsSummary: {
        totalValor: Number(globalValor.toFixed(2)),
        totalKg: Number(globalKg.toFixed(3)),
        mediaMensal: Number(mediaMensal.toFixed(2)),
        perCapita: Number(perCapita.toFixed(2)),
        mesesComMovimento: monthlyTotalsValor.filter((v) => v > 0).length,
        pedidosAprovados: orders.length,
      },
      productsByTypeSummary: typeSummary.sort((a, b) => b.valor - a.valor),
      topProductsForCharts: { byKg: topByKg, byValor: topByValor },
    }
  }, [orders, selectedYear])

  const handleOpenDetail = ({ categoria, monthIndex }) => {
    const key = `${categoria}|${monthIndex}`
    const products = (topProductsByCategoryMonth && topProductsByCategoryMonth[key]) || []
    let totalValor = 0
    let totalKg = 0
    const tipoAgg = {}
    const ordersList = []
    for (const o of orders) {
      const date = parseDate(o.dataPedido)
      if (!date) continue
      if (date.getFullYear() !== Number(selectedYear)) continue
      if (date.getMonth() !== monthIndex) continue
      const cat = (o.category || "Sem categoria").toString()
      if (cat !== categoria) continue
      const produtos = (o.produtos || []).map(parseProduct)
      const valorOrder = safeNumber(o.valorPedido) || produtos.reduce((a, p) => a + (p.valor || 0), 0)
      const kgOrder = safeNumber(o.kilosTotais) || produtos.reduce((a, p) => a + (p.quantidade || 0), 0)
      totalValor += valorOrder
      totalKg += kgOrder
      ordersList.push({
        id: o.id,
        numeroPedido: o.numeroPedido || o.chaveAcesso || "-",
        fornecedor: o.fornecedor || "-",
        dataPedido: o.dataPedido,
        kg: kgOrder,
        valor: valorOrder,
        produtos,
      })
      for (const p of produtos) {
        const tipo = p.tipo || p.subCategoria || "Outros"
        tipoAgg[tipo] = tipoAgg[tipo] || { kg: 0, valor: 0 }
        tipoAgg[tipo].kg += p.quantidade || 0
        tipoAgg[tipo].valor += p.valor || 0
      }
    }
    const tipos = Object.entries(tipoAgg)
      .map(([tipo, v]) => ({ tipo, kg: Number(v.kg.toFixed(3)), valor: Number(v.valor.toFixed(2)) }))
      .sort((a, b) => b.valor - a.valor)

    setDetailContext({
      categoria,
      monthIndex,
      products,
      ordersList,
      totalValor: Number(totalValor.toFixed(2)),
      totalKg: Number(totalKg.toFixed(3)),
      tipos,
    })
    setOpenDetail(true)
  }

  const exportCategoryTableToExcel = () => {
    const sheetData = categoryMonthlyRows.map((r) => {
      const row = { Categoria: r.categoria }
      MONTHS_PT.forEach((m) => {
        row[m] = r[m] ? Number(r[m].toFixed(2)) : 0
      })
      row.Total = r.total
      return row
    })
    const ws = XLSX.utils.json_to_sheet(sheetData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, `Categorias_${selectedYear}`)
    XLSX.writeFile(wb, `categorias_${selectedYear}.xlsx`)
  }

  const exportRefToPNG = async (refElem, fileName = "chart.png") => {
    if (!refElem?.current) return
    try {
      const dataUrl = await htmlToImage.toPng(refElem.current, { cacheBust: true })
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = fileName
      link.click()
    } catch (err) {
      console.error("Erro export PNG:", err)
    }
  }

  const yearsAvailable = useMemo(() => {
    const ys = new Set()
    for (const o of orders) {
      const d = parseDate(o.dataPedido)
      if (d) ys.add(d.getFullYear())
    }
    const arr = Array.from(ys).sort((a, b) => b - a)
    if (!arr.includes(selectedYear)) arr.unshift(selectedYear)
    return arr
  }, [orders, selectedYear])

  const totals = totalsSummary || {}

  if (loading)
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="50vh">
        <Typography sx={{ color: "#64748b", fontWeight: 500 }}>Carregando dados...</Typography>
      </Box>
    )
  if (error)
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="50vh">
        <Typography color="error" sx={{ fontWeight: 500 }}>
          Erro: {error}
        </Typography>
      </Box>
    )

  return (
    <Box p={3} sx={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header Section */}
      <Box mb={4} sx={{ borderBottom: "1px solid #e2e8f0", pb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}>
          Gerenciamento de Compras
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b" }}>
          Análise detalhada de investimentos, categorias e tipos de produtos por período
        </Typography>
      </Box>

      {/* Controls Section */}
      <Card sx={{ mb: 4, p: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Ano"
              size="small"
              fullWidth
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              variant="outlined"
            >
              {yearsAvailable.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              size="small"
              label="Filtrar categoria"
              fullWidth
              value={activeCategoryFilter}
              onChange={(e) => setActiveCategoryFilter(e.target.value)}
              placeholder="Todas"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="number"
              size="small"
              label="Pessoas atendidas"
              fullWidth
              value={pessoasAtendidas}
              onChange={(e) => setPessoasAtendidas(Math.max(1, safeNumber(e.target.value)))}
              variant="outlined"
              InputProps={{
                startAdornment: <InputAdornment position="start">#</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Download size={16} />}
              onClick={exportCategoryTableToExcel}
              sx={{ textTransform: "none" }}
            >
              Exportar
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* KPI Cards - Enhanced Design */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
              color: "white",
              boxShadow: "0 4px 12px rgba(30, 58, 138, 0.15)",
            }}
          >
            <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
              Total Investido
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, my: 1 }}>
              {formatBR(totals.totalValor ?? 0)}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Média: {formatBR(totals.mediaMensal ?? 0)}/mês
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #0369a1 0%, #0891b2 100%)",
              color: "white",
              boxShadow: "0 4px 12px rgba(3, 105, 161, 0.15)",
            }}
          >
            <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
              Per Capita
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, my: 1 }}>
              {formatBR((totals.totalValor ?? 0) / (pessoasAtendidas || 1))}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Por {pessoasAtendidas} pessoa{pessoasAtendidas !== 1 ? "s" : ""}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
              color: "white",
              boxShadow: "0 4px 12px rgba(13, 148, 136, 0.15)",
            }}
          >
            <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
              Total Kg
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, my: 1 }}>
              {formatWeight(totals.totalKg ?? 0)}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Produto aprovado
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)",
              color: "white",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.15)",
            }}
          >
            <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
              Meses com movimento
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, my: 1 }}>
              {totals.mesesComMovimento ?? 0}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {totals.pedidosAprovados ?? 0} pedidos
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Charts - Stacked Vertically */}
      <Box mb={4}>
        {/* Chart 1: Monthly Value */}
        <Card ref={refChartMain} sx={{ mb: 3, p: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: "#0f172a" }}>
                Evolução Mensal — Investimento (R$)
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                {selectedYear}
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={() =>
                exportRefToPNG(
                  refChartMain,
                  `evolucao_valor_${selectedYear}.png)} startIcon={<Download size={16} />}>
              PNG
            </Button>
          </Box>
          <Box sx={{ height: 360, backgroundColor: "#f8fafc", borderRadius: "8px", p: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyTotalsSeriesValor}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <RechartTooltip formatter={(v) => formatBR(v)} contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                <Legend />
                <Bar dataKey="valor" name="Investimento" fill="#1e40af" />
                <Line type="monotone" dataKey="valor" name="Tendência" stroke="#0d9488" strokeWidth={3} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        {/* Chart 2: Monthly Kg */}
        <Card ref={refChartKg} sx={{ mb: 3, p: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: "#0f172a" }}>
                Evolução Mensal — Volume (Kg)
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                {selectedYear}
              </Typography>
            </Box>
            <Button size="small" onClick={() => exportRefToPNG(refChartKg, \`evolucao_kg_${selectedYear}.png`,
                )
              }
              startIcon={<Download size={16} />}
            >
              PNG
            </Button>
          </Box>
          <Box sx={{ height: 320, backgroundColor: "#f8fafc", borderRadius: "8px", p: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTotalsSeriesKg}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <RechartTooltip
                  formatter={(v) => formatWeight(v)}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                />
                <Bar dataKey="kg" name="Volume (Kg)" fill="#0891b2" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        {/* Chart 3: Distribution by Type */}
        <Card ref={refProteins} sx={{ mb: 3, p: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: "#0f172a" }}>
                Distribuição por Tipo
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                {selectedYear}
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={() => exportRefToPNG(refProteins, `tipos_${selectedYear}.png`)}
              startIcon={<Download size={16} />}
            >
              PNG
            </Button>
          </Box>
          <Box
            sx={{
              height: 360,
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              p: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productsByTypeSummary.map((p) => ({ name: p.tipo, value: p.valor }))}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label={({ name, value }) =>
                    `${name}: ${value ? value.toLocaleString("pt-BR", { minimumFractionDigits: 0 }) : 0}`
                  }
                  labelLine={false}
                >
                  {productsByTypeSummary.map((entry, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartTooltip
                  formatter={(v) => formatBR(v)}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        {/* Chart 4: Top Products by Kg */}
        <Card ref={refTopProducts} sx={{ mb: 3, p: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: "#0f172a" }}>
                Top 12 Produtos — Volume (Kg)
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                {selectedYear}
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={() => exportRefToPNG(refTopProducts, `top_produtos_kg_${selectedYear}.png`)}
              startIcon={<Download size={16} />}
            >
              PNG
            </Button>
          </Box>
          <Box sx={{ height: 360, backgroundColor: "#f8fafc", borderRadius: "8px", p: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topProductsForCharts.byKg}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" width={180} stroke="#94a3b8" />
                <RechartTooltip
                  formatter={(v) => `${v} Kg`}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                />
                <Bar dataKey="kg" fill="#0891b2" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        {/* Chart 5: Top Products by Value */}
        <Card sx={{ mb: 4, p: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: "#0f172a" }}>
                Top 12 Produtos — Investimento (R$)
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                {selectedYear}
              </Typography>
            </Box>
            <Button size="small" startIcon={<Download size={16} />}>
              PNG
            </Button>
          </Box>
          <Box sx={{ height: 360, backgroundColor: "#f8fafc", borderRadius: "8px", p: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topProductsForCharts.byValor}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tickFormatter={(v) => (v ? `R$ ${(v / 1000).toFixed(0)}k` : "0")}
                  stroke="#94a3b8"
                />
                <YAxis dataKey="name" type="category" width={180} stroke="#94a3b8" />
                <RechartTooltip
                  formatter={(v) => formatBR(v)}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                />
                <Bar dataKey="valor" fill="#6366f1" />
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
              <Typography variant="h6" fontWeight={700} sx={{ color: "#0f172a" }}>
                Resumo por Categoria
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                {selectedYear}
              </Typography>
            </Box>
            <Button variant="outlined" onClick={exportCategoryTableToExcel} startIcon={<Download size={16} />}>
              Excel
            </Button>
          </Box>

          <Box sx={{ height: 520, width: "100%" }}>
            <DataGrid
              rows={
                activeCategoryFilter
                  ? categoryMonthlyRows.filter((r) => r.categoria === activeCategoryFilter)
                  : categoryMonthlyRows
              }
              columns={[
                {
                  field: "categoria",
                  headerName: "Categoria",
                  minWidth: 200,
                  flex: 1,
                  renderCell: (params) => <strong>{params.value}</strong>,
                },
                ...MONTHS_PT.map((m, i) => ({
                  field: m,
                  headerName: m,
                  minWidth: 120,
                  flex: 0.8,
                  valueFormatter: ({ value }) => (value ? formatBR(value) : "-"),
                  renderCell: (params) => {
                    const val = params.value || 0
                    const monthIndex = MONTHS_PT.indexOf(params.field)
                    return (
                      <Button
                        size="small"
                        onClick={() => handleOpenDetail({ categoria: params.row.categoria, monthIndex })}
                        sx={{ textTransform: "none" }}
                      >
                        {val ? formatBR(val) : "-"}
                      </Button>
                    )
                  },
                })),
                {
                  field: "total",
                  headerName: "Total Anual",
                  minWidth: 160,
                  flex: 1,
                  valueFormatter: ({ value }) => formatBR(value),
                },
              ]}
              pageSize={10}
              disableSelectionOnClick
              sx={{
                border: 0,
                "& .MuiDataGrid-columnHeaders": {
                  bgcolor: "#f1f5f9",
                  color: "#0f172a",
                  fontWeight: 700,
                  borderBottom: "2px solid #e2e8f0",
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="lg"
        fullWidth
        aria-labelledby="detail-dialog-title"
        aria-describedby={detailContext ? "detail-dialog-desc" : undefined}
      >
        <DialogTitle id="detail-dialog-title" sx={{ fontWeight: 700, color: "#0f172a" }}>
          Detalhes — {detailContext ? `${detailContext.categoria} • ${MONTHS_PT[detailContext.monthIndex]}` : ""}
        </DialogTitle>
        <DialogContent id="detail-dialog-desc">
          {detailContext ? (
            <>
              <Grid container spacing={2} mb={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ p: 2, background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)" }}>
                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                      Total Investido
                    </Typography>
                    <Typography variant="h6" fontWeight={800} sx={{ my: 1 }}>
                      {formatBR(detailContext.totalValor)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                      Volume: {formatWeight(detailContext.totalKg)}
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ p: 2, background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)" }}>
                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                      Tipos Principais
                    </Typography>
                    <Box mt={1}>
                      {detailContext.tipos && detailContext.tipos.length ? (
                        detailContext.tipos.slice(0, 4).map((t) => (
                          <Box key={t.tipo} display="flex" justifyContent="space-between" py={0.3}>
                            <Typography variant="caption">{t.tipo}</Typography>
                            <Typography variant="caption" fontWeight={600}>
                              {formatBR(t.valor)}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="caption">Sem dados</Typography>
                      )}
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ p: 2, background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)" }}>
                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                      Top Produtos
                    </Typography>
                    <Box mt={1}>
                      {detailContext.products && detailContext.products.length ? (
                        detailContext.products.slice(0, 4).map((p) => (
                          <Box key={p.name} display="flex" justifyContent="space-between" py={0.3}>
                            <Typography variant="caption">{p.name}</Typography>
                            <Typography variant="caption" fontWeight={600}>
                              {formatBR(p.valor)}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="caption">Sem produtos</Typography>
                      )}
                    </Box>
                  </Card>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" fontWeight={700} mb={1} sx={{ color: "#0f172a" }}>
                Pedidos no período ({detailContext.ordersList.length})
              </Typography>

              <Box sx={{ height: 320 }}>
                <DataGrid
                  rows={detailContext.ordersList.map((o, idx) => ({ id: idx, ...o }))}
                  columns={[
                    { field: "numeroPedido", headerName: "Número", flex: 0.8 },
                    { field: "fornecedor", headerName: "Fornecedor", flex: 1 },
                    { field: "kg", headerName: "Kg", flex: 0.6, valueFormatter: ({ value }) => formatWeight(value) },
                    { field: "valor", headerName: "Valor", flex: 0.8, valueFormatter: ({ value }) => formatBR(value) },
                  ]}
                  pageSize={6}
                  disableSelectionOnClick
                />
              </Box>
            </>
          ) : (
            <Typography>Selecione um valor na tabela para ver o detalhe.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
