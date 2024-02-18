const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');

const userModel = require('../../models/userModel');
const expenseModel = require('../../models/expenseModel');
const configurationModel = require('../../models/configurationModel');

let app = require('../../app');
const request = supertest(app);

describe('Statistics Route', () => {

  beforeEach(() => {
    sinon.stub(jwt, 'verify').returns({ username: 'test-user', email: 'test@example.com' });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should render the statistics page with expenses and configuration data', async () => {

    sinon.stub(expenseModel, 'find').returns({
      sort: sinon.stub().returns({
        limit: sinon.stub().resolves([]),
      }),
    })

    sinon.stub(configurationModel, 'findOne').resolves();

    const res = await request
      .get('/statistics')
      .expect(200);
    expect(res.text).to.include('<title>Expense Guard | Statistics</title>');

  });
});