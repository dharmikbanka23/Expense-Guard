// test/controllers/notificationController.test.js

const chai = require('chai');
const expect = chai.expect;

const sendNotification = require('../../controllers/notificationController');

describe('sendNotification function', () => {
  it('should send email notification for daily frequency', () => {
    const email = 'test@example.com';
    const configuration = {
      notificationFrequency: 'daily',
      notificationChannels: ['email'],
    };
    const expenses = [];

    // Mock the sendMail function
    const sendMailMock = (sentEmail, content) => {
      // Add assertions or mock checks here
      expect(sentEmail).to.equal(email);
      // Add more assertions based on your requirements
    };

    // Replace the original sendMail with the mock function
    const originalSendMail = require('../../middleware/email');
    require.cache[require.resolve('../../middleware/email')].exports = sendMailMock;

    // Call the function to be tested
    sendNotification(email, configuration, expenses);

    // Reset the original sendMail
    require.cache[require.resolve('../../middleware/email')].exports = originalSendMail;
  });
});
