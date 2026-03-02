require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion} = require('mongodb');

const app = express();
app. use(express.json());
app.use(cookieParser());

const URI = process.env.URI;
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('Project1DB');
    console.log("Connected to MongoDB!");
  } catch(err) {
    console.error(err);
  }
}

connectDB();

const loginRouter = require('./routes/login')(db);
const signUpRouter = require('./routes/signup')(db);
const meRouter = require('./routes/me')(db);
const logoutRouter = require('./routes/logout')(db);

app.use('/auth', loginRouter);
app.use('/auth', signUpRouter);
app.use('/auth', meRouter);
app.use('/auth', logoutRouter);

app.listen(5000, () => console.log('Server running on port 5000'));