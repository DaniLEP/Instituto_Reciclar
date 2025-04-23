import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import React from 'react'

import './index.css'
import App from './App.jsx'
import ErrorPage from '@/components/error'
import LoginForm from '@/pages/Login'


// ROTAS CARREGADAS NORMALMENTE
import Home from '@/pages/home'
import ListaPedidos from '@/pages/home/home_list-order'
import EditarProduto from '@/components/Edit/product'
import Cadastro from '@/pages/home/home_product'
import Retirada from '@/pages/withdraw'
import Profile from '@/pages/profille'
import Registro from '@/pages/register_auth'
import AdminUsuarios from '@/pages/Login/profile_verification/Verificação'
import VisualizarFornecedores from '@/pages/register/Supplier/view_supplier'
import StatusPedidos from '@/components/New_Order/Status_Order/StatusPedido'
import RetiradaProdutos from '@/pages/withdraw/withdraw-home'
import EditarFornecedor from '@/pages/register/Supplier/edit_supplier'
import CardapioSemana2 from '@/pages/cardapio/almoco/index.jsx'
import Cardapio from './pages/cardapio'
import CardapioLanche from './pages/cardapio/lanche/index'

// ROTAS COM LAZY LOADING
const Estoque = React.lazy(() => import('@/pages/Stock'))
const Relatorio = React.lazy(() => import('@/pages/home/dashboard'))
const CadProdutos = React.lazy(() => import('@/pages/register/product'))
const EntradaProdutos = React.lazy(() => import('@/pages/register/prohibited'))
const CadastroRefeicoes = React.lazy(() => import('@/components/Revenue_Registration/CadastroReceita'))
const RelatorioRef = React.lazy(() => import('@/components/Dashboards/Dashboard_Ref/RelatorioRef'))
const HistoricoRetiradas = React.lazy(() => import('@/pages/withdraw/withdral-history'))
const NovoPedido = React.lazy(() => import('@/components/New_Order/NovoPedido'))
const Gerenciador = React.lazy(() => import('@/pages/register/product_manager'))
const CadastroFornecedores = React.lazy(() => import('@/pages/register/Supplier'))
const ExibirRefeicoes = React.lazy(() => import('@/components/Revenue_Registration/Status_Revenue/Status_Revenue'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <LoginForm /> },
      { path: '/Home', element: <Home /> },
      { path: '/Pedidos', element: <ListaPedidos /> },
      { path: '/Cadastro', element: <Cadastro /> },
      { path: '/home-retirada', element: <RetiradaProdutos /> },
      { path: '/Retirada', element: <Retirada /> },
      { path: '/Editar_Produto/:id', element: <EditarProduto /> },
      { path: '/Meu_Perfil', element: <Profile /> },
      { path: '/Registro_Usuario', element: <Registro /> },
      { path: '/Verificacao_Usuario', element: <AdminUsuarios /> },
      { path: '/Visualizar_Fornecedores', element: <VisualizarFornecedores /> },
      { path: '/Gestão_Pedido', element: <StatusPedidos /> },
      { path: '/editar-fornecedor/:id', element: <EditarFornecedor /> },
      { path: '/cadastro-de-almoço', element: <CardapioSemana2 /> },
      { path: '/cardapio', element: <Cardapio /> },
      { path: '/cadastro-cardápio-lanche', element: <CardapioLanche />},



      // ROTAS LAZY COM <Suspense>
      {
        path: '/Estoque',
        element: (
          <Suspense fallback={<div>Carregando Estoque...</div>}>
            <Estoque />
          </Suspense>
        ),
      },
      {
        path: '/Dashboard',
        element: (
          <Suspense fallback={<div>Carregando Dashboard...</div>}>
            <Relatorio />
          </Suspense>
        ),
      },
      {
        path: '/Cadastro_Geral',
        element: (
          <Suspense fallback={<div>Carregando Cadastro de Produtos...</div>}>
            <CadProdutos />
          </Suspense>
        ),
      },
      {
        path: '/Entrada_Produtos',
        element: (
          <Suspense fallback={<div>Carregando Entrada de Produtos...</div>}>
            <EntradaProdutos />
          </Suspense>
        ),
      },
      {
        path: '/Cadastro_Refeicoes',
        element: (
          <Suspense fallback={<div>Carregando Cadastro de Refeições...</div>}>
            <CadastroRefeicoes />
          </Suspense>
        ),
      },
      {
        path: '/Dashboard_Refeicoes',
        element: (
          <Suspense fallback={<div>Carregando Dashboard de Refeições...</div>}>
            <RelatorioRef />
          </Suspense>
        ),
      },
      {
        path: '/Historico_Retirada',
        element: (
          <Suspense fallback={<div>Carregando Histórico de Retiradas...</div>}>
            <HistoricoRetiradas />
          </Suspense>
        ),
      },
      {
        path: '/Cadastro_Produtos',
        element: (
          <Suspense fallback={<div>Carregando Novo Pedido...</div>}>
            <NovoPedido />
          </Suspense>
        ),
      },
      {
        path: '/Gerenciador_Produtos',
        element: (
          <Suspense fallback={<div>Carregando Gerenciador...</div>}>
            <Gerenciador />
          </Suspense>
        ),
      },
      {
        path: '/Cadastro_Fornecedor',
        element: (
          <Suspense fallback={<div>Carregando Cadastro de Fornecedor...</div>}>
            <CadastroFornecedores />
          </Suspense>
        ),
      },
      {
        path: '/Refeicoes_Servidas',
        element: (
          <Suspense fallback={<div>Carregando Refeições Servidas...</div>}>
            <ExibirRefeicoes />
          </Suspense>
        ),
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
