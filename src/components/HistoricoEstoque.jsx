// import { useState, useEffect } from 'react';
// import { getDatabase, ref, child, get } from 'firebase/database';
// import { initializeApp } from 'firebase/app';
// import { useNavigate } from 'react-router-dom';

// // Configuração do Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
//   authDomain: "bancoestoquecozinha.firebaseapp.com",
//   databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
//   projectId: "bancoestoquecozinha",
//   storageBucket: "bancoestoquecozinha.firebasestorage.app",
//   messagingSenderId: "71775149511",
//   appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
// };

// // Inicializa o Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// const HistoricoRetiradas = () => {
//   const navigate = useNavigate();
//   const [retiradas, setRetiradas] = useState([]);
//   const [category, setCategory] = useState('');
//   const [retiradasFiltradas, setRetiradasFiltradas] = useState([]);
  
//   // Função para buscar os dados no Firebase
//   const fetchRetiradas = async () => {
//     const dbRef = ref(database);
//     try {
//       const snapshot = await get(child(dbRef, 'retiradas'));
//       if (snapshot.exists()) {
//         setRetiradas(Object.values(snapshot.val())); // Converte o objeto em array
//         setRetiradasFiltradas(Object.values(snapshot.val())); // Inicializa com todos os dados
//       } else {
//         console.log('Não há dados disponíveis');
//       }
//     } catch (error) {
//       console.error('Erro ao ler dados do Firebase:', error);
//     }
//   };

//   useEffect(() => {
//     fetchRetiradas(); // Chama a função ao carregar o componente
//   }, []);

//   // Função de filtragem
//   const filtrarRetiradas = () => {
//     const filtradas = retiradas.filter((retirada) => retirada.category === category);
//     setRetiradasFiltradas(filtradas.length > 0 ? filtradas : retiradas);
//   };

//   return (
//     <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px' }}>
//       <button
//         onClick={() => navigate(-1)}
//         style={{
//           backgroundColor: '#F20DE7',
//           color: 'white',
//           padding: '10px 20px',
//           fontSize: '1.1rem',
//           border: 'none',
//           borderRadius: '5px',
//           cursor: 'pointer',
//           marginBottom: '20px',
//         }}
//       >
//         Voltar
//       </button>

//       <h1 style={{ textAlign: 'center', fontSize: '2.5rem', color: '#2c3e50', marginBottom: '30px' }}>
//         Histórico de Retiradas
//       </h1>

//       <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', marginBottom: '20px' }}>
//         <label></label>
//         <select
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           style={{ backgroundColor: '#f0f8ff', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
//         >
//           <option value="">Selecione a categoria:</option>
//           <option value="Proteína">Proteína</option>
//           <option value="Mantimento">Mantimento</option>
//           <option value="Hortaliças">Hortaliças</option>
//           <option value="Doações">Doações</option>
//         </select>
//         <button
//           onClick={filtrarRetiradas}
//           style={{
//             backgroundColor: '#28a745',
//             color: 'white',
//             padding: '10px',
//             fontSize: '1rem',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer',
//           }}
//         >
//           Consultar
//         </button>
//       </div>

//       <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '30px' }}>
//         <thead style={{ background: '#8E44AD', fontSize: '20px', color: 'white', borderRadius: 3, textAlign: 'center' }}>
//           <tr>
//             <th>SKU</th>
//             <th>Produto</th>
//             <th>Categoria</th>
//             <th>Quantidade</th>
//             <th>Data</th>
//             <th>Quantidade</th>
//             <th>Responsavel</th>

//           </tr>
//         </thead>
//         <tbody>
//           {retiradasFiltradas.map((retirada, index) => (
//             <tr key={index}>
//               <td style={{ textAlign: 'center' }}>{retirada.sku}</td>
//               <td style={{ textAlign: 'center' }}>{retirada.name}</td>
//               <td style={{ textAlign: 'center' }}>{retirada.category}</td>
//               <td style={{ textAlign: 'center' }}>{retirada.quantity}</td>
//               <td style={{ textAlign: 'center' }}>{retirada.data}</td>
//               <td style={{ textAlign: 'center' }}>{retirada.quantity}</td>
//               <td style={{ textAlign: 'center' }}>{retirada.retirante}</td>

//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default HistoricoRetiradas;


import { useState, useEffect } from 'react';
import { getDatabase, ref, child, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { useNavigate } from 'react-router-dom';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.firebasestorage.app",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const HistoricoRetiradas = () => {
  const navigate = useNavigate();
  const [retiradas, setRetiradas] = useState([]);
  const [category, setCategory] = useState('');
  const [retiradasFiltradas, setRetiradasFiltradas] = useState([]);

  // Função para buscar os dados no Firebase
  const fetchRetiradas = async () => {
    const dbRef = ref(database);
    try {
      const snapshot = await get(child(dbRef, 'Retiradas'));
      if (snapshot.exists()) {
        setRetiradas(Object.values(snapshot.val())); // Converte o objeto em array
        setRetiradasFiltradas(Object.values(snapshot.val())); // Inicializa com todos os dados
      } else {
        console.log('Não há dados disponíveis');
      }
    } catch (error) {
      console.error('Erro ao ler dados do Firebase:', error);
    }
  };

  useEffect(() => {
    fetchRetiradas(); // Chama a função ao carregar o componente
  }, []);

  // Função de filtragem
  const filtrarRetiradas = () => {
    const filtradas = retiradas.filter((retirada) => retirada.category === category);
    setRetiradasFiltradas(filtradas.length > 0 ? filtradas : retiradas);
  };

  // Função para formatar a data e hora
  const formatarDataHora = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: '#F20DE7',
          color: 'white',
          padding: '10px 20px',
          fontSize: '1.1rem',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        Voltar
      </button>

      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', color: '#2c3e50', marginBottom: '30px' }}>
        Histórico de Retiradas
      </h1>

      <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', marginBottom: '20px' }}>
        <label></label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ backgroundColor: '#f0f8ff', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="">Selecione a categoria:</option>
          <option value="Proteína">Proteína</option>
          <option value="Mantimento">Mantimento</option>
          <option value="Hortaliças">Hortaliças</option>
          <option value="Doações">Doações</option>
        </select>
        <button
          onClick={filtrarRetiradas}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '10px',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Consultar
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '30px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
        <thead style={{ background: '#8E44AD', fontSize: '18px', color: 'white', borderRadius: 3, textAlign: 'center' }}>
          <tr>
            <th style={{ padding: '12px' }}>SKU</th>
            <th style={{ padding: '12px' }}>Produto</th>
            <th style={{ padding: '12px' }}>Categoria</th>
            <th style={{ padding: '12px' }}>Quantidade</th>
            <th style={{ padding: '12px' }}>Data de Retirada</th>
            <th style={{ padding: '12px' }}>Responsável</th>
          </tr>
        </thead>
        <tbody>
          {retiradasFiltradas.map((retirada, index) => (
            <tr key={index} style={{ textAlign: 'center', borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>{retirada.sku}</td>
              <td style={{ padding: '12px' }}>{retirada.name}</td>
              <td style={{ padding: '12px' }}>{retirada.category}</td>
              <td style={{ padding: '12px' }}>{retirada.quantity}</td>
              <td style={{ padding: '12px' }}>
                {formatarDataHora(retirada.data)}
              </td>
              <td style={{ padding: '12px' }}>{retirada.retirante}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoricoRetiradas;
