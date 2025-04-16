import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./App.jsx"
// CONFIGURANDO ROUTER
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './components/error/index.jsx'
import LoginForm from './pages/Login/index.jsx'
import Home from './pages/home/index.jsx'
import ListaPedidos from './pages/home/home_list-order/index.jsx'
import EditarProduto from './components/Edit/product/index.jsx'
import Relatorio from './pages/home/dashboard/index.jsx'
import Estoque from './pages/stock/index.jsx'
import CadProdutos from './pages/register/product'
import EntradaProdutos from './pages/register/prohibited/index.jsx'
import CadastroRefeicoes from './components/Revenue_Registration/CadastroReceita.jsx'
import RelatorioRef from './components/Dashboards/Dashboard_Ref/RelatorioRef.jsx'
import HistoricoRetiradas from './pages/withdraw/withdral-history/index.jsx'
import Profile from './pages/profille/index.jsx'
import NovoPedido from './components/New_Order/NovoPedido.jsx'
import Gerenciador from './pages/register/product_manager/index.jsx'
import Registro from './pages/register_auth/index.jsx'
import AdminUsuarios from './pages/Login/profile_verification/Verificação.jsx'
import VisualizarFornecedores from './pages/register/Supplier/view_supplier'
import StatusPedidos from './components/New_Order/Status_Order/StatusPedido.jsx'
import ExibirRefeicoes from './components/Revenue_Registration/Status_Revenue/Status_Revenue.jsx'
import RetiradaProdutos from './pages/withdraw/withdraw-home'
import Retirada from './pages/withdraw'
import Cadastro from './pages/home/home_product'
import CadastroFornecedores from './pages/register/Supplier'
import EditarFornecedor from './pages/register/Supplier/edit_supplier'


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
