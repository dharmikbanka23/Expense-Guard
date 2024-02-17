const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    
    console.log('Connecting to database...');
    const url = process.env.MONGODB_URI;

    try {
        await mongoose.connect(url);
        console.log('Database connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }

    const dbConnection = mongoose.connection;

    dbConnection.once("open", () => {
        console.log('Database connected');
    });

    dbConnection.on("error", (err) => {
        console.error('Connection error:', err);
        return;
    });
};

module.exports = connectDB;