import Header from "../components/header"

export default function Home () {
    return(
        <>
           <div
             style={{
                background: "White",
                fontFamily: "Chakra Petch , sans serif",
                fontSize: "20px",
                textAlign: "center",
           }}
        >
            {/* HEADER */}
              <div className="bg-[#00009c]">
                <Header />
              </div>

          </div>
        </>
    )
}