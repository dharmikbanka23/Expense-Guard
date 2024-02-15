const mongoose = require('mongoose');

const expenseModel = mongoose.model('expense', new mongoose.Schema({
    username: { type: String, required: true },
    category: { type: String, required: true },
    expenseDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    description: { type: String},
    expenseURL: { type: String},
}));

module.exports = expenseModel;