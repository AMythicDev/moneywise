// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

// ChartJS.register(ArcElement, Tooltip, Legend);

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function WeeklyGraph({ transactions }) {
  let weeklyIncome = [0, 0, 0, 0, 0];
  let weeklyExpense = [0, 0, 0, 0, 0];

  for (const trx of transactions) {
    const index = Math.floor(new Date(trx.date).getDate() / 7)
    if (trx.type == "income") weeklyIncome[index] += trx.amount;
    if (trx.type == "expense") weeklyExpense[index] += trx.amount;
  }

  const data = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    datasets: [
      {
        label: "Income",
        data: weeklyIncome,
        backgroundColor: "#00bba7",
        borderColor: "#00bba7",
      },
      {
        label: "weeklyExpense",
        data: weeklyExpense,
        backgroundColor: "#ff6467",
        borderColor: "#ff6467",
      }
    ]
  }

  return (
    <Line data={data} className='max-h-96'
      options={{
        maintainAspectRatio: false, plugins: {
          legend: { position: 'right' },
        }
      }} />
  )

}

