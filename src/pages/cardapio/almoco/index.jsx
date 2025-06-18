// import { useState } from 'react';
// import { ref, push } from 'firebase/database';
// import { db } from "../../../../firebase.js";
// import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Title from '@/components/ui/title';
// import { Button } from '@/components/ui/Button/button.jsx';
// import { Input } from '@/components/ui/input/index.jsx';
// import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
// const secoes = ['Folha', 'Acompanhamento da Folha', 'Guarnição', 'Prato Principal', 'Opção Vegetariana', 'Prato Base', 'Acompanhamento Prato Principal', 'Tempero da Salada'];

// const criarComposicaoInicial = () => {
//   const composicao = {};
//   secoes.forEach((secao) => {
//     composicao[secao] = diasSemana.reduce((acc, dia) => {
//       acc[dia] = '';
//       return acc;
//     }, {});
//   });
//   return composicao;
// };

// const CadastroCardapioAlmoco = () => {
//   const navigate = useNavigate();
//   const [dadosNutri, setDadosNutri] = useState(Array(5).fill({ nomeNutri: '', crn3: '', dataInicio: '', dataFim: '' }));
//   const [composicoes, setComposicoes] = useState(Array(5).fill().map(() => criarComposicaoInicial()));

//   const handleChange = (semana, secao, dia, valor) => {
//     const novas = [...composicoes];
//     novas[semana][secao][dia] = valor;
//     setComposicoes(novas);
//   };

//   const handleDadosNutriChange = (semana, campo, valor) => {
//     const novosDados = [...dadosNutri];
//     novosDados[semana] = { ...novosDados[semana], [campo]: valor };
//     setDadosNutri(novosDados);
//   };



//   const salvarCardapio = async () => {
//   for (let i = 0; i < 5; i++) {
//     const { nomeNutri, crn3, dataInicio, dataFim } = dadosNutri[i];
//     if (!nomeNutri || !crn3 || !dataInicio || !dataFim) {
//       toast.error(`Por favor, preencha todos os dados do nutricionista para a Semana ${i + 1}.`);
//       return;
//     }
//   }

//   const dados = {
//     status: 'pendente',
//     tipo: 'Almoco',
//     dataCadastro: new Date().toISOString(),
//     periodo: {
//       inicio: dadosNutri[0].dataInicio,
//       fim: dadosNutri[4].dataFim
//     },
//     composicoes: {}
//   };

//   for (let i = 0; i < 5; i++) {
//     dados.composicoes[`semana${i + 1}`] = {
//       nutricionista: {
//         nome: dadosNutri[i].nomeNutri,
//         crn3: dadosNutri[i].crn3
//       },
//       periodo: {
//         inicio: dadosNutri[i].dataInicio,
//         fim: dadosNutri[i].dataFim
//       },
//       cardapio: composicoes[i]
//     };
//   }

//   try {
//     await push(ref(db, 'cardapiosPendentes'), dados); // Envio para aprovação
//     toast.success("Cardápio enviado para aprovação!");

//     setDadosNutri(Array(5).fill({ nomeNutri: '', crn3: '', dataInicio: '', dataFim: '' }));
//     setComposicoes(Array(5).fill().map(() => criarComposicaoInicial()));
//   } catch (error) {
//     console.error(error);
//     toast.error("Erro ao enviar cardápio para aprovação.");
//   }
// };



//   return (
//     <div className="p-6 max-w-8xl mx-auto bg-gradient-to-r from-blue-900 to-gray-800 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <Button onClick={() => navigate(-1)} className="bg-white hover:bg-gray-500 text-gray-800 px-4 py-2 rounded-md shadow">
//           <FontAwesomeIcon icon={faArrowLeft} className="h-5" />
//         </Button>
//         <Title style={{ color: 'white' }} className="text-3xl text-center font-bold">Cadastro de Cardápio Almoço</Title>
//         <div />
//       </div>

//       {composicoes.map((composicao, index) => (
//         <div key={index} className="p-4 bg-white rounded-lg shadow mb-6">
//           <h2 className="text-xl font-bold mb-4">Semana {index + 1}</h2>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//             <Input placeholder="Nutricionista" value={dadosNutri[index].nomeNutri}
//               onChange={(e) => handleDadosNutriChange(index, 'nomeNutri', e.target.value)} />
//             <Input placeholder="CRN3" value={dadosNutri[index].crn3}
//               onChange={(e) => handleDadosNutriChange(index, 'crn3', e.target.value)} />
//             <Input type="date" value={dadosNutri[index].dataInicio}
//               onChange={(e) => handleDadosNutriChange(index, 'dataInicio', e.target.value)} />
//             <Input type="date" value={dadosNutri[index].dataFim}
//               onChange={(e) => handleDadosNutriChange(index, 'dataFim', e.target.value)} />
//           </div>

//           <div className="overflow-x-auto">
//             <table className="table-auto w-full text-sm border text-center">
//               <thead className="bg-pink-100">
//                 <tr>
//                   <th className="border px-2 py-1">Composição</th>
//                   {diasSemana.map((dia, i) => (
//                     <th key={i} className="border px-2 py-1">{dia}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {secoes.map((secao, idx) => (
//                   <tr key={idx}>
//                     <td className="border font-semibold text-left px-2 py-1">{secao}</td>
//                     {diasSemana.map((dia, i) => (
//                       <td key={i} className="border px-1 py-1">
//                         <Input
//                           value={composicao[secao][dia]}
//                           onChange={(e) => handleChange(index, secao, dia, e.target.value)}
//                           className="w-full text-sm px-2"
//                         />
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ))}

//       <div className="flex justify-center mt-6">
//         <Button
//   onClick={salvarCardapio}
//   className="bg-blue-600 hover:bg-blue-700 text-white w-[1150px] font-bold px-6 rounded-lg shadow-md transition-all"
// >
//   Enviar para Aprovação
// </Button>

//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default CadastroCardapioAlmoco;


import { useState, useEffect } from 'react';
import { ref, push, set, remove, onValue } from 'firebase/database';
import { db } from "../../../../firebase.js";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Title from '@/components/ui/title';
import { Button } from '@/components/ui/Button/button.jsx';
import { Input } from '@/components/ui/input/index.jsx';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const secoes = ['Folha', 'Acompanhamento da Folha', 'Guarnição', 'Prato Principal', 'Opção Vegetariana', 'Prato Base', 'Acompanhamento Prato Principal', 'Tempero da Salada'];

const criarComposicaoInicial = () => {
  const composicao = {};
  secoes.forEach((secao) => {
    composicao[secao] = diasSemana.reduce((acc, dia) => {
      acc[dia] = '';
      return acc;
    }, {});
  });
  return composicao;
};

const CadastroCardapioAlmoco = () => {
  const navigate = useNavigate();

  // Corrigido: usar map para criar objetos diferentes e evitar referências iguais
  const [dadosNutri, setDadosNutri] = useState(
    Array(5).fill().map(() => ({ nomeNutri: '', crn3: '', dataInicio: '', dataFim: '' }))
  );
  const [composicoes, setComposicoes] = useState(Array(5).fill().map(() => criarComposicaoInicial()));
  const [rascunhos, setRascunhos] = useState([]);
  const [rascunhoSelecionado, setRascunhoSelecionado] = useState(null);

  useEffect(() => {
    const rascunhosRef = ref(db, 'cardapiosRascunho');
    onValue(rascunhosRef, (snapshot) => {
      const data = snapshot.val() || {};
      const lista = Object.entries(data).map(([id, value]) => ({ id, ...value }));
      setRascunhos(lista);
    });
  }, []);

  const handleChange = (semana, secao, dia, valor) => {
    const novas = [...composicoes];
    novas[semana] = { ...novas[semana] }; // clona o objeto da semana para evitar mutação
    novas[semana][secao] = { ...novas[semana][secao] }; // clona a seção para evitar mutação
    novas[semana][secao][dia] = valor;
    setComposicoes(novas);
  };

  const handleDadosNutriChange = (semana, campo, valor) => {
    const novosDados = [...dadosNutri];
    novosDados[semana] = { ...novosDados[semana], [campo]: valor };
    setDadosNutri(novosDados);
  };

  const validarDados = () => {
    for (let i = 0; i < 5; i++) {
      const { nomeNutri, crn3, dataInicio, dataFim } = dadosNutri[i];
      if (!nomeNutri || !crn3 || !dataInicio || !dataFim) {
        toast.error(`Por favor, preencha todos os dados do nutricionista para a Semana ${i + 1}.`);
        return false;
      }
    }
    return true;
  };

  const salvarRascunho = async () => {
    try {
      const dados = {
        tipo: 'Almoco',
        dataAtualizacao: new Date().toISOString(),
        dadosNutri,
        composicoes
      };

      if (rascunhoSelecionado) {
        await set(ref(db, `cardapiosRascunho/${rascunhoSelecionado.id}`), dados);
        toast.success('Rascunho atualizado com sucesso!');
      } else {
        await push(ref(db, 'cardapiosRascunho'), dados);
        toast.success('Rascunho salvo com sucesso!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar rascunho.');
    }
  };

  const enviarParaAprovacao = async () => {
    if (!validarDados()) return;

    const dados = {
      status: 'pendente',
      tipo: 'Almoco',
      dataCadastro: new Date().toISOString(),
      periodo: {
        inicio: dadosNutri[0].dataInicio,
        fim: dadosNutri[4].dataFim
      },
      composicoes: {}
    };

    for (let i = 0; i < 5; i++) {
      dados.composicoes[`Semana ${i + 1}`] = {
        nutricionista: {
          nome: dadosNutri[i].nomeNutri,
          crn3: dadosNutri[i].crn3
        },
        periodo: {
          inicio: dadosNutri[i].dataInicio,
          fim: dadosNutri[i].dataFim
        },
        cardapio: composicoes[i]
      };
    }

    try {
      await push(ref(db, 'cardapiosPendentes'), dados);
      toast.success("Cardápio enviado para aprovação!");

      if (rascunhoSelecionado) {
        await remove(ref(db, `cardapiosRascunho/${rascunhoSelecionado.id}`));
        setRascunhoSelecionado(null);
      }

      setDadosNutri(Array(5).fill().map(() => ({ nomeNutri: '', crn3: '', dataInicio: '', dataFim: '' })));
      setComposicoes(Array(5).fill().map(() => criarComposicaoInicial()));
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar cardápio para aprovação.");
    }
  };

  // Normaliza o objeto para garantir estrutura consistente
  const normalizarComposicao = (composicao) => {
    const novaComposicao = {};
    secoes.forEach(secao => {
      novaComposicao[secao] = {};
      diasSemana.forEach(dia => {
        novaComposicao[secao][dia] = composicao?.[secao]?.[dia] ?? '';
      });
    });
    return novaComposicao;
  };

  const carregarRascunho = (id) => {
    const rascunho = rascunhos.find(r => r.id === id);
    if (rascunho) {
      const composicoesNormalizadas = Array(5).fill().map((_, i) => {
        // Se existir dado para a semana i, normaliza, se não, cria inicial
        return normalizarComposicao(rascunho.composicoes?.[i] ?? criarComposicaoInicial());
      });

      setDadosNutri(rascunho.dadosNutri || Array(5).fill().map(() => ({ nomeNutri: '', crn3: '', dataInicio: '', dataFim: '' })));
      setComposicoes(composicoesNormalizadas);
      setRascunhoSelecionado(rascunho);
      toast.info(`Rascunho da data ${new Date(rascunho.dataAtualizacao).toLocaleString()} carregado.`);
    }
  };

  return (
    <div className="p-6 max-w-8xl mx-auto bg-gradient-to-r from-blue-900 to-gray-800 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => navigate(-1)} className="bg-white hover:bg-gray-500 text-gray-800 px-4 py-2 rounded-md shadow">
          <FontAwesomeIcon icon={faArrowLeft} className="h-5" />
        </Button>
        <Title className="text-3xl text-center font-bold">Cadastro de Cardápio Almoço</Title>
        <div />
      </div>

      {/* Seção para selecionar rascunho salvo */}
      <div className="mb-6 bg-gray-800 p-4 rounded-md shadow">
        <h3 className="text-lg font-semibold mb-2">Rascunhos Salvos:</h3>
        {rascunhos.length === 0 && <p className="text-gray-400">Nenhum rascunho salvo.</p>}
        <ul className="max-h-40 overflow-y-auto space-y-1">
          {rascunhos.map((rascunho) => (
            <li key={rascunho.id}>
              <button
                className={`w-full text-left px-3 py-1 rounded-md hover:bg-blue-600 transition-colors ${
                  rascunhoSelecionado?.id === rascunho.id ? 'bg-blue-700 font-bold' : 'bg-gray-700'
                }`}
                onClick={() => carregarRascunho(rascunho.id)}
              >
                {`Rascunho salvo em ${new Date(rascunho.dataAtualizacao).toLocaleString()}`}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {composicoes.map((composicao, index) => (
        <div key={index} className="p-4 bg-white text-black rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Semana {index + 1}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Input placeholder="Nutricionista" value={dadosNutri[index].nomeNutri}
              onChange={(e) => handleDadosNutriChange(index, 'nomeNutri', e.target.value)} />
            <Input placeholder="CRN3" value={dadosNutri[index].crn3}
              onChange={(e) => handleDadosNutriChange(index, 'crn3', e.target.value)} />
            <Input type="date" value={dadosNutri[index].dataInicio}
              onChange={(e) => handleDadosNutriChange(index, 'dataInicio', e.target.value)} />
            <Input type="date" value={dadosNutri[index].dataFim}
              onChange={(e) => handleDadosNutriChange(index, 'dataFim', e.target.value)} />
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto w-full text-sm border text-center">
              <thead className="bg-pink-100">
                <tr>
                  <th className="border px-2 py-1">Composição</th>
                  {diasSemana.map((dia, i) => (
                    <th key={i} className="border px-2 py-1">{dia}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {secoes.map((secao, idx) => (
                  <tr key={idx}>
                    <td className="border font-semibold text-left px-2 py-1">{secao}</td>
                    {diasSemana.map((dia, i) => (
                      <td key={i} className="border px-1 py-1">
                        <Input
                          value={composicao[secao]?.[dia] ?? ''}
                          onChange={(e) => handleChange(index, secao, dia, e.target.value)}
                          className="w-full text-sm px-2"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="flex justify-center space-x-4 mt-6">
        <Button
          onClick={salvarRascunho}
          className="bg-yellow-500 hover:bg-yellow-600 text-white w-[200px] font-bold px-6 rounded-lg shadow-md transition-all"
        >
          Salvar Rascunho
        </Button>

        <Button
          onClick={enviarParaAprovacao}
          className="bg-blue-600 hover:bg-blue-700 text-white w-[200px] font-bold px-6 rounded-lg shadow-md transition-all"
        >
          Enviar para Aprovação
        </Button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default CadastroCardapioAlmoco;
