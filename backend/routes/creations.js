// creations.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const { verifyToken } = require("../middleware/auth");

/**
 * POST /creations
 * Add a new creation to the database
 * Protected - requires authentication
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { textprompt, image } = req.body;
    const userId = req.user.uid;

    // Validate request body
    if (!textprompt || !image) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["textprompt", "image"],
      });
    }

    // Insert the creation into the database with user_id
    const { data, error } = await supabase
      .from("creation")
      .insert([{ textprompt, image, user_id: userId }])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({
        error: "Failed to save creation to database",
        details: error.message,
      });
    }

    return res.status(201).json({
      message: "Creation saved successfully",
      creation: data[0],
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

/**
 * GET /creations
 * Get all creations from the database for the authenticated user
 * Protected - requires authentication
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    // Optional query parameters for pagination
    const { page = 1, limit = 10 } = req.query;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Query the database for user's own creations
    const { data, error, count } = await supabase
      .from("creation")
      .select("*", { count: "exact" })
      .eq("user_id", userId) // Filter by user ID
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({
        error: "Failed to fetch creations",
        details: error.message,
      });
    }

    return res.status(200).json({
      creations: data,
      count,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

/**
 * GET /creations/:id
 * Get a specific creation by ID
 * Protected - requires authentication and ownership
 */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    // Query the database and check ownership
    const { data, error } = await supabase
      .from("creation")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId) // Ensure user owns this creation
      .single();

    if (error) {
      // Handle not found separately
      if (error.code === "PGRST116") {
        return res.status(404).json({
          error: "Creation not found or you don't have permission to access it",
        });
      }

      console.error("Supabase error:", error);
      return res.status(500).json({
        error: "Failed to fetch creation",
        details: error.message,
      });
    }

    return res.status(200).json({ creation: data });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

module.exports = router;
