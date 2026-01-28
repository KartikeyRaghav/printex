import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    deviceId: {
      type: String,
      required: true
    },

    deviceName: {
      type: String
    },

    lastUsedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Prevent same device being added twice for same user
deviceSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

export default mongoose.model("Device", deviceSchema);
