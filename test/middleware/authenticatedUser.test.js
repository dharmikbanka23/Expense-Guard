const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const jwt = require('jsonwebtoken');

const authenticated = require('../../middleware/authenticatedUser');

describe('Authenticated Middleware', () => {
  it('should redirect to / for a valid token', () => {
    // Arrange
    const req = { cookies: { token: 'test_token' } };
    const res = { redirect: sinon.spy() };  // Spy on the redirect function
    const next = sinon.spy();

    // Stubbing jwt.verify to return a true object
    const jwtStub = sinon.stub(jwt, 'verify').returns({ someData: 'example' });

    // Calling the function
    authenticated(req, res, next);

    // Assert
    expect(res.redirect).to.have.been.calledOnceWith('/');
    expect(next).to.not.have.been.called;  // Ensure next() was not called

    // Restore the stub to avoid side effects in other tests
    jwtStub.restore();
  });

  it('should call next() for an invalid token', () => {
    // Arrange
    const req = { cookies: { token: 'invalid_token' } };
    const res = {};
    const next = sinon.spy();  // Spy on the next function

    // Stubbing jwt.verify to throw an error
    const jwtStub = sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

    // Calling the function
    authenticated(req, res, next);

    // Assert
    expect(next).to.have.been.calledOnce;

    // Restore the stub to avoid side effects in other tests
    jwtStub.restore();
  });

  it('should call next() for missing token', () => {
    // Arrange
    const req = { cookies: {} };  // No token provided
    const res = {};
    const next = sinon.spy();  // Spy on the next function

    // Calling the function
    authenticated(req, res, next);

    // Assert
    expect(next).to.have.been.calledOnce;
  });
});