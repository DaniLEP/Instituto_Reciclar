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

const CadastroCardapioSemana = ({ semana, dadosNutri, setDadosNutri, cardapio, handleChange }) => (
  <div className="p-4 max-w-6xl mx-auto mb-6 bg-white rounded-lg shadow">
    <h1 className="text-3xl font-bold mb-4 text-center">Cadastro - {semana}</h1>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Input type="text" placeholder="Nome do Nutricionista" value={dadosNutri.nomeNutri}
        onChange={(e) => setDadosNutri({ ...dadosNutri, nomeNutri: e.target.value })}
        className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
      <Input type="text" placeholder="CRN3" value={dadosNutri.crn3}
        onChange={(e) => setDadosNutri({ ...dadosNutri, crn3: e.target.value })}
        className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
      <Input type="date" value={dadosNutri.dataInicio}
        onChange={(e) => setDadosNutri({ ...dadosNutri, dataInicio: e.target.value })}
        className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
      <Input type="date" value={dadosNutri.dataFim}
        onChange={(e) => setDadosNutri({ ...dadosNutri, dataFim: e.target.value })}
        className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
    </div>

    <div className="overflow-x-auto rounded-lg">
      <table className="table-auto w-full border text-sm text-center">
        <thead className="bg-pink-100 text-gray-800">
          <tr>
            {cardapio[0].map((dia, i) => (<th key={i} className="border px-3 py-2">{dia}</th>))}
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
                    <Input type="text" className="w-full px-1 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-pink-400" value={celula} onChange={(e) => handleChange(rowIndex + 1, colIndex, e.target.value)} />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const CadastroCardapio = () => {
  const [dadosNutriSemana1, setDadosNutriSemana1] = useState({ nomeNutri: '', crn3: '', dataInicio: '', dataFim: '' });
  const [dadosNutriSemana2, setDadosNutriSemana2] = useState({ nomeNutri: '', crn3: '', dataInicio: '', dataFim: '' });
  const [dadosNutriSemana3, setDadosNutriSemana3] = useState({ nomeNutri: '', crn3: '', dataInicio: '', dataFim: '' });
  const [dadosNutriSemana4, setDadosNutriSemana4] = useState({ nomeNutri: '', crn3: '', dataInicio: '', dataFim: '' });
  const [dadosNutriSemana5, setDadosNutriSemana5] = useState({ nomeNutri: '', crn3: '', dataInicio: '', dataFim: '' });

  const [cardapioSemana1, setCardapioSemana1] = useState(criarEstruturaInicial());
  const [cardapioSemana2, setCardapioSemana2] = useState(criarEstruturaInicial());
  const [cardapioSemana3, setCardapioSemana3] = useState(criarEstruturaInicial());
  const [cardapioSemana4, setCardapioSemana4] = useState(criarEstruturaInicial());
  const [cardapioSemana5, setCardapioSemana5] = useState(criarEstruturaInicial());

  const navigate = useNavigate();

  const handleChange = (semana, rowIdx, colIdx, value) => {
    const setters = {
      1: setCardapioSemana1,
      2: setCardapioSemana2,
      3: setCardapioSemana3,
      4: setCardapioSemana4,
      5: setCardapioSemana5,
    };

    const states = {
      1: cardapioSemana1,
      2: cardapioSemana2,
      3: cardapioSemana3,
      4: cardapioSemana4,
      5: cardapioSemana5,
    };

    const novoCardapio = [...states[semana]];
    novoCardapio[rowIdx][colIdx] = value;
    setters[semana](novoCardapio);
  };

  const salvarCardapio = async () => {
    // Verificar se todos os dados do nutricionista foram preenchidos
    if (!dadosNutriSemana1.nomeNutri || !dadosNutriSemana1.crn3 || !dadosNutriSemana1.dataInicio || !dadosNutriSemana1.dataFim) {
      toast.error("Por favor, preencha todos os dados do nutricionista para a Semana 1.");
      return;
    }
    if (!dadosNutriSemana2.nomeNutri || !dadosNutriSemana2.crn3 || !dadosNutriSemana2.dataInicio || !dadosNutriSemana2.dataFim) {
      toast.error("Por favor, preencha todos os dados do nutricionista para a Semana 2.");
      return;
    }
    if (!dadosNutriSemana3.nomeNutri || !dadosNutriSemana3.crn3 || !dadosNutriSemana3.dataInicio || !dadosNutriSemana3.dataFim) {
      toast.error("Por favor, preencha todos os dados do nutricionista para a Semana 3.");
      return;
    }
    if (!dadosNutriSemana4.nomeNutri || !dadosNutriSemana4.crn3 || !dadosNutriSemana4.dataInicio || !dadosNutriSemana4.dataFim) {
      toast.error("Por favor, preencha todos os dados do nutricionista para a Semana 4.");
      return;
    }
    if (!dadosNutriSemana5.nomeNutri || !dadosNutriSemana5.crn3 || !dadosNutriSemana5.dataInicio || !dadosNutriSemana5.dataFim) {
      toast.error("Por favor, preencha todos os dados do nutricionista para a Semana 5.");
      return;
    }

    const dados = {
      composicoes: {
        semana1: {
          nutricionista: { nome: dadosNutriSemana1.nomeNutri, crn3: dadosNutriSemana1.crn3 },
          periodo: { inicio: dadosNutriSemana1.dataInicio, fim: dadosNutriSemana1.dataFim },
          cardapio: cardapioSemana1
        },
        semana2: {
          nutricionista: { nome: dadosNutriSemana2.nomeNutri, crn3: dadosNutriSemana2.crn3 },
          periodo: { inicio: dadosNutriSemana2.dataInicio, fim: dadosNutriSemana2.dataFim },
          cardapio: cardapioSemana2
        },
        semana3: {
          nutricionista: { nome: dadosNutriSemana3.nomeNutri, crn3: dadosNutriSemana3.crn3 },
          periodo: { inicio: dadosNutriSemana3.dataInicio, fim: dadosNutriSemana3.dataFim },
          cardapio: cardapioSemana3
        },
        semana4: {
          nutricionista: { nome: dadosNutriSemana4.nomeNutri, crn3: dadosNutriSemana4.crn3 },
          periodo: { inicio: dadosNutriSemana4.dataInicio, fim: dadosNutriSemana4.dataFim },
          cardapio: cardapioSemana4
        },
        semana5: {
          nutricionista: { nome: dadosNutriSemana5.nomeNutri, crn3: dadosNutriSemana5.crn3 },
          periodo: { inicio: dadosNutriSemana5.dataInicio, fim: dadosNutriSemana5.dataFim },
          cardapio: cardapioSemana5
        },
      },
      dataCadastro: new Date().toISOString()
    };

    try {
      await set(ref(db, 'cardapio'), dados);
      toast.success("Cardápio salvo com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar o cardápio.");
    }
  };

  return (
    <div className="p-6 max-w-8xl mx-auto bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => navigate(-1)} className="bg-white hover:bg-gray-500 text-gray-800 px-4 py-2 rounded-md shadow">
          <FontAwesomeIcon icon={faArrowLeft} className="h-5" />
        </Button>
        <Title style={{ color: 'white' }} className="text-3xl text-center font-bold">Cadastro de Cardápio Almoço</Title>
        <div />
      </div>

      <CadastroCardapioSemana semana="Semana 1" dadosNutri={dadosNutriSemana1} setDadosNutri={setDadosNutriSemana1} cardapio={cardapioSemana1} handleChange={(row, col, val) => handleChange(1, row, col, val)} />
      <CadastroCardapioSemana semana="Semana 2" dadosNutri={dadosNutriSemana2} setDadosNutri={setDadosNutriSemana2} cardapio={cardapioSemana2} handleChange={(row, col, val) => handleChange(2, row, col, val)} />
      <CadastroCardapioSemana semana="Semana 3" dadosNutri={dadosNutriSemana3} setDadosNutri={setDadosNutriSemana3} cardapio={cardapioSemana3} handleChange={(row, col, val) => handleChange(3, row, col, val)} />
      <CadastroCardapioSemana semana="Semana 4" dadosNutri={dadosNutriSemana4} setDadosNutri={setDadosNutriSemana4} cardapio={cardapioSemana4} handleChange={(row, col, val) => handleChange(4, row, col, val)} />
      <CadastroCardapioSemana semana="Semana 5" dadosNutri={dadosNutriSemana5} setDadosNutri={setDadosNutriSemana5} cardapio={cardapioSemana5} handleChange={(row, col, val) => handleChange(5, row, col, val)} />

      <div className="flex justify-center mt-6">
        <Button onClick={salvarCardapio} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all">Salvar Cardápio</Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CadastroCardapio;
