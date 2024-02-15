var jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = function (cookies) {
  try {
    const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
    return true;
  }
  catch (err) {
    return false;
  }
}

module.exports = authenticate;