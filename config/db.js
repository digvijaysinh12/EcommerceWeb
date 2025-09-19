/************************************************************
 * DATABASE CONNECTION (MongoDB + Mongoose)
 * ----------------------------------------------------------
 * WHAT IS THIS?
 * - Utility function to connect Node.js backend to MongoDB
 *   using the Mongoose library.
 *
 * WHY DO WE NEED IT?
 * - To establish a persistent connection with the database
 *   before handling API requests.
 * - Ensures data can be read/written in MongoDB collections.
 *
 * WHAT IT DOES?
 * - Uses mongoose.connect() with the MongoDB URI from .env.
 * - Logs success message with host info.
 * - Catches and logs errors if connection fails.
 ************************************************************/

import mongoose from "mongoose";
import colors from "colors"; // For colorful console logs (optional)

// ----------------- CONNECT DATABASE -----------------
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);

    // ✅ Success message with DB host
    console.log(
      `✅ MongoDB Connected: ${conn.connection.host}`.green.bold.bgWhite
    );
  } catch (error) {
    // ❌ Error message with reason
    console.error(`❌ Error connecting to MongoDB: ${error.message}`.red.bold);
    process.exit(1); // Exit process with failure
  }
};

// ----------------- EXPORT -----------------
export default connectDB;

