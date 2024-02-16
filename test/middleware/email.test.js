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

  it('should send email successfully', () => {
    // Stubbing transporter.sendMail
    const stub = sinon.stub(nodemailer, 'createTransport').callsFake(() => ({
      sendMail: (options, callback) => callback(null, { response: 'Email sent successfully' }),
    }));

    // Call the function
    sendMail(email, html, (err, info) => {
      expect(err).to.be.null;
      expect(info.response).to.equal('Email sent successfully');
    });

    // Restore the stub
    stub.restore();
  });

  it('should handle email sending error', () => {
    // Stubbing transporter.sendMail to simulate an error
    const stub = sinon.stub(nodemailer, 'createTransport').callsFake(() => ({
      sendMail: (options, callback) => callback(new Error('Email sending failed'), null),
    }));

    // Call the function
    sendMail(email, html, (err, info) => {
      expect(err).to.be.an.instanceOf(Error);
      expect(info).to.be.null;
      expect(err.message).to.equal('Email sending failed');
    });

    // Restore the stub
    stub.restore();
  });
});