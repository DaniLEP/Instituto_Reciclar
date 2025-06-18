import React, { useState, useRef } from "react";

export default function InputValorCaixa({ valorInicial, onSalvar }) {
  const [valorCaixaDigitado, setValorCaixaDigitado] = useState(valorInicial || "");
  const [editavel, setEditavel] = useState(true);
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setEditavel(false);
      onSalvar(valorCaixaDigitado);
    }
  };

  const handleDoubleClick = () => {
    setEditavel(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">Valor do Caixa:</label>
      <input
        ref={inputRef}
        type="number"
        value={valorCaixaDigitado}
        onChange={(e) => {
          if (editavel) setValorCaixaDigitado(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        onDoubleClick={handleDoubleClick}
        placeholder="Digite o valor do caixa"
        className={`border border-gray-300 rounded px-3 py-1 w-48 ${
          editavel ? "bg-white" : "bg-gray-200 cursor-not-allowed"
        }`}
        disabled={!editavel}
      />
    </div>
  );
}
