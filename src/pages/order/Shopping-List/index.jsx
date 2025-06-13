// import { useEffect, useState } from 'react';
// import { db } from '../../../../firebase';
// import { ref, onValue, push, set, get } from 'firebase/database';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog/dialog';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/Button/button';

// export default function BaixoEstoquePage() {
//   const [produtosBaixoEstoque, setProdutosBaixoEstoque] = useState([]);
//   const [listaCompras, setListaCompras] = useState([]);
//   const [modalAberto, setModalAberto] = useState(false);
//   const [modalFornecedorAberto, setModalFornecedorAberto] = useState(false);
//   const [fornecedor, setFornecedor] = useState('');
//   const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
//   const [buscaFornecedor, setBuscaFornecedor] = useState('');
//   const [fornecedores, setFornecedores] = useState([]);
//   const [periodoInicio, setPeriodoInicio] = useState('');
//   const [periodoFim, setPeriodoFim] = useState('');
//   const [category, setCategory] = useState('');
//   const [tipo, setTipo] = useState('');
//   const [projeto, setProjeto] = useState('');
//   const [numeroPedido, setNumeroPedido] = useState('');

//   useEffect(() => {
//     const estoqueRef = ref(db, 'Estoque');
//     onValue(estoqueRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const produtos = Object.entries(data).map(([id, item]) => ({ id, ...item }));
//         const filtrados = produtos.filter((p) => parseInt(p.quantity) < 5);
//         setProdutosBaixoEstoque(filtrados);
//       }
//     });

//     const fornecedoresRef = ref(db, 'CadastroFornecedores');
//     onValue(fornecedoresRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const lista = Object.entries(data).map(([id, item]) => ({ id, ...item }));
//         setFornecedores(lista);
//       }
//     });

//     const pedidosRef = ref(db, 'novosPedidos');
//     get(pedidosRef).then((snapshot) => {
//       const data = snapshot.val();
//       const numero = data ? Object.keys(data).length + 1 : 1;
//       setNumeroPedido(`Lista-${numero.toString().padStart(4, '0')}`);
//     });
//   }, []);

//   const adicionarItemLista = (item) => {
//     if (!listaCompras.some((i) => i.id === item.id)) {
//       setListaCompras((prev) => [
//         ...prev,
//         { ...item, quantidade: item.quantidade || 1, observacao: item.observacao || '' },
//       ]);
//     }
//   };

//   const removerItemLista = (id) => {
//     setListaCompras((prev) => prev.filter((item) => item.id !== id));
//   };

//   const salvarListaCompras = () => {
//     if (!fornecedorSelecionado) {
//       alert('Por favor, selecione um fornecedor.');
//       return;
//     }
//     if (!periodoInicio || !periodoFim) {
//       alert('Por favor, selecione o período de datas.');
//       return;
//     }
//     if (listaCompras.length === 0) {
//       alert('A lista de compras está vazia.');
//       return;
//     }
//     if (!projeto) {
//       alert('Por favor, selecione um projeto.');
//       return;
//     }
//     if (!category) {
//       alert('Por favor, selecione uma categoria.');
//       return;
//     }

//     const novaListaRef = push(ref(db, 'novosPedidos'));
//     const dataPedidoFormatada = new Date().toISOString().split('T')[0];
//     const dataCriacaoFormatada = new Date().toISOString();

//     const pedido = {
//       numeroPedido,
//       fornecedor: {cnpj: fornecedorSelecionado.cnpj || '',contato: fornecedorSelecionado.contato || '',
//         email: fornecedorSelecionado.email || '', grupo: fornecedorSelecionado.grupo || '',
//         razaoSocial: fornecedorSelecionado.razaoSocial || '', telefone: fornecedorSelecionado.telefone || '',},
//       dataPedido: dataPedidoFormatada,
//       dataCriacao: dataCriacaoFormatada,
//       periodoInicio,
//       periodoFim,
//       category,
//       projeto,
//       status: 'Pendente',
//       produtos: listaCompras.map((item) => ({
//       category,
//         marca: item.marca || '', name: item.name || '',
//         observacao: item.observacao || '', tipo: item.tipo || '',
//         peso: item.peso || 1, quantidade: item.quantidade || 1,
//         sku: item.sku || '', supplier: fornecedorSelecionado.razaoSocial || '',
//         unit: item.unit || '', unitMeasure: item.unitMeasure || '',
//       })),
//     };

//     set(novaListaRef, pedido).then(() => {
//       setListaCompras([]);
//       setModalAberto(false);
//       setFornecedor('');
//       setFornecedorSelecionado(null);
//       setPeriodoInicio('');
//       setPeriodoFim('');
//       setCategory('');
//       setProjeto('');
//     });
//   };

//   const atualizarItemLista = (index, campo, valor) => {
//     setListaCompras((prev) => {
//       const novaLista = [...prev];
//       novaLista[index] = { ...novaLista[index], [campo]: valor };
//       return novaLista;
//     });
//   };
//   return (
//     <div className="p-4 md:p-8 max-w-7xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Lista de Compras</h1>
//       <Card className="mb-6">
//         <CardContent className="overflow-x-auto p-4">
//           <table className="table-auto w-full text-sm">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="p-2 text-center">SKU</th>
//                 <th className="p-2 text-center">Produto</th>
//                 <th className="p-2 text-center">Marca</th>
//                 <th className="p-2 text-center">Quantidade</th>
//                 <th className="p-2 text-center">Ação</th>
//               </tr>
//             </thead>
//             <tbody>
//               {produtosBaixoEstoque.map((produto) => (
//                 <tr key={produto.id} className="border-b">
//                   <td className="p-2 text-center">{produto.sku}</td>
//                   <td className="p-2 text-center">{produto.name}</td>
//                   <td className="p-2 text-center">{produto.marca}</td>
//                   <td className="p-2 text-center">{produto.quantity}</td>
//                   <td className="p-2 text-center"> <Button onClick={() => adicionarItemLista(produto)} size="sm" 
//                     className="bg-blue-600 hover:bg-blue-700">Selecionar</Button></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </CardContent>
//       </Card>
//       {listaCompras.length > 0 && (
//         <div>
//           <h2 className="text-xl font-semibold mb-4">Itens Selecionados</h2>
//           <Card className="mb-4">
//             <CardContent className="overflow-x-auto p-4">
//               <table className="table-auto w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="p-2 text-center">SKU</th>
//                     <th className="p-2 text-center">Produto</th>
//                     <th className="p-2 text-center">Marca</th>
//                     <th className="p-2 text-center">Quantidade</th>
//                     <th className="p-2 text-center">Observação</th>
//                     <th className="p-2 text-center">Ação</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {listaCompras.map((item, index) => (
//                     <tr key={item.id || index} className="border-b">
//                       <td className="p-2 text-center">{item.sku}</td>
//                       <td className="p-2 text-center">{item.name}</td>
//                       <td className="p-2 text-center">{item.marca}</td>
//                       <td className="p-2 text-center">
//                         <input type="number" min="1" className="w-16 border rounded px-2" value={item.quantidade} 
//                           onChange={(e) => atualizarItemLista(index, 'quantidade', parseInt(e.target.value) || 1)} />
//                       </td>
//                       <td className="p-2">
//                         <input type="text" className="w-full border rounded px-2" value={item.observacao || ''}
//                           onChange={(e) => atualizarItemLista(index, 'observacao', e.target.value)} />
//                       </td>
//                       <td className="p-2 text-center">
//                         <Button size="sm" variant="destructive" onClick={() => removerItemLista(item.id)}
//                           className="bg-red-600 hover:bg-red-700" >Remover</Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </CardContent>
//           </Card>
//           <Button onClick={() => setModalAberto(true)} className="bg-green-600 hover:bg-green-700">Finalizar Lista de Compras</Button>
//         </div>
//       )}
//       {/* Modal de Finalizar Lista */}
//       <Dialog open={modalAberto} onOpenChange={setModalAberto}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Finalizar Lista de Compras</DialogTitle></DialogHeader>
//           <div className="space-y-4">
//             <Input placeholder="Fornecedor (Clique para selecionar)" value={fornecedor}
//               onClick={() => setModalFornecedorAberto(true)} readOnly className="cursor-pointer"/>
//             {fornecedorSelecionado && (
//               <div className="space-y-2">
//                 <Input readOnly value={`Contato: ${fornecedorSelecionado.contato}`} className="bg-gray-100" />
//                 <Input readOnly value={`Telefone: ${fornecedorSelecionado.telefone}`} className="bg-gray-100" />
//                 <Input readOnly value={`Email: ${fornecedorSelecionado.email}`} className="bg-gray-100" />
//               </div>
//             )}
//             <label>Data Incio:</label>
//             <Input type="date" value={periodoInicio} onChange={(e) => setPeriodoInicio(e.target.value)} />
//             <label>Data Fim:</label>
//             <Input type="date" value={periodoFim} onChange={(e) => setPeriodoFim(e.target.value)} />
//             <select className="w-full p-2 border rounded" value={category} onChange={(e) => setCategory(e.target.value)}>
//               <option value="">Selecione a Categoria da Lista</option>
//               <option value="Proteina">Proteína</option>
//               <option value="Mantimento">Mantimento</option>
//               <option value="Hortifrut">Hortifrut</option>
//               <option value="Doações">Doações</option>
//               <option value="Produtos de Limpeza">Produtos de Limpeza</option>
//             </select>
//             <select className="w-full p-2 border rounded" value={tipo} onChange={(e) => setTipo(e.target.value)}>
//                 <option value="">Selecione o tipo da Lista</option>
//                 <option value="Aves">Aves</option>
//                 <option value="Suínos">Suínos</option>
//                 <option value="Bovinos">Bovinos</option>
//                 <option value="Pescados">Pescados</option>
//                 <option value="Frutas">Frutas</option>
//                 <option value="Legumes">Legumes</option>
//                 <option value="Verduras">Verduras</option>
//                 <option value="ProdutosConsumo">Produtos de Consumo</option>
//                 <option value="ProdutosLimpeza">Produtos de Limpeza</option>
//             </select>
//             <select className="w-full p-2 border rounded mt-4" value={projeto} onChange={(e) => setProjeto(e.target.value)}>
//               <option value="">Selecione o Projeto</option>
//               <option value="CONDECA">CONDECA</option>
//               <option value="FUMCAD">FUMCAD</option>
//               <option value="INSTITUTO RECICLAR">Instituto Reciclar</option>
//             </select>
//             </div>
//           <DialogFooter>
//             <Button onClick={salvarListaCompras} className="bg-blue-600 hover:bg-blue-700">Salvar Pedido</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Modal de seleção de fornecedor */}
//       <Dialog open={modalFornecedorAberto} onOpenChange={setModalFornecedorAberto}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Selecionar Fornecedor</DialogTitle></DialogHeader>
//           <Input placeholder="Buscar fornecedor" value={buscaFornecedor}
//             onChange={(e) => setBuscaFornecedor(e.target.value)} className="mb-4" />
//           <div className="max-h-60 overflow-y-auto space-y-2">
//             {fornecedores
//               .filter((f) => f?.razaoSocial?.toLowerCase().includes(buscaFornecedor.toLowerCase()))
//               .map((forn) => (<div key={forn.id}
//                 className="p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
//                 onClick={() => {
//                   setFornecedor(forn.razaoSocial);
//                   setFornecedorSelecionado(forn);
//                   setModalFornecedorAberto(false);}}>{forn.razaoSocial}</div>))}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { db } from '../../../../firebase';
import { ref, onValue, push, set, get } from 'firebase/database';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BaixoEstoquePage() {
  const navigate = useNavigate();
  const [produtosBaixoEstoque, setProdutosBaixoEstoque] = useState([]);
  const [listaCompras, setListaCompras] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalFornecedorAberto, setModalFornecedorAberto] = useState(false);
  const [fornecedor, setFornecedor] = useState('');
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
  const [buscaFornecedor, setBuscaFornecedor] = useState('');
  const [fornecedores, setFornecedores] = useState([]);
  const [periodoInicio, setPeriodoInicio] = useState('');
  const [periodoFim, setPeriodoFim] = useState('');
  const [category, setCategory] = useState('');
  const [tipo, setTipo] = useState('');
  const [projeto, setProjeto] = useState('');
  const [numeroPedido, setNumeroPedido] = useState('');

  useEffect(() => {
    const estoqueRef = ref(db, 'Estoque');
    onValue(estoqueRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const produtos = Object.entries(data).map(([id, item]) => ({ id, ...item }));
        const filtrados = produtos.filter((p) => parseInt(p.quantity) < 5);
        setProdutosBaixoEstoque(filtrados);
      }
    });

    const fornecedoresRef = ref(db, 'CadastroFornecedores');
    onValue(fornecedoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista = Object.entries(data).map(([id, item]) => ({ id, ...item }));
        setFornecedores(lista);
      }
    });

    const pedidosRef = ref(db, 'novosPedidos');
    get(pedidosRef).then((snapshot) => {
      const data = snapshot.val();
      const numero = data ? Object.keys(data).length + 1 : 1;
      setNumeroPedido(`Lista-${numero.toString().padStart(4, '0')}`);
    });
  }, []);

  const adicionarItemLista = (item) => {
    if (!listaCompras.some((i) => i.id === item.id)) {
      setListaCompras((prev) => [
        ...prev,
        { ...item, quantidade: item.quantidade || 1, observacao: item.observacao || '' },
      ]);
    }
  };

  const removerItemLista = (id) => {
    setListaCompras((prev) => prev.filter((item) => item.id !== id));
  };

  const salvarListaCompras = () => {
    if (!fornecedorSelecionado || !periodoInicio || !periodoFim || listaCompras.length === 0 || !projeto || !category) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const novaListaRef = push(ref(db, 'novosPedidos'));
    const dataPedidoFormatada = new Date().toISOString().split('T')[0];
    const dataCriacaoFormatada = new Date().toISOString();

    const pedido = {
      numeroPedido,
      fornecedor: {
        cnpj: fornecedorSelecionado.cnpj || '',
        contato: fornecedorSelecionado.contato || '',
        email: fornecedorSelecionado.email || '',
        grupo: fornecedorSelecionado.grupo || '',
        razaoSocial: fornecedorSelecionado.razaoSocial || '',
        telefone: fornecedorSelecionado.telefone || '',
      },
      dataPedido: dataPedidoFormatada,
      dataCriacao: dataCriacaoFormatada,
      periodoInicio,
      periodoFim,
      category,
      projeto,
      status: 'Pendente',
      produtos: listaCompras.map((item) => ({
        category,
        marca: item.marca || '',
        name: item.name || '',
        observacao: item.observacao || '',
        tipo: item.tipo || '',
        peso: item.peso || 1,
        quantidade: item.quantidade || 1,
        sku: item.sku || '',
        supplier: fornecedorSelecionado.razaoSocial || '',
        unit: item.unit || '',
        unitMeasure: item.unitMeasure || '',
      })),
    };

    set(novaListaRef, pedido).then(() => {
      setListaCompras([]);
      setModalAberto(false);
      setFornecedor('');
      setFornecedorSelecionado(null);
      setPeriodoInicio('');
      setPeriodoFim('');
      setCategory('');
      setProjeto('');
    });
  };

  const atualizarItemLista = (index, campo, valor) => {
    setListaCompras((prev) => {
      const novaLista = [...prev];
      novaLista[index] = { ...novaLista[index], [campo]: valor };
      return novaLista;
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold">Lista de Compras</h1>
      </div>

      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="min-w-full table-auto text-sm border">
              <thead className="sticky top-0 z-10 bg-blue-100 shadow-sm">
                <tr>
                  <th className="p-3 text-center font-medium text-gray-700">SKU</th>
                  <th className="p-3 text-center font-medium text-gray-700">Produto</th>
                  <th className="p-3 text-center font-medium text-gray-700">Marca</th>
                  <th className="p-3 text-center font-medium text-gray-700">Quantidade no Estoque</th>
                  <th className="p-3 text-center font-medium text-gray-700">Ação</th>
                </tr>
              </thead>
              <tbody>
                {produtosBaixoEstoque.map((produto) => (
                  <tr key={produto.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 text-center">{produto.sku}</td>
                    <td className="p-2 text-center">{produto.name}</td>
                    <td className="p-2 text-center">{produto.marca}</td>
                    <td className="p-2 text-center">{produto.quantity}</td>
                    <td className="p-2 text-center">
                      <Button onClick={() => adicionarItemLista(produto)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Selecionar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {listaCompras.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Itens Selecionados</h2>
          <Card className="shadow-md">
            <CardContent className="overflow-x-auto max-h-96 overflow-y-auto p-4 border rounded-md">
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="p-2 text-center">SKU</th>
                    <th className="p-2 text-center">Produto</th>
                    <th className="p-2 text-center">Marca</th>
                    <th className="p-2 text-center">Qtd</th>
                    <th className="p-2 text-center">Observação</th>
                    <th className="p-2 text-center">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {listaCompras.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50 border-b">
                      <td className="p-2 text-center">{item.sku}</td>
                      <td className="p-2 text-center">{item.name}</td>
                      <td className="p-2 text-center">{item.marca}</td>
                      <td className="p-2 text-center">
                        <Input type="number" min="1" className="w-16" value={item.quantidade} onChange={(e) => atualizarItemLista(index, 'quantidade', parseInt(e.target.value) || 1)} />
                      </td>
                      <td className="p-2">
                        <Input type="text" value={item.observacao || ''} onChange={(e) => atualizarItemLista(index, 'observacao', e.target.value)} />
                      </td>
                      <td className="p-2 text-center">
                        <Button variant="destructive" size="sm" onClick={() => removerItemLista(item.id)}>Remover</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <Button onClick={() => setModalAberto(true)} className="bg-green-600 hover:bg-green-700 text-white">Finalizar Lista</Button>
        </div>
      )}

      {/* Modal de Finalizar Lista */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Lista de Compras</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Input
              placeholder="Fornecedor (Clique para selecionar)"
              value={fornecedor}
              onClick={() => setModalFornecedorAberto(true)}
              readOnly
              className="cursor-pointer"
            />
            {fornecedorSelecionado && (
              <div className="space-y-2 mt-2">
                <Input readOnly value={`Contato: ${fornecedorSelecionado.contato}`} className="bg-gray-100" />
                <Input readOnly value={`Telefone: ${fornecedorSelecionado.telefone}`} className="bg-gray-100" />
                <Input readOnly value={`Email: ${fornecedorSelecionado.email}`} className="bg-gray-100" />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Data Início:</label>
                <Input type="date" value={periodoInicio} onChange={(e) => setPeriodoInicio(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Data Fim:</label>
                <Input type="date" value={periodoFim} onChange={(e) => setPeriodoFim(e.target.value)} />
              </div>
            </div>

            <select
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Selecione a Categoria da Lista</option>
              <option value="Proteina">Proteína</option>
              <option value="Mantimento">Mantimento</option>
              <option value="Hortifrut">Hortifrut</option>
              <option value="Doações">Doações</option>
              <option value="Produtos de Limpeza">Produtos de Limpeza</option>
            </select>

            <select
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="">Selecione o tipo da Lista</option>
              <option value="Aves">Aves</option>
              <option value="Suínos">Suínos</option>
              <option value="Bovinos">Bovinos</option>
              <option value="Pescados">Pescados</option>
              <option value="Frutas">Frutas</option>
              <option value="Legumes">Legumes</option>
              <option value="Verduras">Verduras</option>
              <option value="ProdutosConsumo">Produtos de Consumo</option>
              <option value="ProdutosLimpeza">Produtos de Limpeza</option>
            </select>

            <select
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={projeto}
              onChange={(e) => setProjeto(e.target.value)}
            >
              <option value="">Selecione o Projeto</option>
              <option value="CONDECA">CONDECA</option>
              <option value="FUMCAD">FUMCAD</option>
              <option value="INSTITUTO RECICLAR">Instituto Reciclar</option>
            </select>
          </div>
          <DialogFooter>
            <Button onClick={salvarListaCompras} className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto px-6 py-2 font-semibold transition">
              Salvar Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de seleção de fornecedor */}
      <Dialog open={modalFornecedorAberto} onOpenChange={setModalFornecedorAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecionar Fornecedor</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Buscar fornecedor"
            value={buscaFornecedor}
            onChange={(e) => setBuscaFornecedor(e.target.value)}
            className="mb-4"
          />
          <div className="max-h-60 overflow-y-auto space-y-2">
            {fornecedores
              .filter((f) => f?.razaoSocial?.toLowerCase().includes(buscaFornecedor.toLowerCase()))
              .map((forn) => (
                <div
                  key={forn.id}
                  className="p-3 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer transition"
                  onClick={() => {
                    setFornecedor(forn.razaoSocial);
                    setFornecedorSelecionado(forn);
                    setModalFornecedorAberto(false);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setFornecedor(forn.razaoSocial);
                      setFornecedorSelecionado(forn);
                      setModalFornecedorAberto(false);
                    }
                  }}
                >
                  {forn.razaoSocial}
                </div>
              ))}
            {fornecedores.filter((f) =>
              f?.razaoSocial?.toLowerCase().includes(buscaFornecedor.toLowerCase())
            ).length === 0 && (
              <p className="text-center text-gray-500 italic">Nenhum fornecedor encontrado.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
