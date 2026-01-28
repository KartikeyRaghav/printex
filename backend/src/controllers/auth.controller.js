import bcrypt from "bcrypt";
import User from "../models/User.js";
import Device from "../models/Device.js";
import AuthSession from "../models/AuthSession.js";
import Subscription from "../models/Subscription.js";
import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/jwt.js";
import { hashDevice } from "../utils/deviceFingerprint.js";

/* ===========================
   SIGNUP
=========================== */
export const signup = async (req, res) => {
  try {
    const { username, email, mobile, password } = req.body;

    const exists = await User.findOne({
      $or: [{ email }, { mobile }]
    });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 1);

    const user = await User.create({
      username,
      email,
      mobile,
      passwordHash,
      trialEndsAt
    });

    res.status(201).json({
      message: "Signup successful",
      trialEndsAt: user.trialEndsAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===========================
   LOGIN
=========================== */
export const login = async (req, res) => {
  try {
    const { email, password, deviceFingerprint, deviceName } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Device limiting
    const hashedDeviceId = hashDevice(deviceFingerprint);
    const existingDevice = await Device.findOne({
      userId: user._id,
      deviceId: hashedDeviceId
    });

    const deviceCount = await Device.countDocuments({ userId: user._id });

    if (!existingDevice && deviceCount >= user.maxDevices) {
      return res
        .status(403)
        .json({ message: "Device limit reached" });
    }

    if (!existingDevice) {
      await Device.create({
        userId: user._id,
        deviceId: hashedDeviceId,
        deviceName
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await AuthSession.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.json({
      accessToken,
      refreshToken
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===========================
   REFRESH TOKEN
=========================== */
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const session = await AuthSession.findOne({ refreshToken });
    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(session.userId);

    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===========================
   LOGOUT
=========================== */
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await AuthSession.deleteOne({ refreshToken });
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
