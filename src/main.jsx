import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./App.jsx"
// CONFIGURANDO ROUTER
import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Cadastro from './pages/Cadastro.jsx'
import ListaPedidos from './pages/ListaPedidos.jsx'
import Relatorio from './pages/Relatorio.jsx'
import Retirada from './pages/Retirada.jsx'
import ErrorPage from './components/ErrorPage.jsx'

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
    ],
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
