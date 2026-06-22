const mongoose = require("mongoose");

/**
 * Sports Equipment Schema
 * English Comment: Blueprint for tracking the inventory of sports equipment available for booking.
 */
const equipmentSchema = mongoose.Schema({
    name: { type: String, required: true },         // Example: "Badminton Racket", "Futsal Court"
    category: { type: String, required: true },     // Example: "Racket", "Court", "Ball"
    quantity: { type: Number, required: true },     // Total units available in storage
    status: { type: String, default: "Available" }  // Available, Maintenance, or Out of Stock
}, {
    versionKey: false
});

const Equipmentmodel = mongoose.model("equipment", equipmentSchema);

module.exports = { Equipmentmodel };