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
import axios from "axios";

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

const votes = [10, 10, 30];

export default function activePoll() {
  const { id } = useParams();
  const [poll, setPoll] = React.useState<Poll>({
    id: "",
    poll: "",
    Options: [""],
  });
  React.useEffect(() => {
    getPollData();
  }, []);

  React.useEffect(() => {
    console.log("🚀 ~ file: activePoll.tsx:43 ~ activePoll ~ options", options);
  }, [options]);

  function getPollData() {
    axios.get("http://localhost:9000/getPoll/" + id).then((response: any) => {
      setPoll(response.data);
    });
  }

  const data = {
    labels: poll.Options,
    datasets: [
      {
        label: "Votes",
        data: votes,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      <div className="center">
        <h1>Link to VOTE: http://localhost:5173/vote/{id}</h1>
        <br />
        <h1>{poll.poll}</h1>
      </div>
      <div className="barCss">
        <Bar options={options} data={data} />
      </div>
    </>
  );
}
