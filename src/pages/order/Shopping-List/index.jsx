import { useEffect, useState } from 'react';
import { db } from '../../../../firebase';
import { ref, onValue, push, set, get } from 'firebase/database';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

export default function BaixoEstoquePage() {
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
  const [categoria, setCategoria] = useState('');
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
      setNumeroPedido(`PED-${numero.toString().padStart(4, '0')}`);
    });
  }, []);

  const adicionarItemLista = (item) => {
    if (!listaCompras.some((i) => i.id === item.id)) {
      setListaCompras((prev) => [
        ...prev,
        {
          ...item,
          quantidade: item.quantity || 1,
          observacao: item.observacao || '',
        },
      ]);
    }
  };

  const removerItemLista = (id) => {
    setListaCompras((prev) => prev.filter((item) => item.id !== id));
  };

  const salvarListaCompras = () => {
    if (!fornecedorSelecionado) {
      alert('Por favor, selecione um fornecedor.');
      return;
    }
    if (!periodoInicio || !periodoFim) {
      alert('Por favor, selecione o período de datas.');
      return;
    }
    if (listaCompras.length === 0) {
      alert('A lista de compras está vazia.');
      return;
    }

    const novaListaRef = push(ref(db, 'novosPedidos'));
    const dataPedidoFormatada = new Date().toISOString().split('T')[0];
    const dataCriacaoFormatada = new Date().toISOString();

    set(novaListaRef, {
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
      periodo: { periodoInicio, periodoFim },
      categoria,
      projeto,
      itens: listaCompras.map(({ quantidade, observacao, id, name, marca }) => ({
        id,
        name,
        marca,
        quantidade,
        observacao,
      })),
      status: 'Pendente',
    });

    setListaCompras([]);
    setModalAberto(false);
    setFornecedor('');
    setFornecedorSelecionado(null);
    setPeriodoInicio('');
    setPeriodoFim('');
    setCategoria('');
    setProjeto('');
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
      <h1 className="text-2xl font-bold mb-4">Lista de Compras</h1>

      <Card className="mb-6">
        <CardContent className="overflow-x-auto p-4">
          <table className="table-auto w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-center">SKU</th>
                <th className="p-2 text-center">Produto</th>
                <th className="p-2 text-center">Marca</th>
                <th className="p-2 text-center">Quantidade</th>
                <th className="p-2 text-center">Ação</th>
              </tr>
            </thead>
            <tbody>
              {produtosBaixoEstoque.map((produto) => (
                <tr key={produto.id} className="border-b">
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
        </CardContent>
      </Card>

      {listaCompras.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Itens Selecionados</h2>
          <Card className="mb-4">
            <CardContent className="overflow-x-auto p-4">
              <table className="table-auto w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-center">SKU</th>
                    <th className="p-2 text-center">Produto</th>
                    <th className="p-2 text-center">Marca</th>
                    <th className="p-2 text-center">Quantidade</th>
                    <th className="p-2 text-center">Observação</th>
                    <th className="p-2 text-center">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {listaCompras.map((item, index) => (
                    <tr key={item.id || index} className="border-b">
                      <td className="p-2 text-center">{item.sku}</td>
                      <td className="p-2 text-center">{item.name}</td>
                      <td className="p-2 text-center">{item.marca}</td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="1"
                          className="w-16 border rounded px-2"
                          value={item.quantidade}
                          onChange={(e) => atualizarItemLista(index, 'quantidade', parseInt(e.target.value) || 1)}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          className="w-full border rounded px-2"
                          value={item.observacao || ''}
                          onChange={(e) => atualizarItemLista(index, 'observacao', e.target.value)}
                        />
                      </td>
                      <td className="p-2 text-center">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removerItemLista(item.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Remover
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Button onClick={() => setModalAberto(true)} className="bg-green-600 hover:bg-green-700">
            Finalizar Lista de Compras
          </Button>
        </div>
      )}

      {/* Modal de Finalizar Lista */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Lista de Compras</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Fornecedor (Clique para selecionar)"
              value={fornecedor}
              onClick={() => setModalFornecedorAberto(true)}
              readOnly
              className="cursor-pointer"
            />

            {fornecedorSelecionado && (
              <div className="space-y-2">
                <Input readOnly value={`Contato: ${fornecedorSelecionado.contato}`} className="bg-gray-100" />
                <Input readOnly value={`Telefone: ${fornecedorSelecionado.telefone}`} className="bg-gray-100" />
                <Input readOnly value={`Email: ${fornecedorSelecionado.email}`} className="bg-gray-100" />
              </div>
            )}

            <Input type="date" value={periodoInicio} onChange={(e) => setPeriodoInicio(e.target.value)} />
            <Input type="date" value={periodoFim} onChange={(e) => setPeriodoFim(e.target.value)} />
            <select className="w-full p-2 border rounded" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="Selecionar">Selecione a Categoria do pedido</option>
                <option value="Proteina">Proteína</option>
                <option value="Mantimento">Mantimento</option>
                <option value="Hortifrut">Hortifrut</option>
                <option value="Doações">Doações</option>
                <option value="Produtos de Limpeza">Produtos de Limpeza</option>
            </select>
            <select className="w-full p-2 border rounded mt-4" value={projeto} onChange={(e) => setProjeto(e.target.value)}>
                <option value="Selecionar">Selecione o Projeto</option>
                <option value="CONDECA">CONDECA</option>
                <option value="FUMCAD">FUMCAD</option>
                <option value="INSTITUTO RECICLAR">Instituto Reciclar</option>
            </select>        
            </div>
          <DialogFooter>
            <Button onClick={salvarListaCompras} className="bg-blue-600 hover:bg-blue-700">
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
                  className="p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setFornecedor(forn.razaoSocial);
                    setFornecedorSelecionado(forn);
                    setModalFornecedorAberto(false);
                  }}
                >
                  {forn.razaoSocial}
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}