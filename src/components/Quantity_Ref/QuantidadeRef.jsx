import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Link, useNavigate } from 'react-router-dom';
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
  margin-bottom: 20px;
`;

const FormContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const FormGroup = styled.div`
  flex: 1 1 45%;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    flex: 1 1 100%;
  }
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-size: 1rem;
  color: #333;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 1rem;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #4c6ef5;
  }
`;

const Button = styled.button`
  padding: 12px 18px;
  background: #f20de7;
  color: white;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  margin-top: 10px;
  margin-right: 15px;

  &:hover {
    background-color: #d10ccf;
  }

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const Table = styled.table`
  margin-top: 30px;
  width: 100%;
  border-collapse: collapse;
  text-align: center;

  thead {
    background-color: #4c6ef5;
    color: white;
  }

  th,
  td {
    padding: 12px;
    border: 1px solid #ddd;
  }

  tbody {
    max-height: 300px;
    overflow-y: auto;
    display: block;
  }

  tr {
    display: table;
    table-layout: fixed;
    width: 100%;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
`;

const ReturnButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  background: #F20DE7;
  color: white;

  @media (max-width: 768px) {
    top: 10px;
    left: 10px;
  }
`;

const H2 = styled.h2`
  text-align: center;
  margin-top: 10px;
  font-size: 25px;
`;

const QuantidadeRefeicoes = () => {
  const [formData, setFormData] = useState({
    almoco: 0,
    jantar: 0,
    cafeManha: 0,
    lancheTarde: 0,
    quantidadeRefeicoesAparte: 0,
    dataRefeicao: '',
  });

  const [refeicoes, setRefeicoes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
      almoco: 0,
      jantar: 0,
      cafeManha: 0,
      lancheTarde: 0,
      quantidadeRefeicoesAparte: 0,
      dataRefeicao: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verificação se todos os campos estão preenchidos
    if (
      formData.almoco &&
      formData.jantar &&
      formData.cafeManha &&
      formData.lancheTarde &&
      formData.quantidadeRefeicoesAparte &&
      formData.dataRefeicao
    ) {
      // Simular o salvamento e redirecionar para outra página
      console.log('Quantidade de refeições servidas salva:', refeicoes);

      // Exibir o alerta
      alert('Quantidade de alimentos salva com sucesso!');

      // Limpar a tabela
      setRefeicoes([]);

      // Redirecionar para a página inicial
      navigate('/Cadastro'); // Redireciona para a página de Cadastro após salvar
    } else {
      // Se os campos não estão preenchidos, exibe um alerta
      alert('Por favor, preencha todos os campos!');
    }
  };

  return (
    <Container>
      <Title>Cadastrar Refeição</Title>
      <FormContainer>
        <Form>
          {[
            { label: 'Qtde de Almoço', name: 'almoco', type: 'number' },
            { label: 'Qtde de Jantar', name: 'jantar', type: 'number' },
            { label: 'Qtde de Café', name: 'cafeManha', type: 'number' },
            { label: 'Qtde de Lanche', name: 'lancheTarde', type: 'number' },
            { label: 'Qtde de Refeições', name: 'quantidadeRefeicoesAparte', type: 'number' },
            { label: 'Data da Refeição', name: 'dataRefeicao', type: 'date' },
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
        <H2>
          <h2>Refeições Cadastradas</h2>
        </H2>
        <Table>
          <thead>
            <tr>
              <th>Almoço</th>
              <th>Jantar</th>
              <th>Café da Manhã</th>
              <th>Lanche da Tarde</th>
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
                  <button onClick={() => handleEdit(index)}>Editar</button>
                  <button onClick={() => handleRemove(index)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button onClick={handleSubmit}>Salvar Refeições</Button>
      </FormContainer>
      <ReturnButton>
        <Link to="/Cadastro_Refeicoes">Voltar</Link>
      </ReturnButton>
    </Container>
  );
};

export default QuantidadeRefeicoes;
