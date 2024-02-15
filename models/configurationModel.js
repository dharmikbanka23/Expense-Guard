const mongoose = require('mongoose');

const configurationModel = mongoose.model('configuration', new mongoose.Schema({
    user: { type: String, required: true },
    defaultMonthlyBudget: { type: Number, default: 20000 },
    defaultYearlyBudget: { type: Number, default: 240000 },
    yearlyBudget: [
        {
            year: { type: Number, required: true },
            budget: { type: Number, required: true },
        }
    ],
    monthlyBudget: [
        {
            year: { type: Number, required: true },
            month: { type: Number, required: true },
            budget: { type: Number, required: true },
        }
    ],
    notificationFrequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
    notificationChannels: { type: [String], default: ['push', 'email'] },
    notificationTrack: { type: Date },
}));

module.exports = configurationModel;