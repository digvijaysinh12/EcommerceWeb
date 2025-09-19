import bcrypt from "bcrypt";

/**
 * =====================================
 * 🔐 PASSWORD HELPER FUNCTIONS
 * =====================================
 * - hashPassword    → Hashes plain text passwords using bcrypt
 * - comparePassword → Compares plain text with a hashed password
 * =====================================
 */

/**
 * ✅ Hash Password
 * - Takes plain text password
 * - Returns securely hashed password
 * - Uses bcrypt with a salt round (default: 10)
 */
export const hashPassword = async (password) => {
  try {
    const saltRounds = 10; // Number of salt rounds (higher = more secure but slower)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("❌ Error hashing password:", error);
    throw new Error("Password hashing failed");
  }
};

/**
 * ✅ Compare Passwords
 * - Compares plain text password with stored hashed password
 * - Returns true if they match, false otherwise
 */
export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("❌ Error comparing passwords:", error);
    throw new Error("Password comparison failed");
  }
};
