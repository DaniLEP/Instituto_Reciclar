import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./App.jsx"
// CONFIGURANDO ROUTER
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './components/ErrorPage.jsx'
import LoginForm from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import ListaPedidos from './pages/ListaPedidos.jsx'
import Cadastro from './pages/Cadastro.jsx'
import ShoppingListPage from './components/ShoppingListPage.jsx'


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
      {
        path: "/Pedidos",
        element: <ListaPedidos />,
      },  
      {
        path: "/Cadastro",
        element: <Cadastro />,
      },
      {
        path: "/Cadastro_Produtos",
        element: <ShoppingListPage />,
      },
    ],
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
