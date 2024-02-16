const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const jwt = require('jsonwebtoken');

const authenticate = require('../../middleware/authenticateUser');

describe('Authentication Middleware', () => {
  it('should return true for a valid token', () => {

    const validToken = 'test_token';
    const cookies = { token: validToken };

    // Stubbing jwt.verify to return a true object
    const jwtStub = sinon.stub(jwt, 'verify').returns({ someData: 'example' });

    // Calling the function
    const result = authenticate(cookies);

    // Assert
    expect(result).to.be.true;

    // Restore the stub to avoid side effects in other tests
    jwtStub.restore();
  });

  it('should return false for an invalid token', () => {
    // Arrange
    const invalidToken = 'invalid_token';
    const cookies = { token: invalidToken };

    // Stubbing jwt.verify to throw an error
    const jwtStub = sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

    // Calling the function
    const result = authenticate(cookies);

    // Assert
    expect(result).to.be.false;

    // Restore the stub to avoid side effects in other tests
    jwtStub.restore();
  });

  it('should return false for missing token', () => {
    // Arrange
    const cookies = {}; // No token provided

    // Act
    const result = authenticate(cookies);

    // Assert
    expect(result).to.be.false;
  });
});