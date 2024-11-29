import {
  ActiveElement,
  ArcElement,
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import { Bar, Pie } from "react-chartjs-2";
interface PokemonTypeData {
  name: string;
  count: number;
  color?: string;
}
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ArcElement,
  Legend
);

export const PokemonCharts: React.FC<{
  onClick: (type: PokemonTypeData) => void;
  types: PokemonTypeData[];
}> = ({ types, onClick }) => {
  const chartData: ChartData<"bar"> = {
    labels: types.map((t) => t.name),
    datasets: [
      {
        label: "Cantidad de Pokémon por tipo",
        data: types.map((t) => t.count),
        backgroundColor: types.map((type) => type.color),
      },
    ],
  };

  const handleClick = (element: ActiveElement) => {
    onClick(types[element.index]);
  };

  const pieChartData: ChartData<"pie"> = {
    labels: types.map((t) => t.name),
    datasets: [
      {
        label: "Cantidad de Pokémon por tipo",
        data: types.map((t) => t.count),
        backgroundColor: types.map((type) => type.color),
      },
    ],
  };

  return (
    <div>
      <h2>Estadísticas de Pokémon por tipo</h2>
      <div className="grid xl:grid-cols-2 grid-cols-1 py-7 ">
        <div className="relative">
          <Bar
            width="100%"
            data={chartData}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              onClick: (_event, elems) => handleClick(elems[0]),
            }}
          />
        </div>
        <div className="relative">
          <Pie
            data={pieChartData}
            options={{
              onClick: (_event, elems) => handleClick(elems[0]),
            }}
          />
        </div>
      </div>
    </div>
  );
};
