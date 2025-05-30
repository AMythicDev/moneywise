import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Label from "./Label";
import Modal from "react-modal";
import { API_URL } from "../consts";

const transactionModalStyles = {
  overlay: {
    backgroundColor: "rgb(0, 0, 0, 0.5)",
  },
  content: {
    top: "20%",
    left: "25%",
    right: "auto",
    bottom: "auto",
    width: "50%",
  }
}

function dateToString(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth() + 1 < 9 && 0}${d.getMonth() + 1}-${d.getDate()}`
}

export default function AddTransaction({ isOpen, ...props}) {
  const [description, setDescription] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(dateToString(new Date()));

  const submitForm = async () => {
    const jwt = localStorage.getItem("jwt");
    const response = await fetch(`${API_URL}/newtransaction`,
      {
        method: "POST",
        headers: {
          "Authorization": jwt,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ description: description, type: type, category: category, amount: parseInt(amount), date: date })
      });
  }

  return (
    <Modal isOpen={isOpen} style={transactionModalStyles} contentLabel="Add Transaction" {...props}>
      <div>
        <h1 className="font-bold text-xl mb-3">Add Transaction</h1>
        <form className="flex flex-col gap-2" onSubmit={submitForm}>
          <Label htmlFor="description">Description</Label>
          <Input type="text" placeholder="Dinner with friends" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="mt-1">
            <span className="mr-8">Type</span>
            <input type="radio" name="type" id="expense" value="Expense" className="checked:accent-red-300" checked={type == "expense"} onChange={() => setType("expense")} />
            <Label htmlFor="expense" className="mr-4 text-red-400">Expense</Label>
            <input type="radio" name="type" id="income" value="Income" className="checked:accent-teal-500" checked={type == "income"} onChange={() => setType("income")} />
            <Label htmlFor="income" className="text-teal-500">Income</Label>
          </div>
          <Label htmlFor="category">Category</Label>
          <Input type="text" placeholder="Food" id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <Label htmlFor="amount">Amount</Label>
          <Input type="number" placeholder="200" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <Label htmlFor="date">Date</Label>
          <Input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <div className="flex justify-center mt-4">
            <Button type="submit" className="px-4">+ Add Transaction</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
