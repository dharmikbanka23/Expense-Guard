var express = require('express');
var router = express.Router();
var authenticate = require('../middleware/authenticateUser');
require('dotenv').config();

var userModel = require('../models/userModel'); //Users collection
var expenseModel = require('../models/expenseModel'); //Expenses collection

//Image part
const multer = require('multer');
const upload = multer({ dest: "./public/uploads" });
const customFile = require('../controllers/s3Controller');

// Send expenses page, load current tasks
router.get('/', authenticate, async function (req, res) {

  const username = req.user.username;
  let expenseRecord = await expenseModel.find({ username: username }, { username: 0, __v: 0 }).sort({ expenseDate: -1 });

  res.render('expenses', { expenseRecord: expenseRecord });
});

// Adding an expense
router.post('/add', authenticate, upload.single('expenseImage'), async function (req, res, next) {

  const username = req.user.username;
  let { category, expenseDate, amount, description } = req.body;

  // Make sure remove sensitive characters from description
  description = description.replace(/[^a-zA-Z0-9\s_\-,:;+=()]/g, " ");

  // Make sure replace the \n with space
  description = description.replace(/\r?\n/g, " ");

  let s3url = "";

  if (req.file) {
    s3url = await customFile.uploadFileToS3(username, process.env.AWS_S3_BUCKET_NAME, req.file);
    customFile.deleteFile(req.file.path);
  }

  // Creating a new expense object
  const newExpense = {
    username: username,
    category: category,
    expenseDate: expenseDate,
    amount: amount,
    description: description,
    expenseURL: s3url
  };

  try {
    // Inserting the new expense into the MongoDB collection
    let result = await expenseModel.create(newExpense);
    res.redirect('/expenses');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error when adding expense");
  }
});


//Filter the expenses
router.post('/filter', authenticate, async (req, res) => {

  const username = req.user.username;

  try {
    const { category, fromDate, toDate } = req.body;
    let filter = { username: username };

    // Add category filter if present
    if (category) {
      filter.category = category;
    }
    if (fromDate) {
      filter.expenseDate = filter.expenseDate || {};
      filter.expenseDate.$gte = new Date(fromDate).toISOString();
    }
    if (toDate) {
      filter.expenseDate = filter.expenseDate || {};
      filter.expenseDate.$lte = new Date(toDate).toISOString();
    }

    const expenseRecord = await expenseModel.find(filter, { username: 0, __v: 0 }).sort({ expenseDate: -1 });

    res.render('expenses', { expenseRecord: expenseRecord });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})


//Updating a expense
router.post('/edit', authenticate, async (req, res) => {

  try {
    // Retrieve data from the request body
    const editExpenseId = req.body.editExpenseId;
    const editCategory = req.body.editCategory;
    const editExpenseDate = req.body.editExpenseDate;
    const editAmount = req.body.editAmount;
    let editDescription = req.body.editDescription;

    // Make sure to remove sensitive characters from editDescription
    editDescription = editDescription.replace(/[^a-zA-Z0-9\s_\-,:;+=()]/g, "");

    // Update the expense in the database
    await expenseModel.findByIdAndUpdate(
      editExpenseId,
      {
        $set: {
          category: editCategory,
          expenseDate: editExpenseDate,
          amount: editAmount,
          description: editDescription,
        },
      }
    );
    res.status(204).end();
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//Deleting an expense
router.delete('/delete/:id', authenticate, async (req, res) => {

  try {
    const expenseId = req.params.id;
    const expenseRecord = await expenseModel.findOne({ _id: expenseId });

    let url = expenseRecord.expenseURL || "";

    if (url) {
      try {
        await customFile.deleteFileFromS3(url);
      }
      catch (err) {
        console.log('Error during file deletion');
        res.status(500).json({ error: 'File deletion failed' });
      }
    }

    await expenseModel.findByIdAndDelete(expenseId);
    res.status(204).end();
  }
  catch (error) {
    console.error('Error during expense deletion');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;