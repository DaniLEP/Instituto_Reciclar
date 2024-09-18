import { Carousel } from "react-bootstrap";
import { useEffect } from "react";
import { Chart } from 'chart.js/auto'; // Importação correta

const RelatorioCarousel = () => {

  useEffect(() => {
    const ctxProteina = document.getElementById('graficoProteina').getContext('2d');
    const ctxMantimento = document.getElementById('graficoMantimento').getContext('2d');
    const ctxHortalica = document.getElementById('graficoHortalica').getContext('2d');
    const ctxDoacoes = document.getElementById('graficoDoacoes').getContext('2d');
    const ctxRefeicoes = document.getElementById('graficoRefeicoes').getContext('2d');

    new Chart(ctxProteina, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Proteínas',
          data: [12, 19, 3, 5, 2],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      }
    });

    new Chart(ctxMantimento, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Mantimentos',
          data: [22, 10, 13, 9, 6],
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      }
    });

    new Chart(ctxHortalica, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Hortaliças',
          data: [5, 15, 10, 7, 13],
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1
        }]
      }
    });

    new Chart(ctxDoacoes, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Doações Recebidas',
          data: [12, 9, 7, 14, 18],
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      }
    });

    new Chart(ctxRefeicoes, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Refeições Servidas',
          data: [50, 60, 55, 65, 70],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      }
    });
  }, []);

  return (
    <Carousel>
      {/* Slide Proteínas */}
      <Carousel.Item interval={10000}>
        <div className="text-center">
          <h2>Relatório Mensal de Proteínas</h2>
          <canvas id="graficoProteina"></canvas>
        </div>
      </Carousel.Item>

      {/* Slide Mantimentos */}
      <Carousel.Item interval={10000}>
        <div className="text-center">
          <h2>Relatório Mensal de Mantimentos</h2>
          <canvas id="graficoMantimento"></canvas>
        </div>
      </Carousel.Item>

      {/* Slide Hortaliças */}
      <Carousel.Item interval={10000}>
        <div className="text-center">
          <h2>Relatório Mensal de Hortaliças</h2>
          <canvas id="graficoHortalica"></canvas>
        </div>
      </Carousel.Item>

      {/* Slide Doações */}
      <Carousel.Item interval={10000}>
        <div className="text-center">
          <h2>Relatório Mensal de Doações Recebidas</h2>
          <canvas id="graficoDoacoes"></canvas>
        </div>
      </Carousel.Item>

      {/* Slide Refeições */}
      <Carousel.Item interval={10000}>
        <div className="text-center">
          <h2>Relatório de Refeições Servidas</h2>
          <canvas id="graficoRefeicoes"></canvas>
        </div>
      </Carousel.Item>
    </Carousel>
  );
};

export default RelatorioCarousel;
