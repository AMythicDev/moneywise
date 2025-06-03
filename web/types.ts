import type { Dispatch, SetStateAction } from "react"

export interface TransactionCategory {
  name: string,
  color?: string,
  type: "income" | "expense"
}

export interface User {
  _id: string,
  firstname: string,
  lastname: string,
  email: string,
  categories: TransactionCategory[],
}

export interface Transaction {
  _id: string,
  user_id: string,
  date: Date | string,
  description: string,
  category: string,
  type: "income" | "expense",
  amount: number,
  recurring: "Never" | "Daily" | "Monthly" | "Yearly",
}

export type SetState<T> = Dispatch<SetStateAction<T>>;
