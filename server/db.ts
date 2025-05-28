import { Db, MongoClient } from "mongodb";

const connStr = process.env["ATLAS_URI"] || "";

export interface User {
  firstname?: string,
  lastname?: string,
  username?: string,
  password?: string,
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

