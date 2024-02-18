const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const supertest = require('supertest');

let app = require('../../app');
const request = supertest(app);

describe('Error Route', () => {

  it('should render the error page when accessing a non existing route', async () => {

    const res = await request
      .get('/errors');
    expect(res.status).to.equal(404);
    expect(res.text).to.include('<title>Expense Guard | Error</title>');

  });

  it('should render the error page when accessing a existing bad route', async () => {

    // Simulate 'test' environment
    const originalEnv = app.get('env');
    app.set('env', 'test');

    const res = await request
      .get('/error/bad');
    expect(res.status).to.equal(500);
    expect(res.text).to.include('<title>Expense Guard | Error</title>');

    // Restore the original environment
    app.set('env', originalEnv);

  });

});