import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./App.jsx"
// CONFIGURANDO ROUTER
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Cadastro from './pages/Cadastro.jsx'
import ListaPedidos from './pages/ListaPedidos.jsx'
import Relatorio from './pages/Relatorio.jsx'
import Retirada from './pages/Retirada.jsx'
import ErrorPage from './components/ErrorPage.jsx'
import Hortalicas from './components/Hortalicas.jsx'
import Mantimento from './components/Mantimento.jsx'
import Proteina from './components/Proteina.jsx'
import OrdersPage from './components/OrdersPage.jsx'
import ShoppingListPage from './components/ShoppingListPage.jsx'
import OrderDetailsPage from './components/OrderPageDetails.jsx'
import Refeicoes from './components/Ref.Servidas.jsx'
import RetiradaProdutos from './components/Retirada.jsx'
import RelatorioRef from './components/RelatorioRef.jsx'
import RelatorioRetirada from './components/RelatorioRetirada.jsx'
import RelatorioAnual from './components/RelatorioAnual.jsx'
import OrderStatusPage from './components/OrderStatusPage.jsx'
import EditOrderPage from './components/EditOrderPage.jsx'
import EntradaProdutos from './components/Entrada.jsx'
import CadProdutos from './components/CadProdutos.jsx'
import HistoricoRetiradas from './components/HistoricoEstoque.jsx'
import Estoque from './components/Estoque.jsx'
import Profile from './components/perfil.jsx'
import EditProfile from './components/useStates.jsx'
import StatusRef from './components/StatusRef.jsx'
import ReceitaCadastro from './components/receitaCad.jsx'
import QuantidadeRefeicoes from './components/qtdeRef.jsx'
import LoginForm from './pages/Login.jsx'


const router = createBrowserRouter ([
  {
    path: "/",
    element: <App />,
    // PAGINA DE ERRO
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/lista-pedidos",
        element: <ListaPedidos />,
      },
      {
        path: "/cadastro",
        element: <Cadastro />,
      },
      {
        path: "/retirada",
        element: <Retirada />,
      },
      {
        path: "/relatorio",
        element: <Relatorio />,
      },
      {
        path: "/proteina",
        element: <Proteina />
      },
      {
        path: "/mantimento",
        element: <Mantimento />
      },
      {
        path: "/cad-refeicoes",
        element: <Refeicoes />
      },
      {
        path: "/hortalicas",
        element: <Hortalicas />
      },
      {
        path: "/orders-page",
        element: <OrdersPage />,
      },
      {
        path: "/order-page-detail",
        element: <OrderDetailsPage />,
      },
      {
        path: "/shopping-list",
        element: <ShoppingListPage />,
      },
      {
        path: "/retirada",
        element: <RetiradaProdutos />,
      },
      {
        path: "/relatorio-refeicoes",
        element: <RelatorioRef />,
      },
      {
        path: "/relatorio-retiradas",
        element: <RelatorioRetirada />,
      },
      {
        path: "/relatorio-anual-mensal",
        element: <RelatorioAnual />,
      },
      {
        path: "/edit-order",
        element: <OrderDetailsPage />,
      },
      {
        path: "/order-status",
        element: <OrderStatusPage />
      },
      {
        path: '/edit-order/:id',
        element: <EditOrderPage />
      },
      {
        path: '/cadastro-geral',
        element: <CadProdutos />
      },
      {
        path: '/entrada-produtos',
        element: <EntradaProdutos />
      },
      {
        path: '/historico-retiradas',
        element: <HistoricoRetiradas />,
      },
      {
        path: '/retirada-produtos',
        element: <RetiradaProdutos />,
      },
      {
        path: '/estoque',
        element: <Estoque />,
      },
      {
        path: '/meu-perfil',
        element: <Profile />,
      },
      {
        path: '/editar-perfil',
        element: < EditProfile /> 
      },
      {
        path: "/status-ref",
        element: <StatusRef />
      },
      {
        path: "/cad-cardapio",
        element: <ReceitaCadastro/>
      },
      {
        path: "/quantidade-refeicoes",
        element: <QuantidadeRefeicoes />
      },
      {
        path: "/Login",
        element: <LoginForm />
      },
    ],
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
