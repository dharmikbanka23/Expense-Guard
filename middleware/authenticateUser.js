var jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = function (req, res, next) {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  }
  catch (err) {
    res.redirect('/login');
  }
}

module.exports = authenticate;