export default function ErrorPage () {
    return (
        <div
          style={{
            background: "#00009c",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center", 
            height: "100vh",
            color: "white",
            fontFamily: "Chakra Petch , sans serif",
            fontSize: "30px"
          }}
        >
          <h1><span className="text-[30px] font-bold">🚨404</span> - Página Não Encontrada</h1>
          <p>Oops! Não conseguimos encontrar a página que você está procurando.</p>
        </div>
      );
}