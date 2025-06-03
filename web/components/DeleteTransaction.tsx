import Modal from "react-modal";
import { transactionModalStyles } from "../consts";
import { API_URL } from "../consts";

function formatDate(d: Date | string): string {
  if (typeof d == "string") return d;
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

export default function DeleteTransaction({ deleteTransactionRecord, setDeleteTransactionRecord, refetch, ...props }) {
  const deleteTransaction = async () => {
    const jwt = localStorage.getItem("jwt");
    await fetch(`${API_URL}/deletetransaction/${deleteTransactionRecord._id}`, { method: "DELETE", headers: { Authorization: jwt } });
    await refetch();
    setDeleteTransactionRecord(null);
  }
  return (
    <Modal isOpen={true} style={transactionModalStyles} onRequestClose={() => setDeleteTransactionRecord(null)} contentLabel="Delete Transaction" className="dark:bg-slate-800 p-7 w-[90%] lg:w-[50%] dark:text-white" {...props}>
      <h1 className="font-bold text-xl mb-3">Delete Transaction</h1>
      <p className="mb-4">Once deleted, this transaction will not be shown</p>
      <div>
        <span className="font-bold mr-3">Description:</span> <span>{deleteTransactionRecord.description}</span>
      </div>
      <div>
        <span className="font-bold mr-3">Type:</span> <span>{deleteTransactionRecord.type}</span>
      </div>
      <div>
        <span className="font-bold mr-3">Category:</span> <span>{deleteTransactionRecord.category}</span>
      </div>
      <div>
        <span className="font-bold mr-3">Recurring:</span> <span>{deleteTransactionRecord.recurring ?? "Never"}</span>
      </div>
      <div>
        <span className="font-bold mr-3">Date:</span> <span>{formatDate(deleteTransactionRecord.date)}</span>
      </div>
      <div>
        <span className="font-bold mr-3">Amount:</span> <span>{deleteTransactionRecord.amount}</span>
      </div>
      <div className="flex gap-3 justify-between mt-4">
        <button className="border-teal-500 border-2 px-3 rounded-lg" onClick={() => setDeleteTransactionRecord(null)}>Cancel</button>
        <button className="bg-red-400 border-2 border-red-400 text-white px-3 py-2 rounded-lg" onClick={deleteTransaction}>Delete</button>
      </div>
    </Modal>
  )
}

