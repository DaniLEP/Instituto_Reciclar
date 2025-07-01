import { useEffect, useState } from "react"
import { getDatabase, ref, onValue, remove, update } from "firebase/database"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/Button/button" 
import { Input } from "@/components/ui/input/index"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table"
import { Edit, Trash2, Power, UserPlus, ArrowLeft, Users } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const NavigationCard = ({ to, icon: Icon, title, description }) => (
  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/20">
    <Link to={to} aria-label={title} className="block">
      <CardContent className="p-6 text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"><Icon className="w-6 h-6 text-primary" /></div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Link>
  </Card>
)

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [nome, setNome] = useState("")
  const [funcao, setFuncao] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const database = getDatabase()

  useEffect(() => {
    const usuariosRef = ref(database, "usuarios")
    onValue(usuariosRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const usuariosList = Object.keys(data).map((uid) => ({uid, status: "ativo", ...data[uid], })); setUsuarios(usuariosList);}
    })
  }, [database])

  const salvarAlteracoes = () => {
    if (editingUser) {
      update(ref(database, `usuarios/${editingUser.uid}`), { nome, funcao })
        .then(() => {toast.success("Usuário atualizado com sucesso!"); setEditingUser(null); setNome(""); setFuncao(""); setIsModalOpen(false);
        }).catch((error) => toast.error("Erro ao atualizar usuário: " + error.message))
    }
  }

  const excluirUsuario = (uid) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      remove(ref(database, `usuarios/${uid}`)).then(() => toast.success("Usuário excluído com sucesso!")).catch((error) => toast.error("Erro ao excluir usuário: " + error.message))
    }
  }

  const alternarStatus = (uid, statusAtual) => {
    const novoStatus = statusAtual === "ativo" ? "inativo" : "ativo"
    update(ref(database, `usuarios/${uid}`), { status: novoStatus }).then(() => toast.info(`Status alterado para ${novoStatus}`)).catch((error) => toast.error("Erro ao atualizar status: " + error.message))}

  const openEditModal = (usuario) => {setEditingUser(usuario); setNome(usuario.nome); setFuncao(usuario.funcao); setIsModalOpen(true);}
  const closeModal = () => {setEditingUser(null); setNome(""); setFuncao(""); setIsModalOpen(false);}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable theme="light" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4"><Users className="w-8 h-8 text-primary" /></div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Gerenciador de Usuários</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Gerencie todos os usuários do sistema de forma simples e eficiente</p>
        </div>

        {/* Users Table/Cards */}
        <Card className="mb-8 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Usuários Cadastrados ({usuarios.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.uid} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{usuario.uid.substring(0, 8)}...</TableCell>
                      <TableCell className="font-medium">{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{usuario.funcao}</TableCell>
                      <TableCell><Badge variant={usuario.status === "ativo" ? "default" : "secondary"} className={usuario.status === "ativo" ? "bg-green-500 hover:bg-green-600" : ""}>{usuario.status || "ativo"}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditModal(usuario)} className="h-8 w-8 p-0"><Edit className="w-4 h-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => alternarStatus(usuario.uid, usuario.status || "ativo")} className="h-8 w-8 p-0"><Power className="w-4 h-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => excluirUsuario(usuario.uid)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button></div></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {usuarios.map((usuario) => (
                <Card key={usuario.uid} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{usuario.nome}</h3>
                        <p className="text-sm text-muted-foreground">{usuario.email}</p>
                      </div>
                      <Badge variant={usuario.status === "ativo" ? "default" : "secondary"} className={usuario.status === "ativo" ? "bg-green-500 hover:bg-green-600" : ""}>{usuario.status || "ativo"}</Badge>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm"><span className="font-medium">Função:</span> {usuario.funcao}</p>
                      <p className="text-sm text-muted-foreground"><span className="font-medium">ID:</span> {usuario.uid.substring(0, 12)}...</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(usuario)} className="flex-1"><Edit className="w-4 h-4 mr-2" /> Editar </Button>
                      <Button size="sm" variant="outline"
                        onClick={() => alternarStatus(usuario.uid, usuario.status || "ativo")}><Power className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => excluirUsuario(usuario.uid)} className="text-red-600 hover:text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {usuarios.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum usuário encontrado</h3>
                <p className="text-muted-foreground mb-4">Comece adicionando o primeiro usuário ao sistema</p>
                <Link to="/Registro_Usuario"><Button><UserPlus className="w-4 h-4 mr-2" />Adicionar Usuário  </Button></Link>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <NavigationCard to="/Registro_Usuario" icon={UserPlus} title="Novo Usuário" description="Adicionar um novo usuário ao sistema" />
          <NavigationCard to="/Home" icon={ArrowLeft} title="Voltar" description="Retornar à página inicial" />
        </div>
      </div>
      {/* Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Edit className="w-5 h-5" />Editar Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="nome" className="text-sm font-medium">Nome</label>
              <Input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite o nome do usuário" />
            </div>
            <div className="space-y-2">
              <label htmlFor="funcao" className="text-sm font-medium">Função</label>
              <Input id="funcao" type="text" value={funcao} onChange={(e) => setFuncao(e.target.value)} placeholder="Digite a função do usuário" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeModal}>Cancelar</Button>
            <Button onClick={salvarAlteracoes} disabled={!nome.trim() || !funcao.trim()}>Salvar Alterações </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
