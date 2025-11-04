/************************************************************
 * USER MODEL (Mongoose Schema)
 * ----------------------------------------------------------
 * WHAT IS THIS?
 * - Defines the structure of the "User" document inside MongoDB.
 * - Acts like a blueprint for storing user data in the database.
 *
 * WHY DO WE NEED IT?
 * - To ensure consistent data format (name, email, password, etc.).
 * - To enforce validations (required fields, unique values).
 * - To extend features (timestamps, roles, authentication).
 *
 * WHAT IT DOES?
 * - Creates a schema for User with fields: name, email, password,
 *   phone, address, security question, and role.
 * - Exports a Mongoose model that can be used for CRUD operations.
 ************************************************************/

import mongoose from "mongoose";

// ----------------- USER SCHEMA -----------------
const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: true,
      trim: true, // removes extra spaces
      maxlength:32,
    },

    // User's email (must be unique for login)
    email: {
      type: String,
      required: true,
      trim:true,
      index:{unique:true},
      match:/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      unique: true,
      lowercase: true, // store in lowercase for consistency
    },

    // Encrypted password (never store plain text!)
    password: {
      type: String,
      required: true,
    },

    // Contact number
    phone: {
      type: Number,
      required: true,
    },

    // User's address
    address: {
      type: String,
      required: true,
    },

    // Security question (for password recovery)
    question: {
      type: String,
      required: false,
    },

    // Role → 0 = Normal User, 1 = Admin
    role: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt fields automatically
  }
);

// ----------------- EXPORT MODEL -----------------
export default mongoose.model("User", userSchema);

