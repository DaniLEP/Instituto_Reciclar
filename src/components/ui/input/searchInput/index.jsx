const SearchInput = ({ value, onChange, placeholder }) => {
    return (
      <input type="text" value={value} onChange={onChange} placeholder={placeholder}
        className="w-[90%] py-2 px-3 mb-4 text-black border border-gray-300 rounded-lg text-base text-center outline-none focus:ring-2 focus:ring-[#F20DE7]"/>
    );
  };
  
  export default SearchInput;
  