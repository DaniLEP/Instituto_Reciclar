import { useEffect, useState } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../../../../../firebase';
import { useNavigate } from 'react-router-dom';  // Certifique-se de importar o hook
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button/button';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { motion } from 'framer-motion';
import Title from '@/components/ui/title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ConsultaCardapioAlmoco= () => {
  const [cardapios, setCardapios] = useState([]);
  const [filtroInicio, setFiltroInicio] = useState('');
  const [filtroFim, setFiltroFim] = useState('');
  const [consultar, setConsultar] = useState(false);
  const [celulaEditando, setCelulaEditando] = useState({});

  useEffect(() => {
    const cardapioRef = ref(db, 'cardapioAlmoco');
    onValue(cardapioRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setCardapios(lista);
      }
    });
  }, []);

  const filtrarCardapios = () => {
    const filtrados = cardapios.filter((item) => {
      const dataInicio = new Date(item.periodo?.inicio);
      const dataFim = new Date(item.periodo?.fim);
      const filtroIni = filtroInicio ? new Date(filtroInicio) : null;
      const filtroFi = filtroFim ? new Date(filtroFim) : null;

      return (!filtroIni || dataInicio >= filtroIni) && (!filtroFi || dataFim <= filtroFi);
    });
    return consultar ? filtrados : cardapios;
  };

  const exportarExcel = () => {
    const dadosExportar = filtrarCardapios().flatMap((cardapio) =>
      Object.entries(cardapio.composicoes || {}).flatMap(([semana, dados]) =>
        Object.entries(dados.cardapio || {}).map(([secao, dias]) => ({
          ID: cardapio.id,
          Semana: semana,
          Nutricionista: dados.nutricionista?.nome || '',
          CRN3: dados.nutricionista?.crn3 || '',
          Início: cardapio.periodo?.inicio || '',
          Fim: cardapio.periodo?.fim || '',
          Seção: secao,
          ...dias,
        }))
      )
    );

    const worksheet = XLSX.utils.json_to_sheet(dadosExportar);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cardápio');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'cardapioAlmoco.xlsx');
  };

  const limparConsulta = () => {
    setFiltroInicio('');
    setFiltroFim('');
    setConsultar(false);
  };

  const handleDoubleClick = (cardapioId, semana, secao, dia, valorAtual) => {
    setCelulaEditando({ cardapioId, semana, secao, dia, valor: valorAtual });
  };

  const handleBlur = async () => {
    const { cardapioId, semana, secao, dia, valor } = celulaEditando;
    const caminho = `cardapioAlmoco/${cardapioId}/composicoes/${semana}/cardapio/${secao}/${dia}`;
  
    const objetoAtualizacao = {
      [caminho]: valor, // Aqui você deve garantir que valor é uma string
    };
  
    await update(ref(db), objetoAtualizacao); // Atualizando corretamente
    setCelulaEditando({}); // Resetando o estado
  };

  const navigate = useNavigate(); // Aqui dentro do componente

  const HandleVoltar = () => {
    navigate(-1); // Navega para a página anterior
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-blue-900 to-gray-800 text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <Title className="text-4xl font-extrabold text-white">Consulta de Cardápio</Title>
        <p className="text-gray-300 mt-2">Filtre por data e visualize os cardápios cadastrados</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6"
      >
        <Input type="date" value={filtroInicio} onChange={(e) => setFiltroInicio(e.target.value)} />
        <Input type="date" value={filtroFim} onChange={(e) => setFiltroFim(e.target.value)} />
        <Button onClick={() => setConsultar(true)} className="bg-green-600 hover:bg-green-700 text-white">
          Consultar
        </Button>
        <Button onClick={limparConsulta} className="bg-yellow-500 hover:bg-yellow-600 text-white">
          Limpar Consulta
        </Button>
        <Button onClick={exportarExcel} className="bg-blue-600 hover:bg-blue-700 text-white">
          Exportar Excel
        </Button>
        <Button
          onClick={HandleVoltar}  // A função HandleVoltar é chamada corretamente
          className="bg-white hover:bg-gray-500 text-gray-800 px-4 py-2 rounded-md shadow"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-5" />
        </Button>
      </motion.div>
      {filtrarCardapios().map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white text-black rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-blue-700 mb-1">ID: {item.id}</h2>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Período:</strong> {item.periodo?.inicio} até {item.periodo?.fim}
          </p>

          {Object.entries(item.composicoes || {}).map(([semana, dados], i) => (
            <div key={semana} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Semana {i + 1}</h3>
              <p className="text-sm mb-2 text-gray-600">
                <strong>Nutricionista:</strong> {dados.nutricionista?.nome} | <strong>CRN3:</strong> {dados.nutricionista?.crn3}
              </p>

              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full text-sm border border-gray-300 shadow-sm rounded">
                  <thead className="bg-blue-100 text-blue-900">
                    <tr>
                      <th className="px-4 py-2 border">Seção</th>
                      {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map((dia) => (
                        <th key={dia} className="px-4 py-2 border">{dia}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(dados.cardapio || {}).map(([secao, dias], index) => (
                      <tr key={index} className="even:bg-gray-50 text-center">
                        <td className="border px-4 py-2 text-left font-medium text-gray-700">{secao}</td>
                        {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map((dia) => (
                          <td
                            key={dia}
                            className="border px-4 py-2 cursor-pointer hover:bg-yellow-100"
                            onDoubleClick={() =>
                              handleDoubleClick(item.id, semana, secao, dia, dias[dia])
                            }
                          >
                            {celulaEditando.cardapioId === item.id &&
                            celulaEditando.semana === semana &&
                            celulaEditando.secao === secao &&
                            celulaEditando.dia === dia ? (
                              <input
                                className="w-full p-1"
                                value={celulaEditando.valor}
                                onChange={(e) =>
                                  setCelulaEditando({ ...celulaEditando, valor: e.target.value })
                                }
                                onBlur={handleBlur}
                                autoFocus
                              />
                            ) : (
                              dias[dia]
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default ConsultaCardapioAlmoco;
