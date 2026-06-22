const express = require("express");
const equipmentRouter = express.Router();

/**
 * GET /equipment
 * English Comment: Fetch all available sports equipment from the system.
 */
equipmentRouter.get("/", async (req, res) => {
    try {
        // Temporary mock data before connecting to real MongoDB Schema
        const sampleEquipment = [
            { id: "1", name: "Badminton Racket", category: "Badminton", status: "Available" },
            { id: "2", name: "Volleyball Net", category: "Volleyball", status: "Available" },
            { id: "3", name: "Soccer Ball", category: "Soccer", status: "Available" },
            { id: "4", name: "Volleyball Ball", category: "Volleyball", status: "Unavailable" }
        ];
        res.status(200).json(sampleEquipment);
    } catch (error) {
        res.status(500).json({ message: "Error fetching equipment data", error: error.message });
    }
});

/**
 * POST /equipment/add
 * English Comment: Add a new sports equipment into the system inventory.
 */
equipmentRouter.post("/add", async (req, res) => {
    try {
        const { name, category, quantity } = req.body;
        
        // Log to terminal for debugging purposes
        console.log(`Adding new item: ${name}`);

        res.status(201).json({ 
            message: "Equipment added successfully!", 
            data: { name, category, quantity } 
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to add equipment", error: error.message });
    }
});

module.exports = { equipmentRouter };