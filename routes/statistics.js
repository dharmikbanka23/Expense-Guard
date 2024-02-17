var express = require('express');
var router = express.Router();
var authenticate = require('../middleware/authenticateUser');
require('dotenv').config();

var userModel = require('../models/userModel'); //Users collection
var expenseModel = require('../models/expenseModel'); //Expenses collection
var configurationModel = require('../models/configurationModel') //Configuration collection

// Send statistics page, load graphs
router.get('/', authenticate, async function (req, res, next) {
  const username = req.user.username;
  let expenseRecord = await expenseModel.find({ username: username }, { username: 0, __v: 0 }).sort({expenseDate: -1});
  let configurationRecord = await configurationModel.findOne({ user: username}, { user: 0, __v: 0 });

  res.render('statistics', {expenses: expenseRecord, configuration: configurationRecord});
});

module.exports = router;