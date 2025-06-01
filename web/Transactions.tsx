import { API_URL } from "./consts";
import { useEffect, useState } from "react";
import Transaction from "./components/Transaction";
import Button from "./components/Button";
import TableRow from "./components/TableRow";
import Input from "./components/Input";
import Label from "./components/Label";
import Base from "./components/Base";
import { refetchUser } from "./utils";

function getTransactions(category: string, type: string, startDate?: string, endDate?: string, setTransactions) {
  const url = new URL(`${API_URL}/transactions/`)
  if (category != "all") url.searchParams.append("category", category);
  if (type != "all") url.searchParams.append("type", type);
  if (startDate) url.searchParams.append("dateAfter", startDate);
  if (endDate) url.searchParams.append("dateBefore", endDate);

  const jwt = localStorage.getItem("jwt");
  fetch(url.toString(), { headers: { "Authorization": jwt } })
    .then((resp) => resp.json())
    .then((body) => {
      setTransactions(body);
    });
}

export default function Transactions({ user, setUser, setPath, }) {
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);

  const [transactions, setTransactions] = useState(null);
  const [transactionModalOpem, setTransactionModalOpen] = useState(false);
  const [updateTransactionRecord, setUpdateTransactionRecord] = useState(null);

  const refetch = () => getTransactions(category, type, startDate, endDate, setTransactions);
  const resetFilters = () => {
    setCategory("all");
    setType("all");
    setStartDate(null);
    setEndDate(null);
  }
  const closeTranssactionModal = () => {
    setTransactionModalOpen(false);
    setUpdateTransactionRecord(null);
  }

  useEffect(() => refetch, []);
  useEffect(() => updateTransactionRecord ? setTransactionModalOpen(true) : setTransactionModalOpen(false), [updateTransactionRecord]);

  return (
    <Base className="min-h-screen p-5 flex flex-col gap-4" setUser={setUser} setPath={setPath} categories={user.categories} refetchTransactions={refetch}>
      <div className="bg-white p-5 rounded-lg shadow-sm dark:bg-slate-800">
        <h1 className="text-xl font-bold mb-2 dark:text-white"> Filters </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Filter and search your transactions</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Input type="text" placeholder="Dinner with friends" id="description" />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="category">Category</Label>
            <select name="category" value={category} onChange={(e) => setCategory(e.target.value)} className="border dark:bg-slate-600 border-black dark:border-gray-400 dark:text-white h-10 rounded-lg px-3" id="category">
              <option value="all">All Categories</option>
              {user.categories && user.categories.map((c) => <option value={c.name}>{c.name == "all" ? "All Categories" : c.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="type">Type</Label>
            <select name="category" value={type} onChange={(e) => setType(e.target.value)} className="border dark:bg-slate-600 border-black dark:border-gray-400 dark:text-white h-10 rounded-lg px-3" id="type">
              <option value="all">All Types</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="start-date">Start Date</Label>
            <Input type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="start-date">End Date</Label>
            <Input type="date" id="start-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-between mt-5">
          <button onClick={resetFilters} className="border-2 rounded-sm py-2 px-3 border-gray-400 dark:text-white hover:bg-gray-400 hover:text-white transition-colors">Clear All Filters</button>
          <Button className="px-4" onClick={refetch}>Show</Button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm dark:bg-slate-800">
        <h1 className="text-xl font-bold mb-2 dark:text-white">Transactions</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Detailed view of all your transactions</p>
        <TableRow className="text-sm text-gray-500" date="Date" description="Description" category="Category" controls amount="Amount" type="header" />
        {transactions &&
          transactions.map((t) => {
            return (<TableRow className="!h-12" key={t._id} id={t._id} setUpdateTransactionRecord={setUpdateTransactionRecord} controls {...t} date={new Date(t.date)} />);
          })}
      </div>
      <div className="fixed bottom-8 left-0 flex justify-center w-full">
        <Button className="px-3" onClick={(_) => setTransactionModalOpen(true)}> <span className="mr-2">+</span>Add Transaction</Button>
      </div>
      {transactionModalOpem &&
        <Transaction
          setIsOpen={setTransactionModalOpen}
          refetchTransactions={refetch}
          refetchUser={() => refetchUser(setUser)}
          updateTransaction={updateTransactionRecord}
          onRequestClose={closeTranssactionModal}
          categories={user.categories} />
      }
    </Base>
  );
}
