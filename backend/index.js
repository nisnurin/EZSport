const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db");
const { trainerRouter } = require("./Routes/trainer.route");
const { bookingRoutes } = require("./Routes/bookingRoutes");
const { signupRoute } = require("./Routes/signupRoute");

// Initialize environment variables configuration
require("dotenv").config();

const app = express();

// Enable Cross-Origin Resource Sharing (CORS) for all origins
app.use(cors({
    origin: "*"
}));

// Middleware to parse incoming JSON requests
app.use(express.json());

/**
 * API Routes Definition
 * English Comment: Mounting different routers to handle authentication, trainer/services, and booking actions.
 */
app.use("/user", signupRoute);
app.use("/trainer", trainerRouter);
app.use("/booking", bookingRoutes);

// Define a safe fallback port if process.env.port is not reading correctly
const PORT = process.env.port || 5000;

/**
 * Start the Express Application Server
 * English Comment: Listens for connections on port 5000 and confirms database connection readiness.
 */
app.listen(PORT, async () => {
    try {
        // Resolve the connection promise from db.js before confirming server readiness
        await connection;
        console.log("Connected to DB successfully.");
    } catch (error) {
        console.error("Critical Error: Failed to connect to the database on startup.", error);
    }
    // Explicitly logging the fallback port to prevent "undefined" terminal printouts
    console.log(`Server is running at http://localhost:${PORT}`);
});