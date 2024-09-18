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
        path: "/ListaPedidos",
        element: <ListaPedidos />,
      },
      {
        path: "/Cadastro",
        element: <Cadastro />,
      },
      {
        path: "/Retirada",
        element: <Retirada />,
      },
      {
        path: "/Relatorio",
        element: <Relatorio />,
      },
      {
        path: "/Proteina",
        element: <Proteina />
      },
      {
        path: "/Mantimento",
        element: <Mantimento />
      },
      {
        path: "/Cad.Refeicoes",
        element: <Refeicoes />
      },
      {
        path: "/Hortalicas",
        element: <Hortalicas />
      },
      {
        path: "/OrdersPage",
        element: <OrdersPage />,
      },
      {
        path: "/OrderPageDetail",
        element: <OrderDetailsPage />,
      },
      {
        path: "/shopping-list",
        element: <ShoppingListPage />,
      },
      {
        path: "/Retirada",
        element: <RetiradaProdutos />,
      },
    ],
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
