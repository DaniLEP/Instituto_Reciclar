const Overlay = ({ onClick }) => {
    return (
      <div
        onClick={onClick}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
      />
    );
  };
  
  export default Overlay;
  