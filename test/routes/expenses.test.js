const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const rewire = require('rewire');
const customFile = require('../../controllers/s3Controller');

const userModel = require('../../models/userModel');
const expenseModel = require('../../models/expenseModel');

const app = require('../../app');
const request = supertest(app);

describe('Expense Routes', () => {

  beforeEach(() => {
    sinon.stub(jwt, 'verify').returns({ username: 'test-user', email: 'test@example.com' });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('GET Routes', () => {

    it('should render the expenses page with expenses data', async () => {
      sinon.stub(expenseModel, 'find').returns({
        sort: sinon.stub().resolves([]),
      });

      const res = await request
        .get('/expenses')
        .expect(200);

      expect(res.text).to.include('<title>Expense Guard | Expenses</title>');
    });

  });

  describe('POST Routes', () => {

    // Add expense
    it('should add a new expense, without a file being sent', async () => {
      sinon.stub(expenseModel, 'create').resolves({});

      const res = await request
        .post('/expenses/add')
        .send({
          category: 'Groceries',
          expenseDate: '2024-02-17',
          amount: 50,
          description: 'Grocery shopping',
        });

      expect(res.status).to.equal(302);
      expect(res.header.location).to.equal('/expenses');
    });

    it('should add a new expense, with a file being sent', async () => {

      sinon.stub(customFile, 'uploadFileToS3').resolves('s3-url');
      sinon.stub(customFile, 'deleteFile').resolves();
      sinon.stub(expenseModel, 'create').resolves({});

      const res = await request
        .post('/expenses/add')
        .field('category', 'Groceries')
        .field('expenseDate', '2024-02-17')
        .field('amount', 50)
        .field('description', 'Grocery shopping')
        .attach('expenseImage', 'documents/idea images/dashboard_idea1.png');

      expect(res.status).to.equal(302);
      expect(res.header.location).to.equal('/expenses');
    });

    it('should throw an error while adding a new expense', async () => {
      sinon.stub(expenseModel, 'create').throws({ message: 'Error' });

      const res = await request
        .post('/expenses/add')
        .send({
          category: 'Groceries',
          expenseDate: '2024-02-17',
          amount: 50,
          description: 'Grocery shopping',
        });

      expect(res.status).to.equal(500);
      expect(res.text).to.include("Error when adding expense");
    });

    // Filter expenses
    it('should filter expenses based on category, fromDate, and toDate', async () => {
      sinon.stub(expenseModel, 'find').returns({
        sort: sinon.stub().resolves([]),
      });

      const res = await request
        .post('/expenses/filter')
        .send({
          category: 'Groceries',
          fromDate: '2024-02-01',
          toDate: '2024-02-17',
        })
        .expect(200);

      expect(res.text).to.include('<title>Expense Guard | Expenses</title>');
    });

    it('should filter expenses without any fields', async () => {
      sinon.stub(expenseModel, 'find').returns({
        sort: sinon.stub().resolves([]),
      });

      const res = await request
        .post('/expenses/filter')
        .expect(200);

      expect(res.text).to.include('<title>Expense Guard | Expenses</title>');
    });

    it('should throw error when filtering expenses', async () => {
      sinon.stub(expenseModel, 'find').returns({
        sort: sinon.stub().throws({ message: 'Error' }),
      });

      const res = await request
        .post('/expenses/filter')
        .send({
          category: 'Groceries',
          toDate: '2024-02-17',
        })
        .expect(500);

      expect(res.text).to.include('Internal Server Error');
    });

    // Edit expense
    it('should edit an expense without any error', async () => {
      sinon.stub(expenseModel, 'findByIdAndUpdate').resolves();

      const res = await request
        .post('/expenses/edit')
        .send({
          editExpenseId: 'expense-id',
          editCategory: 'Dining',
          editExpenseDate: '2024-02-18',
          editAmount: 30,
          editDescription: 'Dinner',
        })
        .expect(204);

      expect(res.text).to.be.empty;
    });

    it('should throw error when editing an expense', async () => {
      sinon.stub(expenseModel, 'findByIdAndUpdate').throws({ message: 'Error' });

      const res = await request
        .post('/expenses/edit')
        .send({
          editExpenseId: 'expense-id',
          editCategory: 'Dining',
          editExpenseDate: '2024-02-18',
          editAmount: 30,
          editDescription: 'Dinner',
        })
        .expect(500);

      expect(res.text).to.include('Internal Server Error');
    });

    // Delete expense
    it('should delete an expense without any error', async () => {
      sinon.stub(expenseModel, 'findOne').resolves({ expenseURL: 's3-url' });
      sinon.stub(customFile,'deleteFileFromS3').resolves();
      sinon.stub(expenseModel, 'findByIdAndDelete').resolves();

      const res = await request
        .delete('/expenses/delete/expense-id')
        .expect(204);

      expect(res.text).to.be.empty;
    });

    it('should throw error when deleting an expense with url', async () => {
      sinon.stub(expenseModel, 'findOne').resolves({ expenseURL: 's3-url' });
      sinon.stub(customFile,'deleteFileFromS3').throws({ message: 'File deletion failed' });

      const res = await request
        .delete('/expenses/delete/expense-id')
        .expect(500);

      expect(res.text).to.include('File deletion failed');
    });

    it('should throw error when deleting an expense without url', async () => {
      sinon.stub(expenseModel, 'findOne').resolves({});
      sinon.stub(expenseModel, 'findByIdAndDelete').throws({ message: 'Error' });

      const res = await request
        .delete('/expenses/delete/expense-id')
        .expect(500);

      expect(res.text).to.include('Internal Server Error');
    });

  });

});