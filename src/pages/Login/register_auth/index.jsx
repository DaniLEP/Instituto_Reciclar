import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { auth, createUserWithEmailAndPassword, dbRealtime } from '../../../../firebase'; 
import { ref, set } from "firebase/database"; 
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button/button';

export default function Registro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [funcao, setFuncao] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [fotoPerfilBase64, setFotoPerfilBase64] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (senha) => senha.length >= 6;

  const handleImagemPerfil = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPerfilBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return setErrorMessage('E-mail inválido.');
    if (!validatePassword(senha)) return setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
    if (senha !== confirmSenha) return setErrorMessage('As senhas não coincidem.');
    if (!funcao) return setErrorMessage('Selecione uma função.');
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha); 
      const newUser = userCredential.user;

      const tipoUsuario = funcao === 'Admin' ? 'Admin' : funcao === 'Cozinha' ? 'Cozinha' : 'T.I';

      await set(ref(dbRealtime, 'usuarios/' + newUser.uid), {
        nome,
        email,
        funcao: tipoUsuario,
        uid: newUser.uid,
        status: "offline",
        fotoPerfil: fotoPerfilBase64 || null
      });

      setSuccessMessage('Usuário criado com sucesso!');
      setTimeout(() => navigate("/Verificacao_Usuario"), 2000);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Este e-mail já está em uso.');
      } else {
        setErrorMessage(`Erro: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-blue-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-6xl">
        <h2 className="text-[40px] font-bold text-center text-gray-700 mb-4">Registro de Novo Usuário</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {/* NOME */}
          <Input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Nome" className="..." />
          {/* E-MAIL */}
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="E-mail" className="..." />
          {/* FUNÇÃO */}
          <select value={funcao} onChange={(e) => setFuncao(e.target.value)} required className="...">
            <option value="">Selecione a função</option>
            <option value="Admin">Admin</option>
            <option value="Cozinha">Cozinha</option>
            <option value="T.I">T.I</option>
          </select>
          {/* SENHA */}
          <div className="relative">
            <Input type={isPasswordVisible ? 'text' : 'password'} value={senha} onChange={(e) => setSenha(e.target.value)} required placeholder="Digite uma senha" className="..." />
            <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye} onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="..." />
          </div>
          {/* CONFIRMAR SENHA */}
          <Input type={isPasswordVisible ? 'text' : 'password'} value={confirmSenha} onChange={(e) => setConfirmSenha(e.target.value)} required placeholder="Confirmar Senha" className="..." />

          {/* FOTO DE PERFIL */}
          <input type="file" accept="image/*" onChange={handleImagemPerfil} className="md:col-span-2 w-full border p-2 rounded-lg bg-gray-50 text-gray-800" />

          {/* BOTÕES */}
          <div className="flex flex-col md:flex-row justify-between md:col-span-2 gap-4 mt-4">
            <Button type="submit" disabled={isLoading} className="...">
              {isLoading ? 'Carregando...' : 'Criar Conta'}
            </Button>
            <Link to="/Verificacao_Usuario">
              <Button type="button" className="...">Voltar</Button>
            </Link>
          </div>
        </form>

        {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
      </div>
    </div>
  );
}
