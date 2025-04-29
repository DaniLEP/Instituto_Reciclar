import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { auth, createUserWithEmailAndPassword, dbRealtime } from '../../../../firebase'; // Certifique-se de que o caminho está correto
import { ref, set } from "firebase/database"; // Adicionando as funções necessárias do Firebase
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button/button';

export default function Registro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [funcao, setFuncao] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (senha) => senha.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return setErrorMessage('E-mail inválido.');
    if (!validatePassword(senha)) return setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
    if (senha !== confirmSenha) return setErrorMessage('As senhas não coincidem.');
    if (!funcao) return setErrorMessage('Selecione uma função.');

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha); // Agora o auth deve funcionar
      const newUser = userCredential.user;

      // Mapeamento da função para o tipo de usuário
      const tipoUsuario = funcao === 'Admin' ? 'Admin' : 'Cozinha';

      // Salva os dados do usuário no Realtime Database
      await set(ref(dbRealtime, 'usuarios/' + newUser.uid), {
        nome,
        email,
        funcao: tipoUsuario,
        uid: newUser.uid,
        status: "offline"
      });

      setSuccessMessage('Usuário criado com sucesso!');
      // navigate('/Verificacao_Usuario');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Este e-mail já está em uso.');
      } else {
        setErrorMessage(`Erro: ${error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-blue-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-6xl">
        <h2 className="text-[40px] font-bold text-center text-gray-700 mb-4">Registro de Novo Usuário</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {/* NOME */}
          <Input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="Nome"
            className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* E-MAIL */}
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="E-mail"
            className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* FUNÇÃO */}
          <select
            value={funcao}
            onChange={(e) => setFuncao(e.target.value)}
            required
            className="w-full p-1 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione a função</option>
            <option value="Admin">Admin</option>
            <option value="Cozinha">Cozinha</option>
          </select>
          {/* SENHA */}
          <div className="relative">
            <Input
              type={isPasswordVisible ? 'text' : 'password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="Digite uma senha"
              className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FontAwesomeIcon
              icon={isPasswordVisible ? faEyeSlash : faEye}
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 cursor-pointer"
            />
          </div>
          {/* CONFIRMAR SENHA */}
          <Input
            type={isPasswordVisible ? 'text' : 'password'}
            value={confirmSenha}
            onChange={(e) => setConfirmSenha(e.target.value)}
            required
            placeholder="Confirmar Senha"
            className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Botões */}
          <div className="flex flex-col md:flex-row justify-between md:col-span-2 gap-4 mt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md"
            >
              {isLoading ? 'Carregando...' : 'Criar Conta'}
            </Button>
            <Link to="/Verificacao_Usuario">
              <Button
                type="button"
                className="w-full md:w-auto px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold shadow-md"
              >
                Voltar
              </Button>
            </Link>
          </div>
        </form>
        {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
      </div>
    </div>
  );
}
