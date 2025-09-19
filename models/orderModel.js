/************************************************************
 * ORDER MODEL (Mongoose Schema)
 * ----------------------------------------------------------
 * WHAT IS THIS?
 * - Schema that defines the structure of customer orders
 *   in MongoDB (products, payment, buyer, status).
 *
 * WHY DO WE NEED IT?
 * - To track what products customers buy.
 * - To manage order lifecycle (Processing → Shipped → Delivered).
 * - To link buyers and products with payments.
 *
 * WHAT IT DOES?
 * - Stores ordered products (with reference to Product model).
 * - Keeps payment details (from Stripe, Razorpay, PayPal, etc.).
 * - Links buyer (User model reference).
 * - Maintains order status with controlled values (enum).
 ************************************************************/

import mongoose from "mongoose";

// ----------------- ORDER SCHEMA -----------------
const orderSchema = new mongoose.Schema(
  {
    // List of ordered products
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to Product model
        required: true,
      },
    ],

    // Payment information (flexible object for different gateways)
    payment: {
      type: Object,
      required: true,
    },

    // Buyer details (User reference)
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },

    // Current status of the order
    status: {
      type: String,
      default: "Not Processed",
      enum: ["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"],
    },
  },
  {
    timestamps: true, // Auto adds createdAt & updatedAt
  }
);

// ----------------- EXPORT MODEL -----------------
export default mongoose.model("Order", orderSchema);

