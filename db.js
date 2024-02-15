const mongoose = require('mongoose');

const connectDB = async () => {
    const url = "mongodb+srv://dharmikbanka23:Wupf02cDZ1SG0xjh@cluster0.qx1ehfm.mongodb.net/expense_tracker?retryWrites=true&w=majority";

    //{ useNewUrlParser: true, useUnifiedTopology: true }
    try {
        await mongoose.connect(url);
        console.log('Database connected:', url);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }

    const dbConnection = mongoose.connection;

    dbConnection.once("open", () => {
        console.log('Database connected:', url);
    });

    dbConnection.on("error", (err) => {
        console.error('Connection error:', err);
        return;
    });
};

module.exports = connectDB;