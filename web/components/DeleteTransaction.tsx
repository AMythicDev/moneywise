import Modal from "react-modal";

const transactionModalStyles = {
  overlay: {
    backgroundColor: "rgb(0, 0, 0, 0.5)",
  },
  content: {
    top: "15%",
    left: "25%",
    right: "auto",
    bottom: "auto",
    width: "50%",
  }
}


export default function DeleteTransaction({ isOpen, ...props }) {
  return (
    <Modal isOpen={isOpen} style={transactionModalStyles} contentLabel="Delete Transaction" {...props}>
      <h1 className="font-bold text-xl mb-3">Add Transaction</h1>
      <p>Once deleted, this transaction will not be shown</p>
      <div className="flex justify-end gap-3">
        <button className="border-teal-500 border-2 px-3 rounded-lg">Cancel</button>
        <button className="bg-red-400 border-2 border-red-400 text-white px-3 py-2 rounded-lg">Delete</button>
      </div>
    </Modal>
  )
}

