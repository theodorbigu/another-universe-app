// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import routes
const generateImageRoute = require("./routes/generateImage");
const editImageRoute = require("./routes/editImage");
const creationsRoute = require("./routes/creations");
const usersRoute = require("./routes/users");
const paymentsRoute = require("./routes/payments");

const app = express();

// Configure CORS
app.use(cors()); // Allow all origins for now

// Use the raw body parser middleware for Stripe webhook endpoint
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// Add middleware for parsing JSON bodies for other routes
app.use(express.json());

// Register routes
app.use("/generate-image", generateImageRoute);
app.use("/edit-image", editImageRoute);
app.use("/creations", creationsRoute);
app.use("/api", usersRoute); // User routes under /api prefix
app.use("/api/payments", paymentsRoute); // Payment routes under /api/payments prefix

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
