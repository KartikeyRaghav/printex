import Subscription from "../models/Subscription.js";
import User from "../models/User.js";

export const activateSubscription = async (req, res) => {
  try {
    const { planName, price, durationDays } = req.body;
    const userId = req.user.userId;

    const startsAt = new Date();
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + durationDays);

    const subscription = await Subscription.create({
      planName,
      price,
      durationDays,
      startsAt,
      endsAt
    });

    await User.findByIdAndUpdate(userId, {
      subscriptionId: subscription._id
    });

    res.json({
      message: "Subscription activated",
      endsAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
