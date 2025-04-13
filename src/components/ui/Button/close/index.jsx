
const CloseButton = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className="mt-2 bg-[#DC3545] hover:bg-[#B02A37] transition-colors duration-300">
      {children}
    </button>
  );
};

export default CloseButton;
