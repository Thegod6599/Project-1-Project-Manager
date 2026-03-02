const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const router = express.Router();

module.exports = function (db) {
   router.post('/signup', async (req, res) => {
     try {
       const { username, password } = req.body;
       if (!username || !password) {
         return res.status(400).json({ message: 'Username and password are required' });
       }
       
       const existingUser = await db.collection('users').findOne({ username });
        if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
        }
       
       const hashedPassword = await bcrypt.hash(password, 10);
       const user = { username, password: hashedPassword, role: "user", createdAt: new Date(), lastLogin: new Date()};
       const result = await db.collection('users').insertOne(user);
       
      const token = jwt.sign({ userId: result.insertedId, role: "user" }, process.env.JWT_SECRET, { expiresIn: '1d' })
       
       res.cookie('token', token, {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: 'strict'
        });
       
       res.status(201).json({ message: 'User created successfully', userId: result.insertedId });
     }  catch (err) {
       console.error(err);
       res.status(500).json({ message: 'Internal server error' });
     }
   })
   return router;
};