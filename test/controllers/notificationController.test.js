const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const rewire = require('rewire');
const sandbox = sinon.createSandbox();

let notificationController = rewire('../../controllers/notificationController');
// const sendMail = notificationController.__get__('sendMail');  // Storing the private sendMail function for future

describe('Notification Controller', () => {
  let sendMailStub;

  beforeEach(() => {
    sendMailStub = sandbox.stub().resolves();
    notificationController.__set__('sendMail', sendMailStub);
  });

  afterEach(() => {
    notificationController = rewire('../../controllers/notificationController');
    sandbox.restore();
  });

  const today = new Date();
  const dayToday = new Date().getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  describe('Daily Notifications', () => {

    // Define the parameters
    const email = 'test@example.com';
    const expenses = [{user: 'test-user', amount: 90*dayToday/daysInMonth, category: 'test-category', expenseDate: new Date()}];

    it('should send email notification daily if notificationTrack not present', async() => {
      // Define the dynamic parameters
      const configuration = {
        notificationFrequency: 'daily',
        notificationChannels: ['email'],
        monthlyBudget: [],
        defaultMonthlyBudget: 0.1,
      };

      // Call the function you want to test
      await notificationController(email, configuration, expenses);

      // Assert that sendMailStub was called once
      expect(sendMailStub).to.have.been.calledOnce;
    });

    it('should send email notification daily if notificationTrack is present other day', async() => {
      // Define the dynamic parameters
      const configuration = {
        notificationFrequency: 'daily',
        notificationChannels: ['email'],
        notificationTrack: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        monthlyBudget: [],
        defaultMonthlyBudget: 100,
      };
      // Call the function you want to test
      await notificationController(email, configuration, expenses);

      // Assert that sendMailStub was called once
      expect(sendMailStub).to.have.been.calledOnce;
    });

    it('should not send email notification daily if notificationTrack is present same day', async() => {
      // Define the dynamic parameters
      const configuration = {
        notificationFrequency: 'daily',
        notificationChannels: ['email'],
        notificationTrack: new Date().toISOString(),
        monthlyBudget: [],
        defaultMonthlyBudget: 1000,
      };
      // Call the function you want to test
      await notificationController(email, configuration, expenses);

      // Assert that sendMailStub was called none
      expect(sendMailStub).not.to.have.been.called;
    });

    it('should  not send email notification daily if email not present', async() => {
      // Define the dynamic parameters
      const configuration = {
        notificationFrequency: 'daily',
        notificationChannels: ['push'],
        monthlyBudget: [],
        defaultMonthlyBudget: 1000,
      };

      // Call the function you want to test
      await notificationController(email, configuration, expenses);

      // Assert that sendMailStub was called once
      expect(sendMailStub).not.to.have.been.calledOnce;
    });

  });

  describe('Weekly Notifications', () => {
    // Define the parameters
    const email = 'test@example.com';
    const expenses = [];

    it('should send email notification weekly if notificationTrack not present', async() => {
      // Define the dynamic parameters
      const configuration = {
        notificationFrequency: 'weekly',
        notificationChannels: ['email'],
        monthlyBudget: [{year: today.getFullYear(), month: today.getMonth() + 1, amount: 100}],
        defaultMonthlyBudget: 1000,
      };

      // Call the function you want to test
      await notificationController(email, configuration, expenses);

      // Assert that sendMailStub was called once
      expect(sendMailStub).to.have.been.calledOnce;
    });

    it('should send email notification weekly if notificationTrack is present other day in week', async() => {
      // Define the dynamic parameters
      const configuration = {
        notificationFrequency: 'weekly',
        notificationChannels: ['email'],
        notificationTrack: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
        monthlyBudget: [],
        defaultMonthlyBudget: 1000,
      };
      // Call the function you want to test
      await notificationController(email, configuration, expenses);

      // Assert that sendMailStub was called once
      expect(sendMailStub).to.have.been.calledOnce;
    });

    it('should not send email notification daily if notificationTrack is present same day in week', async() => {
      // Define the dynamic parameters
      const configuration = {
        notificationFrequency: 'weekly',
        notificationChannels: ['email'],
        notificationTrack: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
        monthlyBudget: [],
        defaultMonthlyBudget: 1000,
      };
      // Call the function you want to test
      await notificationController(email, configuration, expenses);

      // Assert that sendMailStub was called none
      expect(sendMailStub).not.to.have.been.called;
    });

    it('should not send email notification weekly if email not present', async() => {
      // Define the dynamic parameters
      const configuration = {
        notificationFrequency: 'weekly',
        notificationChannels: ['push'],
        monthlyBudget: [],
        defaultMonthlyBudget: 1000,
      };

      // Call the function you want to test
      await notificationController(email, configuration, expenses);

      // Assert that sendMailStub was called once
      expect(sendMailStub).not.to.have.been.calledOnce;
    });

  });

});