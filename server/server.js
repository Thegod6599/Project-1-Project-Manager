require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const mongodb = require('mongodb');

const app = express();
app. use(express.json());

const URI = process.env.URI;
const client = new MongoClient(uri, {
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