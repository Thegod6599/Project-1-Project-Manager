require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cookieParser());

// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, '../client')));

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

    // Root route to serve the landing page
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/HTML/landing_page.html'));
    });

    // Routes for login and signup pages
    app.get('/login', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/HTML/login.html'));
    });

    app.get('/signup', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/HTML/signup.html'));
    });

    app.listen(5000, () => console.log('Server running on port 5000'));
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    // Still serve the landing page even if DB is down, for better UX/debugging
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/HTML/landing_page.html'));
    });
    app.listen(5000, () => console.log('Server running on port 5000 (DB connection issue)'));
  }
}

connectDB();
