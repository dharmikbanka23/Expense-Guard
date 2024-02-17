var express = require('express');
var router = express.Router();
var authenticate = require('../middleware/authenticateUser');
var sendNotification = require('../controllers/notificationController');
require('dotenv').config();

var userModel = require('../models/userModel'); //Users collection
var expenseModel = require('../models/expenseModel'); //Expenses collection
var configurationModel = require('../models/configurationModel') //Configurations collection

// Send dashboard page
router.get(['/', '/dashboard'], authenticate, async function (req, res, next) {

  // Fetch the jwt token
  const username = req.user.username;
  const email = req.user.email;

  // Getting last 15 expenses
  let expenseRecord = await expenseModel.find({ username: username }, { username: 0, __v: 0 }).sort({ expenseDate: -1 }).limit(15);
  
  // Getting the current month expenses
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  let expenses = await expenseModel.find({
    username: username,
    expenseDate: {
      $gte: new Date(currentYear, currentMonth - 1, 1), // First day of the current month
      $lt: new Date(currentYear, currentMonth, 1) // First day of the next month
    }
  }, { username: 0, __v: 0 });

  let yearlyExpenses = await expenseModel.find({
    username: username,
    expenseDate: {
      $gte: new Date(currentYear, 0, 1), // First day of the year
      $lt: new Date(currentYear, currentMonth, 1) // First day of the next month
    }
  }, { username: 0, __v: 0 });

  let configuration = await configurationModel.findOne({ user: username }, { user: 0, __v: 0 });

  // send email
  sendNotification(email, configuration, expenses);

  // update the notification track
  await configurationModel.updateOne(
    {user: username},
    { $set: { notificationTrack: currentDate } }
  );

  res.render('dashboard', {
    expenseRecord,
    expenses,
    yearlyExpenses,
    configuration,
    username
  });
});

module.exports = router;