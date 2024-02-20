const mongoose = require('mongoose');

const configurationSchema = new mongoose.Schema({
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
})

// // Pre-save hook
// configurationSchema.pre('save', function (next) {
//     console.log('Saving configuration...');
//     next(); // Call next() to proceed with the save operation
// });

// // Post-save hook
// configurationSchema.post('save', function (doc, next) {
//     console.log('Expense configuration:', doc);
//     next(); // Call next() to finish the middleware chain
// });

const configurationModel = mongoose.model('configuration', configurationSchema);

module.exports = configurationModel;