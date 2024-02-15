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

// Send dashboard page
router.get(['/', '/dashboard'], async function (req, res, next) {
  if (!authenticate(req.cookies)) { return res.redirect('/login') }

  // Decode the jwt token
  const username = jwt.decode(req.cookies.token).username;
  const email = jwt.decode(req.cookies.token).email;

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
    configuration
  });
});


const sendNotification = function (email, configuration, expenses) {
  const today = new Date();
  const notificationFrequency = configuration.notificationFrequency;
  const notificationTrack = configuration.notificationTrack ? new Date(configuration.notificationTrack) : undefined;

  if (notificationFrequency === 'daily') {
    // Check if notification was already sent today
    if (notificationTrack && isSameDate(today, notificationTrack)) {
      return;
    }
    // Send email notification if user prefers email
    if (configuration.notificationChannels.includes('email')) {
      sendMail(email, createNotificationContent(configuration, expenses));
    }
  }
  else if (notificationFrequency === 'weekly') {
    // Check if today is within the current week
    if (notificationTrack && isSameWeek(today, notificationTrack)) {
      return;
    }
    // Send email notification if user prefers email
    if (configuration.notificationChannels.includes('email')) {
      sendMail(email, createNotificationContent(configuration, expenses));
    }
  }
}


const createNotificationContent = function (configuration, expenses) {

  // Fetch the current date
  const today = new Date();

  // Fetch the current month from the date
  const selectedMonth = new Date().toISOString().slice(0, 7);

  // Fetch the monthly budget for the selected month from configuration
  const monthlyBudgetForMonth = configuration.monthlyBudget.find(entry => entry.year === parseInt(selectedMonth.split('-')[0]) && entry.month === parseInt(selectedMonth.split('-')[1]));
  const monthlyBudget = monthlyBudgetForMonth ? monthlyBudgetForMonth.budget : configuration.defaultMonthlyBudget;

  // Directly use the expenses array as all entries are for the selected month
  const dailyExpensesForMonth = expenses;

  // Calculate and display total spent, total budget, and remaining budget
  const totalSpentMonth = dailyExpensesForMonth.reduce((total, expense) => total + expense.amount, 0);

  // Calculate prediction rates
  const monthlyPredictionSpending = (totalSpentMonth / today.getDate()) * new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  // Get the spent percentage
  const spentPercentage = (monthlyPredictionSpending / monthlyBudget) * 100;

  let htmlContent;

  if (spentPercentage <= 80) {
    htmlContent = `
      <h1> Wellness Report </h1>
      <p style="font-size: 16px"> <b>Total Spent:</b> ${totalSpentMonth} </p>
      <p style="font-size: 16px"> <b>Budget Set:</b> ${monthlyBudget} </p>
      <p style="font-size: 16px"> <b>Predicted Spending:</b> ${monthlyPredictionSpending.toFixed(2)} </p>
      <p>Your spending is within a healthy range. Keep up the good work!</p>
    `;
  }
  else if (spentPercentage <= 95) {
    htmlContent = `
      <h1> Wellness Report </h1>
      <p style="font-size: 16px"> <b>Total Spent:</b> ${totalSpentMonth} </p>
      <p style="font-size: 16px"> <b>Budget Set:</b> ${monthlyBudget} </p>
      <p style="font-size: 16px"> <b>Predicted Spending:</b> ${monthlyPredictionSpending.toFixed(2)} </p>
      <p>Your spending is approaching the budget limit. Consider reviewing your expenses.</p>
    `;
  }
  else {
    htmlContent = `
      <h1> Wellness Report </h1>
      <p style="font-size: 16px"> <b>Total Spent:</b> ${totalSpentMonth} </p>
      <p style="font-size: 16px"> <b>Budget Set:</b> ${monthlyBudget} </p>
      <p style="font-size: 16px"> <b>Predicted Spending:</b> ${monthlyPredictionSpending.toFixed(2)} </p>
      <p>Your spending is exceeding the budget. It's essential to reassess and adjust your financial plan.</p>
    `;
  }

  const autogeneratedMessage = `
    <br>
    <p>This is an autogenerated message. Please do not reply to this email.</p>
    <p>If you have any questions or concerns, feel free to reach out to our support team at help.expenseguard@gmail.com</p>
  `;

  htmlContent += autogeneratedMessage;
  return htmlContent;
}

// Function to check if two dates are on the same day
function isSameDate(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Function to check if two dates are in the same week (Monday to Sunday)
function isSameWeek(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((date1 - date2) / oneDay));

  // Get the day of the week for each date (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek1 = date1.getDay();
  const dayOfWeek2 = date2.getDay();

  // Check if the difference in days is less than 7 and the day of the week is the same
  return diffDays < 7 && (dayOfWeek1 <= dayOfWeek2 || dayOfWeek2 === 0);
}

module.exports = router;