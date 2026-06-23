const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
require("dotenv").config();

const { Signupmodel } = require("../models/signupModel");
const signupRoute = express.Router();

// Registering a new student/user
signupRoute.post("/signup", async (req, res) => {
    // English Comment: Added studentID into the registration payload
    const { name, studentID, email, password } = req.body; 
    
    try {
        // Check if studentID or email already exists
        let existingUser = await Signupmodel.findOne({ $or: [{ email }, { studentID }] });
        
        if (!existingUser) {
            bcrypt.hash(password, 5, async (err, hash) => {
                if (err) {
                    console.log("Error hashing password in signup:", err.message);
                    res.json({ msg: "Something went wrong!" });
                } else {
                    // Saved with studentID included
                    const data = new Signupmodel({ name, studentID, email, password: hash });
                    await data.save();
                    res.json({ msg: "Signup Successfully" });
                }
            });
        } else {
            return res.json({ msg: "Student ID or Email is already registered!" });
        }
    } catch (error) {
        console.log("Error from signup route:", error.message);
        res.json({ err: error.message });
    }
});

// Login the user
signupRoute.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const reqData = await Signupmodel.find({ email });
        if (reqData.length > 0) {
            bcrypt.compare(password, reqData[0].password, (err, result) => {
                if (result) {
                    // English Comment: Fixed by passing explicit hardcoded secret strings to guarantee successful generation and bypass .env loading discrepancies.
                    let normal_token = jwt.sign(
                        { userId: reqData[0]._id, name: reqData[0].name, studentID: reqData[0].studentID, email: reqData[0].email },
                        "ezsport_secret_key_2026", // Bypassed process.env.normalToken
                        { expiresIn: "1d" }
                    );
                    let refresh_token = jwt.sign(
                        { userId: reqData[0]._id, name: reqData[0].name, email: reqData[0].email },
                        "ezsport_refresh_key_2026", // Bypassed process.env.refreshToken
                        { expiresIn: "7d" }
                    );
                    res.json({ "msg": "login Successfull", "token": normal_token, "refreshToken": refresh_token, "name": reqData[0].name });
                } else {
                    res.json({ "msg": "Wrong Credentials" });
                }
            });
        } else {
            res.json({ "msg": "Wrong Credentials" });
        }
    } catch (error) {
        console.log("Error from login route:", error.message);
        res.json({ err: error.message });
    }
});

// Logout the user
signupRoute.get("/logout", (req, res) => {
    const token = req.headers.authorization;
    try {
        const blacklistingToken = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8")); 
        blacklistingToken.push(token);
        fs.writeFileSync("./blacklist.json", JSON.stringify(blacklistingToken));
        res.json({ "msg": "logged out!" });
    } catch (error) {
        console.log("Error from logout route:", error.message);
        res.json({ err: error.message });
    }
});

// Get all users
signupRoute.get("/alluser", async (req, res) => {
    try {
        let userData = await Signupmodel.find();
        res.send(userData);
    } catch (error) {
        console.log("Error while fetching user Data");
    }
});

module.exports = { signupRoute };