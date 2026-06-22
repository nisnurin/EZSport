const mongoose = require("mongoose");

/**
 * Student Registration Schema
 * English Comment: Blueprint for storing student credentials, including the mandatory Student ID/Matrix Card.
 */
const signupSchema = mongoose.Schema({
    name: { type: String, required: true },
    studentID: { type: String, required: true, unique: true }, // Unique identifier for each student
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {
    versionKey: false
});

const Signupmodel = mongoose.model("user", signupSchema);

module.exports = { Signupmodel };