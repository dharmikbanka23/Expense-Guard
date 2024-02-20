const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    username: { type: String, required: true },
    category: { type: String, required: true },
    expenseDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    description: { type: String},
    expenseURL: { type: String},
});

// // Pre-save hook
// expenseSchema.pre('save', function (next) {
//     console.log('Saving expense...');
//     next(); // Call next() to proceed with the save operation
// });

// // Post-save hook
// expenseSchema.post('save', function (doc, next) {
//     console.log('Expense saved:', doc);
//     next(); // Call next() to finish the middleware chain
// });

const expenseModel = mongoose.model('expense', expenseSchema);

module.exports = expenseModel;