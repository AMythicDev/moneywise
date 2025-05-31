import { API_URL } from "../consts";
import { refetchUser } from "../utils";
import { transactionModalStyles } from "../consts";
import Modal from "react-modal";

export default function DeleteCategory({ name, type, setUser, setDeleteCategory }: { name: string, type: string }) {
  const handleDeletion = async (e) => {
    const jwt = localStorage.getItem("jwt");
    await fetch(`${API_URL}/deletecategory/${type}/${name}`, { method: "DELETE", headers: { "Authorization": jwt } })
    await refetchUser(setUser)
    setDeleteCategory(null);
  }


  return (
    <Modal isOpen={true} onRequestClose={() => setDeleteCategory(null)} className="dark:bg-slate-800 p-7 w-[90%] lg:w-[50%]" style={transactionModalStyles}>
      <h1 className="dark:text-white font-bold text-lg mb-3">Delete Category</h1>
      <p className="text-white">Are you sure you want to remove the <b>{name}</b> category of type <b>{type}</b>.</p>
      <p className="text-white mt-3">It will be removed from all existing transactions.</p>
      <div className="flex justify-between w-full mt-5">
        <button className="border-2 border-gray-400 text-gray-400 py-1 px-3" onClick={() => setDeleteCategory(null)}>Cancel</button>
        <button className="border-2 border-red-400 bg-red-400 text-white py-1 px-3" onClick={handleDeletion}>Delete</button>
      </div>
    </Modal>
  )
}
