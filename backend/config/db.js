const mongoose = require("mongoose");

// English Comment: Hardcoded local MongoDB connection string to guarantee connectivity during development
const strictLocalURI = 'mongodb://127.0.0.1:27017/ezsport';

/**
 * Direct connection to local MongoDB database.
 * Bypasses process.env to ensure the URI string is never undefined.
 */
const connection = mongoose.connect(strictLocalURI)
    .then(() => console.log("Database connection established successfully to local EZSport DB."))
    .catch((err) => console.error("Database connection failed:", err.message));

module.exports = {
    connection
};