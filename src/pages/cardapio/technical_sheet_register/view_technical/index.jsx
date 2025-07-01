import { useEffect, useState, useMemo } from "react"
import { ref as dbRef, onValue } from "firebase/database"
import { db } from "../../../../../firebase"
import { Button } from "@/components/ui/Button/button"
import { Input } from "@/components/ui/input/index"
import { Label } from "@/components/ui/label/index"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/index"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Filter,
  Eye,
  ChefHat,
  Clock,
  User,
  Scale,
  BookOpen,
  Printer,
  Users,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Utensils,
  Timer,
  Refrigerator,
  Loader2,
} from "lucide-react"

const RECEITAS_POR_PAGINA = 5

const ConsultaReceitas = () => {
  const [receitas, setReceitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [receitaSelecionada, setReceitaSelecionada] = useState(null)
  // Filtros
  const [filtroNome, setFiltroNome] = useState("")
  const [filtroClassificacao, setFiltroClassificacao] = useState("all") // Updated default value
  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1)
  // Quantidade de pessoas para o modal
  const [qtdPessoas, setQtdPessoas] = useState(1)
  // Ingredientes editáveis no modal
  const [ingredientesEditaveis, setIngredientesEditaveis] = useState([])

  useEffect(() => {
    const receitasRef = dbRef(db, "receitas")

    onValue(receitasRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {const listaReceitas = Object.entries(data).map(([id, receita]) => ({id, ...receita,}))
        setReceitas(listaReceitas)
      } else {setReceitas([])}
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (receitaSelecionada) {
      const ingredientesArray = receitaSelecionada.ingredientes ? Array.isArray(receitaSelecionada.ingredientes) ? receitaSelecionada.ingredientes : Object.values(receitaSelecionada.ingredientes) : []
      const ingredientesComQuantidade = ingredientesArray.map((ing) => ({nome: ing.nome, peso: Number((ing.peso * qtdPessoas).toFixed(2)),}))
      setIngredientesEditaveis(ingredientesComQuantidade)
    } 
    else {setIngredientesEditaveis([]);setQtdPessoas(1);}
  }, [receitaSelecionada, qtdPessoas])

  const alterarPesoIngrediente = (index, novoPeso) => {
    setIngredientesEditaveis((ingredientes) => {
      const novaLista = [...ingredientes]; novaLista[index].peso = novoPeso === "" ? "" : Number(novoPeso)
      return novaLista;})
  }

  const receitasFiltradas = useMemo(() => {
    return receitas.filter((r) => {
      const nomeMatch = (r.nome || "").toLowerCase().includes(filtroNome.toLowerCase())
      const classificacaoMatch =
        filtroClassificacao !== "all" ? (r.classificacao || "").toLowerCase() === filtroClassificacao.toLowerCase() : true
      return nomeMatch && classificacaoMatch
    })
  }, [receitas, filtroNome, filtroClassificacao])
  const totalPaginas = Math.ceil(receitasFiltradas.length / RECEITAS_POR_PAGINA)
  const receitasPaginaAtual = receitasFiltradas.slice((paginaAtual - 1) * RECEITAS_POR_PAGINA, paginaAtual * RECEITAS_POR_PAGINA,)

  const irParaPagina = (num) => {if (num < 1 || num > totalPaginas) return; setPaginaAtual(num); window.scrollTo({ top: 0, behavior: "smooth" })}
  const classificacoesUnicas = [...new Set(receitas.map((r) => r.classificacao))].filter(Boolean)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="flex items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            <p className="text-lg font-medium">Carregando receitas...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4"><BookOpen className="w-8 h-8 text-orange-600" /></div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Consulta de Receitas</h1>
          <p className="text-gray-600">Explore e gerencie todas as receitas cadastradas</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ChefHat className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Total de Receitas</p>
                  <p className="text-2xl font-bold text-orange-600">{receitas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Filter className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Classificações</p>
                  <p className="text-2xl font-bold text-blue-600">{classificacoesUnicas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Search className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Resultados</p>
                  <p className="text-2xl font-bold text-green-600">{receitasFiltradas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros de Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filtroNome" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Buscar por nome
                </Label>
                <Input
                  id="filtroNome"
                  placeholder="Digite o nome da receita..."
                  value={filtroNome}
                  onChange={(e) => {
                    setFiltroNome(e.target.value)
                    setPaginaAtual(1)
                  }}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtrar por classificação
                </Label>
                <Select value={filtroClassificacao} onValueChange={(value) => {setFiltroClassificacao(value); setPaginaAtual(1)}}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Todas as classificações" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as classificações</SelectItem> {/* Updated value prop */}
                    {classificacoesUnicas.map((classif) => (<SelectItem key={classif} value={classif}>{classif}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {receitasFiltradas.length === 0 ? (
          <Alert>
            <Search className="h-4 w-4" />
            <AlertDescription> Nenhuma receita encontrada com os filtros aplicados. Tente ajustar os critérios de busca.</AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Desktop Table */}
            <Card className="hidden md:block mb-8">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Foto</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Classificação</TableHead>
                      <TableHead className="text-center">Refrigerado</TableHead>
                      <TableHead className="text-center">Congelado</TableHead>
                      <TableHead>Nutricionista</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receitasPaginaAtual.map((receita) => (
                      <TableRow key={receita.id} className="hover:bg-muted/50 cursor-pointer"onClick={() => setReceitaSelecionada(receita)}>
                        <TableCell>
                          {receita.imagemBase64 ? (
                            <img src={receita.imagemBase64 || "/placeholder.svg"} alt={`Foto de ${receita.nome}`} className="w-12 h-12 object-cover rounded-lg" />
                          ) : (<div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center"><ImageIcon className="w-6 h-6 text-gray-400" /></div>)}
                        </TableCell>
                        <TableCell className="font-medium">{receita.nome}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{receita.classificacao}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Refrigerator className="w-4 h-4 text-blue-500" />
                            <span>{receita.prazoValidade?.refrigerado || "-"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Timer className="w-4 h-4 text-purple-500" />
                            <span>{receita.prazoValidade?.congelado || "-"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{receita.nutricionista?.nome || "-"}</div>
                            <div className="text-gray-500">CRN: {receita.nutricionista?.crn3 || "-"}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center"><Button size="sm" variant="outline" onClick={(e) => {e.stopPropagation(); setReceitaSelecionada(receita)}}><Eye className="w-4 h-4 mr-2" />Ver</Button></TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 mb-8">
              {receitasPaginaAtual.map((receita) => (
                <Card key={receita.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4" onClick={() => setReceitaSelecionada(receita)}>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        {receita.imagemBase64 ? (<img src={receita.imagemBase64 || "/placeholder.svg"} alt={`Foto de ${receita.nome}`} className="w-16 h-16 object-cover rounded-lg" />
                        ) : (<div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center"><ImageIcon className="w-8 h-8 text-gray-400" /></div>)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-2 truncate">{receita.nome}</h3>
                        <div className="space-y-2">
                          <Badge variant="secondary" className="text-xs">{receita.classificacao}</Badge>
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{receita.nutricionista?.nome || "Não informado"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setReceitaSelecionada(receita)}><Eye className="w-4 h-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => irParaPagina(paginaAtual - 1)} disabled={paginaAtual === 1}>
                  <ChevronLeft className="w-4 h-4" />Anterior</Button>
                <div className="flex gap-1">
                  {[...Array(totalPaginas)].map((_, i) => {
                    const numero = i + 1
                    return (<Button key={numero} variant={numero === paginaAtual ? "default" : "outline"} size="sm" onClick={() => irParaPagina(numero)} className="w-10">{numero}</Button>)})}
                </div>

                <Button variant="outline" size="sm" onClick={() => irParaPagina(paginaAtual + 1)} disabled={paginaAtual === totalPaginas}>Próxima<ChevronRight className="w-4 h-4" /></Button>
              </div>
            )}
          </>
        )}

        {/* Modal de Detalhes */}
        <Dialog open={!!receitaSelecionada} onOpenChange={() => setReceitaSelecionada(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl"><ChefHat className="w-6 h-6" />{receitaSelecionada?.nome}</DialogTitle>
            </DialogHeader>

            {receitaSelecionada && (
              <div className="space-y-6">
                {/* Imagem */}
                {receitaSelecionada.imagemBase64 && (<div className="w-full"><img src={receitaSelecionada.imagemBase64 || "/placeholder.svg"} alt={`Foto de ${receitaSelecionada.nome}`} className="w-full max-h-64 object-cover rounded-lg shadow-md"/></div>)}
                {/* Quantidade de Pessoas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Users className="w-5 h-5" />Ajustar Porções</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Label htmlFor="qtdPessoas">Quantidade de pessoas:</Label>
                      <Input id="qtdPessoas" type="number" min={1} value={qtdPessoas} onChange={(e) => {const val = Number.parseInt(e.target.value, 10); if (!isNaN(val) && val > 0) setQtdPessoas(val)}} className="w-24" />
                      <span className="text-sm text-gray-500">Os ingredientes serão recalculados automaticamente</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Ingredientes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Scale className="w-5 h-5" />Ingredientes
                      <Badge variant="secondary">{ingredientesEditaveis.length} itens</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ingredientesEditaveis.length === 0 ? (<p className="text-gray-500 italic">Nenhum ingrediente listado.</p>) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Ingrediente</TableHead>
                            <TableHead className="text-right">Peso (g/ml)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ingredientesEditaveis.map((ing, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{ing.nome}</TableCell>
                              <TableCell className="text-right">
                                <Input type="number" min={0} step="0.01" value={ing.peso} onChange={(e) => alterarPesoIngrediente(idx, e.target.value)} className="w-24 ml-auto" />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>

                {/* Instruções */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg"><BookOpen className="w-5 h-5" />Modo de Preparo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line text-sm leading-relaxed">{receitaSelecionada.modoPreparo || "Não informado."}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg"><Utensils className="w-5 h-5" />Modo de Servir</CardTitle>
                    </CardHeader>
                    <CardContent><p className="whitespace-pre-line text-sm leading-relaxed">{receitaSelecionada.modoServir || "Não informado."}</p></CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Refrigerator className="w-5 h-5" />Armazenamento</CardTitle></CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line text-sm leading-relaxed"> {receitaSelecionada.armazenamento || "Não informado."}</p>
                    </CardContent>
                  </Card>
                </div>
                {/* Informações Adicionais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Clock className="w-5 h-5" />Prazo de Validade</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Refrigerator className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">Refrigerado:</span>
                        <span>{receitaSelecionada.prazoValidade?.refrigerado || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-purple-500" />
                        <span className="font-medium">Congelado:</span>
                        <span>{receitaSelecionada.prazoValidade?.congelado || "-"}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><User className="w-5 h-5" /> Nutricionista Responsável</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="font-medium">Nome:</span>{" "}
                        <span>{receitaSelecionada.nutricionista?.nome || "-"}</span>
                      </div>
                      <div>
                        <span className="font-medium">CRN3:</span>{" "}
                        <span>{receitaSelecionada.nutricionista?.crn3 || "-"}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Separator />
                {/* Botão Imprimir */}
                <div className="flex justify-center print:hidden"><Button onClick={() => window.print()} size="lg" className="px-8"><Printer className="w-4 h-4 mr-2" /> Imprimir Receita</Button></div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default ConsultaReceitas