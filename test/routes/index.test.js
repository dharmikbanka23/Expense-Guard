const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const rewire = require('rewire');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');

const expenseModel = require('../../models/expenseModel');
const configurationModel = require('../../models/configurationModel');

let app = require('../../app');
const request = supertest(app);

describe('Index Route', () => {

  // Mock the sendNotification function globally before requiring any module that uses it
  before(() => {
    sinon.stub(jwt, 'verify').returns({ username: 'test-user', email: 'test@example.com' });
  });

  // After all tests, restore the original sendNotification function
  after(() => {
    sinon.restore();
  });

  describe('GET Routes', () => {
  
    it('should render the dashboard page', async () => {

      // Stubbing the functions
      sinon.stub(expenseModel, 'find').returns({
        sort: sinon.stub().returns({
          limit: sinon.stub().resolves([]),
        }),
      });

      sinon.stub(configurationModel, 'findOne').resolves({});
      sinon.stub(configurationModel, 'updateOne').resolves([]);

      const res = await request
        .get('/dashboard')

      expect(res.status).to.equal(200);
      expect(res.text).to.include('<title>Expense Guard | Dashboard</title>');
      
    });

  });
});