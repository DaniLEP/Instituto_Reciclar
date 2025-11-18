import { useEffect, useState } from "react";
import { Search, Calendar, User, Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button/button";
import { Input } from "@/components/ui/input/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/index";
import { Label } from "@/components/ui/label/index";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get, child } from "firebase/database";

export default function HistoricoRetiradas() {
  const navigate = useNavigate();
  const [retiradas, setRetiradas] = useState([]);
  const [retiradasFiltradas, setRetiradasFiltradas] = useState([]);
  const [search, setSearch] = useState("");
  const [responsavel, setResponsavel] = useState("all");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const db = getDatabase();

  // Busca os dados do Firebase
  const fetchRetiradas = async () => {
    setLoading(true);
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, "Retiradas"));
      if (snapshot.exists()) {
        const dataObj = snapshot.val();
        let data = Object.entries(dataObj).map(([id, value]) => ({id, ...value, totalKG: (Number(value.quantity) || 0) * (Number(value.peso) || 0), dataRetirada: value.dataPedido})); // garante que a data exista
        // Ordena pelo mais recente primeiro
        data.sort((a, b) => new Date(b.dataRetirada) - new Date(a.dataRetirada));
        setRetiradas(data); setRetiradasFiltradas(data);
      } else {setRetiradas([]); setRetiradasFiltradas([]);}
    } catch (error) {
      console.error("Erro ao ler dados:", error);
      setRetiradas([]);
      setRetiradasFiltradas([]);
    } finally { setLoading(false);}
  };

  useEffect(() => {fetchRetiradas();}, []);

  // Formata datas
  const formatDate = (timestamp) => {
    if (!timestamp) return "Data inválida";
    let date = typeof timestamp === "string" ? new Date(Date.parse(timestamp)) : new Date(timestamp);
    if (isNaN(date.getTime())) return "Data inválida";
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return localDate.toLocaleDateString("pt-BR");
  };

  // Filtragem
  useEffect(() => {
    let filtradas = [...retiradas];
    if (search.trim() !== "") {
      const term = search.trim().toLowerCase(); filtradas = filtradas.filter((r) => r.name?.toLowerCase().includes(term) || r.sku?.toLowerCase().includes(term));
    }
    if (responsavel !== "all") {
      filtradas = filtradas.filter((retirada) => retirada.retirante === responsavel);
    }
    if (dataInicio) {
      const dtInicio = new Date(dataInicio); filtradas = filtradas.filter((r) => new Date(r.dataRetirada) >= dtInicio);
    }
    if (dataFim) {
      const dtFim = new Date(dataFim); filtradas = filtradas.filter((r) => new Date(r.dataRetirada) <= dtFim);
    }
    setRetiradasFiltradas(filtradas);
    setCurrentPage(1); // reinicia a paginação ao filtrar
  }, [search, responsavel, dataInicio, dataFim, retiradas]);

  const limparFiltros = () => {setSearch(""); setResponsavel("all"); setDataInicio(""); setDataFim("");};

  // Paginação
  const totalPages = Math.ceil(retiradasFiltradas.length / itemsPerPage);
  const currentItems = retiradasFiltradas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                <span className="ml-2 text-slate-600">Carregando histórico...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/Home")} className="bg-white"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Histórico de Retiradas</h1>
            <p className="text-slate-600 mt-1">Visualize e filtre todas as retiradas registradas</p>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><Search className="h-5 w-5" /> Filtros de Busca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2 space-y-2">
                <Label htmlFor="search">Buscar produto ou SKU</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input id="search" type="text" placeholder="Digite o produto ou SKU..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Responsável</Label>
                <Select value={responsavel} onValueChange={setResponsavel}>
                  <SelectTrigger><User className="h-4 w-4 mr-2" /><SelectValue placeholder="Todos" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os responsáveis</SelectItem>
                    <SelectItem value="Camila">Camila</SelectItem>
                    <SelectItem value="Mislene">Mislene</SelectItem>
                    <SelectItem value="Maria Jose">Maria Jose</SelectItem>
                    <SelectItem value="Rose">Rose</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data Início</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input id="dataInicio" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataFim">Data Fim</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input id="dataFim" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="pl-10"/>
                </div>
              </div>
              <div className="flex items-end"><Button variant="outline" onClick={limparFiltros} className="w-full"> Limpar filtros</Button></div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> Resultados</CardTitle>
              <div className="text-sm text-slate-600">{retiradasFiltradas.length} {retiradasFiltradas.length === 1 ? "retirada encontrada" : "retiradas encontradas"}</div>
            </div>
          </CardHeader>
          <CardContent>
            {retiradasFiltradas.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2"> Nenhuma retirada encontrada</h3>
                <p className="text-slate-600">Tente ajustar os filtros para encontrar o que procura.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Peso</TableHead>
                        <TableHead className="text-center">Quantidade</TableHead>
                        <TableHead>Total de KG</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((retirada) => (
                        <TableRow key={retirada.id} className="hover:bg-slate-50">
                          <TableCell className="font-medium">{retirada.name}</TableCell>
                          <TableCell className="font-mono text-sm">{retirada.sku}</TableCell>
                          <TableCell>{retirada.marca}</TableCell>
                          <TableCell>{retirada.peso}</TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{retirada.quantity}</span>
                          </TableCell>
                          <TableCell>{retirada.totalKG.toFixed(2)} kg</TableCell>
                          <TableCell>{retirada.retirante}</TableCell>
                          <TableCell>{formatDate(retirada.dataRetirada)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Paginação */}
                <div className="flex justify-between mt-4">
                  <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} > Anterior </Button>
                  <div className="flex items-center gap-2">Página {currentPage} de {totalPages}</div>
                  <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>Próximo</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}