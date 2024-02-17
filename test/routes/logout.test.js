const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const rewire = require('rewire');
const supertest = require('supertest');
const app = rewire('../../app');

const request = supertest(app);

describe('Logout Route', () => {

  describe('GET Routes', () => {

    it('should render the login page without a message and the title', async () => {
      // Assuming 'validToken' is a valid token for an authenticated user
      const res = await request.get('/logout').set('Authorization', 'Bearer validToken');
      expect(res.status).to.equal(302);
      expect(res.header.location).to.equal('/login');
    });

  });

});