import { getTheme, setTheme as setUITheme } from "../utils";
import { useContext, useEffect, useState } from "react";
import DeleteCategory from "./DeleteCategory";
import Input from "./Input";
import Label from "./Label";
import { API_URL } from "../consts";
import { refetchUser } from "../utils";
import { SetInitialContext } from "../contexts";

export default function({ width, categories = null, refetchTransactions = null }: { width: string }) {
  const [theme, setTheme] = useState(getTheme());
  useEffect(() => setUITheme(theme), [theme]);

  const [deleteCategory, setDeleteCategory] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [newEditCategory, setNewEditCategory] = useState(null);

  const [setPath, setUser] = useContext(SetInitialContext);

  const logout = () => {
    localStorage.removeItem("jwt");
    setUser(null);
    setPath("signin");
  }

  const handleEdit = async (e) => {
    const jwt = localStorage.getItem("jwt");
    await fetch(`${API_URL}/updatecategory/${editCategory.type}/${editCategory.name}`,
      { method: "PUT", headers: { "Authorization": jwt, "Content-Type": "application/json" }, body: JSON.stringify({ name: newEditCategory.name, type: newEditCategory.type }) })
    await refetchUser(setUser)
    await refetchTransactions();
    setEditCategory(null);
  }

  const handleEditButton = (c) => {
    setEditCategory({ name: c.name, type: c.type })
    setNewEditCategory({ name: c.name, type: c.type })
  }

  return (
    <div className="fixed top-0 left-0 min-h-screen bg-teal-100 dark:bg-cyan-950 transition-[width] overflow-x-hidden z-[1] shadow-2xl" style={{ width: width }}>
      <div className="h-20"></div>
      <div className="px-8 flex flex-col gap-3">
        <div className="flex justify-between">
          <span className="block leading-10">UI Theme</span>
          <select name="theme" className="border dark:border-white border-black py-0.5 px-5 bg-white/80 dark:bg-black/20" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        {categories &&
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400 border-b border-gray-600 py-2">Categories</p>
            <ul className="h-[calc(100vh-16rem)]">
              {categories.map((c) =>
                <li key={c.name}>
                  <div className="py-1 flex justify-between">
                    <span>
                      {c.name}
                      <span className={c.type == 'income' ? 'text-teal-500' : 'text-red-400'}> ●  </span>
                    </span>
                    <div className="flex gap-3">
                      <button onClick={() => handleEditButton(c)}>Edit</button>
                      <button onClick={() => setDeleteCategory({ name: c.name, type: c.type })}>Delete</button>
                    </div>
                  </div>
                  {editCategory && editCategory.name == c.name && editCategory.type == c.type &&
                    <div className="mt-2 mb-2">
                      <h1 className="font-bold mb-3">Edit Category</h1>
                      <Input type="text" value={newEditCategory.name} onChange={(e) => setNewEditCategory({ name: e.target.value, type: editCategory.type })} />
                      <div className="mt-1">
                        <span className="mr-8">Type</span>
                        <input type="radio" name="type" id="expense" value="Expense" className="checked:accent-red-300" checked={newEditCategory.type == "expense"} onChange={() => setNewEditCategory({ name: editCategory.name, type: "expense" })} />
                        <Label htmlFor="expense" className="mr-4 text-red-400">Expense</Label>
                        <input type="radio" name="type" id="income" value="Income" className="checked:accent-teal-500" checked={newEditCategory.type == "income"} onChange={() => setNewEditCategory({ name: editCategory.name, type: "income" })} />
                        <Label htmlFor="income" className="text-teal-500">Income</Label>
                        <div className="flex justify-between w-full mt-5">
                          <button className="border-2 border-gray-400 text-gray-400 py-1 px-3" onClick={() => setEditCategory(null)}>Cancel</button>
                          <button className="border-2 dark:border-cyan-400 dark:bg-cyan-400 bg-teal-400 border-teal-400 text-white py-1 px-3" onClick={handleEdit}>Update</button>
                        </div>
                      </div>
                    </div>}
                </li>
              )}
            </ul>
          </>
        }
        {setUser &&
          <button className="bg-red-400 text-white py-2 shadow-lg rounded-lg" onClick={logout}>Logout</button>
        }
      </div>
      {deleteCategory && <DeleteCategory name={deleteCategory.name} type={deleteCategory.type} setDeleteCategory={setDeleteCategory} setUser={setUser} />}
    </div>
  )
}


