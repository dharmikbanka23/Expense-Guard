var jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticated = function (req, res, next) {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.redirect('/');
  }
  catch (err) {
    next();
  }
}

module.exports = authenticated;