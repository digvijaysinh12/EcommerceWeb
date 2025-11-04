/************************************************************
 * AUTH ROUTES (Express Router)
 * ----------------------------------------------------------
 * WHAT IS THIS?
 * - Defines all routes related to authentication, authorization,
 *   user profile, and order management.
 *
 * WHY DO WE NEED IT?
 * - To separate route handling from main server file (cleaner code).
 * - To manage user login, registration, password reset, and role-based access.
 *
 * WHAT IT DOES?
 * - Registers users & handles login
 * - Supports password recovery (via OTP)
 * - Provides role-based access (user vs admin)
 * - Allows profile updates
 * - Fetches user orders & admin orders
 * - Updates order status (admin only)
 ************************************************************/

import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrderController,
  sendOTP,
  getAllOrderController,
  orderStatusController,
  getAllUsersController,
  verifyOTP,
} from "../controllers/authController.js";

import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

// ----------------- ROUTER OBJECT -----------------
const router = express.Router();

// ----------------- AUTH ROUTES -----------------

// REGISTER || POST
router.post("/register", registerController);

// SEND OTP (for verification or password reset)
router.post("/send-otp", sendOTP);

// VERIFY OTP (for email verification or password reset)
router.post("/verify-otp", verifyOTP);

// LOGIN || POST
router.post("/login", loginController);

// FORGOT PASSWORD || POST
router.post("/forgot-password", forgotPasswordController);

// ----------------- TEST & AUTH CHECK ROUTES -----------------

// TEST (Protected, Admin only)
router.get("/test", requireSignIn, isAdmin, testController);

// USER AUTH CHECK (Protected route)
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// ADMIN AUTH CHECK (Protected, Admin only)
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// ----------------- USER PROFILE -----------------

// UPDATE PROFILE || PUT
router.put("/profile", requireSignIn, updateProfileController);

// ----------------- ORDERS -----------------

// GET USER ORDERS
router.get("/orders", requireSignIn, getOrderController);

// GET ALL ORDERS (Admin only)
router.get("/all-orders", requireSignIn, isAdmin, getAllOrderController);

// UPDATE ORDER STATUS (Admin only)
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

// GET ALL USERS FOR USERS MANAGEMENT

router.get(
  "/all-users",
  requireSignIn,
  isAdmin,
  getAllUsersController
)
// ----------------- EXPORT ROUTER -----------------
export default router;

