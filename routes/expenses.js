var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var authenticate = require('../middleware/authenticateUser');
require('dotenv').config();

var userModel = require('../models/userModel'); //Users collection
var expenseModel = require('../models/expenseModel'); //Expenses collection

//Image part
const multer = require('multer');
const upload = multer({ dest: "./public/uploads" });
const { deleteFile, uploadFileToS3, deleteFileFromS3 } = require('../services/s3upload');

// Send expenses page, load current tasks
router.get('/', async function (req, res, next) {
  if (!authenticate(req.cookies)) { return res.redirect('/login') }

  const username = jwt.decode(req.cookies.token).username;
  let expenseRecord = await expenseModel.find({ username: username }, { username: 0, __v: 0 }).sort({ expenseDate: -1 });

  res.render('expenses', { expenseRecord: expenseRecord });
});

// Adding an expense
router.post('/add', upload.single('expenseImage'), async function (req, res, next) {
  // Assuming authenticate function checks the user's authentication status
  if (!authenticate(req.cookies)) { return res.redirect('/login'); }

  const username = jwt.decode(req.cookies.token).username;
  const { category, expenseDate, amount, description } = req.body;

  let s3url = "";
  
  if (req.file){
    s3url = await uploadFileToS3(username, process.env.AWS_S3_BUCKET_NAME, req.file);
    deleteFile(req.file.path);
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
router.post('/filter', async (req, res) => {
  if (!authenticate(req.cookies)) { return res.redirect('/login') }

  try {
    const username = jwt.decode(req.cookies.token).username;
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
router.post('/edit', async (req, res) => {
  if (!authenticate(req.cookies)) { return res.redirect('/login') }

  try {
    // Retrieve data from the request body
    const editExpenseId = req.body.editExpenseId;
    const editCategory = req.body.editCategory;
    const editExpenseDate = req.body.editExpenseDate;
    const editAmount = req.body.editAmount;
    const editDescription = req.body.editDescription;

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
router.delete('/delete/:id', async (req, res) => {
  if (!authenticate(req.cookies)) { return res.redirect('/login') }

  try {
    const expenseId = req.params.id;
    const expenseRecord = await expenseModel.findOne({_id: expenseId});

    let url = expenseRecord.expenseURL || "";

    if (url){
      try {
        await deleteFileFromS3(url);
      } catch (err) {
        console.error('Error deleting file:', err);
      }    
    }

    await expenseModel.findByIdAndDelete(expenseId);
    res.status(204).end();
  }
  catch (error) {
    console.error('Error during expense deletion:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;