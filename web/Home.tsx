import { type User } from "./types"
import TableRow from "./components/TableRow"
import Button from "./components/Button";
import { API_URL } from "./consts";
import { useEffect, useState } from "react";
import AddTransaction from "./components/AddTransaction";
import CategorySpendings from "./components/CategorySpendings";

interface HomeProps {
  onPathChange: (path: string) => void,
  user: User | null,
  onUserChange: (user: User) => void,
}

function transactionsForMonth(setTransactions) {
  const day = new Date();
  const dateAfter = `${day.getFullYear()}-${day.getMonth()}-01`
  const dateBefore = `${day.getFullYear()}-${day.getMonth() + 1}-01`
  const jwt = localStorage.getItem("jwt");
  fetch(`${API_URL}/transactions?dateAfter=${dateAfter}&dateBefore=${dateBefore}`, { headers: { "Authorization": jwt } })
    .then((resp) => resp.json())
    .then((body) => {
      setTransactions(body);
    });
}

export default function Home({ onPathChange, user, onUserChange }: HomeProps) {
  if (user == null) return null;
  const [transactions, setTransactions] = useState(null);
  const [transactionModalOpem, setTransactionModalOpen] = useState(false);
  useEffect(() => {
    transactionsForMonth(setTransactions);
  }, [])

  return (
    <div className="bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 dark:from-cyan-900 dark:via-teal-900 dark:to-slate-900 min-h-screen">
      <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-4 gap-6 p-5 lg:p-16">

        <div className="row-span-4 col-span-2 bg-white dark:bg-slate-800 dark:text-white p-5 rounded-lg shadow-sm">
          <div className="flex justify-between mb-3">
            <span className="font-bold translate-y-1.5">Current Balance</span>
            <span className="text-3xl font-bold text-teal-500">₹1,000</span>
          </div>
          <div className="min-h-96 mb-3">
            <TableRow className="text-sm text-gray-500 dark:text-gray-400" date="Date" description="Description" category="Category" amount="Amount" />
            {transactions && transactions.map((t) => <TableRow date={new Date(t.date)} description={t.description} category={t.category} amount={t.amount} type={t.type} />)}
          </div>
          <div className="flex justify-center">
            <Button className="px-4 !py-1.5" onClick={() => onPathChange("transactions")}>See All</Button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm">
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Spent This Month</p>
          {transactions && <span className="text-red-400 text-4xl font-bold">₹{transactions.filter((t) => t.type == "expense").reduce((sum, t) => sum + t.amount, 0)}</span>}
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm">
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Earnings This Month</p>
          {transactions && <span className="text-teal-500 text-4xl font-bold">₹{transactions.filter((t) => t.type == "income").reduce((sum, t) => sum + t.amount, 0)}</span>}
        </div>

        <div className="col-span-2 row-span-3 flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-sm py-5 pl-10">
          <h1 className="text-xl font-bold mb-1 dark:text-white">Spending By Category</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">This month's expense breakdown</p>
          <div className="flex-grow">
            {transactions && <CategorySpendings categories={user.categories} transactions={transactions} />}
          </div>
        </div>

      </div>

      <div className="fixed bottom-8 left-0 flex justify-center w-full">
        <Button className="px-3" onClick={(_) => setTransactionModalOpen(true)}> <span className="mr-2">+</span>Add Transaction</Button>
      </div>
      {user.categories &&
        <AddTransaction isOpen={transactionModalOpem} onRequestClose={() => setTransactionModalOpen(false)} categories={user.categories} />
      }

    </div>
  )
}

