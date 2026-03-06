require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cookieParser());

const URI = process.env.URI;
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    await client.connect();
    const db = client.db('Project1DB');
    console.log("Connected to MongoDB!");

    const loginRouter = require('./routes/login')(db);
    const signUpRouter = require('./routes/signup')(db);
    const meRouter = require('./routes/me')(db);
    const logoutRouter = require('./routes/logout')(db);

    app.use('/auth', loginRouter);
    app.use('/auth', signUpRouter);
    app.use('/auth', meRouter);
    app.use('/auth', logoutRouter);

    app.listen(5000, () => console.log('Server running on port 5000'));
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

connectDB();
