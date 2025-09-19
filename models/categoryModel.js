/************************************************************
 * CATEGORY MODEL (Mongoose Schema)
 * ----------------------------------------------------------
 * WHAT IS THIS?
 * - A schema that defines the structure of categories stored
 *   in MongoDB (e.g., Electronics, Clothing, Books).
 *
 * WHY DO WE NEED IT?
 * - To organize products under specific categories.
 * - To enforce data consistency (unique category names).
 * - To generate a clean "slug" for URLs (SEO friendly).
 *
 * WHAT IT DOES?
 * - Defines category fields (name, slug).
 * - Exports a Mongoose model for CRUD operations.
 ************************************************************/

import mongoose from "mongoose";

// ----------------- CATEGORY SCHEMA -----------------
const categorySchema = new mongoose.Schema(
  {
    // Category name (must be unique)
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true, // removes extra spaces
    },

    // Slug for SEO-friendly URLs (auto-generated from name)
    slug: {
      type: String,
      lowercase: true,
      unique: true, // ensures unique slug for each category
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt fields
  }
);

// ----------------- EXPORT MODEL -----------------
export default mongoose.model("Category", categorySchema);

