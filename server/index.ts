import "./config";
import express from "express";
import bcrypt from "bcrypt";
import { connectDB, type User } from "./db.js"
import cors from "cors";

const db = await connectDB();
const saltRounds = 13;

const app = express()
app.use(express.json());
app.use(cors())

app.post('/signup', async (req, res) => {
  let body: User = req.body;
  body.email = body.email?.toLowerCase()
  const users = db.collection("users");
  const user: User = { email: body.email }
  if (await users.findOne(user)) {
    res.status(409).send("the user is already present")
    return
  }
  let salt = await bcrypt.genSalt(saltRounds)
  body.password = await bcrypt.hash(body.password!, salt)
  await users.insertOne(body);
  res.status(200).send("user created successfully")
})

app.post('/login', async (req, res) => {
  let body: User = req.body;
  body.email = body.email?.toLowerCase()
  const users = db.collection("users");
  const user = await users.findOne({ email: body.email })
  if (user != null && await bcrypt.compare(body.password!, user.password)) {
    res.status(200).send("user login successful")
    return;
  }
  res.status(401).send("authentication failed")
})


const PORT = process.env["PORT"] || "";
app.listen(PORT, () => {
  console.log(`moneywise server running on port ${PORT}`)
})

