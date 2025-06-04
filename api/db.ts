import { Db, MongoClient, ObjectId } from "mongodb";

const connStr = process.env["ATLAS_URI"] || "";

export interface TransactionCategory {
  name: string,
  color: string,
  type: "income" | "expense"
}

export interface User {
  _id?: ObjectId,
  firstname?: string,
  lastname?: string,
  email?: string,
  password?: string,
  categories?: TransactionCategory[],
}

export interface Transaction {
  _id?: ObjectId | string,
  user_id: ObjectId,
  created: Date,
  description: string,
  category: string,
  type: "income" | "expense",
  amount: number,
}

export function generateDefaultCategories(): TransactionCategory[] {
  return [
    { name: "Food", color: '#c2f4a1', type: "expense" },
    { name: "Clothing", color: '#a995db', type: "expense" },
    { name: "Groceries", color: '#a16dc6', type: "expense" },
    { name: "Salary", color: '#1656a3', type: "income" },
    { name: "Misc", color: '#c943db', type: "expense" },
    { name: "Electricity", color: '#1697aa', type: "expense" },
    { name: "Water", color: '#ccb804', type: "expense" },
    { name: "Fuel", color: '#47f76a', type: "expense" },
  ];
}

export async function connectDB(): Promise<Db> {
  const client = new MongoClient(connStr);
  let conn: MongoClient;
  try {
    conn = await client.connect();
    console.info("successfully connected to db server")
  } catch (e) {
    console.error(e);
    throw e;
  }
  let db = conn.db("moneywise");
  return db;
}

