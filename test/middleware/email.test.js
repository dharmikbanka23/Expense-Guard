const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const sendMail = require('../../middleware/email');

describe('sendMail', () => {

  it('should send email successfully', () => {
    const email = 'test@example.com';
    const html = '<p>Test message</p>';

    // Mock nodemailer
    const nodemailer = require('nodemailer');
    sinon.stub(nodemailer, 'createTransport').returns({
      sendMail: sinon.stub().yields(null, { response: 'success' })
    });

    sendMail(email, html);

    expect(nodemailer.createTransport.calledOnce).to.be.true;
    expect(nodemailer.createTransport().sendMail.calledOnce).to.be.true;

    nodemailer.createTransport.restore();
  });

  it('should handle error in sending email', () => {
    const email = 'test@example.com';
    const html = '<p>Test message</p>';

    // Mock nodemailer
    const nodemailer = require('nodemailer');
    sinon.stub(nodemailer, 'createTransport').returns({
      sendMail: sinon.stub().yields(new Error('Error sending email'))
    });

    sendMail(email, html);

    expect(nodemailer.createTransport.calledOnce).to.be.true;
    expect(nodemailer.createTransport().sendMail.calledOnce).to.be.true;

    nodemailer.createTransport.restore();
  });

});