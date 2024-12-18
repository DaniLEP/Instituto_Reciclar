import { Link } from "react-router-dom";
import Header from "../components/header.jsx";

const Card = ({ to, imgSrc, imgAlt, title }) => (
  <div className="card bg-[#F6F6F6] rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform">
    <Link to={to} aria-label={title}>
      <img
        src={imgSrc}
        className="mx-auto h-[100px] md:h-[120px] lg:h-[140px]"
        alt={imgAlt}
      />
      <h2 className="text-black text-xl md:text-2xl lg:text-3xl mt-4">{title}</h2>
    </Link>
  </div>
);

export default function Home() {
  return (
    <>
      <div
        style={{
          background: "white",
          fontFamily: "Chakra Petch, sans-serif",
          fontSize: "20px",
          textAlign: "center",
        }}
      >
        {/* HEADER */}
        <div className="bg-[#00009c]">
          <Header />
        </div>

        <div>
          {/* Conteúdo da Home (Cards) */}
          <div className="bg-white">
            <div
              className="container"
              style={{
                maxWidth: "1450px",
                height: "70vh",
                margin: "0 auto",
                textAlign: "center",
                position: "relative",
                top: "20vh",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "20px",
                  position: "relative",
                  top: "5vh",
                }}
              >
                {/* Cards */}
                <Card to="/Pedidos" imgSrc="/listaPedidos.svg" imgAlt="Pedidos" title="Pedidos" />
                <Card to="/Cadastro" imgSrc="/cadastro.svg" imgAlt="Cadastro" title="Cadastros" />
                <Card to="/Dashboard" imgSrc="/relatorio.svg" imgAlt="Relatórios" title="Relatórios" />
                <Card to="/Retirada" imgSrc="/retirada.svg" imgAlt="Retirada" title="Retirada" />
                <Card
                  to="/Verificacao_Usuario"
                  imgSrc="/users-control.png"
                  imgAlt="Controle de Usuários"
                  title="Controle de Usuários"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
