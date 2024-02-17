var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var authenticated = require('../middleware/authenticatedUser');
require('dotenv').config();

var userModel = require('../models/userModel'); //Users collection
var expenseModel = require('../models/expenseModel'); //Expenses collection
var configurationModel = require('../models/configurationModel') //Configurations collection

// Send login page
router.get('/', authenticated, function (req, res, next) {

  res.render('login', { message: "" });
  
});

// Validate login page
router.post('/', authenticated, async function (req, res, next) {

  let user = req.body.user.toLowerCase();
  let valPassword = req.body.password;
  let userRecord;

  if (user.includes("@")) {
    userRecord = await userModel.findOne({ email: user }, { _id: 0, username: 1, email: 1, password: 1 });
  }
  else {
    userRecord = await userModel.findOne({ username: user }, { _id: 0, username: 1, email: 1, password: 1 });
  }

  // Validate
  if (!userRecord || !await bcrypt.compare(valPassword, userRecord.password)) {
    return res.render("login", { message: "Invalid user or password" });
  }
  const token = jwt.sign({ username: userRecord.username, email: userRecord.email }, process.env.JWT_SECRET, { expiresIn: '24hrs' });
  res.cookie('token', token, { maxAge: 24 * 60 * 60 * 1000 });

  res.redirect('/dashboard');
});

module.exports = router;