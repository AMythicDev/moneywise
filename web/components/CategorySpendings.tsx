import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategorySpendings({ transactions, categories }) {
  const expense_cats = categories.filter((c) => c.type == "expense");
  let data = { labels: [], datasets: [{ label: 'Spent', data: [], backgroundColor: [], borderColor: [], borderWidth: 1 }] };

  for (const cat of expense_cats) {
    data.labels.push(cat.name);
    data.datasets[0].backgroundColor.push(cat.color + "bb");
    data.datasets[0].borderColor.push(cat.color);
    data.datasets[0].data.push(0);
  }
  for (const trs of transactions) {
    const index = data.labels.indexOf(trs.category);
    data.datasets[0].data[index] += trs.amount;
  }

  return <Doughnut data={data}
    options={{
      maintainAspectRatio: false, plugins: {
        legend: { position: 'right' },
      }
    }} />;
}

