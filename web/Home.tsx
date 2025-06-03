import { type User } from "./types"
import TableRow from "./components/TableRow"
import Button from "./components/Button";
import { API_URL } from "./consts";
import { useContext, useEffect, useState } from "react";
import Transaction from "./components/Transaction";
import CategorySpendings from "./components/CategorySpendings";
import { refetchUser } from "./utils";
import Base from "./components/Base";
import { SetInitialContext } from "./contexts";
import WeeklyGraph from "./components/WeeklyGraph";

interface HomeProps {
  user: User | null,
}

function transactionsForMonth(setTransactions) {
  const day = new Date();
  const dateAfter = `${day.getFullYear()}-${day.getMonth() + 1}-01`
  const dateBefore = `${day.getFullYear()}-${day.getMonth() + 2}-01`
  const jwt = localStorage.getItem("jwt");
  fetch(`${API_URL}/transactions?dateAfter=${dateAfter}&dateBefore=${dateBefore}&limit=10`, { headers: { "Authorization": jwt } })
    .then((resp) => resp.json())
    .then((body) => {
      setTransactions(body);
    });
}

export default function Home({ user }: HomeProps) {
  if (user == null) return null;
  const [transactions, setTransactions] = useState(null);
  const [transactionModalOpem, setTransactionModalOpen] = useState(false);
  useEffect(() => {
    transactionsForMonth(setTransactions);
  }, [])

  const [setPath, setUser] = useContext(SetInitialContext);

  return (
    <Base setUser={setUser} categories={user.categories} refetchTransactions={() => transactionsForMonth(setTransactions)} className="pb-7">
      <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-4 gap-6 px-5 lg:px-16">

        <div className="row-span-4 col-span-2 bg-white dark:bg-slate-800 dark:text-white p-5 rounded-lg shadow-sm">
          <h1 className="text-xl font-bold mb-3 dark:text-white"> Transactions This Month </h1>
          <div className="min-h-96 mb-3">
            <TableRow className="text-sm text-gray-500" date="Date" description="Description" category="Category" amount="Amount" recurring="Recurring" />
            {transactions && transactions.map((t) => <TableRow key={t._id} {...t} date={new Date(t.date)} />)}
          </div>
          <div className="flex justify-center">
            <Button className="px-4 !py-1.5" onClick={() => setPath("transactions")}>See All</Button>
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
      <div className="bg-white dark:bg-slate-800 mt-5 lg:mx-16 px-5 lg:px-16 py-5 h-[]">
        <h1 className="text-xl font-bold mb-1 dark:text-white">Weekly Overview</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Your income and expenses over the last 7 days</p>
        {transactions && <WeeklyGraph transactions={transactions} />}
      </div>

      <div className="fixed bottom-8 left-0 flex justify-center w-full">
        <Button className="px-3" onClick={(_) => setTransactionModalOpen(true)}> <span className="mr-2">+</span>Add Transaction</Button>
      </div>
      {
        transactionModalOpem &&
        <Transaction
          setIsOpen={setTransactionModalOpen}
          refetchTransactions={() => transactionsForMonth(setTransactions)}
          refetchUser={() => refetchUser(setUser)}
          onRequestClose={() => setTransactionModalOpen(false)}
          categories={user.categories}
        />
      }
    </Base >
  )
}


