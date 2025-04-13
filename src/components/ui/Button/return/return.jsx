import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleVoltar = () => {
    navigate(-1); // Volta para a página anterior
  };

  return (
    <button
      onClick={handleVoltar}
      className="flex justify-center items-center px-5 py-3 bg-gradient-to-br from-[#F20DE7] to-[#D90DD0] text-white border-none rounded-full text-base font-bold shadow-md cursor-pointer transition-all duration-300 ease-in-out w-fit mx-auto
        hover:from-[#D90DD0] hover:to-[#B508BD] hover:scale-105 hover:shadow-lg active:scale-95 active:shadow sm:text-sm sm:px-[18px] sm:py-[10px] max-sm:text-xs max-sm:px-4 max-sm:py-2">
      Voltar
    </button>
  );
};

export default BackButton;
