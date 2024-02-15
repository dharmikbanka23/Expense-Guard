var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var authenticate = require('../middleware/authenticateUser');
require('dotenv').config();

var userModel = require('../models/userModel'); //Users collection
var expenseModel = require('../models/expenseModel'); //Expenses collection
var configurationModel = require('../models/configurationModel') //Configuration collection

// Send statistics page, load graphs
router.get('/', async function (req, res, next) {
  if (!authenticate(req.cookies)) { return res.redirect('/login') }
  const username = jwt.decode(req.cookies.token).username;
  let expenseRecord = await expenseModel.find({ username: username }, { username: 0, __v: 0 }).sort({expenseDate: -1});
  let configurationRecord = await configurationModel.findOne({ user: username}, { user: 0, __v: 0 });

  res.render('statistics', {expenses: expenseRecord, configuration: configurationRecord});
});

module.exports = router;