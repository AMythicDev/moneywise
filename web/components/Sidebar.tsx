import { getTheme, setTheme as setUITheme } from "../utils";
import { useEffect, useState } from "react";
import DeleteCategory from "./DeleteCategory";

export default function({ width, setPath, setUser = null, categories = null, }: { width: string }) {
  const [theme, setTheme] = useState(getTheme());
  useEffect(() => setUITheme(theme), [theme]);

  const [deleteCategory, setDeleteCategory] = useState(null);

  const logout = () => {
    localStorage.removeItem("jwt");
    setUser(null);
    setPath("signin");
  }

  return (
    <div className="fixed top-0 left-0 min-h-screen bg-teal-100 dark:bg-cyan-950 transition-[width] overflow-x-hidden z-[1]" style={{ width: width }}>
      <div className="h-20"></div>
      <div className="px-8 flex flex-col gap-3">
        <div className="flex justify-between">
          <span className="dark:text-white block leading-10">UI Theme</span>
          <select name="theme" className="dark:text-white border dark:border-white border-black py-0.5 px-5 bg-white/80 dark:bg-black/20" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        {categories &&
          <>
            <p className="text-sm text-gray-400 border-b border-gray-600 py-2">Categories</p>
            <ul className="dark:text-white h-[calc(100vh-16rem)]">
              {categories.map((c) =>
                <li className="py-1 flex justify-between" key={c.name}>
                  <span>
                    {c.name}
                    <span className={c.type == 'income' ? 'text-teal-500' : 'text-red-400'}> ●  </span>
                  </span>
                  <button onClick={() => setDeleteCategory({ name: c.name, type: c.type }) }>Delete</button>
                </li>
              )}
            </ul>
          </>
        }
        {setUser &&
          <button className="bg-red-400 text-white py-2" onClick={logout}>Logout</button>
        }
      </div>
      {deleteCategory && <DeleteCategory name={deleteCategory.name} type={deleteCategory.type} setDeleteCategory={setDeleteCategory} setUser={setUser} />}
    </div>
  )
}


