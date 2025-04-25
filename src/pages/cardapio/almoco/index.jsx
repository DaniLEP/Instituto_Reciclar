import { useState } from 'react';
import { ref, set } from 'firebase/database';
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

const criarEstruturaInicial = () => {
  const estrutura = [['Composição', ...diasSemana]];
  secoes.forEach(secao => estrutura.push([secao, '', '', '', '', '']));
  return estrutura;
};

const CadastroCardapio = () => {
  const navigate = useNavigate();

  const [dadosNutri, setDadosNutri] = useState([
    { nomeNutri: '', crn3: '', dataInicio: '', dataFim: '' },
    { nomeNutri: '', crn3: '', dataInicio: '', dataFim: '' },
    { nomeNutri: '', crn3: '', dataInicio: '', dataFim: '' },
    { nomeNutri: '', crn3: '', dataInicio: '', dataFim: '' },
    { nomeNutri: '', crn3: '', dataInicio: '', dataFim: '' },
  ]);

  const [cardapios, setCardapios] = useState([
    criarEstruturaInicial(),
    criarEstruturaInicial(),
    criarEstruturaInicial(),
    criarEstruturaInicial(),
    criarEstruturaInicial(),
  ]);

  const handleChange = (semana, rowIdx, colIdx, value) => {
    const novosCardapios = [...cardapios];
    novosCardapios[semana][rowIdx][colIdx] = value;
    setCardapios(novosCardapios);
  };

  const handleDadosNutriChange = (semana, campo, valor) => {
    const novosDados = [...dadosNutri];
    novosDados[semana][campo] = valor;
    setDadosNutri(novosDados);
  };

  const salvarCardapio = async () => {
    for (let i = 0; i < 5; i++) {
      const { nomeNutri, crn3, dataInicio, dataFim } = dadosNutri[i];
      if (!nomeNutri || !crn3 || !dataInicio || !dataFim) {
        toast.error(`Por favor, preencha todos os dados do nutricionista para a Semana ${i + 1}.`);
        return;
      }
    }

    const dados = {
      dataCadastro: new Date().toISOString(),
      ...Object.fromEntries(
        dadosNutri.map((nutri, i) => [
          `semana${i + 1}`,
          {
            nutricionista: { nome: nutri.nomeNutri, crn3: nutri.crn3 },
            periodo: { inicio: nutri.dataInicio, fim: nutri.dataFim },
            cardapio: cardapios[i],
          }
        ])
      )
    };

    try {
      await set(ref(db, 'cardapioAlmoco'), dados);
      toast.success("Cardápio salvo com sucesso!");

      setDadosNutri([
        { nomeNutri: '', crn3: '', dataInicio: '', dataFim: '' },
        { nomeNutri: '', crn3: '', dataInicio: '', dataFim: '' },
        { nomeNutri: '', crn3: '', dataInicio: '', dataFim: '' },
        { nomeNutri: '', crn3: '', dataInicio: '', dataFim: '' },
        { nomeNutri: '', crn3: '', dataInicio: '', dataFim: '' },
      ]);

      setCardapios([
        criarEstruturaInicial(),
        criarEstruturaInicial(),
        criarEstruturaInicial(),
        criarEstruturaInicial(),
        criarEstruturaInicial(),
      ]);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar o cardápio.");
    }
  };

  return (
    <div className="p-6 max-w-8xl mx-auto bg-gradient-to-r from-blue-900 to-gray-800">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => navigate(-1)} className="bg-white hover:bg-gray-500 text-gray-800 px-4 py-2 rounded-md shadow">
          <FontAwesomeIcon icon={faArrowLeft} className="h-5" />
        </Button>
        <Title style={{ color: 'white' }} className="text-3xl text-center font-bold">Cadastro de Cardápio Almoço</Title>
        <div />
      </div>

      {cardapios.map((cardapio, index) => (
        <div key={index} className="p-4 max-w-6xl mx-auto mb-6 bg-white rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-4 text-center">Cadastro - Semana {index + 1}</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Input type="text" placeholder="Nome do Nutricionista" value={dadosNutri[index].nomeNutri}
              onChange={(e) => handleDadosNutriChange(index, 'nomeNutri', e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
            <Input type="text" placeholder="CRN3" value={dadosNutri[index].crn3}
              onChange={(e) => handleDadosNutriChange(index, 'crn3', e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
            <Input type="date" value={dadosNutri[index].dataInicio}
              onChange={(e) => handleDadosNutriChange(index, 'dataInicio', e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
            <Input type="date" value={dadosNutri[index].dataFim}
              onChange={(e) => handleDadosNutriChange(index, 'dataFim', e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
          </div>

          <div className="overflow-x-auto rounded-lg">
            <table className="table-auto w-full border text-sm text-center">
              <thead className="bg-pink-100 text-gray-800">
                <tr>
                  {cardapio[0].map((dia, i) => (
                    <th key={i} className="border px-3 py-2">{dia}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cardapio.slice(1).map((linha, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {linha.map((celula, colIndex) => (
                      <td key={colIndex} className="border px-2 py-1">
                        {colIndex === 0 ? (
                          <span className="font-semibold text-gray-700">{celula}</span>
                        ) : (
                          <Input
                            type="text"
                            className="w-full px-1 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-pink-400"
                            value={celula}
                            onChange={(e) => handleChange(index, rowIndex + 1, colIndex, e.target.value)}
                          />
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

      <div className="flex justify-center mt-6">
        <Button onClick={salvarCardapio} className="bg-green-600 hover:bg-green-700 text-white w-[1150px] font-bold px-6 rounded-lg shadow-md transition-all">
          Salvar Cardápio
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CadastroCardapio;
