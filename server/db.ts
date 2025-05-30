import { Db, MongoClient, ObjectId } from "mongodb";

const connStr = process.env["ATLAS_URI"] || "";

export interface User {
  _id?: ObjectId,
  firstname?: string,
  lastname?: string,
  email?: string,
  password?: string,
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

