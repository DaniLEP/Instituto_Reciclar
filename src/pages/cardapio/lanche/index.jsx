import { useState, useEffect } from "react"
import { ref, push, set, remove, onValue } from "firebase/database"
import { db } from "../../../../firebase.js"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Button } from "@/components/ui/Button/button" 
import { Input } from "@/components/ui/input/index.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/index.jsx"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Save, Send, Calendar, User, Cookie, Clock } from "lucide-react"

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]
const secoes = ["Lanche Principal", "Opção Vegetariana", "Fruta", "Bebida"]

const criarComposicaoInicial = () => {
  const composicao = {}
  secoes.forEach((secao) => {
    composicao[secao] = diasSemana.reduce((acc, dia) => {acc[dia] = ""; return acc}, {})
  })
  return composicao;
}

const CadastroCardapioLanche = () => {
  const navigate = useNavigate()

  const criarDadosNutriInicial = () =>
    Array(5).fill(null).map(() => ({ nomeNutri: "", crn3: "", dataInicio: "", dataFim: "" }))

  const criarComposicoesInicial = () =>
    Array(5).fill(null).map(() => criarComposicaoInicial())

  const [dadosNutri, setDadosNutri] = useState(criarDadosNutriInicial())
  const [composicoes, setComposicoes] = useState(criarComposicoesInicial())
  const [rascunhos, setRascunhos] = useState([])
  const [rascunhoSelecionado, setRascunhoSelecionado] = useState(null)
  const [semanaAtiva, setSemanaAtiva] = useState(0)

  // Carregar rascunhos do Firebase
  useEffect(() => {
    const rascunhosRef = ref(db, "cardapiosRascunho")
    const unsubscribe = onValue(rascunhosRef, (snapshot) => {
      const data = snapshot.val() || {}
      const lista = Object.entries(data)
        .map(([id, value]) => ({ id, ...value }))
        .filter((item) => item.tipo === "LanchedaTarde")
      setRascunhos(lista)
    })
    return () => unsubscribe()
  }, [])

  // Handler para atualizar composição do cardápio
  const handleChange = (semana, secao, dia, valor) => {
    setComposicoes((old) => {
      return old.map((comp, i) => {
        if (i !== semana) return comp
        return {
          ...comp,
          [secao]: {
            ...comp[secao],
            [dia]: valor
          }
        }
      })
    })
  }

  // Handler para atualizar dados do nutricionista
  const handleDadosNutriChange = (semana, campo, valor) => {
    setDadosNutri((old) => {
      const novos = [...old]
      novos[semana] = { ...novos[semana], [campo]: valor }
      return novos
    })
  }

  const calcularProgresso = () => {
    let totalCampos = 0
    let camposPreenchidos = 0

    dadosNutri.forEach((dados) => {
      totalCampos += 4
      if (dados.nomeNutri) camposPreenchidos++
      if (dados.crn3) camposPreenchidos++
      if (dados.dataInicio) camposPreenchidos++
      if (dados.dataFim) camposPreenchidos++
    })

    composicoes.forEach((composicao) => {
      secoes.forEach((secao) => {
        diasSemana.forEach((dia) => {
          totalCampos++
          if (composicao[secao]?.[dia]) camposPreenchidos++
        })
      })
    })

    return Math.round((camposPreenchidos / totalCampos) * 100)
  }

  const validarDados = () => {
    for (let i = 0; i < 5; i++) {
      const { nomeNutri, crn3, dataInicio, dataFim } = dadosNutri[i]
      if (!nomeNutri || !crn3 || !dataInicio || !dataFim) {
        toast.error(`Por favor, preencha todos os dados do nutricionista para a Semana ${i + 1}.`)
        return false
      }
    }
    return true
  }

  const salvarRascunho = async () => {
    try {
      const dados = { tipo: "LanchedaTarde", dataAtualizacao: new Date().toISOString(), dadosNutri, composicoes }
      if (rascunhoSelecionado) {
        await set(ref(db, `cardapiosRascunho/${rascunhoSelecionado.id}`), dados)
        toast.success("Rascunho atualizado com sucesso!")
      } else {
        await push(ref(db, "cardapiosRascunho"), dados)
        toast.success("Rascunho salvo com sucesso!")
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao salvar rascunho.")
    }
  }

  const enviarParaAprovacao = async () => {
    if (!validarDados()) return

    const dados = {
      dataCadastro: new Date().toISOString(),
      tipo: "LanchedaTarde",
      periodo: { inicio: dadosNutri[0].dataInicio, fim: dadosNutri[4].dataFim },
      composicoes: {}
    }

    for (let i = 0; i < 5; i++) {
      dados.composicoes[`semana${i + 1}`] = {
        nutricionista: { nome: dadosNutri[i].nomeNutri, crn3: dadosNutri[i].crn3 },
        periodo: { inicio: dadosNutri[i].dataInicio, fim: dadosNutri[i].dataFim },
        cardapio: composicoes[i]
      }
    }

    try {
      await push(ref(db, "cardapiosPendentes"), dados)
      toast.success("Cardápio enviado para aprovação!")
      if (rascunhoSelecionado) {
        await remove(ref(db, `cardapiosRascunho/${rascunhoSelecionado.id}`))
        setRascunhoSelecionado(null)
      }
      setDadosNutri(criarDadosNutriInicial())
      setComposicoes(criarComposicoesInicial())
    } catch (error) {
      console.error(error)
      toast.error("Erro ao enviar cardápio para aprovação.")
    }
  }

  const carregarRascunho = (id) => {
    const rascunho = rascunhos.find((r) => r.id === id)
    if (rascunho) {
      const composicoesCorrigidas = rascunho.composicoes.map((comp) => {
        const nova = criarComposicaoInicial()
        secoes.forEach((secao) => {
          diasSemana.forEach((dia) => {
            nova[secao][dia] = comp?.[secao]?.[dia] ?? ""
          })
        })
        return nova
      })
      setDadosNutri(rascunho.dadosNutri)
      setComposicoes(composicoesCorrigidas)
      setRascunhoSelecionado(rascunho)
      toast.info(`Rascunho da data ${new Date(rascunho.dataAtualizacao).toLocaleString()} carregado.`)
    }
  }

  const progresso = calcularProgresso()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={() => navigate(-1)} variant="outline" size="sm" className="bg-white hover:bg-gray-50"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastro de Cardápio - Lanche da Tarde</h1>
            <Badge variant="secondary" className="text-sm"><Cookie className="h-3 w-3 mr-1" />5 Semanas de Planejamento</Badge>
          </div>
          <div className="w-20" />
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progresso do Preenchimento</span>
              <span className="text-sm text-gray-500">{progresso}%</span>
            </div>
            <Progress value={progresso} className="h-2" />
          </CardContent>
        </Card>

        {/* Rascunhos Salvos */}
        {rascunhos.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-lg"><Clock className="h-5 w-5 mr-2" /> Rascunhos Salvos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {rascunhos.map((rascunho) => (
                  <Button key={rascunho.id} variant={rascunhoSelecionado?.id === rascunho.id ? "default" : "outline"} className="h-auto p-3 text-left justify-start" onClick={() => carregarRascunho(rascunho.id)}>
                    <div>
                      <div className="font-medium text-sm">Rascunho {rascunho.id.slice(-6)}</div>
                      <div className="text-xs text-muted-foreground">{new Date(rascunho.dataAtualizacao).toLocaleString()}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Array(5).fill().map((_, index) => (
            <Button key={index} variant={semanaAtiva === index ? "default" : "outline"} onClick={() => setSemanaAtiva(index)} className="flex-1 min-w-[120px]">Semana {index + 1}</Button>
          ))}
        </div>

        {/* Semana Ativa */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center"><Calendar className="h-5 w-5 mr-2" />Semana {semanaAtiva + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dados do Nutricionista */}
            <div>
              <h3 className="flex items-center text-lg font-semibold mb-4"><User className="h-4 w-4 mr-2" /> Dados do Nutricionista</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Nutricionista</label>
                  <Input placeholder="Digite o nome completo" value={dadosNutri[semanaAtiva].nomeNutri} onChange={(e) => handleDadosNutriChange(semanaAtiva, "nomeNutri", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CRN3</label>
                  <Input placeholder="Ex: 12345" value={dadosNutri[semanaAtiva].crn3} onChange={(e) => handleDadosNutriChange(semanaAtiva, "crn3", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                  <Input type="date" value={dadosNutri[semanaAtiva].dataInicio} onChange={(e) => handleDadosNutriChange(semanaAtiva, "dataInicio", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Fim</label>
                  <Input type="date" value={dadosNutri[semanaAtiva].dataFim} onChange={(e) => handleDadosNutriChange(semanaAtiva, "dataFim", e.target.value)} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Composição do Cardápio */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Composição do Cardápio</h3>
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  <div className="grid grid-cols-6 gap-2 mb-2">
                    <div className="font-semibold text-sm text-gray-700 p-2">Composição</div>
                    {diasSemana.map((dia) => (<div key={dia} className="font-semibold text-sm text-gray-700 p-2 text-center">{dia}</div>))}
                  </div>

                  {secoes.map((secao, idx) => (
                    <div key={idx} className="grid grid-cols-6 gap-2 mb-2">
                      <div className="bg-purple-50 p-3 rounded-md font-medium text-sm flex items-center border border-purple-200">{secao}</div>
                      {diasSemana.map((dia) => (
                        <div key={dia} className="p-1">
                          <Input value={composicoes[semanaAtiva]?.[secao]?.[dia] ?? ""} onChange={(e) => handleChange(semanaAtiva, secao, dia, e.target.value)} className="text-sm h-10" placeholder="Digite o item" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={salvarRascunho} variant="outline" size="lg" className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 min-w-[200px]"><Save className="h-4 w-4 mr-2" />Salvar Rascunho</Button>
          <Button onClick={enviarParaAprovacao} size="lg" className="bg-purple-600 hover:bg-purple-700 min-w-[200px]"><Send className="h-4 w-4 mr-2" />Enviar para Aprovação</Button>
        </div>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      </div>
    </div>
  )
}

export default CadastroCardapioLanche
