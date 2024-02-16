const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const nodemailer = require('nodemailer');
chai.use(sinonChai);

const sendMail = require('../../middleware/email');

describe('Email Middleware', () => {
  const email = 'test_email@gmail.com';
  const html = '<p> Sample Content </p>';

  let stub;

  beforeEach(() => {
    stub = sinon.stub(nodemailer, 'createTransport');
  });
  
  afterEach(() => {
    stub.restore();
  })  

  it('should send email successfully', () => {
    // Stubbing transporter.sendMail
    stub.callsFake(() => ({
      sendMail: (options, callback) => callback(null, { response: 'Email sent successfully' }),
    }));

    // Call the function
    sendMail(email, html, (err, info) => {
      expect(err).to.be.null;
      expect(info.response).to.equal('Email sent successfully');
    });
  });

  it('should handle email sending error', () => {
    // Stubbing transporter.sendMail to simulate an error
    stub.callsFake(() => ({
      sendMail: (options, callback) => callback(new Error('Email sending failed'), null),
    }));

    // Call the function
    sendMail(email, html, (err, info) => {
      expect(err).to.be.an.instanceOf(Error);
      expect(info).to.be.null;
      expect(err.message).to.equal('Email sending failed');
    });

  });
});