import { Link } from 'react-router-dom';

const PaginaNaoEncontradaGoogleStyle = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-700 px-4">
      <h1 className="text-6xl font-light mb-2">404.</h1>
      <p className="text-xl mb-4">Isso é um erro.</p>
      <p className="text-center max-w-lg mb-8 text-sm">
        O URL solicitado não foi encontrado neste servidor. Isso é tudo o que sabemos.
      </p>
      <Link
        to="/home"
        className="text-blue-600 underline hover:text-blue-800 transition"
      >
        Voltar para a página inicial
      </Link>
    </div>
  );
};

export default PaginaNaoEncontradaGoogleStyle;
