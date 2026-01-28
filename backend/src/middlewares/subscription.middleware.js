import User from "../models/User.js";
import Subscription from "../models/Subscription.js";

export const requireActiveSubscription = async (req, res, next) => {
  const user = await User.findById(req.user.userId).populate("subscriptionId");

  const now = new Date();

  const hasAccess =
    now < user.trialEndsAt ||
    (user.subscriptionId &&
      user.subscriptionId.endsAt > now &&
      user.subscriptionId.isActive);

  if (!hasAccess) {
    return res.status(403).json({ message: "Subscription required" });
  }

  next();
};
