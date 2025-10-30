import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UserType } from './components/enum/usertype/usertype.js';
import { ProtectedRoute } from './components/enum/protectedRouted/protectedRouted';
import React from 'react';
import './index.css';
import App from './App.jsx';
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
import CarregarCardapios from './pages/cardapio/almoco/list_almoco';
import ConsultaCardapioLanche from './pages/cardapio/lanche/list_lanche';
import HomeMaintenance from './pages/home/maintenance';
import Maintences from './pages/maintenance/maintenance';
import PaginaNaoEncontradaGoogleStyle from '@/components/ui/error';
import Checklist from './pages/maintenance/checkList/Kitchen';
import ChecklistConsulta from './pages/maintenance/checkList/Kitchen/view_Checklist';
import ConsultaReceitas from './pages/cardapio/technical_sheet_register/view_technical';
import ConsultaCardapioCafe from './pages/cardapio/breakfast/list_breakfast';
import CadastroCardapioCafe from './pages/cardapio/breakfast';
import BaixoEstoquePage from './pages/order/Shopping-List';
import FichaTecnicaHome from './pages/cardapio/cadapio_primary/fichaTecnica';
import RefeicoesHome from './pages/cardapio/cadapio_primary/refeicoes';
import OpcoesCardapios from './pages/cardapio/cadapio_primary/opcoesCardapios';
import CadastroCardapioAlmoco from '@/pages/cardapio/almoco/index.jsx';
import ConsultaCardapioAlmoco from './pages/cardapio/almoco/list_almoco';
import AprovacaoCardapios from './pages/cardapio/Aprovacao';
import CardapiosReprovados from './pages/cardapio/reprovados';
import GerenciadorCardapios from './pages/cardapio/cadapio_primary/gerenciador';
import CadastroCardapio from './pages/cardapio';
import ViewCardapio from './pages/cardapio/view';
import CadastroReceitas from './pages/cardapio/technical_sheet_register';
import Anual from './pages/dashboard/novosPedidos/index.jsx';
import Caixa from './pages/caixa/index.jsx';
import VisualizarInventario from './pages/Stock/inventary/index.jsx';

// Constantes para tipos de usuários
const COZINHA_ONLY = [UserType.COZINHA];
const NUTRICIONISTA_ONLY = [UserType.NUTRICIONISTA];
const ADMIN_ONLY = [UserType.ADMIN];
const ALL_TYPES = [UserType.ADMIN, UserType.USER, UserType.TI];
const ADMIN_TI = [UserType.ADMIN, UserType.TI];

// Rotas com lazy loading
const Estoque = React.lazy(() => import('@/pages/Stock'));
const Relatorio = React.lazy(() => import('@/pages/home/dashboard'));
const CadProdutos = React.lazy(() => import('@/pages/register/product'));
const EntradaProdutos = React.lazy(() => import('@/pages/register/prohibited'));
const CadastroRefeicoes = React.lazy(() => import('@/pages/cardapio/revenue_register'));
const RelatorioRef = React.lazy(() => import('@/pages/dashboard/revenue'));
const HistoricoRetiradas = React.lazy(() => import('@/pages/withdraw/withdral-history'));
const NovoPedido = React.lazy(() => import('@/pages/order/register_order/index.jsx'));
const Gerenciador = React.lazy(() => import('@/pages/register/product_manager'));
const CadastroFornecedores = React.lazy(() => import('@/pages/register/Supplier'));
const ExibirRefeicoes = React.lazy(() => import('@/pages/cardapio/revenue_list'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <PaginaNaoEncontradaGoogleStyle />,
    children: [
      { path: '/', element: <LoginForm /> },
      { path: '/Home', element: <ProtectedRoute allowedTypes={[...ALL_TYPES,  ...NUTRICIONISTA_ONLY ,...ADMIN_ONLY, ...COZINHA_ONLY, ...ADMIN_TI]}><Home /></ProtectedRoute> },
      { path: '/Pedidos', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI]}><ListaPedidos /></ProtectedRoute> },
      { path: '/Cadastro', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI]}><Cadastro /></ProtectedRoute> },
      { path: '/home-retirada', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ...COZINHA_ONLY, ADMIN_TI]}><RetiradaProdutos /></ProtectedRoute> },
      { path: '/Retirada', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ...COZINHA_ONLY, ADMIN_TI]}><Retirada /></ProtectedRoute> },
      { path: '/Editar_Produto/:id', element: <ProtectedRoute allowedTypes={[ ...ALL_TYPES, ADMIN_ONLY, ADMIN_TI]}><EditarProduto /></ProtectedRoute> },
      { path: '/Meu_Perfil', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ...COZINHA_ONLY, ADMIN_TI]}><Profile /></ProtectedRoute> },
      { path: '/Registro_Usuario', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI]}><Registro /></ProtectedRoute> },
      { path: '/Verificacao_Usuario', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI]}><AdminUsuarios /></ProtectedRoute> },
      { path: '/Visualizar_Fornecedores', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI]}><VisualizarFornecedores /></ProtectedRoute> },
      { path: '/Gestão_Pedido', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI]}><StatusPedidos /></ProtectedRoute> },
      { path: '/editar-fornecedor/:id', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI]}><EditarFornecedor /></ProtectedRoute> },
      { path: '/cadastro-de-almoço', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI]}><CardapioSemana2 /></ProtectedRoute> },
      { path: '/cardapio', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ...COZINHA_ONLY, ADMIN_TI]}><Cardapio /></ProtectedRoute> },
      { path: '/cadastro-cardápio-lanche', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI]}><CardapioLanche /></ProtectedRoute> },
      { path: '/cardápio-almoco', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ...COZINHA_ONLY, ADMIN_ONLY, ADMIN_TI]}><CarregarCardapios /></ProtectedRoute> },
      { path: '/cardápio-lanche', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI]}><ConsultaCardapioLanche /></ProtectedRoute> },
      { path: '/manutencao-home', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI]}><HomeMaintenance /></ProtectedRoute> },
      { path: '/manutencao', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI]}><Maintences /></ProtectedRoute> },
      { path: '/checkList', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ...COZINHA_ONLY, ADMIN_TI]}><Checklist /></ProtectedRoute> },
      { path: '/consultaCheck', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ...COZINHA_ONLY, ADMIN_TI]}>< ChecklistConsulta /></ProtectedRoute> },
      { path: '/cadatro-receita', element: <ProtectedRoute allowedTypes={[ALL_TYPES, ADMIN_ONLY,  ...NUTRICIONISTA_ONLY, ...COZINHA_ONLY, ...ADMIN_TI]}><CadastroReceitas /></ProtectedRoute> },
      { path: '/consultar-receita', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ...COZINHA_ONLY,  ...NUTRICIONISTA_ONLY, ADMIN_TI]}>< ConsultaReceitas /></ProtectedRoute> },
      { path: '/cadastro-cardapio-cafe', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI,  ...NUTRICIONISTA_ONLY]}>< CadastroCardapioCafe /></ProtectedRoute> },
      { path: '/consultar-cardapio-cafe', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ...COZINHA_ONLY, ADMIN_TI,  ...NUTRICIONISTA_ONLY]}>< ConsultaCardapioCafe /></ProtectedRoute> },
      { path: '/Lista_Compras', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI,  ...NUTRICIONISTA_ONLY]}>< BaixoEstoquePage /></ProtectedRoute> },
      { path: '/ficha-tecnica', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ...COZINHA_ONLY, ADMIN_TI,  ...NUTRICIONISTA_ONLY]}>< FichaTecnicaHome /></ProtectedRoute> },
      { path: '/refeicoes', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ...COZINHA_ONLY, ADMIN_TI,  ...NUTRICIONISTA_ONLY]}>< RefeicoesHome /></ProtectedRoute> },
      { path: '/cardapios', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ...COZINHA_ONLY, ADMIN_TI]}>< OpcoesCardapios /></ProtectedRoute> },
      { path: '/cadastro-de-almoco', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ...COZINHA_ONLY, ADMIN_TI]}>< CadastroCardapioAlmoco /></ProtectedRoute> },
      { path: '/cardapio-almoco', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ...COZINHA_ONLY, ADMIN_TI]}>< ConsultaCardapioAlmoco /></ProtectedRoute> },
      { path: '/cadastro-cardapio-lanche', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY,  ...NUTRICIONISTA_ONLY, ...COZINHA_ONLY, ADMIN_TI]}>< CadastroCardapioCafe /></ProtectedRoute> },
      { path: '/cardapio-lanche', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ...COZINHA_ONLY,  ...NUTRICIONISTA_ONLY, ADMIN_TI]}>< ConsultaCardapioLanche /></ProtectedRoute> },
      { path: '/cadastro-refeicoes', element: <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ...COZINHA_ONLY, ...NUTRICIONISTA_ONLY, ADMIN_TI]}>< CadastroRefeicoes /></ProtectedRoute> },
      { path: '/Anual', element: ( <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ...COZINHA_ONLY, ADMIN_TI]}> <Suspense fallback={<div>Carregando Dash...</div>}><Anual /></Suspense></ProtectedRoute>)},
      { path: '/Estoque',  element: ( <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ...COZINHA_ONLY, ADMIN_TI]}> <Suspense fallback={<div>Carregando Estoque...</div>}><Estoque /></Suspense></ProtectedRoute>)},
      { path: '/Dashboard', element: (<ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI]}> <Suspense fallback={<div>Carregando Dashboard...</div>}> <Relatorio /> </Suspense> </ProtectedRoute>),},
      { path: '/Cadastro_Geral', element: ( <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ...COZINHA_ONLY, ADMIN_TI]}>  <Suspense fallback={<div>Carregando Cadastro de Produtos...</div>}> <CadProdutos /></Suspense> </ProtectedRoute> ),},
      { path: '/Entrada_Produtos', element: ( <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI]}> <Suspense fallback={<div>Carregando Entrada de Produtos...</div>}><EntradaProdutos /> </Suspense> </ProtectedRoute>), },
      { path: '/Cadastro_Refeicoes', element: ( <ProtectedRoute allowedTypes={[...ALL_TYPES,  ADMIN_TI]}> <Suspense fallback={<div>Carregando Cadastro de Refeições...</div>}> <CadastroRefeicoes /> </Suspense> </ProtectedRoute> ), },
      { path: '/Dashboard_Refeicoes', element: ( <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI]}> <Suspense fallback={<div>Carregando Dashboard de Refeições...</div>}>  <RelatorioRef /> </Suspense> </ProtectedRoute>),},
      { path: '/Historico_Retirada', element: ( <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ...COZINHA_ONLY, ADMIN_TI]}> <Suspense fallback={<div>Carregando Histórico de Retiradas...</div>}><HistoricoRetiradas /> </Suspense> </ProtectedRoute> ),},
      { path: '/Cadastro_Produtos', element: ( <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI]}> <Suspense fallback={<div>Carregando Novo Pedido...</div>}>  <NovoPedido /> </Suspense> </ProtectedRoute> ),},
      { path: '/Gerenciador_Produtos', element: ( <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI]}> <Suspense fallback={<div>Carregando Gerenciador...</div>}> <Gerenciador /> </Suspense> </ProtectedRoute> ),},
      { path: '/Cadastro_Fornecedor', element: (<ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI]}> <Suspense fallback={<div>Carregando Cadastro de Fornecedor...</div>}> <CadastroFornecedores /> </Suspense> </ProtectedRoute> ), },
      { path: '/refeicoes-servidas', element: ( <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI, ...COZINHA_ONLY]}><Suspense fallback={<div>Carregando Refeições Servidas...</div>}>  <ExibirRefeicoes /> </Suspense></ProtectedRoute>),},
      { path: '/Gerenciador-cardapios', element: ( <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ...COZINHA_ONLY, ADMIN_TI]}> <Suspense fallback={<div>Carregando Cardapios Pendentes...</div>}>  <AprovacaoCardapios /> </Suspense></ProtectedRoute>),},
      { path: '/Gerenciador-cardapios-reprovados', element: ( <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI, ...COZINHA_ONLY]}> <Suspense fallback={<div>Carregando Cardapios Reprovados...</div>}>  <CardapiosReprovados /> </Suspense></ProtectedRoute>),},
      { path: '/Gerenciador', element: ( <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI, ...COZINHA_ONLY]}><Suspense fallback={<div>Carregando Cardapios...</div>}>  <GerenciadorCardapios /> </Suspense></ProtectedRoute>),},
      { path: '/cadastro-de-cardapio', element: ( <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI, ...COZINHA_ONLY]}> <Suspense fallback={<div>Carregando Cardapios...</div>}>  <CadastroCardapio /> </Suspense></ProtectedRoute>), },
      { path: '/consultar-cardapio',element: ( <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI, ...COZINHA_ONLY]}> <Suspense fallback={<div>Carregando Cardapios...</div>}>  <ViewCardapio /> </Suspense></ProtectedRoute>),},
      { path: '/sistema-caixa',element: ( <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI, ...COZINHA_ONLY]}> <Suspense fallback={<div>Carregando Cardapios...</div>}>  <Caixa /> </Suspense></ProtectedRoute>),},
      { path: '/visualizar-inventario',element: ( <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI, ...COZINHA_ONLY]}> <Suspense fallback={<div>Carregando Cardapios...</div>}>  <VisualizarInventario /> </Suspense></ProtectedRoute>),},
      { path: '/dashboard-revenue',element: ( <ProtectedRoute allowedTypes={[...ALL_TYPES, ADMIN_ONLY, ADMIN_TI, ...COZINHA_ONLY]}> <Suspense fallback={<div>Carregando Cardapios...</div>}>  <RelatorioRef /> </Suspense></ProtectedRoute>),},

    ],
  },
]);
createRoot(document.getElementById('root')).render( <StrictMode> <RouterProvider router={router} /> </StrictMode>);



