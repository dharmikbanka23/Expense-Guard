var express = require('express');
var router = express.Router();
var authenticate = require('../middleware/authenticateUser');
require('dotenv').config();

var userModel = require('../models/userModel'); //Users collection
var expenseModel = require('../models/expenseModel'); //Expenses collection
var configurationModel = require('../models/configurationModel'); //Configuration collection

// Send expenses page, load current tasks
router.get('/', authenticate, async function (req, res) {

  const username = req.user.username;
  const email = req.user.email;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString('en-US', { month: 'short' });
  
  try {
    const userConfig = await configurationModel.findOne({ user: username });

    // Find the current monthly budget, fallback to default if not set
    const currentMonthlyBudgetEntry = userConfig.monthlyBudget.find(entry => entry.year === currentYear && entry.month === currentDate.getMonth() + 1);
    const currentMonthlyBudget = currentMonthlyBudgetEntry ? currentMonthlyBudgetEntry.budget : userConfig.defaultMonthlyBudget;

    // Find the current yearly budget, fallback to default if not set
    const currentYearlyBudgetEntry = userConfig.yearlyBudget.find(entry => entry.year === currentYear);
    const currentYearlyBudget = currentYearlyBudgetEntry ? currentYearlyBudgetEntry.budget : userConfig.defaultYearlyBudget;

    res.render('adjust', {
      username,
      email,
      currentYear,
      currentMonth,
      defaultMonthlyBudget: userConfig.defaultMonthlyBudget,
      defaultYearlyBudget: userConfig.defaultYearlyBudget,
      currentMonthlyBudget,
      currentYearlyBudget,
      notificationFrequency: userConfig.notificationFrequency,
      notificationChannels: userConfig.notificationChannels
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Set default monthly budget
router.post('/defaultMonthlyBudget', authenticate, async function (req, res) {

  const username = req.user.username;
  try {
    await configurationModel.updateOne({ user: username }, { defaultMonthlyBudget: req.body.defaultMonthlyBudget })
    res.redirect('/adjust');
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Set default yearly budget
router.post('/defaultYearlyBudget', authenticate, async function (req, res) {

  const username = req.user.username;
  try {
    await configurationModel.updateOne({ user: username }, { defaultYearlyBudget: req.body.defaultYearlyBudget })
    res.redirect('/adjust');
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Set current monthly budget
router.post('/currentMonthlyBudget', authenticate, async function (req, res) {

  const username = req.user.username;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  try {
    const existingDocument = await configurationModel.findOne({
      user: username,
      'monthlyBudget.year': currentYear,
      'monthlyBudget.month': currentMonth,
    });

    if (existingDocument) {
      // Update the existing document
      await configurationModel.updateOne(
        {
          user: username,
          'monthlyBudget.year': currentYear,
          'monthlyBudget.month': currentMonth,
        },
        {
          $set: { 'monthlyBudget.$.budget': req.body.currentMonthlyBudget },
        }
      );
    }
    else {
      // Create a new document with the specified monthly budget
      await configurationModel.updateOne(
        { user: username },
        {
          $push: {
            monthlyBudget: {
              year: currentYear,
              month: currentMonth,
              budget: req.body.currentMonthlyBudget,
            },
          },
        }
      );
    }
    res.redirect('/adjust');
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Set current yearly budget 
router.post('/currentYearlyBudget', authenticate, async function (req, res) {

  const username = req.user.username;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  try {
    const existingDocument = await configurationModel.findOne({
      user: username,
      'yearlyBudget.year': currentYear,
    });

    if (existingDocument) {
      // Update the existing document
      await configurationModel.updateOne(
        {
          user: username,
          'yearlyBudget.year': currentYear,
        },
        {
          $set: { 'yearlyBudget.$.budget': req.body.currentYearlyBudget },
        }
      );
    }
    else {
      // Create a new document with the specified monthly budget
      await configurationModel.updateOne(
        { user: username },
        {
          $push: {
            yearlyBudget: {
              year: currentYear,
              budget: req.body.currentYearlyBudget,
            },
          },
        }
      );
    }
    res.redirect('/adjust');
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Set custom monthly budget
router.post('/customMonthlyBudget', authenticate, async function (req, res) {

  const username = req.user.username;

  try {
    const existingDocument = await configurationModel.findOne({
      user: username,
      'monthlyBudget.year': req.body.customYear,
      'monthlyBudget.month': req.body.customMonth,
    });

    if (existingDocument) {
      // Update the existing document
      await configurationModel.updateOne(
        {
          user: username,
          'monthlyBudget.year': req.body.customYear,
          'monthlyBudget.month': req.body.customMonth,
        },
        {
          $set: { 'monthlyBudget.$.budget': req.body.customMonthlyBudget },
        }
      );
    }
    else {
      // Create a new document with the specified monthly budget
      await configurationModel.updateOne(
        { user: username },
        {
          $push: {
            monthlyBudget: {
              year: req.body.customYear,
              month: req.body.customMonth,
              budget: req.body.customMonthlyBudget,
            },
          },
        }
      );
    }
    res.redirect('/adjust');
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Set custom yearly budget
router.post('/customYearlyBudget', authenticate, async function (req, res) {

  const username = req.user.username;

  try {
    const existingDocument = await configurationModel.findOne({
      user: username,
      'yearlyBudget.year': req.body.customYear,
    });

    if (existingDocument) {
      // Update the existing document
      await configurationModel.updateOne(
        {
          user: username,
          'yearlyBudget.year': req.body.customYear,
        },
        {
          $set: { 'yearlyBudget.$.budget': req.body.customYearlyBudget },
        }
      );
    }
    else {
      // Create a new document with the specified monthly budget
      await configurationModel.updateOne(
        { user: username },
        {
          $push: {
            yearlyBudget: {
              year: req.body.customYear,
              budget: req.body.customYearlyBudget,
            },
          },
        }
      );
    }
    res.redirect('/adjust');
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Set notification frequency
router.post('/notificationFrequency', authenticate, async function (req, res) {

  const username = req.user.username;

  try {
    await configurationModel.updateOne({ user: username }, { notificationFrequency: req.body.frequency })
    res.redirect('/adjust');
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Set notification channels
router.post('/notificationChannels', authenticate, async function (req, res) {

  const username = req.user.username;

  try {
    const selectedChannels = [];

    await configurationModel.updateOne(
      { user: username },
      { $unset: { notificationTrack: 1 } }
    );
    
    if (req.body.push) {
      selectedChannels.push('push');
    }

    if (req.body.email) {
      selectedChannels.push('email');
    }
    
    await configurationModel.updateOne({ user: username }, { notificationChannels: selectedChannels });
    res.redirect('/adjust');
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;