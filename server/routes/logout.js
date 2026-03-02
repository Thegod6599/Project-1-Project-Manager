const express = require('express');
const router = express.Router()

module.exports = function (db) {
  router.post('/logout', (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'strict'
    });
    res.status(200).json({ message: 'Logout successful' });
  });
  return router;
}
