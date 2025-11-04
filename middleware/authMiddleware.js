import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

/**
 * =====================================
 * 🔑 AUTH MIDDLEWARE
 * =====================================
 * - requireSignIn → Ensures the user is authenticated via JWT
 * - isAdmin       → Ensures the user has admin privileges
 * =====================================
 */

/**
 * ✅ Middleware: Require Sign In
 * - Verifies JWT from request headers
 * - Attaches decoded user info to `req.user`
 * - Handles expired or invalid tokens
 */
export const requireSignIn = async (req, res, next) => {
  try {
    // Extract token from headers (expected format: "Bearer <token>")
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided. Authorization denied",
      });
    }

    // Verify token
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload (user info) to request
    req.user = decoded;

    next(); // Proceed to next middleware
  } catch (error) {
    console.error("❌ Token verification failed:", error);

    // Handle token expiration
    if (error.name === "TokenExpiredError") {
      return res.status(401).send({
        success: false,
        message: "Session expired. Please login again",
      });
    }

    // Handle other verification errors
    return res.status(401).send({
      success: false,
      message: "Invalid token. Authorization denied",
    });
  }
};

/**
 * ✅ Middleware: Check if User is Admin
 * - Fetches user by ID from DB
 * - Validates if user has admin role
 */
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "Access denied. Admin privileges required",
      });
    }

    next(); // User is admin, proceed
  } catch (error) {
    console.error("❌ Error in isAdmin middleware:", error);

    res.status(500).send({
      success: false,
      message: "Internal server error in admin middleware",
      error,
    });
  }
};
