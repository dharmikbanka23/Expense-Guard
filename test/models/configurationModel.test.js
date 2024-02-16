const chai = require('chai');
const expect = chai.expect;
// const mongoose = require('mongoose');

const configurationModel = require('../../models/configurationModel');

describe('Testing Configuration Model', () => {
  let sampleConfigurationData;

  beforeEach(() => {
    sampleConfigurationData = {
      user: 'test_user',
      defaultMonthlyBudget: 20000,
      defaultYearlyBudget: 240000,
      yearlyBudget: [
        {
          year: 2022,
          budget: 25000,
        },
      ],
      monthlyBudget: [
        {
          year: 2022,
          month: 1,
          budget: 2000,
        },
      ],
      notificationFrequency: 'daily',
      notificationChannels: ['push', 'email'],
      notificationTrack: new Date(),
    };
  });

  it('should create the configuration successfully when passed with all required parameters', async () => {
    let configuration = new configurationModel(sampleConfigurationData);

    try {
      await configuration.validate();
      expect(configuration.user).to.equal(sampleConfigurationData.user);
      expect(configuration.defaultMonthlyBudget).to.equal(sampleConfigurationData.defaultMonthlyBudget);
      expect(configuration.yearlyBudget[0].year).to.equal(sampleConfigurationData.yearlyBudget[0].year);
    } 
    catch (err) {
      throw new Error('⚠️ Unexpected failure!');
    }
  });

  it('should not create the configuration successfully when not passed with all required parameters', async () => {
    delete sampleConfigurationData.user;

    let configuration = new configurationModel(sampleConfigurationData);

    try {
      await configuration.validate();
    } 
    catch (err) {
      expect(err.errors).to.exist;
    }
  });

  it('should throw an error trying to insert an empty document', async () => {
    let configuration = new configurationModel();

    try {
      await configuration.validate();
    }
    catch (err) {
      expect(err.errors).to.exist; 
      expect(err.errors.user).to.exist;
      expect(err.errors.defaultMonthlyBudget).to.be.undefined;
      expect(err.errors.defaultYearlyBudget).to.be.undefined; 
    }
  });
});