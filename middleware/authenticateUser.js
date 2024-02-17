var jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = function (req, res, next) {
  try {
    const token = req.cookies.token;
    // console.log('Token:', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Decoded:', decoded);
    req.user = decoded;
    next();
  }
  catch (err) {
    // console.error('Authentication error:', err);
    res.redirect('/login');
  }
}

module.exports = authenticate;