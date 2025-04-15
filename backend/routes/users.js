const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const { verifyToken } = require("../middleware/auth");

/**
 * Save user to Supabase
 * This endpoint accepts user data and saves it to Supabase
 * Protected by Firebase auth - requires valid token
 */
router.post("/save-user", verifyToken, async (req, res) => {
  try {
    const { uid, email, displayName } = req.body;

    // Validate input
    if (!uid || !email) {
      return res.status(400).json({ error: "UID and email are required" });
    }

    // Ensure the requesting user can only save their own data
    if (uid !== req.user.uid) {
      return res
        .status(403)
        .json({ error: "Forbidden: You can only save your own user data" });
    }

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("firebase_uid", uid)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" error
      console.error("Error checking for existing user:", fetchError);
      return res
        .status(500)
        .json({ error: "Database error when checking for existing user" });
    }

    let result;
    if (existingUser) {
      // Update existing user
      const { data, error } = await supabase
        .from("users")
        .update({
          email: email,
          display_name: displayName || existingUser.display_name,
          last_sign_in: new Date().toISOString(),
        })
        .eq("firebase_uid", uid)
        .select();

      if (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "Failed to update user" });
      }

      result = data[0];
    } else {
      // Create new user
      const { data, error } = await supabase
        .from("users")
        .insert({
          firebase_uid: uid,
          email: email,
          display_name: displayName || "",
          created_at: new Date().toISOString(),
          last_sign_in: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Failed to create user" });
      }

      result = data[0];
    }

    // Return success response
    res.status(200).json({
      message: existingUser
        ? "User updated successfully"
        : "User created successfully",
      user: result,
    });
  } catch (error) {
    console.error("Error in save-user endpoint:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Get current user profile
 * Returns the user's profile from Supabase
 * Protected by Firebase auth - requires valid token
 */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("firebase_uid", req.user.uid)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return res.status(404).json({ error: "User profile not found" });
    }

    res.status(200).json({ user: data });
  } catch (error) {
    console.error("Error in profile endpoint:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
