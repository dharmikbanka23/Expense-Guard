var express = require('express');
var router = express.Router();
var authenticate = require('../middleware/authenticateUser');
require('dotenv').config();

// Log the user out
router.get("/", authenticate, function (req, res, next) {
  res.clearCookie('token');
  res.redirect('/login');
});

module.exports = router;