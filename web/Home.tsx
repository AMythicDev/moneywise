import type { Transaction, User, SetState } from "./types"
import TableRow from "./components/TableRow"
import Button from "./components/Button";
import { API_URL } from "./consts";
import { useContext, useEffect, useState } from "react";
import TransactionDialog from "./components/TransactionDialog.tsx";
import CategorySpendings from "./components/CategorySpendings";
import { refetchUser } from "./utils";
import Base from "./components/Base";
import { SetInitialContext, type InitialContextType } from "./contexts";
import WeeklyGraph from "./components/WeeklyGraph";

interface HomeProps {
  user: User | null,
}

function transactionsForMonth(setTransactions: SetState<Transaction[] | null>) {
  const day = new Date();
  const dateAfter = `${day.getFullYear()}-${day.getMonth() + 1}-01`
  const dateBefore = `${day.getFullYear()}-${day.getMonth() + 2}-01`
  const jwt: string = localStorage.getItem("jwt")!;
  fetch(`${API_URL}/transactions?dateAfter=${dateAfter}&dateBefore=${dateBefore}&limit=10`, { headers: { Authorization: jwt } })
    .then((resp) => resp.json())
    .then((body: Transaction[]) => {
      setTransactions(body);
    });
}

export default function Home({ user }: HomeProps) {
  if (user == null) return null;
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [transactionModalOpem, setTransactionModalOpen] = useState(false);
  useEffect(() => {
    transactionsForMonth(setTransactions);
  }, [])

  const [setPath, setUser] = useContext<InitialContextType>(SetInitialContext);

  return (
    <Base categories={user.categories} refetchTransactions={() => transactionsForMonth(setTransactions)} className="pb-7">
      <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-4 gap-6 px-5 lg:px-16">

        <div className="row-span-4 col-span-2 bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm">
          <h1 className="text-xl font-bold mb-3">Transactions This Month </h1>
          <div className="min-h-96 mb-3 overflow-x-auto">
            <TableRow className="text-sm text-gray-500" date="Date" description="Description" category="Category" amount="Amount" recurring="Recurring" type="header" />
            {transactions && transactions.map((t) => <TableRow key={t._id} {...t} date={new Date(t.date)} />)}
          </div>
          <div className="flex justify-center">
            <Button className="px-4 !py-1.5" onClick={() => setPath!("transactions")}>See All</Button>
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
          <h1 className="text-xl font-bold mb-1">Spending By Category</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">This month's expense breakdown</p>
          <div className="flex-grow">
            {transactions && <CategorySpendings categories={user.categories} transactions={transactions} />}
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 mt-5 lg:mx-16 px-5 lg:px-16 py-5 h-[]">
        <h1 className="text-xl font-bold mb-1">Weekly Overview</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Your income and expenses over the last 7 days</p>
        {transactions && <WeeklyGraph transactions={transactions} />}
      </div>

      <div className="fixed bottom-8 left-0 flex justify-center w-full">
        <Button className="px-3" onClick={(_) => setTransactionModalOpen(true)}> <span className="mr-2">+</span>Add Transaction</Button>
      </div>
      {
        transactionModalOpem &&
        <TransactionDialog
          setIsOpen={setTransactionModalOpen}
          refetchTransactions={() => transactionsForMonth(setTransactions)}
          refetchUser={() => refetchUser(setUser!)}
          onRequestClose={() => setTransactionModalOpen(false)}
          categories={user.categories}
        />
      }
    </Base >
  )
}


