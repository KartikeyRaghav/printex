// File: server/routes/auth.js

import { Router } from "express";
import { genSalt, hash, compare } from "bcryptjs";
import pkg from "jsonwebtoken";
import User from "../models/user.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();
const { sign } = pkg;
// --- REGISTRATION ROUTE (UPDATED FOR TRIAL) ---
router.post("/register", async (req, res) => {
  // Trim potential whitespace from inputs
  const email = req.body.email ? req.body.email.trim().toLowerCase() : "";
  const password = req.body.password ? req.body.password.trim() : "";

  if (!email || !password) {
    return res.status(400).json({ msg: "Please provide email and password" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: "Password must be at least 6 characters" });
  }

  try {
    let user = await User.findOne({ email }); // Already searching lowercase
    if (user) {
      console.log(
        `Registration attempt failed: Email ${email} already exists.`
      );
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({ email, password });
    user.trialEndsAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const salt = await genSalt(10);
    user.password = await hash(password, salt); // Hash the trimmed password
    await user.save();
    console.log(`User registered successfully: ${email}`);

    const payload = { user: { id: user.id } };
    sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error("Registration Server Error:", err.message);
    res.status(500).send("Server Error");
  }
});

// --- LOGIN ROUTE (WITH DETAILED LOGGING & TRIMMING) ---
router.post("/login", async (req, res) => {
  // Trim potential whitespace from inputs
  const email = req.body.email ? req.body.email.trim().toLowerCase() : "";
  const password = req.body.password ? req.body.password.trim() : "";

  if (!email || !password) {
    return res.status(400).json({ msg: "Please provide email and password" });
  }

  console.log(`--- Login attempt received ---`);
  console.log(`Received Email: '${email}'`);
  console.log(`Received Password Length: ${password.length}`); // Log length

  try {
    // Find user by lowercase email
    let user = await User.findOne({ email });
    if (!user) {
      console.log(`Login Failed: User not found for email '${email}'.`);
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    console.log(`User found in DB: ${user.email}`);
    console.log(`Stored Hashed Password: ${user.password}`); // Log the hash

    // Compare the provided trimmed password with the stored hashed password
    console.log(
      `Attempting bcrypt.compare with received password (length ${password.length})...`
    );
    const isMatch = await compare(password, user.password);
    console.log(`bcrypt.compare result: ${isMatch}`); // Log the true/false result

    if (!isMatch) {
      console.log(`Login Failed: Password does not match for user ${email}.`);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Passwords match! Create and return a JWT
    console.log(
      `Login Success: Passwords matched for user ${email}. Creating token...`
    );
    const payload = { user: { id: user.id } };
    sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) {
          console.error("JWT Signing Error:", err); // Log JWT specific errors
          throw err; // Re-throw to be caught by outer catch block
        }
        console.log(`Token created successfully for user ${email}.`);
        res.json({ token });
      }
    );
  } catch (err) {
    console.error("Login Server Error:", err.message); // Log any unexpected errors
    res.status(500).send("Server Error");
  }
});

// --- GET CURRENT USER ROUTE ---
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("company");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get /me Error:", err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
