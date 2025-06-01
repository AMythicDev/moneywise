import "./config";
import express from "express";
import bcrypt from "bcrypt";
import { connectDB, type User, type Transaction, generateDefaultCategories } from "./db.js"
import cors from "cors";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import randomColor from "randomcolor";

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
  body.categories = generateDefaultCategories();
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
    res.status(200).json({ jwt: token, _id: user._id, firstname: user.firstname, lastname: user.lastname, categories: user.categories });
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
  return res.status(200).json({ jwt: token, _id: user._id, firstname: user.firstname, lastname: user.lastname, categories: user.categories });
})

app.post("/newtransaction", verifyToken, express.json(), async (req, res) => {
  const userId = req.userId;
  const transactions = db.collection("transactions");
  req.body.user_id = new ObjectId(userId);

  if (!req.body.date)
    req.body.date = new Date(Date.now());
  else {
    req.body.date = new Date(Date.parse(req.body.date));
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
  if (req.query.dateAfter) dateRange.$gte = new Date(Date.parse((req.query.dateAfter)));;
  if (req.query.dateBefore) dateRange.$lt = new Date(Date.parse((req.query.dateBefore)));
  if (req.query.dateAfter || req.query.dateBefore) query.date = dateRange;

  if (req.query.type) query.type = req.query.type;
  if (req.query.category) query.category = req.query.category;

  let cursor = trans.find(query).sort({ "date": -1 });
  if (req.query.limit) cursor.limit(parseInt(req.query.limit));
  const transactions = await cursor.toArray();
  return res.status(200).json(transactions);
})

app.delete("/deletetransaction/:transId", verifyToken, async (req, res) => {
  const transId = req.params.transId;

  const trans = db.collection("transactions");
  await trans.deleteOne({ _id: new ObjectId(transId) })
  return res.status(204).send();
})

app.put("/updatetransaction/:transId", verifyToken, express.json(), async (req, res) => {
  const userId = req.userId;
  const transId = req.params.transId;
  const trans = db.collection("transactions");
  req.body.date = new Date(req.body.date);
  req.body.user_id = new ObjectId(userId);
  await trans.replaceOne({ _id: new ObjectId(transId) }, req.body);
  return res.status(200).json({ _id: transId, ...req.body });
})

app.post("/createcategory", verifyToken, express.json(), async (req, res) => {
  const userId = req.userId;
  const users = db.collection("users");
  const category = await users.findOne({ _id: new ObjectId(userId), "categories.name": req.body.name, "categories.type": req.body.type }, { projection: { _id: 1 } });
  if (!category) {
    const item = { name: req.body.name, type: req.body.type, color: randomColor() }
    await users.updateOne({ _id: new ObjectId(userId) }, { $push: { "categories": item } })
    return res.status(200).json(item);
  }
  return res.status(409).send("category already exists");
})

app.delete("/deletecategory/:type/:name", verifyToken, async (req, res) => {
  const userId = new ObjectId(req.userId);
  const users = db.collection("users");
  const trans = db.collection("transactions");
  const type = req.params.type;
  const name = req.params.name;
  await users.updateOne({ _id: userId, "categories.name": name, "categories.type": type }, { $pull: { categories: { name: name, type: type } } })
  await trans.updateMany({ user_id: userId, }, { $unset: { "category": "" } })
  return res.status(204).send();
})

app.put("/updatecategory/:type/:name", verifyToken, express.json(), async (req, res) => {
  const userId = new ObjectId(req.userId);
  const users = db.collection("users");
  const trans = db.collection("transactions");

  const type = req.params.type;
  const name = req.params.name;

  await users.updateOne(
    {
      _id: userId,
      categories: { $elemMatch: { name: name, type: type } },
    },
    {
      $set: { "categories.$.name": req.body.name, "categories.$.type": req.body.type }
    }
  );
  await trans.updateMany({ user_id: userId, category: name, type: type }, { $set: { "category": req.body.name } })
  return res.status(200).send();
})


const PORT = process.env["PORT"];
app.listen(PORT, () => {
  console.log(`moneywise server running on port ${PORT}`)
})

