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
import CadastroFornecedor from './components/Supplier_Registration/CadastroFornecedor.jsx'
import Relatorio from './pages/Dashboard/Relatorio.jsx'
import Estoque from './components/Stock/Estoque.jsx'
import CadProdutos from './components/Product_Registration/CadProdutos.jsx'
import EntradaProdutos from './components/Prohibited/Entrada.jsx'
import CadastroRefeicoes from './components/Revenue_Registration/CadastroReceita.jsx'
// import QuantidadeRefeicoes from './components/Quantity_Ref/QuantidadeRef.jsx'
import RelatorioRef from './components/Dashboards/Dashboard_Ref/RelatorioRef.jsx'
import RetiradaProdutos from './components/With_Drawal/Retirada.jsx'
import RelatorioRetirada from './components/Dashboards/Dashboard_Withdrawal/RelatorioRetirada.jsx'
import RelatorioAnual from './components/Dashboards/DashBoard_Periodic/RelatorioAnual.jsx'
import Retirada from './pages/Withdrawal/Retirada.jsx'
import HistoricoRetiradas from './components/Withdrawal_History/Historico_Retirada.jsx'
import Profile from './components/Auth/Profile/perfil.jsx'
import NovoPedido from './components/New_Order/NovoPedido.jsx'
import Cadastro from './pages/Register_Product/Cadastro.jsx'
import Gerenciador from './components/Product Manager/GerenciadorProdutos.jsx'
import Registro from './pages/User_Registration/Registro_Usuario.jsx'
import AdminUsuarios from './components/Profile_Verification/Verificação.jsx'
import VisualizarFornecedores from './components/Supplier_Registration/View_Supplier/VisualizarSupplier.jsx'
import TabelaRefeicoes from './components/Revenue_Registration/Status_Revenue/Status_Revenue.jsx'
// import StatusPedidos from './components/Status_Order/StatusPedido.jsx'


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
        path: "/Retirada",
        element: <Retirada />,
      },
      // PAGINAS DA LISTA DE PEDIDO
      {
        path: "/Cadastro_Produtos",
        element: <NovoPedido />,
      },
      {
        path: "/Status_Pedido",
        // element: <StatusPedidos/>,
      },
      {
        path: "/Editar_Produto/:id",
        element: <EditarProduto />,
      },
      // PAGINAS DO CARDS CADASTROS
      {
        path: "/Cadastro_Fornecedor",
        element: <CadastroFornecedor />,
      },
      {
        path: "/Visualizar_Fornecedores",
        element: <VisualizarFornecedores />,
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
        element: <TabelaRefeicoes />,
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
        path: "/Dashboard_Retiradas",
        element: <RelatorioRetirada />,
      },
      {
        path: "/Dashboard_Periodico",
        element: <RelatorioAnual />,
      },
      // PAGINAS DO CARDS DE DASHBOARD
      {
        path: "/Retirada_Produtos",
        element: <RetiradaProdutos />,
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
