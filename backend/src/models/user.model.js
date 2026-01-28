import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    mobile: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    trialEndsAt: {
      type: Date,
      required: true
    },

    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    },

    maxDevices: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model("User", userSchema);
