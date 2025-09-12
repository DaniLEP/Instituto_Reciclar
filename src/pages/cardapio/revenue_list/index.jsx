import { useEffect, useState } from "react"
import { getDatabase, ref, get, update } from "firebase/database"
import { useNavigate } from "react-router-dom"
import * as XLSX from "xlsx"
import { Input } from "@/components/ui/input/index"
import { Button } from "@/components/ui/Button/button"
import { Label } from "@/components/ui/label/index"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/index"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Download,
  Edit3,
  Coffee,
  UtensilsCrossed,
  Cookie,
  ChefHat,
  Users,
  UserCheck,
  Clock,
  Trash2,
  FileText,
  PlusCircle,
} from "lucide-react"
import { getApps, initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.appspot.com",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const database = getDatabase(app)

export default function ExibirRefeicoes() {
  const [refeicoes, setRefeicoes] = useState([])
  const [filtroInicio, setFiltroInicio] = useState("")
  const [filtroFim, setFiltroFim] = useState("")
  const [valorEditado, setValorEditado] = useState("")
  const [editando, setEditando] = useState(null)
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 5
  const navigate = useNavigate()

  const handleView = () => navigate("/cadastro-refeicoes")

  const formatDate = (timestamp) => {
    if (!timestamp) return "Data inválida"
    const date = typeof timestamp === "string" ? new Date(Date.parse(timestamp)) : new Date(timestamp)
    if (isNaN(date.getTime())) return "Data inválida"
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
    const day = String(localDate.getDate()).padStart(2, "0")
    const month = String(localDate.getMonth() + 1).padStart(2, "0")
    const year = localDate.getFullYear()
    return `${day}/${month}/${year}`
  }

  useEffect(() => {
    carregarRefeicoes()
  }, [])

  const carregarRefeicoes = () => {
    const refeicoesRef = ref(database, "refeicoesServidas")
    get(refeicoesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = []
        snapshot.forEach((child) => {
          const item = child.val()
          data.push({
            key: child.key,
            dataRefeicao: formatDate(item.dataRefeicao),
            dataRefeicaoObj: new Date(item.dataRefeicao),
            ...item,
          })
        })
        setRefeicoes(data)
      }
    })
  }

  const handleDoubleClick = (id, field, value) => {
    setEditando({ id, field })
    setValorEditado(value?.toString() || "")
  }

  const handleChange = (e) => setValorEditado(e.target.value)

  const salvarEdicao = () => {
    if (!editando) return
    const refeicaoRef = ref(database, `refeicoesServidas/${editando.id}`)
    update(refeicaoRef, { [editando.field]: valorEditado }).then(() => {
      setRefeicoes((prev) =>
        prev.map((item) =>
          item.key === editando.id ? { ...item, [editando.field]: valorEditado } : item
        )
      )
      setEditando(null)
    })
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") salvarEdicao()
  }

  const handleBlur = () => salvarEdicao()

  const resetTime = (date) => {
    date.setHours(0, 0, 0, 0)
    return date
  }

  const filtrarRefeicoes = () => {
    const inicio = filtroInicio ? resetTime(new Date(filtroInicio)) : null
    const fim = filtroFim ? resetTime(new Date(filtroFim)) : null
    setRefeicoes((prev) =>
      prev.filter(({ dataRefeicaoObj }) => {
        const data = resetTime(new Date(dataRefeicaoObj))
        return (!inicio || data >= inicio) && (!fim || data <= fim)
      })
    )
    setPaginaAtual(1)
  }

  const limparFiltros = () => {
    setFiltroInicio("")
    setFiltroFim("")
    carregarRefeicoes()
    setPaginaAtual(1)
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(refeicoes)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Refeições")
    XLSX.writeFile(workbook, "Refeicoes.xlsx")
  }

  const EditableField = ({ refeicaoId, field, value }) => {
    const isEditing = editando?.id === refeicaoId && editando.field === field
    if (isEditing) {
      return (
        <Input
          type="text"
          value={valorEditado}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          autoFocus
          className="w-full min-w-[100px]"
        />
      )
    }
    return (
      <div
        className="cursor-pointer hover:bg-gray-100 p-2 rounded min-h-[40px] flex items-center group"
        onDoubleClick={() => handleDoubleClick(refeicaoId, field, value)}
      >
        <span className="flex-1">{value || "-"}</span>
        <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-50 ml-2" />
      </div>
    )
  }

  const MealCard = ({ refeicao }) => {
    const mealTypes = [
      { id: "cafe", label: "Café da Manhã", icon: Coffee, color: "bg-amber-50 border-amber-200" },
      { id: "almoco", label: "Almoço", icon: UtensilsCrossed, color: "bg-green-50 border-green-200" },
      { id: "lanche", label: "Lanche", icon: Cookie, color: "bg-purple-50 border-purple-200" },
      { id: "outras", label: "Outras Refeições", icon: ChefHat, color: "bg-blue-50 border-blue-200" },
    ]

    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" /> {formatDate(refeicao.dataRefeicao)}
            </CardTitle>
            <Badge variant="outline">
              Total:{" "}
              {(refeicao.cafeTotalQtd || 0) +
                (refeicao.almocoTotalQtd || 0) +
                (refeicao.lancheTotalQtd || 0) +
                (refeicao.outrasTotalQtd || 0)} porções
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {mealTypes.map(({ id, label, color, icon: Icon }) => (
            <div key={id} className={`p-4 mb-4 rounded-lg border ${color}`}>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Icon className="w-4 h-4" /> {label}
              </h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Descrição:</Label>
                  <EditableField
                    refeicaoId={refeicao.key}
                    field={`${id}Descricao`}
                    value={refeicao[`${id}Descricao`]}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <Users className="w-3 h-3" />Total
                    </Label>
                    <EditableField
                      refeicaoId={refeicao.key}
                      field={`${id}TotalQtd`}
                      value={refeicao[`${id}TotalQtd`]}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> Funcionários
                    </Label>
                    <EditableField
                      refeicaoId={refeicao.key}
                      field={`${id}FuncionariosQtd`}
                      value={refeicao[`${id}FuncionariosQtd`]}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />Jovens Manhã
                    </Label>
                    <EditableField
                      refeicaoId={refeicao.key}
                      field={`${id}JovensQtd`}
                      value={refeicao[`${id}JovensQtd`]}
                    />
                  </div>

                  {refeicao[`${id}JovensTardeQtd`] !== undefined && (
                    <div>
                      <Label className="text-sm font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />Jovens Tarde
                      </Label>
                      <EditableField
                        refeicaoId={refeicao.key}
                        field={`${id}JovensTardeQtd`}
                        value={refeicao[`${id}JovensTardeQtd`]}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium flex items-center gap-1 mb-2">
                <Trash2 className="w-3 h-3" /> Sobras
              </Label>
              <EditableField
                refeicaoId={refeicao.key}
                field="sobrasDescricao"
                value={refeicao.sobrasDescricao}
              />
            </div>
            <div>
              <Label className="text-sm font-medium flex items-center gap-1 mb-2">
                <FileText className="w-3 h-3" />Observações
              </Label>
              <EditableField
                refeicaoId={refeicao.key}
                field="observacaoDescricao"
                value={refeicao.observacaoDescricao}
              />
            </div>
          </div>

          <div className="mt-4">
            <Label className="text-sm font-medium flex items-center gap-1 mb-2">
              <Trash2 className="w-3 h-3 text-red-600" />Desperdício (kg)
            </Label>
            <EditableField
              refeicaoId={refeicao.key}
              field="desperdicioQtd"
              value={refeicao.desperdicioQtd}
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalPaginas = Math.ceil(refeicoes.length / itensPorPagina)
  const refeicoesPaginadas = refeicoes.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Refeições Servidas</h2>
        <div className="flex gap-2">
          <Button onClick={handleView}>
            <PlusCircle className="w-4 h-4 mr-2" /> Nova Refeição
          </Button>
          <Button onClick={exportToExcel}>
            <Download className="w-4 h-4 mr-2" /> Exportar
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-end">
        <div>
          <Label>Data Início</Label>
          <Input type="date" value={filtroInicio} onChange={(e) => setFiltroInicio(e.target.value)} />
        </div>
        <div>
          <Label>Data Fim</Label>
          <Input type="date" value={filtroFim} onChange={(e) => setFiltroFim(e.target.value)} />
        </div>
        <Button onClick={filtrarRefeicoes}>Filtrar</Button>
        <Button variant="outline" onClick={limparFiltros}>
          Limpar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {refeicoesPaginadas.map((refeicao) => (
          <MealCard key={refeicao.key} refeicao={refeicao} />
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button disabled={paginaAtual === 1} onClick={() => setPaginaAtual((p) => p - 1)}>
          Anterior
        </Button>
        <span>Página {paginaAtual} de {totalPaginas}</span>
        <Button disabled={paginaAtual === totalPaginas} onClick={() => setPaginaAtual((p) => p + 1)}>
          Próxima
        </Button>
      </div>
    </div>
  )
}
