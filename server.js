/************************************************************
 * E-COMMERCE BACKEND SERVER (Express + MongoDB)
 * ----------------------------------------------------------
 * This file serves as the main entry point of the backend
 * application for the E-Commerce platform.
 *
 * WHY WE NEED THIS FILE?
 * - Centralized configuration for server, database, routes.
 * - Connects to MongoDB and initializes API endpoints.
 *
 * WHAT IT DOES?
 * - Initializes Express app
 * - Loads environment variables
 * - Uses middlewares (CORS, Morgan, JSON parser)
 * - Mounts API routes (Auth, Category, Product)
 * - Starts the server
 ************************************************************/

// ----------------- IMPORT DEPENDENCIES -----------------
import express from "express";
import dotenv from "dotenv";          // To load environment variables
import morgan from "morgan";          // For HTTP request logging
import cors from "cors";              // To handle cross-origin requests

// ----------------- CUSTOM MODULES -----------------
import connectDB from "./config/db.js";             // MongoDB connection setup
import authRoute from "./routes/authRoute.js";      // Authentication routes
import categoryRoutes from "./routes/categoryRoutes.js"; // Category routes
import productRoutes from "./routes/productRoutes.js";   // Product routes

// ----------------- CONFIGURATION -----------------
dotenv.config(); // Load environment variables from .env

// Connect to the database
connectDB();

// Create express app instance
const app = express();

// ----------------- MIDDLEWARE -----------------
app.use(
  cors({
    origin: process.env.CLIENT_URL, // ✅ dynamically from .env
    credentials: true,              // allow cookies if needed
  })
);

app.use(express.json()); // Parse incoming JSON requests
app.use(morgan("dev"));  // Log HTTP requests

// ----------------- ROUTES -----------------
app.use("/api/v1/auth", authRoute);          // Authentication APIs
app.use("/api/v1/category", categoryRoutes); // Category APIs
app.use("/api/v1/product", productRoutes);   // Product APIs

// Default test route
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Ecommerce App Backend</h1>");
});

// ----------------- SERVER SETUP -----------------
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `✅ Server running in ${process.env.DEV_MODE} mode on port ${PORT}`
  );
});

