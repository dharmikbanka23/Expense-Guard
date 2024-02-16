const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
// const ValidationError = mongoose.Error.ValidationError;

const userModel = require('../../models/userModel');

describe('Testing User Model', () => {
  let sampleUserVal;

  beforeEach(() => {
    sampleUserVal = {
      username: 'test_user',
      password: 'test_password',
      email: 'test@example.com',
    };
  });

  it('should create the user successfully when passed with all required parameters', async () => {
    let user = new userModel(sampleUserVal);

    try {
      await user.validate();
      expect(user.username).to.equal(sampleUserVal.username);
      expect(user.email).to.equal(sampleUserVal.email);
    } 
    catch (err) {
      throw new Error('⚠️ Unexpected failure!');
    }
  });

  it('should not create the user successfully when not passed with all required parameters', async () => {
    delete sampleUserVal.username;

    let user = new userModel(sampleUserVal);

    try {
      await user.validate();
    } 
    catch (err) {
      expect(err).to.exist;
    }
  });

  it('should throw an error due to missing fields', async () => {
    let user = new userModel();

    try {
      await user.validate();
    } 
    catch (err) {
      expect(err.errors.username).to.exist;
      expect(err.errors.password).to.exist;
      expect(err.errors.email).to.exist;
    }
  });

});