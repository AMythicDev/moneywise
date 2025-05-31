import { API_URL } from "./consts";
import { useEffect, useState } from "react";
import AddTransaction from "./components/AddTransaction";
import Button from "./components/Button";
import TableRow from "./components/TableRow";
import DeleteTransaction from "./components/DeleteTransaction";

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

export default function Transactions({ user }) {
  const [transactions, setTransactions] = useState(null);
  const [transactionModalOpem, setTransactionModalOpen] = useState(false);
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);
  useEffect(() => {
    transactionsForMonth(setTransactions);
  }, [])
  return (
    <div className="bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 min-h-screen p-5 dark:from-cyan-900 dark:via-teal-900 dark:to-slate-900">
      <div className="bg-white p-5 rounded-lg shadow-sm dark:bg-slate-800">
        <h1 className="text-xl font-bold mb-2 dark:text-white">Transactions</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Detailed view of all your transactions</p>
        <TableRow className="text-sm text-gray-500" date="Date" description="Description" category="Category" controls amount="Amount" type="header" />
        {transactions &&
          transactions.map((t) => {
            return (<TableRow className="!h-12" key={t._id} id={t._id} setDeletionId={(id: string) => setDeleteTransactionId(id)} controls {...t} date={new Date(t.date)} />);
          })}
      </div>
      <div className="fixed bottom-8 left-0 flex justify-center w-full">
        <Button className="px-3" onClick={(_) => setTransactionModalOpen(true)}> <span className="mr-2">+</span>Add Transaction</Button>
      </div>
      <AddTransaction isOpen={transactionModalOpem} onRequestClose={() => setTransactionModalOpen(false)} categories={user.categories} />
      <DeleteTransaction isOpen={deleteTransactionId} onRequestClose={() => setDeleteTransactionId(null)} />
    </div>
  );
}
