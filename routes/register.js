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

// Send register page
router.get('/', function (req, res, next) {
  if (authenticate(req.cookies)) { return res.redirect('/') }
  res.render('register', { message: "" });
});

// Validate register page
router.post('/', async function (req, res, next) {
  let username = req.body.username.toLowerCase();
  let email = req.body.email;
  let password = await bcrypt.hash(req.body.password, 10);

  if (await userModel.findOne({ username: username })) {
    res.render('register', { message: "Username already exists" });
  }
  else if (await userModel.findOne({ email: email })) {
    res.render('register', { message: "Email already exists" });
  }
  else {
    //Creating new user
    const newUser = {
      username: username,
      email: email,
      password: password
    };
    try {
      let result = await userModel.create(newUser);
      const token = jwt.sign({ username: username, email: email }, process.env.JWT_SECRET, { expiresIn: '24hrs' });
      res.cookie('token', token, { maxAge: 24 * 60 * 60 * 1000 });

      //Create him a configuration in the database
      try {
        await configurationModel.create({ user: username });
      }
      catch (err) {
        console.error(err);
        res.clearCookie('token');
        await userModel.deleteOne({ username: username });
        return res.render('register', { message: "Failed setting up register configuration" });
      }
      res.redirect('/dashboard');
    }
    catch (err) {
      console.error(err);
      res.render('register', { message: "Try again after sometime" });
    }
  }
});

module.exports = router;