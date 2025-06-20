import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

// Assumindo que 'allExhibitors' é o seu array plano de expositores
// Cada expositor dentro de 'allExhibitors' tem uma propriedade 'categoria'
// Ex: { nome: "EHR", ..., categoria: "Annuals" }
// E que 'categories' é a array derivada de nomes de categorias únicas (e.g., [{ nome: "Annuals" }, { nome: "Perennials" }])
const ChartSection = ({ allExhibitors, categories }) => { // Adicionamos 'allExhibitors' como prop
  const chartRef = useRef(null);


  useEffect(() => {
    if (!chartRef.current || !allExhibitors || !Array.isArray(allExhibitors) || !categories || !Array.isArray(categories)) {
      // Garante que temos os dados necessários antes de tentar renderizar o gráfico
      return;
    }

    // 1. Contar o número de expositores por categoria
    const categoryCounts = allExhibitors.reduce((acc, exhibitor) => {
      const categoryName = exhibitor.categoria || 'Sem Categoria'; // Usa a propriedade 'categoria'
      acc[categoryName] = (acc[categoryName] || 0) + 1;
      return acc;
    }, {});

    // 2. Preparar os dados para o Chart.js
    // Mapeia as categorias para garantir que todas as categorias (mesmo as com 0 expositores) sejam mostradas
    const chartLabels = categories.map(c => c.nome);
    const chartData = categories.map(c => categoryCounts[c.nome] || 0); // Pega a contagem, ou 0 se a categoria não tiver expositores

    const ctx = chartRef.current.getContext("2d");

    // Se já existe um gráfico, destrua-o antes de criar um novo
    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }

    const data = {
      labels: chartLabels,
      datasets: [
        {
          label: "Nº de Expositores",
          data: chartData,
          backgroundColor: "rgba(37, 99, 235, 0.7)",
          borderColor: "rgba(37, 99, 235, 1)",
          borderWidth: 1,
        },
      ],
    };

    const chart = new Chart(ctx, {
      type: "bar",
      data,
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
        },
        // Adiciona um título ao eixo X para clareza
        x: {
            title: {
                display: true,
                text: 'Categorias'
            }
        }
      },
    });

    chartRef.current.chart = chart; // Armazena a instância do gráfico no ref

    return () => {
      if (chartRef.current && chartRef.current.chart) {
        chartRef.current.chart.destroy();
        chartRef.current.chart = null; // Limpa a referência
      }
    };
  }, [allExhibitors, categories]); // Dependências: re-renderiza se os expositores ou categorias mudarem

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-stone-800 mb-4">Distribution of Exhibitors by Categorie</h2>
      <canvas ref={chartRef} className="w-full h-64" />
    </div>
  );
}

export default ChartSection;