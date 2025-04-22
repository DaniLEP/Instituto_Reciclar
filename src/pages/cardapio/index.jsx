// src/components/CadastroCardapioSemana2.jsx
import { useState } from 'react';
import { ref, set } from 'firebase/database';
import { db } from "../../../firebase";
import Title from '@/components/ui/title';

const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const secoes = [
  'Opção Vegetariana',
  'Prato Principal',
  'Guarnição',
  'Salada',
  'Fruta'
];

// Cria estrutura inicial com campos vazios
const criarEstruturaInicial = () => {
  const estrutura = [['Composição', ...diasSemana]];
  secoes.forEach(secao => {
    estrutura.push([secao, '', '', '', '', '']);
  });
  return estrutura;
};

const CadastroCardapioSemana2 = () => {
  const [cardapio, setCardapio] = useState(criarEstruturaInicial());
  const [status, setStatus] = useState(null);

  const handleChange = (rowIdx, colIdx, value) => {
    const novoCardapio = [...cardapio];
    novoCardapio[rowIdx][colIdx] = value;
    setCardapio(novoCardapio);
  };

  const salvarCardapio = async () => {
    try {
      await set(ref(db, 'cardapio/semana2/composicoes'), cardapio);
      setStatus('Cardápio salvo com sucesso!');
    } catch (error) {
      console.error(error);
      setStatus('Erro ao salvar o cardápio.');
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Title className="text-2xl font-bold mb-4 text-center">Cadastro de Cardápio - Semana 2</Title>

      <div className="overflow-x-auto">
        <table className="table-auto border-collapse w-full text-sm text-center">
          <thead>
            <tr>
              {cardapio[0].map((dia, i) => (
                <th key={i} className="border bg-pink-100 px-2 py-1">{dia}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cardapio.slice(1).map((linha, rowIndex) => (
              <tr key={rowIndex}>
                {linha.map((celula, colIndex) => (
                  <td key={colIndex} className="border px-2 py-1">
                    {colIndex === 0 ? (
                      <span className="font-semibold">{celula}</span>
                    ) : (
                      <input
                        type="text"
                        className="w-full px-1 py-0.5 border rounded"
                        value={celula}
                        onChange={(e) =>
                          handleChange(rowIndex + 1, colIndex, e.target.value)
                        }
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={salvarCardapio}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Salvar Cardápio
        </button>
      </div>

      {status && <p className="text-center mt-4 font-medium">{status}</p>}
    </div>
  );
};

export default CadastroCardapioSemana2;
