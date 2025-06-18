// import { useEffect, useState } from 'react';
// import { ref, onValue, remove, set } from 'firebase/database';
// import { db } from '../../../../firebase';
// import { ToastContainer, toast } from 'react-toastify';
// import { Button } from '@/components/ui/Button/button';
// import * as Dialog from '@radix-ui/react-dialog';
// import { X, Info, ThumbsUp, ThumbsDown } from 'lucide-react';

// const AprovacaoCardapios = () => {
//   const [pendentes, setPendentes] = useState([]);
//   const [modalAberto, setModalAberto] = useState(false);
//   const [justificativa, setJustificativa] = useState('');
//   const [selecionado, setSelecionado] = useState(null);
//   const [modalVerMaisAberto, setModalVerMaisAberto] = useState(false);
//   const [cardapioVerMais, setCardapioVerMais] = useState(null);

//   useEffect(() => {
//     const unsub = onValue(ref(db, 'cardapiosPendentes'), (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const lista = Object.entries(data).map(([id, valor]) => ({ id, ...valor }));
//         setPendentes(lista);
//       } else {
//         setPendentes([]);
//       }
//     });

//     return () => unsub();
//   }, []);

//     const formatDate = (timestamp) => {
//     if (!timestamp) return "Data inválida";
//     let date = typeof timestamp === "string" ? new Date(Date.parse(timestamp)) : new Date(timestamp);
//     if (isNaN(date.getTime())) return "Data inválida";
//     const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
//     const day = String(localDate.getDate()).padStart(2, "0");
//     const month = String(localDate.getMonth() + 1).padStart(2, "0");
//     const year = localDate.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

// const aprovar = async (cardapio) => {
//   try {
//     const tipo = cardapio.tipo || 'naoInformado';

//     // Salva em cardapiosAprovados com o ID
//     await set(ref(db, `cardapiosAprovados/${cardapio.id}`), {
//       ...cardapio,
//       status: 'aprovado',
//       aprovadoEm: new Date().toISOString()
//     });

//     // Também salva no caminho separado por tipo
//     await set(ref(db, `cardapiosAprovadosPorTipo/${tipo}/${cardapio.id}`), {
//       ...cardapio,
//       status: 'aprovado',
//       aprovadoEm: new Date().toISOString()
//     });

//     // Remove dos pendentes
//     await remove(ref(db, `cardapiosPendentes/${cardapio.id}`));

//     toast.success("✅ Cardápio aprovado!");
//   } catch (error) {
//     console.error(error);
//     toast.error("❌ Erro ao aprovar cardápio.");
//   }
// };

//   const reprovar = async () => {
//     if (!justificativa.trim()) {
//       toast.warn("⚠️ Informe uma justificativa.");
//       return;
//     }

//     try {
//       await set(ref(db, `cardapiosReprovados/${selecionado.id}`), {
//         ...selecionado,
//         status: 'reprovado',
//         justificativa,
//         reprovadoEm: new Date().toISOString()
//       });
//       await remove(ref(db, `cardapiosPendentes/${selecionado.id}`));
//       toast.info("🔴 Cardápio reprovado.");
//       setJustificativa('');
//       setModalAberto(false);
//     } catch (error) {
//       toast.error("❌ Erro ao reprovar cardápio.");
//     }
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold mb-8 text-gray-800">📋 Aprovação de Cardápios</h1>

//       {pendentes.length === 0 ? (
//         <p className="text-center text-gray-600 text-lg">Nenhum cardápio pendente.</p>
//       ) : (
//         <div className="grid gap-6">
//           {pendentes.map((cardapio) => (
//             <div key={cardapio.id} className="bg-white p-5 rounded-xl shadow border border-gray-200 transition hover:shadow-md">
//               <div className="flex justify-between items-center">
//               <div>
//                 <p className="text-lg font-semibold text-gray-800">
//                   Período: {formatDate(cardapio.periodo?.inicio)} até {formatDate(cardapio.periodo?.fim)}
//                 </p>
//                 <p className="text-md font-semibold text-gray-700 capitalize">
//                   Tipo: {cardapio.tipo || 'Não informado'}
//                 </p>
//                 <p className="text-sm text-yellow-700 mt-1 font-medium">Status: Pendente</p>
//               </div>
//                 <div className="flex space-x-2">
//                   <Button onClick={() => aprovar(cardapio)} className="bg-green-600 text-white flex items-center gap-1">
//                     <ThumbsUp size={16} /> Aprovar
//                   </Button>
//                   <Button onClick={() => { setSelecionado(cardapio); setModalAberto(true); }} className="bg-red-600 text-white flex items-center gap-1">
//                     <ThumbsDown size={16} /> Reprovar
//                   </Button>
//                   <Button onClick={() => { setCardapioVerMais(cardapio); setModalVerMaisAberto(true); }} className="bg-blue-600 text-white flex items-center gap-1">
//                     <Info size={16} /> Ver Mais
//                   </Button>
//                 </div>
//               </div>
//               <div className="mt-4 text-sm text-gray-700 space-y-1">
//                 {Object.entries(cardapio.composicoes || {}).map(([semana, dados]) => (
//                   <div key={semana}>
//                     <p className="font-medium">{semana}</p>
//                     <p>Nutricionista: {dados.nutricionista?.nome} ({dados.nutricionista?.crn3})</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}


//         </div>
//       )}

//       {/* Modal de Reprovação */}
//       <Dialog.Root open={modalAberto} onOpenChange={setModalAberto}>
//         <Dialog.Portal>
//           <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
//           <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-full max-w-md p-6 bg-white rounded-xl shadow-lg transform -translate-x-1/2 -translate-y-1/2">
//             <Dialog.Title className="text-xl font-bold mb-4 text-gray-800">📝 Justificativa da Reprovação</Dialog.Title>
//             <textarea
//               value={justificativa}
//               onChange={(e) => setJustificativa(e.target.value)}
//               placeholder="Descreva o motivo da reprovação..."
//               className="w-full border border-gray-300 p-3 rounded-md resize-none min-h-[120px] text-sm"
//             />
//             <div className="flex justify-end gap-2 mt-4">
//               <Button onClick={() => setModalAberto(false)} className="bg-gray-200 text-gray-800">Cancelar</Button>
//               <Button onClick={reprovar} className="bg-red-600 text-white">Enviar</Button>
//             </div>
//           </Dialog.Content>
//         </Dialog.Portal>
//       </Dialog.Root>

//       {/* Modal "Ver Mais" */}
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
//               <Button onClick={() => setModalVerMaisAberto(false)} className="bg-red-900  text-white flex items-center gap-1">
//                 <X size={16} /> Fechar
//               </Button>
//             </div>
//           </Dialog.Content>
//         </Dialog.Portal>
//       </Dialog.Root>

//       <ToastContainer position="bottom-right" />
//     </div>
//   );
// };

// export default AprovacaoCardapios;



import { useEffect, useState } from 'react';
import { ref, onValue, remove, set } from 'firebase/database';
import { db } from '../../../../firebase';
import { ToastContainer, toast } from 'react-toastify';
import { Button } from '@/components/ui/Button/button';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Info, ThumbsUp, ThumbsDown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AprovacaoCardapios = () => {
  const [pendentes, setPendentes] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [justificativa, setJustificativa] = useState('');
  const [selecionado, setSelecionado] = useState(null);
  const [modalVerMaisAberto, setModalVerMaisAberto] = useState(false);
  const [cardapioVerMais, setCardapioVerMais] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onValue(ref(db, 'cardapiosPendentes'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista = Object.entries(data).map(([id, valor]) => ({ id, ...valor }));
        setPendentes(lista);
      } else {
        setPendentes([]);
      }
    });
    return () => unsub();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Data inválida";
    let date = typeof timestamp === "string" ? new Date(Date.parse(timestamp)) : new Date(timestamp);
    if (isNaN(date.getTime())) return "Data inválida";
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const day = String(localDate.getDate()).padStart(2, "0");
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const year = localDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const aprovar = async (cardapio) => {
    try {
      const tipo = cardapio.tipo || 'naoInformado';
      await set(ref(db, `cardapiosAprovados/${cardapio.id}`), {
        ...cardapio,
        status: 'aprovado',
        aprovadoEm: new Date().toISOString()
      });
      await set(ref(db, `cardapiosAprovadosPorTipo/${tipo}/${cardapio.id}`), {
        ...cardapio,
        status: 'aprovado',
        aprovadoEm: new Date().toISOString()
      });
      await remove(ref(db, `cardapiosPendentes/${cardapio.id}`));
      toast.success("✅ Cardápio aprovado!");
    } catch (error) {
      console.error(error);
      toast.error("❌ Erro ao aprovar cardápio.");
    }
  };

  const reprovar = async () => {
    if (!justificativa.trim()) {
      toast.warn("⚠️ Informe uma justificativa.");
      return;
    }

    try {
      await set(ref(db, `cardapiosReprovados/${selecionado.id}`), {
        ...selecionado,
        status: 'reprovado',
        justificativa,
        reprovadoEm: new Date().toISOString()
      });
      await remove(ref(db, `cardapiosPendentes/${selecionado.id}`));
      toast.info("🔴 Cardápio reprovado.");
      setJustificativa('');
      setModalAberto(false);
    } catch (error) {
      toast.error("❌ Erro ao reprovar cardápio.");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen bg-white">
      {/* Botão Voltar */}
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-black transition">
          <ArrowLeft className="mr-2" size={20} />
          Voltar
        </button>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">📋 Aprovação de Cardápios</h1>

      {pendentes.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-10">Nenhum cardápio pendente.</p>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {pendentes.map((cardapio) => (
            <div
              key={cardapio.id}
              className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <p className="text-md font-medium text-gray-700">
                    Período: {formatDate(cardapio.periodo?.inicio)} até {formatDate(cardapio.periodo?.fim)}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">Tipo: {cardapio.tipo || 'Não informado'}</p>
                  <p className="text-sm text-yellow-700 mt-1 font-semibold">Status: Pendente</p>
                </div>

                <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                  <Button onClick={() => aprovar(cardapio)} className="bg-green-600 hover:bg-green-700 text-white">
                    <ThumbsUp size={16} className="mr-1" /> Aprovar
                  </Button>
                  <Button
                    onClick={() => { setSelecionado(cardapio); setModalAberto(true); }}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <ThumbsDown size={16} className="mr-1" /> Reprovar
                  </Button>
                  <Button
                    onClick={() => { setCardapioVerMais(cardapio); setModalVerMaisAberto(true); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Info size={16} className="mr-1" /> Ver Mais
                  </Button>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-700 space-y-1">
                {Object.entries(cardapio.composicoes || {}).map(([semana, dados]) => (
                  <div key={semana}>
                    <p className="font-medium">{semana}</p>
                    <p>Nutricionista: {dados.nutricionista?.nome} ({dados.nutricionista?.crn3})</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Reprovação */}
      <Dialog.Root open={modalAberto} onOpenChange={setModalAberto}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md p-6 bg-white rounded-xl shadow-lg transform -translate-x-1/2 -translate-y-1/2">
            <Dialog.Title className="text-xl font-bold mb-4 text-gray-800">📝 Justificativa da Reprovação</Dialog.Title>
            <textarea
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              placeholder="Descreva o motivo da reprovação..."
              className="w-full border border-gray-300 p-3 rounded-md resize-none min-h-[120px] text-sm"
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setModalAberto(false)} className="bg-gray-200 text-gray-800">Cancelar</Button>
              <Button onClick={reprovar} className="bg-red-600 text-white">Enviar</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Modal Ver Mais */}
      <Dialog.Root open={modalVerMaisAberto} onOpenChange={setModalVerMaisAberto}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[95vw] max-w-5xl max-h-[85vh] overflow-y-auto p-6 bg-white rounded-xl shadow-lg transform -translate-x-1/2 -translate-y-1/2">
            <Dialog.Title className="text-2xl font-bold text-gray-800 mb-4">📊 Detalhes do Cardápio</Dialog.Title>

            {cardapioVerMais && Object.entries(cardapioVerMais.composicoes || {}).map(([semana, dados]) => (
              <div key={semana} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{semana}</h3>
                <p><strong>Nutricionista:</strong> {dados.nutricionista?.nome} ({dados.nutricionista?.crn3})</p>
                <p><strong>Período:</strong> {formatDate(dados.periodo?.inicio)} até {formatDate(dados.periodo?.fim)}</p>

                <div className="overflow-auto mt-3">
                  <table className="w-full text-sm border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-2 py-1">Composição</th>
                        {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map(dia => (
                          <th key={dia} className="border px-2 py-1">{dia}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(dados.cardapio || {}).map(([secao, dias]) => (
                        <tr key={secao}>
                          <td className="border px-2 py-1 font-medium">{secao}</td>
                          {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map(dia => (
                            <td key={dia} className="border px-2 py-1">{dias[dia] || '-'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            <div className="flex justify-end mt-6">
              <Button onClick={() => setModalVerMaisAberto(false)} className="bg-red-700 text-white flex items-center gap-1">
                <X size={16} /> Fechar
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default AprovacaoCardapios;
  