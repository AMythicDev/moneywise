import Sidebar from "./Sidebar"
import Hamburger from "./Hamburger"
import { useState, type ComponentPropsWithoutRef } from "react"
import type { TransactionCategory } from "../types"

type BaseProps = ComponentPropsWithoutRef<"div"> & {
  categories?: TransactionCategory[] | null,
  refetchTransactions?: (() => void) | null
}

export default function Base({ children, className, refetchTransactions = null, categories = null, }: BaseProps) {
  const [sidebarWidth, setSidebarWidth] = useState('0');

  const toggleSidebar = () => {
    // This `24rem` comes from basic tailwindcss styling system equivalent to w-96
    if (sidebarWidth == '0') setSidebarWidth('24rem'); else setSidebarWidth('0');
  }

  const closeSidebar = () => sidebarWidth != '0' && setSidebarWidth('0');

  return (
    <div className="bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 min-h-screen dark:from-cyan-900 dark:via-teal-900 dark:to-slate-900 dark:text-white">
      <button className="fixed shadow-md top-3 left-5 flex gap-1 dark:bg-cyan-900 bg-gray-300 py-1 px-3 rounded-full z-[2]" onClick={toggleSidebar}>
        <Hamburger />
        <span className="inline-block leading-8">{sidebarWidth == '0' ? 'Menu' : 'Close'}</span>
      </button>
      <Sidebar width={sidebarWidth} categories={categories} refetchTransactions={refetchTransactions} />
      <div className={`min-h-screen ${className} pt-18`} onClick={closeSidebar}>
        {children}
      </div>
    </div>
  )
}
