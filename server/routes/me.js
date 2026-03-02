const authMiddleware = require('../middleware/authMiddleware')
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

module.exports = function (db) {
   router.get('/me', authMiddleware, async (req, res) => {
      try {
        const user = await db.collection('users').findOne(
          { _id: new ObjectId(req.user.userId) },
          { projection: { password: 0 } });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      }
   })
   return router;
}