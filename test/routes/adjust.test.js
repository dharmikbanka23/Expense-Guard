const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');

const configurationModel = require('../../models/configurationModel');
const app = require('../../app');
const request = supertest(app);

describe('Adjust Route', () => {

  beforeEach(() => {
    sinon.stub(jwt, 'verify').returns({ username: 'test-user', email: 'test@example.com' });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('GET Route', () => {

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    it('should render the adjust page with current month and current year in config', async () => {
      sinon.stub(configurationModel, 'findOne').resolves({
        monthlyBudget: [
          { year: currentYear, month: currentMonth, budget: 500 },
        ],
        yearlyBudget: [
          { year: currentYear, budget: 6000 },
        ],
        defaultMonthlyBudget: 400,
        defaultYearlyBudget: 5000,
        notificationFrequency: 'daily',
        notificationChannels: ['email'],
      });

      const res = await request
        .get('/adjust')
        .expect(200);

      expect(res.text).to.include('<title>Expense Guard | Adjust</title>');
    });

    it('should render the adjust page without current month and current year in config', async () => {
      sinon.stub(configurationModel, 'findOne').resolves({
        monthlyBudget: [],
        yearlyBudget: [],
        defaultMonthlyBudget: 400,
        defaultYearlyBudget: 5000,
        notificationFrequency: 'daily',
        notificationChannels: ['email'],
      });

      const res = await request
        .get('/adjust')
        .expect(200);

      expect(res.text).to.include('<title>Expense Guard | Adjust</title>');
    });

    it('should throw an error when rendering the adjust page', async () => {

      sinon.stub(configurationModel, 'findOne').throws({ message: 'Error' });
      const res = await request
        .get('/adjust')
        .expect(500);

      expect(res.text).to.include('Internal Server Error');
    });

  });

  describe('POST Routes', () => {

    // Set default monthly budget
    it('should update default monthly budget without any error', async () => {
      sinon.stub(configurationModel, 'updateOne').resolves();
      const res = await request
        .post('/adjust/defaultMonthlyBudget')
        .send({ defaultMonthlyBudget: 500 });

      expect(res.status).to.equal(302);
      expect(res.header.location).to.equal('/adjust');
    });

    it('should throw error when updating default monthly budget', async () => {
      sinon.stub(configurationModel, 'updateOne').throws({ message: 'Error' });
      const res = await request
        .post('/adjust/defaultMonthlyBudget')
        .send({ defaultMonthlyBudget: 500 });

      expect(res.status).to.equal(500);
      expect(res.text).to.include('Internal Server Error');
    });

    // Set default yearly budget
    it('should update default yearly budget without any error', async () => {
      sinon.stub(configurationModel, 'updateOne').resolves();
      const res = await request
        .post('/adjust/defaultYearlyBudget')
        .send({ defaultYearlyBudget: 500 });

      expect(res.status).to.equal(302);
      expect(res.header.location).to.equal('/adjust');
    });

    it('should throw error when updating default yearly budget', async () => {
      sinon.stub(configurationModel, 'updateOne').throws({ message: 'Error' });
      const res = await request
        .post('/adjust/defaultYearlyBudget')
        .send({ defaultYearlyBudget: 500 });

      expect(res.status).to.equal(500);
      expect(res.text).to.include('Internal Server Error');
    });

    // Set current monthly budget
    it('should update current monthly budget without any error', async () => {
      sinon.stub(configurationModel, 'findOne').resolves({});
      sinon.stub(configurationModel, 'updateOne').resolves();

      const res = await request
        .post('/adjust/currentMonthlyBudget')
        .send({ currentMonthlyBudget: 1500 });

      expect(res.status).to.equal(302);
      expect(res.header.location).to.equal('/adjust');
    });

    it('should create new document for current monthly budget without any error', async () => {
      sinon.stub(configurationModel, 'findOne').resolves(null);
      sinon.stub(configurationModel, 'updateOne').resolves();

      const res = await request
        .post('/adjust/currentMonthlyBudget')
        .send({ currentMonthlyBudget: 1500 });

      expect(res.status).to.equal(302);
      expect(res.header.location).to.equal('/adjust');
    });

    it('should throw error when updating current monthly budget', async () => {
      sinon.stub(configurationModel, 'findOne').throws({ message: 'Error' });

      const res = await request
        .post('/adjust/currentMonthlyBudget')
        .send({ currentMonthlyBudget: 1500 });

      expect(res.status).to.equal(500);
      expect(res.text).to.include('Internal Server Error');
    });

    // Set current yearly budget
    it('should update current yearly budget without any error', async () => {
      sinon.stub(configurationModel, 'findOne').resolves({});
      sinon.stub(configurationModel, 'updateOne').resolves();

      const res = await request
        .post('/adjust/currentYearlyBudget')
        .send({ currentYearlyBudget: 1500 });

      expect(res.status).to.equal(302);
      expect(res.header.location).to.equal('/adjust');
    });

    it('should create new document for current yearly budget without any error', async () => {
      sinon.stub(configurationModel, 'findOne').resolves(null);
      sinon.stub(configurationModel, 'updateOne').resolves();

      const res = await request
        .post('/adjust/currentYearlyBudget')
        .send({ currentYearlyBudget: 1500 });

      expect(res.status).to.equal(302);
      expect(res.header.location).to.equal('/adjust');

    });

    it('should throw error when updating current yearly budget', async () => {
      sinon.stub(configurationModel, 'findOne').throws({ message: 'Error' });

      const res = await request
        .post('/adjust/currentYearlyBudget')
        .send({ currentYearlyBudget: 1500 });

      expect(res.status).to.equal(500);
      expect(res.text).to.include('Internal Server Error');

    });

    // Set custom monthly budget
    it('should update custom monthly budget without any error', async () => {
      sinon.stub(configurationModel, 'findOne').resolves({});
      sinon.stub(configurationModel, 'updateOne').resolves();

      const res = await request
        .post('/adjust/customMonthlyBudget')
        .send({ customMonthlyBudget: 1500 });

      expect(res.status).to.equal(302);
      expect(res.header.location).to.equal('/adjust');
    });

    it('should create new document for custom monthly budget without any error', async () => {
      sinon.stub(configurationModel, 'findOne').resolves(null);
      sinon.stub(configurationModel, 'updateOne').resolves();

      const res = await request
        .post('/adjust/customMonthlyBudget')
        .send({ customMonthlyBudget: 1500 });

      expect(res.status).to.equal(302);
      expect(res.header.location).to.equal('/adjust');
    });

    it('should throw error when updating custom monthly budget', async () => {
      sinon.stub(configurationModel, 'findOne').throws({ message: 'Error' });

      const res = await request
        .post('/adjust/customMonthlyBudget')
        .send({ customMonthlyBudget: 1500 });

      expect(res.status).to.equal(500);
      expect(res.text).to.include('Internal Server Error');
    });

    // Set custom yearly budget
    it('should update custom yearly budget without any error', async () => {
      sinon.stub(configurationModel, 'findOne').resolves({});
      sinon.stub(configurationModel, 'updateOne').resolves();

      const res = await request
        .post('/adjust/customYearlyBudget')
        .send({ customYearlyBudget: 1500 });

      expect(res.status).to.equal(302);
      expect(res.header.location).to.equal('/adjust');
    });

    it('should create new document for custom yearly budget without any error', async () => {
      sinon.stub(configurationModel, 'findOne').resolves(null);
      sinon.stub(configurationModel, 'updateOne').resolves();

      const res = await request
        .post('/adjust/customYearlyBudget')
        .send({ customYearlyBudget: 1500 });

      expect(res.status).to.equal(302);
      expect(res.header.location).to.equal('/adjust');

    });

    it('should throw error when updating custom yearly budget', async () => {
      sinon.stub(configurationModel, 'findOne').throws({ message: 'Error' });

      const res = await request
        .post('/adjust/customYearlyBudget')
        .send({ customYearlyBudget: 1500 });

      expect(res.status).to.equal(500);
      expect(res.text).to.include('Internal Server Error');

    });

    // Set notification frequency
    it('should update notification frequency without any error', async () => {

      sinon.stub(configurationModel, 'updateOne').resolves();

      const res = await request
        .post('/adjust/notificationFrequency')
        .send({ notificationFrequency: 1500 });

      expect(res.status).to.equal(302);
      expect(res.header.location).to.equal('/adjust');
    });

    it('should throw error when updating notification frequency', async () => {

      sinon.stub(configurationModel, 'updateOne').throws({ message: 'Error' });

      const res = await request
        .post('/adjust/notificationFrequency')
        .send({ notificationFrequency: 1500 });

      expect(res.status).to.equal(500);
      expect(res.text).to.include('Internal Server Error');
    });

    // Set notification channels
    it('should update notification channels without any error', async () => {

      sinon.stub(configurationModel, 'updateOne').resolves();

      const res = await request
        .post('/adjust/notificationChannels')
        .send({ push: "push", email: "email" });

      expect(res.status).to.equal(302);
      expect(res.header.location).to.equal('/adjust');
    });

    it('should update notification channels without any error but skip the if cases', async () => {

      sinon.stub(configurationModel, 'updateOne').resolves();

      const res = await request
        .post('/adjust/notificationChannels')

      expect(res.status).to.equal(302);
      expect(res.header.location).to.equal('/adjust');
    });

    it('should throw error when updating notification channels', async () => {

      sinon.stub(configurationModel, 'updateOne').throws({ message: 'Error' });

      const res = await request
        .post('/adjust/notificationChannels')
        .send({ push: "push", email: "email" });

      expect(res.status).to.equal(500);
      expect(res.text).to.include('Internal Server Error');
    });

  });

});