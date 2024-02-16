const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const nodemailer = require('nodemailer');

const sendMail = require('../../middleware/email');

describe('Mail Middleware', () => {

  it('should send email successfully', () => {
    const email = 'test@example.com';
    const html = '<p>Test message</p>';

    // Mock nodemailer
    let stub = sinon.stub(nodemailer, 'createTransport').returns({
      sendMail: sinon.stub().yields(null, { response: 'success' })
    });

    sendMail(email, html);

    expect(stub.calledOnce).to.be.true;
    expect(stub().sendMail.calledOnce).to.be.true;

    stub.restore();
  });

  it('should handle error in sending email', () => {
    const email = 'test@example.com';
    const html = '<p>Test message</p>';

    // Mock nodemailer
    let stub = sinon.stub(nodemailer, 'createTransport').returns({
      sendMail: sinon.stub().yields(new Error('Error sending email'))
    });

    sendMail(email, html);

    expect(stub.calledOnce).to.be.true;
    expect(stub().sendMail.calledOnce).to.be.true;

    stub.restore();
  });

});