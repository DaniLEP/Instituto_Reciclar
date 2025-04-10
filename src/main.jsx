import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./App.jsx"
// CONFIGURANDO ROUTER
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './components/Error/ErrorPage.jsx'
import LoginForm from './pages/Login/Login.jsx'
import Home from './pages/Home_Page/Home.jsx'
import ListaPedidos from './pages/List_Order_Page/ListaPedidos.jsx'
import EditarProduto from './components/Edit/Edit_Product/EditarProduto.jsx'
import Relatorio from './pages/Dashboard/Relatorio.jsx'
import Estoque from './pages/Stock/Estoque.jsx'
import CadProdutos from './pages/register/produtt/CadProdutos'
import EntradaProdutos from './pages/register/Prohibited/Entrada.jsx'
import CadastroRefeicoes from './components/Revenue_Registration/CadastroReceita.jsx'
import RelatorioRef from './components/Dashboards/Dashboard_Ref/RelatorioRef.jsx'
import HistoricoRetiradas from './pages/withdraw/withdral-history/index.jsx'
import Profile from './pages/Profile/index.jsx'
import NovoPedido from './components/New_Order/NovoPedido.jsx'
import Gerenciador from './components/Product Manager/GerenciadorProdutos.jsx'
import Registro from './pages/User_Registration/Registro_Usuario.jsx'
import AdminUsuarios from './components/Profile_Verification/Verificação.jsx'
import VisualizarFornecedores from './pages/register/Supplier/View_Supplier/VisualizarSupplier'
import StatusPedidos from './components/New_Order/Status_Order/StatusPedido.jsx'
import ExibirRefeicoes from './components/Revenue_Registration/Status_Revenue/Status_Revenue.jsx'
import RetiradaProdutos from './pages/withdraw/withdraw-home'
import Retirada from './pages/withdraw'
import Cadastro from './pages/register/Product-home/Cadastro'
import CadastroFornecedores from './pages/register/Supplier/CadastroFornecedor'
import EditarFornecedor from './pages/register/Supplier/Edit_supplier/edit'


const router = createBrowserRouter ([
  {
    path: "/",
    element: <App />,
    // PAGINA DE ERRO
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <LoginForm />,
      },   
      {
        path: "/Home",
        element: <Home />,
      },
      // CARDS DA HOME
      {
        path: "/Pedidos",
        element: <ListaPedidos />,
      },  
      {
        path: "/Cadastro",
        element: <Cadastro />,
      },
      {
        path: "/Dashboard",
        element: <Relatorio />,
      },
      {
        path: "/home-retirada",
        element: <RetiradaProdutos />,
      },

      {
        path: "/Retirada",
        element: <Retirada />,
      },
      // PAGINAS DA LISTA DE PEDIDO
      {
        path: "/Cadastro_Produtos",
        element: <NovoPedido />,
      },
      {
        path: "/Gestão_Pedido",
        element: <StatusPedidos/>,
      },
      {
        path: "/Editar_Produto/:id",
        element: <EditarProduto />,
      },
      // PAGINAS DO CARDS CADASTROS
      {
        path: "/Cadastro_Fornecedor",
        element: <CadastroFornecedores />,
      },
      {
        path: "/Visualizar_Fornecedores",
        element: <VisualizarFornecedores />,
      },
      {
        path: "/editar-fornecedor/:id",
        element: <EditarFornecedor />,
      },
      {
        path: "/Cadastro_Geral",
        element: <CadProdutos />,
      },
      {
        path: "/Gerenciador_Produtos",
        element: <Gerenciador />,
      },
      {
        path: "/Entrada_Produtos",
        element: <EntradaProdutos />,
      },
      {
        path: "/Cadastro_Refeicoes",
        element: <CadastroRefeicoes />,
      },
      {
        path: "/Refeicoes_Servidas",
        element: <ExibirRefeicoes />,
      },
      // PAGINAS DO CARDS DE DASHBOARD
      {
        path: "/Estoque",
        element: <Estoque />,
      },
      {
        path: "/Dashboard_Refeicoes",
        element: <RelatorioRef />,
      },
      {
        path: "/Historico_Retirada",
        element: <HistoricoRetiradas />,
      },
      // PAGINA DE PERFIL
      {
        path: "/Meu_Perfil",
        element: <Profile />,
      },
      {
        path: "/Registro_Usuario",
        element: <Registro />,
      },
      {
        path: "/Verificacao_Usuario",
        element: <AdminUsuarios />,
      },
    ],
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
