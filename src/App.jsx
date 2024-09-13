import '../src/App.css'
// REAPROVEITAMENTO DE ESTRUTURA
import {Outlet} from "react-router-dom";

import Home from './pages/Home'
import Header from './components/header';
function App() {

  return (
    <>
      <div className="bg-[#00009c]">
        <Header />
        <Outlet />
      </div>

         
      
    </>
  )
}

export default App
