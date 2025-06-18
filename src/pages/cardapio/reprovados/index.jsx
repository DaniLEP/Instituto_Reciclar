// import { useEffect, useState } from 'react';
// import { ref, get, set } from 'firebase/database';
// import { db, auth } from '../../../../firebase';
// import { Button } from '@/components/ui/Button/button';
// import * as Dialog from '@radix-ui/react-dialog';
// import { X } from 'phosphor-react';

// const CardapiosReprovados = () => {
//   const [cardapios, setCardapios] = useState([]);
//   const [modalVerMaisAberto, setModalVerMaisAberto] = useState(false);
//   const [cardapioVerMais, setCardapioVerMais] = useState(null);

//   useEffect(() => {
//     const fetchCardapios = async () => {
//       const user = auth.currentUser;
//       if (!user) return;

//       const snapshot = await get(ref(db, 'cardapiosReprovados'));
//       const lista = [];
//       snapshot.forEach(childSnap => {
//         const valor = childSnap.val();
//         if (valor.status === 'reprovado') {
//           lista.push({ id: childSnap.key, ...valor });
//         }
//       });
//       setCardapios(lista);
//     };

//     fetchCardapios();
//   }, []);

//   const formatDate = (date) => {
//     if (!date) return '-';
//     const d = new Date(date);
//     return d.toLocaleDateString('pt-BR');
//   };

//   const abrirModalVerMais = (cardapio) => {
//     setCardapioVerMais(cardapio);
//     setModalVerMaisAberto(true);
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Cardápios Reprovados</h1>
//       <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-red-50">
//             <tr>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-red-700 uppercase tracking-wide">
//                 Período
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-red-700 uppercase tracking-wide">
//                 Tipo do Cardápio
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-red-700 uppercase tracking-wide">
//                 Justificativa
//               </th>
//               <th className="px-4 py-3 text-center text-xs font-semibold text-red-700 uppercase tracking-wide">
//                 Ações
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-100">
//             {cardapios.length === 0 ? (
//               <tr>
//                 <td colSpan="4" className="py-8 text-center text-gray-500 italic">
//                   Nenhum cardápio reprovado encontrado.
//                 </td>
//               </tr>
//             ) : (
//               cardapios.map((c, idx) => (
//                 <tr
//                   key={c.id}
//                   className={idx % 2 === 0 ? 'bg-white' : 'bg-red-50'}
//                   tabIndex={0}
//                   aria-label={`Cardápio ${c.tipo} período de ${formatDate(c.periodo?.inicio)} a ${formatDate(c.periodo?.fim)}`}
//                 >
//                   <td className="px-4 py-3 whitespace-nowrap text-gray-700">
//                     {formatDate(c.periodo?.inicio)} – {formatDate(c.periodo?.fim)}
//                   </td>
//                   <td className="px-4 py-3 text-red-600 font-semibold whitespace-nowrap">{c.tipo}</td>
//                   <td className="px-4 py-3 text-red-600 whitespace-normal max-w-xs break-words">{c.justificativa}</td>
//                   <td className="px-4 py-3 text-center">
//                     <Button
//                       onClick={() => abrirModalVerMais(c)}
//                       className="bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white rounded-md px-3 py-1 text-sm transition"
//                       aria-label={`Ver detalhes do cardápio ${c.tipo}`}
//                     >
//                       Ver Mais
//                     </Button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal conforme seu pedido */}
//       <Dialog.Root open={modalVerMaisAberto} onOpenChange={setModalVerMaisAberto}>
//         <Dialog.Portal>
//           <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
//           <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[95vw] max-w-5xl max-h-[85vh] overflow-y-auto p-6 bg-white rounded-xl shadow-lg transform -translate-x-1/2 -translate-y-1/2">
//             <Dialog.Title className="text-2xl font-bold text-gray-800 mb-4">📊 Detalhes do Cardápio</Dialog.Title>

//             {cardapioVerMais && Object.entries(cardapioVerMais.composicoes || {}).map(([semana, dados]) => (
//               <div key={semana} className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-700 mb-2">{semana}</h3>
//                 <p><strong>Nutricionista:</strong> {dados.nutricionista?.nome} ({dados.nutricionista?.crn3})</p>
//                 <p><strong>Período:</strong> {formatDate(dados.periodo?.inicio)} até {formatDate(dados.periodo?.fim)}</p>

//                 <table className="w-full mt-3 text-sm border border-gray-300">
//                   <thead>
//                     <tr className="bg-gray-100">
//                       <th className="border px-2 py-1">Composição</th>
//                       {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map(dia => (
//                         <th key={dia} className="border px-2 py-1">{dia}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {Object.entries(dados.cardapio || {}).map(([secao, dias]) => (
//                       <tr key={secao}>
//                         <td className="border px-2 py-1 font-medium">{secao}</td>
//                         {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map(dia => (
//                           <td key={dia} className="border px-2 py-1">{dias[dia] || '-'}</td>
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ))}

//             <div className="flex justify-end mt-6">
//               <Button onClick={() => setModalVerMaisAberto(false)} className="bg-red-900 text-white flex items-center gap-1">
//                 <X size={16} /> Fechar
//               </Button>
//             </div>
//           </Dialog.Content>
//         </Dialog.Portal>
//       </Dialog.Root>
//     </div>
//   );
// };

// export default CardapiosReprovados;

import { useEffect, useState } from 'react';
import { ref, get, set, remove } from 'firebase/database';
import { db, auth } from '../../../../firebase';
import { Button } from '@/components/ui/Button/button';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CardapiosReprovados = () => {
  const [cardapios, setCardapios] = useState([]);
  const [modalEditar, setModalEditar] = useState(false);
  const [cardapioEditar, setCardapioEditar] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCardapios = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snapshot = await get(ref(db, 'cardapiosReprovados'));
      const lista = [];

      snapshot.forEach(childSnap => {
        const valor = childSnap.val();
        if (valor.status === 'reprovado') {
          lista.push({ id: childSnap.key, ...valor });
        }
      });

      setCardapios(lista);
      setCarregando(false);
    };

    fetchCardapios();
  }, []);

  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  };

  const abrirModalEditar = (cardapio) => {
    setCardapioEditar(cardapio);
    setModalEditar(true);
  };

  const handleInputChange = (semana, secao, dia, valor) => {
    setCardapioEditar(prev => {
      if (!prev) return prev;
      const novo = structuredClone(prev); // deep copy seguro
      if (!novo.composicoes[semana]) novo.composicoes[semana] = { cardapio: {} };
      if (!novo.composicoes[semana].cardapio) novo.composicoes[semana].cardapio = {};
      if (!novo.composicoes[semana].cardapio[secao]) novo.composicoes[semana].cardapio[secao] = {};
      novo.composicoes[semana].cardapio[secao][dia] = valor;
      return novo;
    });
  };

  const salvarAlteracoes = async () => {
    if (!cardapioEditar?.id) return;
    try {
      await set(ref(db, `cardapiosPendentes/${cardapioEditar.id}`), {
        ...cardapioEditar,
        status: 'pendente',
      });

      await remove(ref(db, `cardapiosReprovados/${cardapioEditar.id}`));
      setModalEditar(false);
      setCardapios(prev => prev.filter(c => c.id !== cardapioEditar.id));
      navigate('/Gerenciador-cardapios-reprovados');
    } catch (error) {
      alert('Erro ao salvar alterações: ' + error.message);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fadeIn">
       <div className="flex items-center mb-6">
              <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-black transition">
                <ArrowLeft className="mr-2" size={20} />
                Voltar
              </button>
            </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📛 Cardápios Reprovados</h1>

      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-center">
          <thead className="bg-red-100">
            <tr>
              {['Período', 'Tipo do Cardápio', 'Justificativa', 'Ações'].map((th) => (
                <th
                  key={th}
                  className="px-4 py-3 text-left text-xs font-bold text-red-700 uppercase tracking-wide text-center"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {carregando ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-400 italic">
                  Carregando cardápios...
                </td>
              </tr>
            ) : cardapios.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-500 italic">
                  Nenhum cardápio reprovado encontrado.
                </td>
              </tr>
            ) : (
              cardapios.map((c, idx) => (
                <tr
                  key={c.id}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-red-50'}
                >
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {formatDate(c.periodo?.inicio)} – {formatDate(c.periodo?.fim)}
                  </td>
                  <td className="px-4 py-3 text-red-700 font-semibold">{c.tipo}</td>
                  <td className="px-4 py-3 text-red-600 break-words max-w-sm">{c.justificativa}</td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      onClick={() => abrirModalEditar(c)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded-md text-sm shadow transition"
                    >
                      ✏️ Editar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog.Root open={modalEditar} onOpenChange={setModalEditar}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-5xl max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl z-50 animate-slideIn">
            <div className="flex justify-between items-start">
              <Dialog.Title className="text-2xl font-bold text-gray-800">
                ✏️ Editar Cardápio
              </Dialog.Title>
              <Button
                onClick={() => setModalEditar(false)}
                className="text-gray-400 hover:text-red-600 p-1"
              >
                <X size={20} />
              </Button>
            </div>

            <Dialog.Description className="text-sm text-gray-500 mb-4">
              Revise e ajuste as composições antes de reenviar para aprovação.
            </Dialog.Description>

            {cardapioEditar ? (
              Object.entries(cardapioEditar.composicoes || {}).map(([semana, dados]) => (
                <div key={semana} className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-700">{semana}</h3>
                  <p className="text-sm text-gray-600">
                    Nutricionista: <strong>{dados.nutricionista?.nome}</strong> ({dados.nutricionista?.crn3})<br />
                    Período: {formatDate(dados.periodo?.inicio)} até {formatDate(dados.periodo?.fim)}
                  </p>

                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-sm border border-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border px-3 py-2">Composição</th>
                          {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map((dia) => (
                            <th key={dia} className="border px-3 py-2">{dia}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(dados.cardapio || {}).map(([secao, dias]) => (
                          <tr key={secao}>
                            <td className="border px-2 py-1 font-semibold bg-gray-50">{secao}</td>
                            {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map((dia) => (
                              <td key={dia} className="border px-2 py-1">
                                <input
                                  type="text"
                                  value={dias[dia] || ''}
                                  onChange={(e) => handleInputChange(semana, secao, dia, e.target.value)}
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                  placeholder="Descreva..."
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">Carregando dados...</p>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <Button
                onClick={() => setModalEditar(false)}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancelar
              </Button>
              <Button
                onClick={salvarAlteracoes}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                ✅ Reenviar para Aprovação
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default CardapiosReprovados;
