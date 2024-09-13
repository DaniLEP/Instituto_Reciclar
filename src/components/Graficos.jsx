import "./graficos.css"
import "./grafico.js"

export default function Graficos () {
    return(
        <>
            <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel">
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous" />
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

                <div className="" class="carousel-inner">
                    {/* <!-- Relatório de Proteínas --> */}
                    <div class="carousel-item active" id="relatorio-proteina" data-bs-interval="10000">
                        <h2>Relatório Mensal de Proteínas</h2>
                        <div id="relatorioProteina">
                            <canvas id="graficoProteina"></canvas>
                        </div>
                    </div>
                    {/* <!-- Relatório de Mantimentos --> */}
                    <div class="carousel-item" id="relatorio-mantimento" data-bs-interval="10000">
                        <h2>Relatório Mensal de Mantimentos</h2>
                        <div id="relatorioMantimento">
                            <canvas id="graficoMantimento"></canvas>
                        </div>
                    </div>
                    {/* <!-- Relatório de Hortaliças --> */}
                    <div class="carousel-item" id="relatorio-hortalica" data-bs-interval="10000">
                        <h2>Relatório Mensal de Hortaliças</h2>
                        <div id="relatorioHortalica">
                            <canvas id="graficoHortalica"></canvas>
                        </div>
                    </div>
                    {/* <!-- Relatório de Doações Recebidas --> */}
                    <div class="carousel-item" id="relatorio-doacoes" data-bs-interval="10000">
                        <h2>Relatório Mensal de Doações Recebidas</h2>
                        <div id="relatorioDoacoes">      
                            <canvas id="graficoDoacoes"></canvas>
                        </div>
                    </div>
                {/* <!-- Relatório de Refeições Servidas --> */}
                    <div class="carousel-item" id="relatorio-refeicoes" data-bs-interval="10000">
                        <h2>Relatório de Refeições Servidas</h2>
                        <div id="relatorioRefeicoes">
                            <canvas id="graficoRefeicoes"></canvas>
                        </div>
                    </div>
                </div>
                {/* <!-- Controle do carrossel --> */}
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.1/xlsx.full.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js" integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy" crossorigin="anonymous"></script>      
        </div>
  </>
    )
}