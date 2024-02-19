const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const rewire = require('rewire');
const supertest = require('supertest');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../../models/userModel');
const configurationModel = require('../../models/configurationModel');
const gmail = require('../../controllers/mailController');

let app = rewire('../../app');
const request = supertest(app);

describe('Register Route', () => {

  describe('GET Routes', () => {

    it('should render the register page without a message', async () => {
      const res = await request.get('/register');
      expect(res.status).to.equal(200);
      expect(res.text).to.include('<title>Expense Guard | Register</title>');
    });

  });

  describe('POST Routes', () => {

    beforeEach(() => {
      sinon.stub(gmail, 'sendMail').resolves();
    })
    
    afterEach(() => {
      sinon.restore();
    });

    it('should redirect to /dashboard with valid registration data', async () => {
      sinon.stub(userModel, 'findOne').resolves(null);
      sinon.stub(userModel, 'create').resolves({ username: 'test-user', email: 'test@example.com', password: 'hashedPassword' });
      sinon.stub(configurationModel, 'create').resolves();
      sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
      sinon.stub(jwt, 'sign').returns('fakeToken');

      const res = await request
        .post('/register')
        .send({ username: 'test-user', email: 'test@example.com', password: 'test-password' });

      expect(res.status).to.equal(302);
      expect(res.header.location).to.equal('/dashboard');
    });

    it('should render the register page with an error message for existing username', async () => {

      sinon.stub(userModel, 'findOne').withArgs({ username: 'test-user' }).resolves({ username: 'test-user', email: 'test@example.com', password: 'hashedPassword' });

      const res = await request
        .post('/register')
        .send({ username: 'test-user', email: 'test@example.com', password: 'test-password' });

      expect(res.status).to.equal(200);
      expect(res.text).to.include('Username already exists');
    });

    it('should render the register page with an error message for existing email', async () => {
      sinon.stub(userModel, 'findOne').withArgs({ email: 'test@example.com' }).resolves({ username: 'test-user', email: 'test@example.com', password: 'hashedPassword' });

      const res = await request
        .post('/register')
        .send({ username: 'new-user', email: 'test@example.com', password: 'test-password' });

      expect(res.status).to.equal(200);
      expect(res.text).to.include('Email already exists');
    });

    it('should render the register page with an error message for other errors during registration', async () => {

      sinon.stub(userModel, 'findOne').resolves(null);
      sinon.stub(userModel, 'create').throws(new Error('Some error during findOne'));

      const res = await request
        .post('/register')
        .send({ username: 'test-user', email: 'test@example.com', password: 'test-password' });

      expect(res.status).to.equal(200);
      expect(res.text).to.include('Try again after sometime');
    });

  });

});