import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  background: #00009c;
  padding: 20px;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  text-align: center;
`;

const FormContainer = styled.div`
  background: white;
  padding: 12px;
  font-size: 13px;
  color: black;
  border-radius: 40px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const FormGroup = styled.div`
  flex: 1 1 45%;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    flex: 1 1 100%;
  }
`;

const Label = styled.label`
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  color: black;
  border: 1px solid rgb(115, 113, 113);
  border-radius: 12px;
`;

const Button = styled.button`
  padding: 11px 12px;
  background: #f20de7;
  color: #fff;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease;
  margin-right: 10px;

  &:hover {
    background-color: #d10ccf;
  }
`;

const Table = styled.table`
  margin-top: 5vh;
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  overflow-x: auto; /* Adiciona rolagem horizontal quando necessário */

  thead {
    display: block;
  }

  tbody {
    display: block;
    overflow-y: auto; /* Permite rolagem vertical */
    max-height: 300px; /* Altura máxima para a rolagem */
    overflow-x: hidden; /* Esconde a rolagem horizontal na tbody */
  }

  tr {
    display: table;
    table-layout: fixed; /* Garante que as colunas tenham o mesmo tamanho */
    width: 100%;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    min-width: 100px; /* Largura mínima para as células */
  }

  th {
    background-color: #00ff62;
    color: black;
  }

  @media (max-width: 768px) {
    th,
    td {
      font-size: 10px;
      padding: 12px 1px;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
`;

const ReturnButton = styled.button`
  position: absolute;
  top: 10px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;

  @media (max-width: 768px) {
    top: 5px;
    right: 10px;
  }
`;

const Refeicoes = () => {
  const [formData, setFormData] = useState({
    turma: '',
    almoco: 0,
    jantar: 0,
    cafeManha: 0,
    lancheTarde: 0,
    refeicoesAparte: '',
    quantidadeRefeicoesAparte: 0,
    dataRefeicao: ''
  });

  const [refeicoes, setRefeicoes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddRefeicao = () => {
    const novaRefeicao = { ...formData };

    if (editIndex !== null) {
      const updatedRefeicoes = [...refeicoes];
      updatedRefeicoes[editIndex] = novaRefeicao;
      setRefeicoes(updatedRefeicoes);
      setEditIndex(null);
    } else {
      setRefeicoes([...refeicoes, novaRefeicao]);
    }

    clearForm();
  };

  const clearForm = () => {
    setFormData({
      turma: '',
      almoco: 0,
      jantar: 0,
      cafeManha: 0,
      lancheTarde: 0,
      refeicoesAparte: '',
      quantidadeRefeicoesAparte: 0,
      dataRefeicao: ''
    });
  };

  const handleEdit = (index) => {
    setFormData(refeicoes[index]);
    setEditIndex(index);
  };

  const handleRemove = (index) => {
    setRefeicoes(refeicoes.filter((_, i) => i !== index));
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(refeicoes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Refeições Servidas');
    XLSX.writeFile(workbook, 'Refeicoes-Servidas.xlsx');
  };

  return (
    <Container>
      <Title>Cadastrar Refeição</Title>
      <FormContainer>
        <Form>
          {[
            { label: 'Turma/Funcionários', name: 'turma', type: 'text' },
            { label: 'Qtde de Almoço', name: 'almoco', type: 'number' },
            { label: 'Qtde de Jantar', name: 'jantar', type: 'number' },
            { label: 'Qtde de Café', name: 'cafeManha', type: 'number' },
            { label: 'Qtde de Lanche', name: 'lancheTarde', type: 'number' },
            { label: 'Refeições Parte', name: 'refeicoesAparte', type: 'text' },
            { label: 'Qtde de Refeições', name: 'quantidadeRefeicoesAparte', type: 'number' },
            { label: 'Data da Refeição', name: 'dataRefeicao', type: 'date' }
          ].map((input, index) => (
            <FormGroup key={index}>
              <Label>{input.label}:</Label>
              <Input
                name={input.name}
                type={input.type}
                value={formData[input.name]}
                onChange={handleInputChange}
              />
            </FormGroup>
          ))}
        </Form>

        <Actions>
          <Button onClick={handleAddRefeicao}>
            {editIndex !== null ? 'Atualizar Refeição' : 'Adicionar Refeição'}
          </Button>
          <Button onClick={exportToExcel}>Exportar para Excel</Button>
          <Button onClick={clearForm}>Limpar Formulário</Button>
        </Actions>

        <h2 className='text-black text-center text-[30px]'>Refeições Cadastradas</h2>
        <Table>
          <thead>
            <tr>
              <th>Turma</th>
              <th>Almoço</th>
              <th>Jantar</th>
              <th>Café da Manhã</th>
              <th>Lanche da Tarde</th>
              <th>Refeições à Parte</th>
              <th>Qtd. Refeições à Parte</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {refeicoes.map((refeicao, index) => (
              <tr key={index}>
                {Object.keys(refeicao).map((key, i) => (
                  <td key={i}>{refeicao[key]}</td>
                ))}
                <td>
                  <Button onClick={() => handleEdit(index)}>Editar</Button>
                  <Button onClick={() => handleRemove(index)}>Remover</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </FormContainer>

      <Link to={'/cadastro'}>
        <ReturnButton>
          <img src="/return.svg" alt="Voltar" style={{ width: "50px", height: "50px" }} />
        </ReturnButton>
      </Link>
    </Container>
  );
};

export default Refeicoes;
