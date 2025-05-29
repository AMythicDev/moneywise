import "./config";
import express from "express";
import bcrypt from "bcrypt";
import { connectDB, type User } from "./db.js"
import cors from "cors";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const db = await connectDB();
const saltRounds = 13;
const JWT_SECRET_KEY = process.env["JWT_SECRET_KEY"];

if (JWT_SECRET_KEY == undefined) throw new Error("jwt secret key not available");

const app = express()
app.use(cors())

app.post('/signup', express.json(), async (req, res) => {
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
  let added_user = await users.insertOne(body);
  const token = jwt.sign({ userId: added_user._id }, JWT_SECRET_KEY, { expiresIn: "7d" });
  res.status(200).json(JSON.stringify({ jwt: token, _id: added_user._id, firstname: user.firstname, lastname: user.lastname }));
})

app.post('/login', express.json(), async (req, res) => {
  let body: User = req.body;
  body.email = body.email?.toLowerCase()
  const users = db.collection("users");
  const user = await users.findOne({ email: body.email })
  if (user != null && await bcrypt.compare(body.password!, user.password)) {
    const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: "7d" });
    res.status(200).json({ jwt: token, _id: user._id, firstname: user.firstname, lastname: user.lastname });
    console.log(token);
    return;
  }
  res.status(401).send("authentication failed")
})

app.get("/fetchuser", async (req, res) => {
  let token = req.query["jwt"];
  if (token == undefined) {
    res.status(400).send("malformed fetchuser request");
    return;
  }
  token = token.toString();

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    const userId = decoded.userId;
    const users = db.collection("users");
    const user = await users.findOne({ _id: new ObjectId(userId) })
    res.status(200).json({ jwt: token, _id: user._id, firstname: user.firstname, lastname: user.lastname });
    return;
  } catch (error) {
    res.status(401).send("invalid token");
  }
})

const PORT = process.env["PORT"] || "";
app.listen(PORT, () => {
  console.log(`moneywise server running on port ${PORT}`)
})

