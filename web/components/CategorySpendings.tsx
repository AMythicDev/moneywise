import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend );

export default function CategorySpendings({ transactions, categories }) {
  const expense_cats = categories.filter((c) => c.type == "expense");
  let data = { labels: ["Uncategorized"], datasets: [{ label: 'Spent', data: [0], backgroundColor: ["#cfccccbb"], borderColor: ["#cfcccc"], borderWidth: 1 }] };

  for (const cat of expense_cats) {
    data.labels.push(cat.name);
    data.datasets[0].backgroundColor.push(cat.color + "bb");
    data.datasets[0].borderColor.push(cat.color);
    data.datasets[0].data.push(0);
  }
  for (const trs of transactions) {
    if (trs.category) {
      const index = data.labels.indexOf(trs.category) // + 1 to account for the Uncategorized label;
      data.datasets[0].data[index] += trs.amount;
    } else {
      data.datasets[0].data[0] += trs.amount;
    }
  }

  return <Doughnut data={data}
    options={{
      maintainAspectRatio: false, plugins: {
        legend: { position: 'right' },
      }
    }} />;
}

