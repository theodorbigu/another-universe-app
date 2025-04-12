// creations.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

/**
 * POST /creations
 * Add a new creation to the database
 */
router.post("/", async (req, res) => {
  try {
    const { textprompt, image } = req.body;

    // Validate request body
    if (!textprompt || !image) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["textprompt", "image"],
      });
    }

    // Insert the creation into the database
    const { data, error } = await supabase
      .from("creation")
      .insert([{ textprompt, image }])
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
 * Get all creations from the database
 */
router.get("/", async (req, res) => {
  try {
    // Optional query parameters for pagination
    const { page = 1, limit = 10 } = req.query;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Query the database
    const { data, error, count } = await supabase
      .from("creation")
      .select("*", { count: "exact" })
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
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Query the database
    const { data, error } = await supabase
      .from("creation")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      // Handle not found separately
      if (error.code === "PGRST116") {
        return res.status(404).json({
          error: "Creation not found",
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
