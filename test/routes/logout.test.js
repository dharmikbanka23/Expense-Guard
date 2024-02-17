const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const rewire = require('rewire');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');

let app = require('../../app');
const request = supertest(app);

describe('Logout Route', () => {

  beforeEach(() => {
    sinon.stub(jwt, 'verify').returns({ username: 'test-user', email: 'test@example.com' });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('GET Routes', () => {

    it('should render the login page without a message and the title', async () => {

      const res = await request
        .get('/logout');
      expect(res.status).to.equal(302);
      expect(res.header.location).to.equal('/login');

    });

  });

});