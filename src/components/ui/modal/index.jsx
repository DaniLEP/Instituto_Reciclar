const Modal = ({ children, isOpen }) => {
    if (!isOpen) return null; // Se o modal não estiver aberto, não renderiza nada
  
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg z-50 w-[90%] max-w-[500px]">
        {children}
      </div>
    );
  };
  
  export default Modal;
  