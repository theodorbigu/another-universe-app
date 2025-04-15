// Authentication middleware to verify Firebase ID tokens
const admin = require("../firebaseAdmin");

/**
 * Middleware to verify Firebase ID token
 * Extracts token from Authorization header, verifies it, and adds user info to req.user
 */
const verifyToken = async (req, res, next) => {
  try {
    // Get the ID token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Extract the token
    const idToken = authHeader.split("Bearer ")[1];

    // Verify the token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Attach the user info to the request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      name: decodedToken.name,
      picture: decodedToken.picture,
    };

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error verifying token:", error);

    // Handle different error types
    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({ error: "Unauthorized: Token expired" });
    } else if (error.code === "auth/id-token-revoked") {
      return res.status(401).json({ error: "Unauthorized: Token revoked" });
    } else {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  }
};

/**
 * Optional auth middleware - doesn't require auth but attaches user if token is valid
 * Useful for routes that can work for both authenticated and unauthenticated users
 */
const optionalAuth = async (req, res, next) => {
  try {
    // Get the ID token from the Authorization header
    const authHeader = req.headers.authorization;

    // If no header, continue without authentication
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    // Extract the token
    const idToken = authHeader.split("Bearer ")[1];

    // Verify the token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Attach the user info to the request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      name: decodedToken.name,
      picture: decodedToken.picture,
    };

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // If token validation fails, continue as unauthenticated
    req.user = null;
    next();
  }
};

module.exports = { verifyToken, optionalAuth };
