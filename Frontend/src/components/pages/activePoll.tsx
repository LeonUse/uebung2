import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useParams } from "react-router";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

const labels = ["Option1", "Option2", "Option3"];

const option1 = [10, 10, 30];

export const data = {
  labels,
  datasets: [
    {
      label: "Option 1",
      data: option1,
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

export default function Poll() {
  const { id } = useParams();
  return (
    <>
      <div className="activePoll">
        <h1>Link to VOTE: http://localhost:5173/vote/{id}</h1>
        <h1>Poll Question</h1>
      </div>
      <div className="barCss">
        <Bar options={options} data={data} />
      </div>
    </>
  );
}
