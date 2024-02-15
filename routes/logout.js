var sendMail = require('../middleware/email');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var authenticate = require('../middleware/authenticateUser');
require('dotenv').config();

var userModel = require('../models/userModel'); //Users collection
var expenseModel = require('../models/expenseModel'); //Expenses collection
var configurationModel = require('../models/configurationModel') //Configurations collection

// Log the user out
router.get("/", function (req, res, next) {
  res.clearCookie('token');
  res.redirect('/login');
});

module.exports = router;