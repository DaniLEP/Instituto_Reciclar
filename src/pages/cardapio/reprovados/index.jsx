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
import { ref, get, set, remove} from 'firebase/database';
import { db, auth } from '../../../../firebase';
import { Button } from '@/components/ui/Button/button';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'phosphor-react';
import { useNavigate } from 'react-router-dom'; // Importa o hook

const CardapiosReprovados = () => {
  const [cardapios, setCardapios] = useState([]);
  const [modalEditar, setModalEditar] = useState(false);
  const [cardapioEditar, setCardapioEditar] = useState(null);
  const navigate = useNavigate(); // inicializa o navigate

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
    setCardapioEditar((prev) => {
      if (!prev) return prev;
      const novo = { ...prev };
      if (!novo.composicoes) novo.composicoes = {};
      if (!novo.composicoes[semana]) novo.composicoes[semana] = { ...novo.composicoes[semana], cardapio: {} };
      if (!novo.composicoes[semana].cardapio) novo.composicoes[semana].cardapio = {};
      if (!novo.composicoes[semana].cardapio[secao]) novo.composicoes[semana].cardapio[secao] = {};
      novo.composicoes[semana].cardapio[secao][dia] = valor;
      return novo;
    });
  };

const salvarAlteracoes = async () => {
  if (!cardapioEditar?.id) return;
  try {
    // Primeiro adiciona em cardapiosPendentes
    await set(ref(db, `cardapiosPendentes/${cardapioEditar.id}`), {
      ...cardapioEditar,
      status: 'pendente', // atualiza o status para pendente, se quiser
    });

    // Depois remove do cardapiosReprovados
    await remove(ref(db, `cardapiosReprovados/${cardapioEditar.id}`));

    setModalEditar(false);
    setCardapios((prev) => prev.filter((c) => c.id !== cardapioEditar.id));
    navigate('/Gerenciador-cardapios-reprovados'); // redireciona após salvar
  } catch (error) {
    alert('Erro ao salvar alterações: ' + error.message);
  }
};

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Cardápios Reprovados</h1>
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-red-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-red-700 uppercase tracking-wide">
                Período
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-red-700 uppercase tracking-wide">
                Tipo do Cardápio
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-red-700 uppercase tracking-wide">
                Justificativa
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-red-700 uppercase tracking-wide">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {cardapios.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500 italic">
                  Nenhum cardápio reprovado encontrado.
                </td>
              </tr>
            ) : (
              cardapios.map((c, idx) => (
                <tr
                  key={c.id}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-red-50'}
                  tabIndex={0}
                  aria-label={`Cardápio ${c.tipo} período de ${formatDate(c.periodo?.inicio)} a ${formatDate(c.periodo?.fim)}`}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                    {formatDate(c.periodo?.inicio)} – {formatDate(c.periodo?.fim)}
                  </td>
                  <td className="px-4 py-3 text-red-600 font-semibold whitespace-nowrap">{c.tipo}</td>
                  <td className="px-4 py-3 text-red-600 whitespace-normal max-w-xs break-words">{c.justificativa}</td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      onClick={() => abrirModalEditar(c)}
                      className="bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white rounded-md px-3 py-1 text-sm transition"
                      aria-label={`Editar cardápio ${c.tipo}`}
                    >
                      Editar
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
  <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow z-40" />
  <Dialog.Content
    className="fixed z-50 top-1/2 left-1/2 max-h-[85vh] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-lg focus:outline-none overflow-y-auto"
  >
    <Dialog.Title className="text-2xl font-bold text-gray-800 mb-4">✏️ Editar Cardápio</Dialog.Title>
    <Dialog.Description className="text-gray-600 mb-4">
      Aqui você pode editar os detalhes do cardápio rejeitado.
    </Dialog.Description>

                {cardapioEditar ? (
              Object.entries(cardapioEditar.composicoes || {}).map(([semana, dados]) => (
                <div key={semana} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">{semana}</h3>
                  <p>
                    <strong>Nutricionista:</strong> {dados.nutricionista?.nome} ({dados.nutricionista?.crn3})
                  </p>
                  <p>
                    <strong>Período:</strong> {formatDate(dados.periodo?.inicio)} até {formatDate(dados.periodo?.fim)}
                  </p>

                  <table className="w-full mt-3 text-sm border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-2 py-1">Composição</th>
                        {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map((dia) => (
                          <th key={dia} className="border px-2 py-1">{dia}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(dados.cardapio || {}).map(([secao, dias]) => (
                        <tr key={secao}>
                          <td className="border px-2 py-1 font-medium">{secao}</td>
                          {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map((dia) => (
                            <td key={dia} className="border px-2 py-1">
                              <input
                                type="text"
                                value={dias[dia] || ''}
                                onChange={(e) => handleInputChange(semana, secao, dia, e.target.value)}
                                className="w-full border rounded px-1 py-0.5"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <p>Carregando dados...</p>
            )}

    <div className="flex justify-end gap-2 mt-6">
      <Button
        onClick={() => setModalEditar(false)}
        className="bg-red-900 text-white flex items-center gap-1"
      >
        <X size={16} /> Cancelar
      </Button>
      <Button onClick={salvarAlteracoes} className="bg-green-600 text-white">
        Reenviar para Aprovação
      </Button>
    </div>
  </Dialog.Content>
</Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default CardapiosReprovados;
