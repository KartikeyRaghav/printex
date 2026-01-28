import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    durationDays: {
      type: Number,
      required: true
    },

    startsAt: {
      type: Date,
      required: true
    },

    endsAt: {
      type: Date,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Subscription", subscriptionSchema);
