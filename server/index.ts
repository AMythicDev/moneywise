import "./config";
import express from "express";
import bcrypt from "bcrypt";
import { connectDB, type User, type Transaction } from "./db.js"
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
    return;
  }
  res.status(401).send("authentication failed")
})

function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send("unauthorized request");
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).send("invalid token");
  }
};

app.get("/queryuser", verifyToken, async (req, res) => {
  const token = req.header('Authorization');
  const users = db.collection("users");
  const user = await users.findOne({ _id: new ObjectId(req.userId) })
  if (!user) return res.status(401).send("unauthorized request");
  return res.status(200).json({ jwt: token, _id: user._id, firstname: user.firstname, lastname: user.lastname });
})

app.post("/newtransaction", verifyToken, express.json(), async (req, res) => {
  const userId = req.userId;
  const transactions = db.collection("transactions");
  req.body.user_id = new ObjectId(userId);

  if (!req.body.date)
    req.body.date = new Date(Date.now());
  else {
    req.body.date = new Date(Date.parse(req.body.date));
    req.body.date.setMonth(req.body.date.getMonth() - 1);
  }

  const body: Transaction = req.body;
  const transaction = await transactions.insertOne({ _id: null, ...req.body });
  body._id = transaction.insertedId.toString();
  body.user_id = userId;
  return res.status(200).json(body);
})

app.get("/transactions", verifyToken, async (req, res) => {
  const userId = req.userId;
  const trans = db.collection("transactions");
  let query = { user_id: new ObjectId(userId) };

  let dateRange = {};
  if (req.query.dateAfter) {
    dateRange.$gte = new Date(Date.parse((req.query.dateAfter)));;
  }
  if (req.query.dateBefore) {
    dateRange.$lt = new Date(Date.parse((req.query.dateBefore)));
  }
  if (req.query.dateAfter || req.query.dateBefore) query.date = dateRange;

  let cursor = trans.find(query).sort({ "date": 1 });
  if (req.query.limit) cursor.limit(parseInt(req.query.limit));
  const transactions = await cursor.toArray();
  return res.status(200).json(transactions);
})

const PORT = process.env["PORT"];
app.listen(PORT, () => {
  console.log(`moneywise server running on port ${PORT}`)
})

