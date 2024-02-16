const chai = require('chai');
const expect = chai.expect;
// const mongoose = require('mongoose');

const expenseModel = require('../../models/expenseModel');

describe('Testing Expense Model', () => {
  let sampleExpenseData;

  beforeEach(() => {
    sampleExpenseData = {
      username: 'test_user',
      category: 'Groceries',
      expenseDate: new Date(),
      amount: 50.0,
      description: 'Grocery shopping',
    };
  });

  it('should create the expense successfully when passed with all required parameters', async () => {
    let expense = new expenseModel(sampleExpenseData);

    try {
      await expense.validate();
      expect(expense.username).to.equal(sampleExpenseData.username);
      expect(expense.category).to.equal(sampleExpenseData.category);
      expect(expense.expenseDate).to.equal(sampleExpenseData.expenseDate);
      expect(expense.amount).to.equal(sampleExpenseData.amount);
    } 
    catch (err) {
      throw new Error('⚠️ Unexpected failure!');
    }
  });

  it('should not create the expense successfully when not passed with all required parameters', async () => {
    delete sampleExpenseData.category;

    let expense = new expenseModel(sampleExpenseData);

    try {
      await expense.validate();
    } 
    catch (err) {
      expect(err.errors).to.exist;
    }
  });

  it('should throw an error trying to insert an empty document', async () => {
    let expense = new expenseModel();

    try {
      await expense.validate();
    } 
    catch (err) {
      expect(err.errors.username).to.exist;
      expect(err.errors.category).to.exist;
      expect(err.errors.expenseDate).to.exist;
      expect(err.errors.amount).to.exist;
    }

  });
  
});