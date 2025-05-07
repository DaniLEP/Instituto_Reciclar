// import { StrictMode, Suspense } from 'react';
// import { createRoot } from 'react-dom/client';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import React from 'react';

// import './index.css';
// import App from './App.jsx';
// import ErrorPage from '@/components/ui/error';
// import LoginForm from '@/pages/Login/auth_page';

// // Rotas carregadas diretamente
// import Home from '@/pages/home/home_primary/index';
// import ListaPedidos from '@/pages/home/home_list-order';
// import EditarProduto from '@/components/Edit/product';
// import Cadastro from '@/pages/home/home_product';
// import Retirada from '@/pages/withdraw/withdraw_primary';
// import Profile from '@/pages/profille';
// import Registro from '@/pages/Login/register_auth';
// import AdminUsuarios from '@/pages/Login/profile_verification/Verificação';
// import VisualizarFornecedores from '@/pages/register/Supplier/view_supplier';
// import StatusPedidos from '@/pages/order/order_status';
// import RetiradaProdutos from '@/pages/withdraw/withdraw-home';
// import EditarFornecedor from '@/pages/register/Supplier/edit_supplier';
// import CardapioSemana2 from '@/pages/cardapio/almoco/index.jsx';
// import Cardapio from './pages/cardapio/cadapio_primary';
// import CardapioLanche from './pages/cardapio/lanche/index';
// import CarregarCardapios from './pages/cardapio/list_almoco';
// import ProtectedRoute from './components/enum/protectedRouted/protectedRouted';
// import { UserType } from './components/enum/usertype/usertype.js';

// // Rotas com lazy loading
// const Estoque = React.lazy(() => import('@/pages/Stock'));
// const Relatorio = React.lazy(() => import('@/pages/home/dashboard'));
// const CadProdutos = React.lazy(() => import('@/pages/register/product'));
// const EntradaProdutos = React.lazy(() => import('@/pages/register/prohibited'));
// const CadastroRefeicoes = React.lazy(() => import('@/pages/cardapio/revenue_register'));
// const RelatorioRef = React.lazy(() => import('@/pages/dashboard/revenue'));
// const HistoricoRetiradas = React.lazy(() => import('@/pages/withdraw/withdral-history'));
// const NovoPedido = React.lazy(() => import('@/pages/order/register_order'));
// const Gerenciador = React.lazy(() => import('@/pages/register/product_manager'));
// const CadastroFornecedores = React.lazy(() => import('@/pages/register/Supplier'));
// const ExibirRefeicoes = React.lazy(() => import('@/pages/cardapio/revenue_list'));

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />,
//     errorElement: <ErrorPage />,
//     children: [
//       { path: '/', element: <LoginForm /> },

//       { path: '/Home', element: <ProtectedRoute allowedTypes={['ADMIN', 'COZINHA']}><Home /></ProtectedRoute>},
//       { path: '/Pedidos', element: <ProtectedRoute allowedTypes={[UserType.ADMIN]}><ListaPedidos /></ProtectedRoute> },
//       { path: '/Cadastro', element: <ProtectedRoute allowedTypes={[UserType.ADMIN]}><Cadastro /></ProtectedRoute> },
//       { path: '/home-retirada', element: <ProtectedRoute allowedTypes={[UserType.ADMIN]}><RetiradaProdutos /></ProtectedRoute> },
//       { path: '/Retirada', element: <ProtectedRoute allowedTypes={[UserType.ADMIN]}><Retirada /></ProtectedRoute> },
//       { path: '/Editar_Produto/:id', element: <ProtectedRoute allowedTypes={[UserType.ADMIN]}><EditarProduto /></ProtectedRoute> },
//       { path: '/Meu_Perfil', element: <ProtectedRoute allowedTypes={[UserType.ADMIN, UserType.USER, UserType.ADMIN, UserType.TI]}><Profile /></ProtectedRoute> },
//       { path: '/Registro_Usuario', element: <ProtectedRoute allowedTypes={[UserType.COZINHA]}><Registro /></ProtectedRoute> },
//       { path: '/Verificacao_Usuario', element: <ProtectedRoute allowedTypes={[UserType.COZINHA]}><AdminUsuarios /></ProtectedRoute> },
//       { path: '/Visualizar_Fornecedores', element: <ProtectedRoute allowedTypes={[UserType.COZINHA]}><VisualizarFornecedores /></ProtectedRoute> },
//       { path: '/Gestão_Pedido', element: <ProtectedRoute allowedTypes={[UserType.COZINHA]}><StatusPedidos /></ProtectedRoute> },
//       { path: '/editar-fornecedor/:id', element: <ProtectedRoute allowedTypes={[UserType.COZINHA]}><EditarFornecedor /></ProtectedRoute> },
//       { path: '/cadastro-de-almoço', element: <ProtectedRoute allowedTypes={[UserType.COZINHA]}><CardapioSemana2 /></ProtectedRoute> },
//       { path: '/cardapio', element: <ProtectedRoute allowedTypes={[UserType.COZINHA]}><Cardapio /></ProtectedRoute> },
//       { path: '/cadastro-cardápio-lanche', element: <ProtectedRoute allowedTypes={[UserType.COZINHA]}><CardapioLanche /></ProtectedRoute> },
//       { path: '/cardápio-almoco', element: <ProtectedRoute allowedTypes={[UserType.COZINHA]}><CarregarCardapios /></ProtectedRoute> },

//       {
//         path: '/Estoque',
//         element: (
//           <ProtectedRoute allowedTypes={[UserType.COZINHA]}>
//             <Suspense fallback={<div>Carregando Estoque...</div>}>
//               <Estoque />
//             </Suspense>
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: '/Dashboard',
//         element: (
//           <ProtectedRoute>
//             <Suspense fallback={<div>Carregando Dashboard...</div>}>
//               <Relatorio />
//             </Suspense>
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: '/Cadastro_Geral',
//         element: (
//           <ProtectedRoute allowedTypes={[UserType.COZINHA]}>
//             <Suspense fallback={<div>Carregando Cadastro de Produtos...</div>}>
//               <CadProdutos />
//             </Suspense>
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: '/Entrada_Produtos',
//         element: (
//           <ProtectedRoute allowedTypes={[UserType.COZINHA]}>
//             <Suspense fallback={<div>Carregando Entrada de Produtos...</div>}>
//               <EntradaProdutos />
//             </Suspense>
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: '/Cadastro_Refeicoes',
//         element: (
//           <ProtectedRoute allowedTypes={[UserType.COZINHA]}>
//             <Suspense fallback={<div>Carregando Cadastro de Refeições...</div>}>
//               <CadastroRefeicoes />
//             </Suspense>
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: '/Dashboard_Refeicoes',
//         element: (
//           <ProtectedRoute allowedTypes={[UserType.COZINHA]}>
//             <Suspense fallback={<div>Carregando Dashboard de Refeições...</div>}>
//               <RelatorioRef />
//             </Suspense>
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: '/Historico_Retirada',
//         element: (
//           <ProtectedRoute allowedTypes={[UserType.COZINHA]}>
//             <Suspense fallback={<div>Carregando Histórico de Retiradas...</div>}>
//               <HistoricoRetiradas />
//             </Suspense>
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: '/Cadastro_Produtos',
//         element: (
//           <ProtectedRoute allowedTypes={[UserType.COZINHA]}>
//             <Suspense fallback={<div>Carregando Novo Pedido...</div>}>
//               <NovoPedido />
//             </Suspense>
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: '/Gerenciador_Produtos',
//         element: (
//           <ProtectedRoute allowedTypes={[UserType.COZINHA]}>
//             <Suspense fallback={<div>Carregando Gerenciador...</div>}>
//               <Gerenciador />
//             </Suspense>
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: '/Cadastro_Fornecedor',
//         element: (
//           <ProtectedRoute allowedTypes={[UserType.COZINHA]}>
//             <Suspense fallback={<div>Carregando Cadastro de Fornecedor...</div>}>
//               <CadastroFornecedores />
//             </Suspense>
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: '/Refeicoes_Servidas',
//         element: (
//           <ProtectedRoute allowedTypes={[UserType.COZINHA]}>
//             <Suspense fallback={<div>Carregando Refeições Servidas...</div>}>
//               <ExibirRefeicoes />
//             </Suspense>
//           </ProtectedRoute>
//         ),
//       },
//     ],
//   },
// ]);

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <RouterProvider router={router} />
//   </StrictMode>
// );


// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />,
//     errorElement: <ErrorPage />,
//     children: [
//       { path: '/', element: <LoginForm /> },
//       { path: '/Home', element: <ProtectedRoute allowedTypes={[UserType.ADMIN]}> <Home /> </ProtectedRoute>},
//       { path: '/Pedidos', element: <ListaPedidos /> },
//       { path: '/Cadastro', element: <Cadastro /> },
//       { path: '/home-retirada', element: <RetiradaProdutos /> },
//       { path: '/Retirada', element: <Retirada /> },
//       { path: '/Editar_Produto/:id', element: <EditarProduto /> },
//       { path: '/Meu_Perfil', element: <Profile /> },
//       { path: '/Registro_Usuario', element: <Registro /> },
//       { path: '/Verificacao_Usuario', element: <AdminUsuarios /> },
//       { path: '/Visualizar_Fornecedores', element: <VisualizarFornecedores /> },
//       { path: '/Gestão_Pedido', element: <StatusPedidos /> },
//       { path: '/editar-fornecedor/:id', element: <EditarFornecedor /> },
//       { path: '/cadastro-de-almoço', element: <CardapioSemana2 /> },
//       { path: '/cardapio', element: <Cardapio /> },
//       { path: '/cadastro-cardápio-lanche', element: <CardapioLanche />},
//       { path: '/cardápio-almoco', element: <CarregarCardapios />},




//       // ROTAS LAZY COM <Suspense>
//       {
//         path: '/Estoque',
//         element: (
//           <Suspense fallback={<div>Carregando Estoque...</div>}>
//             <Estoque />
//           </Suspense>
//         ),
//       },
//       {
//         path: '/Dashboard',
//         element: (
//           <Suspense fallback={<div>Carregando Dashboard...</div>}>
//             <Relatorio />
//           </Suspense>
//         ),
//       },
//       {
//         path: '/Cadastro_Geral',
//         element: (
//           <Suspense fallback={<div>Carregando Cadastro de Produtos...</div>}>
//             <CadProdutos />
//           </Suspense>
//         ),
//       },
//       {
//         path: '/Entrada_Produtos',
//         element: (
//           <Suspense fallback={<div>Carregando Entrada de Produtos...</div>}>
//             <EntradaProdutos />
//           </Suspense>
//         ),
//       },
//       {
//         path: '/Cadastro_Refeicoes',
//         element: (
//           <Suspense fallback={<div>Carregando Cadastro de Refeições...</div>}>
//             <CadastroRefeicoes />
//           </Suspense>
//         ),
//       },
//       {
//         path: '/Dashboard_Refeicoes',
//         element: (
//           <Suspense fallback={<div>Carregando Dashboard de Refeições...</div>}>
//             <RelatorioRef />
//           </Suspense>
//         ),
//       },
//       {
//         path: '/Historico_Retirada',
//         element: (
//           <Suspense fallback={<div>Carregando Histórico de Retiradas...</div>}>
//             <HistoricoRetiradas />
//           </Suspense>
//         ),
//       },
//       {
//         path: '/Cadastro_Produtos',
//         element: (
//           <Suspense fallback={<div>Carregando Novo Pedido...</div>}>
//             <NovoPedido />
//           </Suspense>
//         ),
//       },
//       {
//         path: '/Gerenciador_Produtos',
//         element: (
//           <Suspense fallback={<div>Carregando Gerenciador...</div>}>
//             <Gerenciador />
//           </Suspense>
//         ),
//       },
//       {
//         path: '/Cadastro_Fornecedor',
//         element: (
//           <Suspense fallback={<div>Carregando Cadastro de Fornecedor...</div>}>
//             <CadastroFornecedores />
//           </Suspense>
//         ),
//       },
//       {
//         path: '/Refeicoes_Servidas',
//         element: (
//           <Suspense fallback={<div>Carregando Refeições Servidas...</div>}>
//             <ExibirRefeicoes />
//           </Suspense>
//         ),
//       },
//     ],
//   },
// ])


import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';

import './index.css';
import App from './App.jsx';
import ErrorPage from '@/components/ui/error';
import LoginForm from '@/pages/Login/auth_page';

// Rotas carregadas diretamente
import Home from '@/pages/home/home_primary/index';
import ListaPedidos from '@/pages/home/home_list-order';
import EditarProduto from '@/components/Edit/product';
import Cadastro from '@/pages/home/home_product';
import Retirada from '@/pages/withdraw/withdraw_primary';
import Profile from '@/pages/profille';
import Registro from '@/pages/Login/register_auth';
import AdminUsuarios from '@/pages/Login/profile_verification/Verificação';
import VisualizarFornecedores from '@/pages/register/Supplier/view_supplier';
import StatusPedidos from '@/pages/order/order_status';
import RetiradaProdutos from '@/pages/withdraw/withdraw-home';
import EditarFornecedor from '@/pages/register/Supplier/edit_supplier';
import CardapioSemana2 from '@/pages/cardapio/almoco/index.jsx';
import Cardapio from './pages/cardapio/cadapio_primary';
import CardapioLanche from './pages/cardapio/lanche/index';
import CarregarCardapios from './pages/cardapio/list_almoco';
import { UserType } from './components/enum/usertype/usertype.js';
import { ProtectedRoute } from './components/enum/protectedRouted/protectedRouted';
import ConsultaCardapioLanche from './pages/cardapio/list_lanche';

// Constantes para tipos de usuários
const COZINHA_ONLY = [UserType.COZINHA];
const ADMIN_ONLY = [UserType.ADMIN];
const ALL_TYPES = [UserType.ADMIN, UserType.USER, UserType.COZINHA, UserType.TI];
const ADMIN_TI = [UserType.ADMIN, UserType.TI];

// Rotas com lazy loading
const Estoque = React.lazy(() => import('@/pages/Stock'));
const Relatorio = React.lazy(() => import('@/pages/home/dashboard'));
const CadProdutos = React.lazy(() => import('@/pages/register/product'));
const EntradaProdutos = React.lazy(() => import('@/pages/register/prohibited'));
const CadastroRefeicoes = React.lazy(() => import('@/pages/cardapio/revenue_register'));
const RelatorioRef = React.lazy(() => import('@/pages/dashboard/revenue'));
const HistoricoRetiradas = React.lazy(() => import('@/pages/withdraw/withdral-history'));
const NovoPedido = React.lazy(() => import('@/pages/order/register_order'));
const Gerenciador = React.lazy(() => import('@/pages/register/product_manager'));
const CadastroFornecedores = React.lazy(() => import('@/pages/register/Supplier'));
const ExibirRefeicoes = React.lazy(() => import('@/pages/cardapio/revenue_list'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <LoginForm /> },

      { path: '/Home', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}><Home /></ProtectedRoute> },
      { path: '/Pedidos', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}><ListaPedidos /></ProtectedRoute> },
      { path: '/Cadastro', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}><Cadastro /></ProtectedRoute> },
      { path: '/home-retirada', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}><RetiradaProdutos /></ProtectedRoute> },
      { path: '/Retirada', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}><Retirada /></ProtectedRoute> },
      { path: '/Editar_Produto/:id', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}><EditarProduto /></ProtectedRoute> },
      { path: '/Meu_Perfil', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}><Profile /></ProtectedRoute> },
      { path: '/Registro_Usuario', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}><Registro /></ProtectedRoute> },
      { path: '/Verificacao_Usuario', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}><AdminUsuarios /></ProtectedRoute> },
      { path: '/Visualizar_Fornecedores', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}><VisualizarFornecedores /></ProtectedRoute> },
      { path: '/Gestão_Pedido', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}><StatusPedidos /></ProtectedRoute> },
      { path: '/editar-fornecedor/:id', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}><EditarFornecedor /></ProtectedRoute> },
      { path: '/cadastro-de-almoço', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}><CardapioSemana2 /></ProtectedRoute> },
      { path: '/cardapio', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}><Cardapio /></ProtectedRoute> },
      { path: '/cadastro-cardápio-lanche', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}><CardapioLanche /></ProtectedRoute> },
      { path: '/cardápio-almoco', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}><CarregarCardapios /></ProtectedRoute> },
      { path: '/cardápio-lanche', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}><ConsultaCardapioLanche /></ProtectedRoute> },

      {
        path: '/Estoque',
        element: (
          <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}>
            <Suspense fallback={<div>Carregando Estoque...</div>}>
              <Estoque />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/Dashboard',
        element: (
          <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}>
            <Suspense fallback={<div>Carregando Dashboard...</div>}>
              <Relatorio />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/Cadastro_Geral',
        element: (
          <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}>
            <Suspense fallback={<div>Carregando Cadastro de Produtos...</div>}>
              <CadProdutos />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/Entrada_Produtos',
        element: (
          <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}>
            <Suspense fallback={<div>Carregando Entrada de Produtos...</div>}>
              <EntradaProdutos />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/Cadastro_Refeicoes',
        element: (
          <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}>
            <Suspense fallback={<div>Carregando Cadastro de Refeições...</div>}>
              <CadastroRefeicoes />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/Dashboard_Refeicoes',
        element: (
          <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}>
            <Suspense fallback={<div>Carregando Dashboard de Refeições...</div>}>
              <RelatorioRef />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/Historico_Retirada',
        element: (
          <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}>
            <Suspense fallback={<div>Carregando Histórico de Retiradas...</div>}>
              <HistoricoRetiradas />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/Cadastro_Produtos',
        element: (
          <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}>
            <Suspense fallback={<div>Carregando Novo Pedido...</div>}>
              <NovoPedido />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/Gerenciador_Produtos',
        element: (
          <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}>
            <Suspense fallback={<div>Carregando Gerenciador...</div>}>
              <Gerenciador />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/Cadastro_Fornecedor',
        element: (
          <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}>
            <Suspense fallback={<div>Carregando Cadastro de Fornecedor...</div>}>
              <CadastroFornecedores />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/Refeicoes_Servidas',
        element: (
          <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, COZINHA_ONLY, ADMIN_TI]}>
            <Suspense fallback={<div>Carregando Refeições Servidas...</div>}>
              <ExibirRefeicoes />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
