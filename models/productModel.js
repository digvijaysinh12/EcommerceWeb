/************************************************************
 * PRODUCT MODEL (Mongoose Schema)
 * ----------------------------------------------------------
 * WHAT IS THIS?
 * - Schema that defines the structure of products stored
 *   in MongoDB (e.g., Mobile Phones, Laptops, Clothes).
 *
 * WHY DO WE NEED IT?
 * - To organize product details (name, price, category, etc.).
 * - To establish a relationship between products and categories.
 * - To store product images, stock, and shipping info.
 *
 * WHAT IT DOES?
 * - Defines fields for product data (name, description, price, etc.).
 * - References Category model for product categorization.
 * - Stores product photo using Buffer.
 * - Exports a Product model for CRUD operations.
 ************************************************************/

import mongoose from "mongoose";

// ----------------- PRODUCT SCHEMA -----------------
const productSchema = new mongoose.Schema(
  {
    // Product name (must be provided)
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Slug for SEO-friendly URLs
    slug: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },

    // Product description
    description: {
      type: String,
      required: true,
    },

    // Product price
    price: {
      type: Number,
      required: true,
    },

    // Link product with its category (One-to-Many)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Reference to Category model
      required: true,
    },

    // Product photo (stored as binary data)
    photo: {
      data: Buffer,
      contentType: String,
      // NOTE: For handling uploads, use "express-formidable" or Multer.
    },

    // Shipping availability
    shipping: {
      type: Boolean,
      default: false,
    },

    // Stock quantity
    quantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt auto fields
  }
);

// ----------------- EXPORT MODEL -----------------
export default mongoose.model("Product", productSchema);

