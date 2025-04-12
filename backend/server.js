// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import routes
const generateImageRoute = require("./routes/generateImage");
const editImageRoute = require("./routes/editImage");

const app = express();

// Configure CORS
app.use(cors()); // Allow all origins for now

// Add middleware for parsing JSON bodies
app.use(express.json());

// Register routes
app.use("/generate-image", generateImageRoute);
app.use("/edit-image", editImageRoute);

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
