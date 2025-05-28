import "./config";
import express from "express";
import bcrypt from "bcrypt";
import { connectDB, type User } from "./db.js"

const db = await connectDB();
const saltRounds = 13;

const app = express()
app.use(express.json());

app.post('/signup', async (req, res) => {
  let body: User = req.body;
  const users = db.collection("users");
  const user: User = { username: body.username }
  if (await users.findOne(user)) {
    res.status(409).send("the user is already present")
    return
  }
  let salt = await bcrypt.genSalt(saltRounds)
  body.password = await bcrypt.hash(body.password!, salt)
  await users.insertOne(body);
  res.status(200).send("user created successfully")
})

const PORT = process.env["PORT"] || "";
app.listen(PORT, () => {
  console.log(`moneywise server running on port ${PORT}`)
})

