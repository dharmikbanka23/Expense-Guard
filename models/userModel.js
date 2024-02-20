const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    registrationDate: { type: Date, default: Date.now },
});

// // Pre-save hook
// userSchema.pre('save', function (next) {
//     console.log('Saving user...');
//     next(); // Call next() to proceed with the save operation
// });

// // Post-save hook
// userSchema.post('save', function (doc, next) {
//     console.log('User saved:', doc);
//     next(); // Call next() to finish the middleware chain
// });

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;