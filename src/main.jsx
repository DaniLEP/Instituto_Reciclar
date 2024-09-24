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
import RelatorioProteina from './components/RelatorioProteina.jsx'
import RelatorioDoacoes from './components/RelatorioDoacoes.jsx'
import RelatorioMantimento from './components/RelatorioMantimento.jsx'
import RelatorioHortalicas from './components/RelatorioHortalicas.jsx'
import RelatorioRef from './components/RelatorioRef.jsx'
import RelatorioRetirada from './components/RelatorioRetirada.jsx'
import RelatorioAnual from './components/RelatorioAnual.jsx'
import OrderStatusPage from './components/OrderStatusPage.jsx'
import EditOrderPage from './components/EditOrderPage.jsx'
import CadastroGeral from './components/CadProdutos.jsx'
import EntradaProdutos from './components/Entrada.jsx'

// const router = createBrowserRouter ([
//   {
//     path: "/",
//     element: <Home />,
//   },
//   {
//     path: "/ListaPedidos",
//     element: <ListaPedidos />,
//   },
//   {
//     path: "/Cadastro",
//     element: <Cadastro />,
//   },
//   {
//     path: "/Retirada",
//     element: <Retirada />,
//   },
//   {
//     path: "/Relatorio",
//     element: <Relatorio />,
//   },
// ])

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
        path: "/relatorio-proteinas",
        element: <RelatorioProteina />,
      },
      {
        path: "/relatorio-mantimento",
        element: <RelatorioMantimento />,
      },
      {
        path: "/relatorio-hortalicas",
        element: <RelatorioHortalicas />,
      },
      {
        path: "/relatorio-doacoes-recebidas",
        element: <RelatorioDoacoes />,
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
        element: <CadastroGeral />
      },
      {
        path: '/entrada-produtos',
        element: <EntradaProdutos />
      }
      
    ],
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
