const mongoose = require("mongoose");

/**
 * Equipment Booking Schema
 * English Comment: Schema blueprint for tracking sports equipment bookings and checking slot availability.
 */
const bookingSchema = mongoose.Schema({
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    equipmentId: { type: String, required: true }, // Tied to specific sports equipment (e.g., Badminton Racket, Court)
    bookingDate: { type: String, required: true }, // Format: YYYY-MM-DD
    bookingSlot: { type: String, required: true }  // Example slot: "10:00 AM - 12:00 PM"
}, {
    versionKey: false
});

const Bookingmodel = mongoose.model("booking", bookingSchema);

module.exports = { Bookingmodel };