import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Label from "./Label";
import Modal from "react-modal";
import { API_URL } from "../consts";

const transactionModalStyles = {
  overlay: {
    backgroundColor: "rgb(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}

function dateToString(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth() + 1 <= 9 && 0}${d.getMonth() + 1}-${d.getDate() <= 9 && 0}${d.getDate()}`
}

export default function Transaction({ setIsOpen, refetchTransactions, refetchUser, categories, updateTransaction = null, ...props }) {
  const [description, setDescription] = useState(updateTransaction != null ? updateTransaction.description : "");
  const [type, setType] = useState(updateTransaction ? updateTransaction.type : "expense");
  const [category, setCategory] = useState(updateTransaction ? updateTransaction.category : undefined);
  const [amount, setAmount] = useState(updateTransaction ? updateTransaction.amount : "");
  const [date, setDate] = useState(dateToString(new Date()));

  const submitForm = async (e) => {
    e.preventDefault();
    const jwt = localStorage.getItem("jwt");
    const url = updateTransaction ? `${API_URL}/updatetransaction/${updateTransaction._id}` : `${API_URL}/newtransaction`;
    const method = updateTransaction ? "PUT" : "POST";

    if (category.length != 0 && !categories.some(c => c.name == category)) {
      await fetch(`${API_URL}/createcategory`,
        {
          method: "POST",
          headers: {
            "Authorization": jwt,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name: category, type: type })
        });
      await refetchUser();
    }

    const categoryRefined = category.length > 0 ? category : null;

    await fetch(url,
      {
        method: method,
        headers: {
          "Authorization": jwt,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ description: description, type: type, category: categoryRefined, amount: parseInt(amount), date: date })
      });
    setIsOpen(false);
    refetchTransactions();
  }

  return (
    <Modal isOpen={true} contentLabel="Add Transaction" {...props} className="dark:bg-slate-800 p-7 w-[90%] lg:w-[50%]" style={transactionModalStyles}>
      <div>
        <h1 className="font-bold text-xl mb-3 dark:text-white">Add Transaction</h1>
        <form className="flex flex-col gap-3" onSubmit={submitForm}>
          <Label htmlFor="description">Description</Label>
          <Input type="text" placeholder="Dinner with friends" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="mt-1">
            <span className="mr-8 dark:text-white">Type</span>
            <input type="radio" name="type" id="expense" value="Expense" className="checked:accent-red-300" checked={type == "expense"} onChange={() => setType("expense")} />
            <Label htmlFor="expense" className="mr-4 text-red-400">Expense</Label>
            <input type="radio" name="type" id="income" value="Income" className="checked:accent-teal-500" checked={type == "income"} onChange={() => setType("income")} />
            <Label htmlFor="income" className="text-teal-500">Income</Label>
          </div>
          <div className="mb-2">
            <Label htmlFor="category" className="mb-2">Category</Label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">A new category will automatically be created if the entered category does not exist</p>
            <Input type="text" placeholder="Food" id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
            <div className="flex gap-2 flex-wrap mt-3">
              {categories
                .filter((c) => c.type == type)
                .map((c) =>
                  <span key={c.name} style={{ backgroundColor: c.color + "bb", borderColor: c.color }} className="px-3 rounded-full text-white border-2 cursor-pointer"
                    onClick={() => setCategory(c.name)}>
                    {c.name}
                  </span>)
              }
            </div>
          </div>
          <Label htmlFor="amount">Amount</Label>
          <Input type="number" placeholder="200" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <Label htmlFor="date">Date</Label>
          <Input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <div className="flex justify-center p-5">
            <Button type="submit" className="px-4">{updateTransaction ? "⟳  Update Transaction" : "+ Add Transaction"}</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
