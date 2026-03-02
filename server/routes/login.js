const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

module.exports = function (db) {
  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
         return res.status(400).json({ message: 'Username and password are required' });
      }
      const user = await db.collection('users').findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
         return res.status(401).json({ message: 'Invalid username or password' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: { lastLogin: new Date() } }
      );
      res.cookie('token', token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict'
      });
      res.status(200).json({ message: 'Login successful', userId: user._id});
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    };
  });
  return router;
};