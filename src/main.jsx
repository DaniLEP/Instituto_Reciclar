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
import StatusPedido from './components/StatusPedido.jsx'
import EditarProduto from './components//EditarProduto.jsx'
import CadastroFornecedor from './components/CadastroFornecedor.jsx'
import Relatorio from './pages/Relatorio.jsx'
import Estoque from './components/Estoque.jsx'
import CadProdutos from './components/CadProdutos.jsx'
import EntradaProdutos from './components/Entrada.jsx'
import CadastroRefeicoes from './components/CadastroReceita.jsx'
import QuantidadeRefeicoes from './components/QuantidadeRef.jsx'
import RelatorioRef from './components/RelatorioRef.jsx'
import RetiradaProdutos from './components/Retirada.jsx'
import RelatorioRetirada from './components/RelatorioRetirada.jsx'
import RelatorioAnual from './components/RelatorioAnual.jsx'
import Retirada from './pages/Retirada.jsx'
import HistoricoRetiradas from './components/HistoricoEstoque.jsx'
import Profile from './components/perfil.jsx'
import NovoPedido from './components/NovoPedido.jsx'
import Cadastro from './pages/Cadastro.jsx'


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
        element: <StatusPedido/>,
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
        path: "/Cadastro_Geral",
        element: <CadProdutos />,
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
        path: "/Quantidade_Refeicoes",
        element: <QuantidadeRefeicoes />,
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
    ],
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
