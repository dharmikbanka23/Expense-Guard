const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const rewire = require('rewire');
const supertest = require('supertest');
const app = rewire('../../app');

const userModel = require('../../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const request = supertest(app);

describe('Login Route', () => {

  describe('GET Routes', () => {

    it('should render the login page without a message and the title', async () => {
      const res = await request.get('/login');
      expect(res.status).to.equal(200);
      expect(res.text).to.include('<title>Expense Guard | Login</title>');
    });

  });

  describe('POST Routes', () => {

    afterEach(() => {
      sinon.restore();
    });

    it('should redirect to /dashboard with a valid username and password', async () => {

      sinon.stub(userModel, 'findOne').resolves({ username: 'test-user', email: 'test@example.com', password: 'hashedPassword' });
      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(jwt, 'sign').returns('fakeToken');
      sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

      const res = await supertest(app)
        .post('/login')
        .send({ user: 'test-user', password: 'test-password' });

      expect(res.status).to.equal(302);
      expect(res.header.location).to.equal('/dashboard');

      // Check if at least one element in the set-cookie array includes the expected string
      const setCookieHeader = res.headers['set-cookie'];
      expect(setCookieHeader).to.be.an('array').that.is.not.empty;
      expect(setCookieHeader.some(cookie => cookie.includes('token=fakeToken'))).to.be.true;

    });

    it('should redirect to /dashboard with a valid email and password', async () => {

      sinon.stub(userModel, 'findOne').resolves({ username: 'test-user', email: 'test@example.com', password: 'hashedPassword' });
      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(jwt, 'sign').returns('fakeToken');
      sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

      const res = await supertest(app)
        .post('/login')
        .send({ user: 'test@example.com', password: 'test-password' });

      expect(res.status).to.equal(302);
      expect(res.header.location).to.equal('/dashboard');

      // Check if at least one element in the set-cookie array includes the expected string
      const setCookieHeader = res.headers['set-cookie'];
      expect(setCookieHeader).to.be.an('array').that.is.not.empty;
      expect(setCookieHeader.some(cookie => cookie.includes('token=fakeToken'))).to.be.true;

    });

    it('should render the login page with an error message for invalid credentials', async () => {

      sinon.stub(userModel, 'findOne').resolves(null);
      sinon.stub(bcrypt, 'compare').resolves(false);
      sinon.stub(jwt, 'sign').throws(new Error('Invalid token'));
      sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

      const res = await supertest(app)
        .post('/login')
        .send({ user: 'invalid-user', password: 'invalid-password' });

      expect(res.status).to.equal(200);
      expect(res.text).to.include('Invalid user or password');
      expect(res.text).to.include('<title>Expense Guard | Login</title>');
    });

  });

});