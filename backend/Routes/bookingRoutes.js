const express = require("express");
const { Bookingmodel } = require("../models/bookingModel");
const { authenticate } = require("../middlewares/authenticateMiddleware");

const bookingRoutes = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

// Getting all booking data
bookingRoutes.get("/", async (req, res) => {
    try {
        const reqData = await Bookingmodel.find();
        res.json({ msg: "All booking data", bookingData: reqData });
    } catch (error) {
        console.log("Error getting all booking data:", error.message);
        res.json({ msg: "Error in getting all booking data", errorMsg: error.message });
    }
});

// Getting particular user booking data
bookingRoutes.get("/userId", authenticate, async (req, res) => {
    let userId = req.body.userId;
    try {
        const reqData = await Bookingmodel.find({ userId });
        res.json({ msg: `All booking data of userId ${userId}`, Data: reqData });
    } catch (error) {
        console.log("Error getting user booking data:", error.message);
        res.json({ msg: "Error in getting user booking data", errorMsg: error.message });
    }
});

// Getting particular equipment booking data (Changed from trainerId)
bookingRoutes.get("/:equipmentId", async (req, res) => {
    let equipmentId = req.params.equipmentId;
    try {
        const reqData = await Bookingmodel.find({ equipmentId });
        res.json({ msg: `All booking data of equipmentId ${equipmentId}`, Data: reqData });
    } catch (error) {
        console.log("Error getting equipment booking data:", error.message);
        res.json({ msg: "Error in getting equipment booking data", errorMsg: error.message });
    }
});

// Create new equipment booking
bookingRoutes.post("/create", authenticate, async (req, res) => {
    const data = req.body;
    try {
        // English Comment: Check slot availability based on equipmentId instead of trainerId
        let allBookings = await Bookingmodel.find({ equipmentId: data.equipmentId });
        
        for (let i = 0; i < allBookings.length; i++) {
            if (allBookings[i].bookingDate === data.bookingDate) {
                if (allBookings[i].bookingSlot === data.bookingSlot) {
                    res.json({ "msg": "This Slot is Not Available for this equipment." });
                    return;
                }
            }
        }
        
        const addData = new Bookingmodel(data);
        await addData.save();

        // Email Notification System Setup
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.emailUser || 'ajitkhatua286@gmail.com', // Best practice to use env
                pass: process.env.emailpassword
            }
        });

        const mailOptions = {
            from: process.env.emailUser || 'ajitkhatua286@gmail.com',
            to: `${data.userEmail}`,
            subject: 'Booking Confirmation from EZSport System', // Changed from Rapid Fit to EZSport
            text: `Hi student, your equipment booking is confirmed for ${data.bookingDate} during the ${data.bookingSlot} slot. Thank you for using EZSport!`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Error while sending confirmation email' });
            } else {
                return res.status(200).json({ message: 'Confirmation sent to email', msg: "New booking created successfully" });
            }
        });

    } catch (error) {
        console.log("Error adding new booking data:", error.message);
        res.json({ msg: "Error in adding new booking data", errorMsg: error.message });
    }
});

// Edit booking data
bookingRoutes.patch("/edit/:id", async (req, res) => {
    const ID = req.params.id;
    const data = req.body;
    try {
        await Bookingmodel.findByIdAndUpdate({ _id: ID }, data);
        res.json({ msg: `Booking ID ${ID} updated successfully` });
    } catch (error) {
        console.log("Error editing booking data:", error.message);
        res.json({ msg: "Error updating booking data", errorMsg: error.message });
    }
});

// Removing booking data
bookingRoutes.delete("/remove/:id", authenticate, async (req, res) => {
    const ID = req.params.id;
    try {
        await Bookingmodel.findByIdAndDelete({ _id: ID });
        res.json({ msg: `Booking ID ${ID} deleted successfully` });
    } catch (error) {
        console.log("Error deleting booking data:", error.message);
        res.json({ msg: "Error deleting booking data", errorMsg: error.message });
    }
});

module.exports = { bookingRoutes };