// import { useState, useEffect } from 'react';
// import firebase from 'firebase/app';
// import 'firebase/database';

// const QuantidadeRefeicoes  = () => {
//   const [formData, setFormData] = useState({
//     dataRefeicao: '',
//     cafeDescricao: '',
//     cafeTotalQtd: '',
//     cafeFuncionariosQtd: '',
//     cafeJovensQtd: '',
//     almocoDescricao: '',
//     almocoTotalQtd: '',
//     almocoFuncionariosQtd: '',
//     almocoJovensQtd: '',
//     lancheDescricao: '',
//     lancheTotalQtd: '',
//     lancheFuncionariosQtd: '',
//     lancheJovensQtd: '',
//     outrasDescricao: '',
//     outrasTotalQtd: '',
//     outrasFuncionariosQtd: '',
//     outrasJovensQtd: '',
//     sobrasDescricao: '',
//     observacaoDescricao: '',
//     desperdicioQtd: '',
//   });

//   const [refeicoes, setRefeicoes] = useState([]);

//   useEffect(() => {
//     const database = firebase.database();
//     const refeicoesDb = database.ref('refeicoesServidas');
//     refeicoesDb.on('value', snapshot => {
//       const refeicoesData = [];
//       snapshot.forEach(childSnapshot => {
//         refeicoesData.push({ key: childSnapshot.key, ...childSnapshot.val() });
//       });
//       setRefeicoes(refeicoesData);
//     });
//   }, []);

//   const calcularTotal = (campo) => {
//     const { cafeTotalQtd, cafeFuncionariosQtd, almocoTotalQtd, almocoFuncionariosQtd, lancheTotalQtd, lancheFuncionariosQtd, outrasTotalQtd, outrasFuncionariosQtd } = formData;

//     if (campo === 'cafe') {
//       setFormData({
//         ...formData,
//         cafeJovensQtd: cafeTotalQtd - cafeFuncionariosQtd
//       });
//     }
//     if (campo === 'almoco') {
//       setFormData({
//         ...formData,
//         almocoJovensQtd: almocoTotalQtd - almocoFuncionariosQtd
//       });
//     }
//     if (campo === 'lanche') {
//       setFormData({
//         ...formData,
//         lancheJovensQtd: lancheTotalQtd - lancheFuncionariosQtd
//       });
//     }
//     if (campo === 'outras') {
//       setFormData({
//         ...formData,
//         outrasJovensQtd: outrasTotalQtd - outrasFuncionariosQtd
//       });
//     }
//   };

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData({ ...formData, [id]: value });
//     if (id.includes('Qtd')) {
//       const campo = id.split('Qtd')[0];
//       calcularTotal(campo);
//     }
//   };

//   const salvarRefeicao = () => {
//     const database = firebase.database();
//     const refeicaoData = { ...formData };

//     const newRefeicaoKey = database.ref().child('refeicoesServidas').push().key;
//     const updates = {};
//     updates[`/refeicoesServidas/${newRefeicaoKey}`] = refeicaoData;

//     database.ref().update(updates).then(() => {
//       alert('Refeição salva com sucesso!');
//       setFormData({
//         dataRefeicao: '',
//         cafeDescricao: '',
//         cafeTotalQtd: '',
//         cafeFuncionariosQtd: '',
//         cafeJovensQtd: '',
//         almocoDescricao: '',
//         almocoTotalQtd: '',
//         almocoFuncionariosQtd: '',
//         almocoJovensQtd: '',
//         lancheDescricao: '',
//         lancheTotalQtd: '',
//         lancheFuncionariosQtd: '',
//         lancheJovensQtd: '',
//         outrasDescricao: '',
//         outrasTotalQtd: '',
//         outrasFuncionariosQtd: '',
//         outrasJovensQtd: '',
//         sobrasDescricao: '',
//         observacaoDescricao: '',
//         desperdicioQtd: '',
//       });
//     }).catch(error => {
//       console.error('Erro ao salvar refeição:', error);
//     });
//   };

//   return (
//     <section style={{ padding: '20px' }}>
//       <h2>Data</h2>
//       <input
//         type="date"
//         id="dataRefeicao"
//         value={formData.dataRefeicao}
//         onChange={handleChange}
//       />

//       <h2>Café da Manhã</h2>
//       <textarea
//         id="cafeDescricao"
//         placeholder="Descreva o que foi servido no café da manhã..."
//         value={formData.cafeDescricao}
//         onChange={handleChange}
//       />
//       <div>
//         <label>Total:</label>
//         <input
//           type="number"
//           id="cafeTotalQtd"
//           value={formData.cafeTotalQtd}
//           onChange={handleChange}
//         />
//         <label>Quantidade para Funcionários:</label>
//         <input
//           type="number"
//           id="cafeFuncionariosQtd"
//           value={formData.cafeFuncionariosQtd}
//           onChange={handleChange}
//         />
//         <label>Quantidade para Jovens:</label>
//         <input
//           type="number"
//           id="cafeJovensQtd"
//           value={formData.cafeJovensQtd}
//           readOnly
//         />
//       </div>

//       {/* Similar structure for Almoço, Lanche, Outras Refeições, etc. */}

//       <button onClick={salvarRefeicao}>Salvar</button>

//       <section>
//         <h2>Refeições Servidas</h2>
//         <table>
//           <thead>
//             <tr>
//               <th>Data</th>
//               <th>Café Descrição</th>
//               <th>Café Funcionários</th>
//               <th>Café Jovens</th>
//               {/* Add other table headers */}
//             </tr>
//           </thead>
//           <tbody>
//             {refeicoes.map((refeicao) => (
//               <tr key={refeicao.key}>
//                 <td>{refeicao.dataRefeicao}</td>
//                 <td>{refeicao.cafe?.descricao || ''}</td>
//                 <td>{refeicao.cafe?.funcionarios || ''}</td>
//                 <td>{refeicao.cafe?.jovens || ''}</td>
//                 {/* Add other table data */}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>
//     </section>
//   );
// };

// export default QuantidadeRefeicoes ;
